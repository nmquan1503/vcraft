import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard/admin', label: 'Tổng quan', exact: true },
  { to: '/dashboard/admin/artisans', label: 'Kiểm duyệt xưởng' },
  { to: '/dashboard/admin/news', label: 'Quản lý tin tức' },
];

export default function AdminNav() {
  const { pathname } = useLocation();

  return (
    <nav className="border-b border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="flex flex-wrap gap-1 -mb-px">
          {LINKS.map((l) => {
            const active = l.exact
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