import type { ProductionLog } from '@/types';

interface Props {
  logs: ProductionLog[];
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export default function ProductionTimeline({ logs }: Props) {
  return (
    <section className="bg-[#f6f1ea] py-20 md:py-28 border-t border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-5">
              Nhật ký sản xuất
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Từ đất
              <br />
              đến thành phẩm.
            </h2>
            <p className="mt-6 text-sm text-[#1f1b18]/60 leading-relaxed max-w-xs">
              Mỗi công đoạn đều được ghi lại — ngày tháng, hình ảnh, và ghi
              chú của nghệ nhân.
            </p>
          </div>

          {/* Timeline */}
          <div className="md:col-span-8">
            {logs.length === 0 ? (
              <p className="text-sm text-[#1f1b18]/40">
                Lô này chưa có nhật ký sản xuất.
              </p>
            ) : (
              <ol className="relative">
                {/* Đường dọc */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-px bg-[#1f1b18]/15"
                  aria-hidden="true"
                />

                {logs.map((log, i) => (
                  <li key={log.id} className="relative pl-10 pb-12 last:pb-0">
                    {/* Chấm tròn */}
                    <span
                      className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                        i === 0
                          ? 'bg-[#b45f3c] text-[#f6f1ea]'
                          : 'bg-[#f6f1ea] border border-[#1f1b18]/30'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          i === 0 ? 'bg-[#f6f1ea]' : 'bg-[#1f1b18]/40'
                        }`}
                      />
                    </span>

                    {/* Nội dung */}
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="font-serif text-xl md:text-2xl text-[#1f1b18]">
                          {log.stage}
                        </h3>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
                          Bước {i + 1} / {logs.length}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#b45f3c]/80">
                        {formatDate(log.loggedAt)}
                        {formatTime(log.loggedAt) && (
                          <span className="text-[#1f1b18]/40 ml-2">
                            · {formatTime(log.loggedAt)}
                          </span>
                        )}
                      </p>

                      {log.note && (
                        <p className="mt-4 text-sm md:text-base text-[#1f1b18]/70 leading-relaxed max-w-xl">
                          {log.note}
                        </p>
                      )}

                      {log.images.length > 0 && (
                        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {log.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-square overflow-hidden bg-[#1f1b18]/5"
                            >
                              <img
                                src={img}
                                alt={`${log.stage} - ảnh ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}