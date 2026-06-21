import PdfFlipbookPage from '../components/PdfFlipbookPage';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const SERVICES_EVIDENCE_PDF_URL = '/ServicesEvidance.pdf';
const SERVICES_EVIDENCE_DOWNLOAD_NAME = 'services-evidance.pdf';

function ServicesEvidancePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';

  return (
    <PdfFlipbookPage
      downloadFileName={SERVICES_EVIDENCE_DOWNLOAD_NAME}
      loadingErrorMessage={
        isEnglish
          ? 'Unable to load the user guide PDF. You can use the download PDF button.'
          : 'تعذر تحميل ملف دليل المستخدمين. يمكنك استخدام زر تحميل PDF.'
      }
      pdfUrl={SERVICES_EVIDENCE_PDF_URL}
      title={isEnglish ? 'User Guide' : 'دليل المستخدمين'}
      viewerKey="services-evidance"
    />
  );
}

export default ServicesEvidancePage;
