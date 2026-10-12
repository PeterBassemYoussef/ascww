import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

type Illustration = {
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
};

const imageDirectory = '/images/industrial-wastewater-role/';

const roleParagraphs = [
  {
    text: {
      ar: 'إن دور الإدارة العامة للصرف الصناعي بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد لا يقتصر على الإشراف على المنشآت بجميع أنواعها (صناعية – تجارية – سياحية – طبية)، ولكنه يشمل أيضًا الحفاظ على شبكات الصرف الصحي ومحطات المعالجة والرفع، للحد من الهدر وتحقيق الاستفادة القصوى من الشبكة.',
      en: 'The role of the General Department of Industrial Wastewater at Assiut and New Valley Water and Wastewater Company extends beyond supervising facilities of all kinds—industrial, commercial, tourism, and medical. It also includes protecting sewer networks, treatment plants, and lifting stations, reducing waste, and making the best use of the network.',
    },
    image: {
      src: `${imageDirectory}industrial-wastewater-overview.jpeg`,
      alt: {
        ar: 'مخطط يوضح الصرف الصناعي وتأثيره على البيئة وشبكات الصرف الصحي',
        en: 'Diagram showing industrial wastewater and its effects on the environment and sewer networks',
      },
    },
  },
  {
    text: {
      ar: 'كما تعمل الإدارة على مساعدة أصحاب المنشآت ومعاونتهم وتوعيتهم للوصول إلى بيئة نظيفة والحفاظ على المرافق وشبكة الصرف الصحي.',
      en: 'The department also supports facility owners, provides guidance, and raises awareness to help maintain a clean environment and protect public facilities and the sewer network.',
    },
    image: {
      src: `${imageDirectory}industrial-wastewater-treatment-process.jpeg`,
      alt: {
        ar: 'مخطط لمراحل معالجة مياه الصرف الصناعي ودور الإدارة العامة',
        en: 'Diagram of industrial wastewater treatment stages and the department’s role',
      },
    },
  },
];

const objectives: LocalizedText[] = [
  {
    ar: 'الإشراف على كافة إجراءات الرقابة والتحكم في المياه المنصرفة من المنشآت الصناعية (التجارية والسياحية والطبية وغيرها) التي تصرف مخلفاتها على شبكة الصرف الصحي.',
    en: 'Oversee monitoring and control of wastewater discharged to the sewer network by industrial, commercial, tourism, medical, and other facilities.',
  },
  {
    ar: 'حصر جميع المنشآت غير المنزلية، مثل المحال التجارية والعيادات والمعامل والمستشفيات وغيرها، التي تصرف مخلفاتها على شبكة الصرف الصحي.',
    en: 'Maintain an inventory of all non-domestic facilities—such as shops, clinics, laboratories, and hospitals—that discharge waste to the sewer network.',
  },
  {
    ar: 'تحديد نوعية الصرف الصناعي ومدى الخطورة المتوقعة وفقًا لمعايير وشروط المخلفات الصناعية التي يحددها القانون رقم 93 لسنة 1962، والمعدل بالقرار الوزاري رقم 44 لسنة 2000.',
    en: 'Determine the characteristics and potential risks of industrial wastewater in accordance with the standards set by Law No. 93 of 1962, as amended by Ministerial Decree No. 44 of 2000.',
  },
  {
    ar: 'تطبيق القواعد المالية الخاصة بمطالبات الأحمال الهيدروليكية وأعباء التنقية وتكاليف أخذ العينات وتحليلها طبقًا للقانون.',
    en: 'Apply the financial rules for hydraulic-load charges, treatment costs, and the costs of collecting and analyzing samples in accordance with the law.',
  },
  {
    ar: 'الموافقة على إصدار التراخيص وتوصيل الصرف للمنشآت غير المنزلية بعد استيفائها المعايير والشروط اللازمة للصرف على المجاري العمومية.',
    en: 'Approve permits and sewer connections for non-domestic facilities after they meet the standards and requirements for discharge to public sewers.',
  },
  {
    ar: 'الإشراف على أخذ العينات بصفة دورية أو مفاجئة وتحليلها بمعامل الشركة أو الاستعانة بمعامل خارجية معتمدة عند الحاجة.',
    en: 'Supervise scheduled or surprise sampling and analysis in the company’s laboratories, or use accredited external laboratories when required.',
  },
  {
    ar: 'اتخاذ الإجراءات التي يحددها القانون تجاه المنشآت المخالفة لمعايير الصرف على الشبكة العمومية.',
    en: 'Take the legally prescribed measures against facilities that violate public sewer discharge standards.',
  },
  {
    ar: 'الإشراف على تحديث قاعدة بيانات المنشآت غير المنزلية.',
    en: 'Oversee the updating of the non-domestic facilities database.',
  },
];

