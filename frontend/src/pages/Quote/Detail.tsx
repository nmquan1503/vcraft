import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { quoteApi, artisanApi } from '@/api';
import { getAccessToken, getUser } from '@/utils/tokenStorage';
import type { QuoteRequest, Bid } from '@/types';

import QuoteStatusBadge from './sections/QuoteStatusBadge';
import BidForm, { type BidFormValues } from './sections/BidForm';
import BidList from './sections/BidList';
import Footer from '@/components/layout/Footer';

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
};

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
    artisanApi.getMe().then((a) => setMyArtisanId(a?.id ?? null));
  }, [isArtisan]);

  const reload = async () => {
    if (!id) return;
    const data = await quoteApi.getById(id);
    if (!data) {
      setQuote(null);
      setBids([]);
      return;
    }
    setQuote(data.quote);
    setBids(data.bids ?? []);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    reload().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const myBid = isArtisan && myArtisanId
    ? bids.find((b) => b.artisanId === myArtisanId)
    : null;

  const canPlaceBid = isArtisan && quote &&
    (quote.status === 'SENT' || quote.status === 'BIDDING') && !myBid;
  const canUpdateBid = isArtisan && myBid && myBid.status === 'PENDING' &&
    quote && (quote.status === 'SENT' || quote.status === 'BIDDING');

  const handlePlaceBid = async (v: BidFormValues) => {
    if (!quote) return;
    setError(null);
    setProcessing('bid');
    try {
      if (canUpdateBid && myBid) {
        await quoteApi.updateBid(quote.id, myBid.id, {
          pricePerUnit: v.pricePerUnit,
          estimatedDays: v.estimatedDays,
          note: v.note,
        });
      } else {
        await quoteApi.placeBid(quote.id, {
          pricePerUnit: v.pricePerUnit,
          estimatedDays: v.estimatedDays,
          note: v.note,
        });
      }
      setShowBidForm(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được chào giá.');
    } finally {
      setProcessing(null);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!quote) return;
    if (!window.confirm('Chấp nhận chào giá này? Các chào giá khác sẽ bị từ chối.'))
      return;
    setProcessing(bidId);
    try {
      await quoteApi.acceptBid(quote.id, bidId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không chấp nhận được.');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (!quote) return;
    setProcessing(bidId);
    try {
      await quoteApi.rejectBid(quote.id, bidId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không từ chối được.');
    } finally {
      setProcessing(null);
    }
  };

  const handleSubmitDraft = async () => {
    if (!quote) return;
    setProcessing('submit');
    try {
      await quoteApi.submit(quote.id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được.');
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async () => {
    if (!quote) return;
    if (!window.confirm('Huỷ yêu cầu này?')) return;
    setProcessing('cancel');
    try {
      await quoteApi.cancel(quote.id);
      navigate('/quote', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không huỷ được.');
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkDelivered = async () => {
    if (!quote) return;
    if (!window.confirm('Đánh dấu đã giao hàng?')) return;
    setProcessing('deliver');
    try {
      await quoteApi.markDelivered(quote.id, {});
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không cập nhật được.');
    } finally {
      setProcessing(null);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!quote) return;
    if (!window.confirm('Xác nhận đã nhận hàng?')) return;
    setProcessing('confirm');
    try {
      await quoteApi.confirmDelivery(quote.id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xác nhận được.');
    } finally {
      setProcessing(null);
    }
  };

  if (!getAccessToken()) return null;

  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        </div>
      </main>
    );
  }

  if (!quote) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">404</p>
          <h1 className="font-serif text-3xl md:text-5xl">Không tìm thấy yêu cầu.</h1>
          <Link
            to="/quote"
            className="mt-8 inline-flex bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về danh sách
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <Link
          to="/quote"
          className="inline-block mb-8 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
        >
          ← Tất cả yêu cầu
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <QuoteStatusBadge status={quote.status} />
          <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
            {isArtisan ? 'Đến từ buyer' : 'Yêu cầu của tôi'}
          </span>
        </div>

        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight">
          {quote.title}
        </h1>

        {quote.description && (
          <p className="mt-4 text-sm md:text-base text-[#1f1b18]/60 leading-relaxed">
            {quote.description}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#1f1b18]/10 pt-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">Số lượng</p>
            <p className="mt-1 text-sm">{quote.quantity} {quote.unit}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">Hạn</p>
            <p className="mt-1 text-sm">{fmt(quote.deadline)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">Xưởng nhận</p>
            <p className="mt-1 text-sm">{quote.targetArtisanIds.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">Cập nhật</p>
            <p className="mt-1 text-sm">{fmt(quote.updatedAt)}</p>
          </div>
        </div>

        {!isArtisan && quote.status === 'DRAFT' && (
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleCancel}
              disabled={processing !== null}
              className="border border-red-500/40 text-red-600 rounded-full px-6 py-2 text-xs uppercase tracking-widest hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={handleSubmitDraft}
              disabled={processing !== null}
              className="flex-1 bg-[#1f1b18] text-[#f6f1ea] rounded-full px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
            >
              {processing === 'submit' ? 'Đang gửi…' : 'Gửi cho các xưởng'}
            </button>
          </div>
        )}

        {!isArtisan && quote.status === 'DELIVERED' && (
          <div className="mt-8">
            <button
              onClick={handleConfirmDelivery}
              disabled={processing !== null}
              className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
            >
              {processing === 'confirm' ? 'Đang xử lý…' : 'Xác nhận đã nhận hàng'}
            </button>
          </div>
        )}

        {isArtisan && myBid && myBid.status === 'ACCEPTED' && quote.status === 'IN_PRODUCTION' && (
          <div className="mt-8">
            <button
              onClick={handleMarkDelivered}
              disabled={processing !== null}
              className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
            >
              {processing === 'deliver' ? 'Đang xử lý…' : 'Đánh dấu đã giao hàng'}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-600 bg-red-50 px-3 py-2 border-l-2 border-red-500">
            {error}
          </p>
        )}
      </section>

      <section className="bg-[#1f1b18] text-[#f6f1ea] py-16 md:py-20 mt-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-3">
                Chào giá
              </p>
              <h2 className="font-serif text-2xl md:text-3xl">
                {isArtisan ? 'Các xưởng đã chào giá.' : 'Chào giá từ các xưởng.'}
              </h2>
            </div>
            <span className="text-sm text-[#f6f1ea]/40">{bids.length} chào giá</span>
          </div>

          <BidList
            bids={bids}
            mode={isArtisan ? 'artisan' : 'buyer'}
            onAccept={handleAcceptBid}
            onReject={handleRejectBid}
            processing={processing}
          />

          {isArtisan && (canPlaceBid || canUpdateBid) && (
            <div className="mt-8 pt-8 border-t border-[#f6f1ea]/10">
              {!showBidForm ? (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="w-full bg-[#d9a08b] text-[#1f1b18] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#f6f1ea] transition-colors"
                >
                  {canUpdateBid ? 'Cập nhật chào giá' : 'Đặt chào giá'}
                </button>
              ) : (
                <BidForm
                  initial={myBid ? {
                    pricePerUnit: myBid.pricePerUnit,
                    estimatedDays: myBid.estimatedDays,
                    note: myBid.note,
                  } : undefined}
                  totalQuantity={quote.quantity}
                  onSubmit={handlePlaceBid}
                  onCancel={() => setShowBidForm(false)}
                  submitting={processing === 'bid'}
                  error={null}
                />
              )}
            </div>
          )}

          {isArtisan && myBid && myBid.status === 'PENDING' && !showBidForm && (
            <div className="mt-6 border border-[#d9a08b]/30 p-4">
              <p className="text-[10px] uppercase tracking-widest text-[#d9a08b]/70 mb-2">
                Chào giá của bạn
              </p>
              <p className="text-sm text-[#f6f1ea]/80">
                {myBid.pricePerUnit.toLocaleString('vi-VN')} ₫ × {quote.quantity} = {myBid.totalPrice.toLocaleString('vi-VN')} ₫ · {myBid.estimatedDays} ngày
              </p>
            </div>
          )}

          {isArtisan && myBid && myBid.status === 'ACCEPTED' && (
            <div className="mt-6 border border-[#d9a08b] p-4 bg-[#d9a08b]/10">
              <p className="text-[10px] uppercase tracking-widest text-[#d9a08b] mb-2">
                ✓ Chào giá của bạn được chấp nhận
              </p>
              <p className="text-sm text-[#f6f1ea]/80">
                Đơn hàng đang sản xuất. Cập nhật trạng thái khi giao hàng xong.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}