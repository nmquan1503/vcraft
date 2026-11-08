import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import SectionLabel from '@/components/ui/SectionLabel';

export default function VillageStory() {
  return (
    <section id="lang-nghe" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <SectionLabel number="01">Làng nghề</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Bảy thế kỷ
            <br />
            giữ lửa lò gốm.
          </h2>
        </div>
        <div className="md:col-span-8 grid sm:grid-cols-2 gap-8">
          <div>
            <ImagePlaceholder
              label="Ảnh xưởng gốm gia đình ở Bát Tràng"
              aspect="aspect-[4/3]"
              tone="sand"
            />
            <p className="mt-5 text-sm text-[#1f1b18]/60 leading-relaxed">
              Hình thành từ thế kỷ XIV–XV, khi các dòng họ làm gốm từ Ninh Bình
              di cư đến vùng Bạch Thổ phường. Nhờ nguồn đất sét trắng dồi dào,
              Bát Tràng dần trở thành trung tâm gốm sứ của phía bắc.
            </p>
          </div>
          <div className="sm:mt-16">
            <ImagePlaceholder
              label="Ảnh lò nung củi truyền thống"
              aspect="aspect-[4/3]"
              tone="smoke"
            />
            <p className="mt-5 text-sm text-[#1f1b18]/60 leading-relaxed">
              Năm 2019, nghề gốm Bát Tràng được công nhận là Di sản Văn hóa phi
              vật thể quốc gia. Mỗi công đoạn — từ chọn đất, nhào nặn, vẽ tay
              đến nung lò — đều đòi hỏi sự kiên nhẫn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}