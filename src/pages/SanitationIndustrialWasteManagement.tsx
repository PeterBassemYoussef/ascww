import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const roleParagraphs = [
  {
    text: {
      ar: 'إن دور الإدارة العامة للصرف الصناعي بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد لا يقتصر على الإشراف على المنشآت بجميع أنواعها (صناعية – تجارية – سياحية – طبية)، ولكنه يشمل أيضًا الحفاظ على شبكات الصرف الصحي ومحطات المعالجة والرفع، للحد من الهدر وتحقيق الاستفادة القصوى من الشبكة.',
      en: 'The role of the General Department of Industrial Wastewater at Assiut and New Valley Water and Wastewater Company extends beyond supervising facilities of all kinds—industrial, commercial, tourism, and medical. It also includes protecting sewer networks, treatment plants, and lifting stations, reducing waste, and making the best use of the network.',
    },
  },
  {
    text: {
      ar: 'كما تعمل الإدارة على مساعدة أصحاب المنشآت ومعاونتهم وتوعيتهم للوصول إلى بيئة نظيفة والحفاظ على المرافق وشبكة الصرف الصحي.',
      en: 'The department also supports facility owners, provides guidance, and raises awareness to help maintain a clean environment and protect public facilities and the sewer network.',
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

const reuseParagraphs: LocalizedText[] = [
  {
    ar: 'التخلص من مياه الصرف الصحي هو التصريف الآمن والمستدام بيئيًا وإعادة استخدام مياه الصرف المعالجة. وتتولى الشركة القابضة لمياه الشرب والصرف الصحي والشركات التابعة، ومنها شركة أسيوط والوادي الجديد لمياه الشرب والصرف الصحي، معظم عمليات التعامل مع مياه الصرف الصحي المعاد تدويرها والمواد الصلبة الناتجة عنها. وتسمى المياه التي يمكن إعادة استخدامها بالمياه المعاد تدويرها، أما الحمأة الناتجة عن المعالجة فتعد من المخلفات الصلبة.',
    en: 'Wastewater disposal includes the safe, environmentally sustainable discharge and reuse of treated wastewater. The Holding Company for Water and Wastewater and its subsidiaries, including Assiut and New Valley Water and Wastewater Company, handle most operations involving recycled wastewater and the resulting solids. Water that can be reused is called recycled water, while the sludge produced during treatment is considered solid waste.',
  },
  {
    ar: 'يتم استخدام المياه المعاد تدويرها لري المسطحات الخضراء والحدائق، وتعتبر جمهورية مصر العربية من أوائل الدول التي طبقت الإرشادات التوجيهية لمنظمة الصحة العالمية بشأن إعادة استخدام المياه.',
    en: 'Recycled water is used to irrigate green spaces and gardens. Egypt was among the early countries to apply World Health Organization guidelines on water reuse.',
  },
  {
    ar: 'يلعب استخدام المياه المعاد تدويرها دورًا مهمًا في تلبية الطلب المتزايد على المياه غير الصالحة للشرب في مجالات ري الغابات الشجرية والتبريد والاستخدامات الصناعية.',
    en: 'Recycled water helps meet growing demand for non-potable water used in tree-forest irrigation, cooling, and industrial applications.',
  },
  {
    ar: 'تحتوي المخلفات الصلبة (الحمأة) على عناصر غذائية ومواد عضوية مهمة، ويمكن استخدامها كأسمدة أو محسنات للتربة أو كوقود لبعض المصانع. وتدرس الدول حاليًا خيارات إضافية للاستفادة من هذه المخلفات.',
    en: 'Solid waste (sludge) contains important nutrients and organic matter. It can be used as fertilizer, as a soil conditioner, or as fuel in some factories. Additional ways to benefit from this material are also being studied.',
  },
];

function IndustrialWasteRolePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const localizedImageSrc = (arabicSrc: string, englishSrc: string) => (isEnglish ? englishSrc : arabicSrc);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const sectionClass = 'rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6';
  const paragraphClass = `text-base leading-8 text-slate-700 ${isEnglish ? 'text-left' : 'text-right'}`;

  useEffect(() => {
    if (!isImageExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsImageExpanded(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isImageExpanded]);

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
              <h1 className={isEnglish ? 'text-left text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl' : 'text-right text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl'}>
                {t({ ar: 'دور إدارة الصرف الصناعي', en: 'Role of the Industrial Wastewater Department' })}
              </h1>
            </header>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className={sectionClass}>
                <h2 className={isEnglish ? 'text-left text-xl font-extrabold text-[#0a3555] sm:text-2xl' : 'text-right text-xl font-extrabold text-[#0a3555] sm:text-2xl'}>
                  {t({ ar: 'دور الإدارة العامة للصرف الصناعي', en: 'Role of the General Department of Industrial Wastewater' })}
                </h2>
                <div className="mt-4 space-y-5">
                  <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                    <img
                      src={localizedImageSrc('/images/industrial-waste-management/1.webp', '/images/industrial-waste-management/1E.webp')}
                      alt={t({ ar: 'مخطط يوضح دور الإدارة العامة للصرف الصناعي', en: 'Diagram showing the role of the General Department of Industrial Wastewater' })}
                      className="aspect-[3/1] w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className={isEnglish ? 'text-left' : 'text-right'}>
                      {t(roleParagraphs[0].text)} {t(roleParagraphs[1].text)}
                    </p>
                  </div>
                </div>
              </article>

              <article className={sectionClass}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'رؤية وهدف الإدارة العامة للصرف الصناعي', en: 'Vision and Objectives of the General Department of Industrial Wastewater' })}
                </h2>
                <div className="mt-4">
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
                </div>
              </article>

              <article className={sectionClass}>
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
              </article>

              <article className="grid gap-5 rounded-2xl border border-[#d7b05a]/50 bg-[#fffaf0] p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'وأخيرًا: هدفنا الأسمى', en: 'Finally: our ultimate goal' })}
                </h2>
                <p className={`mt-3 ${paragraphClass}`}>
                  {t({
                    ar: 'هدفنا الأسمى هو تحقيق المصلحة العامة والحفاظ على الصحة العامة حتى نرقى بوطننا العزيز.',
                    en: 'Our ultimate goal is to serve the public interest and protect public health as we work toward a better future for our country.',
                  })}
                </p>
              </article>

              <article className={sectionClass}>
                <h2 className={`text-base font-extrabold text-[#0a3555] sm:text-lg ${isEnglish ? 'text-left' : 'text-right'}`}>
                  {t({
                    ar: 'رسوم توضيحية تقارن بين ملوثات نهر النيل المختلفة وأهمية استخدام الفلاتر الحديثة وتقنية التناضح العكسي لتنقية المياه.',
                    en: 'Illustrations comparing different Nile River pollutants and highlighting the importance of modern filters and reverse osmosis technology for water purification.',
                  })}
                </h2>
                <div className="mx-auto mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsImageExpanded(true)}
                    className="block w-full cursor-zoom-in"
                    aria-label={t({ ar: 'تكبير الصورة', en: 'Enlarge image' })}
                    title={t({ ar: 'اضغط لتكبير الصورة', en: 'Click to enlarge image' })}
                  >
                    <img
                      src="/images/industrial-waste-management/2.webp"
                      alt={t({
                        ar: 'رسوم توضيحية عن ملوثات نهر النيل والفلاتر الحديثة وتقنية التناضح العكسي',
                        en: 'Illustration of Nile River pollutants, modern filters, and reverse osmosis technology',
                      })}
                      className="mx-auto h-auto max-h-[360px] w-auto max-w-full rounded-xl object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </div>
              </article>

              <article className={sectionClass}>
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  {t({ ar: 'أهمية التخلص الآمن من الصرف الصناعي ومعالجته', en: 'The Importance of Safe Industrial Wastewater Disposal and Treatment' })}
                </h2>
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <p className={`${paragraphClass} text-right`}>
                    {reuseParagraphs.map((paragraph) => t(paragraph)).join(' ')}
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      {isImageExpanded && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 px-4 py-8"
          onClick={() => setIsImageExpanded(false)}
          role="presentation"
        >
          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t({
              ar: 'رسوم توضيحية عن ملوثات نهر النيل والفلاتر الحديثة وتقنية التناضح العكسي',
              en: 'Illustration of Nile River pollutants, modern filters, and reverse osmosis technology',
            })}
          >
            <button
              type="button"
              onClick={() => setIsImageExpanded(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow"
              aria-label={t({ ar: 'إغلاق الصورة', en: 'Close image' })}
            >
              {t({ ar: 'إغلاق', en: 'Close' })}
            </button>
            <img
              src="/images/industrial-waste-management/2.webp"
              alt={t({
                ar: 'رسوم توضيحية عن ملوثات نهر النيل والفلاتر الحديثة وتقنية التناضح العكسي',
                en: 'Illustration of Nile River pollutants, modern filters, and reverse osmosis technology',
              })}
              className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/20 bg-white object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default IndustrialWasteRolePage;
