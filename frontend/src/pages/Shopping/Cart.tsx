import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi, orderApi, productApi } from '@/api';
import client from '@/api/client';
import type { Cart, Product } from '@/types';
import { button, errorMessage, money } from './shared';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Record<string, Product | null>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const lock = useRef(false);
  const navigate = useNavigate();
  async function load() {
    const result = (await client.get<Cart>('/cart')).data;
    const entries = await Promise.all(result.items.map(async item => [item.productId, await productApi.getById(item.productId)] as const));
    setProducts(Object.fromEntries(entries)); setCart(result);
  }
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = (await client.get<Cart>('/cart')).data;
        const entries = await Promise.all(result.items.map(async item => [item.productId, await productApi.getById(item.productId)] as const));
        if (active) { setProducts(Object.fromEntries(entries)); setCart(result); }
      } catch (e) { if (active) setError(errorMessage(e)); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);
  async function mutate(action: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { await action(); await load(); }
    catch (e) { setError(errorMessage(e)); }
    finally { lock.current = false; setBusy(false); }
  }
  const invalid = !cart?.items.length || cart.items.some(item => !products[item.productId] || products[item.productId]!.stock < item.quantity);
  const total = cart?.items.reduce((sum, item) => sum + (products[item.productId]?.price ?? 0) * item.quantity, 0) ?? 0;
  return <main className="min-h-screen pt-28 px-6 pb-16 max-w-4xl mx-auto space-y-6">
    <h1 className="text-3xl font-serif">Giỏ hàng</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {loading ? <p>Đang tải…</p> : !cart ? <button className={button} onClick={() => { setLoading(true); load().catch(e => setError(errorMessage(e))).finally(() => setLoading(false)); }}>Thử lại</button> : <>
      {!cart.items.length && <p>Giỏ hàng trống. <Link className="underline" to="/products">Chọn sản phẩm</Link></p>}
      {cart.items.map(item => {
        const product = products[item.productId];
        return <article key={item.id} className="border rounded p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-40"><Link className="underline" to={`/products/${item.productId}`}>{product?.name ?? 'Sản phẩm không khả dụng'}</Link>
            {product && <p>{money(product.price)} · Còn {product.stock}</p>}
            {(!product || item.quantity > product.stock) && <p className="text-red-700">Không đủ hàng; hãy giảm số lượng hoặc xóa sản phẩm.</p>}
          </div>
          <button className={button} aria-label={`Giảm số lượng ${product?.name ?? ''}`} disabled={busy || item.quantity <= 1} onClick={() => mutate(() => cartApi.updateItem(item.id, { quantity: item.quantity - 1 }))}>−</button>
          <span aria-label="Số lượng">{item.quantity}</span>
          <button className={button} aria-label={`Tăng số lượng ${product?.name ?? ''}`} disabled={busy || !product || item.quantity >= product.stock} onClick={() => mutate(() => cartApi.updateItem(item.id, { quantity: item.quantity + 1 }))}>+</button>
          <button className={button} disabled={busy} onClick={() => mutate(() => cartApi.deleteItem(item.id))}>Xóa</button>
        </article>;
      })}
      {!!cart.items.length && <>
        <button className={button} disabled={busy} onClick={() => { if (window.confirm('Xóa toàn bộ giỏ hàng?')) void mutate(() => cartApi.clear()); }}>Xóa toàn bộ</button>
        <p className="text-xl">Tạm tính: {money(total)}</p>
        <p>Giá và tồn kho được máy chủ kiểm tra lại khi đặt hàng. Chưa bao gồm phí giao hàng nếu có.</p>
        <form className="space-y-4" onSubmit={async e => {
          e.preventDefault(); if (lock.current || invalid || !address.trim()) return;
          lock.current = true; setBusy(true); setError('');
          try { const order = await orderApi.create({ shippingAddress: address.trim(), paymentMethod: 'COD', note: note.trim() || undefined }); navigate(`/orders/${order.id}`, { replace: true }); }
          catch (failure) { setError(errorMessage(failure)); }
          finally { lock.current = false; setBusy(false); }
        }}>
          <label className="block" htmlFor="shippingAddress">Thông tin nhận hàng (họ tên, số điện thoại, địa chỉ đầy đủ)</label>
          <textarea id="shippingAddress" required maxLength={2000} value={address} onChange={e => setAddress(e.target.value)} className="border p-3 w-full" />
          <label className="block" htmlFor="orderNote">Ghi chú</label>
          <textarea id="orderNote" maxLength={2000} value={note} onChange={e => setNote(e.target.value)} className="border p-3 w-full" />
          <p>Thanh toán khi nhận hàng (COD)</p>
          <button className={button} disabled={busy || invalid || !address.trim()}>{busy ? 'Đang xử lý…' : 'Đặt hàng'}</button>
        </form>
      </>}
    </>}
    <Link className="underline block" to="/orders">Xem đơn hàng</Link>
  </main>;
}
