import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import './AuthLayout.css';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  quote?: string;
  children: React.ReactNode;
}

const PARTICLES = [
  { left: '12%', delay: '0s',   dur: '14s', drift: '20px'  },
  { left: '28%', delay: '3s',   dur: '18s', drift: '-15px' },
  { left: '44%', delay: '6s',   dur: '16s', drift: '25px'  },
  { left: '62%', delay: '1.5s', dur: '20s', drift: '-20px' },
  { left: '78%', delay: '4.5s', dur: '15s', drift: '18px'  },
  { left: '88%', delay: '8s',   dur: '19s', drift: '-12px' },
];

export default function AuthLayout({
  eyebrow, title, subtitle, quote, children,
}: Props) {
  const quoteWords = useMemo(
    () => (quote ? quote.split(' ').filter(Boolean) : []),
    [quote]
  );

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] h-[100dvh] overflow-hidden pt-16">
      <div className="grid md:grid-cols-2 h-full">
        
        <div className="auth-panel-left auth-grain relative hidden md:block h-full bg-[#1f1b18] overflow-hidden">
          <div
            className="auth-ken-burns absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&q=80)' }}
            aria-hidden="true"
          />
          
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1f1b18] via-[#1f1b18]/60 to-transparent pointer-events-none" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="auth-particle"
                style={{
                  left: p.left,
                  bottom: '-10px',
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                  ['--drift' as string]: p.drift,
                }}
              />
            ))}
          </div>

          {/* Dùng bottom-[8%] thay vì bottom-8 để đồng nhất theo tỷ lệ màn hình */}
          <div className="absolute bottom-[8%] left-0 right-0 px-5 md:px-7 lg:px-10 z-10">
            <p className="text-[10px] md:text-[11px] lg:text-[13px] uppercase tracking-[0.22em] md:tracking-[0.26em] lg:tracking-[0.3em] text-[#d9a08b] mb-2 md:mb-3">
              BatTrang Craft — Triển lãm số Bát Tràng
            </p>
            {quoteWords.length > 0 && (
              <blockquote className="font-serif text-lg md:text-xl lg:text-2xl xl:text-3xl italic text-[#f6f1ea] leading-snug max-w-lg">
                <span aria-hidden="true">“</span>
                {quoteWords.map((w, i) => (
                  <span key={i} className="auth-word" style={{ ['--i' as string]: i }}>
                    {w}{i < quoteWords.length - 1 ? '\u00A0' : ''}
                  </span>
                ))}
                <span aria-hidden="true">”</span>
              </blockquote>
            )}
          </div>
        </div>

        <div className="auth-panel-right h-full overflow-y-auto flex flex-col justify-start pt-20 md:pt-24 pb-12 px-5 sm:px-8 md:px-12 lg:px-16 max-w-xl w-full mx-auto">
          <Link to="/" className="font-serif text-2xl mb-4 sm:mb-6 inline-block self-start transition-colors">
            BatTrang <span className="text-[#b45f3c]">Craft</span>
          </Link>

          <div className="auth-stagger">
            <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#b45f3c] mb-2 font-semibold" style={{ ['--i' as string]: 0 }}>
              {eyebrow}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight mb-2" style={{ ['--i' as string]: 1 }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#1f1b18]/55 leading-relaxed mb-4 sm:mb-5" style={{ ['--i' as string]: 2 }}>
                {subtitle}
              </p>
            )}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}