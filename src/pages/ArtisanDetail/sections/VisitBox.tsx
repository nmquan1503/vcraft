import { Link } from 'react-router-dom';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function VisitBox({ artisan }: Props) {
  const hasLocation =
    artisan.latitude !== null && artisan.longitude !== null;

  return (
    <section className="bg-[#1f1b18] text-[#f6f1ea] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-4">
            Ghé thăm xưởng
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Đến tận nơi,
            <br />
            xem nghệ nhân làm việc.
          </h2>
          <p className="mt-5 text-sm text-[#f6f1ea]/60 leading-relaxed max-w-md">
            {artisan.openStatus
              ? 'Xưởng đang mở cửa đón khách. Bạn có thể ghé thăm, xem quy trình và tự tay thử một vòng bàn xoay.'
              : 'Xưởng hiện đang đóng cửa. Theo dõi bản đồ làng nghề để biết khi nào mở lại.'}
          </p>
        </div>

        <div className="md:col-span-5 md:text-right">
          {hasLocation ? (
            <Link
              to="/map"
              className="inline-flex items-center bg-[#d9a08b] text-[#1f1b18] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#f6f1ea] transition-colors"
            >
              Mở bản đồ làng nghề
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-widest text-[#f6f1ea]/40">
              Chưa cập nhật vị trí
            </p>
          )}
          <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/40">
            {artisan.address}
          </p>
        </div>
      </div>
    </section>
  );
}