import PdfFlipbookPage from '../components/PdfFlipbookPage';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const industrialWasteRolePdfFileName = 'manufactring.pdf';
const industrialWasteRolePdfUrl = `${import.meta.env.BASE_URL}${industrialWasteRolePdfFileName}`;

function IndustrialWasteRolePage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

  return (
    <PdfFlipbookPage
      downloadFileName={industrialWasteRolePdfFileName}
      loadingErrorMessage={t('تعذر تحميل ملف دور إدارة الصرف الصناعي. يمكنك استخدام زر تحميل PDF.', 'Unable to load the industrial wastewater department role file. You can use the PDF download button.')}
      pdfUrl={industrialWasteRolePdfUrl}
      title={t('دور إداره الصرف الصناعي', 'Role of the Industrial Wastewater Department')}
      viewerKey="industrial-waste-role"
    />
  );
}

export default IndustrialWasteRolePage;
