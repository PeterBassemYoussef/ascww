import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

type SectionImage = {
  srcAr: string;
  srcEn?: string;
  alt: LocalizedText;
  caption?: LocalizedText;
};

type TreatmentSection = {
  title: LocalizedText;
  paragraphs: LocalizedText[];
  image?: SectionImage;
};

const articleParagraphs: LocalizedText[] = [
  {
    ar: 'عملية تنقية مياه الصرف من الشوائب والمواد العالقة والملوثات والمواد العضوية لتصبح صالحة لإعادة الاستخدام (غير الآدمي) أو لتكون صالحة للتخلص منها في المجاري المائية دون أن تسبب تلوثا لها. تشتمل عملية معالجة الصرف على عدة مراحل فيزيائية وكيماوية وبيولوجية.',
    en: 'Wastewater treatment is the process of removing impurities, suspended solids, pollutants, and organic matter so the water can be reused for non-human purposes or safely discharged into waterways without causing pollution. This process includes physical, chemical, and biological treatment stages.',
  },
];

const treatmentDetailsSections: TreatmentSection[] = [
  {
    title: { ar: 'مصادر مياه الصرف', en: 'Sources of wastewater' },
    paragraphs: [
      {
        ar: 'تتعدد مصادر الصرف الصحي، فهناك الصرف المنزلي، والصرف الصناعي، وصرف مياه الأمطار، وماء الرشح (الخاص بتخفيض منسوب المياه الجوفية) إلخ.',
        en: 'Wastewater has several sources, including domestic sewage, industrial effluent, stormwater, and seepage water used to lower groundwater levels, among others.',
      },
      {
        ar: 'غالبا ما يتكون الصرف أساساً من المواد العضوية السائلة من الحمامات، والمطابخ، والأحواض والتي يتخلص منها عن طريق أنابيب الصرف.',
        en: 'It often consists mainly of liquid organic matter from bathrooms, kitchens, and sinks that is discharged through drainage pipes.',
      },
    ],
    image: {
      srcAr: '/images/prosses-water/prosses1.webp',
      alt: {
        ar: 'مصادر مياه الصرف الصحي',
        en: 'Sources of wastewater',
      },
      caption: {
        ar: 'مصادر وتدفقات مياه الصرف قبل دخولها المعالجة',
        en: 'Wastewater sources and flows before entering treatment',
      },
    },
  },
  {
    title: { ar: 'التصفية', en: 'Screening' },
    paragraphs: [
      {
        ar: 'تتم في المصافي وهي شبكات حديدية لحجز المواد العالقة كبيرة الحجم من الورق أو قطع القماش أو الخشب أو قطع الزجاج الصفيح ويتخلص منها بالردم أو التجفيف أو الحرق.',
        en: 'This stage is carried out using screens, which are metal grids that retain large suspended materials such as paper, cloth, wood, glass, and sheet metal. These materials are then disposed of by landfilling, drying, or burning.',
      },
      {
        ar: 'تمر مياه الصرف على مصافي قبل أن تعالج لإزالة كل المواد الصلبة والعائمة والتي دخلت إلى مياه الصرف، مثل القطع الخشبية، الفوط، العلب المعدنية، الخ. تصفى المياه من هذه الشوائب عن طريق مصافي آلية أو يدوية. تستخدم مصافي مزودة بقضبان بينها مسافات صغيرة مما يمنع مرور أي مواد صلبة كبيرة قد تتلف أو تتسبب في عطل أجهزة معالجة المياه بعد ذلك.',
        en: 'Wastewater passes through screens before treatment to remove solids and floating materials such as wood pieces, cloths, and metal cans. These impurities are removed by manual or mechanical screens fitted with closely spaced bars that prevent large solids from damaging downstream treatment equipment.',
      },
    ],
    image: {
      srcAr: '/images/prosses-water/prosess4.webp',
      alt: {
        ar: 'مرحلة التصفية في معالجة مياه الصرف',
        en: 'Screening stage in wastewater treatment',
      },
      caption: {
        ar: 'المصافي ودورها في حجز المواد كبيرة الحجم',
        en: 'Screens and their role in trapping large materials',
      },
    },
  },
  {
    title: { ar: 'إزالة الرمال والصخور', en: 'Removal of sand and gravel' },
    paragraphs: [
      {
        ar: 'عملية إزالة الرمال والصخور من مراحل المعالجة الأولية وهي في الواقع عملية الترسيب حيث تمر مياه المخلفات في أحواض ترسيب أولية بسرعة بطيئة نسبياً 30 سم/دقيقة؛ وذلك لترسيب المواد العالقة مثل الأتربة والرمال والقطع المعدنية فيتجمع في قعر الحوض ما يعرف بالحمأة الأولية Primary sludge وقد تضاف مواد كيميائية للمساهمة في عملية الترسيب مثل الشبة أو أملاح الحديد، وهي مكلفة نوعاً ما. ويطفو الزبد على السطح الذي يكشط من آن لآخر، وهو عبارة عن مواد دهنية.',
        en: 'The removal of sand and gravel is part of primary treatment and is essentially a sedimentation process. Wastewater flows through primary settling tanks at a relatively slow speed of about 30 cm per minute so suspended materials such as dirt, sand, and metal particles can settle at the bottom as primary sludge. Chemicals such as alum or iron salts may be added to support settling, although this can be costly. Foam and grease float to the surface and are skimmed off periodically.',
      },
      {
        ar: 'كما أن المعالجة تضم مرحلة ما قبل المعالجة تنقية وتنظيف المياه من الصخور والرمال عن طريق التحكم في سرعة مياه الصرف حتى تصل لسرعة تسمح بترسب الصخور الصغيرة والرمال في القاع مع إبقاء أغلب المواد العضوية العالقة في مجرى المياه. من المهم إزالة الرمال والزلط والصخور الصغيرة مبكرا لتجنب الضرر بمعدات المحطة من مضخات وخلافه. في بعض الأحيان يكون هناك ما يسمى مغسلة الرمل والتي يتلوها ناقلة تنقل الرمل إلى مكان يمكن إعادة استخدامه فيه، ولكن غالبا ما يتخلص من الرمال والصخور بإلقائها في مدفن قمامة.',
        en: 'Pre-treatment also includes cleaning wastewater of rocks and sand by controlling flow velocity so that small stones and sand settle to the bottom while most suspended organic matter remains in the water stream. Removing sand, gravel, and small stones early is important to protect pumps and other plant equipment. Some facilities use sand washers and conveyors to move sand for potential reuse, but it is often disposed of in landfills.',
      },
    ],
    image: {
      srcAr: '/images/prosses-water/prosess3.webp',
      srcEn: '/images/prosses-water/prosess3EN.webp',
      alt: {
        ar: 'مراحل أولية في معالجة مياه الصرف الصحي',
        en: 'Primary stages of wastewater treatment',
      },
      caption: {
        ar: 'مرحلة التصفية وإزالة الرمال قبل المعالجة المتقدمة',
        en: 'Screening and sand removal before advanced treatment',
      },
    },
  },
  {
    title: { ar: 'الترسيب', en: 'Sedimentation' },
    paragraphs: [
      {
        ar: 'خزان ترسيب أولي فارغ. في مرحلة الترسيب الأولى، يضخ الصرف إلى خزانات ضخمة تسمى خزانات الترسيب الأولية. تكون هذه الخزانات كبيرة بما يكفي بحيث تترسب الأوحال والمواد القذرة في القاع وتصعد المواد العائمة والشحوم والزيوت إلى السطح ليتم كشطها.',
        en: 'In the first sedimentation stage, sewage is pumped into large tanks called primary settling tanks. These tanks are large enough to allow sludge and dirt to settle at the bottom while floating matter, grease, and oils rise to the surface for skimming.',
      },
      {
        ar: 'الهدف من عملية الترسيب الأولية هو إنتاج سائل متجانس بشكل عام يمكن معالجته بعد ذلك بيولوجيا وكذلك أيضا استخلاص القاذورات بحيث يمكن التخلص منها بعد ذلك أو إعادة استخدامها. غالباً ما تضم خزانات الترسيب الأولية مكشطة ميكانيكية تقوم بطرد المواد القذرة بشكل مستمر إلى فتحة أسفل الخزان حيث تضخ لتعالج في مراحل أخرى.',
        en: 'The goal of primary sedimentation is to produce a generally uniform liquid that can later be treated biologically, while also extracting solids for disposal or reuse. Primary settling tanks often include a mechanical scraper that continuously pushes solids toward an opening at the bottom of the tank so they can be pumped to later treatment stages.',
      },
      {
        ar: 'كما أنه في مناطق كثيرة تضم مياه الصرف أيضا المخلفات السائلة من المصانع والمستشفيات والمطاعم وتؤثر هذه المخلفات تأثيراً سلبياً على أعمال المعالجة.',
        en: 'In many areas, wastewater also contains liquid waste from factories, hospitals, and restaurants, and these discharges can negatively affect treatment operations.',
      },
    ],
  },
];

