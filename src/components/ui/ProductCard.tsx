import { Link } from 'react-router-dom';
import ImagePlaceholder from './ImagePlaceholder';
import type { Product } from '@/types';

interface Props {
  product: Product;
  variant?: 'default' | 'featured';
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const img = product.images?.[0];
  const isFeatured = variant === 'featured';

  return (
    <Link to={`/products/${product.id}`} className="group block">
      {img ? (
        <div
          className={`overflow-hidden ${isFeatured ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
        >
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <ImagePlaceholder
          label={product.name}
          aspect={isFeatured ? 'aspect-[16/10]' : 'aspect-[4/5]'}
          tone="clay"
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
      )}

      <div className={`mt-5 ${isFeatured ? 'flex items-baseline justify-between gap-6' : ''}`}>
        <div>
          <h3
            className={`font-serif group-hover:text-[#b45f3c] transition-colors ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
            }`}
          >
            {product.name}
          </h3>
          {isFeatured && product.description && (
            <p className="mt-2 text-sm text-[#1f1b18]/50 leading-relaxed max-w-md line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <p
          className={`text-[#1f1b18]/40 ${
            isFeatured ? 'text-sm shrink-0' : 'text-xs mt-1'
          }`}
        >
          {product.price.toLocaleString('vi-VN')} ₫
        </p>
      </div>
    </Link>
  );
}