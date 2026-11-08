import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1b18]/10 bg-[#f6f1ea] text-[#1f1b18]">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl">
            vCraft<span className="text-[#b45f3c]">.</span>
          </p>
          <p className="mt-4 text-sm text-[#1f1b18]/50 max-w-xs leading-relaxed">
            Triển lãm số của làng gốm Bát Tràng. Giữ nghề, kể chuyện, mở xưởng.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-4">
            Khám phá
          </p>
          <ul className="space-y-2 text-sm text-[#1f1b18]/60">
            <li>
              <Link to="/products" className="hover:text-[#b45f3c]">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/artisans" className="hover:text-[#b45f3c]">
                Nghệ nhân
              </Link>
            </li>
            <li>
              <Link to="/batches" className="hover:text-[#b45f3c]">
                Lô sản xuất
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-4">
            Ghé thăm
          </p>
          <ul className="space-y-2 text-sm text-[#1f1b18]/60">
            <li>
              <Link to="/map" className="hover:text-[#b45f3c]">
                Bản đồ
              </Link>
            </li>
            <li>
              <Link to="/visit" className="hover:text-[#b45f3c]">
                Đặt lịch
              </Link>
            </li>
            <li>
              <Link to="/quote" className="hover:text-[#b45f3c]">
                Báo giá sỉ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1f1b18]/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/30">
          <span>© 2026 vCraft — INT3306</span>
          <span>Gốm Bát Tràng</span>
        </div>
      </div>
    </footer>
  );
}