const disposalRisks: LocalizedText[] = [
  {
    ar: 'تنتشر الميكروبات المسببة للأمراض التي تنتقل للإنسان عن طريق الاستحمام أو الشرب.',
    en: 'Disease-causing microbes spread and can reach humans through bathing or drinking.',
  },
  {
    ar: 'تقوم الميكروبات بتحليل المواد العضوية مستنفدة الأوكسجين الذائب في المياه لزيادة الطلب على الأوكسجين الحيوي ويؤدي ذلك إلى موت الأحياء المائية كالسمك والقشريات (ظاهرة الإغناء البيولوجي).',
    en: 'Microorganisms break down organic matter and consume dissolved oxygen, increasing biological oxygen demand and leading to the death of aquatic life such as fish and crustaceans.',
  },
  {
    ar: 'تنشيط الميكروبات اللاهوائية نتيجة استنفاد الأكسجين الذائب وتقوم بتخمير المواد العضوية مسببة روائح كريهة وعفونة للمياه.',
    en: 'Anaerobic microbes become active when dissolved oxygen is depleted, fermenting organic matter and causing foul odors and water putrefaction.',
  },
];

const sectionFigureClass =
  'mx-auto mt-4 w-full max-w-[28rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:mt-0 md:w-[40%] md:max-w-none';

