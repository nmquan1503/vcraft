interface Props {
  label: string;
  aspect?: string;
  tone?: 'clay' | 'sand' | 'smoke';
  className?: string;
}

const TONES = {
  clay: 'bg-gradient-to-br from-[#d9a08b] via-[#c47e5c] to-[#8f4a2e]',
  sand: 'bg-gradient-to-br from-[#efe3d3] via-[#e2cdb4] to-[#c9a882]',
  smoke: 'bg-gradient-to-br from-[#d8d2c8] via-[#beb6a9] to-[#9a9184]',
};

export default function ImagePlaceholder({
  label,
  aspect = 'aspect-[4/5]',
  tone = 'clay',
  className = '',
}: Props) {
  return (
    <div
      className={`${aspect} ${TONES[tone]} ${className} relative overflow-hidden rounded-sm flex items-end p-5`}
    >
      <span className="text-xs uppercase tracking-[0.25em] text-white/70">
        {label}
      </span>
    </div>
  );
}