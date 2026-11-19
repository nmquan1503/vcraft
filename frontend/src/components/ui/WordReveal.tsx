import type { CSSProperties, ElementType } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
}

export default function WordReveal({
  text,
  as: Tag = 'h2',
  className = '',
  style,
  stagger = 0.04,
}: Props) {
  const ref = useReveal<HTMLElement>();
  const words = text.split(' ');

  return (
    <Tag ref={ref as never} className={`word-reveal ${className}`} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word"
          style={{ transitionDelay: `${i * stagger}s` }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}