const legalReferences: LocalizedText[] = [
  {
    ar: 'القانون رقم 93 لسنة 1962، والمعدل بالقرار الوزاري رقم 44 لسنة 2000، بشأن الصرف على الشبكة العمومية.',
    en: 'Law No. 93 of 1962, as amended by Ministerial Decree No. 44 of 2000, concerning discharge to the public sewer network.',
  },
  {
    ar: 'القرار رقم 1012 لسنة 2018 بشأن مُهل توفيق الأوضاع والغرامات الموقعة في حالة المخالفة.',
    en: 'Decision No. 1012 of 2018 concerning deadlines for regularizing facility status and fines for violations.',
  },
];

const reuseParagraphs: Array<{ text: LocalizedText; image: Illustration }> = [
  {
    text: {
      ar: 'التخلص من مياه الصرف الصحي هو التصريف الآمن والمستدام بيئيًا وإعادة استخدام مياه الصرف المعالجة. وتتولى الشركة القابضة لمياه الشرب والصرف الصحي والشركات التابعة، ومنها شركة أسيوط والوادي الجديد لمياه الشرب والصرف الصحي، معظم عمليات التعامل مع مياه الصرف الصحي المعاد تدويرها والمواد الصلبة الناتجة عنها. وتسمى المياه التي يمكن إعادة استخدامها بالمياه المعاد تدويرها، أما الحمأة الناتجة عن المعالجة فتعد من المخلفات الصلبة.',
      en: 'Wastewater disposal includes the safe, environmentally sustainable discharge and reuse of treated wastewater. The Holding Company for Water and Wastewater and its subsidiaries, including Assiut and New Valley Water and Wastewater Company, handle most operations involving recycled wastewater and the resulting solids. Water that can be reused is called recycled water, while the sludge produced during treatment is considered solid waste.',
    },
    image: {
      src: `${imageDirectory}industrial-wastewater-reuse.jpeg`,
      alt: {
        ar: 'مخطط يوضح مراحل معالجة مياه الصرف الصناعي وإعادة استخدامها',
        en: 'Diagram showing industrial wastewater treatment and reuse stages',
      },
    },
  },
  {
    text: {
      ar: 'يتم استخدام المياه المعاد تدويرها لري المسطحات الخضراء والحدائق، وتعتبر جمهورية مصر العربية من أوائل الدول التي طبقت الإرشادات التوجيهية لمنظمة الصحة العالمية بشأن إعادة استخدام المياه.',
      en: 'Recycled water is used to irrigate green spaces and gardens. Egypt was among the early countries to apply World Health Organization guidelines on water reuse.',
    },
    image: {
      src: `${imageDirectory}wastewater-treatment-plant.jpeg`,
      alt: {
        ar: 'محطة لمعالجة مياه الصرف الصحي',
        en: 'Wastewater treatment plant',
      },
    },
  },
  {
    text: {
      ar: 'يلعب استخدام المياه المعاد تدويرها دورًا مهمًا في تلبية الطلب المتزايد على المياه غير الصالحة للشرب في مجالات ري الغابات الشجرية والتبريد والاستخدامات الصناعية.',
      en: 'Recycled water helps meet growing demand for non-potable water used in tree-forest irrigation, cooling, and industrial applications.',
    },
    image: {
      src: `${imageDirectory}wastewater-treatment-basins.jpeg`,
      alt: {
        ar: 'أحواض معالجة مياه الصرف الصحي',
        en: 'Wastewater treatment basins',
      },
    },
  },
  {
    text: {
      ar: 'تحتوي المخلفات الصلبة (الحمأة) على عناصر غذائية ومواد عضوية مهمة، ويمكن استخدامها كأسمدة أو محسنات للتربة أو كوقود لبعض المصانع. وتدرس الدول حاليًا خيارات إضافية للاستفادة من هذه المخلفات.',
      en: 'Solid waste (sludge) contains important nutrients and organic matter. It can be used as fertilizer, as a soil conditioner, or as fuel in some factories. Additional ways to benefit from this material are also being studied.',
    },
    image: {
      src: `${imageDirectory}circular-treatment-basin.jpeg`,
      alt: {
        ar: 'حوض دائري ضمن منشأة لمعالجة مياه الصرف الصحي',
        en: 'Circular basin at a wastewater treatment facility',
      },
    },
  },
];

