import PdfFlipbookPage from '../components/PdfFlipbookPage';

const SERVICES_EVIDENCE_PDF_URL = '/ServicesEvidance.pdf';
const SERVICES_EVIDENCE_DOWNLOAD_NAME = 'services-evidance.pdf';

function ServicesEvidancePage() {
  return (
    <PdfFlipbookPage
      downloadFileName={SERVICES_EVIDENCE_DOWNLOAD_NAME}
      loadingErrorMessage="تعذر تحميل ملف دليل المستخدمين. يمكنك استخدام زر تحميل PDF."
      pdfUrl={SERVICES_EVIDENCE_PDF_URL}
      title="دليل المستخدمين"
      viewerKey="services-evidance"
    />
  );
}

export default ServicesEvidancePage;
