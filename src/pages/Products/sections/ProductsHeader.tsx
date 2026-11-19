import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { revealText, viewportRepeat } from '@/lib/motion';

interface Props {
  total: number;
}

function CountUp({ value, active }: { value: number; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const controls = animate(displayRef.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, active]);

  return (
    <span className="tabular-nums font-medium text-[#1f1b18]/70">
      {Math.round(display).toLocaleString('vi-VN')}
    </span>
  );
}

export default function ProductsHeader({ total }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={sectionRef}
      className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10 md:pb-14"
    >
      <motion.div
        variants={revealText}
        initial="hidden"
        whileInView="show"
        viewport={viewportRepeat}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-5 md:mb-6">
          Bộ sưu tập
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
          <h1 className="font-serif text-[clamp(2rem,7vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
            Tuyển chọn
            <br />
            từ các <em className="italic text-[#b45f3c]">xưởng</em>.
          </h1>
          <p className="text-xs md:text-sm text-[#1f1b18]/40 pb-2 tabular-nums">
            <CountUp value={total} active={inView} />
            <span className="ml-1.5">sản phẩm</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}