const additionalIllustrations: Illustration[] = [
  {
    src: `${imageDirectory}nile-water-reverse-osmosis.jpeg`,
    alt: {
      ar: 'رسم توضيحي عن ملوثات نهر النيل والفلاتر الحديثة وتقنية التناضح العكسي',
      en: 'Illustration of Nile pollution, modern filters, and reverse osmosis',
    },
    caption: {
      ar: 'رسوم توضيحية تقارن بين ملوثات نهر النيل المختلفة وأهمية استخدام الفلاتر الحديثة وتقنية التناضح العكسي لتنقية المياه.',
      en: 'Illustrations comparing different pollutants in the Nile and showing the importance of modern filters and reverse osmosis for water purification.',
    },
  },
  {
    src: `${imageDirectory}industrial-wastewater-requirements.png`,
    alt: {
      ar: 'اشتراطات صرف مياه المنشآت الصناعية على شبكة الصرف الصحي',
      en: 'Requirements for discharging industrial facility wastewater to the sewer network',
    },
    caption: {
      ar: 'اشتراطات صرف مياه المنشآت الصناعية على شبكة الصرف الصحي.',
      en: 'Requirements for industrial facility wastewater discharge to the sewer network.',
    },
  },
  {
    src: `${imageDirectory}industrial-discharge.jpeg`,
    alt: {
      ar: 'مخلفات صناعية سائلة ملوثة تصب مباشرة نحو مجرى مائي',
      en: 'Polluted liquid industrial waste discharged directly into a waterway',
    },
    caption: {
      ar: 'مخلفات صناعية سائلة ملوثة تصب مباشرة نحو مجرى مائي.',
      en: 'Polluted liquid industrial waste discharged directly into a waterway.',
    },
  },
  {
    src: `${imageDirectory}agricultural-wastewater.jpeg`,
    alt: {
      ar: 'مياه صرف ومخلفات زراعية تتدفق في مجرى مائي',
      en: 'Agricultural wastewater and runoff flowing in a waterway',
    },
    caption: {
      ar: 'مخلفات زراعية سائلة وتدفق للمياه الناتجة عن الصرف.',
      en: 'Liquid agricultural waste and wastewater runoff.',
    },
  },
  {
    src: `${imageDirectory}wastewater-microorganisms.jpeg`,
    alt: {
      ar: 'صورة توضيحية لكائنات دقيقة في مياه الصرف',
      en: 'Illustration of microorganisms found in wastewater',
    },
    caption: {
      ar: 'توضيح أشكال البكتيريا الدقيقة والملوثات الموجودة بالمخلفات السائلة تحت المجهر.',
      en: 'Illustration of microorganisms and pollutants found in liquid waste under a microscope.',
    },
  },
];

function IndustrialWasteRolePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const [lightboxImage, setLightboxImage] = useState<Illustration | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxImage(null);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  const renderImage = (image: Illustration, className = '') => (
    <figure className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <button
        type="button"
        onClick={() => setLightboxImage(image)}
        className="block w-full cursor-zoom-in"
        title={t({ ar: 'اضغط للتكبير', en: 'Click to enlarge' })}
        aria-label={t({ ar: `تكبير الصورة: ${image.alt.ar}`, en: `Enlarge image: ${image.alt.en}` })}
      >
        <img
          src={image.src}
          alt={t(image.alt)}
          loading="lazy"
          decoding="async"
          className="h-full max-h-[28rem] w-full object-contain"
        />
      </button>
      {image.caption && (
        <figcaption className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">
          {t(image.caption)}
        </figcaption>
      )}
    </figure>
  );

  const sectionClass = 'rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6';
  const paragraphClass = `text-base leading-8 text-slate-700 ${isEnglish ? 'text-left' : 'text-right'}`;

  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]"
        dir={isEnglish ? 'ltr' : 'rtl'}
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <header className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                {t({ ar: 'دور إدارة الصرف الصناعي', en: 'Role of the Industrial Wastewater Department' })}
              </h1>
            </header>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className={sectionClass}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'دور الإدارة العامة للصرف الصناعي', en: 'Role of the General Department of Industrial Wastewater' })}
                </h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  {roleParagraphs.map(({ text, image }) => (
                    <div key={text.ar} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
                      <p className={paragraphClass}>{t(text)}</p>
                      {renderImage(image, 'mt-auto')}
                    </div>
                  ))}
                </div>
              </article>

              <article className={sectionClass}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'ثالثًا: رؤية وهدف الإدارة العامة للصرف الصناعي', en: '3. Vision and Objectives of the General Department of Industrial Wastewater' })}
                </h2>
                <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,36%)]">
                  <ol className="grid content-start gap-3 sm:grid-cols-2">
                    {objectives.map((objective, index) => (
                      <li key={objective.ar} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a3555] text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <p className={paragraphClass}>{t(objective)}</p>
                      </li>
                    ))}
                  </ol>
                  {renderImage({
                    src: `${imageDirectory}industrial-wastewater-treatment-process.jpeg`,
                    alt: {
                      ar: 'مراحل المعالجة الفيزيائية والبيولوجية والكيميائية لمياه الصرف الصناعي',
                      en: 'Physical, biological, and chemical stages of industrial wastewater treatment',
                    },
                  }, 'self-start')}
                </div>
              </article>

              <article className={sectionClass}>
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,36%)] md:items-center">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                      {t({ ar: 'معلومة تهمك: القوانين المنظمة', en: 'Important information: applicable regulations' })}
                    </h2>
                    <p className={`mt-2 ${paragraphClass}`}>
                      {t({ ar: 'القوانين التي تنظم عمل الإدارة العامة للصرف الصناعي:', en: 'The regulations governing the work of the General Department of Industrial Wastewater:' })}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {legalReferences.map((reference) => (
                        <li key={reference.ar} className={`rounded-xl border border-slate-200 bg-white p-4 ${paragraphClass}`}>
                          {t(reference)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {renderImage({
                    src: `${imageDirectory}industrial-pollutants.png`,
                    alt: {
                      ar: 'أنواع الملوثات في مياه الصرف الصناعي',
                      en: 'Types of pollutants in industrial wastewater',
                    },
                  })}
                </div>
              </article>

              <article className="grid gap-5 rounded-2xl border border-[#d7b05a]/50 bg-[#fffaf0] p-5 shadow-sm sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,32%)] md:items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                    {t({ ar: 'وأخيرًا: هدفنا الأسمى', en: 'Finally: our ultimate goal' })}
                  </h2>
                  <p className={`mt-3 ${paragraphClass}`}>
                    {t({
                      ar: 'هدفنا الأسمى هو تحقيق المصلحة العامة والحفاظ على الصحة العامة حتى نرقى بوطننا العزيز.',
                      en: 'Our ultimate goal is to serve the public interest and protect public health as we work toward a better future for our country.',
                    })}
                  </p>
                </div>
                {renderImage({
                  src: `${imageDirectory}wastewater-treatment-plant.jpeg`,
                  alt: {
                    ar: 'منشأة لمعالجة مياه الصرف الصحي وحماية الصحة العامة',
                    en: 'Wastewater treatment facility supporting public health',
                  },
                })}
              </article>

              <article className={sectionClass}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'رابعًا: أهمية التخلص الآمن من الصرف الصناعي ومعالجته', en: '4. The Importance of Safe Industrial Wastewater Disposal and Treatment' })}
                </h2>
                <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,36%)] md:items-start">
                  <p className={paragraphClass}>{t(reuseParagraphs[0].text)}</p>
                  {renderImage(reuseParagraphs[0].image)}
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {reuseParagraphs.slice(1).map(({ text, image }) => (
                    <div key={text.ar} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
                      <p className={paragraphClass}>{t(text)}</p>
                      {renderImage(image, 'mt-auto')}
                    </div>
                  ))}
                </div>
              </article>

              <section className={sectionClass} aria-labelledby="industrial-wastewater-gallery">
                <h2 id="industrial-wastewater-gallery" className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'رسوم وصور توضيحية', en: 'Illustrations and photographs' })}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {additionalIllustrations.map((image) => (
                    <div key={image.src}>{renderImage(image, 'h-full')}</div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 px-4 py-8"
          onClick={() => setLightboxImage(null)}
          role="presentation"
        >
          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t(lightboxImage.alt)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow"
              aria-label={t({ ar: 'إغلاق الصورة', en: 'Close image' })}
            >
              {t({ ar: 'إغلاق', en: 'Close' })}
            </button>
            <img
              src={lightboxImage.src}
              alt={t(lightboxImage.alt)}
              className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/20 bg-white object-contain shadow-2xl"
            />
            {lightboxImage.caption && (
              <p className="mt-2 rounded-lg bg-white px-4 py-2 text-center text-sm leading-6 text-slate-700">
                {t(lightboxImage.caption)}
              </p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default IndustrialWasteRolePage;
