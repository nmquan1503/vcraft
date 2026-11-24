import { Link } from 'react-router-dom';

import ImagePlaceholder from './ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanCard({ artisan }: Props) {
  const img = artisan.images?.[0] ?? null;

  return (
    <Link
      to={`/artisans/${artisan.id}`}
      className="group block"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#e9e1d7]">
        <div className="aspect-[4/5] overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={artisan.workshopName}
              loading="lazy"
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-[1.05]
              "
            />
          ) : (
            <ImagePlaceholder
              label={artisan.workshopName}
              aspect="aspect-[4/5]"
              tone="sand"
              className="
                h-full w-full
                transition-transform duration-700 ease-out
                group-hover:scale-[1.03]
              "
            />
          )}
        </div>

        {/* Image overlay */}
        <div className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t from-[#1f1b18]/45 via-transparent to-transparent
          opacity-70 transition-opacity duration-500
          group-hover:opacity-100
        " />

        {/* Open status */}
        {artisan.openStatus && (
          <div className="
            absolute left-4 top-4
            inline-flex items-center gap-2
            bg-[#f6f1ea]/95 px-3 py-2
            backdrop-blur-sm
          ">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#78916b] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#78916b]" />
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#526b55]">
              Đang mở cửa
            </span>
          </div>
        )}

        {/* District */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/85">
            {artisan.district}
          </span>
        </div>

        {/* Arrow */}
        <div className="
          absolute bottom-4 right-4
          flex h-10 w-10 translate-y-2 items-center justify-center
          rounded-full bg-[#f6f1ea] text-[#b45f3c]
          opacity-0 transition-all duration-500
          group-hover:translate-y-0 group-hover:opacity-100
        ">
          <span className="text-lg">↗</span>
        </div>
      </div>

      {/* Information */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="
              font-serif text-xl leading-tight tracking-tight
              text-[#1f1b18]
              transition-colors duration-300
              group-hover:text-[#b45f3c]
              sm:text-2xl
            ">
              {artisan.ownerName}
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-[#1f1b18]/55">
              {artisan.workshopName}
            </p>
          </div>

          <span className="
            mt-1 shrink-0
            font-serif text-xl italic
            text-[#b45f3c]/35
            transition-colors duration-300
            group-hover:text-[#b45f3c]
          ">
            ↗
          </span>
        </div>

        {/* Bottom line */}
        <div className="
          mt-5 flex items-center justify-between
          border-t border-[#1f1b18]/10 pt-3
        ">
          <span className="text-[9px] uppercase tracking-[0.18em] text-[#1f1b18]/35">
            Nghệ nhân Bát Tràng
          </span>

          <span className="
            text-[9px] font-medium uppercase tracking-[0.16em]
            text-[#b45f3c]
            transition-transform duration-300
            group-hover:translate-x-1
          ">
            Khám phá →
          </span>
        </div>
      </div>
    </Link>
  );
}