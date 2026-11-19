import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import SectionLabel from '@/components/ui/SectionLabel';

interface Props {
  openCount: number | null;
}

export default function MapPreview({ openCount }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <SectionLabel number="05">Ghé thăm</SectionLabel>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6">
            Mở bản đồ,
            <br />
            tìm xưởng đang mở cửa.
          </h2>
          <p className="text-sm text-[#1f1b18]/60 leading-relaxed max-w-md">
            Không chỉ xem sản phẩm — bạn có thể đến tận xưởng, xem nghệ nhân làm
            việc và tự tay thử một vòng bàn xoay.
          </p>

          {openCount !== null && openCount > 0 && (
            <p className="mt-6 flex items-center gap-2 text-sm text-[#b45f3c]">
              <span className="w-2 h-2 rounded-full bg-[#b45f3c]" />
              {openCount} xưởng đang mở cửa đón khách hôm nay
            </p>
          )}

          <Link
            to="/map"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Mở bản đồ làng nghề
          </Link>
        </div>
        <ImagePlaceholder
          label="Ảnh bản đồ làng nghề Bát Tràng"
          aspect="aspect-[4/3]"
          tone="sand"
        />
      </div>
    </section>
  );
}