const sectionImageClass = 'h-72 w-full object-cover sm:h-80 md:h-[24rem]';

function SewageTreatmentPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const localizedImageSrc = (image: SectionImage) => (isEnglish ? image.srcEn ?? image.srcAr : image.srcAr);
  const paragraphAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const contentOrderClass = 'md:order-1';
  const figureOrderClass = 'md:order-2';
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
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{t({ ar: 'معالجه الصرف الصحي', en: 'Wastewater Treatment' })}</h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555]">
                  {t({ ar: 'نبذه عن معالجه مياه الصرف الصحي', en: 'Overview of wastewater treatment' })}
                </h2>
                <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,40%)] md:items-stretch md:gap-6">
                  <div className={`space-y-5 ${contentOrderClass}`}>
                    <div className="space-y-3">
                      {articleParagraphs.map((paragraph) => (
                        <p key={paragraph.ar} className={`${paragraphAlignmentClass} leading-8 text-slate-700`}>
                          {t(paragraph)}
                        </p>
                      ))}
                    </div>

                    {sourcesSection && (
                      <section className="border-t border-slate-200 pt-5">
                        <h3 className="text-lg font-extrabold text-[#0a3555]">{t(sourcesSection.title)}</h3>
                        <div className="mt-3 space-y-3">
                          {sourcesSection.paragraphs.map((paragraph) => (
                            <p key={paragraph.ar} className={`${paragraphAlignmentClass} leading-8 text-slate-700`}>
                              {t(paragraph)}
                            </p>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {sourcesSection?.image && (
                    <figure className={`mt-4 self-start overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:mt-0 ${figureOrderClass}`}>
                      <img
                        decoding="async"
                        src={localizedImageSrc(sourcesSection.image)}
                        alt={t(sourcesSection.image.alt)}
                        loading="lazy"
                        onClick={() =>
                          openLightbox({
                            src: localizedImageSrc(sourcesSection.image!),
                            alt: t(sourcesSection.image!.alt),
                            caption: sourcesSection.image!.caption ? t(sourcesSection.image!.caption!) : undefined,
                          })
                        }
                        title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                        className="h-72 w-full cursor-zoom-in object-cover sm:h-80 md:h-auto"
                      />
                      {sourcesSection.image.caption && (
                        <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                          {t(sourcesSection.image.caption)}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>

                <div className="mt-6 space-y-5">
                  {otherTreatmentSections.map((section) => {
                    const isFilteringSection = section.title.ar === 'التصفية';
                    const isProcessThreeImage = section.image?.srcAr.includes('prosess3.webp');

                    return (
                      <section key={section.title.ar} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                        <h3 className="text-lg font-extrabold text-[#0a3555]">{t(section.title)}</h3>
                        {isFilteringSection ? (
                          <div className="mt-3 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,40%)] md:items-stretch md:gap-6">
                            <div className={`space-y-3 md:space-y-8 ${contentOrderClass}`}>
                              {section.paragraphs.map((paragraph) => (
                                <p
                                  key={paragraph.ar}
                                  className={`${paragraphAlignmentClass} leading-8 text-slate-700 md:leading-[3rem]`}
                                >
                                  {t(paragraph)}
                                </p>
                              ))}
                            </div>
                            {section.image && (
                              <figure className={`mt-4 self-start overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm md:mt-0 ${figureOrderClass}`}>
                                <img
                                  decoding="async"
                                  src={localizedImageSrc(section.image)}
                                  alt={t(section.image.alt)}
                                  loading="lazy"
                                  onClick={() =>
                                    openLightbox({
                                      src: localizedImageSrc(section.image!),
                                      alt: t(section.image!.alt),
                                      caption: section.image!.caption ? t(section.image!.caption!) : undefined,
                                    })
                                  }
                                  title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                                  className={`${sectionImageClass} cursor-zoom-in`}
                                />
                                {section.image.caption && (
                                  <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                                    {t(section.image.caption)}
                                  </figcaption>
                                )}
                              </figure>
                            )}
                          </div>
                        ) : (
                          <div className="mt-3 md:flex md:items-start md:gap-6">
                            <div className={`space-y-3 md:flex-1 ${contentOrderClass}`}>
                              {section.paragraphs.map((paragraph) => (
                                <p key={paragraph.ar} className={`${paragraphAlignmentClass} leading-8 text-slate-700`}>
                                  {t(paragraph)}
                                </p>
                              ))}
                            </div>
                            {section.image && (
                              <figure className={`${sectionFigureClass} ${figureOrderClass}`}>
                                <img
                                  decoding="async"
                                  src={localizedImageSrc(section.image)}
                                  alt={t(section.image.alt)}
                                  loading="lazy"
                                  onClick={() =>
                                    openLightbox({
                                      src: localizedImageSrc(section.image!),
                                      alt: t(section.image!.alt),
                                      caption: section.image!.caption ? t(section.image!.caption!) : undefined,
                                    })
                                  }
                                  title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                                  className={`${isProcessThreeImage ? 'h-72 w-full bg-white object-contain sm:h-80 md:h-[24rem]' : sectionImageClass} cursor-zoom-in`}
                                />
                                {section.image.caption && (
                                  <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                                    {t(section.image.caption)}
                                  </figcaption>
                                )}
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
                  {t({ ar: 'إذا جرى التخلص من مياه المجاري بدون معالجة', en: 'If sewage is disposed of without treatment' })}
                </h2>
                <div className="mt-3 md:flex md:items-start md:gap-6">
                  <div className={`md:flex-1 ${contentOrderClass}`}>
                    <p className={`${paragraphAlignmentClass} leading-8 text-slate-700`}>
                      {t({
                        ar: 'إذا جرى التخلص من مياه المجاري مثلاً بدون معالجة بإلقائها في البحر أو النهر، إلخ فسيحدث الآتي:',
                        en: 'If sewage is disposed of without treatment, for example by discharging it into the sea or a river, the following impacts may occur:',
                      })}
                    </p>
                    <ul className="mt-4 space-y-3 text-slate-700">
                      {disposalRisks.map((risk) => (
                        <li key={risk.ar} className={`rounded-lg bg-slate-50 px-4 py-3 leading-7 ${paragraphAlignmentClass}`}>
                          {t(risk)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <figure className={`${sectionFigureClass} ${figureOrderClass}`}>
                    <img
                      decoding="async"
                      src="/images/prosses-water/prosses2.webp"
                      alt={t({
                        ar: 'مشهد توضيحي لمعالجة مياه الصرف الصحي',
                        en: 'Illustration of wastewater treatment',
                      })}
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/prosses2.webp',
                          alt: t({
                            ar: 'مشهد توضيحي لمعالجة مياه الصرف الصحي',
                            en: 'Illustration of wastewater treatment',
                          }),
                          caption: t({
                            ar: 'مراحل إضافية من معالجة مياه الصرف الصحي',
                            en: 'Additional stages of wastewater treatment',
                          }),
                        })
                      }
                      title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
                      className={`${sectionImageClass} cursor-zoom-in`}
                    />
                    <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[#0a3555]">
                      {t({
                        ar: 'مراحل إضافية من معالجة مياه الصرف الصحي',
                        en: 'Additional stages of wastewater treatment',
                      })}
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
            aria-label={t({ ar: 'إغلاق الصورة المكبرة', en: 'Close enlarged image' })}
          >
            ×
          </button>

          <figure
            className="w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              loading="lazy"
              decoding="async"
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
