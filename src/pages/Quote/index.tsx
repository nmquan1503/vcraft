import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quoteApi } from '@/api';
import { getAccessToken, getUser } from '@/utils/tokenStorage';
import type { QuoteRequest, QuoteStatus } from '@/types';

import QuoteCard from './sections/QuoteCard';
import QuoteFilters from './sections/QuoteFilters';
import Footer from '@/components/layout/Footer';

export default function QuoteList() {
  const navigate = useNavigate();

  const user = getUser();
  const isArtisan = user?.role === 'ARTISAN';
  const variant: 'buyer' | 'artisan' = isArtisan ? 'artisan' : 'buyer';

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QuoteStatus | 'ALL'>('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login?redirect=/quote', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!getAccessToken()) return;

    let cancelled = false;

    const loadQuotes = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isArtisan) {
          const res = await quoteApi.listIncoming();

          const filtered =
            status === 'ALL'
              ? res
              : res.filter((quote) => quote.status === status);

          if (!cancelled) {
            setQuotes(filtered);
          }
        } else {
          const res = await quoteApi.listMine({
            limit: 50,
            status: status === 'ALL' ? undefined : status,
          });

          if (!cancelled) {
            setQuotes(res.data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải danh sách yêu cầu.',
          );
          setQuotes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuotes();

    return () => {
      cancelled = true;
    };
  }, [isArtisan, status]);

  if (!getAccessToken()) return null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] text-[#1f1b18]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-24 top-28 h-[380px] w-[380px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-8 top-44 h-[220px] w-[220px] rounded-full border border-[#b45f3c]/[0.07]" />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-28 sm:px-8 md:pb-16 md:pt-36 lg:px-20">
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-8 bg-[#b45f3c]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b45f3c]">
              {isArtisan
                ? 'Dành cho nghệ nhân'
                : 'Không gian đặt hàng'}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] tracking-tight">
                {isArtisan ? (
                  <>
                    Đơn đặt
                    <br />
                    <em className="font-normal italic text-[#b45f3c]">
                      mua buôn.
                    </em>
                  </>
                ) : (
                  <>
                    Yêu cầu
                    <br />
                    của{' '}
                    <em className="font-normal italic text-[#b45f3c]">
                      bạn.
                    </em>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#1f1b18]/50 sm:text-base">
                {isArtisan
                  ? 'Khám phá các đơn đặt hàng, theo dõi đề xuất và kết nối với những khách hàng đang tìm kiếm sản phẩm thủ công.'
                  : 'Quản lý các yêu cầu đặt hàng, theo dõi chào giá từ những xưởng thủ công và tìm kiếm đối tác phù hợp.'}
              </p>
            </div>

            {!isArtisan && (
              <Link
                to="/quote/new"
                className="group inline-flex w-full items-center justify-center gap-4 rounded-full bg-[#1f1b18] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] sm:w-auto"
              >
                <span className="text-base font-light">+</span>
                Tạo yêu cầu mới
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#1f1b18]/10 pt-5">
            <div>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#1f1b18]/35">
                Tổng yêu cầu
              </span>
              <p className="mt-1 font-serif text-2xl">
                {loading ? '—' : String(quotes.length).padStart(2, '0')}
              </p>
            </div>

            <div className="h-9 w-px bg-[#1f1b18]/10" />

            <div>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#1f1b18]/35">
                Đang xem
              </span>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b45f3c]">
                {status === 'ALL' ? 'Tất cả trạng thái' : status}
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/35">
                {isArtisan ? 'Artisan workspace' : 'Buyer workspace'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-y border-[#1f1b18]/10 bg-[#f6f1ea]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-20">
          <QuoteFilters
            variant={variant}
            active={status}
            onChange={setStatus}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b45f3c]">
              {isArtisan ? 'Incoming requests' : 'Your requests'}
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
              {loading
                ? 'Đang cập nhật...'
                : status === 'ALL'
                  ? 'Danh sách yêu cầu'
                  : 'Yêu cầu đã lọc'}
            </h2>
          </div>

          {!loading && !error && quotes.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#1f1b18]/35">
              Hiển thị {quotes.length} yêu cầu
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-[260px] animate-pulse rounded-2xl border border-[#1f1b18]/[0.07] bg-[#fbf8f3] p-6 sm:p-8"
              >
                <div className="h-4 w-24 rounded-full bg-[#1f1b18]/[0.07]" />
                <div className="mt-8 h-7 w-3/4 rounded bg-[#1f1b18]/[0.07]" />
                <div className="mt-3 h-3 w-full rounded bg-[#1f1b18]/[0.05]" />
                <div className="mt-2 h-3 w-2/3 rounded bg-[#1f1b18]/[0.05]" />
                <div className="mt-10 flex gap-4">
                  <div className="h-12 flex-1 rounded-lg bg-[#1f1b18]/[0.05]" />
                  <div className="h-12 flex-1 rounded-lg bg-[#1f1b18]/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/15 bg-red-50 px-6 py-12 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </span>

            <h3 className="mt-5 font-serif text-2xl text-[#1f1b18]">
              Không thể tải dữ liệu.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-red-700/70">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setStatus((current) => current)}
              className="mt-7 rounded-full bg-[#1f1b18] px-7 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6f1ea] transition-colors hover:bg-[#b45f3c]"
            >
              Thử lại
            </button>
          </div>
        ) : quotes.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#1f1b18]/[0.08] bg-[#fbf8f3] px-5 py-20 text-center sm:py-28">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />

            <div className="relative mx-auto max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#b45f3c]/20 text-[#b45f3c]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="h-6 w-6"
                >
                  <path d="M4 7.5h16M6 7.5l1 12h10l1-12M9 7.5V5a3 3 0 0 1 6 0v2.5" />
                  <path d="M10 11v5M14 11v5" />
                </svg>
              </div>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b45f3c]">
                Chưa có dữ liệu
              </p>

              <h3 className="mt-4 font-serif text-3xl leading-tight text-[#1f1b18] sm:text-4xl">
                {status !== 'ALL'
                  ? 'Không tìm thấy yêu cầu phù hợp.'
                  : isArtisan
                    ? 'Chưa có đơn đặt hàng nào.'
                    : 'Mọi hành trình đều bắt đầu từ một yêu cầu.'}
              </h3>

              <p className="mt-4 text-xs leading-[1.9] text-[#1f1b18]/45">
                {status !== 'ALL'
                  ? 'Thử chọn một trạng thái khác để xem các yêu cầu còn lại.'
                  : isArtisan
                    ? 'Khi có khách hàng gửi yêu cầu đặt hàng đến xưởng, thông tin sẽ xuất hiện tại đây.'
                    : 'Tạo yêu cầu báo giá để kết nối với các xưởng thủ công và bắt đầu đặt hàng.'}
              </p>

              {status !== 'ALL' ? (
                <button
                  type="button"
                  onClick={() => setStatus('ALL')}
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#1f1b18]/15 px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#1f1b18] transition-all duration-300 hover:border-[#b45f3c] hover:text-[#b45f3c]"
                >
                  Xem tất cả yêu cầu
                  <span>→</span>
                </button>
              ) : (
                !isArtisan && (
                  <Link
                    to="/quote/new"
                    className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#1f1b18] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c]"
                  >
                    <span className="text-base font-light">+</span>
                    Tạo yêu cầu đầu tiên
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                variant={variant}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}