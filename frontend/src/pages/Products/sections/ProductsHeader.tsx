interface Props {
  total: number;
}

export default function ProductsHeader({ total }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-6">
        Bộ sưu tập
      </p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
          Tuyển chọn
          <br />
          từ các <em className="italic text-[#b45f3c]">xưởng</em>.
        </h1>
        <p className="text-sm text-[#1f1b18]/40 pb-2">
          {total} sản phẩm
        </p>
      </div>
    </section>
  );
}