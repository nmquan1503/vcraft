import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';

const QUOTE_WORDS = ['Nhất', 'xương,', 'nhì', 'da,', 'thứ', 'ba', 'dạc', 'lò.'];
const BREAK_BEFORE_INDEX = 4;
const WHEEL_RINGS = [160, 280, 400, 520, 640, 760, 880];

const quoteVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0.08, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function Divider({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top';
  return (
    <div
      className={`absolute inset-x-0 ${isTop ? 'top-0' : 'bottom-0'} pointer-events-none z-20`}
      aria-hidden="true"
    >
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d9a08b]/55 to-transparent" />
      </div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${
          isTop ? '-translate-y-1/2 top-0' : 'translate-y-1/2 bottom-0'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="block w-10 h-px bg-gradient-to-r from-transparent to-[#d9a08b]/70" />
          <span className="block w-1.5 h-1.5 rotate-45 bg-[#d9a08b] shadow-[0_0_12px_rgba(217,160,139,0.75)]" />
          <span className="block w-10 h-px bg-gradient-to-l from-transparent to-[#d9a08b]/70" />
        </div>
      </div>
    </div>
  );
}

export default function QuoteBlock() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [30, 0, 0, -30]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-[#140c07] text-[#f6f1ea]"
    >
      <Divider position="top" />
      <Divider position="bottom" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 90% 55% at 50% 100%, rgba(180, 95, 60, 0.55) 0%, rgba(180, 95, 60, 0.15) 30%, transparent 65%)',
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(217, 160, 139, 0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 15% 50%, rgba(120, 60, 30, 0.25) 0%, transparent 45%)',
            'radial-gradient(circle at 85% 50%, rgba(120, 60, 30, 0.25) 0%, transparent 45%)',
          ].join(', '),
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.15,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      <motion.svg
        style={{ rotate: rotation }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        width="1800"
        height="1800"
        viewBox="0 0 1800 1800"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="wheel-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d9a08b" stopOpacity="0" />
            <stop offset="35%" stopColor="#d9a08b" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#b45f3c" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#b45f3c" stopOpacity="0" />
          </radialGradient>
        </defs>
        {WHEEL_RINGS.map((r) => (
          <circle
            key={r}
            cx="900"
            cy="900"
            r={r}
            fill="none"
            stroke="url(#wheel-glow)"
            strokeWidth="1.2"
          />
        ))}
      </motion.svg>

      <span
        className="absolute inset-0 flex items-center justify-center font-serif text-[28vw] md:text-[22vw] text-[#d9a08b]/[0.035] select-none pointer-events-none leading-none tracking-tighter"
        aria-hidden="true"
      >
        1352
      </span>

      <span className="absolute top-8 left-8 md:top-12 md:left-12 text-[#d9a08b]/40 text-xl select-none pointer-events-none">✦</span>
      <span className="absolute top-8 right-8 md:top-12 md:right-12 text-[#d9a08b]/40 text-xl select-none pointer-events-none">✦</span>
      <span className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-[#d9a08b]/40 text-xl select-none pointer-events-none">✦</span>
      <span className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-[#d9a08b]/40 text-xl select-none pointer-events-none">✦</span>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div style={{ y }} className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#d9a08b] mb-8 md:mb-10">
            Lời người xưa
          </p>

          <motion.blockquote
            variants={quoteVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.6 }}
            className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-[#f6f1ea] drop-shadow-[0_2px_20px_rgba(180,95,60,0.3)]"
          >
            {QUOTE_WORDS.map((word, i) => (
              <Fragment key={i}>
                {i === BREAK_BEFORE_INDEX && <br />}
                <motion.span
                  variants={wordVariants}
                  className="inline-block mr-[0.28em] last:mr-0"
                >
                  {word}
                </motion.span>
              </Fragment>
            ))}
          </motion.blockquote>

          <div className="mt-10 md:mt-14 flex items-center justify-center gap-4 w-full max-w-xl mx-auto">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d9a08b]/60" />
            <p className="text-[11px] md:text-sm uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#d9a08b] shrink-0">
              Kinh nghiệm truyền đời người Bát Tràng
            </p>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d9a08b]/60" />
          </div>

          <div className="mt-10 md:mt-12 inline-block rotate-[-6deg]">
            <svg viewBox="0 0 80 80" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(232,85,85,0.4)]">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#e85555" strokeWidth="1.5" opacity="0.9" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#e85555" strokeWidth="0.5" opacity="0.7" />
              <text x="40" y="36" textAnchor="middle" fill="#e85555" fontSize="7" fontWeight="700" letterSpacing="1.5" fontFamily="serif">
                BÁT TRÀNG
              </text>
              <line x1="16" y1="42" x2="64" y2="42" stroke="#e85555" strokeWidth="0.5" opacity="0.7" />
              <text x="40" y="52" textAnchor="middle" fill="#e85555" fontSize="6" fontFamily="serif" fontStyle="italic" letterSpacing="0.5" opacity="0.9">
                est. 1352
              </text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}