import { Fragment, useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtisanCard from '@/components/ui/ArtisanCard';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisans: ArtisanProfile[];
  loading: boolean;
}

const DARK_ROW_BG = '#ebe4d7';
const LIGHT_ROW_BG = '#f6f1ea';
const EASE = [0.22, 1, 0.36, 1] as const;
const BLOCK_SIZE = 6;

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function groupIntoBlocks(items: ArtisanProfile[]): ArtisanProfile[][] {
  const blocks: ArtisanProfile[][] = [];
  for (let i = 0; i < items.length; i += BLOCK_SIZE) {
    blocks.push(items.slice(i, i + BLOCK_SIZE));
  }
  return blocks;
}

function ZigzagDivider({ direction }: { direction: 'up' | 'down' }) {
  const id = useId().replace(/:/g, '-');
  const path =
    direction === 'down' ? 'M0,16 L14,0 L28,16 Z' : 'M0,0 L14,16 L28,0 Z';
  return (
    <div
      className="relative w-full h-4 md:h-5 pointer-events-none"
      style={{ backgroundColor: DARK_ROW_BG }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 1440 16"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width="28"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path d={path} fill={LIGHT_ROW_BG} />
          </pattern>
        </defs>
        <rect width="1440" height="16" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="group
        [&_div:has(>img)]:rounded-2xl
        [&_div:has(>img)]:overflow-hidden
        [&_div:has(>img)]:transition-shadow
        [&_div:has(>img)]:duration-500
        [&_div:has(>img)]:group-hover:shadow-[0_24px_48px_-24px_rgba(31,27,24,0.32)]
        [&_img]:transition-transform
        [&_img]:duration-700
        [&_img]:ease-out
        [&_img]:will-change-transform
        [&_img]:group-hover:scale-[1.09]"
    >
      {children}
    </div>
  );
}

export default function ArtisanGrid({ artisans, loading }: Props) {
  const blocks = useMemo(() => groupIntoBlocks(artisans), [artisans]);
  const signature = useMemo(
    () => `${artisans.length}-${artisans[0]?.id ?? 'empty'}`,
    [artisans]
  );

  if (loading) {
    return (
      <section
        className="max-w-6xl mx-auto px-6 py-12 md:py-16"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-[#1f1b18]/5 rounded-2xl" />
              <div className="mt-5 h-6 bg-[#1f1b18]/5 w-2/3 rounded-sm" />
              <div className="mt-2 h-4 bg-[#1f1b18]/5 w-1/3 rounded-sm" />
            </div>
          ))}
        </div>
        <span className="sr-only">Đang tải danh sách nghệ nhân…</span>
      </section>
    );
  }

  if (artisans.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1f1b18]/5 mb-6">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[#1f1b18]/30"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" strokeLinecap="round" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-serif text-xl md:text-2xl text-[#1f1b18]/60">
          Không tìm thấy nghệ nhân nào
        </p>
        <p className="mt-2 text-sm text-[#1f1b18]/40 max-w-md mx-auto">
          Thử từ khoá khác, hoặc xoá tìm kiếm để xem toàn bộ danh sách.
        </p>
      </section>
    );
  }

  return (
    <section key={signature} className="relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: NOISE_BG }}
        aria-hidden="true"
      />

      {blocks.map((block, blockIdx) => {
        const isDark = blockIdx % 2 === 0;
        const showZigzag = blockIdx > 0;
        const zigzagDirection: 'up' | 'down' = blockIdx % 2 === 0 ? 'down' : 'up';

        return (
          <Fragment key={blockIdx}>
            {showZigzag && <ZigzagDivider direction={zigzagDirection} />}
            <div
              className="relative"
              style={isDark ? { backgroundColor: DARK_ROW_BG } : undefined}
            >
              <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
                  {block.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                    >
                      <CardShell>
                        <ArtisanCard artisan={a} />
                      </CardShell>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}