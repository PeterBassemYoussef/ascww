import PdfFlipbookPage from '../components/PdfFlipbookPage';

const industrialWasteRolePdfFileName = 'manufactring.pdf';
const industrialWasteRolePdfUrl = `${import.meta.env.BASE_URL}${industrialWasteRolePdfFileName}`;

function IndustrialWasteRolePage() {
  return (
    <PdfFlipbookPage
      downloadFileName={industrialWasteRolePdfFileName}
      loadingErrorMessage="تعذر تحميل ملف دور إدارة الصرف الصناعي. يمكنك استخدام زر تحميل PDF."
      pdfUrl={industrialWasteRolePdfUrl}
      title="دور إداره الصرف الصناعي"
      viewerKey="industrial-waste-role"
    />
  );
}

export default IndustrialWasteRolePage;
