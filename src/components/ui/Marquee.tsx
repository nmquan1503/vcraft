import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function Marquee({ children, speed = 60, className = '' }: Props) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}