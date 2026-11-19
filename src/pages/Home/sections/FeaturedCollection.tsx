import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { Product } from '@/types';
import { revealText, viewportRepeat } from '@/lib/motion';

interface Props {
  products: Product[];
  loading: boolean;
}

const AUTO_PLAY_MS = 5000;

export default function FeaturedCollection({ products, loading }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;

  useEffect(() => {
    if (active >= count && count > 0) setActive(0);
  }, [active, count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  const goTo = (i: number) => {
    if (count === 0) return;
    setActive(((i % count) + count) % count);
  };

  return (
    <div className="relative -mt-8 md:-mt-12 -mb-8 md:-mb-12 z-10">
      {/* Viền răng cưa trên — đỉnh chĩa lên */}
      <div
        className="absolute left-0 right-0 -top-6 h-6 pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full block"
          viewBox="0 0 1440 24"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="fc-zigzag-top"
              x="0"
              y="0"
              width="48"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,24 L24,0 L48,24 Z"
                fill="#1f1b18"
                stroke="#d9a08b"
                strokeOpacity="0.4"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </pattern>
          </defs>
          <rect width="1440" height="24" fill="url(#fc-zigzag-top)" />
        </svg>
      </div>

      <section
        id="bo-suu-tap"
        className="relative w-full bg-[#1f1b18] text-[#f6f1ea] pt-14 md:pt-16 pb-14 md:pb-16 shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.45)]"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            className="flex flex-wrap items-end justify-between gap-6 mb-8 md:mb-10"
            variants={revealText}
            initial="hidden"
            whileInView="show"
            viewport={viewportRepeat}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-3">
                N° 02 — Bộ sưu tập
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
                Tuyển chọn từ các xưởng.
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs uppercase tracking-widest border-b border-[#f6f1ea]/30 pb-1 hover:text-[#d9a08b] hover:border-[#d9a08b] transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </motion.div>

          {loading ? (
            <div className="h-[280px] md:h-[360px] flex items-center justify-center">
              <div className="w-[58%] max-w-[240px] md:max-w-[300px] aspect-[4/5] bg-[#f6f1ea]/5 animate-pulse" />
            </div>
          ) : count === 0 ? (
            <p className="text-center text-sm text-[#f6f1ea]/40 py-16">
              Chưa có sản phẩm nào được đăng tải.
            </p>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div
                className="grid place-items-center h-[280px] md:h-[360px]"
                style={{ perspective: 1400 }}
              >
                {products.map((p, idx) => {
                  let offset = idx - active;
                  if (offset > count / 2) offset -= count;
                  if (offset < -count / 2) offset += count;

                  const isActive = offset === 0;
                  const isVisible = Math.abs(offset) <= 1;

                  return (
                    <motion.div
                      key={p.id}
                      className="col-start-1 row-start-1 w-[58%] max-w-[240px] md:max-w-[300px] cursor-pointer"
                      initial={false}
                      animate={{
                        x: `${offset * 55}%`,
                        scale: isActive ? 1 : 0.7,
                        rotateY: offset * -20,
                        opacity: isVisible ? (isActive ? 1 : 0.45) : 0,
                        filter: isActive ? 'blur(0px)' : 'blur(2px)',
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => !isActive && goTo(idx)}
                      style={{
                        zIndex: 10 - Math.abs(offset),
                        pointerEvents: isVisible ? 'auto' : 'none',
                      }}
                    >
                      <Link
                        to={`/products/${p.id}`}
                        onClick={(e) => {
                          if (!isActive) e.preventDefault();
                        }}
                        className="block group"
                        tabIndex={isActive ? 0 : -1}
                      >
                        <div
                          className={`relative p-2 md:p-2.5 transition-all duration-500 ${
                            isActive
                              ? 'bg-[#f6f1ea]/[0.06] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]'
                              : 'bg-[#f6f1ea]/[0.03]'
                          }`}
                        >
                          <span className={`absolute top-0 left-0 w-4 h-4 border-t border-l transition-colors duration-500 ${isActive ? 'border-[#d9a08b]' : 'border-[#f6f1ea]/25'}`} />
                          <span className={`absolute top-0 right-0 w-4 h-4 border-t border-r transition-colors duration-500 ${isActive ? 'border-[#d9a08b]' : 'border-[#f6f1ea]/25'}`} />
                          <span className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l transition-colors duration-500 ${isActive ? 'border-[#d9a08b]' : 'border-[#f6f1ea]/25'}`} />
                          <span className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-colors duration-500 ${isActive ? 'border-[#d9a08b]' : 'border-[#f6f1ea]/25'}`} />

                          <div className="relative aspect-[4/5] overflow-hidden">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <ImagePlaceholder
                                label={p.name}
                                aspect="aspect-[4/5]"
                                tone="clay"
                                className="w-full h-full"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <span className={`absolute top-2 left-2 text-[9px] font-mono tracking-[0.3em] transition-colors duration-500 ${isActive ? 'text-[#d9a08b]' : 'text-[#f6f1ea]/60'}`}>
                              N° {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mt-4 md:mt-5 min-h-[66px]"
              >
                <h3 className="font-serif text-xl md:text-2xl">{products[active].name}</h3>
                <p className="text-sm font-mono text-[#d9a08b]/80 mt-1.5">
                  {products[active].price.toLocaleString('vi-VN')}₫
                </p>
              </motion.div>

              {count >= 2 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={() => goTo(active - 1)}
                    aria-label="Sản phẩm trước"
                    className="w-9 h-9 rounded-full border border-[#f6f1ea]/20 flex items-center justify-center hover:border-[#d9a08b] hover:text-[#d9a08b] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    {products.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Chuyển đến sản phẩm ${i + 1}`}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === active ? 'w-8 bg-[#d9a08b]' : 'w-2 bg-[#f6f1ea]/20 hover:bg-[#f6f1ea]/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goTo(active + 1)}
                    aria-label="Sản phẩm tiếp theo"
                    className="w-9 h-9 rounded-full border border-[#f6f1ea]/20 flex items-center justify-center hover:border-[#d9a08b] hover:text-[#d9a08b] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Viền răng cưa dưới — đỉnh chĩa xuống */}
      <div
        className="absolute left-0 right-0 -bottom-6 h-6 pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full block"
          viewBox="0 0 1440 24"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="fc-zigzag-bottom"
              x="0"
              y="0"
              width="48"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,0 L24,24 L48,0 Z"
                fill="#1f1b18"
                stroke="#d9a08b"
                strokeOpacity="0.4"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </pattern>
          </defs>
          <rect width="1440" height="24" fill="url(#fc-zigzag-bottom)" />
        </svg>
      </div>
    </div>
  );
}