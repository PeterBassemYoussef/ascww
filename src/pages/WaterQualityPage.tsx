import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const qualityImages = [
  {
    srcAr: '/images/water-quality/quality_1.webp',
    srcEn: '/images/water-quality/quality_1EN.webp',
    altAr: 'الجهات المعنية بجودة مياه الشرب',
    altEn: 'Entities responsible for drinking water quality',
  },
  {
    srcAr: '/images/water-quality/quality_2.webp',
    srcEn: '/images/water-quality/quality_2EN.png',
    altAr: 'منظومة المعامل المرتبطة بجودة المياه',
    altEn: 'Laboratory system related to water quality',
  },
];

const waterAndSewageStats = [
  { labelAr: 'عدد الأسر المتصلة بشبكات مياه الشرب النقية', labelEn: 'Households connected to clean drinking water networks', valueAr: '1089269 أسره', valueEn: '1,089,269 households' },
  { labelAr: 'نسبه الاسر المتصلة الي أجمالي الأسر', labelEn: 'Percentage of connected households out of total households', valueAr: '99.36 %', valueEn: '99.36%' },
  { labelAr: 'محطات مياه الشرب المرشحة الكبري', labelEn: 'Major filtration drinking water stations', valueAr: '10 محطة', valueEn: '10 stations' },
  { labelAr: 'محطات مياه الشرب المرشحة الصغري', labelEn: 'Minor filtration drinking water stations', valueAr: '10 محطات', valueEn: '10 stations' },
  { labelAr: 'محطات مياه الشرب الإرتوازي', labelEn: 'Artesian drinking water stations', valueAr: '208 محطة', valueEn: '208 stations' },
  { labelAr: 'محطات معالجة الصرف الصحي التي تتبع الشركة', labelEn: 'Wastewater treatment plants operated by the company', valueAr: '10 محطات', valueEn: '10 stations' },
  { labelAr: 'محطات رفع الصرف الصحي الرئيسية', labelEn: 'Main wastewater lifting stations', valueAr: '18 محطة', valueEn: '18 stations' },
  { labelAr: 'محطات الصرف الصحي الفرعية', labelEn: 'Secondary wastewater stations', valueAr: '29 محطة', valueEn: '29 stations' },
  { labelAr: 'التجمعات الادارية المخدومة بالصرف الصحي بمحافظة أسيوط', labelEn: 'Administrative communities served by wastewater services in Assiut Governorate', valueAr: '1266990 مخدوم', valueEn: '1,266,990 served residents' },
];

function WaterQualityPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{t('جودة المياه', 'Water Quality')}</h1>
            </div>

            <div className="grid gap-6 px-4 py-6 sm:px-8 md:grid-cols-2">
              {qualityImages.map((image) => (
                <article
                  key={image.srcAr}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.18)] sm:p-4"
                >
                  <div className="mb-3 text-center text-sm font-bold text-[#0a3555]">
                    {isEnglish ? image.altEn : image.altAr}
                  </div>
                  <img decoding="async"
                    src={isEnglish ? image.srcEn : image.srcAr}
                    alt={isEnglish ? image.altEn : image.altAr}
                    loading="lazy"
                    className="mx-auto h-auto w-full rounded-xl border border-slate-200 bg-white object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                </article>
              ))}
            </div>

            <section className="px-4 pb-8 sm:px-8 sm:pb-10">
              <div className={`rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6 ${textAlignmentClass}`}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">{t('جوده مياه الشرب ف الاستخدام :', 'Drinking water quality in use:')}</h2>
                <h3 className="mt-3 text-lg font-bold text-slate-800">{t('معايير الجوده', 'Quality standards')}</h3>
                <p className="mt-4 text-base font-bold leading-8 text-[#0a3555]">
                  {t('مجهودات الشركة لتوفير كوب ماء نظيف ذو جودة عالية :-', 'The company’s efforts to provide a clean, high-quality glass of water:')}
                </p>
                <p className={`mt-3 text-base leading-8 text-slate-700 ${textAlignmentClass}`}>
                  {t('تم تركيب وتشغيل عدد ( 23 ) وحدة لمعالجة الحديد والمنجنيز بالمحطات الجوفية التى بها زيادة بتلك العناصر لإنتاج مياه مطابقة للمواصفات وذات جودة عالية.', 'A total of 23 iron and manganese treatment units were installed and operated at groundwater stations with elevated levels of these elements to produce water that meets standards and delivers high quality.')}
                </p>
                <p className={`mt-3 text-base leading-8 text-slate-700 ${textAlignmentClass}`}>
                  {t('تم تركيب وتشغيل عدد ( 189 ) منظومة كلور لإضافة الكلور بالمحطات الجوفية لتأمين المياه المنتجة منها ضد التلوث البكتريولوجى.', 'A total of 189 chlorination systems were installed and operated at groundwater stations to protect produced water from bacteriological contamination.')}
                </p>
              </div>
            </section>

            <section className="px-4 pb-8 sm:px-8 sm:pb-10">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[#0a3555] px-5 py-4 text-white sm:px-6">
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    {t('أعداد تفصيلية لمحطات الشرب والصرف الصحي وإجمالي عدد الاسر', 'Detailed counts of water and wastewater stations and total households')}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className={`w-full min-w-[640px] border-collapse ${textAlignmentClass}`}>
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/80">
                        <th className="px-4 py-3 text-sm font-extrabold text-slate-800 sm:px-6 sm:text-base">{t('المسمى', 'Label')}</th>
                        <th className="px-4 py-3 text-sm font-extrabold text-slate-800 sm:px-6 sm:text-base">{t('العدد', 'Count')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waterAndSewageStats.map((stat) => (
                        <tr key={stat.labelAr} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6 sm:text-base">
                            {isEnglish ? stat.labelEn : stat.labelAr}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-[#0a3555] sm:px-6 sm:text-base">
                            {isEnglish ? stat.valueEn : stat.valueAr}
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

