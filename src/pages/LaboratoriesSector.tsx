import { useRef, useState, type KeyboardEvent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const ASSET_PATH = '/images/lap-pdf/content';

const STATION_TYPES = [
  { ar: 'محطات مرشحة كبرى', en: 'Major filtration plants', valueAr: '11 محطة', valueEn: '11 plants' },
  { ar: 'محطات الآبار الجوفية', en: 'Groundwater wells', valueAr: '657 بئراً عاملاً في 204 محطة', valueEn: '657 active wells at 204 sites' },
  { ar: 'محطات نقالى', en: 'Mobile plants', valueAr: '28 محطة', valueEn: '28 plants' },
  { ar: 'محطات زلطية', en: 'Gravel filtration plants', valueAr: '3 محطات', valueEn: '3 plants' },
  { ar: 'الآبار الشاطئية RBF', en: 'Riverbank filtration wells (RBF)', valueAr: '3 محطات', valueEn: '3 plants' },
  { ar: 'الترشيح المباشر', en: 'Direct filtration', valueAr: 'محطة واحدة', valueEn: '1 plant' },
  { ar: 'Dyanasand', en: 'Dyanasand', valueAr: 'محطتان', valueEn: '2 plants' },
];

const TEST_GROUPS = [
  {
    ar: 'تحاليل مياه الشرب الكيميائية',
    en: 'Drinking water chemical analyses',
    rows: [['Fe', 'T.Mg H'], ['MN', 'Cl'], ['NH3', 'T.R.Cl'], ['NO2', 'PH'], ['NO3', 'Turb'], ['T.Alk', 'SO4'], ['T.H', 'T.D.S'], ['T.Ca H', '']],
  },
  {
    ar: 'تحاليل مياه الشرب الميكروبيولوجية',
    en: 'Drinking water microbiological analyses',
    rows: [['T.Coliform'], ['T.Streptococci'], ['Fecal streptococci'], ['HPC'], ['Algai count'], ['protozoa'], [''], ['']],
  },
  {
    ar: 'تحاليل عينات الصرف الصحي',
    en: 'Wastewater sample analyses',
    rows: [['Fe', 'TSS'], ['MN', 'VS'], ['NH3', 'COD'], ['NO2', 'BOD'], ['NO3', 'Oil & Grase'], ['T.R.Cl', ''], ['PH', ''], ['T.D.S', '']],
  },
];

const DEPARTMENT_TABS = [
  {
    slide: 9,
    arTitle: 'إدارة نظم المعلومات والتقارير',
    arTabTitle: 'إدارة نظم المعلومات',
    enTitle: 'Information Systems and Reports Department',
    arDetails: ['تحليل جميع عينات المياه والصرف الصحي.', 'إعداد التقارير اللازمة.'],
    enDetails: ['Analyze all water and wastewater samples.', 'Prepare the required reports.'],
  },
  {
    slide: 10,
    arTitle: 'إدارة الاحتياجات',
    enTitle: 'Requirements Department',
    arDetails: ['توفير جميع احتياجات قطاع المعامل.'],
    enDetails: ['Provide all requirements of the Laboratory Sector.'],
  },
  {
    slide: 11,
    arTitle: 'إدارة التشغيل لصالح الغير',
    enTitle: 'Third-Party Operations Department',
    arDetails: [
      'استقبال العملاء واستلام العينات الخارجية لتحليلها بالمعمل المركزي.',
      'غسيل وتطهير وتعقيم الخزانات الخارجية المدفوعة بأجر، سواء كانت أهلية أو حكومية.',
    ],
    enDetails: [
      'Receive customers and external samples for analysis at the Central Laboratory.',
      'Wash, disinfect, and sterilize paid external tanks for residential and government customers.',
    ],
  },
  {
    slide: 13,
    arTitle: 'الإدارة العامة للضبط والجودة',
    enTitle: 'General Department of Quality Control',
    arDetails: [],
    enDetails: [],
  },
  {
    slide: 14,
    arTitle: 'الإدارة العامة للسلامة والمأمونية',
    enTitle: 'General Department of Safety and Security',
    arDetails: ['إعداد خطط سلامة ومأمونية المياه لمناطق الإمداد، وخطط مأمونية تداول الصرف الصحي.', 'تقديم ورش عمل وبرامج تدريبية للتعريف بخطط سلامة ومأمونية المياه.'],
    enDetails: ['Prepare water safety plans for supply areas and wastewater handling safety plans.', 'Provide workshops and training programs on water safety and security plans.'],
  },
  {
    slide: 16,
    arTitle: 'الإدارة العامة لمعامل مياه الشرب',
    enTitle: 'General Department of Drinking Water Laboratories',
    arDetails: [
      'تضم معامل مياه الشرب الرئيسية والفرعية الموزعة جغرافيًا على محافظتي أسيوط والوادي الجديد، بالإضافة إلى المعامل المتنقلة التابعة لبعض النطاقات الجغرافية.',
      'كما تضم بعض الإدارات النوعية التي تضمن جودة الأداء المؤسسي وفاعلية دور الإدارة في تحقيق أهداف قطاع المعامل والجودة والشركة.',
    ],
    enDetails: [
      'Includes the main and branch drinking water laboratories distributed across Assiut and New Valley, as well as mobile laboratories serving some geographic areas.',
      'It also includes specialized departments that support institutional performance and help the Laboratory and Quality Sector achieve the company’s objectives.',
    ],
  },
];

const LABORATORY_RANGES = [
  { number: '1', laboratory: 'المعمل المركزي', laboratoryEn: 'Central Laboratory', scope: 'جميع المحطات بمحافظة أسيوط بواقع 228 محطة', scopeEn: 'All 228 plants in Assiut Governorate', plants: 'جميع المحطات', plantsEn: 'All plants', network: '7883786' },
  { number: '2', laboratory: 'معمل محطة مياه نزلة عبداللاه المرشحة', laboratoryEn: 'Nuzlat Abd Allah Filtered Water Plant Laboratory', scope: 'جنوب مركز أسيوط / غرب مدينة أسيوط', scopeEn: 'South Assiut District / West Assiut City', plants: '17 محطة', plantsEn: '17 plants', network: '488750.8' },
  { number: '3', laboratory: 'معمل محطة مياه الألمانى', laboratoryEn: 'German Water Plant Laboratory', scope: 'شمال مركز أسيوط / شرق مدينة أسيوط / 8 محطات بمركز أبنوب', scopeEn: 'North Assiut District / East Assiut City / 8 plants in Abnoub District', plants: '27 محطة', plantsEn: '27 plants', network: '782725.8' },
  { number: '4', laboratory: 'معمل محطة مياه الوليدية', laboratoryEn: 'Al-Walidiya Water Plant Laboratory', scope: 'منطقة الوليدية', scopeEn: 'Al-Walidiya area', plants: 'محطة واحدة', plantsEn: '1 plant', network: '244375.4' },
  { number: '5', laboratory: 'معمل محطة مياه الطوابية', laboratoryEn: 'Al-Tawabiya Water Plant Laboratory', scope: 'مركز الفتح / 10 محطات بمركز أبنوب', scopeEn: 'El-Fath District / 10 plants in Abnoub District', plants: '25 محطة', plantsEn: '25 plants', network: '930791' },
  { number: '6', laboratory: 'معمل محطة مياه القوصية', laboratoryEn: 'Al-Qusiya Water Plant Laboratory', scope: 'مركز القوصية', scopeEn: 'Al-Qusiya District', plants: '38 محطة', plantsEn: '38 plants', network: '735034' },
  { number: '7', laboratory: 'معمل محطة مياه منفلوط', laboratoryEn: 'Manfalut Water Plant Laboratory', scope: 'مركز منفلوط / المعابدة', scopeEn: 'Manfalut District / Al-Maabda', plants: '30 محطة', plantsEn: '30 plants', network: '1299363' },
  { number: '8', laboratory: 'معمل محطة مياه ديروط', laboratoryEn: 'Dairut Water Plant Laboratory', scope: 'مركز ديروط', scopeEn: 'Dairut District', plants: '29 محطة', plantsEn: '29 plants', network: '933035' },
  { number: '9', laboratory: 'معمل محطة مياه صدفا', laboratoryEn: 'Sidfa Water Plant Laboratory', scope: 'مركز صدفا / مركز الغنايم', scopeEn: 'Sidfa District / El-Ghanayem District', plants: '18 محطة', plantsEn: '18 plants', network: '761101' },
  { number: '10', laboratory: 'معمل محطة مياه أبوتيج', laboratoryEn: 'Abu Tig Water Plant Laboratory', scope: 'مركز أبوتيج', scopeEn: 'Abu Tig District', plants: '12 محطة', plantsEn: '12 plants', network: '609040' },
  { number: '11', laboratory: 'معمل محطة مياه البداري', laboratoryEn: 'Al-Badari Water Plant Laboratory', scope: 'مركز البداري / مركز الساحل', scopeEn: 'Al-Badari District / Sahel District', plants: '31 محطة', plantsEn: '31 plants', network: '1099571' },
];

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(10,53,85,0.07)]">
      <header className="flex items-center gap-3 border-b border-[#d7b05a]/45 bg-[#f7f9fb] px-5 py-4 sm:px-6">
        <span className="h-7 w-1 rounded-full bg-[#d7b05a]" aria-hidden="true" />
        <h2 className="text-lg font-extrabold text-[#0a3555] sm:text-xl">{title}</h2>
      </header>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-r-2 border-[#d7b05a] px-4 py-2">
      <dt className="text-sm font-semibold leading-6 text-slate-600">{label}</dt>
      <dd className="mt-1 text-xl font-black leading-8 text-[#0a3555] sm:text-2xl">{value}</dd>
    </div>
  );
}

