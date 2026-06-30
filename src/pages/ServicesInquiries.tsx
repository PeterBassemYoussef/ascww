import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const sections: Array<{
  title: LocalizedText;
  imageAr: string;
  imageEn: string;
  imageAlt: LocalizedText;
  items: LocalizedText[];
  note?: LocalizedText;
}> = [
  {
    title: {
      ar: 'الاحتياجات اللازمة للتعاقد علي العداد التنظيمي والمباني الإنشائية',
      en: 'Requirements for contracting a regular meter and licensed buildings',
    },
    imageAr: '/images/ask/ask2.webp',
    imageEn: '/images/ask/ask2EN.webp',
    imageAlt: {
      ar: 'متطلبات التعاقد على العداد التنظيمي',
      en: 'Requirements for contracting a regular meter',
    },
    items: [
      {
        ar: 'موافقة الجهة المختصة علي دخول المياه والصرف الصحي محل الأشتراك وصورة من مستندات الترخيص الصادرة من الجهات الرسمية.',
        en: 'Approval from the competent authority for water and wastewater connection to the subscription location, plus a copy of official licensing documents.',
      },
      {
        ar: 'نسخة معتمدة من الرسومات المعمارية لكافة الأدوار المبنية بمستندات الترخيص الصادرة من الجهات الرسمية في حالة الحاجة لها.',
        en: 'A certified copy of the architectural drawings for all built floors according to official licensing documents when needed.',
      },
      {
        ar: 'صورة بطاقة الرقم القومي للأشخاص الطبيعيين.',
        en: 'A copy of the national ID card for individuals.',
      },
      {
        ar: 'المستندات المؤيدة لحيازته لمحل الأشتراك (مستند ملكية-ترخيص مباني-عقد إيجار) أو أي مستند يؤيد الحيازة.',
        en: 'Documents proving possession of the subscription location such as ownership, building permit, lease contract, or any equivalent proof.',
      },
      {
        ar: 'صورة من تعاقد أو إيصال مرافق أخرى (كهرباء، غاز، تليفونات) إن وجد.',
        en: 'A copy of another utility contract or receipt such as electricity, gas, or telephone if available.',
      },
      {
        ar: 'تنازل من المشترك السابق في حالة طلب نقل الاشتراك باسمه.',
        en: 'A waiver from the previous subscriber if requesting transfer of the subscription into the applicant’s name.',
      },
      {
        ar: 'تنازل من الورثة في حالة طلب نقل الاشتراك من اسم المشترك المتوفي إلى طالب الاشتراك الجديد مرفقًا به صورة من إعلام الوراثة (الأصل للاطلاع).',
        en: 'A waiver from the heirs when transferring the subscription from a deceased subscriber to a new applicant, with a copy of the inheritance declaration (original for verification).',
      },
      {
        ar: 'في حالة النشاط غير المنزلي سواء كان خدمي أو تجاري أو صناعي أو سياحي يلزم الحصول علي مستند يفيد نوع النشاط والموافقة الكتابية من مالك العقار أو اتحاد الشاغلين حسب الأحوال والتي تفيد بعدم الممانعة في توصيل مياه الشرب للوحدة موضوع الطلب من بريزة العقار وصورة من السجل التجاري لم يمض عليه 6 أشهر.',
        en: 'For non-residential activity, whether service, commercial, industrial, or touristic, a document showing the activity type is required, along with written approval from the property owner or occupants association, and a copy of the commercial register issued within the past 6 months.',
      },
      {
        ar: 'وفي حالة تصحيح وضع وصلة مياه أو صرف صحي يلزم الحصول علي كشوف مشتملات من تاريخ إنشاء العقار مبين بها مكونات العقار وتاريخ الربط أو أي مستندات أخرى تدل علي تاريخ إنشاء العقار.',
        en: 'When correcting the status of a water or wastewater connection, property records from the date of construction are required, showing the property components and connection date, or any documents proving the construction date.',
      },
      {
        ar: 'أي مستند آخر ترى الشركة طلبه ويكون ضروريًا لصحة وسلامة عملية التوصيل.',
        en: 'Any other document the company deems necessary for the validity and safety of the connection process.',
      },
    ],
  },
  {
    title: {
      ar: 'المستندات المطلوبة للتعاقد علي العداد الكودي',
      en: 'Required documents for a coded meter contract',
    },
    imageAr: '/images/ask/ask1.webp',
    imageEn: '/images/ask/ask1EN.webp',
    imageAlt: {
      ar: 'متطلبات التعاقد على العداد الكودي',
      en: 'Requirements for contracting a coded meter',
    },
    items: [
      {
        ar: 'صورة الرقم القومي (البطاقة الشخصية).',
        en: 'A copy of the national ID card.',
      },
      {
        ar: 'صورة من عقد الملكية المستخرج من المحكمة أو صورة عقد الإيجار الموثق بالنسبة للمدينة أو عقد بيع ابتدائي بالنسبة للقرى.',
        en: 'A copy of the ownership contract issued by the court, a certified lease contract for cities, or a preliminary sales contract for villages.',
      },
      {
        ar: 'رسم كروكي معتمد من مكتب هندسي أو مهندس نقابي يكون موضحًا به الأبعاد والمساحة وعدد الآدوار وعدد الوحدات وعدد الغرف بكل وحدة وكذلك الحدود.',
        en: 'A sketch certified by an engineering office or licensed engineer showing dimensions, area, number of floors, number of units, number of rooms in each unit, and boundaries.',
      },
      {
        ar: 'صورة إيصال من أي خدمات أخرى (كهرباء - غاز) إن وجدت.',
        en: 'A copy of a receipt for other services such as electricity or gas, if available.',
      },
    ],
    note: {
      ar: 'أخذ إقرار على المواطن صاحب العقار أو من ينوب عنه (بتوكيل رسمي موثق في الشهر العقاري مع إرفاق صورة من التوكيل) بأنه قام بالتعدي على خطوط شبكة شركة مياه الشرب والصرف الصحي وأن العقار غير مقام على مناطق أثرية أو أملاك دولة وغير مخالف لقيود الارتفاع المقررة طبقًا لقانون الطيران المدني، وإذا ظهر خلاف ذلك يكون مسئول مسؤولية مدنية وجنائية مع حفظ حقوق الشركة في إزالة ورفع العداد والتوصيلة والرجوع على المواطن المذكور بالإجراءات اللازمة ضده دون أدنى مسئولية في ذلك على الشركة كما يتضمن الإقرار موافقة المواطن علي محاسبته بطريقة الممارسة ولحين تركيب العداد وبعد توقيع المواطن على الإقرار المعد لذلك والخاص بتوكيل خدمتي مياه الشرب أو الصرف الصحي طبقًا لقرار وزير الإسكان والمرافق والمجتمعات العمرانية رقم 377 لعام 2016 بتاريخ 31/5/2016 أو من ينوب عنه بتوكيل رسمي موثق في الشهر العقاري ويتم الاحتفاظ بصورة من التوكيل الرسمي العام أو أصل التوكيل الخاص بملف التوصيل.',
      en: 'An undertaking must be obtained from the property owner or their representative (with an officially notarized power of attorney and a copy attached) confirming the connection status and acknowledging responsibility according to the applicable regulations and procedures of the company and the Ministry of Housing decision No. 377 of 2016 dated 31/5/2016.',
    },
  },
  {
    title: {
      ar: 'المستندات المطلوبة في الصرف الصحي للحصول علي الخدمة',
      en: 'Required wastewater documents to obtain the service',
    },
    imageAr: '/images/ask/ask3.webp',
    imageEn: '/images/ask/ask3EN.webp',
    imageAlt: {
      ar: 'المستندات المطلوبة لخدمات الصرف الصحي',
      en: 'Required documents for wastewater services',
    },
    items: [
      {
        ar: 'إحضار الموافقة التنظيمية من الوحدة المحلية (منزلي – تجاري) وبالنسبة للنشاط التجاري يجب توضيح نوع النشاط في الموافقة التنظيمية.',
        en: 'Bring the organizational approval from the local unit (residential or commercial), and for commercial activity the approval must specify the activity type.',
      },
      {
        ar: 'الحصول علي تصريح حفر من الجهة المختصة بالمنطقة التابع لها الموقع المراد توصيل الصرف الصحي.',
        en: 'Obtain an excavation permit from the competent authority in the area where the wastewater connection is requested.',
      },
      {
        ar: 'رسومات هندسية للمسقط الأفقي للعقار للدور الأرضي موضح عليه طريقة الصرف الصحي ومعتمد من مهندس نقابي.',
        en: 'Engineering drawings of the ground-floor horizontal layout showing the wastewater method, certified by a licensed engineer.',
      },
      {
        ar: 'عدد 1 رسم موقع للعقار معتمد من مهندس نقابي، وعدد 2 رسومات هندسية للمحل موضح عليها طريقة الصرف الصحي والموقع العام للمحل ومعتمد من مهندس نقابي.',
        en: 'One site drawing of the property certified by a licensed engineer, and two engineering drawings for the premises showing the wastewater method and general location, also certified by a licensed engineer.',
      },
    ],
  },
];

function ProvideRequestPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const localizedImageSrc = (arabicSrc: string, englishSrc: string) => (isEnglish ? englishSrc : arabicSrc);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const listPaddingClass = isEnglish ? 'pl-6' : 'pr-6';

  useEffect(() => {
    if (!zoomedImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-8" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-6xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <h1 className={`text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl ${textAlignmentClass}`}>
                {t({
                  ar: 'الأسئلة الشائعة عن طلبات شركة المياه',
                  en: 'Frequently Asked Questions About Water Company Requests',
                })}
              </h1>
              <p className={`mt-2 text-sm leading-7 text-slate-600 sm:text-base ${textAlignmentClass}`}>
                {t({
                  ar: 'كل ما تحتاج معرفته قبل تقديم طلبات المياه أو الصرف الصحي.',
                  en: 'Everything you need to know before submitting water or wastewater service requests.',
                })}
              </p>
            </div>

            <div className="space-y-8 px-6 py-8 text-slate-800 sm:px-8">
              {sections.map((section) => (
                <section key={section.title.ar} className="space-y-4">
                  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className={`space-y-4 ${textAlignmentClass}`}>
                      <h2 className="text-xl font-extrabold text-[#0a3555]">{t(section.title)}</h2>
                      <ul className={`list-disc space-y-3 leading-8 ${listPaddingClass}`}>
                        {section.items.map((item) => (
                          <li key={item.ar}>{t(item)}</li>
                        ))}
                      </ul>
                      {section.note ? (
                        <p className={`rounded-2xl bg-slate-50 px-4 py-3 leading-8 text-slate-700 ${textAlignmentClass}`}>
                          {t(section.note)}
                        </p>
                      ) : null}
                    </div>
                    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                      <img
                        src={localizedImageSrc(section.imageAr, section.imageEn)}
                        alt={t(section.imageAlt)}
                        className="h-full w-full cursor-zoom-in object-cover transition hover:brightness-95"
                        loading="lazy"
                        decoding="async"
                        onClick={() => setZoomedImage({ src: localizedImageSrc(section.imageAr, section.imageEn), alt: t(section.imageAlt) })}
                      />
                    </figure>
                  </div>
                </section>
              ))}

              <section className={`rounded-2xl border border-dashed border-[#0a3555]/25 bg-[#0a3555]/3 px-4 py-5 text-slate-800 ${textAlignmentClass}`}>
                <p className="text-lg font-bold text-[#0a3555]">
                  {t({
                    ar: 'لتقديم الطلب اضغط على الرابط التالي',
                    en: 'To submit a request, use the following link',
                  })}{' '}
                  <a
                    href="https://ecp.hcww.com.eg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-extrabold text-[#0a3555] underline decoration-2 underline-offset-4 hover:text-[#1170b0]"
                  >
                    {t({ ar: 'اضغط هنا', en: 'Click here' })}
                    <span aria-hidden="true">↗</span>
                  </a>
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {t({
                    ar: 'سيتم فتح موقع الشركة القابضة لتقديم الطلب.',
                    en: 'The Holding Company website will open to submit the request.',
                  })}
                </p>
              </section>
            </div>
          </section>
        </div>

        {zoomedImage && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setZoomedImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-h-[90vh] max-w-full object-contain"
                loading="eager"
              />
              <button
                type="button"
                aria-label={t({ ar: 'إغلاق الصورة', en: 'Close image' })}
                className={`absolute top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#0a3555] shadow hover:bg-white ${isEnglish ? 'right-3' : 'left-3'}`}
                onClick={() => setZoomedImage(null)}
              >
                {t({ ar: 'إغلاق', en: 'Close' })}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ProvideRequestPage;
