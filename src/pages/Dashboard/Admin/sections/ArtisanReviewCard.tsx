import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  processing: boolean;
}

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch { return iso; }
};

export default function ArtisanReviewCard({
  artisan,
  onApprove,
  onReject,
  processing,
}: Props) {
  const img = artisan.images[0] ?? null;

  return (
    <div className="border border-[#1f1b18]/10 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Ảnh */}
        <div className="md:w-48 md:shrink-0">
          {img ? (
            <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
              <img
                src={img}
                alt={artisan.workshopName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={artisan.workshopName}
              aspect="aspect-[4/3]"
              tone="sand"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-serif text-xl leading-tight">
                {artisan.workshopName}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50 mt-1">
                {artisan.ownerName} · {artisan.phone}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#b45f3c] shrink-0">
              Chờ duyệt
            </span>
          </div>

          <p className="mt-3 text-sm text-[#1f1b18]/60 leading-relaxed line-clamp-2">
            {artisan.address}
          </p>
          {artisan.description && (
            <p className="mt-2 text-sm text-[#1f1b18]/60 leading-relaxed line-clamp-2">
              {artisan.description}
            </p>
          )}
          {artisan.familyHistory && (
            <p className="mt-2 text-xs italic text-[#1f1b18]/50 line-clamp-2 border-l-2 border-[#b45f3c]/30 pl-3">
              “{artisan.familyHistory}”
            </p>
          )}

          <div className="mt-3 text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
            Đăng ký {fmt(artisan.createdAt)}
            {artisan.certificates.length > 0 &&
              ` · ${artisan.certificates.length} chứng nhận`}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onApprove(artisan.id)}
              disabled={processing}
              className="bg-[#1f1b18] text-[#f6f1ea] rounded-full px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Đang xử lý…' : '✓ Duyệt'}
            </button>
            <button
              onClick={() => onReject(artisan.id)}
              disabled={processing}
              className="border border-red-500/40 text-red-600 rounded-full px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Từ chối
            </button>
            <Link
              to={`/artisans/${artisan.id}`}
              className="text-[10px] uppercase tracking-widest text-[#1f1b18]/50 hover:text-[#b45f3c] self-center transition-colors"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}