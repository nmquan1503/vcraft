import { Link } from 'react-router-dom';

export default function SplitCta() {
  return (
    <section className="grid md:grid-cols-2">
      <Link
        to="/map"
        className="bg-[#1f1b18] text-[#f6f1ea] flex items-center justify-center p-16 md:p-24 hover:bg-[#2a2520] transition-colors"
      >
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] mb-4">
            Dành cho du khách
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Ghé thăm <em className="not-italic text-[#d9a08b]">xưởng</em>
          </h2>
          <p className="mt-4 text-sm text-[#f6f1ea]/50 max-w-xs mx-auto">
            Xem bản đồ, đặt lịch trải nghiệm cùng nghệ nhân
          </p>
        </div>
      </Link>
      <Link
        to="/quote"
        className="bg-[#b45f3c] text-[#f6f1ea] flex items-center justify-center p-16 md:p-24 hover:bg-[#a0522f] transition-colors"
      >
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f6f1ea]/70 mb-4">
            Dành cho buyer
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Đặt hàng <em className="not-italic">sỉ</em>
          </h2>
          <p className="mt-4 text-sm text-[#f6f1ea]/70 max-w-xs mx-auto">
            Tạo yêu cầu báo giá, nhận chào giá từ nhiều xưởng
          </p>
        </div>
      </Link>
    </section>
  );
}