import PdfFlipbookPage from '../components/PdfFlipbookPage';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const professionalConductPdfFileName = 'Code of Professional Conduct.pdf';
const professionalConductPdfUrl = `${import.meta.env.BASE_URL}${encodeURIComponent(professionalConductPdfFileName)}`;

function ProfessionalConductPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  return (
    <PdfFlipbookPage
      downloadFileName={professionalConductPdfFileName}
      loadingErrorMessage={t('تعذر تحميل ملف السلوك الوظيفي. يمكنك استخدام زر تحميل PDF.', 'Unable to load the professional conduct file. You can use the PDF download button.')}
      pdfUrl={professionalConductPdfUrl}
      title={t('السلوك الوظيفي', 'Professional Conduct')}
      viewerKey="professional-conduct"
    />
  );
}

export default ProfessionalConductPage;
