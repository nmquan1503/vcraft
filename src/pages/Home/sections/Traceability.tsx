import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { TRACE_STEPS } from '../data';
import { viewportRepeat } from '@/lib/motion';

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// QR 21x21 với 3 finder pattern + data ~50% density (deterministic, tính 1 lần)
const QR_GRID: boolean[][] = (() => {
  const N = 21;
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  const setFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const outer = x === 0 || x === 6 || y === 0 || y === 6;
        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y][ox + x] = outer || inner;
      }
    }
  };
  setFinder(0, 0);
  setFinder(14, 0);
  setFinder(0, 14);
  const rand = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if ((y < 8 && x < 8) || (y < 8 && x > 12) || (y > 12 && x < 8)) continue;
      grid[y][x] = rand(x, y) > 0.5;
    }
  }
  return grid;
})();

const stepContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const stepItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function QRPattern() {
  return (
    <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
      {QR_GRID.map((row, y) =>
        row.map((v, x) =>
          v ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill="#1f1b18"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-full max-w-[280px]">
      <div
        className="absolute -inset-10 rounded-full blur-[70px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(180,95,60,0.45) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={viewportRepeat}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <span className="absolute -left-[2px] top-24 w-[3px] h-8 rounded-l bg-[#3a332c]" aria-hidden="true" />
        <span className="absolute -left-[2px] top-36 w-[3px] h-10 rounded-l bg-[#3a332c]" aria-hidden="true" />
        <span className="absolute -right-[2px] top-28 w-[3px] h-14 rounded-r bg-[#3a332c]" aria-hidden="true" />

        <div className="rounded-[2.8rem] bg-gradient-to-b from-[#3a332c] to-[#2a2520] p-[3px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(217,160,139,0.15)]">
          <div className="relative rounded-[2.6rem] bg-[#f6f1ea] aspect-[9/19] px-4 pb-4 pt-10 flex flex-col overflow-hidden">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-[#1f1b18]/90 z-10" />

            <div className="flex items-center justify-between text-[9px] font-mono text-[#1f1b18]/60 relative z-10">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#1f1b18]/60" />
                <span className="w-1 h-1 rounded-full bg-[#1f1b18]/60" />
                <span className="w-1 h-1 rounded-full bg-[#1f1b18]/60" />
              </span>
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#b45f3c]">
                Truy xuất
              </p>
              <h3 className="font-serif text-lg leading-tight mt-1 text-[#1f1b18]">
                Bình men lam
              </h3>
              <p className="text-[10px] text-[#1f1b18]/50 mt-0.5">Lô #BT-0342</p>
            </div>

            <div className="relative z-10 mt-4 bg-white rounded-xl p-3 border border-[#1f1b18]/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="aspect-square">
                <QRPattern />
              </div>
              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: ['10%', '86%', '10%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-3 right-3 h-px pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #b45f3c 20%, #b45f3c 80%, transparent)',
                  boxShadow: '0 0 12px rgba(180,95,60,0.9)',
                }}
              />
            </div>

            <div className="relative z-10 mt-4 space-y-2">
              {TRACE_STEPS.slice(0, 3).map((e, i) => (
                <div key={e.day} className="flex items-center gap-2 text-[9px]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < 2 ? 'bg-[#b45f3c]' : 'bg-[#1f1b18]/20'
                    }`}
                  />
                  <span
                    className={`font-mono ${
                      i < 2 ? 'text-[#1f1b18]/70' : 'text-[#1f1b18]/40'
                    }`}
                  >
                    {e.day}
                  </span>
                  <span
                    className={
                      i < 2 ? 'text-[#1f1b18]/80' : 'text-[#1f1b18]/40'
                    }
                  >
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Traceability() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const yPhone = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#1f1b18] text-[#f6f1ea] py-24 md:py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 15% 90%, rgba(180,95,60,0.28) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-20 items-center relative z-10">
        <motion.div
          style={{ y: yPhone }}
          className="order-2 md:order-1 flex justify-center"
        >
          <PhoneMockup />
        </motion.div>

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

          <motion.div
            className="relative mt-10"
            variants={stepContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportRepeat}
          >
            <motion.span
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportRepeat}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              style={{ transformOrigin: 'top' }}
              className="absolute left-[5px] top-3 bottom-3 w-px bg-gradient-to-b from-[#d9a08b]/70 via-[#d9a08b]/40 to-[#d9a08b]/10"
              aria-hidden="true"
            />
            {TRACE_STEPS.map((s) => (
              <motion.div
                key={s.day}
                variants={stepItem}
                className="relative pl-6 flex items-center gap-3 py-2.5"
              >
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full border-2 border-[#d9a08b] bg-[#1f1b18]"
                  aria-hidden="true"
                />
                <span className="text-xs font-mono text-[#d9a08b] w-14 shrink-0">
                  {s.day}
                </span>
                <span className="text-sm text-[#f6f1ea]/85">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <Link
            to="/trace/demo"
            className="mt-8 inline-flex items-center text-xs uppercase tracking-widest border-b border-[#d9a08b]/40 pb-1 text-[#d9a08b] hover:text-[#f6f1ea] transition-colors duration-200"
          >
            Xem mẫu truy xuất →
          </Link>
        </div>
      </div>
    </section>
  );
}