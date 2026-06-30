import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const SITE_NAME = 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد';
const DEFAULT_DESCRIPTION = 'البوابة الإلكترونية الرسمية لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد: خدمات المياه، الصرف الصحي، التوعية، المناقصات، والتواصل مع المواطنين.';
const LOGO_PATH = '/images/ascww-logo.png';
const DEFAULT_SITE_URL = 'https://ascww.org';

const routeTitles: Record<string, string> = {
  [ROUTES.home]: SITE_NAME,
  [ROUTES.aboutCompany]: 'نبذه عن الشركة',
  [ROUTES.branches]: 'فروع الشركه',
  [ROUTES.visionAndMessage]: 'الرؤيه والرساله',
  [ROUTES.organizationStructure]: 'الهيكل التنظيمي',
  [ROUTES.contractsRegulation]: 'اللائحة الموحدة للعقود والمشتريات',
  [ROUTES.companyAchievements]: 'إنجازات الشركة',
  [ROUTES.adviceAndContact]: 'التوعية والأتصال',
  [ROUTES.cyberSecurityGuidelines]: 'ارشادات الامن السيبرانى',
  [ROUTES.forKidsAndWomen]: 'ركن الأطفال ولكِ سيدتي',
  '/forKids': 'ركن الأطفال ولكِ سيدتي',
  '/toWomen': 'ركن الأطفال ولكِ سيدتي',
  [ROUTES.waterQuality]: 'جودة المياه',
  [ROUTES.refiningWater]: 'تنقية مياه الشرب',
  [ROUTES.labOfCompanyWater]: 'المعمل المركزي لمياه الشرب',
  [ROUTES.sewageTreatment]: 'معالجه الصرف الصحي',
  [ROUTES.safeSewageDisposal]: 'أهمية التخلص الآمن من الصرف الصحى',
  [ROUTES.saveSewageNetwork]: 'أهمية الحفاظ على شبكة الصرف الصحى',
  [ROUTES.industrialWaste]: 'الصرف الصناعي',
  [ROUTES.industrialWasteRole]: 'دور إدارة الصرف الصناعي',
  [ROUTES.customerCharter]: 'ميثاق المتعاملين',
  [ROUTES.newsArchive]: 'أرشيف الأخبار',
  [ROUTES.projectsArchive]: 'أرشيف المشروعات',
  [ROUTES.tendersArchive]: 'المناقصات',
  [ROUTES.generalAdminTraining]: 'الإدارة العامة للتدريب',
  [ROUTES.jobsAndCompetition]: 'مسابقات و وظائف',
  [ROUTES.resultOfWorker]: 'نتائج المسابقات',
  [ROUTES.callCenter]: 'خدمه العملاء',
  [ROUTES.provideRequest]: 'الأسئلة الشائعة',
  [ROUTES.provideComplaine]: 'تقديم شكوي',
  [ROUTES.servicesEvidance]: 'دليل المستخدمين',
  [ROUTES.contractOnService]: 'رحلة المتعامل للتعاقد على طلب خدمة',
  [ROUTES.search]: 'نتائج البحث',
  [ROUTES.integritySupportOverview]: 'نبذه عن إدارة دعم النزاهة',
  [ROUTES.integritySupportHighlights]: 'أبرز أعمال دعم النزاهة',
  [ROUTES.professionalConduct]: 'السلوك الوظيفي',
  [ROUTES.bossTrips]: 'جولات رئيس مجلس الإدارة',
  [ROUTES.labOfCompany]: 'معامل الشركه',
  [ROUTES.wasteOfCompany]: 'محطات الصرف',
  [ROUTES.trainingOfCompany]: 'مركز التدريب',
  [ROUTES.informationTechnologyOfCompany]: 'إدارة تكنولوجيا المعلومات',
  [ROUTES.schoolSubmissionData]: 'المدرسة الفنية',
  [ROUTES.schoolGallery]: 'المدرسه الفنيه',
  [ROUTES.sportOfCompany]: 'النشاط الرياضي',
  '/enter-reading': 'إدخل قراءه عدادك',
  [ROUTES.hotlineApp]: 'تطبيق الخط الساخن',
  [ROUTES.myReadingApp]: 'تطبيق قرائتي',
  '/hotline125': 'تطبيق الخط الساخن',
  '/readme': 'تطبيق قرائتي',
  '/send-your-reader': 'استعلم عن فاتورتك',
  '/under-build': 'الخدمة قيد التطوير',
};

