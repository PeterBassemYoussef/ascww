import PdfFlipbookPage from '../components/PdfFlipbookPage';

const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '/api' : 'https://backend.ascww.org/api');
const contractsPdfApiUrl = `${API_BASE_ENDPOINT}/tenders/download/standard-cnp-regulation`;
const contractsPdfFileName = 'standard-contracts-and-procurement-regulation.pdf';

function ContractsRegulationPage() {
  return (
    <PdfFlipbookPage
      downloadFileName={contractsPdfFileName}
      loadingErrorMessage="تعذر تحميل ملف اللائحة. يمكنك استخدام زر تحميل PDF."
      pdfUrl={contractsPdfApiUrl}
      title="اللائحة الموحدة للعقود والمشتريات"
      viewerKey="contracts-regulation"
    />
  );
}

export default ContractsRegulationPage;
