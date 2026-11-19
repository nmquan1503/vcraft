import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
let api:APIRequestContext;
const password='Integration123!';
async function call(method:string,path:string,data?:unknown,token?:string) {
  const response=await api.fetch('/api/v1'+path,{method,data,headers:token?{Authorization:`Bearer ${token}`}:{}});
  expect(response.ok(),`${method} ${path}: ${response.status()} ${await response.text()}`).toBeTruthy();
  return response.json();
}
async function login(page:Page,email:string,credential=password) {
  await page.goto('/login');await page.getByLabel('Email',{exact:true}).fill(email);
  await page.getByLabel('Mật khẩu',{exact:true}).fill(credential);
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
  await expect(page).not.toHaveURL(/\/login/);
}
async function fixtures() {
  const uid=randomUUID().slice(0,8),email=`buyer-${uid}@example.com`,artisanEmail=`artisan-${uid}@example.com`;
  const admin=await call('POST','/auth/login',{email:'admin@vcraft.vn',password:'uet123456'});
  const buyer=await call('POST','/auth/register/buyer',{name:'Buyer '+uid,email,password});
  const artisan=await call('POST','/auth/register/artisan',{workshopName:'Xưởng E2E '+uid,ownerName:'E2E Artisan',email:artisanEmail,password,address:'Bát Tràng',lat:20.97,lng:105.91});
  await call('PATCH',`/admin/artisans/${artisan.id}/approve`,undefined,admin.accessToken);
  const artisanAuth=await call('POST','/auth/login',{email:artisanEmail,password});
  await call('PATCH','/artisans/me/open-status',{openStatus:true},artisanAuth.accessToken);
  const batch=await call('POST','/batches',{name:'Lô E2E '+uid,description:'Câu chuyện E2E',quantity:100},artisanAuth.accessToken);
  await call('POST',`/batches/${batch.id}/logs`,{stage:'Nung lò',note:'Minh chứng thật qua API'},artisanAuth.accessToken);
  const categories=await call('GET','/categories');
  const product=await call('POST','/products',{name:'Cốc E2E '+uid,description:'Sản phẩm từ PostgreSQL',price:25000,stock:100,batchId:batch.id,categoryId:categories[0].id},artisanAuth.accessToken);
  return {uid,email,artisanEmail,admin,buyer,artisan,artisanAuth,batch,product,categories};
}
test.beforeAll(async({playwright})=>{api=await playwright.request.newContext({baseURL:process.env.E2E_API_URL||'http://localhost:8080'});});
test.afterAll(async()=>{await api.dispose();});