const routeDescriptions: Record<string, string> = {
  [ROUTES.home]: DEFAULT_DESCRIPTION,
  [ROUTES.newsArchive]: 'أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
  [ROUTES.projectsArchive]: 'أرشيف المشروعات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
  [ROUTES.tendersArchive]: 'أرشيف المناقصات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
  [ROUTES.aboutCompany]: 'نبذة عن الشركة ورسالتها وخدماتها للمواطنين في أسيوط والوادي الجديد.',
  [ROUTES.callCenter]: 'قنوات التواصل وخدمة العملاء لتلقي الشكاوى والاستفسارات وطلبات الدعم.',
  [ROUTES.customerCharter]: 'ميثاق المتعاملين وحقوق وواجبات العميل مع خدمات الشركة.',
  [ROUTES.search]: 'نتائج البحث في الموقع الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
};

const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  return pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

const normalizeSiteUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
};

const resolveTitle = (pathname: string, isEnglish: boolean) => {
  if (pathname === ROUTES.adviceAndContact) {
    return isEnglish ? 'Awareness and Communication' : 'التوعية والأتصال';
  }

  if (pathname === ROUTES.cyberSecurityGuidelines) {
    return isEnglish ? 'Cybersecurity Guidelines' : 'ارشادات الامن السيبرانى';
  }

  if (pathname === ROUTES.forKidsAndWomen || pathname === '/forKids' || pathname === '/toWomen') {
    return isEnglish ? 'Kids and Women Corner' : 'ركن الأطفال ولكِ سيدتي';
  }

  if (pathname === ROUTES.tendersArchive) {
    return isEnglish ? 'Tenders Archive' : 'المناقصات';
  }

  if (pathname === ROUTES.bossTrips) {
    return isEnglish ? 'Chairman Tours' : 'جولات رئيس مجلس الإدارة';
  }

  if (pathname === ROUTES.labOfCompany) {
    return isEnglish ? 'Company Laboratories' : 'معامل الشركه';
  }

  if (pathname === ROUTES.wasteOfCompany) {
    return isEnglish ? 'Wastewater Stations' : 'محطات الصرف';
  }

  if (pathname === ROUTES.trainingOfCompany) {
    return isEnglish ? 'Training Center' : 'مركز التدريب';
  }

  if (pathname === ROUTES.callCenter) {
    return isEnglish ? 'Customer Service' : 'خدمه العملاء';
  }

  if (pathname === ROUTES.hotlineApp || pathname === '/hotline125') {
    return isEnglish ? 'Hotline App' : 'تطبيق الخط الساخن';
  }

  if (pathname === ROUTES.myReadingApp || pathname === '/readme') {
    return isEnglish ? 'My Reading App' : 'تطبيق قرائتي';
  }

  if (pathname === ROUTES.customerCharter) {
    return isEnglish ? 'Customer Charter' : 'ميثاق المتعاملين';
  }

  if (pathname === ROUTES.servicesEvidance) {
    return isEnglish ? 'User Guide' : 'دليل المستخدمين';
  }

  if (pathname === ROUTES.contractOnService) {
    return isEnglish ? 'Customer Journey for Service Contract Requests' : 'رحلة المتعامل للتعاقد على طلب خدمة';
  }

  if (pathname === ROUTES.provideRequest) {
    return isEnglish ? 'Frequently Asked Questions' : 'الأسئلة الشائعة';
  }

  if (pathname === ROUTES.provideComplaine) {
    return isEnglish ? 'Submit a Complaint' : 'تقديم شكوي';
  }

  if (pathname === ROUTES.search) {
    return isEnglish ? 'Search Results' : 'نتائج البحث';
  }

  if (pathname === ROUTES.jobsAndCompetition) {
    return isEnglish ? 'Competitions and Jobs' : 'مسابقات و وظائف';
  }

  if (pathname === ROUTES.resultOfWorker) {
    return isEnglish ? 'Competition Results' : 'نتائج المسابقات';
  }

  if (pathname === ROUTES.schoolSubmissionData) {
    return isEnglish ? 'Technical School' : 'المدرسة الفنية';
  }

  if (pathname === ROUTES.schoolGallery) {
    return isEnglish ? 'Technical School' : 'المدرسه الفنيه';
  }

  if (pathname === ROUTES.sportOfCompany) {
    return isEnglish ? 'Sports Activity' : 'النشاط الرياضي';
  }

  if (pathname === ROUTES.integritySupportOverview) {
    return isEnglish ? 'Integrity Support Overview' : 'نبذه عن إدارة دعم النزاهة';
  }

  if (pathname === ROUTES.integritySupportHighlights) {
    return isEnglish ? 'Integrity Support Highlights' : 'أبرز أعمال دعم النزاهة';
  }

  if (pathname === ROUTES.professionalConduct) {
    return isEnglish ? 'Professional Conduct' : 'السلوك الوظيفي';
  }

  const exactTitle = routeTitles[pathname];
  if (exactTitle) return exactTitle;

  if (
    pathname.startsWith('/news/')
    || pathname.startsWith(`${ROUTES.newsArchive}/`)
    || pathname.startsWith('/news-company/')
  ) {
    return isEnglish ? 'News Details' : 'تفاصيل الخبر';
  }

  if (
    pathname.startsWith('/projects/')
    || pathname.startsWith(`${ROUTES.projectsArchive}/`)
    || pathname.startsWith('/projects-company/')
  ) {
    return isEnglish ? 'Project Details' : 'تفاصيل المشروع';
  }

  if (
    pathname.startsWith('/tenders/')
    || pathname.startsWith(`${ROUTES.tendersArchive}/`)
    || pathname.startsWith('/allTenders/')
    || pathname.startsWith('/alltenders/')
  ) {
    return isEnglish ? 'Tender Details' : 'تفاصيل المناقصة';
  }

  return SITE_NAME;
};

