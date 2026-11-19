import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { viewportRepeat } from '@/lib/motion';

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const DISCOVER_LINKS = [
  { to: '/products', label: 'Sản phẩm' },
  { to: '/artisans', label: 'Nghệ nhân' },
  { to: '/batches', label: 'Lô sản xuất' },
];

const VISIT_LINKS = [
  { to: '/map', label: 'Bản đồ' },
  { to: '/visit', label: 'Đặt lịch' },
  { to: '/quote', label: 'Báo giá sỉ' },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <p className="text-xs uppercase tracking-[0.25em] text-[#1f1b18]/45 mb-5">
        {title}
      </p>
      <ul className="space-y-3 text-base text-[#1f1b18]/70">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[#b45f3c]"
            >
              <span className="relative">
                {l.label}
                <span className="absolute left-0 bottom-0 h-px w-0 bg-[#b45f3c] transition-all duration-300 group-hover:w-full" />
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden="true"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f6f1ea] text-[#1f1b18]">
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1b18]/15 to-transparent" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: NOISE_BG }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 60% at 12% 100%, rgba(180,95,60,0.07) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative container max-w-6xl pt-16 md:pt-20 lg:pt-24 pb-14 lg:pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportRepeat}
      >
        <motion.div
          variants={itemVariants}
          className="sm:col-span-2 lg:col-span-6"
        >
          <p className="font-serif text-4xl md:text-5xl leading-none">
            BatTrang <em className="italic text-[#b45f3c]">Craft</em>
          </p>
          <p className="mt-4 text-xs font-mono uppercase tracking-[0.35em] text-[#1f1b18]/45">
            est. 1352 — Bát Tràng
          </p>
          <p className="mt-6 text-base text-[#1f1b18]/60 max-w-sm leading-relaxed">
            Triển lãm số của làng gốm Bát Tràng. Giữ nghề, kể chuyện, mở xưởng đón khách.
          </p>
          <p className="mt-5 text-sm text-[#1f1b18]/50">
            Làng gốm Bát Tràng · Gia Lâm · Hà Nội
          </p>
        </motion.div>

        <LinkColumn title="Khám phá" links={DISCOVER_LINKS} />
        <LinkColumn title="Ghé thăm" links={VISIT_LINKS} />

        <motion.div
          variants={itemVariants}
          className="sm:col-span-2 lg:col-span-2 flex justify-center lg:justify-end items-start"
        >
          <div className="rotate-[-8deg] opacity-75">
            <svg
              viewBox="0 0 80 80"
              className="w-16 h-16 md:w-20 md:h-20"
              aria-hidden="true"
            >
              <circle cx="40" cy="40" r="36" fill="none" stroke="#e85555" strokeWidth="1.5" opacity="0.9" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#e85555" strokeWidth="0.5" opacity="0.7" />
              <text
                x="40"
                y="36"
                textAnchor="middle"
                fill="#e85555"
                fontSize="7"
                fontWeight="700"
                letterSpacing="1.5"
                fontFamily="serif"
              >
                BÁT TRÀNG
              </text>
              <line x1="16" y1="42" x2="64" y2="42" stroke="#e85555" strokeWidth="0.5" opacity="0.7" />
              <text
                x="40"
                y="52"
                textAnchor="middle"
                fill="#e85555"
                fontSize="6"
                fontFamily="serif"
                fontStyle="italic"
                letterSpacing="0.5"
                opacity="0.9"
              >
                est. 1352
              </text>
            </svg>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative container max-w-6xl" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1f1b18]/15 to-transparent" />
      </div>

      <div className="relative container max-w-6xl py-6 flex flex-wrap gap-3 items-center justify-between text-xs uppercase tracking-[0.22em] text-[#1f1b18]/45">
        <span>© 2026 BatTrang Craft — INT3306</span>
        <span className="hidden sm:inline">Gốm Bát Tràng · Từ đất đến lửa</span>
        <span className="sm:hidden">Gốm Bát Tràng</span>
      </div>
    </footer>
  );
}