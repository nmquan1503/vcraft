import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard/artisan', label: 'Tổng quan' },
  { to: '/dashboard/artisan/profile', label: 'Hồ sơ xưởng' },
  { to: '/dashboard/artisan/products/new', label: 'Đăng sản phẩm' },
  { to: '/dashboard/artisan/batches/new', label: 'Tạo lô mới' },
];

export default function DashboardNav() {
  const { pathname } = useLocation();

  return (
    <nav className="border-b border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="flex flex-wrap gap-1 -mb-px">
          {LINKS.map((l) => {
            const active =
              l.to === '/dashboard/artisan'
                ? pathname === l.to
                : pathname.startsWith(l.to);
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`inline-block px-4 py-3 text-[11px] uppercase tracking-widest border-b-2 transition-colors ${
                    active
                      ? 'border-[#b45f3c] text-[#1f1b18]'
                      : 'border-transparent text-[#1f1b18]/50 hover:text-[#b45f3c]'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}