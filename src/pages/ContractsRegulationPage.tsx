import PdfFlipbookPage from '../components/PdfFlipbookPage';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '/api' : 'https://backend.ascww.org/api');
const contractsPdfApiUrl = `${API_BASE_ENDPOINT}/tenders/download/standard-cnp-regulation`;
const contractsPdfFileName = 'standard-contracts-and-procurement-regulation.pdf';

function ContractsRegulationPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

  return (
    <PdfFlipbookPage
      downloadFileName={contractsPdfFileName}
      loadingErrorMessage={t('تعذر تحميل ملف اللائحة. يمكنك استخدام زر تحميل PDF.', 'Unable to load the regulations file. You can use the PDF download button.')}
      pdfUrl={contractsPdfApiUrl}
      title={t('اللائحة الموحدة للعقود والمشتريات', 'Unified Regulations for Contracts and Procurement')}
      viewerKey="contracts-regulation"
    />
  );
}

export default ContractsRegulationPage;
