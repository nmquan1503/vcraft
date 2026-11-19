import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanHero({ artisan }: Props) {
  const heroImg = artisan.images[0] ?? null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16">
      <Link
        to="/artisans"
        className="inline-block mb-12 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
      >
        ← Tất cả nghệ nhân
      </Link>

      <div className="grid md:grid-cols-12 gap-12 items-end">
        {/* Ảnh lớn */}
        <div className="md:col-span-5">
          {heroImg ? (
            <div className="aspect-[3/4] overflow-hidden bg-[#1f1b18]/5">
              <img
                src={heroImg}
                alt={artisan.workshopName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={artisan.workshopName}
              aspect="aspect-[3/4]"
              tone="sand"
            />
          )}
        </div>

        {/* Info */}
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#b45f3c] mb-5">
            Nghệ nhân · {artisan.district}
          </p>

          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
            {artisan.ownerName}
          </h1>

          <p className="mt-4 text-lg md:text-xl text-[#1f1b18]/70 leading-snug">
            {artisan.workshopName}
          </p>

          {artisan.description && (
            <p className="mt-6 text-sm md:text-base text-[#1f1b18]/60 leading-relaxed max-w-lg">
              {artisan.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-[#1f1b18]/10 pt-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
                Trạng thái
              </p>
              <p className="mt-2 text-sm flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    artisan.openStatus ? 'bg-green-600' : 'bg-[#1f1b18]/30'
                  }`}
                />
                <span className="text-[#1f1b18]/70">
                  {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
                Điện thoại
              </p>
              <p className="mt-2 text-sm text-[#1f1b18]/70">
                {artisan.phone}
              </p>
            </div>
            {artisan.certificates.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
                  Chứng nhận
                </p>
                <p className="mt-2 text-sm text-[#1f1b18]/70">
                  {artisan.certificates.length} bằng cấp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}