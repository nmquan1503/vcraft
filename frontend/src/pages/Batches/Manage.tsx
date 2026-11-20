import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '@/api/client';
import { batchApi } from '@/api';
import { toApiError } from '@/api/_helpers';
import type { ArtisanProfile, Batch, BatchStatus, ProductionLog } from '@/types';

const button = 'border rounded px-4 py-2 hover:bg-stone-200 disabled:opacity-40';
const field = 'border rounded p-3 w-full';
function localTime() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function LogEditor({ log, busy, run }: { log: ProductionLog; busy: boolean; run: (action: () => Promise<unknown>, success?: () => void) => Promise<void> }) {
  const [note, setNote] = useState(log.note ?? '');
  const [images, setImages] = useState(log.images);
  const [files, setFiles] = useState<File[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const dirty = note !== (log.note ?? '') || JSON.stringify(images) !== JSON.stringify(log.images);
  return <article className="border rounded p-5 space-y-4">
    <h3 className="text-xl font-serif">{log.stage}</h3>
    <p>{new Date(log.loggedAt).toLocaleString('vi-VN')}</p>
    <form className="space-y-3" onSubmit={event => {
      event.preventDefault(); void run(() => batchApi.updateLog(log.batchId, log.id, { note, images }));
    }}>
      <label className="block" htmlFor={`note-${log.id}`}>Ghi chú công đoạn {log.stage}</label>
      <textarea className={field} id={`note-${log.id}`} value={note} onChange={e => setNote(e.target.value)} disabled={busy} />
      <div className="flex flex-wrap gap-4">{images.map((url, index) => <div key={`${url}-${index}`}>
        <a href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Minh chứng ${log.stage} ${index + 1}`} className="w-32 h-32 object-cover" /></a>
        <button type="button" className={button} disabled={busy} onClick={() => setImages(list => list.filter((_, i) => i !== index))}>Bỏ ảnh {index + 1}</button>
      </div>)}</div>
      <p className="text-sm">Bấm lưu để áp dụng ghi chú và danh sách ảnh. Bỏ ảnh khỏi nhật ký không xóa file lưu trữ.</p>
      <button className={button} disabled={busy}>Lưu nhật ký</button>
    </form>
    <form className="space-y-3" onSubmit={event => {
      event.preventDefault(); if (!files.length || dirty) return;
      void run(() => batchApi.uploadLogImages(log.batchId, log.id, files), () => { setFiles([]); if (input.current) input.current.value = ''; });
    }}>
      <label className="block" htmlFor={`photos-${log.id}`}>Thêm ảnh minh chứng cho {log.stage}</label>
      <input ref={input} id={`photos-${log.id}`} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => {
        const selected = Array.from(event.target.files ?? []);
        if (selected.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) || selected.reduce((sum, file) => sum + file.size, 0) > 40 * 1024 * 1024) {
          setError('Chọn ảnh JPEG, PNG hoặc WebP; tối đa 10 MB/ảnh và 40 MB/lần.'); setFiles([]); event.target.value = ''; return;
        }
        setError(''); setFiles(selected);
      }} />
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!!files.length && <p>Đã chọn {files.length} ảnh. Upload sẽ lưu trực tiếp vào nhật ký, độc lập với phần ghi chú đang sửa.</p>}
      {dirty && <p>Lưu thay đổi ghi chú/danh sách ảnh trước khi upload.</p>}
      <button className={button} disabled={busy || !files.length || dirty}>Upload ảnh minh chứng</button>
    </form>
    <button className={button} disabled={busy} onClick={() => {
      if (window.confirm(`Xóa công đoạn “${log.stage}” khỏi nhật ký công khai?`)) void run(() => batchApi.deleteLog(log.batchId, log.id));
    }}>Xóa nhật ký</button>
  </article>;
}

export default function ManageBatch() {
  const { id } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loaded, setLoaded] = useState('');
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BatchStatus>('IN_PROGRESS');
  const [stage, setStage] = useState('');
  const [note, setNote] = useState('');
  const [timestamp, setTimestamp] = useState(localTime);
  const query = `${id}:${retry}`;
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [result, owner] = await Promise.all([client.get<Batch>(`/batches/${id}`), client.get<ArtisanProfile>('/artisans/me')]);
        if (result.data.artisanId !== owner.data.id) throw new Error('Bạn chỉ được quản lý lô của xưởng mình.');
        const history = await client.get<ProductionLog[]>(`/batches/${id}/logs`);
        if (active) {
          setBatch(result.data); setLogs(history.data); setName(result.data.name); setDescription(result.data.description ?? ''); setStatus(result.data.status); setError('');
        }
      } catch (failure) { if (active) { setError(toApiError(failure).message); setBatch(null); } }
      finally { if (active) setLoaded(query); }
    })();
    return () => { active = false; };
  }, [id, query]);
  async function run(action: () => Promise<unknown>, success?: () => void) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError(''); setNotice('');
    try {
      await action(); success?.(); setNotice('Đã lưu thay đổi.');
      try {
        const [current, history] = await Promise.all([client.get<Batch>(`/batches/${id}`), client.get<ProductionLog[]>(`/batches/${id}/logs`)]);
        setBatch(current.data); setLogs(history.data);
      } catch (failure) { setError(`Thao tác đã thành công nhưng chưa tải lại được dữ liệu: ${toApiError(failure).message}. Hãy tải lại trang trước khi thao tác tiếp.`); }
    } catch (failure) { setError(toApiError(failure).message); }
    finally { lock.current = false; setBusy(false); }
  }
  return <main className="min-h-screen pt-28 px-6 pb-16 max-w-4xl mx-auto space-y-6 break-words">
    <Link className="underline" to="/batches">← Lô của tôi</Link>
    <h1 className="text-3xl font-serif">Quản lý lô và nhật ký sản xuất</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {notice && <p role="status" className="text-green-700">{notice}</p>}
    {loaded !== query ? <p>Đang tải…</p> : !batch ? <button className={button} onClick={() => setRetry(value => value + 1)}>Thử lại</button> : <>
      <h2 className="text-2xl font-serif">{batch.name}</h2>
      <p>{batch.quantity} sản phẩm · {batch.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang sản xuất'}</p>
      <form className="space-y-3" onSubmit={event => { event.preventDefault(); if (name.trim()) void run(() => batchApi.update(batch.id, { name: name.trim(), description, status })); }}>
        <label className="block" htmlFor="batch-name">Tên lô</label>
        <input className={field} id="batch-name" maxLength={255} required value={name} disabled={busy} onChange={e => setName(e.target.value)} />
        <label className="block" htmlFor="batch-description">Mô tả lô</label>
        <textarea className={field} id="batch-description" value={description} disabled={busy} onChange={e => setDescription(e.target.value)} />
        <label className="block" htmlFor="batch-status">Trạng thái lô</label>
        <select className={field} id="batch-status" value={status} disabled={busy} onChange={e => setStatus(e.target.value as BatchStatus)}>
          <option value="IN_PROGRESS">Đang sản xuất</option><option value="COMPLETED">Đã hoàn thành</option>
        </select>
        <button className={button} disabled={busy || !name.trim()}>Lưu thông tin lô</button>
      </form>
      <section className="border rounded p-5 space-y-4">
        <h2 className="text-2xl font-serif">Mã QR truy xuất</h2>
        <img className="w-40 h-40" src={batch.qrCodeUrl} alt={`QR ${batch.name}`} />
        <div className="flex flex-wrap gap-4">
          <a className={button} href={batch.qrCodeUrl} target="_blank" rel="noreferrer">Mở ảnh QR để lưu hoặc in</a>
          <Link className={button} to={`/trace/${batch.id}`}>Xem truy xuất công khai</Link>
          <button className={button} disabled={busy} onClick={() => { if (window.confirm('Sinh lại ảnh QR cho lô này?')) void run(() => batchApi.regenerateQr(batch.id)); }}>Sinh lại QR</button>
        </div>
        <p>QR trỏ tới trang truy xuất công khai của lô; đây không phải mã bảo mật.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-serif">Thêm công đoạn sản xuất</h2>
        <form className="space-y-3" onSubmit={event => {
          event.preventDefault(); if (!stage.trim() || !timestamp) return;
          void run(() => batchApi.createLog(batch.id, { stage: stage.trim(), note, timestamp: new Date(timestamp).toISOString() }), () => { setStage(''); setNote(''); setTimestamp(localTime()); });
        }}>
          <label className="block" htmlFor="log-stage">Công đoạn</label>
          <input className={field} id="log-stage" maxLength={100} required value={stage} disabled={busy} placeholder="Ví dụ: Nhào đất, Vuốt, Nung, Thành phẩm" onChange={e => setStage(e.target.value)} />
          <label className="block" htmlFor="log-timestamp">Thời gian thực hiện</label>
          <input className={field} id="log-timestamp" type="datetime-local" required value={timestamp} disabled={busy} onChange={e => setTimestamp(e.target.value)} />
          <label className="block" htmlFor="log-note">Ghi chú công đoạn mới</label>
          <textarea className={field} id="log-note" value={note} disabled={busy} onChange={e => setNote(e.target.value)} />
          <button className={button} disabled={busy || !stage.trim()}>Thêm nhật ký</button>
        </form>
      </section>
      <section className="space-y-4"><h2 className="text-2xl font-serif">Nhật ký đã ghi</h2>
        {!logs.length && <p>Chưa có nhật ký. Thêm công đoạn đầu tiên ở trên.</p>}
        {[...logs].sort((a, b) => a.loggedAt.localeCompare(b.loggedAt)).map(log => <LogEditor key={`${log.id}:${log.note}:${JSON.stringify(log.images)}`} log={log} busy={busy} run={run} />)}
      </section>
    </>}
  </main>;
}
