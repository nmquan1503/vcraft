import type { ReactNode } from 'react';

interface Props {
  number: string;
  children: ReactNode;
}

export default function SectionLabel({ number, children }: Props) {
  return (
    <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c]/80 mb-6">
      N° {number} — {children}
    </p>
  );
}