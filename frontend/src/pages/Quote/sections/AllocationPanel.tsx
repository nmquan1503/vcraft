import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quoteApi } from '@/api';
import type { QuoteRequest, Bid, AllocationProgress } from '@/types';
import QuoteStatusBadge from './QuoteStatusBadge';
export default function AllocationPanel({ quote, bids, onChanged }: {quote:QuoteRequest; bids:Bid[]; onChanged:()=>Promise<void>}) {
  const [quantities, setQuantities] = useState<Record<string,number>>({});
  const [progress, setProgress] = useState<AllocationProgress|null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (quote.status !== 'ALLOCATED') return;
    let active=true;
    quoteApi.progress(quote.id).then(p=>{if(active)setProgress(p);});
    return ()=>{active=false;};
  }, [quote.id,quote.status,quote.updatedAt]);
  if (quote.status === 'ALLOCATED') return <section className="mt-8 border border-[#b45f3c]/30 p-5">
    <h2 className="font-serif text-2xl mb-4">Tiến độ các xưởng</h2>
    {progress ? <>
      <QuoteStatusBadge status={progress.overallStatus}/>
      <p className="my-3 text-sm">Đã nhận làm: {progress.acceptedQuantity}/{progress.totalQuantity} · Đã giao: {progress.deliveredQuantity} · Đã xác nhận: {progress.confirmedQuantity}</p>
      <p className="mb-3 text-sm">Giá trị đã chốt: {progress.acceptedValue.toLocaleString('vi-VN')} ₫</p>
      {progress.parts.map(part=><Link key={part.id} className="block border-t py-3 text-sm underline" to={`/quote/${part.id}`}>{part.title} — {part.quantity} {part.unit} <QuoteStatusBadge status={part.status}/></Link>)}
    </> : <p>Đang tải tiến độ…</p>}
  </section>;
  const pending=bids.filter(b=>b.status==='PENDING');
  if (!['SENT','BIDDING'].includes(quote.status) || pending.length < 2) return null;
  const parts=pending.map(b=>({bidId:b.id,quantity:quantities[b.id]||0})).filter(p=>p.quantity>0);
  const sum=parts.reduce((n,p)=>n+p.quantity,0);
  async function submit() {
    setBusy(true);setError('');
    try {await quoteApi.acceptAllocations(quote.id,parts);await onChanged();}
    catch(ex){setError(ex instanceof Error?ex.message:'Không thể chia đơn.');}
    finally{setBusy(false);}
  }
  return <section className="mt-8 border border-[#b45f3c]/30 p-5">
    <h2 className="font-serif text-2xl">Chọn nhiều xưởng</h2>
    <p className="my-3 text-sm">Chia đủ {quote.quantity} {quote.unit} cho ít nhất hai xưởng. Đơn giá lấy từ các chào giá bên dưới.</p>
    {pending.map((bid,i)=><label key={bid.id} className="my-3 block text-sm">Xưởng {i+1} · {bid.pricePerUnit.toLocaleString('vi-VN')} ₫/{quote.unit}
      <input aria-label={`Số lượng xưởng ${i+1}`} type="number" min="0" max={quote.quantity} step="1" value={quantities[bid.id]||0} onChange={e=>setQuantities({...quantities,[bid.id]:Number(e.target.value)})} className="ml-3 w-24 border p-2" disabled={busy}/>
    </label>)}
    <p className="text-sm">Tổng đã chia: {sum}/{quote.quantity}</p>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    <button onClick={submit} disabled={busy||sum!==quote.quantity||parts.length<2||parts.some(p=>!Number.isInteger(p.quantity))} className="mt-3 rounded-full bg-[#1f1b18] px-5 py-2 text-white disabled:opacity-40">{busy?'Đang xử lý…':'Chấp nhận phân bổ'}</button>
  </section>;
}
