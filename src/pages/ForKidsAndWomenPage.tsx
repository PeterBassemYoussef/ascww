import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import { useSiteVideoLinks } from '../hooks/useSiteVideoLinks';
import { normalizeYouTubeEmbedUrl } from '../utils/helpers';

const KIDS_VIDEO_META = [
  {
    title: {
      ar: 'ترشيد الأطفال في استهلاك المياه',
      en: 'Teaching children to conserve water',
    },
    key: 'kidsWaterUse',
  },
  {
    title: {
      ar: 'نوره والماء',
      en: 'Nora and water',
    },
    key: 'kidsNoraWater',
  },
  {
    title: {
      ar: 'نصائح للحفاظ على الماء',
      en: 'Tips for saving water',
    },
    key: 'kidsWaterTips',
  },
  {
    title: {
      ar: 'المحافظة على الماء',
      en: 'Protecting water',
    },
    key: 'kidsSaveWater',
  },
] as const;

const WOMEN_SECTION_IMAGES = [
  '/images/awareness/1.webp',
  '/images/awareness/2.webp',
  '/images/awareness/3.webp',
];

const WOMEN_TIPS = [
  {
    ar: 'غلق الحنفية أثناء غسيل الأسنان بالفرشاة (إن معدل الوقت المستغرق لتنظيف الأسنان هو دقيقة وعشرين ثانية فإذا فتحنا حنفية الماء طوال تلك المدة فسنكون قد أهدرنا حوالي 8 لترات من الماء.)',
    en: 'Turn off the tap while brushing your teeth. Since brushing usually takes about one minute and twenty seconds, leaving the water running during that time may waste about 8 liters of water.',
  },
  {
    ar: 'تأكدي من غلق الأولاد الحنفية جيدا بعد الاستخدام مباشرة، سواء بعد غسيل الأيدي أو الاستحمام.',
    en: 'Make sure children close the tap properly immediately after use, whether after washing their hands or after bathing.',
  },
  {
    ar: 'يمكنك وضع وعاء في الحوض عند غسيل الخضروات وإعادة استخدامها في ري النباتات أو ملء صندوق الصرف (السيفون) منها.',
    en: 'You can place a bowl in the sink while washing vegetables and reuse that water for watering plants or filling the flush tank.',
  },
  {
    ar: 'تأكدي من عدم تسريب أي من الأدوات الصحية للمياه بالمنزل وسارعي في صيانتها إن وجد التسريب.',
    en: 'Make sure none of the sanitary fixtures at home are leaking, and repair them quickly if any leak appears.',
  },
  {
    ar: 'يمكنك صيانة الأدوات الصحية الخفيفية بنفسك، من خلال الاسترشاد بدليل مبادىء «فنيات السباكة».',
    en: 'You can handle light sanitary fixture maintenance yourself by referring to a basic plumbing guide.',
  },
  {
    ar: 'باستخدامك للقطع الموفرة في الأدوات الصحية يمكنك توفير 50% من الاستهلاك الشهري، فالقطع الموفرة تعمل على تخفيض تدفق المياه بنسبة 35% من خلال شكة المصفاة الموجودة بالقطعة.',
    en: 'Using water-saving parts in sanitary fixtures can reduce monthly consumption by up to 50%, as these parts reduce water flow by about 35% through the built-in screen system.',
  },
  {
    ar: 'انتظامك في سداد فاتورتك يضمن لك استمرار توصيل الخدمة بالجودة المطلوبة.',
    en: 'Paying your bill regularly helps ensure continued service at the required quality.',
  },
  {
    ar: 'تطهير خزانات المياه يضمن لكي ولأولادك مياه نظيفة وصحية، لطلب تطهير خزانك برجاء الاتصال بالخط الساخن 125.',
    en: 'Disinfecting water tanks ensures clean and healthy water for you and your children. To request tank disinfection, please call the hotline 125.',
  },
  {
    ar: 'في حال وجود شكاوى او استفسارات تتعلق بالمياه أو الصرف الصحي يمكنك الاتصال برقم 125 من أي تليفون ارضي.',
    en: 'If you have complaints or inquiries related to water or wastewater services, you can call 125 from any landline telephone.',
  },
];

function ForKidsAndWomenPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const siteVideoLinks = useSiteVideoLinks();
  const kidsVideos = KIDS_VIDEO_META.map((video) => ({
    title: isEnglish ? video.title.en : video.title.ar,
    src: normalizeYouTubeEmbedUrl(siteVideoLinks[video.key]),
  }));

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`${headerGradientClass} px-6 py-7 text-white sm:px-8`}>
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                {t('التوعية والاتصال', 'Awareness and Communication')}
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{t('ركن الأطفال ولكِ سيدتي', 'Kids and Women Corner')}</h1>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className={`mb-4 text-xl font-bold text-[#0a3555] ${textAlignmentClass}`}>{t('ركن الأطفال', 'Kids Corner')}</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {kidsVideos.map((video) => (
                    <article key={video.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className={`border-b border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 ${textAlignmentClass}`}>
                        {video.title}
                      </div>
                      <div className="aspect-video w-full">
                        <iframe
                          src={video.src}
                          title={video.title}
                          className="h-full w-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className={`mb-4 text-xl font-bold text-[#0a3555] ${textAlignmentClass}`}>{t('لكِ سيدتي', 'For Women')}</h2>
                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {WOMEN_SECTION_IMAGES.map((imageUrl, index) => (
                    <div key={imageUrl} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                      <img
                        decoding="async"
                        src={imageUrl}
                        alt={t(`صورة توعوية ${index + 1}`, `Awareness image ${index + 1}`)}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className={`mb-4 text-base font-bold text-slate-800 ${textAlignmentClass}`}>
                  {t(
                    'الخطوات التي يجب اتباعها لتخفيض استهلاك الفاتورة والمحافظة على المياه',
                    'Steps to reduce bill consumption and conserve water'
                  )}
                </p>
                <ul className="mb-5 space-y-2 text-slate-700">
                  {WOMEN_TIPS.map((tip) => (
                    <li key={tip.ar} className={`leading-8 ${textAlignmentClass}`}>- {isEnglish ? tip.en : tip.ar}</li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ForKidsAndWomenPage;
