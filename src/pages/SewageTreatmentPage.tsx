import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const articleParagraphs = [
  'عملية تنقية مياه الصرف من الشوائب والمواد العالقة والملوثات والمواد العضوية لتصبح صالحة لإعادة الاستخدام (غير الآدمي) أو لتكون صالحة للتخلص منها في المجاري المائية دون أن تسبب تلوثا لها. تشتمل عملية معالجة الصرف على عدة مراحل فيزيائية وكيماوية وبيولوجية.',
];

const treatmentDetailsSections = [
  {
    title: 'مصادر مياه الصرف',
    paragraphs: [
      'تتعدد مصادر الصرف الصحي، فهناك الصرف المنزلي، والصرف الصناعي، وصرف مياه الأمطار، وماء الرشح (الخاص بتخفيض منسوب المياه الجوفية) إلخ.',
      'غالبا ما يتكون الصرف أساساً من المواد العضوية السائلة من الحمامات، والمطابخ، والأحواض والتي يتخلص منها عن طريق أنابيب الصرف.',
    ],
    image: {
      src: '/images/prosses-water/prosses1.webp',
      alt: 'مصادر مياه الصرف الصحي',
      caption: 'مصادر وتدفقات مياه الصرف قبل دخولها المعالجة',
    },
  },
  {
    title: 'التصفية',
    paragraphs: [
      'تتم في المصافي وهي شبكات حديدية لحجز المواد العالقة كبيرة الحجم من الورق أو قطع القماش أو الخشب أو قطع الزجاج الصفيح ويتخلص منها بالردم أو التجفيف أو الحرق.',
      'تمر مياه الصرف على مصافي قبل أن تعالج لإزالة كل المواد الصلبة والعائمة والتي دخلت إلى مياه الصرف، مثل القطع الخشبية، الفوط، العلب المعدنية، الخ. تصفى المياه من هذه الشوائب عن طريق مصافي آلية أو يدوية. تستخدم مصافي مزودة بقضبان بينها مسافات صغيرة مما يمنع مرور أي مواد صلبة كبيرة قد تتلف أو تتسبب في عطل أجهزة معالجة المياه بعد ذلك.',
    ],
    image: {
      src: '/images/prosses-water/prosess4.webp',
      alt: 'مرحلة التصفية في معالجة مياه الصرف',
      caption: 'المصافي ودورها في حجز المواد كبيرة الحجم',
    },
  },
  {
    title: 'إزالة الرمال والصخور',
    paragraphs: [
      'عملية إزالة الرمال والصخور من مراحل المعالجة الأولية وهي في الواقع عملية الترسيب حيث تمر مياه المخلفات في أحواض ترسيب أولية بسرعة بطيئة نسبياً 30 سم/دقيقة؛ وذلك لترسيب المواد العالقة مثل الأتربة والرمال والقطع المعدنية فيتجمع في قعر الحوض ما يعرف بالحمأة الأولية Primary sludge وقد تضاف مواد كيميائية للمساهمة في عملية الترسيب مثل الشبة أو أملاح الحديد، وهي مكلفة نوعاً ما. ويطفو الزبد على السطح الذي يكشط من آن لآخر، وهو عبارة عن مواد دهنية.',
      'كما أن المعالجة تضم مرحلة ما قبل المعالجة تنقية وتنظيف المياه من الصخور والرمال عن طريق التحكم في سرعة مياه الصرف حتى تصل لسرعة تسمح بترسب الصخور الصغيرة والرمال في القاع مع إبقاء أغلب المواد العضوية العالقة في مجرى المياه. من المهم إزالة الرمال والزلط والصخور الصغيرة مبكرا لتجنب الضرر بمعدات المحطة من مضخات وخلافه. في بعض الأحيان يكون هناك ما يسمى مغسلة الرمل والتي يتلوها ناقلة تنقل الرمل إلى مكان يمكن إعادة استخدامه فيه، ولكن غالبا ما يتخلص من الرمال والصخور بإلقائها في مدفن قمامة.',
    ],
    image: {
      src: '/images/prosses-water/prosess3.webp',
      alt: 'مراحل أولية في معالجة مياه الصرف الصحي',
      caption: 'مرحلة التصفية وإزالة الرمال قبل المعالجة المتقدمة',
    },
  },
  {
    title: 'الترسيب',
    paragraphs: [
      'خزان ترسيب أولي فارغ. في مرحلة الترسيب الأولى، يضخ الصرف إلى خزانات ضخمة تسمى خزانات الترسيب الأولية. تكون هذه الخزانات كبيرة بما يكفي بحيث تترسب الأوحال والمواد القذرة في القاع وتصعد المواد العائمة والشحوم والزيوت إلى السطح ليتم كشطها.',
      'الهدف من عملية الترسيب الأولية هو إنتاج سائل متجانس بشكل عام يمكن معالجته بعد ذلك بيولوجيا وكذلك أيضا استخلاص القاذورات بحيث يمكن التخلص منها بعد ذلك أو إعادة استخدامها. غالباً ما تضم خزانات الترسيب الأولية مكشطة ميكانيكية تقوم بطرد المواد القذرة بشكل مستمر إلى فتحة أسفل الخزان حيث تضخ لتعالج في مراحل أخرى.',
      'كما أنه في مناطق كثيرة تضم مياه الصرف أيضا المخلفات السائلة من المصانع والمستشفيات والمطاعم وتؤثر هذه المخلفات تأثيراً سلبياً على أعمال المعالجة.',
    ],
  },
];

