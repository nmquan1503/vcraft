import { useState } from 'react';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

interface Props {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? null;

  return (
    <div>
      {main ? (
        <div className="aspect-[4/5] overflow-hidden bg-[#1f1b18]/5">
          <img src={main} alt={productName} className="w-full h-full object-cover" />
        </div>
      ) : (
        <ImagePlaceholder label={productName} aspect="aspect-[4/5]" tone="clay" />
      )}

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={`aspect-square overflow-hidden border-2 transition-all ${
                i === active ? 'border-[#1f1b18]' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}