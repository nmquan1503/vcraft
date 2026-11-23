import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

interface Props {
  images: string[];
  productName: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const main = images[active] ?? null;

  useEffect(() => {
    if (active >= images.length && images.length > 0) setActive(0);
  }, [active, images.length]);

  // Keyboard: ←/→ đổi ảnh khi gallery trong viewport
  useEffect(() => {
    if (images.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);

  // Mobile: auto-scroll thumbnail active vào view
  useEffect(() => {
    if (images.length <= 1) return;
    thumbRefs.current[active]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [active, images.length]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1f1b18]/5 shadow-[0_20px_60px_-30px_rgba(31,27,24,0.25)]"
      >
        <AnimatePresence mode="wait">
          {main ? (
            <motion.img
              key={main}
              src={main}
              alt={productName}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.08]"
            />
          ) : (
            <ImagePlaceholder
              key="placeholder"
              label={productName}
              aspect="aspect-[4/5]"
              tone="clay"
            />
          )}
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-[#f6f1ea] rounded-full px-3 py-1 text-[10px] font-mono tabular-nums tracking-wider">
            {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        )}
      </motion.div>

      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="mt-3 flex gap-2 overflow-x-auto sm:grid sm:grid-cols-5 sm:overflow-visible pb-1 -mb-1 scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {images.map((img, i) => (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el; }}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className={`group relative shrink-0 w-16 h-16 sm:w-auto sm:h-auto sm:aspect-square overflow-hidden rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b45f3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1ea] ${
                i === active
                  ? 'ring-2 ring-[#1f1b18] ring-offset-2 ring-offset-[#f6f1ea]'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <span
                className={`absolute inset-0 bg-[#1f1b18] transition-opacity duration-300 ${
                  i === active ? 'opacity-0' : 'opacity-[0.08] group-hover:opacity-0'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}