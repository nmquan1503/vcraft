import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api';
import type { ArtisanProfile, QuoteRequest } from '@/types';
export default function AdminDashboard() {
  const [pending,setPending]=useState<ArtisanProfile[]>([]);
  const [quotes,setQuotes]=useState<QuoteRequest[]>([]);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  async function load() {
    const [a,q]=await Promise.all([adminApi.listPendingArtisans({limit:100}),adminApi.listAllQuotes({limit:100})]);
    setPending(a.data);setQuotes(q.data);
  }
  useEffect(()=>{
    let active=true;
    Promise.all([adminApi.listPendingArtisans({limit:100}),adminApi.listAllQuotes({limit:100})]).then(([a,q])=>{
      if(active){setPending(a.data);setQuotes(q.data);}
    });
    return ()=>{active=false;};
  },[]);
  async function decide(id:string,approve:boolean) {
    setBusy(true);setError('');
    try {if(approve)await adminApi.approveArtisan(id);else await adminApi.rejectArtisan(id,'Hồ sơ chưa đủ điều kiện');await load();}
    catch(ex){setError(ex instanceof Error?ex.message:'Không thể cập nhật hồ sơ.');}
    finally{setBusy(false);}
  }
  return <main className="mx-auto min-h-screen max-w-5xl px-6 pt-28 pb-16">
    <h1 className="font-serif text-4xl mb-8">Ban quản lý làng nghề</h1>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    <h2 className="font-serif text-2xl">Hồ sơ chờ duyệt</h2>
    {!pending.length&&<p className="my-4">Không có hồ sơ đang chờ duyệt.</p>}
    {pending.map(a=><article key={a.id} className="my-4 border p-5"><h3 className="font-serif text-xl">{a.workshopName}</h3><p>{a.ownerName} · {a.address}</p><p className="my-2">{a.description}</p><div className="flex gap-4"><button disabled={busy} className="rounded bg-[#1f1b18] px-4 py-2 text-white disabled:opacity-50" onClick={()=>decide(a.id,true)}>Duyệt xưởng</button><button disabled={busy} className="border px-4 py-2" onClick={()=>decide(a.id,false)}>Từ chối hồ sơ</button></div></article>)}
    <h2 className="font-serif text-2xl mt-10">Yêu cầu báo giá gần đây</h2>
    {quotes.map(q=><Link key={q.id} className="block border-b py-4 underline" to={`/quote/${q.id}`}>{q.title} — {q.quantity} {q.unit} · {q.status}</Link>)}
  </main>;
}
