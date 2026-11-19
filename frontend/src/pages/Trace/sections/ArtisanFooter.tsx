import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanFooter({ artisan }: Props) {
  const img = artisan.images[0] ?? null;

  return (
    <section className="bg-[#1f1b18] text-[#f6f1ea] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-4">
          {img ? (
            <div className="aspect-square overflow-hidden">
              <img
                src={img}
                alt={artisan.workshopName}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={artisan.workshopName}
              aspect="aspect-square"
              tone="sand"
            />
          )}
        </div>

        <div className="md:col-span-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-5">
            Người làm ra lô gốm này
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            {artisan.ownerName}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[#f6f1ea]/50">
            {artisan.workshopName}
          </p>

          {artisan.familyHistory && (
            <p className="mt-6 font-serif text-lg md:text-xl italic text-[#f6f1ea]/70 leading-snug max-w-lg">
              “{artisan.familyHistory}”
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/50">
            <span className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  artisan.openStatus ? 'bg-green-400' : 'bg-[#f6f1ea]/30'
                }`}
              />
              {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
            </span>
            <span>{artisan.address}</span>
          </div>

          <Link
            to={`/artisans/${artisan.id}`}
            className="mt-8 inline-flex items-center text-xs uppercase tracking-widest border-b border-[#d9a08b]/40 pb-1 text-[#d9a08b] hover:text-[#f6f1ea] hover:border-[#f6f1ea] transition-colors"
          >
            Xem hồ sơ xưởng →
          </Link>
        </div>
      </div>
    </section>
  );
}