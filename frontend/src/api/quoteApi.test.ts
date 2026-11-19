import { it, expect, vi, afterEach } from 'vitest';
import client from './client';
import { quoteApi } from './quoteApi';
afterEach(()=>vi.restoreAllMocks());
it('uses the explicit production-start endpoint and preserves award payloads',async()=>{
  const patch=vi.spyOn(client,'patch').mockResolvedValue({data:{id:'quote',status:'IN_PRODUCTION'}});
  await quoteApi.startProduction('quote');expect(patch).toHaveBeenCalledWith('/quotes/quote/start-production');
  const parts=[{bidId:'one',quantity:60},{bidId:'two',quantity:40}];
  const post=vi.spyOn(client,'post').mockResolvedValue({data:[]});
  await quoteApi.acceptAllocations('quote',parts);expect(post).toHaveBeenCalledWith('/quotes/quote/accept-allocations',parts);
});
it('reads the backend allocation-progress endpoint',async()=>{
  const get=vi.spyOn(client,'get').mockResolvedValue({data:{overallStatus:'CLOSED'}});
  expect(await quoteApi.progress('quote')).toEqual({overallStatus:'CLOSED'});
  expect(get).toHaveBeenCalledWith('/quotes/quote/allocation-progress');
});
