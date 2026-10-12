import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const ACHIEVEMENT_IMAGES = [
  {
    src: '/images/laboratories-achievements/lab-qusiya.webp',
    ar: 'معمل محطة القوصية',
    en: 'Al-Qusiya Plant Laboratory',
  },
  {
    src: '/images/laboratories-achievements/lab-walidiya.webp',
    ar: 'معمل محطة الوليدية',
    en: 'Al-Walidiya Plant Laboratory',
  },
  {
    src: '/images/laboratories-achievements/lab-arab-madabegh.webp',
    ar: 'معمل محطة عرب المدابغ',
    en: 'Arab Al-Madabegh Plant Laboratory',
  },
  {
    src: '/images/laboratories-achievements/lab-nazlat-abdullah.webp',
    ar: 'معمل محطة نزلة عبداللاه المرشحة',
    en: 'Nuzlat Abd Allah Filtered Plant Laboratory',
  },
];

function AchievementSection({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(10,53,85,0.07)]"
    >
      <header className="border-b border-[#d7b05a]/45 bg-[#f7f9fb] px-5 py-4 sm:px-7">
        <h2 className="text-xl font-extrabold leading-8 text-[#0a3555] sm:text-2xl">{title}</h2>
      </header>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

function LaboratoriesSectorAchievementsPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

  const safetyAchievements = [
    t('تم اعتماد ١٥ خطة لمأمونية مياه الشرب.', '15 drinking water safety plans were approved.'),
    t('تمت مراجعة ٣ خطط لمأمونية المياه من قبل الشركة القابضة.', '3 water safety plans were reviewed by the Holding Company.'),
    t('توجد خطة مياه قيد المراجعة من قبل الجهاز التنظيمي لمياه الشرب وحماية المستهلك.', 'One water safety plan is under review by the Water and Wastewater Regulatory Agency.'),
    t('تم اعتماد خطتين لمأمونية تداول الصرف الصحي، وتوجد خطة قيد المراجعة لدى اللجنة العليا للمياه.', 'Two wastewater handling safety plans were approved, and one plan is under review by the Supreme Water Committee.'),
    t('تم تنفيذ ٦٠ ورشة عمل واجتماع دوري.', '60 workshops and regular meetings were held.'),
  ];

  const sustainableGoals = [
    t(
      'الحفاظ على جاهزية معامل الشركة بما يستوفي متطلبات اعتماد الإدارة الفنية المستدامة (TSM).',
      'Keep company laboratories ready to meet the requirements of Technical Sustainable Management (TSM) accreditation.'
    ),
    t(
      'مواكبة متطلبات اعتماد الأيزو ISO/IEC 17025 الخاصة بالمختبرات في المعاملات التي تقيسها معامل الشركة وتحللها.',
      'Meet ISO/IEC 17025 laboratory accreditation requirements for the tests measured and analyzed by company laboratories.'
    ),
    t(
      'الوصول إلى أعلى جودة ممكنة لمياه الشرب والاستخدامات المنزلية بالتوازي مع الاستخدام الأمثل للكيماويات.',
      'Achieve the highest possible quality of drinking and domestic-use water while optimizing chemical use.'
    ),
    t(
      'المشاركة في استدامة وتحديث سجلات المعامل البيئية وسجلات المخلفات الصلبة أو الخطرة ضمن الدور البيئي والمؤسسي للمعامل.',
      'Maintain and update laboratory environmental records and solid or hazardous waste records as part of the laboratories’ environmental and institutional role.'
    ),
    t(
      'رصد المخاطر بصورة آنية والإبلاغ الفوري عن أي مخاطر في مآخذ محطات مياه الشرب أو مراحل الإنتاج، والمساعدة في المسح البيئي بالتعاون مع الإدارة العامة للسلامة والمأمونية.',
      'Continuously monitor risks and promptly report risks at drinking water intakes or production stages, and support environmental surveys with the General Department of Safety and Security.'
    ),
    t(
      'السعي إلى توفير مركبة مجهزة بأجهزة معملية حقلية لكل نطاق جغرافي لتعمل كمعمل متنقل، وتتابع شكاوى جودة المياه وتضمن دورية أخذ العينات من المصادر حتى شبكات التوزيع.',
      'Work toward equipping each geographic area with a mobile laboratory vehicle to follow up on water-quality complaints and ensure regular sampling from sources through distribution networks.'
    ),
  ];

  const iso9001Benefits = [
    t(
      'تحسين جودة الخدمات والمنتجات من خلال الالتزام بمعايير الجودة والسلامة البيئية، بما ينعكس على جودة المياه والخدمات المقدمة.',
      'Improve service and product quality by following quality and environmental safety standards, supporting better water and service quality.'
    ),
    t(
      'زيادة ثقة المستفيدين والجهات المعنية في قدرة قطاع المعامل على تقديم خدمات عالية الجودة.',
      'Increase the confidence of beneficiaries and stakeholders in the Laboratory Sector’s ability to provide high-quality services.'
    ),
    t(
      'تعزيز التحسين والتطوير المستمر للعمليات والإجراءات وتحقيق التميز التشغيلي.',
      'Support continual improvement of processes and procedures and achieve operational excellence.'
    ),
    t(
      'ضمان الامتثال للوائح والقوانين المنظمة لقطاع المياه والبيئة.',
      'Support compliance with regulations and laws governing the water and environment sectors.'
    ),
  ];

  const iso17025Benefits = [
    t('ضمان جودة وموثوقية نتائج الفحوصات والتحاليل المعملية للمياه.', 'Ensure the quality and reliability of water laboratory test and analysis results.'),
    t('زيادة الثقة في أداء المعمل وقدرته على إجراء التحاليل بدقة وموثوقية.', 'Increase confidence in laboratory performance and its ability to conduct accurate, reliable analyses.'),
    t('تحسين الأداء العام للمعامل وزيادة كفاءتها التشغيلية.', 'Improve overall laboratory performance and operational efficiency.'),
    t('تلبية متطلبات الجهات الرقابية والتنظيمية فيما يخص جودة وموثوقية نتائج المعامل.', 'Meet regulatory and oversight requirements for the quality and reliability of laboratory results.'),
    t('تعزيز الميزة التنافسية للشركة.', 'Strengthen the company’s competitive advantage.'),
    t('المساهمة في حماية البيئة من خلال الحصول على نتائج موثوقة للمياه.', 'Help protect the environment by producing reliable water test results.'),
  ];

  return (
    <>
      <Header />
      <main
        dir={isEnglish ? 'ltr' : 'rtl'}
        className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]"
      >
        <div className="container mx-auto max-w-7xl space-y-7 px-4 py-8 md:py-10">
          <section className="relative overflow-hidden rounded-2xl bg-[#0a3555] px-5 py-9 text-center shadow-[0_18px_45px_rgba(10,53,85,0.18)] sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[#d7b05a]" aria-hidden="true" />
            <p className="font-bold text-[#e7c875]">{t('قطاع المعامل وضبط الجودة', 'Laboratory and Quality Control Sector')}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">
              {t('إنجازات قطاع المعامل', 'Laboratory Sector Achievements')}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-white/85 sm:text-lg">
              {t(
                'إنجازات وخطط استدامة واعتمادات معامل شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
                'Achievements, sustainability goals, and laboratory accreditations of Assiut and New Valley Water and Wastewater Company.'
              )}
            </p>
          </section>

          <AchievementSection
            id="water-safety-achievements"
            title={t('إنجازات الإدارة', 'Department Achievements')}
          >
            <ul className="grid gap-4 sm:grid-cols-2">
              {safetyAchievements.map((achievement, index) => (
                <li key={achievement} className="flex gap-4 rounded-xl border border-slate-200 bg-[#f7f9fb] p-4 leading-7 text-slate-700">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a3555] text-sm font-black text-white" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </AchievementSection>

          <AchievementSection
            id="sustainable-goals"
            title={t('الأهداف المستدامة بمعامل مياه الشرب', 'Sustainable Goals for Drinking Water Laboratories')}
          >
            <ol className="grid gap-4 lg:grid-cols-2">
              {sustainableGoals.map((goal, index) => (
                <li key={goal} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 leading-7 text-slate-700 shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf3f7] font-black text-[#0a3555]" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ol>
          </AchievementSection>

          <AchievementSection
            id="iso-sector"
            title={t('حصول قطاع المعامل على شهادة الأيزو', 'Laboratory Sector ISO Certification')}
          >
            <div className="rounded-xl border border-[#d7b05a]/50 bg-[#fbf8ef] p-5 text-center sm:p-7">
              <p className="text-lg font-extrabold leading-8 text-[#0a3555]">
                {t('ثانيًا: حصول قطاع المعامل على شهادة الأيزو', 'Second: The Laboratory Sector receives ISO certification')}
              </p>
            </div>
          </AchievementSection>

          <AchievementSection
            id="qualified-laboratories"
            title={t('معامل الشركة الحاصلة على التأهيل', 'Qualified Company Laboratories')}
          >
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {ACHIEVEMENT_IMAGES.map((lab) => (
                <figure key={lab.src} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={lab.src}
                    alt={t(lab.ar, lab.en)}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="px-4 py-3 text-center font-bold leading-6 text-[#0a3555]">
                    {t(lab.ar, lab.en)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </AchievementSection>

          <AchievementSection
            id="iso-9001-14001"
            title={t('أهمية الأيزو 9001 و14001', 'Importance of ISO 9001 and 14001')}
          >
            <p className="mb-5 leading-7 text-slate-700">
              {t('ومن أهم فوائد الحصول على هاتين الشهادتين:', 'Key benefits of obtaining these two certifications include:')}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {iso9001Benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 rounded-xl border border-slate-200 bg-[#f7f9fb] p-4 leading-7 text-slate-700">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d7b05a]" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </AchievementSection>

          <AchievementSection
            id="iso-certification-documentation"
            title={t('توثيق شهادة الأيزو', 'ISO Certification Documentation')}
          >
            <figure className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-[#f7f9fb] p-2 sm:p-4">
              <img
                src="/images/laboratories-achievements/iso-sector-proof.webp"
                alt={t('صورة توثيقية لشهادات قطاع المعامل من العرض التقديمي', 'Photographic documentation of the Laboratory Sector certificates from the presentation')}
                className="mx-auto max-h-[720px] w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </AchievementSection>

          <AchievementSection
            id="iso-17025"
            title={t('تأهيل المعامل للحصول على شهادة الأيزو 17025', 'Laboratory Qualification for ISO 17025')}
          >
            <h3 className="mb-5 text-lg font-extrabold leading-8 text-[#0a3555]">
              {t('أهمية حصول المعامل على شهادة الأيزو', 'Why ISO accreditation matters for laboratories')}
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {iso17025Benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 rounded-xl border border-slate-200 bg-[#f7f9fb] p-4 leading-7 text-slate-700">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1687a7]" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-[#d7b05a]/50 bg-[#fbf8ef] p-5 text-center">
              <p className="font-extrabold leading-7 text-[#0a3555]">
                {t(
                  'حصلت ٤ معامل بشركة مياه أسيوط على شهادة اعتماد الأيزو طبقًا للمواصفة الدولية ISO/IEC 17025:2017.',
                  'Four laboratories at Assiut Water Company have obtained ISO accreditation in accordance with the international standard ISO/IEC 17025:2017.'
                )}
              </p>
            </div>
          </AchievementSection>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LaboratoriesSectorAchievementsPage;
