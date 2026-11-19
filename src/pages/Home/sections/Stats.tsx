import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, type Variants } from 'framer-motion';
import { STATS } from '../data';
import { viewportRepeat } from '@/lib/motion';

function parseStat(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return {
    num: parseInt(match[1].replace(/\./g, ''), 10),
    suffix: match[2],
  };
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const numberVariants: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0 0 0 0)',
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

function CountUpValue({ value, active }: { value: string; active: boolean }) {
  const { num, suffix } = parseStat(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    const controls = animate(0, num, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, num]);

  return (
    <span>
      {Math.round(display).toLocaleString('vi-VN')}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewportRepeat);

  return (
    <section ref={ref} className="relative">
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1b18]/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1b18]/20 to-transparent" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(180,95,60,0.045) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportRepeat}
      >
        {STATS.map((s, i) => (
          <div key={s.label} className="relative py-14 md:py-20 px-4 text-center">
            {i > 0 && (
              <motion.span
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={viewportRepeat}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                style={{ transformOrigin: 'center' }}
                className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[#1f1b18]/20 to-transparent"
                aria-hidden="true"
              />
            )}

            <motion.p
              variants={numberVariants}
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-none text-[#1f1b18] tabular-nums"
            >
              <CountUpValue value={s.value} active={inView} />
            </motion.p>

            <motion.p
              variants={labelVariants}
              className="mt-3 text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#1f1b18]/50"
            >
              {s.label}
            </motion.p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}