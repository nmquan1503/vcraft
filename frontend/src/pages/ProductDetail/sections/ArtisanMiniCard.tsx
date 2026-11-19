import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanMiniCard({ artisan }: Props) {
  const img = artisan.images[0] ?? null;

  return (
    <section className="bg-[#f6f1ea] py-20 md:py-24 border-t border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            {img ? (
              <div className="aspect-[4/5] overflow-hidden">
                <img src={img} alt={artisan.workshopName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <ImagePlaceholder label={artisan.workshopName} aspect="aspect-[4/5]" tone="sand" />
            )}
          </div>
          <div className="md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">Nghệ nhân sản xuất</p>
            <h2 className="font-serif text-2xl md:text-4xl leading-tight">{artisan.ownerName}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[#1f1b18]/50">{artisan.workshopName}</p>
            {artisan.description && (
              <p className="mt-5 text-sm text-[#1f1b18]/70 leading-relaxed max-w-xl">{artisan.description}</p>
            )}
            {artisan.familyHistory && (
              <div className="mt-5 border-l-2 border-[#b45f3c]/40 pl-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#b45f3c]/70 mb-1">Lịch sử gia đình</p>
                <p className="font-serif text-base md:text-lg italic text-[#1f1b18]/80">“{artisan.familyHistory}”</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${artisan.openStatus ? 'bg-green-600' : 'bg-[#1f1b18]/30'}`} />
                {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
              </span>
              <span>{artisan.certificates.length} chứng nhận</span>
            </div>
            <Link to={`/artisans/${artisan.id}`} className="mt-6 inline-flex items-center text-xs uppercase tracking-widest border-b border-[#1f1b18] pb-1 hover:text-[#b45f3c] hover:border-[#b45f3c] transition-colors">
              Xem hồ sơ đầy đủ →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}