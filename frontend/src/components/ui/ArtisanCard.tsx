import { Link } from 'react-router-dom';
import ImagePlaceholder from './ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanCard({ artisan }: Props) {
  const img = artisan.images[0] ?? null;

  return (
    <Link to={`/artisans/${artisan.id}`} className="group block">
      {img ? (
        <div className="aspect-[4/5] overflow-hidden bg-[#1f1b18]/5">
          <img
            src={img}
            alt={artisan.workshopName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <ImagePlaceholder
          label={artisan.workshopName}
          aspect="aspect-[4/5]"
          tone="sand"
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
      )}

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
          {artisan.ownerName}
        </h3>
        {artisan.openStatus && (
          <span className="text-[10px] uppercase tracking-widest text-[#b45f3c] flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45f3c]" />
            Mở cửa
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-[#1f1b18]/60">{artisan.workshopName}</p>
      <p className="mt-2 text-[11px] uppercase tracking-widest text-[#1f1b18]/40">
        {artisan.district}
      </p>
    </Link>
  );
}