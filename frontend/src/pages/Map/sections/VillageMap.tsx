import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import type { MapPin } from '@/types';

interface Props {
  pins: MapPin[];
  activeId: string | null;
  onMarkerClick: (id: string) => void;
}

const BAT_TRANG_CENTER: [number, number] = [20.975953, 105.912491];
const DEFAULT_ZOOM = 15;

/* ─── Custom ghim tròn: đỏ gốm nếu mở, mực nếu đóng ─── */
const createPinIcon = (isOpen: boolean) =>
  divIcon({
    className: 'vcraft-pin',
    html: `<div style="
      width: 18px; height: 18px;
      border-radius: 50%;
      background: ${isOpen ? '#b45f3c' : '#1f1b18'};
      border: 3px solid #f6f1ea;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });

/* ─── Fly tới marker khi activeId đổi ─── */
function FlyToActive({
  pins,
  activeId,
}: {
  pins: MapPin[];
  activeId: string | null;
}) {
  const map = useMap();
  const lastActive = useRef<string | null>(null);

  useEffect(() => {
    if (!activeId || activeId === lastActive.current) return;
    const pin = pins.find((p) => p.id === activeId);
    if (pin && pin.lat != null && pin.lng != null) {
      map.flyTo([pin.lat, pin.lng], 17, { duration: 0.8 });
      lastActive.current = activeId;
    }
  }, [activeId, pins, map]);

  return null;
}

export default function VillageMap({
  pins,
  activeId,
  onMarkerClick,
}: Props) {
  const openIcon = useMemo(() => createPinIcon(true), []);
  const closedIcon = useMemo(() => createPinIcon(false), []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden border border-[#1f1b18]/10">
      <MapContainer
        center={BAT_TRANG_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#e8e2d9' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pins.map((pin) => {
          if (pin.lat == null || pin.lng == null) return null;
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pin.openStatus ? openIcon : closedIcon}
              eventHandlers={{
                click: () => onMarkerClick(pin.id),
              }}
            >
              <Popup>
                <div className="font-sans text-[#1f1b18] min-w-[200px]">
                  {pin.thumbnail && (
                    <img
                      src={pin.thumbnail}
                      alt={pin.name}
                      className="w-full h-24 object-cover mb-2"
                    />
                  )}
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#b45f3c] mb-1">
                    {pin.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
                  </p>
                  <h3 className="font-serif text-base leading-tight mb-1">
                    {pin.name}
                  </h3>
                  <p className="text-[11px] text-[#1f1b18]/50 mb-2">
                    {pin.phone}
                  </p>
                  <Link
                    to={`/artisans/${pin.id}`}
                    className="text-[10px] uppercase tracking-widest text-[#b45f3c] hover:underline"
                  >
                    Xem xưởng →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FlyToActive pins={pins} activeId={activeId} />
      </MapContainer>
    </div>
  );
}