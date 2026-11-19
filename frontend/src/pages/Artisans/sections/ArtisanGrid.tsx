import ArtisanCard from '@/components/ui/ArtisanCard';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisans: ArtisanProfile[];
  loading: boolean;
}

export default function ArtisanGrid({ artisans, loading }: Props) {
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <ImagePlaceholder
                label={`Nghệ nhân ${i + 1}`}
                aspect="aspect-[4/5]"
                tone="sand"
              />
              <p className="mt-5 text-sm text-[#1f1b18]/30">Đang tải…</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (artisans.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <p className="font-serif text-2xl text-[#1f1b18]/40">
          Không tìm thấy nghệ nhân nào.
        </p>
        <p className="mt-3 text-sm text-[#1f1b18]/30">
          Thử từ khoá khác, hoặc xoá tìm kiếm.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {artisans.map((a) => (
          <ArtisanCard key={a.id} artisan={a} />
        ))}
      </div>
    </section>
  );
}