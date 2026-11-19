import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { staggerContainer, fadeUp, maskReveal } from '@/lib/motion';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacityText = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 overflow-hidden min-h-[85vh] flex items-center"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-center w-full relative z-10">
        <motion.div
          className="md:col-span-7"
          style={{ opacity: opacityText }}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base uppercase tracking-[0.3em] text-[#b45f3c] mb-6"
          >
            Làng gốm Bát Tràng — từ thế kỷ XIV
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight"
          >
            Đất qua tay người,
            <br />
            <em className="text-[#b45f3c] italic">thành gốm</em> qua lửa.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-lg text-base md:text-lg lg:text-xl text-[#1f1b18]/70 leading-relaxed"
          >
            BatTrang Craft là triển lãm số của làng gốm Bát Tràng — nơi mỗi hộ gia đình
            kể câu chuyện làm nghề, trưng bày sản phẩm độc bản và mở xưởng đón
            khách ghé thăm.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#b45f3c] transition-colors"
            >
              Khám phá bộ sưu tập
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center border border-[#1f1b18]/15 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:border-[#b45f3c] hover:text-[#b45f3c] transition-colors"
            >
              Bản đồ làng nghề
            </Link>
          </motion.div>
        </motion.div>

        <div className="md:col-span-5 relative">
          <motion.div
            style={{ y: yImage }}
            variants={maskReveal}
            initial="hidden"
            animate="show"
          >
            <div className="relative p-1.5 bg-white/40 backdrop-blur-sm border border-[#1f1b18]/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?q=80&w=1200&auto=format&fit=crop"
                  alt="Đôi tay nghệ nhân đang nặn gốm trên bàn xoay tại Bát Tràng"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>

              <p className="absolute bottom-3 right-3 text-[11px] uppercase tracking-[0.25em] text-[#f6f1ea]/80 mix-blend-difference">
                Bát Tràng · Hà Nội
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}