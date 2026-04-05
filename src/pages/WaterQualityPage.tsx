import Footer from '../components/Footer';
import Header from '../components/Header';

const qualityImages = [
  {
    src: '/images/water-quality/quality_1.webp',
    alt: 'الجهات المعنية بجودة مياه الشرب',
  },
  {
    src: '/images/water-quality/quality_2.webp',
    alt: 'منظومة المعامل المرتبطة بجودة المياه',
  },
];

const waterAndSewageStats = [
  { label: 'عدد الأسر المتصلة بشبكات مياه الشرب النقية', value: '1089269 أسره' },
  { label: 'نسبه الاسر المتصلة الي أجمالي الأسر', value: '99.36 %' },
  { label: 'محطات مياه الشرب المرشحة الكبري', value: '10 محطة' },
  { label: 'محطات مياه الشرب المرشحة الصغري', value: '10 محطات' },
  { label: 'محطات مياه الشرب الإرتوازي', value: '208 محطة' },
  { label: 'محطات معالجة الصرف الصحي التي تتبع الشركة', value: '10 محطات' },
  { label: 'محطات رفع الصرف الصحي الرئيسية', value: '18 محطة' },
  { label: 'محطات الصرف الصحي الفرعية', value: '29 محطة' },
  { label: 'التجمعات الادارية المخدومة بالصرف الصحي بمحافظة أسيوط', value: '1266990 مخدوم' },
];

function WaterQualityPage() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">جودة المياه</h1>
            </div>

            <div className="grid gap-6 px-4 py-6 sm:px-8 md:grid-cols-2">
              {qualityImages.map((image) => (
                <article
                  key={image.src}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.18)] sm:p-4"
                >
                  <div className="mb-3 text-center text-sm font-bold text-[#0a3555]">
                    {image.alt}
                  </div>
                  <img decoding="async"
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="mx-auto h-auto w-full rounded-xl border border-slate-200 bg-white object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                </article>
              ))}
            </div>

            <section className="px-4 pb-8 sm:px-8 sm:pb-10">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-right shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">جوده مياه الشرب ف الاستخدام :</h2>
                <h3 className="mt-3 text-lg font-bold text-slate-800">معايير الجوده</h3>
                <p className="mt-4 text-base font-bold leading-8 text-[#0a3555]">
                  مجهودات الشركة لتوفير كوب ماء نظيف ذو جودة عالية :-
                </p>
                <p className="mt-3 text-justify text-base leading-8 text-slate-700">
                  تم تركيب وتشغيل عدد ( 23 ) وحدة لمعالجة الحديد والمنجنيز بالمحطات الجوفية التى بها زيادة
                  بتلك العناصر لإنتاج مياه مطابقة للمواصفات وذات جودة عالية.
                </p>
                <p className="mt-3 text-justify text-base leading-8 text-slate-700">
                  تم تركيب وتشغيل عدد ( 189 ) منظومة كلور لإضافة الكلور بالمحطات الجوفية لتأمين المياه
                  المنتجة منها ضد التلوث البكتريولوجى.
                </p>
              </div>
            </section>

            <section className="px-4 pb-8 sm:px-8 sm:pb-10">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[#0a3555] px-5 py-4 text-white sm:px-6">
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    أعداد تفصيلية لمحطات الشرب والصرف الصحي وإجمالي عدد الاسر
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-right">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/80">
                        <th className="px-4 py-3 text-sm font-extrabold text-slate-800 sm:px-6 sm:text-base">المسمى</th>
                        <th className="px-4 py-3 text-sm font-extrabold text-slate-800 sm:px-6 sm:text-base">العدد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waterAndSewageStats.map((stat) => (
                        <tr key={stat.label} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6 sm:text-base">
                            {stat.label}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-[#0a3555] sm:px-6 sm:text-base">
                            {stat.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default WaterQualityPage;
