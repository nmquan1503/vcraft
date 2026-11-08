import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Bộ sưu tập', to: '/products' },
  { label: 'Nghệ nhân', to: '/artisans' },
  { label: 'Bản đồ làng nghề', to: '/map' },
  { label: 'Lô sản xuất', to: '/batches' },
  { label: 'Tin tức', to: '/news' },
  { label: 'Liên hệ', to: '/contact' },
  { label: 'Đăng nhập', to: '/login' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Khóa scroll body khi menu mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Đóng bằng Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Thanh header cố định */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#f6f1ea]/80 backdrop-blur-md border-b border-[#1f1b18]/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl text-[#1f1b18]">
            vCraft<span className="text-[#b45f3c]">.</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
          >
            <span className="w-6 h-px bg-[#1f1b18] transition-all group-hover:w-5" />
            <span className="w-6 h-px bg-[#1f1b18]" />
            <span className="w-6 h-px bg-[#1f1b18] transition-all group-hover:w-5" />
          </button>
        </div>
      </header>

      {/* Overlay full-screen */}
      <div
        className={`fixed inset-0 z-[60] bg-[#1f1b18] text-[#f6f1ea] transition-all duration-500 ease-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex flex-col">
          {/* Header trong overlay */}
          <div className="h-16 flex items-center justify-between shrink-0">
            <span className="font-serif text-2xl">
              vCraft<span className="text-[#d9a08b]">.</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
              className="w-10 h-10 flex items-center justify-center text-2xl hover:text-[#d9a08b] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Links căn giữa */}
          <nav className="flex-1 flex flex-col justify-center gap-1">
            {LINKS.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl md:text-6xl leading-tight py-2 hover:text-[#d9a08b] transition-colors"
                style={{
                  transitionDelay: open ? `${i * 60}ms` : '0ms',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer overlay */}
          <div className="shrink-0 py-8 border-t border-[#f6f1ea]/10 flex flex-wrap gap-6 justify-between text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/50">
            <span>Bát Tràng, Gia Lâm, Hà Nội</span>
            <span>hello@vcraft.vn</span>
            <span>© 2026 vCraft</span>
          </div>
        </div>
      </div>
    </>
  );
}