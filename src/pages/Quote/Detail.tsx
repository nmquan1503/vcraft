import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { quoteApi, artisanApi } from '@/api';
import { getAccessToken, getUser } from '@/utils/tokenStorage';
import type { QuoteRequest, Bid } from '@/types';

import QuoteStatusBadge from './sections/QuoteStatusBadge';
import BidForm, { type BidFormValues } from './sections/BidForm';
import BidList from './sections/BidList';
import Footer from '@/components/layout/Footer';

const formatDate = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN');

export default function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = getUser();
  const isArtisan = user?.role === 'ARTISAN';

  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myArtisanId, setMyArtisanId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate(`/login?redirect=/quote/${id}`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!isArtisan) return;

    let mounted = true;

    artisanApi
      .getMe()
      .then((artisan) => {
        if (mounted) {
          setMyArtisanId(artisan?.id ?? null);
        }
      })
      .catch(() => {
        if (mounted) {
          setMyArtisanId(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isArtisan]);

  const reload = useCallback(async () => {
    if (!id) return;

    const data = await quoteApi.getById(id);

    if (!data) {
      setQuote(null);
      setBids([]);
      return;
    }

    setQuote(data.quote);
    setBids(data.bids ?? []);
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await quoteApi.getById(id!);

        if (!mounted) return;

        if (!data) {
          setQuote(null);
          setBids([]);
          return;
        }

        setQuote(data.quote);
        setBids(data.bids ?? []);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải thông tin yêu cầu.',
          );
          setQuote(null);
          setBids([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  const myBid =
    isArtisan && myArtisanId
      ? bids.find((bid) => bid.artisanId === myArtisanId) ?? null
      : null;

  const canPlaceBid =
    isArtisan &&
    quote !== null &&
    (quote.status === 'SENT' || quote.status === 'BIDDING') &&
    !myBid;

  const canUpdateBid =
    isArtisan &&
    myBid !== null &&
    myBid.status === 'PENDING' &&
    quote !== null &&
    (quote.status === 'SENT' || quote.status === 'BIDDING');

  const handlePlaceBid = async (values: BidFormValues) => {
    if (!quote) return;

    setError(null);
    setProcessing('bid');

    try {
      if (canUpdateBid && myBid) {
        await quoteApi.updateBid(quote.id, myBid.id, {
          pricePerUnit: values.pricePerUnit,
          estimatedDays: values.estimatedDays,
          note: values.note,
        });
      } else {
        await quoteApi.placeBid(quote.id, {
          pricePerUnit: values.pricePerUnit,
          estimatedDays: values.estimatedDays,
          note: values.note,
        });
      }

      setShowBidForm(false);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không gửi được chào giá.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!quote) return;

    if (
      !window.confirm(
        'Chấp nhận chào giá này? Các chào giá khác sẽ bị từ chối.',
      )
    ) {
      return;
    }

    setError(null);
    setProcessing(bidId);

    try {
      await quoteApi.acceptBid(quote.id, bidId);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không chấp nhận được chào giá.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (!quote) return;

    setError(null);
    setProcessing(bidId);

    try {
      await quoteApi.rejectBid(quote.id, bidId);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không từ chối được chào giá.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleSubmitDraft = async () => {
    if (!quote) return;

    setError(null);
    setProcessing('submit');

    try {
      await quoteApi.submit(quote.id);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không gửi được yêu cầu.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async () => {
    if (!quote) return;

    if (!window.confirm('Bạn có chắc chắn muốn huỷ yêu cầu này?')) {
      return;
    }

    setError(null);
    setProcessing('cancel');

    try {
      await quoteApi.cancel(quote.id);
      navigate('/quote', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không huỷ được yêu cầu.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkDelivered = async () => {
    if (!quote) return;

    if (!window.confirm('Đánh dấu đơn hàng đã được giao?')) {
      return;
    }

    setError(null);
    setProcessing('deliver');

    try {
      await quoteApi.markDelivered(quote.id, {});
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không cập nhật được trạng thái giao hàng.',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!quote) return;

    if (!window.confirm('Xác nhận bạn đã nhận được hàng?')) {
      return;
    }

    setError(null);
    setProcessing('confirm');

    try {
      await quoteApi.confirmDelivery(quote.id);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không xác nhận được việc nhận hàng.',
      );
    } finally {
      setProcessing(null);
    }
  };

  if (!getAccessToken()) return null;

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-[#f6f1ea] text-[#1f1b18]">
        <section className="flex flex-1 items-center justify-center px-5 pt-24">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#b45f3c]/20">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#b45f3c]/20 border-t-[#b45f3c]" />
            </div>

            <p className="mt-5 font-serif text-xl text-[#1f1b18]/75">
              Đang tải yêu cầu...
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!quote) {
    return (
      <main className="flex min-h-screen flex-col bg-[#f6f1ea] text-[#1f1b18]">
        <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-32">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />

          <div className="relative max-w-lg text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#b45f3c]">
              {error ? 'Không thể tải dữ liệu' : '404 · Not found'}
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              {error
                ? 'Đã xảy ra lỗi.'
                : 'Không tìm thấy yêu cầu.'}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#1f1b18]/50">
              {error ||
                'Yêu cầu có thể đã bị xoá, không tồn tại hoặc bạn không có quyền truy cập.'}
            </p>

            <Link
              to="/quote"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1f1b18] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c]"
            >
              ← Về danh sách yêu cầu
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] text-[#1f1b18]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-28 top-32 h-[360px] w-[360px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-16 top-44 h-[220px] w-[220px] rounded-full border border-[#b45f3c]/[0.07]" />

        <div className="relative mx-auto max-w-[1100px] px-5 pb-12 pt-28 sm:px-8 md:pb-16 md:pt-36 lg:px-12">
          <Link
            to="/quote"
            className="group inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[#1f1b18]/45 transition-colors hover:text-[#b45f3c]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Tất cả yêu cầu
          </Link>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <QuoteStatusBadge status={quote.status} />

            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/35">
              {isArtisan ? 'Yêu cầu từ khách hàng' : 'Yêu cầu của tôi'}
            </span>
          </div>

          <div className="mt-6 max-w-4xl">
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b45f3c]">
              Chi tiết đơn đặt hàng
            </p>

            <h1 className="font-serif text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.08] tracking-tight text-[#1f1b18]">
              {quote.title}
            </h1>

            {quote.description && (
              <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-[1.9] text-[#1f1b18]/60 sm:text-base">
                {quote.description}
              </p>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#1f1b18]/[0.08] bg-[#1f1b18]/[0.08] sm:grid-cols-4">
            <div className="bg-[#fbf8f3] p-4 sm:p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/40">
                Số lượng
              </p>
              <p className="mt-3 font-serif text-xl text-[#1f1b18] sm:text-2xl">
                {quote.quantity.toLocaleString('vi-VN')}
              </p>
              <p className="mt-1 text-[10px] text-[#1f1b18]/40">
                {quote.unit}
              </p>
            </div>

            <div className="bg-[#fbf8f3] p-4 sm:p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/40">
                Hạn hoàn thành
              </p>
              <p className="mt-3 font-serif text-xl text-[#1f1b18] sm:text-2xl">
                {formatDate(quote.deadline)}
              </p>
            </div>

            <div className="bg-[#fbf8f3] p-4 sm:p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/40">
                Xưởng nhận
              </p>
              <p className="mt-3 font-serif text-xl text-[#1f1b18] sm:text-2xl">
                {quote.targetArtisanIds.length}
              </p>
              <p className="mt-1 text-[10px] text-[#1f1b18]/40">
                Xưởng
              </p>
            </div>

            <div className="bg-[#fbf8f3] p-4 sm:p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/40">
                Cập nhật
              </p>
              <p className="mt-3 font-serif text-xl text-[#1f1b18] sm:text-2xl">
                {formatDate(quote.updatedAt)}
              </p>
            </div>
          </div>

          {!isArtisan && quote.status === 'DRAFT' && (
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={processing !== null}
                className="rounded-full border border-red-500/25 px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-red-700/75 transition-all duration-300 hover:border-red-500/50 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Huỷ yêu cầu
              </button>

              <button
                type="button"
                onClick={handleSubmitDraft}
                disabled={processing !== null}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#1f1b18] px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing === 'submit'
                  ? 'Đang gửi...'
                  : 'Gửi cho các xưởng'}
                {processing !== 'submit' && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </div>
          )}

          {!isArtisan && quote.status === 'DELIVERED' && (
            <div className="mt-8 rounded-2xl border border-[#b45f3c]/20 bg-[#b45f3c]/[0.04] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="font-serif text-lg text-[#1f1b18]">
                  Đơn hàng đã được giao
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#1f1b18]/45">
                  Vui lòng xác nhận sau khi bạn đã nhận được sản phẩm.
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirmDelivery}
                disabled={processing !== null}
                className="mt-4 w-full rounded-full bg-[#1f1b18] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-0 sm:w-auto sm:shrink-0"
              >
                {processing === 'confirm'
                  ? 'Đang xử lý...'
                  : 'Xác nhận đã nhận hàng'}
              </button>
            </div>
          )}

          {isArtisan &&
            myBid?.status === 'ACCEPTED' &&
            quote.status === 'IN_PRODUCTION' && (
              <div className="mt-8 rounded-2xl border border-[#b45f3c]/20 bg-[#b45f3c]/[0.04] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="font-serif text-lg text-[#1f1b18]">
                    Đơn hàng đang được sản xuất
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#1f1b18]/45">
                    Cập nhật trạng thái khi bạn đã hoàn tất việc giao hàng.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleMarkDelivered}
                  disabled={processing !== null}
                  className="mt-4 w-full rounded-full bg-[#1f1b18] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-0 sm:w-auto sm:shrink-0"
                >
                  {processing === 'deliver'
                    ? 'Đang xử lý...'
                    : 'Đánh dấu đã giao hàng'}
                </button>
              </div>
            )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-50 px-4 py-3.5"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
                !
              </span>
              <p className="text-xs leading-relaxed text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1f1b18] py-16 text-[#f6f1ea] md:py-24">
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full border border-[#d9a08b]/[0.07]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-[340px] w-[340px] rounded-full border border-[#d9a08b]/[0.07]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full border border-[#d9a08b]/[0.05]" />

        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#f6f1ea]/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d9a08b]">
                Trao đổi & báo giá
              </p>

              <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
                {isArtisan
                  ? 'Các đề xuất chào giá.'
                  : 'Chào giá từ các xưởng.'}
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-relaxed text-[#f6f1ea]/40">
                {isArtisan
                  ? 'Theo dõi các đề xuất và quản lý chào giá của bạn cho đơn hàng này.'
                  : 'So sánh các đề xuất để tìm ra xưởng phù hợp với yêu cầu của bạn.'}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-full border border-[#f6f1ea]/10 px-4 py-2.5 sm:self-auto">
              <span className="font-serif text-xl text-[#d9a08b]">
                {bids.length}
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#f6f1ea]/45">
                Chào giá
              </span>
            </div>
          </div>

          <BidList
            bids={bids}
            mode={isArtisan ? 'artisan' : 'buyer'}
            onAccept={handleAcceptBid}
            onReject={handleRejectBid}
            processing={processing}
          />

          {isArtisan && (canPlaceBid || canUpdateBid) && (
            <div className="mt-10 border-t border-[#f6f1ea]/10 pt-8">
              {!showBidForm ? (
                <div className="rounded-2xl border border-[#d9a08b]/20 bg-[#d9a08b]/[0.05] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7">
                  <div>
                    <p className="font-serif text-xl text-[#f6f1ea]">
                      {canUpdateBid
                        ? 'Điều chỉnh đề xuất của bạn'
                        : 'Gửi đề xuất chào giá'}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#f6f1ea]/40">
                      {canUpdateBid
                        ? 'Bạn có thể cập nhật mức giá và thời gian hoàn thành trước khi khách hàng chấp nhận.'
                        : 'Đưa ra mức giá và thời gian hoàn thành phù hợp với khả năng sản xuất của xưởng.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setShowBidForm(true);
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#d9a08b] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#1f1b18] transition-all duration-300 hover:bg-[#f6f1ea] sm:mt-0 sm:w-auto sm:shrink-0"
                  >
                    {canUpdateBid
                      ? 'Cập nhật chào giá'
                      : 'Đặt chào giá'}
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#f6f1ea]/10 bg-[#f6f1ea]/[0.025] p-5 sm:p-7">
                  <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d9a08b]">
                        {canUpdateBid
                          ? 'Chỉnh sửa đề xuất'
                          : 'Đề xuất mới'}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl text-[#f6f1ea]">
                        Chi tiết chào giá
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      disabled={processing === 'bid'}
                      className="rounded-full border border-[#f6f1ea]/15 px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[#f6f1ea]/50 transition-colors hover:border-[#f6f1ea]/40 hover:text-[#f6f1ea] disabled:opacity-40"
                    >
                      Đóng ×
                    </button>
                  </div>

                  <BidForm
                    initial={
                      myBid
                        ? {
                            pricePerUnit: myBid.pricePerUnit,
                            estimatedDays: myBid.estimatedDays,
                            note: myBid.note,
                          }
                        : undefined
                    }
                    totalQuantity={quote.quantity}
                    onSubmit={handlePlaceBid}
                    onCancel={() => setShowBidForm(false)}
                    submitting={processing === 'bid'}
                    error={null}
                  />
                </div>
              )}
            </div>
          )}

          {isArtisan &&
            myBid?.status === 'PENDING' &&
            !showBidForm && (
              <div className="mt-8 rounded-2xl border border-[#d9a08b]/25 bg-[#d9a08b]/[0.06] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d9a08b]">
                    Chào giá của bạn
                  </p>

                  <span className="rounded-full border border-[#d9a08b]/25 px-3 py-1 text-[8px] uppercase tracking-[0.15em] text-[#d9a08b]">
                    Đang chờ phản hồi
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#f6f1ea]/35">
                      Đơn giá
                    </p>
                    <p className="mt-2 font-serif text-xl text-[#f6f1ea]">
                      {formatPrice(myBid.pricePerUnit)} ₫
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#f6f1ea]/35">
                      Tổng giá trị
                    </p>
                    <p className="mt-2 font-serif text-xl text-[#f6f1ea]">
                      {formatPrice(myBid.totalPrice)} ₫
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#f6f1ea]/35">
                      Thời gian
                    </p>
                    <p className="mt-2 font-serif text-xl text-[#f6f1ea]">
                      {myBid.estimatedDays} ngày
                    </p>
                  </div>
                </div>
              </div>
            )}

          {isArtisan && myBid?.status === 'ACCEPTED' && (
            <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  ✓
                </span>
                <div>
                  <p className="font-serif text-lg text-[#f6f1ea]">
                    Chào giá đã được chấp nhận
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-emerald-300/65">
                    Đơn hàng đã được xác nhận
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[#f6f1ea]/50">
                {quote.status === 'IN_PRODUCTION'
                  ? 'Đơn hàng đang trong quá trình sản xuất. Hãy cập nhật trạng thái khi hoàn tất giao hàng.'
                  : quote.status === 'DELIVERED'
                    ? 'Bạn đã đánh dấu đơn hàng được giao. Vui lòng chờ khách hàng xác nhận.'
                    : quote.status === 'CLOSED'
                      ? 'Đơn hàng đã hoàn tất.'
                      : 'Theo dõi trạng thái đơn hàng để thực hiện các bước tiếp theo.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}