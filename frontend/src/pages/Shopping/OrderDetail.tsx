import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '@/api/client';
import { orderApi } from '@/api';
import { getUser } from '@/utils/tokenStorage';
import type { Order } from '@/types';
import { button, errorMessage, money, nextStatus, statuses } from './shared';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');
  const lock = useRef(false);
  const user = getUser();
  useEffect(() => {
    let active = true;
    client.get<Order>(`/orders/${id}`).then(response => { if (active) { setOrder(response.data); setError(''); } })
      .catch(e => { if (active) { setError(errorMessage(e)); setOrder(null); } })
      .finally(() => { if (active) setLoaded(id ?? ''); });
    return () => { active = false; };
  }, [id]);
  async function mutate(action: () => Promise<Order>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { setOrder(await action()); }
    catch (e) { setError(errorMessage(e)); }
    finally { lock.current = false; setBusy(false); }
  }
  const multipleWorkshops = order ? new Set(order.items.map(item => item.artisanId)).size > 1 : false;
  const next = order ? nextStatus[order.status] : undefined;
  return <main className="min-h-screen pt-28 px-6 pb-16 max-w-4xl mx-auto space-y-6 break-words">
    <Link className="underline" to="/orders">← Danh sách đơn hàng</Link>
    <h1 className="text-3xl font-serif">Chi tiết đơn hàng</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {loaded !== id ? <p>Đang tải…</p> : order && <>
      <p>Mã đơn: {order.id}</p><p>Trạng thái: {statuses[order.status]}</p>
      <p>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
      <p className="whitespace-pre-wrap">Thông tin nhận hàng: {order.shippingAddress}</p>
      <p>Thanh toán: {order.paymentMethod}</p>
      {order.note && <p>Ghi chú: {order.note}</p>}
      {order.cancelReason && <p>Lý do hủy: {order.cancelReason}</p>}
      {order.items.map(item => <article key={item.id} className="border p-4 rounded">
        <Link className="underline" to={`/products/${item.productId}`}>{item.productName}</Link>
        <p>{item.quantity} × {money(item.price)} = {money(item.quantity * item.price)}</p>
      </article>)}
      <p className="text-xl">Tổng tiền: {money(order.totalAmount)}</p>
      {user?.id === order.buyerId && order.status === 'PENDING' && <form className="space-y-3" onSubmit={e => {
        e.preventDefault(); if (window.confirm('Bạn muốn hủy đơn hàng này?')) void mutate(() => orderApi.cancel(order.id, { reason: reason.trim() || undefined }));
      }}>
        <label className="block" htmlFor="cancel-reason">Lý do hủy (không bắt buộc)</label>
        <input className="border p-2 w-full" id="cancel-reason" maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} />
        <button className={button} disabled={busy}>Hủy đơn hàng</button>
      </form>}
      {multipleWorkshops && <p>Đơn có sản phẩm từ nhiều xưởng: ban quản lý điều phối và cập nhật trạng thái chung.</p>}
      {(user?.role === 'ADMIN' || (user?.role === 'ARTISAN' && !multipleWorkshops)) && next && <button className={button} disabled={busy} onClick={() => {
        if (window.confirm(`Chuyển đơn hàng sang “${statuses[next]}”?`)) void mutate(() => orderApi.updateStatus(order.id, { status: next }));
      }}>{busy ? 'Đang xử lý…' : `Cập nhật: ${statuses[next]}`}</button>}
    </>}
  </main>;
}
