import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const centers: Array<{
  title: LocalizedText;
  image: string;
  mobile: string;
  landline: string;
  address: LocalizedText;
}> = [
  {
    title: { ar: 'مركز خدمة عملاء الرئيسي', en: 'Main Customer Service Center' },
    image: '/images/call-center/4.webp',
    mobile: '01278648276',
    landline: '088-2131662',
    address: {
      ar: 'أسيوط-امتداد شارع الجيش امام مول النصر',
      en: 'Assiut - extension of El Geish Street in front of El Nasr Mall',
    },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع ديروط', en: 'Dairut Branch Customer Service Center' },
    image: '/images/call-center/35.webp',
    mobile: '01210487781',
    landline: '088-2131662',
    address: { ar: 'شارع البحر الاعظم', en: 'El Bahr El Aazam Street' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع أبوتيج', en: 'Abu Tig Branch Customer Service Center' },
    image: '/images/call-center/33.webp',
    mobile: '01210487708',
    landline: '088-2131662',
    address: { ar: 'بجوار رعاية الطفل', en: 'Beside Child Care Center' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع ساحل سليم', en: 'Sahel Selim Branch Customer Service Center' },
    image: '/images/call-center/32.webp',
    mobile: '01210487718',
    landline: '088-2131662',
    address: { ar: 'شارع الجمهوريه', en: 'El Gomhoria Street' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع منفلوط', en: 'Manfalut Branch Customer Service Center' },
    image: '/images/call-center/10.webp',
    mobile: '01210487749',
    landline: '088-2131662',
    address: { ar: 'شارع جسر ابومنديل - بجوار المعهد الأزهري', en: 'Gisr Abu Mandil Street - beside Al-Azhar Institute' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع القوصيه', en: 'El Qusiya Branch Customer Service Center' },
    image: '/images/call-center/31.webp',
    mobile: '01210487678',
    landline: '088-2131662',
    address: { ar: 'امام المرور القديم', en: 'In front of the old traffic office' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع أبنوب', en: 'Abnoub Branch Customer Service Center' },
    image: '/images/call-center/2.webp',
    mobile: '01210487737',
    landline: '088-2131662',
    address: { ar: 'شارع عثمان الغزالي بجوار المخبز الاَلي', en: 'Othman El Ghazaly Street beside the automatic bakery' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع مركز الفتح', en: 'El Fath Center Branch Customer Service Center' },
    image: '/images/call-center/1.webp',
    mobile: '01210487740',
    landline: '088-2131662',
    address: { ar: 'الناصريه أمام مركز الشرطة', en: 'El Nasria in front of the police station' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع صدفا', en: 'Sedfa Branch Customer Service Center' },
    image: '/images/call-center/40.webp',
    mobile: '01210487698',
    landline: '088-2131662',
    address: { ar: 'شارع الصيانة', en: 'El Siyana Street' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع مركز البداري', en: 'El Badari Center Branch Customer Service Center' },
    image: '/images/call-center/31.webp',
    mobile: '01284447689',
    landline: '088-2131662',
    address: { ar: 'شارع مجلس النيابه القديم', en: 'Old Prosecution Council Street' },
  },
  {
    title: { ar: 'مركز خدمة عملاء فرع الغنايم', en: 'El Ghanayem Branch Customer Service Center' },
    image: '/images/call-center/1.webp',
    mobile: '01210487696',
    landline: '088-2131662',
    address: { ar: 'الغنايم بحري خلف مركز الشرطة', en: 'El Ghanayem Bahri behind the police station' },
  },
];

function CallCenterPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-8" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-6xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <h1 className={`text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl ${textAlignmentClass}`}>
                {isEnglish ? 'Customer Service' : 'خدمه العملاء'}
              </h1>
              <p className={`mt-2 text-sm leading-7 text-slate-600 sm:text-base ${textAlignmentClass}`}>
                {isEnglish ? 'Customer Service Centers' : 'مركز خدمه العملاء'}
              </p>
            </div>

            <div className="space-y-5 px-6 py-6 text-slate-700 sm:px-8 sm:py-8">
              <p className="text-justify leading-8">
                {isEnglish
                  ? 'Customer service is considered the first gateway for the customer to enter Assiut and New Valley Water and Wastewater Company, and its most important goal is to gain customer satisfaction and improve the company image.'
                  : 'تعتبر خدمة العملاء البوابة الاولى لدخول العميل لشركة مياه الشرب والصرف الصحى بأسيوط الوادى الجديد حيث ان الهدف الاهم لخدمة العملاء هو كسب رضا العميل وتحسين الصورة الذهنية عن الشركة.'}
              </p>
              <p className="text-justify leading-8">
                {isEnglish
                  ? 'The General Administration of Customer Service is one of the most important departments in Assiut and New Valley Water and Wastewater Company. Through its branches spread across the governorate centers, it provides many services including new water meter contracts, wastewater connections, replacement of faulty meters, transfer of meter ownership, tank cleaning, prepaid meter charging, and receiving commercial complaints.'
                  : 'تعد الادارة العامة لخدمة العملاء من الادارات ذات اهمية كبرى بشركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد حيث تقوم من خلال فروعها المنتشرة بجميع مراكز المحافظة من تقديم العديد من الخدمات ومنها التعاقد على عداد مياه جديد ( تنظيمى – كودى ) والتعاقد على توصيلة صرف صحى وتغير العدادات المعطلة والتنازل عن ملكية العداد للغير وغسيل الخزانات وشحن عداد مسبق الدفع وتلقى الشكاوى التجارية وفتعد هى الوجه المشرفة التى تقوم بحركة الوصل المباشر مع العملاء.'}
              </p>
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <h2 className={`text-base font-extrabold text-[#0a3555] sm:text-lg ${textAlignmentClass}`}>
                  {isEnglish
                    ? 'To provide the best possible level of customer service, the company established a group of customer service centers in different areas to cover most of the governorate and its centers.'
                    : 'ولكى تتمكن الشركـة من تقديم أفضل مستوى لخدمة العملاء قامت الشركــة بإنشاء مجموعة من مراكز خدمة العملاء فى مراكز مختلفة بحيث تقوم بتغطية أغلب المناطق الجغرافية للسكان داخل المحافظة ومراكزها.'}
                </h2>
                <div className="mt-8 space-y-6">
                  {centers.map((center) => (
                    <div key={center.title.ar} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                      <div className="mx-auto aspect-[13/7] w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                        <img
                          decoding="async"
                          src={center.image}
                          alt={t(center.title)}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 ${textAlignmentClass}`}>
                        <h3 className="text-lg font-extrabold text-[#0a3555]">{t(center.title)}</h3>
                        <div className="mt-4 space-y-3 text-sm leading-7">
                          <p className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                            {center.mobile}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                            {center.landline}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                            {t(center.address)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CallCenterPage;
