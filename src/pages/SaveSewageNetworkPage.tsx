import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const introParagraphs: LocalizedText[] = [
  {
    ar: 'يتمّ تجميع مياه الصرف الصحي ونقلها من المدينة ومن القرية إلى المعهد لتنقية المجاري من خلال شبكة المواسير بواسطة قوة التجاذب والضخّ. وتحتاج هذه الشبكات إلى الرعاية والصيانة',
    en: 'Wastewater is collected and conveyed from cities and villages to treatment facilities through sewer pipelines by gravity flow and pumping. These networks require continuous care and maintenance.',
  },
  {
    ar: 'في الماضي قامت السلطات المحلية المسؤولة عن الصرف الصحي البلدي بتصريف المجاري دون التخطيط المنظم مع الصيانة طويلة الأمد للشبكة والأنابيب',
    en: 'In the past, local authorities responsible for municipal sanitation often handled sewage without organized planning or long-term maintenance of networks and pipelines.',
  },
  {
    ar: 'وفي نوفمبر عام 2011 م نشرت وزارة حماية البيئة والأنظمة الخاصّة بإدارة شبكات نقل الصرف الصحي، والتي تفرض على السلطات المحلية القيام بدراسة شاملة لشبكات النقل ضمن حدودها بالإضافة إلى وضع التخطيط المفصَّل للصيانة المستمرّة وطويلة الأمد وتبديل الأنابيب القديمة من فترة إلى أخرى',
    en: 'In November 2011, the Ministry of Environment published regulations for managing wastewater conveyance networks. These regulations require local authorities to conduct comprehensive studies of the networks within their boundaries, prepare detailed long-term maintenance plans, and replace old pipes periodically.',
  },
  {
    ar: 'تتطلب شبكات الصرف الصحي عمليات الصيانة الدورية والمهنية وذلك للحفاظ على الشبكة من عوامل الهدر وتحقيق الاستفادة القصوى من الشبكة',
    en: 'Sewer networks require periodic and professional maintenance to protect them from losses and ensure maximum benefit from the system.',
  },
];

const networkProblems: LocalizedText[] = [
  {
    ar: 'أكسدة المواسير وتآكلها وانكسارها حيث تتسرب مياه الصرف الصحي إلى الأرض والمياه الجوفية',
    en: 'Pipes may oxidize, corrode, and break, causing wastewater to leak into soil and groundwater.',
  },
  {
    ar: 'انسداد الأنابيب بالمواد العالقة',
    en: 'Pipelines may become clogged by suspended materials.',
  },
  {
    ar: 'الوقف المتكرر للمضخات بسبب انقطاع الكهرباء أو خلل ميكانيكي حيث تجري مياه الصرف الصحي إلى البيئة',
    en: 'Pumps may stop repeatedly because of power outages or mechanical failures, allowing wastewater to flow into the surrounding environment.',
  },
  {
    ar: 'انتشار الرائحة الكريهة من معاهد الضخّ',
    en: 'Unpleasant odors may spread from pumping stations.',
  },
];

const endingParagraphs: LocalizedText[] = [
  {
    ar: 'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها',
    en: 'Guidelines for planning and maintaining conveyance networks and pumping stations',
  },
  {
    ar: 'تتم الصيانة بالطرق التالية :',
    en: 'Maintenance is carried out through the following methods:',
  },
  {
    ar: 'إقامة نظام كهربائي بديل لضمان استمرار عمل المضخات في أوقات انقطاع الكهرباء',
    en: 'Establishing a backup electrical system to ensure the pumps continue operating during power outages.',
  },
  {
    ar: 'إبعاد معاهد الضخ من التجمعات السكانية أو إقامة المنشآت لتخفيض الروائح',
    en: 'Locating pumping stations away from populated areas or building facilities that reduce odors.',
  },
  {
    ar: 'استعمال التكنولوجيا المتقدمة منها تصوير الأنابيب',
    en: 'Using advanced technologies, including pipeline imaging and inspection.',
  },
  {
    ar: 'دراسة الوسائل الهندسية لتخفيض التآكل والتصدع',
    en: 'Studying engineering solutions to reduce corrosion and cracking.',
  },
  {
    ar: 'في المخططات لتطوير البناء في المدن والقري',
    en: 'Integrating these requirements into urban and village development plans.',
  },
  {
    ar: 'المطالبة بإبعاد مواسير الصرف الصحي عن الأحياء السكنية الجديدة .',
    en: 'Keeping sewer pipelines away from newly developed residential districts.',
  },
  {
    ar: 'المطالبة بالحماية الخاصّة للمواسير المتواجدة بالقرب من حفريات مياه الشرب',
    en: 'Providing special protection for pipelines located near drinking water excavations.',
  },
  {
    ar: 'نص التعليمات حول تخطيط المحطات لضخ مياه الصرف الصحي وصيانتها',
    en: 'These guidelines also define planning and maintenance requirements for wastewater pumping stations.',
  },
];