test('public products, trace and map read real PostgreSQL data',async({page})=>{
  const f=await fixtures();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/products/'+f.product.id);await expect(page.getByRole('heading',{name:f.product.name,exact:true})).toBeVisible();
  await page.goto('/trace/'+f.batch.id);await expect(page.getByText(f.batch.name,{exact:true}).first()).toBeVisible();
  await expect(page.getByText('Minh chứng thật qua API',{exact:true})).toBeVisible();
  await page.goto('/map');await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible();
  await page.getByRole('button',{name:'Chỉ xưởng mở',exact:true}).click();
  await expect(page.getByText(f.artisan.workshopName,{exact:true}).first()).toBeVisible();
  await page.setViewportSize({width:390,height:844});await page.goto('/products');
  await expect(page.getByText(f.product.name,{exact:true}).first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('buyer creates a request, artisan bids, buyer accepts, artisan starts and delivers',async({page,browser})=>{
  const f=await fixtures();await login(page,f.email);
  await page.goto('/quote/new');await page.getByLabel('Tiêu đề *',{exact:true}).fill('Đơn E2E '+f.uid);
  await page.getByLabel('Mô tả chi tiết',{exact:true}).fill('100 cốc in logo');
  await page.getByLabel('Danh mục *',{exact:true}).selectOption(f.categories[0].id);
  await page.getByLabel('Hạn hoàn thành *',{exact:true}).fill('2027-12-31');
  await page.getByLabel('Số lượng *',{exact:true}).fill('100');
  await page.getByRole('checkbox',{name:new RegExp(f.artisan.workshopName)}).check();
  await page.getByRole('button',{name:'Gửi yêu cầu',exact:true}).click();
  await expect(page).toHaveURL(/\/quote\/[0-9a-f-]+$/);const quoteId=page.url().split('/').pop()!;
  const context=await browser.newContext();const workshop=await context.newPage();await login(workshop,f.artisanEmail);
  await workshop.goto('/quote/'+quoteId);await workshop.getByRole('button',{name:'Đặt chào giá',exact:true}).click();
  await workshop.getByLabel('Đơn giá (VNĐ) *',{exact:true}).fill('25000');
  await workshop.getByLabel('Thời gian (ngày) *',{exact:true}).fill('10');
  await workshop.getByRole('button',{name:/Gửi chào giá/}).click();
  await expect(workshop.getByText('Chào giá của bạn',{exact:true})).toBeVisible();
  await page.reload();page.on('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Chấp nhận',exact:true}).click();
  await expect(page.getByText('Đã chấp nhận',{exact:true}).first()).toBeVisible();
  await workshop.reload();await workshop.getByRole('button',{name:'Bắt đầu sản xuất',exact:true}).click();
  await expect(workshop.getByRole('button',{name:'Đánh dấu đã giao hàng',exact:true})).toBeVisible();
  workshop.on('dialog',dialog=>dialog.accept());await workshop.getByRole('button',{name:'Đánh dấu đã giao hàng',exact:true}).click();
  await page.reload();await page.getByRole('button',{name:'Xác nhận đã nhận hàng',exact:true}).click();
  await expect(page.getByText('Đã đóng',{exact:true})).toBeVisible();
  const detail=await call('GET','/quotes/'+quoteId,undefined,f.buyer.accessToken);expect(detail.quote.status).toBe('CLOSED');
  await context.close();
});

test('rotated refresh token survives two successive browser renewals',async({page})=>{
  const f=await fixtures();await login(page,f.email);
  const initial=await page.evaluate(()=>localStorage.getItem('vcraft_refresh_token'));
  await page.evaluate(()=>localStorage.setItem('vcraft_access_token','invalid-expired-1'));
  await page.goto('/quote');await expect.poll(()=>page.evaluate(()=>localStorage.getItem('vcraft_access_token'))).not.toBe('invalid-expired-1');
  const rotated=await page.evaluate(()=>localStorage.getItem('vcraft_refresh_token'));expect(rotated).not.toBe(initial);
  await page.evaluate(()=>localStorage.setItem('vcraft_access_token','invalid-expired-2'));
  await page.reload();await expect.poll(()=>page.evaluate(()=>localStorage.getItem('vcraft_access_token'))).not.toBe('invalid-expired-2');
  await expect(page).toHaveURL(/\/quote$/);
  expect(await page.evaluate(()=>localStorage.getItem('vcraft_refresh_token'))).not.toBe(rotated);
});

test('product photos upload to products without modifying workshop photos',async({page})=>{
  const f=await fixtures();await login(page,f.artisanEmail);
  const before=await call('GET','/artisans/me',undefined,f.artisanAuth.accessToken);
  await page.goto('/dashboard/artisan/products/new');
  await page.getByLabel('Tên sản phẩm *',{exact:true}).fill('Ảnh E2E '+f.uid);
  await page.getByLabel('Giá (VNĐ) *',{exact:true}).fill('35000');
  await page.locator('input[type=file]').setInputFiles({name:'cup.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aOaMAAAAASUVORK5CYII=','base64')});
  await page.getByRole('button',{name:'Đăng sản phẩm',exact:true}).click();
  await expect(page).toHaveURL(/\/products\/[0-9a-f-]+$/);
  const product=await call('GET','/products/'+page.url().split('/').pop());
  expect(product.images).toHaveLength(1);expect(product.images[0]).toContain('/uploads/products/');
  const after=await call('GET','/artisans/me',undefined,f.artisanAuth.accessToken);expect(after.images).toEqual(before.images);
});


test('buyer accepts quantities from two workshops and sees child progress',async({page})=>{
  const f=await fixtures(),g=await fixtures();
  const q=await call('POST','/quotes',{title:'Nhiều xưởng '+f.uid,description:'Phân bổ sau chào giá',quantity:100,targetArtisanIds:[f.artisan.id,g.artisan.id]},f.buyer.accessToken);
  await call('PATCH',`/quotes/${q.id}/submit`,undefined,f.buyer.accessToken);
  await call('POST',`/quotes/${q.id}/bids`,{pricePerUnit:20000,estimatedDays:10},f.artisanAuth.accessToken);
  await call('POST',`/quotes/${q.id}/bids`,{pricePerUnit:30000,estimatedDays:15},g.artisanAuth.accessToken);
  await login(page,f.email);await page.goto('/quote/'+q.id);
  await page.getByLabel('Số lượng xưởng 1',{exact:true}).fill('60');
  await page.getByLabel('Số lượng xưởng 2',{exact:true}).fill('40');
  await page.getByRole('button',{name:'Chấp nhận phân bổ',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Tiến độ các xưởng'})).toBeVisible();
  await expect(page.getByText('Đã nhận làm: 100/100',{exact:false})).toBeVisible();
  const progress=await call('GET',`/quotes/${q.id}/allocation-progress`,undefined,f.buyer.accessToken);
  expect(progress.parts).toHaveLength(2);expect(progress.acceptedQuantity).toBe(100);expect(progress.overallStatus).toBe('ACCEPTED');
});

test('admin approves an actual pending workshop from the dashboard',async({page})=>{
  const uid=randomUUID().slice(0,8),name='Hồ sơ chờ '+uid;
  const artisan=await call('POST','/auth/register/artisan',{workshopName:name,ownerName:'Pending E2E',email:`pending-${uid}@example.com`,password,address:'Bát Tràng'});
  await login(page,'admin@vcraft.vn','uet123456');await page.goto('/dashboard/admin');
  const card=page.locator('article').filter({hasText:name});await expect(card).toBeVisible();
  await card.getByRole('button',{name:'Duyệt xưởng',exact:true}).click();await expect(card).toHaveCount(0);
  const approved=await call('GET','/artisans/'+artisan.id);expect(approved.status).toBe('APPROVED');
});

test('forgot/reset password works through the real UI and a local SMTP inbox',async({page})=>{
  const f=await fixtures();await page.goto('/forgot-password');await page.getByLabel('Email',{exact:true}).fill(f.email);
  await page.getByRole('button',{name:'Gửi hướng dẫn',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('hướng dẫn');
  const inboxUrl=process.env.E2E_MAILPIT_URL||'http://localhost:18025';
  const inbox=await (await api.get(inboxUrl+'/api/v1/messages')).json();
  const message=inbox.messages.find((m:{To:{Address:string}[]})=>m.To.some(t=>t.Address===f.email));expect(message).toBeTruthy();
  const detail=await (await api.get(inboxUrl+'/api/v1/message/'+message.ID)).json();
  const token=detail.Text.match(/[?&]token=([A-Za-z0-9_-]{43})/)[1];
  await page.goto('/reset-password?token='+token);
  await page.getByLabel('Mật khẩu mới',{exact:true}).fill('UpdatedIntegration123!');
  await page.getByLabel('Xác nhận mật khẩu',{exact:true}).fill('UpdatedIntegration123!');
  await page.getByRole('button',{name:'Lưu mật khẩu mới',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Đã đặt lại mật khẩu');
  await login(page,f.email,'UpdatedIntegration123!');await page.goto('/quote');await expect(page).toHaveURL(/\/quote$/);
});


test('workshop profile with nullable history can be edited and saved',async({page})=>{
  const f=await fixtures();await login(page,f.artisanEmail);
  await page.goto('/dashboard/artisan/profile');
  await page.getByLabel('Lịch sử gia đình',{exact:true}).fill('Ba thế hệ làm gốm E2E');
  await page.getByRole('button',{name:/Lưu hồ sơ/}).click();
  await expect(page.getByText('✓ Đã lưu hồ sơ xưởng',{exact:true})).toBeVisible();
  const profile=await call('GET','/artisans/me',undefined,f.artisanAuth.accessToken);
  expect(profile.familyHistory).toBe('Ba thế hệ làm gốm E2E');
});
