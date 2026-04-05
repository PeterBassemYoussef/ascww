import PdfFlipbookPage from '../components/PdfFlipbookPage';

const customerCharterPdfFileName = 'CustomerCharter-site.pdf';
const customerCharterPdfUrl = `${import.meta.env.BASE_URL}${customerCharterPdfFileName}`;

function CustomerCharterPage() {
  return (
    <PdfFlipbookPage
      downloadFileName={customerCharterPdfFileName}
      loadingErrorMessage="تعذر تحميل ملف ميثاق المتعاملين. يمكنك استخدام زر تحميل PDF."
      pdfUrl={customerCharterPdfUrl}
      title="ميثاق المتعاملين"
      viewerKey="customer-charter"
    />
  );
}

export default CustomerCharterPage;