const disposalRisks = [
  'تنتشر الميكروبات المسببة للأمراض التي تنتقل للإنسان عن طريق الاستحمام أو الشرب.',
  'تقوم الميكروبات بتحليل المواد العضوية مستنفدة الأوكسجين الذائب في المياه لزيادة الطلب على الأوكسجين الحيوي ويؤدي ذلك إلى موت الأحياء المائية كالسمك والقشريات (ظاهرة الإغناء البيولوجي).',
  'تنشيط الميكروبات اللاهوائية نتيجة استنفاد الأكسجين الذائب وتقوم بتخمير المواد العضوية مسببة روائح كريهة وعفونة للمياه.',
];

const sectionFigureClass =
  'mx-auto mt-4 w-full max-w-[28rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:mt-0 md:w-[40%] md:max-w-none';

const sectionImageClass = 'h-72 w-full object-cover sm:h-80 md:h-[24rem]';

function SewageTreatmentPage() {
  const [sourcesSection, ...otherTreatmentSections] = treatmentDetailsSections;
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  const openLightbox = (image: { src: string; alt: string; caption?: string }) => {
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
              <h1 className="text-2xl font-extrabold sm:text-3xl">معالجه الصرف الصحي</h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555]">نبذه عن معالجه مياه الصرف الصحي</h2>
                <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,40%)] md:items-stretch md:gap-6">
                  <div className="space-y-5 md:order-1">
                    <div className="space-y-3">
                      {articleParagraphs.map((paragraph) => (
                        <p key={paragraph} className="text-right leading-8 text-slate-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {sourcesSection && (
                      <section className="border-t border-slate-200 pt-5">
                        <h3 className="text-lg font-extrabold text-[#0a3555]">{sourcesSection.title}</h3>
                        <div className="mt-3 space-y-3">
                          {sourcesSection.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="text-right leading-8 text-slate-700">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {sourcesSection?.image && (
                    <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:order-2 md:mt-0 md:flex md:h-full md:flex-col">
                      <img decoding="async"
                        src={sourcesSection.image.src}
                        alt={sourcesSection.image.alt}
                        loading="lazy"
                        onClick={() =>
                          openLightbox({
                            src: sourcesSection.image.src,
                            alt: sourcesSection.image.alt,
                            caption: sourcesSection.image.caption,
                          })
                        }
                        title="اضغط للتكبير"
                        className="h-72 w-full cursor-zoom-in object-cover sm:h-80 md:h-full md:flex-1"
                      />
                      <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                        {sourcesSection.image.caption}
                      </figcaption>
                    </figure>
                  )}
                </div>

                <div className="mt-6 space-y-5">
                  {otherTreatmentSections.map((section) => {
                    const isFilteringSection = section.title === 'التصفية';
                    const isProcessThreeImage = section.image?.src.includes('prosess3.webp');

                    return (
                      <section key={section.title} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                        <h3 className="text-lg font-extrabold text-[#0a3555]">{section.title}</h3>
                        {isFilteringSection ? (
                          <div className="mt-3 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,40%)] md:items-stretch md:gap-6">
                            <div className="space-y-3 md:order-1 md:space-y-8">
                              {section.paragraphs.map((paragraph) => (
                                <p
                                  key={paragraph}
                                  className="text-right leading-8 text-slate-700 md:leading-[3rem]"
                                >
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                            {section.image && (
                              <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:order-2 md:mt-0 md:flex md:h-full md:flex-col">
                                <img decoding="async"
                                  src={section.image.src}
                                  alt={section.image.alt}
                                  loading="lazy"
                                  onClick={() =>
                                    openLightbox({
                                      src: section.image!.src,
                                      alt: section.image!.alt,
                                      caption: section.image!.caption,
                                    })
                                  }
                                  title="اضغط للتكبير"
                                  className={`${sectionImageClass} cursor-zoom-in`}
                                />
                                <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                                  {section.image.caption}
                                </figcaption>
                              </figure>
                            )}
                          </div>
                        ) : (
                          <div className="mt-3 md:flex md:items-start md:gap-6">
                            <div className="space-y-3 md:order-1 md:flex-1">
                              {section.paragraphs.map((paragraph) => (
                                <p key={paragraph} className="text-right leading-8 text-slate-700">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                            {section.image && (
                              <figure className={`${sectionFigureClass} md:order-2`}>
                            <img decoding="async"
                              src={section.image.src}
                              alt={section.image.alt}
                              loading="lazy"
                              onClick={() =>
                                openLightbox({
                                  src: section.image!.src,
                                  alt: section.image!.alt,
                                  caption: section.image!.caption,
                                })
                              }
                              title="اضغط للتكبير"
                              className={`${isProcessThreeImage ? 'h-72 w-full bg-white object-contain sm:h-80 md:h-[24rem]' : sectionImageClass} cursor-zoom-in`}
                            />
                            <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                              {section.image.caption}
                            </figcaption>
                          </figure>
                            )}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555]">
                  إذا جرى التخلص من مياه المجاري بدون معالجة
                </h2>
                <div className="mt-3 md:flex md:items-start md:gap-6">
                  <div className="md:order-1 md:flex-1">
                    <p className="text-right leading-8 text-slate-700">
                      إذا جرى التخلص من مياه المجاري مثلاً بدون معالجة بإلقائها في البحر أو النهر، إلخ فسيحدث الآتي:
                    </p>
                    <ul className="mt-4 space-y-3 text-slate-700">
                      {disposalRisks.map((risk) => (
                        <li key={risk} className="rounded-lg bg-slate-50 px-4 py-3 text-right leading-7">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <figure className={`${sectionFigureClass} md:order-2`}>
                    <img decoding="async"
                      src="/images/prosses-water/prosses2.webp"
                      alt="مشهد توضيحي لمعالجة مياه الصرف الصحي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/prosses2.webp',
                          alt: 'مشهد توضيحي لمعالجة مياه الصرف الصحي',
                          caption: 'مراحل إضافية من معالجة مياه الصرف الصحي',
                        })
                      }
                      title="اضغط للتكبير"
                      className={`${sectionImageClass} cursor-zoom-in`}
                    />
                    <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                      مراحل إضافية من معالجة مياه الصرف الصحي
                    </figcaption>
                  </figure>
                </div>
              </article>

            </div>
          </section>
        </div>
      </main>
      <Footer />

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xl font-bold text-white transition hover:bg-white/20"
            aria-label="إغلاق الصورة المكبرة"
          >
            ×
          </button>

          <figure
            className="w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img loading="lazy" decoding="async"
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[82vh] w-full rounded-xl object-contain"
            />
            {lightboxImage.caption && (
              <figcaption className="mt-2 text-center text-sm font-semibold text-slate-100">
                {lightboxImage.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}

export default SewageTreatmentPage;
