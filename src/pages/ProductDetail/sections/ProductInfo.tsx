import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cartApi } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

const EASE = [0.22, 1, 0.36, 1] as const;

type Msg = { type: 'ok' | 'err'; text: string };

export default function ProductInfo({ product }: Props) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  const outOfStock = product.stock === 0;
  const maxQty = Math.min(Math.max(product.stock, 1), 10);
  const atMax = quantity >= maxQty;
  const atMin = quantity <= 1;

  const handleAddToCart = async () => {
    setMsg(null);
    if (!isAuthenticated) {
      setMsg({ type: 'err', text: 'Vui lòng đăng nhập để thêm vào giỏ' });
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem({ productId: product.id, quantity });
      setMsg({ type: 'ok', text: 'Đã thêm vào giỏ' });
    } catch {
      setMsg({ type: 'err', text: 'Không thể thêm vào giỏ, thử lại sau' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      className="flex flex-col md:sticky md:top-24 md:self-start"
    >
      <h1 className="font-serif text-3xl md:text-5xl leading-[1.1] tracking-tight">
        {product.name}
      </h1>

      <p className="mt-6 font-serif text-2xl md:text-3xl tabular-nums">
        {product.price.toLocaleString('vi-VN')} ₫
      </p>

      <p
        className={`mt-3 text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 ${
          outOfStock ? 'text-red-600' : 'text-[#1f1b18]/55'
        }`}
      >
        {!outOfStock && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
        )}
        {outOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
      </p>

      <div
        className="my-8 h-px bg-gradient-to-r from-transparent via-[#1f1b18]/15 to-transparent"
        aria-hidden="true"
      />

      {product.description && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-3">
            Mô tả
          </p>
          <p className="text-sm md:text-base text-[#1f1b18]/70 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {!outOfStock && (
        <div className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/40">
              Số lượng
            </span>

            <div className="inline-flex items-center border border-[#1f1b18]/15 rounded-full overflow-hidden bg-[#1f1b18]/[0.02]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={atMin}
                aria-label="Giảm số lượng"
                className="w-9 h-9 text-lg text-[#1f1b18]/60 hover:text-[#1f1b18] hover:bg-[#1f1b18]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-200"
              >
                −
              </button>
              <span className="w-10 text-center text-sm tabular-nums font-medium select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={atMax}
                aria-label="Tăng số lượng"
                className="w-9 h-9 text-lg text-[#1f1b18]/60 hover:text-[#1f1b18] hover:bg-[#1f1b18]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-200"
              >
                +
              </button>
            </div>

            {product.stock > 10 && (
              <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
                Tối đa 10
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3.5 text-xs uppercase tracking-widest hover:bg-[#b45f3c] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed transition-[background-color,transform] duration-300"
            >
              {adding ? 'Đang thêm…' : 'Thêm vào giỏ'}
            </button>
            <Link
              to="/quote"
              className="flex-1 text-center border border-[#1f1b18]/20 rounded-full px-7 py-3.5 text-xs uppercase tracking-widest hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-[0.98] transition-[border-color,color,transform] duration-300"
            >
              Yêu cầu báo giá
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {msg && (
              <motion.div
                key={msg.text}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                role="status"
                aria-live="polite"
                className={`text-xs ${
                  msg.type === 'ok' ? 'text-green-700' : 'text-[#b45f3c]'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 flex-wrap">
                  <span aria-hidden="true">{msg.type === 'ok' ? '✓' : '⚠'}</span>
                  {msg.text}
                  {msg.type === 'err' && !isAuthenticated && (
                    <>
                      <span className="text-[#1f1b18]/30">·</span>
                      <Link
                        to={`/login?redirect=${encodeURIComponent(pathname)}`}
                        className="underline underline-offset-2 hover:text-[#1f1b18] transition-colors"
                      >
                        Đăng nhập
                      </Link>
                    </>
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}