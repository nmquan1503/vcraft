import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '@/api/client';
import { getUser } from '@/utils/tokenStorage';
import type { Order, PageResponse } from '@/types';
import { button, errorMessage, money, statuses } from './shared';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [data, setData] = useState<PageResponse<Order> | null>(null);
  const [loaded, setLoaded] = useState('');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const artisan = getUser()?.role === 'ARTISAN';
  const key = JSON.stringify([page, status, artisan, retry]);
  useEffect(() => {
    let active = true;
    client.get<PageResponse<Order>>(artisan ? '/artisans/me/orders' : '/orders', { params: { page, limit: 10, status: status || undefined } })
      .then(response => { if (active) { setData(response.data); setError(''); } })
      .catch(e => { if (active) { setError(errorMessage(e)); setData(null); } })
      .finally(() => { if (active) setLoaded(key); });
    return () => { active = false; };
  }, [page, status, artisan, key]);
  return <main className="min-h-screen pt-28 px-6 pb-16 max-w-4xl mx-auto space-y-6">
    <h1 className="text-3xl font-serif">{artisan ? 'Đơn hàng của xưởng' : 'Đơn hàng của tôi'}</h1>
    <label htmlFor="order-status">Trạng thái </label>
    <select id="order-status" className="border p-2" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
      <option value="">Tất cả</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
    {loaded !== key ? <p>Đang tải…</p> : error ? <div role="alert">{error} <button className={button} onClick={() => setRetry(n => n + 1)}>Thử lại</button></div> : <>
      {!data?.data.length && <p>Chưa có đơn hàng phù hợp.</p>}
      {data?.data.map(order => <Link key={order.id} to={`/orders/${order.id}`} className="block border rounded p-4 space-y-2 break-words">
        <p>Đơn {order.id}</p><p>{statuses[order.status]} · {money(order.totalAmount)}</p>
        <p>{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
      </Link>)}
      <div className="flex gap-4 items-center">
        <button className={button} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trang trước</button>
        <span>Trang {page} / {Math.max(data?.totalPages ?? 0, 1)}</span>
        <button className={button} disabled={page >= (data?.totalPages ?? 0)} onClick={() => setPage(p => p + 1)}>Trang sau</button>
      </div>
    </>}
  </main>;
}
