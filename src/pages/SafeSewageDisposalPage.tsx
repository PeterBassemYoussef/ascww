import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const contentSections = [
  {
    title: 'نبذه عن أهميه التخلص مياه الصرف الصحي',
    image: {
      src: '/images/prosses-water/kind-of-waste-water2.webp',
      alt: 'أنواع محطات معالجة مياه الصرف الصحي',
    },
    paragraphs: [
      'التخلص من میاه الصرف الصحي ھو التصریف الآمن والمستدام بیئیا لإعادة استخدام میاه الصرف المعالجة، وتتولى الشركة القابضة لمیاه الشرب والصرف الصحى والشركات التابعھ ومنھا شركة اسیوط والوادى الجدید لمیاه الشرب والصرف الصحى بمعظم عملیات التخلص من میاه الصرف الصحي المعاد تدویرھا والمواد الصلبة الناتجھ ویطلق على أیة میاه یمكن إعادة استخدامھا مرة أخرى المیاه المعاد تدویرھا والحمأة الناتجة عن میاه الصرف الصحي المعالجة المخلفات الصلبة بالحمأه',
      'یتم استخدام المیاه المعاد تدویرھا لري المسطحات الخضراء والحدائق وتعتبر جمھوریة مصر العربیھ من أوائل الدول التي طبقت الإرشادات التوجیھیة لمنظمة الصحة العالمیة بشأن إعادة استخدام المیاه.',
      'إن استخدام المیاه المعاد تدویرھا یلعب دورا ھاما في تلبیة الطلب المتزاید على المیاه غیر الصالحة للشرب في مجالات الري للغابات الشجریھ والتبرید والمطالب الصناعیة.',
      'تحتوي المخلفات الصلبة (الحمأه ) على عناصر غذائیة وعضویة مھمة ومن الممكن استخدامھا كأسمد أو كمحسنات للتربة أو كوقود لبعض المصانع وتقوم الدولھ حالیا بدراسة مزید من الخیارات للاستفادة من تلك المخلفات',
    ],
  },
  {
    title: 'أنواع محطات المعالجة',
    image: {
      src: '/images/prosses-water/kind-of-waste-water1.webp',
      alt: 'أنواع محطات المعالجة',
    },
    paragraphs: [
      'محطات المعالجه',
      'باختصار يتم في المدن والقرى تجميع مياه الصرف الصحي في خطوط يتم توجيهها الى محطات المعالجة التي هي على نوعين :',
      'المحطات المفتوحة',
      'تدخل فيها المياه في عدة مراحل من أحواض ترسيب وتجميع وتصفية لفصل المواد المحملة بالمياه واستبعاد مالايمكن الاستفادة منه وترسيب الباقي لاستخدامه كسماد وكذلك استخدام المياه المصفاة واعادة توجيهها لاقنية الري وعيوب هذه الطريقة الروائح الكريهة التي تصدر منها على الجوار وحاجتها لمساحات كبيرة ( حسب حجم المياه المصصممة لاستيعابها ) وبالتالي يجب أن تكون بعيدة ماأمكن عن المجمعات السكنية',
      'الطريقة المغلقة',
      'لاتختلف آلية المعالجة كثيراً عن النظام السابق غير أنها مغلقة لايشعر أحد بوجودها لانها محكمة الاغلاق ويمكن تنفيذها في حديقة عامة مثلاً .',
      'للنظامين الاحجام المناسبة والتصميم المناسب حسب كميات المياه المطلوب معالجتها يومياً .',
    ],
  },
];

function SafeSewageDisposalPage() {
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
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">أهمية التخلص الآمن من الصرف الصحى</h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              {contentSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6"
                >
                  <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">{section.title}</h2>
                  {section.paragraphs.length > 0 && (
                    section.title === 'أنواع محطات المعالجة' ? (
                      <div className="mt-4">
                        {section.image && (
                          <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                            <img decoding="async"
                              src={section.image.src}
                              alt={section.image.alt}
                              loading="lazy"
                              onClick={() =>
                                openLightbox({
                                  src: section.image!.src,
                                  alt: section.image!.alt,
                                })
                              }
                              title="اضغط للتكبير"
                              className="h-full w-full cursor-zoom-in object-cover"
                            />
                          </figure>
                        )}
                        <div className="space-y-4">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(260px,36%)] md:items-start md:gap-6">
                          <p className="text-right text-base leading-8 text-slate-700">
                            {section.paragraphs[0]}
                          </p>
                          {section.image && (
                            <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:mt-0">
                              <img decoding="async"
                                src={section.image.src}
                                alt={section.image.alt}
                                loading="lazy"
                                onClick={() =>
                                  openLightbox({
                                    src: section.image!.src,
                                    alt: section.image!.alt,
                                  })
                                }
                                title="اضغط للتكبير"
                                className="h-full w-full cursor-zoom-in object-cover"
                              />
                            </figure>
                          )}
                        </div>
                        <div className="mt-4 space-y-4">
                          {section.paragraphs.slice(1).map((paragraph) => (
                            <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                              {paragraph}
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
              إغلاق
            </button>
            <img loading="lazy" decoding="async"
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
