import { Link } from 'react-router-dom';
import type { MapPin } from '@/types';

interface Props {
  pins: MapPin[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ArtisanSidebar({ pins, activeId, onSelect }: Props) {
  if (pins.length === 0) {
    return (
      <div className="text-sm text-[#1f1b18]/40 p-6 border border-[#1f1b18]/10">
        Không có xưởng nào phù hợp.
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto divide-y divide-[#1f1b18]/10 border border-[#1f1b18]/10">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className={`p-4 transition-colors cursor-pointer ${
            activeId === pin.id ? 'bg-[#1f1b18]/5' : 'hover:bg-[#1f1b18]/5'
          }`}
          onClick={() => onSelect(pin.id)}
        >
          <div className="flex items-start gap-3">
            {pin.thumbnail ? (
              <img
                src={pin.thumbnail}
                alt={pin.name}
                className="w-14 h-14 object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 bg-[#1f1b18]/5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base leading-tight truncate">
                {pin.name}
              </p>
              <p
                className={`mt-1 text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${
                  pin.openStatus ? 'text-[#b45f3c]' : 'text-[#1f1b18]/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    pin.openStatus ? 'bg-[#b45f3c]' : 'bg-[#1f1b18]/30'
                  }`}
                />
                {pin.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
              </p>
            </div>
            <Link
              to={`/artisans/${pin.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] uppercase tracking-widest text-[#b45f3c] hover:underline shrink-0 self-center"
            >
              Xem →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}