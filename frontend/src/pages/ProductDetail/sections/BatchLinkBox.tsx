import { Link } from 'react-router-dom';
import type { Batch } from '@/types';

interface Props {
  batch: Batch;
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'Đang sản xuất',
  COMPLETED: 'Hoàn thành',
  DRAFT: 'Bản nháp',
};

export default function BatchLinkBox({ batch }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 mb-24">
      <div className="bg-[#1f1b18] text-[#f6f1ea] grid md:grid-cols-3 gap-8 items-center p-8 md:p-12">
        <div className="flex justify-center md:justify-start">
          <div className="bg-[#f6f1ea] p-3">
            <img src={batch.qrCodeUrl} alt={`QR lô ${batch.name}`} className="w-28 h-28" />
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] mb-3">Truy xuất nguồn gốc</p>
          <h3 className="font-serif text-2xl md:text-3xl leading-tight">{batch.name}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/60">
            <span>{batch.quantity} sản phẩm</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9a08b]" />
              {STATUS_LABEL[batch.status] ?? batch.status}
            </span>
          </div>
          {batch.description && <p className="mt-4 text-sm text-[#f6f1ea]/70 leading-relaxed max-w-lg">{batch.description}</p>}
          <Link to={`/trace/${batch.id}`} className="mt-6 inline-flex items-center text-[11px] uppercase tracking-widest border-b border-[#d9a08b]/40 pb-1 text-[#d9a08b] hover:text-[#f6f1ea] transition-colors">
            Xem nhật ký sản xuất →
          </Link>
        </div>
      </div>
    </section>
  );
}