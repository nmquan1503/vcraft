import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import SectionLabel from '@/components/ui/SectionLabel';
import type { ArtisanProfile } from '@/types';
import {
  staggerFast,
  revealText,
  zoomUp,
  maskReveal,
  viewportRepeat,
} from '@/lib/motion';

interface Props {
  artisans: ArtisanProfile[];
  loading: boolean;
}

export default function ArtisanSpotlight({ artisans, loading }: Props) {
  return (
    <section
      id="nghe-nhan"
      className="w-full bg-[#f6f1ea] py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-12 gap-12 lg:gap-20">
        <div className="md:col-span-4 relative">
          <motion.div
            className="md:sticky md:top-32 origin-top-left"
            variants={revealText}
            initial="hidden"
            whileInView="show"
            viewport={viewportRepeat}
          >
            <SectionLabel number="03">Nghệ nhân</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Đôi tay
              <br />
              <em className="italic text-[#b45f3c]">giữ hồn đất.</em>
            </h2>
            <p className="text-base text-[#1f1b18]/60 leading-relaxed max-w-sm">
              Mỗi nghệ nhân là một câu chuyện riêng — về gia đình, về lửa, và về
              những mùa gốm nối tiếp nhau qua bao thế hệ.
            </p>
            <Link
              to="/artisans"
              className="mt-8 inline-block text-xs uppercase tracking-widest border-b border-[#1f1b18]/30 pb-1 hover:text-[#b45f3c] hover:border-[#b45f3c] transition-colors"
            >
              Xem tất cả nghệ nhân
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="md:col-span-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#1f1b18]/5 rounded-sm" />
                <div className="mt-4 h-6 bg-[#1f1b18]/5 w-2/3 rounded-sm" />
                <div className="mt-2 h-4 bg-[#1f1b18]/5 w-1/3 rounded-sm" />
              </div>
            ))
          ) : artisans.length === 0 ? (
            <p className="col-span-full text-sm text-[#1f1b18]/40">
              Chưa có nghệ nhân nào được duyệt.
            </p>
          ) : (
            artisans.map((a) => {
              const img = a.images?.[0];
              return (
                <motion.div key={a.id} variants={zoomUp} className="group">
                  <Link to={`/artisans/${a.id}`} className="block cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#1f1b18]/5 rounded-sm">
                      <motion.div variants={maskReveal} className="w-full h-full">
                        {img ? (
                          <img
                            src={img}
                            alt={a.workshopName}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <ImagePlaceholder
                            label={a.workshopName}
                            aspect="aspect-[3/4]"
                            tone="sand"
                            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                      </motion.div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="absolute bottom-6 right-6 w-10 h-10 bg-[#f6f1ea] text-[#1f1b18] rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {a.openStatus && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1f1b18] px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                          Đang mở
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      <h3 className="font-serif text-2xl group-hover:text-[#b45f3c] transition-colors duration-300">
                        {a.workshopName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-[#1f1b18]/70">{a.ownerName}</span>
                        <span className="w-1 h-1 rounded-full bg-[#1f1b18]/30" />
                        <span className="text-[10px] uppercase tracking-widest text-[#b45f3c]/80">
                          {a.district}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}