const resolveDescription = (pathname: string, pageTitle: string, isEnglish: boolean) => {
  if (pathname === ROUTES.adviceAndContact) {
    return isEnglish
      ? 'Awareness and communication content about water conservation and responsible use.'
      : 'محتوى توعوي واتصالي حول ترشيد المياه والاستخدام الرشيد لها.';
  }

  if (pathname === ROUTES.cyberSecurityGuidelines) {
    return isEnglish
      ? 'Cybersecurity guidelines and awareness content to protect users and data.'
      : 'إرشادات الأمن السيبراني ومحتوى توعوي لحماية المستخدمين والبيانات.';
  }

  if (pathname === ROUTES.forKidsAndWomen || pathname === '/forKids' || pathname === '/toWomen') {
    return isEnglish
      ? 'Awareness content for children and women about conserving water and using services correctly.'
      : 'محتوى توعوي للأطفال والسيدات حول ترشيد المياه والاستخدام الصحيح للخدمات.';
  }

  if (pathname === ROUTES.callCenter) {
    return isEnglish
      ? 'Customer service channels and centers for support, inquiries, and service requests.'
      : 'قنوات ومراكز خدمة العملاء للدعم والاستفسارات وطلبات الخدمة.';
  }

  if (pathname === ROUTES.hotlineApp || pathname === '/hotline125') {
    return isEnglish
      ? 'Information about the HCWW 125 hotline app for complaints and digital services.'
      : 'معلومات عن تطبيق الخط الساخن HCWW 125 للشكاوى والخدمات الرقمية.';
  }

  if (pathname === ROUTES.myReadingApp || pathname === '/readme') {
    return isEnglish
      ? 'Information about the My Reading app for submitting water meter readings.'
      : 'معلومات عن تطبيق قراءتي لتسجيل قراءات عدادات المياه.';
  }

  if (pathname === ROUTES.customerCharter) {
    return isEnglish
      ? 'Customer charter, rights, and responsibilities for the company services.'
      : 'ميثاق المتعاملين وحقوق وواجبات العملاء في خدمات الشركة.';
  }

  if (pathname === ROUTES.servicesEvidance) {
    return isEnglish
      ? 'User guide for company services and related procedures.'
      : 'دليل المستخدمين لخدمات الشركة والإجراءات المرتبطة بها.';
  }

  if (pathname === ROUTES.contractOnService) {
    return isEnglish
      ? 'A step-by-step customer journey for contracting a service request.'
      : 'رحلة المتعامل خطوة بخطوة للتعاقد على طلب خدمة.';
  }

  if (pathname === ROUTES.provideRequest) {
    return isEnglish
      ? 'Frequently asked questions and requirements for service requests.'
      : 'الأسئلة الشائعة والمتطلبات الخاصة بطلبات الخدمات.';
  }

  if (pathname === ROUTES.provideComplaine) {
    return isEnglish
      ? 'Submit a complaint and access quick communication channels.'
      : 'تقديم شكوى والوصول إلى قنوات التواصل السريعة.';
  }

  if (pathname === ROUTES.search) {
    return isEnglish
      ? 'Search results across the official website of Assiut and New Valley Water and Wastewater Company.'
      : 'نتائج البحث في الموقع الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.jobsAndCompetition) {
    return isEnglish
      ? 'Follow the latest company job announcements and competition postings.'
      : 'تابع أحدث إعلانات الوظائف والمسابقات الخاصة بالشركة.';
  }

  if (pathname === ROUTES.resultOfWorker) {
    return isEnglish
      ? 'Browse the latest competition results and job-announcement updates.'
      : 'استعرض أحدث نتائج المسابقات والتحديثات الخاصة بإعلانات الوظائف.';
  }

  if (pathname === ROUTES.tendersArchive) {
    return isEnglish
      ? 'Official tenders archive of Assiut and New Valley Water and Wastewater Company.'
      : 'أرشيف المناقصات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.bossTrips) {
    return isEnglish
      ? 'Photo gallery of the Chairman tours at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور جولات رئيس مجلس الإدارة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.labOfCompany) {
    return isEnglish
      ? 'Photo gallery of company laboratories at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور معامل الشركة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.wasteOfCompany) {
    return isEnglish
      ? 'Photo gallery of wastewater stations at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور محطات الصرف بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.trainingOfCompany) {
    return isEnglish
      ? 'Photo gallery of the training center at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور مركز التدريب بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.schoolGallery) {
    return isEnglish
      ? 'Photo gallery of the technical school at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور المدرسة الفنية بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.sportOfCompany) {
    return isEnglish
      ? 'Photo gallery of sports activity at Assiut and New Valley Water and Wastewater Company.'
      : 'معرض صور النشاط الرياضي بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.integritySupportOverview) {
    return isEnglish
      ? 'Overview of the Integrity Support Department at Assiut and New Valley Water and Wastewater Company.'
      : 'نبذة عن إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.integritySupportHighlights) {
    return isEnglish
      ? 'Highlights of the Integrity Support Department at Assiut and New Valley Water and Wastewater Company.'
      : 'أبرز أعمال إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname === ROUTES.professionalConduct) {
    return isEnglish
      ? 'Professional conduct guide at Assiut and New Valley Water and Wastewater Company.'
      : 'دليل السلوك الوظيفي بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  const exactDescription = routeDescriptions[pathname];
  if (exactDescription) return exactDescription;

  if (pathname.startsWith('/news/') || pathname.startsWith('/news-company/')) {
    return isEnglish
      ? 'Details of a news item from the official news archive of Assiut and New Valley Water and Wastewater Company.'
      : 'تفاصيل خبر من أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname.startsWith('/projects/') || pathname.startsWith('/projects-company/')) {
    return isEnglish
      ? 'Details of a project from the projects archive of Assiut and New Valley Water and Wastewater Company.'
      : 'تفاصيل مشروع ضمن مشروعات شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (
    pathname.startsWith('/tenders/')
    || pathname.startsWith('/allTenders/')
    || pathname.startsWith('/alltenders/')
  ) {
    return isEnglish
      ? 'Details of a tender from the official tenders archive of Assiut and New Valley Water and Wastewater Company.'
      : 'تفاصيل مناقصة ضمن أرشيف المناقصات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (!pageTitle || pageTitle === SITE_NAME) return DEFAULT_DESCRIPTION;
  return `${pageTitle} - ${SITE_NAME}.`;
};

function PageTitle() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const { pathname } = useLocation();
  const siteUrl = useMemo(
    () => normalizeSiteUrl(String(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL)),
    []
  );

  const normalizedPath = normalizePathname(pathname);
  const pageTitle = resolveTitle(normalizedPath, isEnglish);
  const fullTitle = pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} | ${SITE_NAME}`;
  const description = resolveDescription(normalizedPath, pageTitle, isEnglish);
  const canonicalUrl = `${siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;
  const imageUrl = `${siteUrl}${LOGO_PATH}`;
  const isDetailPage =
    normalizedPath.startsWith('/news/')
    || normalizedPath.startsWith('/news-company/')
    || normalizedPath.startsWith('/projects/')
    || normalizedPath.startsWith('/projects-company/')
    || normalizedPath.startsWith('/tenders/')
    || normalizedPath.startsWith('/allTenders/')
    || normalizedPath.startsWith('/alltenders/');
  const ogType = isDetailPage ? 'article' : 'website';
  const twitterCard = isDetailPage ? 'summary_large_image' : 'summary';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    inLanguage: 'ar-EG',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: `${siteUrl}${LOGO_PATH}`,
    email: 'media-water@ascww.com.eg',
    telephone: '2331604',
    sameAs: [
      'https://www.facebook.com/ASCWWeg',
      'https://api.whatsapp.com/send?phone=01280733990',
      'https://www.youtube.com/@waterassiutguide',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'أسيوط',
      addressCountry: 'EG',
    },
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: fullTitle,
    description,
    inLanguage: 'ar-EG',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
  };

  const websiteSchemaJson = JSON.stringify(websiteSchema).replace(/</g, '\\u003c');
  const organizationSchemaJson = JSON.stringify(organizationSchema).replace(/</g, '\\u003c');
  const webpageSchemaJson = JSON.stringify(webpageSchema).replace(/</g, '\\u003c');

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:url" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="328" />
      <meta property="og:image:alt" content="شعار شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:src" content={imageUrl} />
      <meta name="twitter:image:alt" content="شعار شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد" />

      <script type="application/ld+json">{websiteSchemaJson}</script>
      <script type="application/ld+json">{organizationSchemaJson}</script>
      <script type="application/ld+json">{webpageSchemaJson}</script>
    </Helmet>
  );
}

export default PageTitle;
