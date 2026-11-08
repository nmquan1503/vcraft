import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quoteApi } from '@/api';
import QuoteForm, { type QuoteFormValues } from './sections/QuoteForm';
import Footer from '@/components/layout/Footer';

export default function NewQuote() {
  const navigate = useNavigate();

  const [values, setValues] = useState<QuoteFormValues>({
    title: '',
    description: '',
    categoryId: '',
    quantity: 0,
    unit: 'chiếc',
    deadline: '',
    targetArtisanIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (submitNow: boolean) => {
    setError(null);

    if (!values.title.trim()) return setError('Vui lòng nhập tiêu đề.');
    if (!values.categoryId) return setError('Vui lòng chọn danh mục.');
    if (values.quantity < 1) return setError('Số lượng phải ≥ 1.');
    if (!values.deadline) return setError('Vui lòng chọn hạn hoàn thành.');
    if (values.targetArtisanIds.length === 0)
      return setError('Chọn ít nhất 1 xưởng.');

    setLoading(true);
    try {
      const created = await quoteApi.create({
        title: values.title.trim(),
        description: values.description.trim(),
        categoryId: values.categoryId,
        quantity: values.quantity,
        unit: values.unit,
        deadline: new Date(values.deadline).toISOString(),
        targetArtisanIds: values.targetArtisanIds,
      });

      if (submitNow) await quoteApi.submit(created.id);

      navigate(`/quote/${created.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được yêu cầu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-10">
        <Link
          to="/quote"
          className="inline-block mb-10 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
        >
          ← Tất cả yêu cầu
        </Link>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Yêu cầu báo giá
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
          Tạo yêu cầu<br />mua <em className="italic text-[#b45f3c]">buôn</em>.
        </h1>
        <p className="mt-4 text-sm text-[#1f1b18]/50 leading-relaxed max-w-lg">
          Mô tả chi tiết yêu cầu của bạn. Các xưởng được chọn sẽ nhận được thông
          báo và có thể chào giá trong thời hạn bạn đặt.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <QuoteForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </section>

      <Footer />
    </main>
  );
}