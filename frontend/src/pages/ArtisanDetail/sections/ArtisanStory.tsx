import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

export default function ArtisanStory({ artisan }: Props) {
  if (!artisan.familyHistory && !artisan.description) return null;

  return (
    <section className="bg-[#f6f1ea] py-20 md:py-28 border-y border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-5">
              Câu chuyện xưởng
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Nghề
              <br />
              trong <em className="italic text-[#b45f3c]">máu</em>.
            </h2>
          </div>

          <div className="md:col-span-8 space-y-8">
            {artisan.familyHistory && (
              <blockquote className="font-serif text-xl md:text-2xl italic leading-snug text-[#1f1b18]/80 border-l-2 border-[#b45f3c]/50 pl-6">
                “{artisan.familyHistory}”
              </blockquote>
            )}

            {artisan.description && (
              <p className="text-sm md:text-base text-[#1f1b18]/70 leading-relaxed max-w-2xl">
                {artisan.description}
              </p>
            )}

            {/* Địa chỉ đầy đủ */}
            <div className="pt-6 border-t border-[#1f1b18]/10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-2">
                Địa chỉ xưởng
              </p>
              <p className="text-sm md:text-base text-[#1f1b18]/80">
                {artisan.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}