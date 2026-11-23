import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
}

export default function FilterBar({ search, onSearchChange, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onSearchChange('');
    inputRef.current?.focus();
  }, [onSearchChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (search) {
          e.preventDefault();
          handleClear();
        } else {
          inputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [search, handleClear]);

  return (
    <div className="sticky top-14 md:top-16 z-30 bg-[#f6f1ea]/95 backdrop-blur-lg border-b border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6 py-3 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-6">
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#1f1b18]/45">
            Tìm theo tên xưởng hoặc nghệ nhân
          </p>

          <div className="relative w-full sm:w-80 min-w-0">
            <input
              ref={inputRef}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ví dụ: Phạm Văn A, xưởng men lam…"
              disabled={loading}
              aria-label="Tìm nghệ nhân"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              className="w-full appearance-none bg-transparent border border-[#1f1b18]/15 rounded-full pl-4 pr-16 py-2 text-sm placeholder:text-[#1f1b18]/30 focus:outline-none focus:border-[#b45f3c] hover:border-[#b45f3c]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-moz-search-cancel-button]:hidden"
            />

            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <AnimatePresence>
                {search && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    aria-label="Xoá tìm kiếm"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-full text-[#1f1b18]/40 hover:text-[#1f1b18] hover:bg-[#1f1b18]/5 active:scale-95 transition-[color,background-color,transform] duration-200"
                  >
                    <span aria-hidden="true" className="text-xs">✕</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <span
                className="w-7 h-7 inline-flex items-center justify-center text-[#1f1b18]/35 pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" strokeLinecap="round" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] overflow-hidden transition-opacity duration-300 pointer-events-none ${
          loading ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#b45f3c]/60 to-transparent animate-pulse" />
      </div>
    </div>
  );
}