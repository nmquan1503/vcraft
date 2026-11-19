import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import client from './client';
import { getRefreshToken, getAccessToken, setTokens } from '../utils/tokenStorage';
const values=new Map<string,string>();
const location={pathname:'/quote',search:'',assign:vi.fn()};
beforeEach(()=>{
  values.clear();location.assign.mockClear();
  vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)});
  vi.stubGlobal('window',{location,dispatchEvent:vi.fn()});
  client.defaults.adapter=async(config:InternalAxiosRequestConfig)=>{
    const response={status:200,statusText:'OK',headers:{},config,data:{ok:true}};
    if(config.headers.Authorization?.toString().includes('expired')) {
      throw new AxiosError('Expired','401',config,{}, {...response,status:401});
    }
    return response;
  };
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('real backend token rotation',()=>{
  it('single-flights concurrent 401s and saves both rotated tokens for the next refresh',async()=>{
    setTokens({accessToken:'expired-1',refreshToken:'refresh-1'});
    const refresh=vi.spyOn(axios,'post').mockImplementationOnce(async()=>{await new Promise(resolve=>setTimeout(resolve,10));return {data:{accessToken:'valid-2',refreshToken:'refresh-2'}};})
      .mockResolvedValueOnce({data:{accessToken:'valid-3',refreshToken:'refresh-3'}});
    await Promise.all([client.get('/products'),client.get('/categories')]);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe('valid-2');expect(getRefreshToken()).toBe('refresh-2');
    setTokens({accessToken:'expired-2'});
    await client.get('/products');
    expect(refresh.mock.calls[1][1]).toEqual({refreshToken:'refresh-2'});
    expect(getRefreshToken()).toBe('refresh-3');
  });
  it('clears the session when refresh fails',async()=>{
    setTokens({accessToken:'expired',refreshToken:'revoked'});
    vi.spyOn(axios,'post').mockRejectedValue(new Error('revoked'));
    await expect(client.get('/quotes')).rejects.toBeInstanceOf(AxiosError);
    expect(getAccessToken()).toBeNull();expect(getRefreshToken()).toBeNull();
    expect(location.assign).toHaveBeenCalledWith('/login?redirect=%2Fquote');
  });
  it('does not attempt refresh for a rejected login',async()=>{
    const refresh=vi.spyOn(axios,'post');setTokens({accessToken:'expired',refreshToken:'old'});
    await expect(client.post('/auth/login',{})).rejects.toBeInstanceOf(AxiosError);
    expect(refresh).not.toHaveBeenCalled();
  });
  it('uses the same-origin API proxy by default',()=>{
    expect(client.defaults.baseURL).toBe('/api/v1');
    expect(new AxiosHeaders()).toBeDefined();
  });
});
