import PdfFlipbookPage from '../components/PdfFlipbookPage';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const customerCharterPdfFileName = 'CustomerCharter-site.pdf';
const customerCharterPdfUrl = `${import.meta.env.BASE_URL}${customerCharterPdfFileName}`;

function CustomerCharterPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';

  return (
    <PdfFlipbookPage
      downloadFileName={customerCharterPdfFileName}
      loadingErrorMessage={
        isEnglish
          ? 'Unable to load the customer charter PDF. You can use the download PDF button.'
          : 'تعذر تحميل ملف ميثاق المتعاملين. يمكنك استخدام زر تحميل PDF.'
      }
      pdfUrl={customerCharterPdfUrl}
      title={isEnglish ? 'Customer Charter' : 'ميثاق المتعاملين'}
      viewerKey="customer-charter"
    />
  );
}

export default CustomerCharterPage;
