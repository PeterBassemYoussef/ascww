import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

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
  [ROUTES.industrialWasteRole]: 'دور إداره الصرف الصناعي',
  [ROUTES.customerCharter]: 'ميثاق المتعاملين',
  [ROUTES.newsArchive]: 'أرشيف الأخبار',
  '/projects': 'أرشيف المشروعات',
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
  [ROUTES.integritySupportOverview]: 'نبذه عن إداره دعم النزاهة',
  [ROUTES.integritySupportHighlights]: 'أبرز أعمال دعم النزاهة',
  [ROUTES.professionalConduct]: 'السلوك الوظيفي',
  [ROUTES.bossTrips]: 'جولات رئيس مجلس الإداره',
  [ROUTES.labOfCompany]: 'معامل الشركه',
  [ROUTES.wasteOfCompany]: 'محطات الصرف',
  [ROUTES.trainingOfCompany]: 'مركز التدريب',
  [ROUTES.informationTechnologyOfCompany]: 'قطاع تكنولوجيا المعلومات',
  [ROUTES.schoolSubmissionData]: 'المدرسه الفنيه',
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

const resolveTitle = (pathname: string) => {
  const exactTitle = routeTitles[pathname];
  if (exactTitle) return exactTitle;

  if (
    pathname.startsWith('/news/')
    || pathname.startsWith(`${ROUTES.newsArchive}/`)
    || pathname.startsWith('/news-company/')
  ) {
    return 'تفاصيل الخبر';
  }

  if (
    pathname.startsWith('/projects/')
    || pathname.startsWith(`${ROUTES.projectsArchive}/`)
    || pathname.startsWith('/projects-company/')
  ) {
    return 'تفاصيل المشروع';
  }

  if (
    pathname.startsWith('/tenders/')
    || pathname.startsWith(`${ROUTES.tendersArchive}/`)
    || pathname.startsWith('/allTenders/')
    || pathname.startsWith('/alltenders/')
  ) {
    return 'تفاصيل المناقصة';
  }

  return SITE_NAME;
};

const resolveDescription = (pathname: string, pageTitle: string) => {
  const exactDescription = routeDescriptions[pathname];
  if (exactDescription) return exactDescription;

  if (pathname.startsWith('/news/') || pathname.startsWith('/news-company/')) {
    return 'تفاصيل خبر من أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (pathname.startsWith('/projects/') || pathname.startsWith('/projects-company/')) {
    return 'تفاصيل مشروع ضمن مشروعات شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (
    pathname.startsWith('/tenders/')
    || pathname.startsWith('/allTenders/')
    || pathname.startsWith('/alltenders/')
  ) {
    return 'تفاصيل مناقصة ضمن أرشيف المناقصات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
  }

  if (!pageTitle || pageTitle === SITE_NAME) return DEFAULT_DESCRIPTION;
  return `${pageTitle} - ${SITE_NAME}.`;
};

function PageTitle() {
  const { pathname } = useLocation();
  const siteUrl = useMemo(
    () => normalizeSiteUrl(String(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL)),
    []
  );

  const normalizedPath = normalizePathname(pathname);
  const pageTitle = resolveTitle(normalizedPath);
  const fullTitle = pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} | ${SITE_NAME}`;
  const description = resolveDescription(normalizedPath, pageTitle);
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
      'https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw',
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


