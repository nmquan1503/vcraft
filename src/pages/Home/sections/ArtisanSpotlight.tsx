import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import SectionLabel from '@/components/ui/SectionLabel';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisans: ArtisanProfile[];
  loading: boolean;
}

export default function ArtisanSpotlight({ artisans, loading }: Props) {
  return (
    <section id="nghe-nhan" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <SectionLabel number="03">Nghệ nhân</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            Đôi tay
            <br />
            giữ hồn đất.
          </h2>
          <p className="text-sm text-[#1f1b18]/60 leading-relaxed max-w-xs">
            Mỗi nghệ nhân là một câu chuyện riêng — về gia đình, về lửa, và về
            những mùa gốm nối tiếp nhau.
          </p>
        </div>

        <div className="md:col-span-8 grid sm:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i}>
                <ImagePlaceholder
                  label={`Nghệ nhân ${i}`}
                  aspect="aspect-[3/4]"
                  tone="sand"
                />
                <p className="mt-4 text-sm text-[#1f1b18]/40">Đang tải…</p>
              </div>
            ))
          ) : artisans.length === 0 ? (
            <p className="col-span-full text-sm text-[#1f1b18]/40">
              Chưa có nghệ nhân nào được duyệt.
            </p>
          ) : (
            artisans.map((a) => {
              const img = a.images?.[0];
              return (
                <Link key={a.id} to={`/artisans/${a.id}`} className="group">
                  {img ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={img}
                        alt={a.workshopName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      label={a.workshopName}
                      aspect="aspect-[3/4]"
                      tone="sand"
                      className="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
                      {a.ownerName}
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-[#b45f3c]/70">
                      {a.district}
                    </span>
                  </div>
                  <p className="text-sm text-[#1f1b18]/60 mt-1">
                    {a.workshopName}
                  </p>
                  {a.openStatus && (
                    <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b45f3c]" />
                      Đang mở cửa
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}