import PdfFlipbookPage from '../components/PdfFlipbookPage';

const professionalConductPdfFileName = 'Code of Professional Conduct.pdf';
const professionalConductPdfUrl = `${import.meta.env.BASE_URL}${encodeURIComponent(professionalConductPdfFileName)}`;

function ProfessionalConductPage() {
  return (
    <PdfFlipbookPage
      downloadFileName={professionalConductPdfFileName}
      loadingErrorMessage="تعذر تحميل ملف السلوك الوظيفي. يمكنك استخدام زر تحميل PDF."
      pdfUrl={professionalConductPdfUrl}
      title="السلوك الوظيفي"
      viewerKey="professional-conduct"
    />
  );
}

export default ProfessionalConductPage;
