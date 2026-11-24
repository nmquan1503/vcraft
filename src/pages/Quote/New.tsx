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

    if (!values.title.trim()) {
      setError('Vui lòng nhập tiêu đề.');
      return;
    }

    if (!values.categoryId) {
      setError('Vui lòng chọn danh mục.');
      return;
    }

    if (values.quantity < 1) {
      setError('Số lượng phải ≥ 1.');
      return;
    }

    if (!values.deadline) {
      setError('Vui lòng chọn hạn hoàn thành.');
      return;
    }

    if (values.targetArtisanIds.length === 0) {
      setError('Chọn ít nhất 1 xưởng.');
      return;
    }

    const deadlineDate = new Date(values.deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      setError('Thời hạn hoàn thành không hợp lệ.');
      return;
    }

    setLoading(true);

    try {
      const created = await quoteApi.create({
        title: values.title.trim(),
        description: values.description.trim(),
        categoryId: values.categoryId,
        quantity: values.quantity,
        unit: values.unit,
        deadline: deadlineDate.toISOString(),
        targetArtisanIds: values.targetArtisanIds,
      });

      if (submitNow) {
        await quoteApi.submit(created.id);
      }

      navigate(`/quote/${created.id}`, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không tạo được yêu cầu.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] text-[#1f1b18]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-48 -top-24 h-[520px] w-[520px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-24 top-0 h-[380px] w-[380px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute right-0 top-24 h-[180px] w-[180px] rounded-full border border-[#b45f3c]/[0.07]" />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-28 sm:px-8 md:pb-16 md:pt-36 lg:px-20">
          <Link
            to="/quote"
            className="group mb-12 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1f1b18]/45 transition-colors duration-300 hover:text-[#b45f3c]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Tất cả yêu cầu
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b45f3c]" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b45f3c]">
                  Không gian đặt hàng
                </p>
              </div>

              <h1 className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] tracking-tight">
                Tạo yêu cầu
                <br />
                mua{' '}
                <em className="font-normal italic text-[#b45f3c]">
                  buôn.
                </em>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-[1.9] text-[#1f1b18]/50 sm:text-base">
                Mỗi sản phẩm thủ công đều bắt đầu từ một ý tưởng. Hãy chia sẻ
                mong muốn của bạn để tìm được xưởng phù hợp và nhận những đề
                xuất chế tác tốt nhất.
              </p>
            </div>

            <div className="hidden border-l border-[#1f1b18]/10 pb-1 pl-7 lg:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b45f3c]">
                Quy trình đặt hàng
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-xl italic text-[#b45f3c]">
                    01
                  </span>
                  <div>
                    <p className="text-xs font-medium">Tạo yêu cầu</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#1f1b18]/40">
                      Mô tả sản phẩm và số lượng cần đặt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-serif text-xl italic text-[#1f1b18]/25">
                    02
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#1f1b18]/50">
                      Nhận chào giá
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#1f1b18]/35">
                      Các xưởng gửi đề xuất phù hợp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-serif text-xl italic text-[#1f1b18]/25">
                    03
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#1f1b18]/50">
                      Xác nhận đơn hàng
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#1f1b18]/35">
                      Chọn xưởng và bắt đầu chế tác.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-[#1f1b18]/10 pt-5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b45f3c]">
              Bước 01
            </span>
            <span className="h-px w-10 bg-[#1f1b18]/15" />
            <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/40">
              Thông tin yêu cầu
            </span>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="min-w-0">
            <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#1f1b18]/10 pb-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b45f3c]">
                  Request details
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                  Thông tin đặt hàng
                </h2>
              </div>

              <span className="hidden text-[9px] uppercase tracking-[0.15em] text-[#1f1b18]/35 sm:block">
                * Thông tin cần thiết
              </span>
            </div>

            <QuoteForm
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-2xl bg-[#1f1b18] p-7 text-[#f6f1ea]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d9a08b]">
                  Gợi ý
                </span>
                <span className="text-lg text-[#d9a08b]">✳</span>
              </div>

              <h3 className="mt-8 font-serif text-3xl leading-tight">
                Một yêu cầu
                <br />
                <em className="font-normal italic text-[#d9a08b]">
                  rõ ràng.
                </em>
                <br />
                Một kết nối tốt.
              </h3>

              <p className="mt-5 text-xs leading-[1.9] text-[#f6f1ea]/50">
                Cung cấp càng nhiều thông tin cụ thể, các nghệ nhân càng dễ
                hiểu mong muốn và đưa ra mức giá phù hợp.
              </p>

              <div className="my-8 h-px bg-[#f6f1ea]/10" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9a08b]">
                Nên chuẩn bị
              </p>

              <ul className="mt-5 space-y-4">
                {[
                  'Tên và mô tả sản phẩm',
                  'Số lượng cần đặt',
                  'Thời hạn mong muốn',
                  'Xưởng chế tác phù hợp',
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[10px] text-[#d9a08b]">
                      0{index + 1}
                    </span>
                    <span className="text-[11px] leading-relaxed text-[#f6f1ea]/65">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full border border-[#d9a08b]/10" />
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full border border-[#d9a08b]/10" />
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}