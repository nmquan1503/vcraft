import { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
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

const createPinIcon = (isOpen: boolean, isActive = false) => {
  const color = isOpen ? '#b45f3c' : '#1f1b18';
  const size = isActive ? 34 : 26;
  const dotSize = isActive ? 14 : 11;

  return divIcon({
    className: 'vcraft-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: ${isActive ? `${color}20` : 'transparent'};
        border: ${isActive ? `1px solid ${color}80` : '1px solid transparent'};
        transition: all 300ms ease;
      ">
        <div style="
          width: ${dotSize}px;
          height: ${dotSize}px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #f6f1ea;
          box-shadow: 0 2px 8px rgba(31,27,24,0.3);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

function FlyToActive({
  pins,
  activeId,
}: {
  pins: MapPin[];
  activeId: string | null;
}) {
  const map = useMap();
  const lastActive = useRef<string | null>(null);

  const activePin = useMemo(
    () => pins.find((pin) => pin.id === activeId),
    [pins, activeId]
  );

  useEffect(() => {
    if (!activeId || !activePin) {
      lastActive.current = null;
      return;
    }

    if (activePin.lat == null || activePin.lng == null) return;

    const positionKey = `${activeId}-${activePin.lat}-${activePin.lng}`;

    if (lastActive.current === positionKey) return;

    map.flyTo(
      [activePin.lat, activePin.lng],
      Math.max(map.getZoom(), 17),
      {
        duration: 1,
        easeLinearity: 0.25,
      }
    );

    lastActive.current = positionKey;
  }, [activeId, activePin, map]);

  return null;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
    });

    observer.observe(container);

    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [map]);

  return null;
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute bottom-5 left-5 z-[400] flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-[#1f1b18]/10 bg-[#f6f1ea]/95 px-4 py-3 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#b45f3c] ring-2 ring-[#b45f3c]/20" />
        <span className="text-[9px] uppercase tracking-[0.14em] text-[#1f1b18]/65">
          Đang mở
        </span>
      </div>

      <span className="h-3 w-px bg-[#1f1b18]/15" />

      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1f1b18]" />
        <span className="text-[9px] uppercase tracking-[0.14em] text-[#1f1b18]/65">
          Đã đóng
        </span>
      </div>
    </div>
  );
}

export default function VillageMap({
  pins,
  activeId,
  onMarkerClick,
}: Props) {
  const openIcon = useMemo(() => createPinIcon(true), []);
  const closedIcon = useMemo(() => createPinIcon(false), []);
  const activeOpenIcon = useMemo(() => createPinIcon(true, true), []);
  const activeClosedIcon = useMemo(() => createPinIcon(false, true), []);

  const validPins = useMemo(
    () => pins.filter((pin) => pin.lat != null && pin.lng != null),
    [pins]
  );

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-tl-[55px] rounded-tr-[8px] rounded-bl-[8px] rounded-br-[55px] border border-[#1f1b18]/10 bg-[#e8e2d9] shadow-[0_18px_50px_rgba(31,27,24,0.07)] sm:h-[540px] sm:rounded-tl-[75px] sm:rounded-br-[75px] lg:h-[650px]">
      <div className="pointer-events-none absolute left-5 top-5 z-[400] flex items-center gap-3 rounded-full border border-[#1f1b18]/10 bg-[#f6f1ea]/95 px-4 py-2.5 shadow-sm backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />

        <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/65">
          Bản đồ tương tác
        </span>
      </div>

      <MapContainer
        center={BAT_TRANG_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={13}
        maxZoom={19}
        scrollWheelZoom
        className="z-0 h-full w-full"
        style={{ background: '#e8e2d9' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {validPins.map((pin) => {
          const isActive = activeId === pin.id;

          const icon = isActive
            ? pin.openStatus
              ? activeOpenIcon
              : activeClosedIcon
            : pin.openStatus
              ? openIcon
              : closedIcon;

          return (
            <Marker
              key={pin.id}
              position={[pin.lat!, pin.lng!]}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick(pin.id),
              }}
            >
              <Popup
                closeButton
                autoPan
                autoPanPadding={[40, 40]}
                maxWidth={260}
                minWidth={210}
              >
                <div className="min-w-[210px] overflow-hidden font-sans text-[#1f1b18]">
                  {pin.thumbnail ? (
                    <div className="mb-3 h-28 overflow-hidden rounded-tl-[28px] rounded-br-[28px] bg-[#1f1b18]/5">
                      <img
                        src={pin.thumbnail}
                        alt={pin.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-20 items-center justify-center rounded-tl-[28px] rounded-br-[28px] bg-[#b45f3c]/[0.07]">
                      <span className="font-serif text-3xl italic text-[#b45f3c]/50">
                        {pin.name?.charAt(0) || 'G'}
                      </span>
                    </div>
                  )}

                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        pin.openStatus ? 'bg-[#b45f3c]' : 'bg-[#1f1b18]/35'
                      }`}
                    />

                    <span
                      className={`text-[9px] uppercase tracking-[0.16em] ${
                        pin.openStatus
                          ? 'text-[#b45f3c]'
                          : 'text-[#1f1b18]/45'
                      }`}
                    >
                      {pin.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
                    </span>
                  </div>

                  <h3 className="mb-2 font-serif text-xl leading-tight">
                    {pin.name}
                  </h3>

                  {pin.phone && (
                    <p className="mb-4 text-[11px] text-[#1f1b18]/50">
                      {pin.phone}
                    </p>
                  )}

                  <Link
                    to={`/artisans/${pin.id}`}
                    className="inline-flex items-center gap-2 border-b border-[#b45f3c]/40 pb-1 text-[9px] uppercase tracking-[0.16em] text-[#b45f3c] transition-colors hover:border-[#b45f3c] hover:text-[#8f462c]"
                  >
                    Khám phá xưởng
                    <span className="text-sm">↗</span>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FlyToActive pins={validPins} activeId={activeId} />
        <MapResizeHandler />
      </MapContainer>

      {validPins.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center px-6">
          <div className="max-w-xs border border-[#1f1b18]/10 bg-[#f6f1ea]/95 px-8 py-7 text-center shadow-lg backdrop-blur-md">
            <span className="font-serif text-3xl italic text-[#b45f3c]/60">
              ✳
            </span>

            <h3 className="mt-3 font-serif text-xl text-[#1f1b18]">
              Chưa có vị trí xưởng.
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#1f1b18]/45">
              Hiện chưa có xưởng nào được cập nhật tọa độ trên bản đồ.
            </p>
          </div>
        </div>
      )}

      <MapLegend />
    </div>
  );
}