const regulationsParagraphs: LocalizedText[] = [
  {
    ar: 'تفرض أنظمة شبكة نقل الصرف الصحي التي نشرتها وزارة حماية البيئة في نوفمبر 2011 م على السلطات المحلية القيام بالدراسة الشاملة لشبكات نقل الصرف الصحي ضمن حدودها بالإضافة إلى وضع التخطيط المفصَّل للصيانة المستمرّة وتبديل المواسير القديمة.',
    en: 'The wastewater conveyance network regulations published by the Ministry of Environment in November 2011 require local authorities to conduct comprehensive studies of sewer networks within their boundaries, prepare detailed maintenance plans, and replace old pipelines.',
  },
  {
    ar: 'هدف الأنظمة:',
    en: 'Objective of the regulations:',
  },
  {
    ar: 'منع تسرب مياه الصرف الصحي من شبكة نقل المجاري من أجل حماية موارد المياه والنظم الإيكولوجية والتنوع البيولوجي ومنع الإزعاجات للبيئة.',
    en: 'To prevent wastewater leakage from conveyance networks in order to protect water resources, ecosystems, biodiversity, and the surrounding environment from harm.',
  },
  {
    ar: 'أهمّ مبادئ الأنظمة',
    en: 'Key principles of the regulations',
  },
  {
    ar: 'تقوم السلطة المحلية التي تنقل الصرف الصحي إلى حدود سلطة أخرى بإخبار السلطة التي تستوعب المجاري عن كل تغير في كمية الصرف الصحي وعن أي خلل في شبكة النقل تقوم السلطة المحلية بإقامة شبكة نقل الصرف الصحي وبإدارتها وبصيانتها لضمان منع تسرب مياه الصرف الصحي إلى البيئة.تقوم السلطة المحلية التي تستوعب الصرف الصحي من سلطة أخرى بإخبار السلطة المحلية التي تصرف المياه إليها عن كل تغيير في الشبكة المتواجدة في حدودها والتي قد تسبب التسرب والعكاره البيئية تقوم السلطة المحلية باحتفاظ جميع المعطيات عن شبكة نقل الصرف الصحي في الحاسوب وفي نظام المعلومات الجغرافي تقوم السلطة المحلية التي تمتلك شبكة نقل الصرف الصحي بالتخطيط المفصَّل لتجديد الشبكة وتطويرها حسينها قطع الصلة بين شبكة النقل وشبكة مصارف المياه وبالأعمال لتصليح أي تسرب وخلل بالإضافة إلى الصيانة اليومية يجب على السلطة المحلية تشغيل المحطة لضخ مياه الصرف الصحي وصيانتها بموجب إرشادات الوزارة لحماية البيئة تقوم السلطة المحلية بالفحص المنتظم لشبكة نقل مياه الصرف الصحي وتحتفظ بالمعطيات لمدّة 7 سنوات على الأقلّ تضع السلطة المحلية التعليمات لعلاج تسرب مياه الصرف الصحي وتقوم بالتصليح الفوري للخلل تنشر السلطة المحلية جميع المعطيات عن شبكة نقل مياه الصرف الصحي على موقع الإنترنت التابع للسلطة المحلية وتفتح أمام الجمهور في مكاتبها جميع المعطيات يفصل الملحق للأنظمة طول حياه مختلف أنواع المواسير لنقل الصرف الصحي حسب مادّة الماسورة إذا كانت من أسبست الاسمنت أو الفلاذ أو مختلف أنواع Polyethelen.',
    en: 'The local authority that sends wastewater to another authority must notify the receiving authority of any change in wastewater quantities and of any defect in the conveyance network. Each local authority is responsible for establishing, operating, and maintaining its sewer conveyance network to prevent wastewater leakage into the environment. Authorities that receive wastewater from neighboring jurisdictions must also report any network changes that may cause leakage or environmental turbidity. Authorities must retain all network data in computerized systems and geographic information systems, prepare detailed renewal and development plans, separate sewer conveyance from drainage systems, repair any leaks or faults in addition to daily maintenance, operate pumping stations according to the Ministry of Environment guidelines, conduct regular inspections, preserve records for at least seven years, issue procedures for handling leaks, carry out immediate repairs, and publish network information on the local authority website and in public offices. The regulations also specify the service life of different pipeline materials, including asbestos cement, steel, and various types of polyethylene.',
  },
];

function SaveSewageNetworkPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const localizedImageSrc = (arabicSrc: string, englishSrc: string) => (isEnglish ? englishSrc : arabicSrc);
  const paragraphAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const figureLayoutClass = (widthClass: string) =>
    isEnglish
      ? `mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-right md:mb-3 md:mr-6 ${widthClass}`
      : `mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 ${widthClass}`;
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const openLightbox = (image: { src: string; alt: string }) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                {t({ ar: 'أهمية الحفاظ على شبكة الصرف الصحى', en: 'Importance of preserving the sewer network' })}
              </h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'طريقه الحفاظ علي شبكات مياه الصرف الصحي', en: 'How wastewater networks are preserved' })}
                </h2>
                <div className="mt-4 flow-root">
                  <figure className={figureLayoutClass('md:w-[36%]')}>
                    <img
                      decoding="async"
                      src={localizedImageSrc('/images/prosses-water/save1.webp', '/images/prosses-water/save1EN.webp')}
                      alt={t({ ar: 'أهمية الحفاظ على شبكة الصرف الصحي', en: 'Preserving the sewer network' })}
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: localizedImageSrc('/images/prosses-water/save1.webp', '/images/prosses-water/save1EN.webp'),
                          alt: t({ ar: 'أهمية الحفاظ على شبكة الصرف الصحي', en: 'Preserving the sewer network' }),
                        })
                      }
                      title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                        {t(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'مشاكل صيانه الشبكه', en: 'Network maintenance problems' })}
                </h2>
                <div className="mt-4 flow-root">
                  <figure className={figureLayoutClass('md:w-[36%]')}>
                    <img
                      decoding="async"
                      src={localizedImageSrc('/images/prosses-water/save2.webp', '/images/prosses-water/save2EN.webp')}
                      alt={t({ ar: 'مشاكل صيانة شبكة الصرف الصحي', en: 'Sewer network maintenance problems' })}
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: localizedImageSrc('/images/prosses-water/save2.webp', '/images/prosses-water/save2EN.webp'),
                          alt: t({ ar: 'مشاكل صيانة شبكة الصرف الصحي', en: 'Sewer network maintenance problems' }),
                        })
                      }
                      title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <p className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                    {t({ ar: 'من أهمّ المشاكل في صيانة هذه الشبكة', en: 'Some of the main problems in maintaining this network are:' })}
                  </p>
                  <div className="mt-4 space-y-4">
                    {networkProblems.map((paragraph) => (
                      <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                        {t(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها', en: 'Guidelines for planning and maintaining conveyance networks and pumping stations' })}
                </h2>
                <div className="mt-4 flow-root">
                  <figure className={figureLayoutClass('md:w-[36%]')}>
                    <img
                      decoding="async"
                      src={localizedImageSrc('/images/prosses-water/save3.webp', '/images/prosses-water/save3EN.webp')}
                      alt={t({ ar: 'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها', en: 'Guidelines for planning and maintaining pumping stations and conveyance networks' })}
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: localizedImageSrc('/images/prosses-water/save3.webp', '/images/prosses-water/save3EN.webp'),
                          alt: t({ ar: 'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها', en: 'Guidelines for planning and maintaining pumping stations and conveyance networks' }),
                        })
                      }
                      title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {endingParagraphs.slice(1).map((paragraph) => (
                      <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                        {t(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها', en: 'Regulations for planning and maintaining sewer conveyance networks' })}
                </h2>
                <div className="mt-4 flow-root">
                  <figure className={figureLayoutClass('md:w-[44%]')}>
                    <img
                      decoding="async"
                      src={localizedImageSrc('/images/prosses-water/save4.webp', '/images/prosses-water/save4EN.webp')}
                      alt={t({ ar: 'الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها', en: 'Regulations for planning and maintaining sewer conveyance networks' })}
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: localizedImageSrc('/images/prosses-water/save4.webp', '/images/prosses-water/save4EN.webp'),
                          alt: t({ ar: 'الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها', en: 'Regulations for planning and maintaining sewer conveyance networks' }),
                        })
                      }
                      title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {regulationsParagraphs.map((paragraph) => (
                      <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                        {t(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 px-2 py-4 sm:px-4 sm:py-6"
          onClick={closeLightbox}
          role="presentation"
        >
          <div
            className="relative max-h-full max-w-[96vw]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.alt}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow"
            >
              {t({ ar: 'إغلاق', en: 'Close' })}
            </button>
            <img
              loading="lazy"
              decoding="async"
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[92vh] w-auto max-w-full rounded-2xl border border-white/20 bg-white object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default SaveSewageNetworkPage;
