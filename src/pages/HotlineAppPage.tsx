import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import { useSiteVideoLinks } from '../hooks/useSiteVideoLinks';
import { normalizeYouTubeEmbedUrl } from '../utils/helpers';

type LocalizedText = {
  ar: string;
  en: string;
};

const featureItems: LocalizedText[] = [
  {
    ar: 'التعرف على المعلومات والأخبار الخاصة بقطاع مياه الشرب والصرف الصحى.',
    en: 'Learn about information and news related to the drinking water and wastewater sector.',
  },
  {
    ar: 'إرسال إشعارات للمواطنين عند تحميل التطبيق بكيفية ترشيد الاستهلاك والحفاظ على شبكات الصرف الصحى.',
    en: 'Send notifications to citizens after installing the app about rational consumption and protecting wastewater networks.',
  },
  {
    ar: 'إرسال إشعارات بأعمال الصيانة المخططة وغير المخططة والتعرف على توقيتات انقطاع المياه لتنبيه المواطنين بتدبير احتياجاتهم من المياه.',
    en: 'Send notifications about planned and unplanned maintenance and water outage timings so citizens can prepare their water needs.',
  },
  {
    ar: 'تلقى شكاوى المواطنين والرد عليها.',
    en: 'Receive citizens complaints and respond to them.',
  },
  {
    ar: 'إمكانية التصوير الفوتوغرافى لمكان الشكوى أو الكسر وإرساله عبر التطبيق.',
    en: 'Allow photographing the complaint or breakage location and sending it through the app.',
  },
  {
    ar: 'إمكانية الدفع الإلكترونى لفواتير استهلاك مياه الشرب والصرف الصحى.',
    en: 'Enable electronic payment of drinking water and wastewater consumption bills.',
  },
];

const complaintTypes: LocalizedText[] = [
  { ar: 'كسور مواسير المياه.', en: 'Water pipe breaks.' },
  { ar: 'طفوحات الصرف الصحى.', en: 'Wastewater overflows.' },
  { ar: 'قيمة الفواتير.', en: 'Bill values.' },
];

function HotlineAppPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText | string, english?: string) => {
    if (typeof text === 'string') return isEnglish ? (english ?? text) : text;
    return isEnglish ? text.en : text.ar;
  };
  const localizedImageSrc = (arabicSrc: string, englishSrc: string) => (isEnglish ? englishSrc : arabicSrc);
  const { hotlineApp } = useSiteVideoLinks();
  const videoUrl = hotlineApp;
  const embeddedVideoUrl = normalizeYouTubeEmbedUrl(videoUrl);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const listPaddingClass = isEnglish ? 'pl-6' : 'pr-6';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-10" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`${headerGradientClass} px-6 py-7 text-white sm:px-8`}>
              <h1 className={`text-2xl font-extrabold sm:text-3xl ${textAlignmentClass}`}>{t('تطبيق الهاتف المحمول (HCWW 125)', 'Mobile App (HCWW 125)')}</h1>
              <p className={`mt-2 text-sm text-white/90 sm:text-base ${textAlignmentClass}`}>
                {t(
                  'لتلقى شكاوى المواطنين والسداد الإلكترونى للفواتير المتعلقة بخدمات مياه الشرب والصرف الصحى.',
                  'To receive citizens complaints and enable electronic payment for drinking water and wastewater service bills.'
                )}
              </p>
            </div>

            <div className="space-y-10 px-6 py-8 text-slate-800 sm:px-8">
              <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
                <div className={`min-w-0 space-y-4 break-words leading-8 ${textAlignmentClass}`}>
                  <p>
                    {t(
                      'تطبيق الهاتف المحمول (HCWW 125)، لتلقى شكاوى المواطنين والسداد الالكتروني للفواتير المتعلقة بخدمات مياه الشرب والصرف الصحى.',
                      'The mobile application (HCWW 125) is used to receive citizens complaints and enable electronic payment for bills related to drinking water and wastewater services.'
                    )}
                  </p>
                  <p>
                    {t(
                      'نشرت الشركة القابضة لمياه الشرب والصرف الصحى، فيديو تعريفى، يوضح كيفية تحميل والتسجيل فى التطبيق الجديد 125 الخاص بتلقى الشكاوى المتعلقة بالفواتير وانقطاع المياه وخلافه. وامكانية الدفع الالكتروني لفواتير استهلاك مياه الشرب والصرف الصحي',
                      'The Holding Company for Water and Wastewater published an introductory video explaining how to download and register in the new 125 app for complaints related to bills, water cuts, and more, in addition to electronic payment for water and wastewater consumption bills.'
                    )}
                  </p>
                </div>
                <figure
                  className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxImage(localizedImageSrc('/images/hotline/hotline1.webp', '/images/hotline/hotline1EN.webp'))}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxImage(localizedImageSrc('/images/hotline/hotline1.webp', '/images/hotline/hotline1EN.webp'))}
                >
                  <img
                    src={localizedImageSrc('/images/hotline/hotline1.webp', '/images/hotline/hotline1EN.webp')}
                    alt={t('تطبيق الخط الساخن HCWW 125', 'HCWW 125 hotline app')}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </section>

              <section className={`space-y-4 leading-8 ${textAlignmentClass}`}>
                <h2 className="text-xl font-extrabold text-[#0a3555]">{t('التحول الرقمى لخدمة المواطنين', 'Digital Transformation for Citizen Services')}</h2>
                <p>
                  {t(
                    'ياتي ذلك تنفيذا لتوجيهات القيادة السياسية نحو التحول الرقمي للقطاعات المختلفة بالدولة وخاصة الخدمات التي تمس المواطنين وفي اطار تطوير منظومة تكنولوجيا المعلومات بالشركة القابضة وطبقا للاجراءات الوقائية التي تتخذها الدولة المصرية للحد من انتشار فيروس كورونا المستجد .',
                    'This comes in implementation of the political leadership’s directives toward digital transformation across different sectors of the state, especially citizen-facing services, within the development of the information technology system of the Holding Company and according to the preventive measures adopted by the Egyptian state to limit the spread of the coronavirus.'
                  )}
                </p>
              </section>

              <section className={`space-y-4 ${textAlignmentClass}`}>
                <h2 className="text-xl font-extrabold text-[#0a3555]">{t('تحميل التطبيق', 'Download the App')}</h2>
                <p className="break-words leading-8 text-slate-700">
                  {t('يمكنك تحميل تطبيق (HCWW 125) من المتاجر الرسمية على أبل وأندرويد.', 'You can download the HCWW 125 app from the official Apple and Android stores.')}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://apps.apple.com/eg/app/%D9%A1%D9%A2%D9%A5/id1431089961"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('تحميل تطبيق الخط الساخن من متجر App Store', 'Download the hotline app from the App Store')}
                    className="transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt={t('تحميل من App Store', 'Download on the App Store')}
                      className="block h-16 w-[210px] max-w-full object-contain sm:h-20 sm:w-[240px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.hcww.it.myreading"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('تحميل تطبيق الخط الساخن من متجر Google Play', 'Download the hotline app from Google Play')}
                    className="transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt={t('تحميل من Google Play', 'Get it on Google Play')}
                      className="block h-[80px] w-[250px] max-w-full object-contain sm:h-[110px] sm:w-[320px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              </section>

              <section className={`space-y-4 ${textAlignmentClass}`}>
                <h2 className="text-xl font-extrabold text-[#0a3555]">{t('أهم مزايا التطبيق', 'Main App Features')}</h2>
                <p className="break-words leading-8">
                  {t(
                    'يتيح تطبيق الهاتف المحمول 125، عدة مزايا من أهمها، التعرف على المعلومات والأخبار الخاصة بقطاع مياه الشرب والصرف الصحى، وإرسال إشعارات للمواطنين عند تحميل التطبيق بكيفية ترشيد الاستهلاك والحفاظ على شبكات الصرف الصحى، وإرسال إشعارات بأعمال الصيانة المخططة وغير المخططة والتعرف على توقيتات انقطاع المياه لتنبيه المواطنين بتدبير احتياجاتهم من المياه، وتلقى شكاوى المواطنين والرد عليها، وإمكانية التصوير الفوتوغرافى لمكان الشكوى أو الكسر وإرساله عبر التطبيق.',
                    'The 125 mobile app provides several key features, including access to information and news about the drinking water and wastewater sector, notifications about consumption rationalization and network protection, notices about planned and unplanned maintenance and water outage timings, receiving and responding to complaints, and photographing complaint or breakage locations through the app.'
                  )}
                </p>
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
                  <ul className={`min-w-0 list-disc space-y-3 break-words leading-8 ${listPaddingClass}`}>
                    {featureItems.map((item) => (
                      <li key={item.ar}>{t(item)}</li>
                    ))}
                  </ul>
                  <figure
                    className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxImage(localizedImageSrc('/images/hotline/hotline2.webp', '/images/hotline/hotline2EN.webp'))}
                    onKeyDown={(e) => e.key === 'Enter' && setLightboxImage(localizedImageSrc('/images/hotline/hotline2.webp', '/images/hotline/hotline2EN.webp'))}
                  >
                    <img
                      src={localizedImageSrc('/images/hotline/hotline2.webp', '/images/hotline/hotline2EN.webp')}
                      alt={t('تطبيق الخط الساخن HCWW 125', 'HCWW 125 hotline app')}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </div>
              </section>

              <section className={`space-y-4 leading-8 ${textAlignmentClass}`}>
                <h2 className="text-xl font-extrabold text-[#0a3555]">{t('تصريحات رئيس مجلس الإدارة', 'Chairman Statements')}</h2>
                <p>
                  {t(
                    'كان المهندس ممدوح رسلان، رئيس مجلس إدارة الشركة القابضة لمياه الشرب والصرف الصحى، قد أكد أن الشركة أطلقت تطبيق الهاتف المحمول (HCWW 125)، لتلقى شكاوى المواطنين المتعلقة بخدمات مياه الشرب والصرف الصحى، سواء كسور مواسير المياه، أو طفوحات الصرف الصحى، أو قيمة الفواتير، حيث يقوم المواطن بتحميل التطبيق على هاتفه المحمول، وتسجيل حساب عليه بالبيانات الشخصية للمواطن، موضحاً أن التطبيق يتيح أيضاً للمواطن تلقى الأخبار بمواعيد انقطاع المياه وأعمال الصيانة المخططة لشبكات المياه والصرف الصحى، كما أنه جارٍ تفعيل خدمة دفع الفاتورة باستخدام التطبيق.',
                    'Engineer Mamdouh Raslan, Chairman of the Holding Company for Water and Wastewater, confirmed that the company launched the HCWW 125 mobile app to receive citizens complaints related to water and wastewater services, including water pipe breaks, wastewater overflows, and bill values. Citizens can download the app, register with their personal data, and also receive news about water outages and planned maintenance. Bill payment through the app is also being activated.'
                  )}
                </p>
                <ul className={`list-disc space-y-2 ${listPaddingClass}`}>
                  {complaintTypes.map((item) => (
                    <li key={item.ar}>{t(item)}</li>
                  ))}
                </ul>
              </section>

              <section className={`rounded-2xl border border-dashed border-[#0a3555]/25 bg-[#0a3555]/3 px-4 py-5 text-slate-800 ${textAlignmentClass}`}>
                <p className="text-lg font-bold text-[#0a3555]">{t('لمشاهدة الفيديو لتحميل واستخدام التطبيق', 'Watch the video to download and use the app')}</p>
                <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:max-w-lg">
                  <div className="relative aspect-video w-full bg-slate-100">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={embeddedVideoUrl}
                      title={t('فيديو شرح تطبيق الخط الساخن', 'Hotline app tutorial video')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0a3555] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#082b47]"
                  >
                    {t('مشاهدة الفيديو', 'Watch the video')}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`absolute -top-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 shadow-md hover:bg-white ${isEnglish ? 'right-0' : 'left-0'}`}
              onClick={() => setLightboxImage(null)}
            >
              {t('إغلاق', 'Close')}
            </button>
            <img
              src={lightboxImage}
              alt={t('تكبير الصورة', 'Image preview')}
              loading="lazy"
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default HotlineAppPage;
