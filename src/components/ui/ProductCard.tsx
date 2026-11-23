import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ImagePlaceholder from './ImagePlaceholder';
import type { Product } from '@/types';

interface Props {
  product: Product;
  variant?: 'default' | 'featured';
}

export default function ProductCard({
  product,
  variant = 'default',
}: Props) {
  const img = product.images?.[0];
  const isFeatured = variant === 'featured';

  const formattedPrice = Number(product.price || 0).toLocaleString('vi-VN');

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block min-w-0"
    >
      <motion.div
        whileHover="hover"
        initial="rest"
        animate="rest"
        className="relative"
      >
        <div
          className={`
            relative isolate overflow-hidden bg-[#e9dfd3]
            ${isFeatured
              ? 'aspect-[5/4] rounded-tl-[100px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[100px] sm:rounded-tl-[130px] sm:rounded-br-[130px]'
              : 'aspect-[4/5] rounded-tl-[65px] rounded-tr-[14px] rounded-bl-[14px] rounded-br-[65px] sm:rounded-tl-[85px] sm:rounded-br-[85px]'
            }
          `}
        >
          {img ? (
            <motion.img
              src={img}
              alt={product.name}
              loading="lazy"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.055 },
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder
              label={product.name}
              aspect={isFeatured ? 'aspect-[5/4]' : 'aspect-[4/5]'}
              tone="clay"
              className="h-full w-full"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1b18]/35 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" />

          <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-[#f6f1ea]/85 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18] backdrop-blur-md sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />
              Tác phẩm thủ công
            </span>
          </div>

          <motion.div
            variants={{
              rest: { opacity: 0, y: 8 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f1ea] text-[#1f1b18] shadow-lg sm:bottom-5 sm:right-5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <div
        className={`
          mt-4 flex min-w-0
          ${isFeatured
            ? 'flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5'
            : 'flex-col gap-2'
          }
        `}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-5 bg-[#b45f3c]/70" />
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/40 sm:text-[10px]">
              Gốm Bát Tràng
            </span>
          </div>

          <h3
            className={`
              font-serif leading-[1.2] tracking-[-0.025em]
              transition-colors duration-300
              group-hover:text-[#b45f3c]
              break-words
              ${isFeatured
                ? 'text-2xl sm:text-3xl lg:text-4xl'
                : 'text-xl sm:text-[22px]'
              }
            `}
          >
            {product.name}
          </h3>

          {isFeatured && product.description && (
            <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#1f1b18]/55 sm:text-sm line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div
          className={`
            flex shrink-0 items-center
            ${isFeatured
              ? 'justify-between border-t border-[#1f1b18]/10 pt-3 sm:justify-end sm:border-0 sm:pt-1'
              : 'justify-between border-t border-[#1f1b18]/10 pt-3'
            }
          `}
        >
          <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/40 sm:hidden">
            Giá tham khảo
          </span>

          <p
            className={`
              font-medium tracking-tight text-[#b45f3c]
              ${isFeatured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}
            `}
          >
            {formattedPrice}
            <span className="ml-1 text-[10px]">₫</span>
          </p>
        </div>
      </div>
    </Link>
  );
}