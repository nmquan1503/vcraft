import { Link } from 'react-router-dom';
import NewsTypeBadge from './NewsTypeBadge';
import type { News } from '@/types';

interface Props {
  news: News;
}

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const excerpt = (content: string, max = 140) => {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
};

const TYPE_LABELS: Record<News['type'], string> = {
  PRICE: 'Giá nguyên liệu',
  SCHEDULE: 'Lịch sinh hoạt',
  POLICY: 'Chính sách',
};

export default function NewsCard({ news }: Props) {
  const img = news.images?.[0] ?? null;

  return (
    <Link
      to={`/news/${news.id}`}
      className="
        group relative flex h-full flex-col
        border-b border-[#1f1b18]/15
        transition-colors duration-500
        hover:border-[#b45f3c]
      "
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e1d7]">
        {img ? (
          <img
            src={img}
            alt={news.title}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-[1.05]
            "
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
            <div className="absolute h-48 w-48 rounded-full border border-[#b45f3c]/15" />
            <div className="absolute h-32 w-32 rounded-full border border-[#b45f3c]/20" />

            <span className="relative font-serif text-6xl italic text-[#b45f3c]/40">
              B
            </span>

            <span className="relative mt-3 text-[9px] uppercase tracking-[0.25em] text-[#1f1b18]/40">
              {TYPE_LABELS[news.type]}
            </span>
          </div>
        )}

        {/* Image overlay label */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex bg-[#f6f1ea]/90 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18] backdrop-blur-sm">
            {TYPE_LABELS[news.type]}
          </span>
        </div>

        {/* Hover indicator */}
        <div className="
          absolute right-4 top-4 flex h-10 w-10
          translate-y-2 items-center justify-center
          rounded-full bg-[#f6f1ea] text-[#b45f3c]
          opacity-0 transition-all duration-500
          group-hover:translate-y-0 group-hover:opacity-100
        ">
          ↗
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pb-6 pt-5 sm:pt-6">
        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <NewsTypeBadge type={news.type} />

          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#1f1b18]/35">
            {fmt(news.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="
          font-serif text-[clamp(1.25rem,2vw,1.65rem)]
          leading-[1.2] tracking-tight
          text-[#1f1b18]
          transition-colors duration-300
          group-hover:text-[#b45f3c]
        ">
          {news.title}
        </h3>

        {/* Excerpt */}
        <p className="
          mt-4 flex-1 text-[13px] leading-[1.85]
          text-[#1f1b18]/55
        ">
          {excerpt(news.content)}
        </p>

        {/* Footer */}
        <div className="
          mt-6 flex items-center justify-between
          border-t border-[#1f1b18]/10 pt-4
        ">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-[#b45f3c]/60" />

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/40">
              Ban quản lý
            </span>
          </div>

          <span className="
            inline-flex items-center gap-2
            text-[10px] font-medium uppercase tracking-[0.16em]
            text-[#b45f3c]
          ">
            Đọc tiếp

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}