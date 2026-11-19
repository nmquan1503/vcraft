import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  style,
  threshold = 0.15,
}: Props) {
  const ref = useReveal<HTMLDivElement>(threshold);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}