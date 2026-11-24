import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import type { MapPin } from '@/types';

interface Props {
  pins: MapPin[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

export default function ArtisanSidebar({
  pins,
  activeId,
  onSelect,
}: Props) {
  if (pins.length === 0) {
    return (
      <div className="relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden border border-[#1f1b18]/10 bg-[#1f1b18]/[0.02] px-6 py-12 text-center">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#b45f3c]/10" />
        <div className="pointer-events-none absolute -right-7 -top-7 h-28 w-28 rounded-full border border-[#b45f3c]/10" />

        <span className="mb-4 font-serif text-4xl italic text-[#b45f3c]/60">
          ✳
        </span>

        <h3 className="font-serif text-xl text-[#1f1b18]">
          Chưa tìm thấy xưởng.
        </h3>

        <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-[#1f1b18]/45">
          Hãy thử thay đổi bộ lọc để khám phá thêm những xưởng gốm.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40">
            Khám phá
          </p>
          <h2 className="mt-1 font-serif text-2xl tracking-tight text-[#1f1b18]">
            Các xưởng gốm
          </h2>
        </div>

        <span className="font-serif text-2xl text-[#b45f3c]">
          {String(pins.length).padStart(2, '0')}
        </span>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="max-h-[600px] space-y-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#b45f3c33_transparent] [scrollbar-width:thin]"
      >
        {pins.map((pin, index) => {
          const isActive = activeId === pin.id;

          return (
            <motion.article
              key={pin.id}
              variants={itemVariants}
              className={`group relative overflow-hidden border transition-all duration-500 ${
                isActive
                  ? 'border-[#b45f3c]/40 bg-[#b45f3c]/[0.055]'
                  : 'border-[#1f1b18]/[0.08] bg-white/30 hover:border-[#b45f3c]/30 hover:bg-white/70'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-artisan-indicator"
                  className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#b45f3c]"
                  transition={{ duration: 0.4, ease }}
                />
              )}

              <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <button
                  type="button"
                  onClick={() => onSelect(pin.id)}
                  aria-pressed={isActive}
                  aria-label={`Chọn xưởng ${pin.name}`}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b45f3c] sm:gap-4"
                >
                  <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-tl-[26px] rounded-tr-[6px] rounded-bl-[6px] rounded-br-[26px] bg-[#1f1b18]/[0.06] sm:h-[76px] sm:w-[76px]">
                    {pin.thumbnail ? (
                      <img
                        src={pin.thumbnail}
                        alt={pin.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-serif text-2xl italic text-[#b45f3c]/50">
                        {pin.name?.charAt(0) || 'G'}
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1b18]/15 to-transparent opacity-60" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-[#1f1b18]/30">
                        Xưởng {String(index + 1).padStart(2, '0')}
                      </span>

                      {isActive && (
                        <span className="h-1 w-1 rounded-full bg-[#b45f3c]" />
                      )}
                    </div>

                    <h3
                      className={`truncate font-serif text-base leading-tight transition-colors duration-300 sm:text-lg ${
                        isActive
                          ? 'text-[#b45f3c]'
                          : 'text-[#1f1b18] group-hover:text-[#b45f3c]'
                      }`}
                    >
                      {pin.name}
                    </h3>

                    <div
                      className={`mt-2 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] sm:text-[10px] ${
                        pin.openStatus
                          ? 'text-[#b45f3c]'
                          : 'text-[#1f1b18]/35'
                      }`}
                    >
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        {pin.openStatus && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b45f3c]/40" />
                        )}
                        <span
                          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                            pin.openStatus
                              ? 'bg-[#b45f3c]'
                              : 'bg-[#1f1b18]/30'
                          }`}
                        />
                      </span>

                      {pin.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
                    </div>
                  </div>
                </button>

                <Link
                  to={`/artisans/${pin.id}`}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Xem chi tiết ${pin.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1f1b18]/10 text-sm text-[#1f1b18]/45 transition-all duration-300 hover:border-[#b45f3c] hover:bg-[#b45f3c] hover:text-[#f6f1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45f3c]"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </Link>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <div className="mt-3 flex items-center justify-between border-t border-[#1f1b18]/10 pt-3">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
          Làng gốm Bát Tràng
        </span>

        <span className="text-[10px] text-[#1f1b18]/35">
          {pins.filter((pin) => pin.openStatus).length} xưởng đang hoạt động
        </span>
      </div>
    </div>
  );
}