import { Link } from 'react-router-dom';
import { TRACE_STEPS } from '../data';

export default function Traceability() {
  return (
    <section className="bg-[#1f1b18] text-[#f6f1ea] py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Mockup điện thoại QR */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="w-full max-w-[280px]">
            <div className="rounded-[2.5rem] border border-[#f6f1ea]/15 p-3 bg-[#2a2520]">
              <div className="rounded-[2rem] bg-[#f6f1ea] aspect-[9/19] flex flex-col items-center justify-center p-6 text-[#1f1b18]">
                <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-0.5 p-1 border-2 border-dashed border-[#b45f3c] rounded-lg">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        [0, 1, 2, 4, 5, 8, 10, 11, 12, 14, 15].includes(i)
                          ? 'bg-[#1f1b18]'
                          : 'bg-transparent'
                      }
                    />
                  ))}
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/60 text-center">
                  Quét để xem
                  <br />
                  nhật ký sản xuất
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="order-1 md:order-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-5">
            N° 04 — Truy xuất nguồn gốc
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            Mỗi lô gốm
            <br />
            có một câu chuyện riêng.
          </h2>
          <p className="mt-6 text-sm md:text-base text-[#f6f1ea]/60 leading-relaxed max-w-md">
            Mỗi lô sản phẩm được gắn một mã QR duy nhất. Quét mã để xem lại toàn
            bộ nhật ký sản xuất: ngày chọn đất, ngày vuốt, ngày nung, kèm hình
            ảnh từng công đoạn.
          </p>

          <div className="mt-8 space-y-3">
            {TRACE_STEPS.map((s) => (
              <div
                key={s.day}
                className="flex items-center gap-4 border-b border-[#f6f1ea]/10 pb-3"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b] w-20 shrink-0">
                  {s.day}
                </span>
                <span className="text-sm text-[#f6f1ea]/80">{s.label}</span>
              </div>
            ))}
          </div>

          <Link
            to="/trace/demo"
            className="mt-8 inline-flex items-center text-xs uppercase tracking-widest border-b border-[#d9a08b]/40 pb-1 text-[#d9a08b] hover:text-[#f6f1ea] transition-colors"
          >
            Xem mẫu truy xuất →
          </Link>
        </div>
      </div>
    </section>
  );
}