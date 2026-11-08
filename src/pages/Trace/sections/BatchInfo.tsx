import type { Batch } from '@/types';

interface Props {
  batch: Batch;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default function BatchInfo({ batch }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-5">
            Về lô sản phẩm
          </p>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight">
            Thông tin lô
          </h2>
        </div>
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-2">
                Mã lô
              </p>
              <p className="text-sm text-[#1f1b18]/80 font-mono">
                {batch.id}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-2">
                Mã token
              </p>
              <p className="text-sm text-[#1f1b18]/80 font-mono truncate">
                {batch.qrToken}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-2">
                Bắt đầu
              </p>
              <p className="text-sm text-[#1f1b18]/80">
                {formatDate(batch.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-2">
                Cập nhật lần cuối
              </p>
              <p className="text-sm text-[#1f1b18]/80">
                {formatDate(batch.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}