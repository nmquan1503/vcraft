import type { CSSProperties } from 'react';
import { useReveal } from '@/hooks/useReveal';

const MASK = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='3' seed='4'/><feDisplacementMap in='SourceGraphic' scale='34'/></filter><path filter='url(%23f)' fill='black' d='M100 18 C148 14 186 52 184 100 C182 150 146 186 98 184 C50 182 14 148 16 100 C18 54 54 22 100 18 Z'/></svg>")`;

interface Props {
  src?: string;
  alt: string;
  ratio?: string;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ImageReveal({
  src,
  alt,
  ratio = '4/5',
  delay = 0,
  className = '',
  style,
}: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`image-reveal ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div
        className="image-reveal-inner"
        style={{
          transitionDelay: `${delay}s`,
          WebkitMaskImage: MASK,
          maskImage: MASK,
        }}
      >
        {src ? (
          <img src={src} alt={alt} loading="lazy" />
        ) : (
          <div className="image-placeholder">
            <span>{alt}</span>
          </div>
        )}
      </div>
    </div>
  );
}