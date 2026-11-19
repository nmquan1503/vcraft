import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './Header.css';

const LINKS = [
  { label: 'Trang chủ', to: '/', num: '01', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', desc: 'Triển lãm số Bát Tràng' },
  { label: 'Bộ sưu tập', to: '/products', num: '02', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', desc: 'Sản phẩm độc bản' },
  { label: 'Nghệ nhân', to: '/artisans', num: '03', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', desc: 'Đôi tay giữ hồn đất' },
  { label: 'Lô sản xuất', to: '/batches', num: '04', img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', desc: 'Nhật ký sản xuất' },
  { label: 'Bản đồ', to: '/map', num: '05', img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80', desc: 'Làng nghề đang mở' },
  { label: 'Tin tức', to: '/news', num: '06', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80', desc: 'Chuyện làng nghề' },
  { label: 'Báo giá sỉ', to: '/quote', num: '07', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', desc: 'Nhận chào giá từ nhiều xưởng' },
];

const SHORTCUTS = [
  { label: 'Bộ sưu tập', to: '/products' },
  { label: 'Bản đồ', to: '/map' },
  { label: 'Báo giá sỉ', to: '/quote' },
];

const MARQUEE_ITEMS = [
  'BatTrang Craft · Bát Tràng',
  'Từ năm 1352',
  'Bảy thế kỷ đất và lửa',
  'Men lam · Men rạn · Men nâu',
];

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const getHanoiTime = () =>
  new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  });

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [time, setTime] = useState(getHanoiTime);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const isArtisan = user?.role === 'ARTISAN';
  const profileHref = isArtisan ? '/dashboard/artisan' : '/quote';
  const displayName = user?.fullName ?? user?.email ?? 'Người dùng';
  const initial = (user?.fullName?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const id = setInterval(() => setTime(getHanoiTime()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !open;
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    if (pathname.startsWith('/dashboard')) navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? 'bg-[#f6f1ea]/95 backdrop-blur-xl shadow-[0_1px_24px_-6px_rgba(31,27,24,0.08)]'
            : 'bg-[#f6f1ea]/70 backdrop-blur-md'
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
          style={{ backgroundImage: NOISE_BG }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1b18]/15 to-transparent" />
        </div>

        <div
          className={`relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-12 lg:px-20 transition-[height] duration-300 ${
            scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
          }`}
        >
          <Link
            to="/"
            className="justify-self-start group flex items-baseline gap-2 shrink-0 min-w-0"
          >
            <span className="font-serif text-lg sm:text-xl md:text-2xl text-[#1f1b18] tracking-tight whitespace-nowrap">
              BatTrang <em className="italic text-[#b45f3c]">Craft</em>
            </span>
            <span className="hidden lg:inline text-[9px] font-mono uppercase tracking-[0.3em] text-[#1f1b18]/40 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-100 opacity-70">
              est. 1352
            </span>
          </Link>

          <nav className="hidden md:flex items-center justify-self-center gap-1">
            {SHORTCUTS.map((s) => {
              const active =
                pathname === s.to || pathname.startsWith(s.to + '/');
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`group relative px-3 lg:px-4 py-2 text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? 'text-[#b45f3c]'
                      : 'text-[#1f1b18]/60 hover:text-[#1f1b18]'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`w-1 h-1 rounded-full bg-[#b45f3c] transition-all duration-300 ${
                        active
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100'
                      }`}
                    />
                    {s.label}
                  </span>
                  <span
                    className={`absolute bottom-1 left-3 right-3 lg:left-4 lg:right-4 h-px bg-[#b45f3c] origin-left transition-transform duration-300 ${
                      active
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="justify-self-end flex items-center gap-2 md:gap-2.5 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-[#1f1b18]/10 rounded-full bg-[#f6f1ea]/60 mr-0.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#3f8a4a] opacity-60 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#3f8a4a]" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1f1b18]/55 tabular-nums">
                HN · {time}
              </span>
            </div>

            {isAuthenticated ? (
              <Link
                to={profileHref}
                aria-label="Tài khoản"
                className="group relative inline-flex items-center justify-center md:justify-start shrink-0 w-9 h-9 md:w-auto md:h-auto md:pl-1 md:pr-3 md:py-1 rounded-full border border-[#1f1b18]/15 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-[border-color,background-color,transform] duration-300 active:scale-[0.97]"
              >
                <span className="w-7 h-7 rounded-full bg-[#b45f3c] text-[#f6f1ea] flex items-center justify-center text-[11px] font-semibold uppercase shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]">
                  {initial}
                </span>
                <span className="hidden md:inline ml-2 text-[11px] font-medium text-[#1f1b18]/70 group-hover:text-[#b45f3c] max-w-[7.5rem] truncate transition-colors">
                  {displayName}
                </span>
              </Link>
            ) : (
              <Link
                to={`/login?redirect=${encodeURIComponent(pathname)}`}
                aria-label="Đăng nhập"
                className="group inline-flex items-center justify-center md:justify-start shrink-0 gap-0 md:gap-2 w-9 h-9 md:w-auto md:h-auto md:px-3.5 md:py-2 rounded-full border border-[#1f1b18]/15 text-[#1f1b18]/65 hover:border-[#b45f3c] hover:text-[#b45f3c] hover:bg-[#b45f3c]/5 transition-[border-color,color,background-color,transform] duration-300 active:scale-[0.97]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden md:inline text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.25em] whitespace-nowrap">
                  Đăng nhập
                </span>
              </Link>
            )}

            <button
              onClick={() => setOpen(true)}
              aria-label="Mở menu"
              className="group relative inline-flex items-center shrink-0 gap-2 md:gap-3 pl-4 pr-2 md:pl-5 md:pr-2.5 py-1.5 md:py-2 rounded-full bg-[#1f1b18] text-[#f6f1ea] shadow-[0_6px_20px_-8px_rgba(31,27,24,0.4)] hover:bg-[#b45f3c] hover:shadow-[0_8px_24px_-8px_rgba(180,95,60,0.55)] transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.97]"
            >
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] whitespace-nowrap">
                Menu
              </span>
              <span className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#f6f1ea]/10 group-hover:bg-[#f6f1ea]/20 transition-colors duration-300 flex flex-col items-center justify-center gap-[3px]">
                <span className="w-3.5 md:w-4 h-[1.5px] bg-[#f6f1ea] rounded-full transition-all duration-300 group-hover:w-2.5 md:group-hover:w-3" />
                <span className="w-3.5 md:w-4 h-[1.5px] bg-[#f6f1ea] rounded-full transition-all duration-300" />
                <span className="w-3.5 md:w-4 h-[1.5px] bg-[#f6f1ea] rounded-full transition-all duration-300 group-hover:w-2.5 md:group-hover:w-3" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        className={`fixed inset-0 z-[60] bg-[#1f1b18] text-[#f6f1ea] header-backdrop transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          open
            ? '[clip-path:inset(0_0_0_0)] pointer-events-auto'
            : '[clip-path:inset(0_0_100%_0)] pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col">
          <div className="h-16 flex items-center justify-between shrink-0">
            <span className="font-serif text-xl md:text-2xl">
              BatTrang <em className="italic text-[#d9a08b]">Craft</em>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
              className="group inline-flex items-center gap-2 md:gap-3 pl-4 pr-2 md:pl-5 md:pr-2.5 py-1.5 md:py-2 rounded-full border border-[#f6f1ea]/20 hover:border-[#d9a08b] hover:bg-[#d9a08b]/10 transition-[background-color,border-color,transform] duration-300 active:scale-[0.97]"
            >
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f6f1ea]/70 group-hover:text-[#d9a08b] transition-colors whitespace-nowrap">
                Đóng
              </span>
              <span className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#f6f1ea]/10 group-hover:bg-[#d9a08b]/20 flex items-center justify-center text-base md:text-lg text-[#f6f1ea]/80 group-hover:text-[#d9a08b] group-hover:rotate-90 transition-all duration-300">
                ✕
              </span>
            </button>
          </div>

          <div className="flex-1 grid grid-rows-1 md:grid-cols-12 gap-8 md:gap-12 py-3 md:py-4 min-h-0">
            <nav className="md:col-span-7 flex flex-col min-h-0 overflow-y-auto overscroll-contain">
              <div className="my-auto w-full py-2">
                <div className="flex items-baseline gap-4 md:gap-8 pb-2.5 mb-1 border-b border-[#f6f1ea]/15">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b]/70 w-12">
                    Số
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b]/70 flex-1">
                    Mục lục
                  </span>
                </div>

                {LINKS.map((link, i) => {
                  const isActive =
                    pathname === link.to ||
                    (link.to !== '/' && pathname.startsWith(link.to + '/'));
                  const isHovered = hovered === i;
                  const isDimmed = hovered !== null && hovered !== i;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className="group relative block py-1.5 md:py-2 shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d9a08b]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18] rounded-sm"
                      style={{
                        opacity: open ? (isDimmed ? 0.25 : 1) : 0,
                        transform: open ? 'translateY(0)' : 'translateY(24px)',
                        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${
                          0.12 + i * 0.05
                        }s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${
                          0.12 + i * 0.05
                        }s`,
                      }}
                    >
                      <div className="flex items-baseline gap-4 md:gap-8">
                        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] shrink-0 pt-1.5 w-12">
                          {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a08b]" />
                          ) : (
                            <span className="w-1.5 h-1.5" />
                          )}
                          <span className={isActive ? 'text-[#d9a08b]' : 'text-[#d9a08b]/60'}>
                            {link.num}
                          </span>
                        </span>

                        <div className="flex-1 relative overflow-hidden">
                          <span
                            className={`block font-serif font-medium text-xl md:text-2xl lg:text-3xl leading-[1.25] tracking-tight transition-transform duration-500 ease-out group-hover:-translate-y-full ${
                              isActive ? 'text-[#d9a08b]' : 'text-[#f6f1ea]'
                            }`}
                          >
                            {link.label}
                          </span>
                          <span
                            className="absolute inset-0 block font-serif font-medium text-xl md:text-2xl lg:text-3xl leading-[1.25] tracking-tight text-[#d9a08b] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                            aria-hidden="true"
                          >
                            {link.label}
                          </span>
                        </div>

                        <span
                          className={`hidden md:inline-block text-[11px] uppercase tracking-[0.2em] shrink-0 pt-1.5 transition-all duration-300 ${
                            isHovered
                              ? 'text-[#d9a08b] translate-x-1'
                              : 'text-[#f6f1ea]/40 translate-x-0'
                          }`}
                        >
                          →
                        </span>
                      </div>

                      <span className="absolute bottom-0 left-[calc(3rem+1rem)] md:left-[calc(3rem+2rem)] right-0 h-px bg-[#d9a08b]/20 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                    </Link>
                  );
                })}

                <div className="mt-4 pt-3 border-t border-[#f6f1ea]/10">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-[#d9a08b] text-[#1f1b18] flex items-center justify-center font-serif text-base font-semibold uppercase shrink-0">
                          {initial}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#f6f1ea] truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-[#f6f1ea]/50 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {isArtisan && (
                          <>
                            <Link
                              to="/dashboard/artisan"
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b] hover:text-[#f6f1ea] transition-colors"
                            >
                              Dashboard xưởng
                              <span aria-hidden="true">→</span>
                            </Link>
                            <Link
                              to="/dashboard/artisan/profile"
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b]/80 hover:text-[#f6f1ea] transition-colors"
                            >
                              Hồ sơ xưởng
                              <span aria-hidden="true">→</span>
                            </Link>
                          </>
                        )}
                        <Link
                          to="/quote"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b]/80 hover:text-[#f6f1ea] transition-colors"
                        >
                          Yêu cầu báo giá
                          <span aria-hidden="true">→</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f6f1ea]/45 hover:text-[#e85555] transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link
                        to={`/login?redirect=${encodeURIComponent(pathname)}`}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b] hover:text-[#f6f1ea] transition-colors"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          aria-hidden="true"
                        >
                          <path
                            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Đăng nhập
                        <span aria-hidden="true">→</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f6f1ea]/60 hover:text-[#f6f1ea] transition-colors"
                      >
                        Đăng ký
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            <div className="md:col-span-5 relative hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center">
                {LINKS.map((link, i) => (
                  <div
                    key={link.to}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                      hovered === i
                        ? 'opacity-100 scale-100 rotate-0 z-10'
                        : 'opacity-0 scale-[0.85] rotate-[-12deg] pointer-events-none z-0'
                    }`}
                  >
                    <div className="w-full max-w-[220px]">
                      <div className="bg-[#f6f1ea] p-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={link.img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9a08b]">
                          {link.desc}
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#f6f1ea]/40 tabular-nums">
                          {link.num} / 07
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
                    hovered === null ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="font-serif text-xl italic text-[#d9a08b]/50 text-center max-w-xs leading-relaxed">
                    Đưa chuột lên
                    <br />
                    để xem câu chuyện
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="w-8 h-px bg-[#d9a08b]/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a08b]/50" />
                    <span className="w-8 h-px bg-[#d9a08b]/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-3 pb-5 border-t border-[#f6f1ea]/10">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#f6f1ea]/50 mb-3">
              <span>Bát Tràng, Gia Lâm, Hà Nội</span>
              <a
                href="mailto:hello@battrangcraft.vn"
                className="hover:text-[#d9a08b] transition-colors"
              >
                hello@battrangcraft.vn
              </a>
              <a
                href="tel:02438751234"
                className="hover:text-[#d9a08b] transition-colors"
              >
                024 3875 1234
              </a>
              <span className="tabular-nums">{time} · Hà Nội</span>
            </div>

            <div className="overflow-hidden">
              <div
                className={`flex whitespace-nowrap font-serif text-sm text-[#d9a08b]/50 header-marquee ${
                  !open ? 'header-marquee--paused' : ''
                }`}
              >
                {[0, 1].map((group) => (
                  <div key={group} className="flex gap-8 pr-8 shrink-0">
                    {MARQUEE_ITEMS.map((item, idx) => (
                      <span
                        key={`${group}-${idx}`}
                        className="flex items-center gap-8 shrink-0"
                      >
                        <span>{item}</span>
                        <span className="text-[#d9a08b]/30">✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}