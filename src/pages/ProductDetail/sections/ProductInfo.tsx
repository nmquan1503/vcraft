import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '@/api';
import { getAccessToken } from '@/utils/tokenStorage';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const outOfStock = product.stock === 0;
  const maxQty = Math.min(Math.max(product.stock, 1), 10);

  const handleAddToCart = async () => {
    setMsg(null);
    if (!getAccessToken()) {
      setMsg('Vui lòng đăng nhập để thêm vào giỏ');
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem({ productId: product.id, quantity });
      setMsg('✓ Đã thêm vào giỏ');
    } catch {
      setMsg('Không thể thêm vào giỏ, thử lại sau');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-serif text-3xl md:text-5xl leading-tight">{product.name}</h1>
      <p className="mt-6 font-serif text-2xl md:text-3xl">
        {product.price.toLocaleString('vi-VN')} ₫
      </p>
      <p className={`mt-3 text-[11px] uppercase tracking-[0.2em] ${outOfStock ? 'text-red-600' : 'text-[#1f1b18]/50'}`}>
        {outOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
      </p>

      <div className="border-t border-[#1f1b18]/10 my-8" />

      {product.description && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-3">Mô tả</p>
          <p className="text-sm md:text-base text-[#1f1b18]/70 leading-relaxed">{product.description}</p>
        </div>
      )}

      {!outOfStock && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40">Số lượng</span>
            <div className="flex items-center border border-[#1f1b18]/20">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-9 h-9 text-[#1f1b18]/60 hover:text-[#1f1b18] disabled:opacity-30">−</button>
              <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className="w-9 h-9 text-[#1f1b18]/60 hover:text-[#1f1b18] disabled:opacity-30">+</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleAddToCart} disabled={adding} className="flex-1 bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors">
              {adding ? 'Đang thêm…' : 'Thêm vào giỏ'}
            </button>
            <Link to="/quote" className="flex-1 text-center border border-[#1f1b18]/20 rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:border-[#b45f3c] hover:text-[#b45f3c] transition-colors">
              Yêu cầu báo giá
            </Link>
          </div>

          {msg && (
            <p className={`text-xs uppercase tracking-widest ${msg.startsWith('✓') ? 'text-green-700' : 'text-[#b45f3c]'}`}>
              {msg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}