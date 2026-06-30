import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

type ContentSection = {
  title: LocalizedText;
  image: {
    srcAr: string;
    srcEn: string;
    alt: LocalizedText;
  };
  paragraphs: LocalizedText[];
};

const contentSections: ContentSection[] = [
  {
    title: {
      ar: 'نبذه عن أهميه التخلص مياه الصرف الصحي',
      en: 'Overview of the importance of wastewater disposal',
    },
    image: {
      srcAr: '/images/prosses-water/kind-of-waste-water2.webp',
      srcEn: '/images/prosses-water/kind-of-waste-water2EN.webp',
      alt: {
        ar: 'أنواع محطات معالجة مياه الصرف الصحي',
        en: 'Wastewater treatment plant systems',
      },
    },
    paragraphs: [
      {
        ar: 'التخلص من میاه الصرف الصحي ھو التصریف الآمن والمستدام بیئیا لإعادة استخدام میاه الصرف المعالجة، وتتولى الشركة القابضة لمیاه الشرب والصرف الصحى والشركات التابعه ومنھا شركة اسیوط والوادى الجدید لمیاه الشرب والصرف الصحى بمعظم عملیات التخلص من میاه الصرف الصحي المعاد تدویرھا والمواد الصلبة الناتجھ ویطلق على أیة میاه یمكن إعادة استخدامھا مرة أخرى المیاه المعاد تدویرھا والحمأة الناتجة عن میاه الصرف الصحي المعالجة المخلفات الصلبة بالحمأه',
        en: 'Wastewater disposal means the safe and environmentally sustainable handling of treated wastewater for reuse. The Holding Company for Water and Wastewater and its subsidiaries, including Assiut and New Valley Water and Wastewater Company, manage most disposal operations for recycled wastewater and the resulting solids. Any water that can be reused again is considered recycled water, and the sludge resulting from treatment is regarded as solid biosolids.',
      },
      {
        ar: 'یتم استخدام المیاه المعاد تدویرھا لري المسطحات الخضراء والحدائق وتعتبر جمھوریة مصر العربیة من أوائل الدول التي طبقت الإرشادات التوجیھیة لمنظمة الصحة العالمیة بشأن إعادة استخدام المیاه.',
        en: 'Recycled water is used to irrigate green spaces and gardens, and the Arab Republic of Egypt is considered one of the early countries to apply the World Health Organization guidelines on water reuse.',
      },
      {
        ar: 'إن استخدام المیاه المعاد تدویرھا یلعب دورا ھاما في تلبیة الطلب المتزاید على المیاه غیر الصالحة للشرب في مجالات الري للغابات الشجریة والتبرید والمطالب الصناعیة.',
        en: 'The use of recycled water plays an important role in meeting growing demand for non-potable water in forestry irrigation, cooling, and industrial applications.',
      },
      {
        ar: 'تحتوي المخلفات الصلبة (الحمأه ) على عناصر غذائیة وعضویة مھمة ومن الممكن استخدامھا كأسمد أو كمحسنات للتربة أو كوقود لبعض المصانع وتقوم الدوله حالیا بدراسة مزید من الخیارات للاستفادة من تلك المخلفات',
        en: 'Solid residues, or sludge, contain important nutrients and organic matter and may be used as fertilizer, soil conditioner, or fuel for some factories. The state is currently studying additional options to benefit from these residues.',
      },
    ],
  },
  {
    title: {
      ar: 'أنواع محطات المعالجة',
      en: 'Types of treatment plants',
    },
    image: {
      srcAr: '/images/prosses-water/kind-of-waste-water1.webp',
      srcEn: '/images/prosses-water/kind-of-waste-water1EN.webp',
      alt: {
        ar: 'أنواع محطات المعالجة',
        en: 'Types of treatment plants',
      },
    },
    paragraphs: [
      { ar: 'محطات المعالجه', en: 'Treatment plants' },
      {
        ar: 'باختصار يتم في المدن والقرى تجميع مياه الصرف الصحي في خطوط يتم توجيهها الى محطات المعالجة التي هي على نوعين :',
        en: 'In brief, wastewater in cities and villages is collected through lines that direct it to treatment plants, which are of two types:',
      },
      { ar: 'المحطات المفتوحة', en: 'Open plants' },
      {
        ar: 'تدخل فيها المياه في عدة مراحل من أحواض ترسيب وتجميع وتصفية لفصل المواد المحملة بالمياه واستبعاد مالايمكن الاستفادة منه وترسيب الباقي لاستخدامه كسماد وكذلك استخدام المياه المصفاة واعادة توجيهها لاقنية الري وعيوب هذه الطريقة الروائح الكريهة التي تصدر منها على الجوار وحاجتها لمساحات كبيرة ( حسب حجم المياه المصصممة لاستيعابها ) وبالتالي يجب أن تكون بعيدة ماأمكن عن المجمعات السكنية',
        en: 'In this type, water passes through several stages of settling, collection, and screening to separate carried materials, discard what cannot be used, and settle the remaining solids for use as fertilizer. The treated water can also be redirected to irrigation canals. The drawbacks of this method are the unpleasant odors it may emit and the large areas it requires, so it should be located as far as possible from residential communities.',
      },
      { ar: 'الطريقة المغلقة', en: 'Closed systems' },
      {
        ar: 'لاتختلف آلية المعالجة كثيراً عن النظام السابق غير أنها مغلقة لايشعر أحد بوجودها لانها محكمة الاغلاق ويمكن تنفيذها في حديقة عامة مثلاً .',
        en: 'The treatment mechanism does not differ greatly from the previous system, but it is enclosed and tightly sealed, so it is hardly noticeable and can even be implemented in places such as public gardens.',
      },
      {
        ar: 'للنظامين الاحجام المناسبة والتصميم المناسب حسب كميات المياه المطلوب معالجتها يومياً .',
        en: 'Both systems are designed in suitable sizes according to the quantity of water that must be treated each day.',
      },
    ],
  },
];

function SafeSewageDisposalPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const localizedImageSrc = (section: ContentSection) => (isEnglish ? section.image.srcEn : section.image.srcAr);
  const paragraphAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const figureLayoutClass = isEnglish
    ? 'mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-right md:mb-3 md:mr-6 md:w-[36%]'
    : 'mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]';
  const contentOrderClass = 'md:order-1';
  const figureOrderClass = 'md:order-2';
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
                {t({ ar: 'أهمية التخلص الآمن من الصرف الصحى', en: 'Importance of safe wastewater disposal' })}
              </h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              {contentSections.map((section) => (
                <article
                  key={section.title.ar}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6"
                >
                  <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">{t(section.title)}</h2>
                  {section.paragraphs.length > 0 && (
                    section.title.ar === 'أنواع محطات المعالجة' ? (
                      <div className="mt-4 flow-root">
                        <figure className={figureLayoutClass}>
                          <img
                            decoding="async"
                            src={localizedImageSrc(section)}
                            alt={t(section.image.alt)}
                            loading="lazy"
                            onClick={() =>
                              openLightbox({
                                src: localizedImageSrc(section),
                                alt: t(section.image.alt),
                              })
                            }
                            title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                            className="h-full w-full cursor-zoom-in object-cover"
                          />
                        </figure>
                        <div className="space-y-4">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                              {t(paragraph)}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(260px,36%)] md:items-start md:gap-6">
                          <p className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700 ${contentOrderClass}`}>
                            {t(section.paragraphs[0])}
                          </p>
                          <figure className={`mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:mt-0 ${figureOrderClass}`}>
                            <img
                              decoding="async"
                              src={localizedImageSrc(section)}
                              alt={t(section.image.alt)}
                              loading="lazy"
                              onClick={() =>
                                openLightbox({
                                  src: localizedImageSrc(section),
                                  alt: t(section.image.alt),
                                })
                              }
                              title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                              className="h-full w-full cursor-zoom-in object-cover"
                            />
                          </figure>
                        </div>
                        <div className="mt-4 space-y-4">
                          {section.paragraphs.slice(1).map((paragraph) => (
                            <p key={paragraph.ar} className={`${paragraphAlignmentClass} text-base leading-8 text-slate-700`}>
                              {t(paragraph)}
                            </p>
                          ))}
                        </div>
                      </>
                    )
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 px-4 py-8"
          onClick={closeLightbox}
          role="presentation"
        >
          <div
            className="relative max-h-full max-w-5xl"
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
              className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/20 bg-white object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default SafeSewageDisposalPage;
