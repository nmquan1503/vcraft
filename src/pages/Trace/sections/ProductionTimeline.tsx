import { motion, type Variants } from 'framer-motion';
import type { ProductionLog } from '@/types';

interface Props {
  logs: ProductionLog[];
}

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const containerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const formatDate = (iso?: string | null) => {
  if (!iso) return 'Chưa cập nhật';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (iso?: string | null) => {
  if (!iso) return '';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ProductionTimeline({ logs }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-t border-[#1f1b18]/10 bg-[#f6f1ea] py-20 sm:py-24 md:py-28">
      <div className="pointer-events-none absolute -left-48 top-1/3 h-[480px] w-[480px] rounded-full border border-[#b45f3c]/[0.06]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-[320px] w-[320px] rounded-full border border-[#b45f3c]/[0.06]" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-20">
        <div className="mb-14 grid gap-10 md:mb-20 md:grid-cols-12 md:gap-12 lg:gap-20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="md:col-span-4"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#b45f3c]" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#b45f3c] sm:text-[11px]">
                Nhật ký sản xuất
              </p>
            </div>

            <h2 className="font-serif text-[clamp(2.6rem,5vw,4rem)] leading-[1.08] tracking-[-0.035em] text-[#1f1b18]">
              Từ đất
              <br />
              đến <span className="italic text-[#b45f3c]">thành phẩm.</span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-[1.9] text-[#1f1b18]/55">
              Mỗi công đoạn đều được ghi lại — từ thời điểm thực hiện đến
              hình ảnh và ghi chú của nghệ nhân trong suốt quá trình tạo tác.
            </p>

            <div className="mt-9 flex items-center gap-4">
              <span className="font-serif text-5xl text-[#b45f3c]/20">
                {String(logs.length).padStart(2, '0')}
              </span>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/70">
                  Công đoạn
                </span>
                <span className="mt-1 block text-xs text-[#1f1b18]/40">
                  Được ghi nhận
                </span>
              </div>
            </div>
          </motion.div>

          <div className="min-w-0 md:col-span-8">
            {logs.length === 0 ? (
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex min-h-[220px] flex-col justify-center border-y border-[#1f1b18]/15 py-10"
              >
                <span className="font-serif text-5xl italic text-[#b45f3c]/25">
                  ...
                </span>
                <h3 className="mt-4 font-serif text-2xl text-[#1f1b18]">
                  Hành trình đang chờ được ghi lại.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#1f1b18]/50">
                  Lô sản phẩm này hiện chưa có nhật ký sản xuất.
                </p>
              </motion.div>
            ) : (
              <motion.ol
                variants={containerReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                className="relative"
              >
                <div
                  aria-hidden="true"
                  className="absolute bottom-3 left-[11px] top-3 w-px bg-[#1f1b18]/15 sm:left-[15px]"
                />

                {logs.map((log, index) => {
                  const isLatest = index === 0;
                  const time = formatTime(log.loggedAt);

                  return (
                    <motion.li
                      key={log.id}
                      variants={reveal}
                      className="relative pb-14 pl-10 last:pb-0 sm:pl-14 md:pb-16"
                    >
                      <span
                        className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8 sm:left-0 ${
                          isLatest
                            ? 'bg-[#b45f3c] shadow-[0_0_0_5px_rgba(180,95,60,0.12)]'
                            : 'border border-[#1f1b18]/25 bg-[#f6f1ea]'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${
                            isLatest
                              ? 'bg-[#f6f1ea]'
                              : 'bg-[#1f1b18]/35'
                          }`}
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35 sm:text-[10px]">
                            Công đoạn {String(index + 1).padStart(2, '0')}
                          </span>

                          {isLatest && (
                            <span className="rounded-full bg-[#b45f3c]/10 px-3 py-1 text-[8px] uppercase tracking-[0.16em] text-[#b45f3c] sm:text-[9px]">
                              Mới nhất
                            </span>
                          )}
                        </div>

                        <h3 className="break-words font-serif text-2xl leading-tight text-[#1f1b18] sm:text-3xl">
                          {log.stage}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.15em] text-[#b45f3c]/85 sm:text-[11px]">
                          <span>{formatDate(log.loggedAt)}</span>
                          {time && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-[#1f1b18]/25" />
                              <span className="text-[#1f1b18]/45">
                                {time}
                              </span>
                            </>
                          )}
                        </div>

                        {log.note && (
                          <p className="mt-5 max-w-2xl break-words text-sm leading-[1.9] text-[#1f1b18]/65 sm:text-base">
                            {log.note}
                          </p>
                        )}

                        {log.images?.length > 0 && (
                          <div
                            className={`mt-6 grid grid-cols-2 gap-3 ${
                              log.images.length >= 3
                                ? 'sm:grid-cols-3'
                                : ''
                            }`}
                          >
                            {log.images.map((img, imageIndex) => (
                              <div
                                key={`${log.id}-${imageIndex}`}
                                className={`group relative overflow-hidden bg-[#e9dfd3] ${
                                  imageIndex === 0 && log.images.length >= 3
                                    ? 'col-span-2 aspect-[16/9] sm:col-span-2 sm:aspect-[5/3]'
                                    : 'aspect-[4/5]'
                                } ${
                                  imageIndex % 2 === 0
                                    ? 'rounded-tl-[38px] rounded-br-[38px]'
                                    : 'rounded-tr-[38px] rounded-bl-[38px]'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`${log.stage} - ảnh ${imageIndex + 1}`}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1b18]/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}