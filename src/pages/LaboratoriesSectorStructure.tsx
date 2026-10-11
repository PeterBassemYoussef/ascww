import { useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type DepartmentNode = {
  id: string;
  ar: string;
  en: string;
  children: { ar: string; en: string }[];
};

const LABORATORY_STRUCTURE: DepartmentNode[] = [
  {
    id: 'drinking-water-labs',
    ar: 'الإدارة العامة لمعامل مياه الشرب',
    en: 'General Administration of Drinking Water Laboratories',
    children: [
      { ar: 'إدارة معمل صدفا', en: 'Sidfa Laboratory' },
      { ar: 'إدارة معمل القوصية وتابعه معمل مير', en: 'Al-Qusiya Laboratory and Mir Laboratory' },
      { ar: 'إدارة معمل أبوتيج', en: 'Abu Tig Laboratory' },
      { ar: 'إدارة معمل نزلة عبداللاه وتابعه الزاوية', en: 'Nuzlat Abd Allah Laboratory and Al-Zawiya' },
      { ar: 'إدارة معمل البداري وتابعه معمل ساحل سليم', en: 'Al-Badari Laboratory and Sahel Selim Laboratory' },
      { ar: 'إدارة معمل الوليدية وتابعه معامل بهيج والبورة ومنقباد', en: 'Al-Walidiya Laboratory and Bahig, Al-Bura, and Mankabad laboratories' },
      { ar: 'إدارة معمل التشيكي والألماني وتابعه معمل الجامعة', en: 'Al-Tashiki and German Laboratories, with University Laboratory' },
      { ar: 'إدارة معمل منفلوط', en: 'Manfalut Laboratory' },
      { ar: 'إدارة معمل الطوابية وتابعه معمل المعابدة', en: 'Al-Tawabiya Laboratory and Al-Maabda Laboratory' },
      { ar: 'إدارة معمل ديروط وتابعه معمل مسارة', en: 'Dairut Laboratory and Masara Laboratory' },
      { ar: 'إدارة معامل مياه الوادي الجديد (الخارجة، الداخلة، الفرافرة، باريس)', en: 'New Valley Water Laboratories (Kharga, Dakhla, Farafra, and Paris)' },
    ],
  },
  {
    id: 'wastewater-labs',
    ar: 'الإدارة العامة لمعامل الصرف الصحي',
    en: 'General Administration of Wastewater Laboratories',
    children: [
      { ar: 'إدارة معمل شطب', en: 'Shatb Laboratory' },
      { ar: 'إدارة معمل أبنوب والفتح وتابعه عرب العوامر', en: 'Abnoub and El-Fath Laboratory, with Arab El-Awamer' },
      { ar: 'إدارة معمل ديروط', en: 'Dairut Laboratory' },
      { ar: 'إدارة معمل البداري', en: 'Al-Badari Laboratory' },
      { ar: 'إدارة معمل منفلوط', en: 'Manfalut Laboratory' },
      { ar: 'إدارة معمل القوصية', en: 'Al-Qusiya Laboratory' },
      { ar: 'إدارة معمل صدفا والغنايم وتابعه الزرابي', en: 'Sidfa and El-Ghanayem Laboratory, with Al-Zarabi' },
      { ar: 'إدارة معامل صرف الوادي الجديد', en: 'New Valley Wastewater Laboratories' },
      { ar: 'إدارة معمل عرب المدابغ وتابعه بني غالب', en: 'Arab El-Madabegh Laboratory, with Bani Ghaleb' },
    ],
  },
  {
    id: 'industrial-wastewater',
    ar: 'الإدارة العامة للصرف الصناعي',
    en: 'General Administration of Industrial Wastewater',
    children: [
      { ar: 'إدارة الصرف الصناعي', en: 'Industrial Wastewater Department' },
      { ar: 'إدارة التراخيص الصناعية', en: 'Industrial Licensing Department' },
    ],
  },
  {
    id: 'information-systems',
    ar: 'إدارة نظم المعلومات ومتابعة التقارير',
    en: 'Information Systems and Reporting Follow-up Department',
    children: [],
  },
  {
    id: 'central-drinking-lab',
    ar: 'الإدارة العامة للمعمل المركزي لتحاليل مياه الشرب',
    en: 'General Administration of the Central Drinking Water Laboratory',
    children: [
      { ar: 'إدارة معمل الكيمياء العضوية', en: 'Organic Chemistry Laboratory' },
      { ar: 'إدارة معمل الكيمياء غير العضوية', en: 'Inorganic Chemistry Laboratory' },
      { ar: 'إدارة جودة المعمل المركزي', en: 'Central Laboratory Quality Department' },
      { ar: 'إدارة جمع وتكويد العينات', en: 'Sample Collection and Coding Department' },
      { ar: 'إدارة معمل الميكروبيولوجي', en: 'Microbiology Laboratory' },
    ],
  },
  {
    id: 'safety-assurance',
    ar: 'الإدارة العامة للسلامة والمأمونية',
    en: 'General Administration of Safety and Assurance',
    children: [
      { ar: 'إدارة سلامة ومأمونية المياه', en: 'Water Safety and Assurance Department' },
      { ar: 'إدارة مأمونية تداول الصرف الصحي', en: 'Wastewater Handling Safety Department' },
      { ar: 'إدارة المتابعة والتقييم', en: 'Follow-up and Evaluation Department' },
    ],
  },
  {
    id: 'third-party-operations',
    ar: 'إدارة تشغيل لصالح الغير (مياه، صرف)',
    en: 'Third-party Operations Department (Water and Wastewater)',
    children: [],
  },
  {
    id: 'central-wastewater-lab',
    ar: 'الإدارة العامة للمعمل المركزي لتحاليل عينات الصرف الصحي',
    en: 'General Administration of the Central Wastewater Sample Analysis Laboratory',
    children: [
      { ar: 'إدارة معمل الكيمياء العضوية', en: 'Organic Chemistry Laboratory' },
      { ar: 'إدارة جمع وتكويد العينات', en: 'Sample Collection and Coding Department' },
      { ar: 'إدارة معمل الكيمياء غير العضوية', en: 'Inorganic Chemistry Laboratory' },
      { ar: 'إدارة جودة المعمل المركزي', en: 'Central Laboratory Quality Department' },
      { ar: 'إدارة معمل الميكروبيولوجي', en: 'Microbiology Laboratory' },
    ],
  },
  {
    id: 'requirements',
    ar: 'إدارة الاحتياجات',
    en: 'Requirements Department',
    children: [],
  },
  {
    id: 'quality-environment',
    ar: 'الإدارة العامة لمراقبة وتأكيد الجودة وشئون البيئة',
    en: 'General Administration of Quality Assurance and Environmental Affairs',
    children: [
      { ar: 'إدارة جودة مياه الوادي الجديد', en: 'New Valley Water Quality Department' },
      { ar: 'إدارة جودة المياه', en: 'Water Quality Department' },
      { ar: 'إدارة شئون البيئة', en: 'Environmental Affairs Department' },
      { ar: 'إدارة جودة الصرف', en: 'Wastewater Quality Department' },
    ],
  },
  {
    id: 'secretariat',
    ar: 'إدارة السكرتارية',
    en: 'Secretariat Department',
    children: [],
  },
];

const SEARCH_ICON = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

function LaboratoriesSectorStructurePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const [query, setQuery] = useState('');
  const [activeDepartmentId, setActiveDepartmentId] = useState('drinking-water-labs');
  const [hoveredDepartmentId, setHoveredDepartmentId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visibleDepartments = useMemo(() => {
    if (!normalizedQuery) return LABORATORY_STRUCTURE;
    return LABORATORY_STRUCTURE.filter((department) => {
      const departmentName = isEnglish ? department.en : department.ar;
      const matchingChildren = department.children.some((child) => (isEnglish ? child.en : child.ar).toLocaleLowerCase().includes(normalizedQuery));
      return departmentName.toLocaleLowerCase().includes(normalizedQuery) || matchingChildren;
    });
  }, [isEnglish, normalizedQuery]);

  const departmentPositions = useMemo(() => visibleDepartments.map((department, index) => {
    const angle = (-90 + (index * 360) / visibleDepartments.length) * (Math.PI / 180);
    return {
      department,
      x: 50 + Math.cos(angle) * 40,
      y: 50 + Math.sin(angle) * 40,
    };
  }), [visibleDepartments]);

  const activeDepartment = visibleDepartments.find((department) => department.id === activeDepartmentId) ?? visibleDepartments[0];

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.10),_transparent_45%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_55%,#ffffff_100%)] py-8" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <header className="border-b border-[#d7b05a]/40 bg-white px-6 py-7 sm:px-8">
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                {t('هيكل قطاع المعامل', 'Laboratory Sector Structure')}
              </h1>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                {t('الهيكل الإداري لقطاع المعامل وضبط الجودة', 'Administrative structure of the Laboratory and Quality Control Sector')}
              </p>
            </header>

            <div className="space-y-6 px-4 py-5 sm:px-8 sm:py-7">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label htmlFor="laboratory-structure-search" className="mb-2 block text-xs font-bold text-slate-600">
                  {t('بحث داخل الإدارات والفروع', 'Search departments and laboratories')}
                </label>
                <div className="relative max-w-2xl">
                  <span className={`pointer-events-none absolute inset-y-0 flex items-center text-[#0a3555]/70 ${isEnglish ? 'left-3' : 'right-3'}`}>
                    {SEARCH_ICON}
                  </span>
                  <input
                    id="laboratory-structure-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('اكتب اسم إدارة أو معمل...', 'Search for a department or laboratory...')}
                    className={`h-11 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-800 outline-none transition focus:border-[#0a3555] focus:ring-2 focus:ring-[#0a3555]/15 ${isEnglish ? 'pl-10 pr-4 text-left' : 'pl-4 pr-10 text-right'}`}
                  />
                </div>
              </div>

              <section aria-labelledby="laboratory-structure-chart-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full bg-[#d7b05a]" aria-hidden="true" />
                  <h2 id="laboratory-structure-chart-title" className="text-lg font-extrabold text-[#0a3555] sm:text-xl">
                    {t('الخريطة الذهنية لهيكل القطاع', 'Laboratory sector organizational chart')}
                  </h2>
                </div>
                <p className="-mt-3 mb-5 text-center text-sm leading-6 text-slate-600">
                  {t(
                    'إرشادات تصفح الخريطة: اضغط على أي كارت لعرض الإدارات والفروع الخاصة به بالأسفل، مع تثبيت خط الربط من رئيس القطاع.',
                    'Map navigation: select any card to view its departments and branches below; the connection to the Sector Head remains visible.'
                  )}
                </p>

                {visibleDepartments.length ? (
                  <>
                    <div className="relative mx-auto hidden h-[760px] w-full max-w-[1120px] overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_center,_rgba(22,135,167,0.09),_rgba(255,255,255,0.97)_53%)] lg:block">
                      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
                        {departmentPositions.map(({ department, x, y }) => (
                          hoveredDepartmentId === department.id || activeDepartment?.id === department.id ? (
                            <line
                              key={`connector-${department.id}`}
                              x1="500"
                              y1="350"
                              x2={x * 10}
                              y2={y * 7}
                              stroke={activeDepartment?.id === department.id ? '#d7b05a' : '#77a9bd'}
                              strokeWidth={activeDepartment?.id === department.id ? '2.8' : '1.6'}
                            />
                          ) : null
                        ))}
                      </svg>

                      <div className="absolute left-1/2 top-1/2 z-20 flex h-[142px] w-[276px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border border-[#0a3555]/20 bg-white px-4 text-center shadow-[0_8px_22px_rgba(10,53,85,0.18)]">
                        <span className="mb-1 text-[11px] font-bold text-[#1687a7]">{t('رئيس القطاع', 'Sector Head')}</span>
                        <strong className="text-sm font-black leading-6 text-[#0a3555]">
                          {t('رئيس قطاع المعامل وضبط الجودة', 'Head of Laboratory and Quality Control Sector')}
                        </strong>
                      </div>

                      {departmentPositions.map(({ department, x, y }, index) => {
                        const isActive = activeDepartment?.id === department.id;
                        const colorClass = index % 3 === 0
                          ? 'border-[#0a3555]/25 bg-[#eaf2f8]'
                          : index % 3 === 1
                            ? 'border-[#1687a7]/30 bg-[#e9f5f4]'
                            : 'border-[#d7b05a]/45 bg-[#fbf7eb]';
                        return (
                          <button
                            key={department.id}
                            type="button"
                            onClick={() => setActiveDepartmentId(department.id)}
                            aria-pressed={isActive}
                            onPointerEnter={() => setHoveredDepartmentId(department.id)}
                            onPointerLeave={() => setHoveredDepartmentId(null)}
                            onFocus={() => setHoveredDepartmentId(department.id)}
                            onBlur={() => setHoveredDepartmentId(null)}
                            className={`absolute z-10 flex min-h-[82px] w-[208px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border px-4 py-3 text-center transition hover:shadow-md ${colorClass} ${isActive ? 'ring-2 ring-[#0a3555]/40 shadow-md' : 'shadow-sm'}`}
                            style={{ left: `${x}%`, top: `${y}%` }}
                          >
                            <strong className="text-xs font-extrabold leading-5 text-[#0a3555]">{isEnglish ? department.en : department.ar}</strong>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-3 lg:hidden">
                      <div className="rounded-xl border border-[#d7b05a]/60 bg-[#0a3555] px-5 py-4 text-center text-white shadow-sm">
                        <span className="mb-1 block text-xs font-bold text-[#e7c875]">{t('رئيس القطاع', 'Sector Head')}</span>
                        <strong className="text-sm font-extrabold leading-6">{t('رئيس قطاع المعامل وضبط الجودة', 'Head of Laboratory and Quality Control Sector')}</strong>
                      </div>
                      {visibleDepartments.map((department, index) => {
                        const isActive = activeDepartment?.id === department.id;
                        const colors = ['border-[#0a3555]/25 bg-[#eaf2f8]', 'border-[#1687a7]/30 bg-[#e9f5f4]', 'border-[#d7b05a]/45 bg-[#fbf7eb]'];
                        return (
                          <div key={department.id} className="relative ms-6 ps-4">
                            <button
                              type="button"
                              onClick={() => setActiveDepartmentId(department.id)}
                              aria-pressed={isActive}
                              className={`min-h-16 w-full rounded-xl border px-4 py-3 text-start text-sm font-extrabold leading-6 text-[#0a3555] transition ${colors[index % colors.length]} ${isActive ? 'ring-2 ring-[#0a3555]/35' : ''}`}
                            >
                              {isEnglish ? department.en : department.ar}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-600">
                    {t('لا توجد نتائج مطابقة للبحث.', 'No matching departments were found.')}
                  </div>
                )}
              </section>

              {activeDepartment ? (
                <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <header className="border-b border-[#d7b05a]/40 bg-[#f7f9fb] px-5 py-4">
                    <p className="text-xs font-bold text-[#1687a7]">{t('الإدارة المحددة', 'Selected department')}</p>
                    <h2 className="mt-1 text-lg font-extrabold leading-7 text-[#0a3555]">
                      {isEnglish ? activeDepartment.en : activeDepartment.ar}
                    </h2>
                  </header>
                  <div className="p-4 sm:p-5">
                    {activeDepartment.children.length ? (
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {activeDepartment.children.map((child, index) => (
                          <li key={`${activeDepartment.id}-${index}`} className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#d7b05a]" aria-hidden="true" />
                            <span className="text-sm font-semibold leading-6 text-slate-700">{isEnglish ? child.en : child.ar}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ) : null}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LaboratoriesSectorStructurePage;