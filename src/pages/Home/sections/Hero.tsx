import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-20">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#b45f3c] mb-8">
            Làng gốm Bát Tràng — từ thế kỷ XIV
          </p>
          <h1 className="font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight">
            Đất qua tay người,
            <br />
            <em className="text-[#b45f3c] italic">thành gốm</em> qua lửa.
          </h1>
          <p className="mt-8 max-w-md text-[#1f1b18]/60 leading-relaxed text-sm md:text-base">
            vCraft là triển lãm số của làng gốm Bát Tràng — nơi mỗi hộ gia đình
            kể câu chuyện làm nghề, trưng bày sản phẩm độc bản và mở xưởng đón
            khách ghé thăm.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
            >
              Khám phá bộ sưu tập
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center border border-[#1f1b18]/20 rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:border-[#b45f3c] hover:text-[#b45f3c] transition-colors"
            >
              Bản đồ làng nghề
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <ImagePlaceholder
            label="Ảnh bàn xoay gốm Bát Tràng"
            aspect="aspect-[3/4]"
            tone="clay"
          />
        </div>
      </div>
    </section>
  );
}