import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { viewportRepeat } from '@/lib/motion';

interface Panel {
  to: string;
  label: string;
  title: string;
  italic: string;
  desc: string;
  bg: string;
  accent: string;
}

const PANELS: Panel[] = [
  {
    to: '/map',
    label: 'Dành cho du khách',
    title: 'Ghé thăm',
    italic: 'xưởng',
    desc: 'Xem bản đồ, đặt lịch trải nghiệm cùng nghệ nhân.',
    bg: 'bg-[#1f1b18] hover:bg-[#26211b]',
    accent: 'text-[#d9a08b]',
  },
  {
    to: '/quote',
    label: 'Dành cho buyer',
    title: 'Đặt hàng',
    italic: 'sỉ',
    desc: 'Tạo yêu cầu báo giá, nhận chào giá từ nhiều xưởng.',
    bg: 'bg-[#b45f3c] hover:bg-[#a0522f]',
    accent: 'text-[#f6f1ea]',
  },
];

export default function SplitCta() {
  return (
    <section className="grid md:grid-cols-2">
      {PANELS.map((p, i) => (
        <motion.div
          key={p.to}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportRepeat}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to={p.to}
            className={`group relative flex flex-col items-center justify-center text-center text-[#f6f1ea] ${p.bg} px-8 py-16 md:py-24 min-h-[300px] transition-colors duration-300`}
          >
            <p className={`text-sm uppercase tracking-[0.3em] ${p.accent} mb-5`}>
              {p.label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              {p.title} <em className={`not-italic ${p.accent}`}>{p.italic}</em>
            </h2>
            <p className="mt-5 text-base md:text-lg text-[#f6f1ea]/65 max-w-[20rem] leading-relaxed">
              {p.desc}
            </p>
            <span
              className={`mt-8 inline-flex items-center justify-center w-12 h-12 rounded-full border border-current/30 ${p.accent} transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}