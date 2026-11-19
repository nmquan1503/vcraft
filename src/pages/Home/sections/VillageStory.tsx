import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { revealText, maskReveal, viewportRepeat } from '@/lib/motion';

const IMG_1 =
  'https://images.pexels.com/photos/37728130/pexels-photo-37728130.jpeg';
const IMG_2 =
  'https://upload.wikimedia.org/wikipedia/commons/4/41/Wood-fired-kilns.jpg';

const captionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

export default function VillageStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      id="lang-nghe"
      className="max-w-6xl mx-auto px-6 py-24 md:py-32 overflow-hidden"
    >
      <div className="grid md:grid-cols-12 gap-12">
        <motion.div
          className="md:col-span-4"
          variants={revealText}
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
        >
          <SectionLabel number="01">Làng nghề</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Bảy thế kỷ
            <br />
            giữ lửa lò gốm.
          </h2>
        </motion.div>

        <div className="md:col-span-8 grid sm:grid-cols-2 gap-8">
          <div>
            <motion.div style={{ y: y1 }}>
              <motion.div
                variants={maskReveal}
                initial="hidden"
                whileInView="show"
                viewport={viewportRepeat}
                className="relative aspect-[4/3] overflow-hidden bg-[#1f1b18]/5 rounded-sm group"
              >
                <img
                  src={IMG_1}
                  alt="Nghệ nhân đang nặn gốm trên bàn xoay trong xưởng gia đình"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>
            </motion.div>
            <motion.p
              variants={captionVariants}
              initial="hidden"
              whileInView="show"
              viewport={viewportRepeat}
              className="mt-5 text-sm text-[#1f1b18]/60 leading-relaxed"
            >
              Hình thành từ thế kỷ XIV–XV, khi các dòng họ làm gốm từ Ninh Bình
              di cư đến vùng Bạch Thổ phường. Nhờ nguồn đất sét trắng dồi dào,
              Bát Tràng dần trở thành trung tâm gốm sứ của phía bắc.
            </motion.p>
          </div>

          <div className="sm:mt-16">
            <motion.div style={{ y: y2 }}>
              <motion.div
                variants={maskReveal}
                initial="hidden"
                whileInView="show"
                viewport={viewportRepeat}
                className="relative aspect-[4/3] overflow-hidden bg-[#1f1b18]/5 rounded-sm group"
              >
                <img
                  src={IMG_2}
                  alt="Lò nung củi truyền thống xếp chồng trong làng gốm"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>
            </motion.div>
            <motion.p
              variants={captionVariants}
              initial="hidden"
              whileInView="show"
              viewport={viewportRepeat}
              className="mt-5 text-sm text-[#1f1b18]/60 leading-relaxed"
            >
              Năm 2019, nghề gốm Bát Tràng được công nhận là Di sản Văn hóa phi
              vật thể quốc gia. Mỗi công đoạn — từ chọn đất, nhào nặn, vẽ tay
              đến nung lò — đều đòi hỏi sự kiên nhẫn.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}