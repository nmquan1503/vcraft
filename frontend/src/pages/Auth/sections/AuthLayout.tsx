import { Link } from 'react-router-dom';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  quote?: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  eyebrow, title, subtitle, quote, children,
}: Props) {
  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen pt-16">
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Cột trái — ảnh + quote */}
        <div className="relative hidden md:block bg-[#1f1b18] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&q=80)',
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-[#1f1b18] via-[#1f1b18]/40 to-transparent">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] mb-4">
              vCraft — Triển lãm số Bát Tràng
            </p>
            {quote && (
              <blockquote className="font-serif text-2xl md:text-3xl italic text-[#f6f1ea] leading-snug max-w-md">
                “{quote}”
              </blockquote>
            )}
          </div>
        </div>

        {/* Cột phải — form */}
        <div className="flex flex-col justify-center px-6 py-16 md:px-16 max-w-md w-full mx-auto">
          <Link to="/" className="font-serif text-2xl mb-12 inline-block self-start">
            vCraft<span className="text-[#b45f3c]">.</span>
          </Link>

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            {eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#1f1b18]/50 leading-relaxed mb-8">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}