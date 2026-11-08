import { Link } from 'react-router-dom';
import NewsTypeBadge from './NewsTypeBadge';
import type { News } from '@/types';

interface Props {
  news: News;
}

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
};

const excerpt = (content: string, max = 140) => {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
};

export default function NewsCard({ news }: Props) {
  const img = news.images[0] ?? null;

  return (
    <Link
      to={`/news/${news.id}`}
      className="group block border border-[#1f1b18]/10 hover:border-[#1f1b18]/30 transition-colors overflow-hidden"
    >
      {/* Ảnh */}
      <div className="aspect-[16/10] bg-[#1f1b18]/5 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={news.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#1f1b18]/20 text-xs uppercase tracking-widest">
            {news.type === 'PRICE' && 'Giá cả'}
            {news.type === 'SCHEDULE' && 'Lịch'}
            {news.type === 'POLICY' && 'Chính sách'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <NewsTypeBadge type={news.type} />
          <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
            {fmt(news.publishedAt)}
          </span>
        </div>

        <h3 className="font-serif text-xl leading-tight group-hover:text-[#b45f3c] transition-colors">
          {news.title}
        </h3>

        <p className="mt-3 text-sm text-[#1f1b18]/60 leading-relaxed">
          {excerpt(news.content)}
        </p>

        <div className="mt-4 pt-4 border-t border-[#1f1b18]/10 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
            Ban quản lý
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#b45f3c] group-hover:underline">
            Đọc tiếp →
          </span>
        </div>
      </div>
    </Link>
  );
}