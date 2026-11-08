import { useRef, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  to: string;
  children: ReactNode;
  className?: string;
}

export default function MagneticButton({ to, children, className = '' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }

  return (
    <Link
      ref={ref}
      to={to}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {children}
    </Link>
  );
}