import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { staggerContainer, fadeUp, maskReveal, viewportRepeat } from '@/lib/motion';

interface Props {
  openCount: number | null;
}

const MAP_PINS = [
  { top: '32%', left: '24%' },
  { top: '56%', left: '62%' },
  { top: '72%', left: '42%' },
];

export default function MapPreview({ openCount }: Props) {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel number="05">Ghé thăm</SectionLabel>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5"
          >
            Mở bản đồ,
            <br />
            tìm xưởng đang mở cửa.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-[#1f1b18]/60 leading-relaxed max-w-md"
          >
            Không chỉ xem sản phẩm — bạn có thể đến tận xưởng, xem nghệ nhân làm
            việc và tự tay thử một vòng bàn xoay.
          </motion.p>

          {openCount !== null && openCount > 0 && (
            <motion.div
              variants={fadeUp}
              className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 bg-[#b45f3c]/8 border border-[#b45f3c]/20 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b45f3c] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b45f3c]" />
              </span>
              <span className="text-sm font-medium text-[#b45f3c]">
                {openCount} xưởng đang mở cửa đón khách hôm nay
              </span>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-8">
            <Link
              to="/map"
              className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#b45f3c] transition-colors"
            >
              Mở bản đồ làng nghề
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={maskReveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          className="relative"
        >
          <div className="relative p-1.5 bg-white/40 backdrop-blur-sm border border-[#1f1b18]/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Bản đồ làng nghề Bát Tràng"
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {MAP_PINS.map((pin, i) => (
                <span
                  key={i}
                  className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pin.top, left: pin.left }}
                >
                  <span className="absolute inset-0 rounded-full bg-[#b45f3c]/30 animate-ping" />
                  <span className="relative block w-3 h-3 rounded-full bg-[#b45f3c] ring-2 ring-[#f6f1ea] shadow-md" />
                </span>
              ))}
            </div>

            <p className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-[#f6f1ea]/80 mix-blend-difference">
              Bát Tràng · Hà Nội
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}