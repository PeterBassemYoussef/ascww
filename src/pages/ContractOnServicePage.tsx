import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const STAGES: Array<{
  title: LocalizedText;
  steps: LocalizedText[];
  image: string;
}> = [
  {
    title: { ar: 'المرحلة الأولى: الاستعلام والتحضير', en: 'Stage 1: Inquiry and Preparation' },
    steps: [
      {
        ar: 'الحصول على المعلومات: من الموقع الإلكتروني، تطبيق HCWW-125، الخط الساخن 125، أو دليل الخدمات لمعرفة المستندات المطلوبة.',
        en: 'Get the information from the website, HCWW-125 app, hotline 125, or the service guide to learn the required documents.',
      },
      {
        ar: 'الاستقبال (3 دقائق): مراجعة مبدئية للمستندات، تسليم بطاقة تعارف، وتخصيص رقم عميل.',
        en: 'Reception (3 minutes): initial document review, receiving an introduction card, and assigning a customer number.',
      },
    ],
    image: '/images/ContractOnService/ContractOnService 1.webp',
  },
  {
    title: { ar: 'المرحلة الثانية: تقديم الطلب والسداد المبدئي', en: 'Stage 2: Application Submission and Initial Payment' },
    steps: [
      {
        ar: 'تقديم طلب الخدمة (5 دقائق): مراجعة نهائية للمستندات والتوقيع على الأوراق الرسمية.',
        en: 'Submit the service request (5 minutes): final document review and signing the official papers.',
      },
      {
        ar: 'الخزينة - السداد الأول (5 دقائق): دفع رسم المعاينة فقط ثم المغادرة.',
        en: 'Treasury - first payment (5 minutes): pay the inspection fee only, then leave.',
      },
    ],
    image: '/images/ContractOnService/ContractOnService2.webp',
  },
  {
    title: { ar: 'المرحلة الثالثة: الإجراءات الفنية والمقايسة', en: 'Stage 3: Technical Procedures and Estimate' },
    steps: [
      {
        ar: 'إجراءات داخلية (خلال 48 ساعة): تحويل الطلب لعمل المعاينة الميدانية وتحديد قيمة المقايسة.',
        en: 'Internal procedures (within 48 hours): the request is referred for site inspection and estimation of the cost.',
      },
      {
        ar: 'التواصل: يتم الاتصال لإبلاغك بالقيمة النهائية وطلب الحضور للسداد.',
        en: 'Communication: you are contacted to inform you of the final amount and request your attendance for payment.',
      },
    ],
    image: '/images/ContractOnService/ContractOnService3.webp',
  },
  {
    title: { ar: 'المرحلة الرابعة: التعاقد النهائي والتركيب', en: 'Stage 4: Final Contract and Installation' },
    steps: [
      {
        ar: 'الخزينة - السداد النهائي (5 دقائق): سداد الرسوم النهائية (قيمة المقايسة).',
        en: 'Treasury - final payment (5 minutes): pay the final fees (the estimated amount).',
      },
      {
        ar: 'الحصول على الخدمة (خلال 48 ساعة): تحويل الطلب للتركيب، تركيب العداد، وبدء إصدار الفواتير.',
        en: 'Service delivery (within 48 hours): the request is transferred for installation, the meter is installed, and billing begins.',
      },
    ],
    image: '/images/ContractOnService/ContractOnService4.webp',
  },
];

function ContractOnServicePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const listPaddingClass = isEnglish ? 'pl-5' : 'pr-5';

  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_20%_10%,_rgba(89,173,121,0.2),_transparent_45%),linear-gradient(180deg,#f2f8f3_0%,#e9f3ea_100%)]"
        dir={isEnglish ? 'ltr' : 'rtl'}
      >
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className={`${headerGradientClass} px-6 py-7 text-white sm:px-8`}>
              <h1 className={`text-xl font-extrabold sm:text-2xl ${textAlignmentClass}`}>
                {t({
                  ar: 'رحلة المتعامل للتعاقد على طلب خدمة',
                  en: 'Customer Journey for Service Contract Requests',
                })}
              </h1>
              <p className={`mt-2 text-sm text-white/80 ${textAlignmentClass}`}>
                {t({
                  ar: 'أربع مراحل مختصرة توضح رحلتك من الاستعلام حتى تركيب العداد.',
                  en: 'Four concise stages explain your journey from inquiry to meter installation.',
                })}
              </p>
            </div>

            <div className="space-y-6 px-4 py-8 sm:px-8">
              {STAGES.map((stage, index) => (
                <div
                  key={stage.title.ar}
                  className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition hover:shadow-lg sm:grid-cols-2"
                >
                  <div className={`flex flex-col justify-center gap-2 ${textAlignmentClass}`}>
                    <div className="inline-flex items-center gap-2 font-extrabold text-[#0a3555]">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d7b05a] text-sm text-[#0a3555]">
                        {index + 1}
                      </span>
                      <span className="text-lg">{t(stage.title)}</span>
                    </div>
                    <ul className={`list-disc space-y-1 text-sm text-slate-800 ${listPaddingClass}`}>
                      {stage.steps.map((step) => (
                        <li key={step.ar}>{t(step)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    <img
                      src={stage.image}
                      alt={t(stage.title)}
                      loading="lazy"
                      className="h-full w-full object-contain bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContractOnServicePage;