function AdministrativeDivisionChart({ isEnglish, variant, fillColumn = false }: { isEnglish: boolean; variant: 'assuit' | 'new-valley'; fillColumn?: boolean }) {
  const isAssuit = variant === 'assuit';
  const title = isEnglish
    ? `Administrative divisions of ${isAssuit ? 'Assiut' : 'New Valley'} Governorate`
    : `التقسيم الإداري لمحافظة ${isAssuit ? 'أسيوط' : 'الوادي الجديد'}`;
  const nodes = isEnglish
    ? [
      { value: isAssuit ? '11' : '5', label: 'Centers', position: 'left-1/2 top-0 -translate-x-1/2' },
      { value: isAssuit ? '11' : '5', label: 'Cities', position: 'right-0 top-[29%]' },
      { value: isAssuit ? '60' : '47', label: 'Local rural units', position: 'right-[10%] bottom-0' },
      { value: isAssuit ? '235' : '74', label: 'Villages', position: 'left-[10%] bottom-0' },
      { value: isAssuit ? '135' : '50', label: 'Hamlets', position: 'left-0 top-[29%]' },
    ]
    : [
      { value: isAssuit ? '١١' : '٥', label: 'مركز', position: 'left-1/2 top-0 -translate-x-1/2' },
      { value: isAssuit ? '١١' : '٥', label: 'مدينة', position: 'right-0 top-[29%]' },
      { value: isAssuit ? '٦٠' : '٤٧', label: 'وحدة قروية', position: 'right-[10%] bottom-0' },
      { value: isAssuit ? '٢٣٥' : '٧٤', label: 'قرية', position: 'left-[10%] bottom-0' },
      { value: isAssuit ? '١٣٥' : '٥٠', label: 'نجع تابع', position: 'left-0 top-[29%]' },
    ];

  return (
    <section aria-labelledby="assuit-administrative-chart-title" className={`overflow-hidden rounded-lg border border-slate-200 bg-[#f5f9fc] p-3 sm:p-4 ${fillColumn ? 'lg:flex lg:flex-1 lg:flex-col' : ''}`}>
      <h3 id="assuit-administrative-chart-title" className="border-b-2 border-[#d7b05a] pb-2 text-center text-sm font-extrabold text-[#0a3555] sm:text-base">
        {title}
      </h3>
      <div dir="ltr" className={`relative mx-auto mt-2 aspect-[1.6/1] min-h-[180px] max-w-[320px] sm:min-h-[200px] ${fillColumn ? 'lg:mx-0 lg:mt-2 lg:w-full lg:max-w-none lg:flex-1 lg:aspect-auto lg:min-h-0' : ''}`}>
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 aspect-square w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1687a7]/45" />
        {nodes.map((node, index) => (
          <div
            key={node.label}
            className={`absolute z-10 flex min-h-[52px] w-[88px] flex-col items-center justify-center rounded-md border px-1.5 py-1 text-center shadow-[0_4px_12px_rgba(10,53,85,0.10)] sm:min-h-[60px] sm:w-[104px] ${node.position} ${index === 0
                ? 'border-[#0a3555]/30 bg-[#dce9f7]'
                : index === 1
                  ? 'border-[#1687a7]/30 bg-[#d8f0ed]'
                  : index === 2
                    ? 'border-[#1687a7]/30 bg-[#d8f0ed]'
                    : 'border-[#8bb987]/45 bg-[#e4f1df]'
              }`}
          >
            <strong dir={isEnglish ? 'ltr' : 'rtl'} className="text-sm font-black leading-4 text-[#0a3555] sm:text-base">{node.value}</strong>
            <span dir={isEnglish ? 'ltr' : 'rtl'} className="mt-0.5 text-[10px] font-bold leading-3.5 text-slate-700 sm:text-[11px]">{node.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TreatmentStationsDiagram({ isEnglish }: { isEnglish: boolean }) {
  const positions = [
    'left-1/2 top-0 -translate-x-1/2',
    'right-[4%] top-[18%]',
    'right-[2%] top-[55%]',
    'right-[27%] bottom-0',
    'left-[27%] bottom-0',
    'left-[2%] top-[55%]',
    'left-[4%] top-[18%]',
  ];

  return (
    <div dir={isEnglish ? 'rtl' : 'ltr'} className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
      <figure className="overflow-hidden rounded-lg border border-slate-200 bg-[#eaf3f7]">
        <img
          src={`${ASSET_PATH}/slide-4-image-3.jpg`}
          alt={isEnglish ? 'Water treatment plant in Assiut' : 'محطة لتنقية مياه الشرب بمحافظة أسيوط'}
          loading="lazy"
          decoding="async"
          className="block h-56 w-full object-cover sm:h-72 lg:h-[390px]"
        />
      </figure>

      <div>
        <div className="relative mx-auto hidden aspect-[1.38/1] min-h-[380px] max-w-[620px] lg:block">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#0a3555]" />
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[7px] border-[#1687a7] bg-white text-center shadow-[0_8px_24px_rgba(10,53,85,0.18)]">
            <span className="text-2xl font-black leading-7 text-[#0a3555]">H₂O</span>
            <span className="text-xs font-bold text-[#1687a7]">{isEnglish ? 'Clean water' : 'مياه نقية'}</span>
          </div>
          {STATION_TYPES.map((station, index) => (
            <div
              key={station.ar}
              className={`absolute z-10 flex min-h-[74px] w-[138px] flex-col items-center justify-center rounded-lg border px-2 py-2 text-center shadow-[0_5px_16px_rgba(10,53,85,0.11)] ${positions[index]} ${index % 2 === 0 ? 'border-[#d7b05a]/55 bg-[#fffaf0]' : 'border-[#1687a7]/35 bg-[#eff8f8]'}`}
            >
              <span dir={isEnglish ? 'ltr' : 'rtl'} className="text-xs font-bold leading-5 text-[#0a3555]">{isEnglish ? station.en : station.ar}</span>
              <strong dir={isEnglish ? 'ltr' : 'rtl'} className="mt-0.5 text-xs font-black leading-5 text-[#1687a7]">{isEnglish ? station.valueEn : station.valueAr}</strong>
            </div>
          ))}
        </div>

        <ul dir={isEnglish ? 'ltr' : 'rtl'} className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:hidden">
          {STATION_TYPES.map((station, index) => (
            <li key={station.ar} className={`flex min-h-[78px] flex-col justify-center rounded-lg border px-3 py-2 ${index % 2 === 0 ? 'border-[#d7b05a]/45 bg-[#fffaf0]' : 'border-[#1687a7]/30 bg-[#eff8f8]'}`}>
              <span className="text-sm font-bold leading-5 text-[#0a3555]">{isEnglish ? station.en : station.ar}</span>
              <strong className="mt-1 text-sm font-black text-[#1687a7]">{isEnglish ? station.valueEn : station.valueAr}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LaboratoryRangeTable({ compact = false, isEnglish }: { compact?: boolean; isEnglish: boolean }) {
  const columns = isEnglish
    ? [
      { label: 'No.', key: 'number' },
      { label: 'Laboratory', key: 'laboratoryEn' },
      { label: 'Service area', key: 'scopeEn' },
      { label: 'Plants monitored', key: 'plantsEn' },
      { label: 'Network length (m)', key: 'network' },
    ] as const
    : [
      { label: 'م', key: 'number' },
      { label: 'المعمل', key: 'laboratory' },
      { label: 'النطاق', key: 'scope' },
      { label: 'عدد المحطات التي تتم متابعتها', key: 'plants' },
      { label: 'أطوال الشبكات (م)', key: 'network' },
    ] as const;

  if (compact) {
    return (
      <div dir={isEnglish ? 'ltr' : 'rtl'} className="grid gap-3">
        {LABORATORY_RANGES.map((row) => (
          <article key={row.number} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-extrabold leading-7 text-[#0a3555]">{isEnglish ? row.laboratoryEn : row.laboratory}</h3>
            <p className="mt-2 leading-7 text-slate-700">{isEnglish ? row.scopeEn : row.scope}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-sm">
              <p><span className="block text-slate-500">{isEnglish ? 'Plants monitored' : 'عدد المحطات'}</span><strong className="mt-1 block text-[#0a3555]">{isEnglish ? row.plantsEn : row.plants}</strong></p>
              <p><span className="block text-slate-500">{isEnglish ? 'Network length (m)' : 'أطوال الشبكات (م)'}</span><strong className="mt-1 block text-[#0a3555]">{row.network}</strong></p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table dir={isEnglish ? 'ltr' : 'rtl'} className={`min-w-[850px] w-full border-collapse text-sm ${isEnglish ? 'text-left' : 'text-right'}`}>
        <thead className="bg-[#0a3555] text-white">
          <tr>{columns.map((column) => <th key={column.key} scope="col" className="px-3 py-3 font-bold">{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {LABORATORY_RANGES.map((row, index) => (
            <tr key={row.number} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f2f6fa]'}>
              {columns.map((column) => <td key={column.key} className="border-t border-slate-200 px-3 py-3 leading-6">{row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LaboratoriesSectorPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const [activeSlide, setActiveSlide] = useState(9);
  const departmentTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeDepartment = DEPARTMENT_TABS.find((tab) => tab.slide === activeSlide) ?? DEPARTMENT_TABS[0];

  const handleDepartmentTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextKey = isEnglish ? 'ArrowRight' : 'ArrowLeft';
    const previousKey = isEnglish ? 'ArrowLeft' : 'ArrowRight';
    let nextIndex: number | undefined;

    if (event.key === nextKey) {
      nextIndex = (index + 1) % DEPARTMENT_TABS.length;
    } else if (event.key === previousKey) {
      nextIndex = (index - 1 + DEPARTMENT_TABS.length) % DEPARTMENT_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = DEPARTMENT_TABS.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      const nextTab = DEPARTMENT_TABS[nextIndex];
      setActiveSlide(nextTab.slide);
      departmentTabRefs.current[nextIndex]?.focus();
    }
  };

  const provinceSections = [
    {
      title: t('وصف عام لمحافظة أسيوط', 'Assiut Governorate overview'),
      mapTitle: t('التقسيم الإداري لمحافظة أسيوط صورة', 'Administrative divisions of Assiut Governorate'),
      map: `${ASSET_PATH}/2.png`,
      mapAlt: t('خريطة التقسيم الإداري لمحافظة أسيوط', 'Administrative map of Assiut Governorate'),
      metrics: [
        [t('المساحة', 'Area'), t('نحو 26 ألف كم²', 'About 26,000 km²')],
        [t('نسبة المساحة من مصر', 'Share of Egypt’s area'), '2.6%'],
        [t('عدد السكان', 'Population'), '1,146,384'],
        [t('سكان الريف', 'Rural population'), '71.8%'],
        [t('سكان المدن', 'Urban population'), '28.2%'],
        [t('إجمالي المياه المنتجة', 'Total water produced'), t('768,562 م³/يوم', '768,562 m³/day')],
      ],
      administrativeChart: 'assuit' as const,
    },
    {
      title: t('وصف عام لمحافظة الوادي الجديد', 'New Valley Governorate overview'),
      mapTitle: t('التقسيم الإداري لمحافظة الوادي الجديد صورة', 'Administrative divisions of New Valley Governorate'),
      map: `${ASSET_PATH}/slide-3-image-1.png`,
      mapAlt: t('خريطة التقسيم الإداري لمحافظة الوادي الجديد', 'Administrative map of New Valley Governorate'),
      metrics: [
        [t('المساحة', 'Area'), t('نحو 440 ألف كم²', 'About 440,000 km²')],
        [t('نسبة المساحة من مصر', 'Share of Egypt’s area'), '44%'],
        [t('عدد السكان', 'Population'), '274,000'],
        [t('سكان الريف', 'Rural population'), '54%'],
        [t('سكان المدن', 'Urban population'), '46%'],
        [t('إجمالي المياه المنتجة', 'Total water produced'), t('256,905 م³/يوم', '256,905 m³/day')],
      ],
      administrativeChart: 'new-valley' as const,
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl space-y-7 px-4 py-8 md:py-10">
          <section className="relative overflow-hidden rounded-2xl bg-[#0a3555] px-5 py-8 text-center shadow-[0_18px_45px_rgba(10,53,85,0.18)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[#d7b05a]" aria-hidden="true" />
            <div dir="ltr" className="relative mx-auto grid max-w-6xl items-center gap-5 sm:grid-cols-[88px_minmax(0,1fr)_88px]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 sm:h-24 sm:w-24">
                <img src={`${ASSET_PATH}/slide-1-image-1.png`} alt={t('شعار الشركة', 'Company logo')} className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">{t('قطاع المعامل', 'Laboratory sector')}</h1>
                <p className="mt-2 text-xl font-bold text-[#e7c875] sm:text-2xl">{t('ضبط الجودة', 'Quality Control')}</p>
                <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#d7b05a]" aria-hidden="true" />
                <p className="text-base font-semibold leading-8 text-white/90 sm:text-xl">
                  {isEnglish ? 'Assiut and New Valley Water and Wastewater Company' : <>بشركة مياه الشرب والصرف الصحي<br />باسيوط والوادي الجديد</>}
                </p>
              </div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 sm:h-24 sm:w-24">
                <img src={`${ASSET_PATH}/slide-1-image-2.png`} alt={t('شعار الشركة القابضة', 'Holding company logo')} className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </section>

          {provinceSections.map((province) => (
            <ContentSection key={province.title} title={province.title}>
              <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.15fr)] lg:items-stretch" dir="ltr">
                <div className="space-y-5 lg:col-start-1">
                  <dl dir={isEnglish ? 'ltr' : 'rtl'} className="grid content-start grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                    {province.metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
                  </dl>
                  <AdministrativeDivisionChart isEnglish={isEnglish} variant={province.administrativeChart} />
                </div>

                <div className="space-y-5 lg:col-start-2 lg:row-start-1 lg:h-full">
                  <figure dir={isEnglish ? 'ltr' : 'rtl'} className="overflow-hidden rounded-lg border border-slate-200 bg-[#f7f9fb] lg:flex lg:h-full lg:flex-col">
                    <figcaption className="border-b border-slate-200 px-4 py-3 text-center font-bold text-[#0a3555]">{province.mapTitle}</figcaption>
                    <img
                      src={province.map}
                      alt={province.mapAlt}
                      loading="lazy"
                      decoding="async"
                      className={`mx-auto max-h-[430px] w-full object-contain lg:my-auto ${province.administrativeChart === 'assuit' ? 'mt-0' : 'max-w-[480px] aspect-[1122/686]'} ${province.administrativeChart === 'new-valley' ? 'max-w-[480px] aspect-[1122/686]' : ''}`}
                    />
                  </figure>
                </div>
              </div>
            </ContentSection>
          ))}

          <ContentSection title={t('أنواع محطات تنقية مياه الشرب بمحافظة أسيوط', 'Drinking water treatment plants in Assiut')}>
            <TreatmentStationsDiagram isEnglish={isEnglish} />
          </ContentSection>

          <ContentSection title={t('مصادر مياه الشرب بمحافظة أسيوط', 'Drinking water sources in Assiut')}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:items-center">
              <div>
                <p className="text-justify text-base leading-8 text-slate-700">
                  {t(
                    'تعتمد محافظة أسيوط على المياه السطحية والمياه الجوفية كمصدر أساسي لمياه الشرب. وتتغذى بعض القرى والعزب التابعة للمحافظة بالمياه الجوفية، مثل الغنايم ومنفلوط وساحل سليم وأبوتيج وأبنوب والفتح ومركز ومدينة أسيوط وديروط والبداري والقوصية وصفا.',
                    'Assiut Governorate relies on surface water and groundwater as its primary drinking water sources. Some villages and settlements receive groundwater, including El-Ghanayem, Manfalut, Sahel Selim, Abu Tig, Abnoub, El-Fath, Assiut, Dairut, El-Badari, El-Qusiya, and Safo.'
                  )}
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: t('المياه السطحية', 'Surface water'), value: 67, color: 'bg-[#1687a7]' },
                    { label: t('المياه الجوفية', 'Groundwater'), value: 33, color: 'bg-[#d7b05a]' },
                  ].map((source) => (
                    <div key={source.label} className="rounded-lg border border-slate-200 bg-[#f7f9fb] p-4">
                      <div className="flex items-center justify-between gap-3 font-bold text-[#0a3555]">
                        <dt>{source.label}</dt>
                        <dd>{source.value}%</dd>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`${source.label}: ${source.value}%`}>
                        <div className={`h-full rounded-full ${source.color}`} style={{ width: `${source.value}%` }} />
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
              <figure className="overflow-hidden rounded-lg border border-slate-200 bg-[#eaf3f7]">
                <img
                  src={`${ASSET_PATH}/slide-5-image-1.jpg`}
                  alt={t('مياه جوفية في مصدر طبيعي بمحافظة أسيوط', 'Groundwater at a natural source in Assiut Governorate')}
                  loading="lazy"
                  decoding="async"
                  className="block h-60 w-full object-cover sm:h-72"
                />
              </figure>
            </div>
          </ContentSection>

          <ContentSection title={t('قطاع المعامل وضبط الجودة', 'Laboratory and quality control sector')}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
              <div className="space-y-4 text-justify text-base leading-8 text-slate-700">
                <p>{t(
                  'تولي الشركة اهتمامًا بالغاً بالالتزام بمعايير جودة المياه وصولاً للتميز والريادة واستدامة الخدمة المقدمة، مع مراعاة معايير إجراء التحاليل البكتريولوجية والكيميائية وفقاً لمعايير منظمة الصحة العالمية وقرار وزير الصحه رقم 458 لسنة 2007.',
                  'The company is committed to water quality standards, service excellence, and sustainability. Bacteriological and chemical analyses follow World Health Organization guidance and Minister of Health Decree No. 458 of 2007.'
                )}</p>
                <p>{t(
                  'ويتم ذلك بخلق شبكة مترابطة من المعامل الرئيسيه والفرعية لتحليل عينات المياه والصرف الصحي والرجوع إلى المعمل المركزي بما يحويه من عدد (4) معامل رئيسية ما بين (معمل التحاليل والقياسات العضوية، ومعمل الكيمياء غير العضوية Inorganic Laboratory، المعمل الميكروبيولوجى) والمدعم بأحدث الأجهزة والمعدات اللازمة لإجراء أدق التحاليل الخاصة بالمياه لتحقيق الجودة التامة المقدمة لمحافظة أسيوط والوادي الجديد.',
                  'This is supported by an interconnected network of central and branch laboratories for water and wastewater samples. The central laboratory includes organic analysis and measurement, inorganic chemistry, and microbiology laboratories, supported by modern equipment for accurate testing across Assiut and New Valley.'
                )}</p>
              </div>
              <div className="rounded-lg border border-[#d7b05a]/50 bg-[#f7f9fb] p-5 text-center">
                <p className="text-sm font-bold text-slate-600">{t('مرجعية جودة المياه', 'Water quality standard')}</p>
                <p className="mt-2 text-3xl font-black text-[#0a3555]">458</p>
                <p className="mt-1 font-bold text-[#1687a7]">{t('قرار وزير الصحة لسنة 2007', 'Minister of Health Decree, 2007')}</p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title={t('خطة مراقبة نوعية المياه', 'Water quality monitoring plan')}>
            <div dir={isEnglish ? 'ltr' : 'rtl'} className={isEnglish ? 'text-left' : 'text-right'}>
              <p className={`mb-5 text-base leading-8 text-slate-700 ${isEnglish ? 'text-left' : 'text-right'}`}>
                {t('طبقًا لقرار وزير الصحة رقم 458 لسنة 2007، تُحلل معامل الشركة العناصر التالية وفق دوريات الفحص المحددة:', 'Under Minister of Health Decree No. 458 of 2007, company laboratories analyze the following parameters at the specified frequencies:')}
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className={`min-w-[620px] w-full border-collapse ${isEnglish ? 'text-left' : 'text-right'}`}>
                  <thead className="bg-[#0a3555] text-white">
                    <tr>
                      {[t('الفحوصات', 'Test category'), t('عدد العناصر', 'Parameters'), t('دورية الفحص', 'Frequency')].map((header) => <th key={header} scope="col" className={`px-4 py-3 ${isEnglish ? 'text-left' : 'text-right'}`}>{header}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['الخواص الطبيعية', '5', 'يوميًا'],
                      ['مواد غير عضوية لها تأثير على الاستساغة والاستخدامات المنزلية', '12', 'يوميًا'],
                      ['المواد الكيميائية غير العضوية ذات التأثير على الصحة العامة', '16', 'شهريًا'],
                      ['المواد الكيميائية العضوية ذات التأثير على الصحة العامة', '82', 'كل ستة أشهر'],
                      ['المعايير البكتريولوجية', '3', 'يوميًا'],
                      ['المعايير البيولوجية', '2', 'يوميًا'],
                    ].map(([category, count, frequency], index) => (
                      <tr key={category} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f2f6fa]'}>
                        <th scope="row" className={`border-t border-slate-200 px-4 py-3 font-semibold leading-6 text-slate-800 ${isEnglish ? 'text-left' : 'text-right'}`}>{isEnglish ? [
                          'Physical properties',
                          'Inorganic substances affecting acceptability and domestic use',
                          'Inorganic chemicals affecting public health',
                          'Organic chemicals affecting public health',
                          'Bacteriological standards',
                          'Biological standards',
                        ][index] : category}</th>
                        <td className="border-t border-slate-200 px-4 py-3 font-bold text-[#0a3555]">{count}</td>
                        <td className="border-t border-slate-200 px-4 py-3">{isEnglish ? ({ 'يوميًا': 'Daily', 'شهريًا': 'Monthly', 'كل ستة أشهر': 'Every six months' } as Record<string, string>)[frequency] : frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={`mt-4 rounded-lg ${isEnglish ? 'border-l-4 text-left' : 'border-r-4 text-right'} border-[#d7b05a] bg-[#f7f9fb] px-4 py-3 font-semibold leading-7 text-slate-700`}>
                {t('تُعد خطة مراقبة نوعية المياه بمعرفة القائمين على إنتاج المياه بقطاع المعامل وضبط الجودة.', 'The water quality monitoring plan is prepared by water production teams in the Laboratory and Quality Control Sector.')}
              </p>
            </div>
          </ContentSection>

          <ContentSection title={t('تأهيل معامل الشركة والتحاليل', 'Laboratory qualification and analyses')}>
            <p className="mb-5 text-base leading-8 text-slate-700">
              {t('تم تجهيز وتأهيل معامل الشركة الرئيسية لتحليل العناصر ذات الدورية اليومية، وتشمل مجموعات التحاليل التالية:', 'The company’s main laboratories were equipped and qualified to analyze parameters with daily testing schedules. The test groups include:')}
            </p>
            <div className="grid gap-4 xl:grid-cols-3">
              {TEST_GROUPS.map((group) => (
                <div key={group.ar} className="overflow-hidden rounded-lg border border-slate-200">
                  <h3 className="min-h-16 bg-[#0a3555] px-4 py-3 text-center font-bold leading-6 text-white">{t(group.ar, group.en)}</h3>
                  <table className="w-full border-collapse text-center">
                    <tbody>
                      {group.rows.map((row, rowIndex) => (
                        <tr key={`${group.ar}-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f2f6fa]'}>
                          {row.map((item, cellIndex) => <td key={`${cellIndex}-${item}`} className="border-t border-slate-200 px-3 py-2.5 font-semibold text-slate-800">{item || '\u00a0'}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#d7b05a]/45 bg-[#fbf8ef] p-4">
                <p className="text-sm font-semibold text-slate-600">{t('عدد المعامل التي تم تأهيلها', 'Laboratories qualified')}</p>
                <p className="mt-1 text-2xl font-black text-[#0a3555]">11 {t('معملًا', 'laboratories')}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-[#f7f9fb] p-4">
                <p className="text-sm font-semibold text-slate-600">{t('الفترة الزمنية لأعمال التأهيل', 'Qualification period')}</p>
                <p className="mt-1 text-2xl font-black text-[#0a3555]">{t('ثلاث سنوات', 'Three years')}</p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title={t('توزيع نطاقات عمل المعامل', 'Laboratory service-area allocation')}>
            <p className="mb-5 text-base leading-8 text-slate-700">
              {t('إعادة توزيع نطاقات عمل المعامل للاستفادة من الحد الأقصى للمورد البشري والتجهيزات الفنية المتاحة.', 'Laboratory service areas are allocated to make the best use of available staff and technical equipment.')}
            </p>
            <div className="hidden lg:block"><LaboratoryRangeTable isEnglish={isEnglish} /></div>
            <div className="lg:hidden"><LaboratoryRangeTable compact isEnglish={isEnglish} /></div>
          </ContentSection>

          <ContentSection title={t('الإدارات التابعة لقطاع المعامل', 'Laboratory Sector Departments')}>
            <div
              aria-label={t('شرائح العرض التقديمي', 'Presentation slides')}
              className="scrollbar-none flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"
              role="tablist"
            >
              {DEPARTMENT_TABS.map((tab, index) => {
                const isActive = activeSlide === tab.slide;

                return (
                  <button
                    key={tab.slide}
                    ref={(element) => { departmentTabRefs.current[index] = element; }}
                    id={`laboratory-slide-tab-${tab.slide}`}
                    aria-controls="laboratory-slide-panel"
                    aria-selected={isActive}
                    className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1687a7] ${
                      isActive
                        ? 'bg-[#0a3555] text-white shadow-sm'
                        : 'bg-[#f2f6fa] text-[#0a3555] hover:bg-[#e5eef5]'
                    }`}
                    onClick={() => setActiveSlide(tab.slide)}
                    onKeyDown={(event) => handleDepartmentTabKeyDown(event, index)}
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    {t(tab.arTabTitle ?? tab.arTitle, tab.enTitle)}
                  </button>
                );
              })}
            </div>
            <div
              id="laboratory-slide-panel"
              aria-labelledby={`laboratory-slide-tab-${activeDepartment.slide}`}
              className="mt-5 rounded-lg border border-slate-200 bg-[#f7f9fb] p-5 sm:p-6"
              role="tabpanel"
              tabIndex={0}
            >
              <h3 className="text-lg font-extrabold leading-8 text-[#0a3555] sm:text-xl">
                {t(activeDepartment.arTitle, activeDepartment.enTitle)}
              </h3>
              {activeDepartment.arDetails.length > 0 && (
                <ul className="mt-4 grid gap-3 text-base leading-8 text-slate-700">
                  {(isEnglish ? activeDepartment.enDetails : activeDepartment.arDetails).map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#d7b05a]" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ContentSection>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LaboratoriesSectorPage;
