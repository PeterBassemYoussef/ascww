import { useEffect, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import './LaboratoriesSectorCentralLab.css';

const documents = [
  {
    id: 1,
    ar: 'نبذة المعمل المركزي لمياه الشرب',
    en: 'Central Drinking Water Laboratory Overview',
  },
  {
    id: 2,
    ar: 'معمل سحب وتكويد العينات',
    en: 'Sample Collection and Coding Laboratory',
  },
  {
    id: 3,
    ar: 'المعمل العضوي',
    en: 'Organic Laboratory',
  },
  {
    id: 4,
    ar: 'أجهزة المعمل العضوي',
    en: 'Organic Laboratory Equipment',
  },
  {
    id: 5,
    ar: 'معمل غير العضوي',
    en: 'Inorganic Laboratory',
  },
  {
    id: 6,
    ar: 'المعمل البكتريولوجي',
    en: 'Bacteriology Laboratory',
  },
  {
    id: 7,
    ar: 'المعمل البيولوجي',
    en: 'Biology Laboratory',
  },
  {
    id: 8,
    ar: 'إدارة الجودة',
    en: 'Quality Management',
  },
];

function LaboratoriesSectorCentralLabPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const [documentHtml, setDocumentHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const requestedDocumentId = Number(searchParams.get('document'));
  const selectedDocument = documents.find((document) => document.id === requestedDocumentId) ?? documents[0];
  const selectedTitle = isEnglish ? selectedDocument.en : selectedDocument.ar;

  useEffect(() => {
    const controller = new AbortController();

    const loadDocument = async () => {
      setIsLoading(true);
      setLoadError('');
      setDocumentHtml('');

      try {
        const response = await fetch(`/central-lab/${selectedDocument.id}.html`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Document request failed with status ${response.status}`);
        }

        const html = await response.text();
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        const content = parsedDocument.querySelector('.document-content');
        if (!content) {
          throw new Error(`Document ${selectedDocument.id} has no rendered content`);
        }
        setDocumentHtml(content.innerHTML);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setLoadError(
          isEnglish
            ? 'Unable to load this document. Please try again later.'
            : 'تعذر تحميل هذا الملف. يرجى المحاولة مرة أخرى لاحقًا.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadDocument();
    return () => controller.abort();
  }, [selectedDocument.id, isEnglish]);

  const selectDocument = (documentId: number) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set('document', String(documentId));
      return nextParams;
    });
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const previousKey = isEnglish ? 'ArrowLeft' : 'ArrowRight';
    const nextKey = isEnglish ? 'ArrowRight' : 'ArrowLeft';
    let nextIndex = currentIndex;

    if (event.key === previousKey) nextIndex = (currentIndex - 1 + documents.length) % documents.length;
    else if (event.key === nextKey) nextIndex = (currentIndex + 1) % documents.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = documents.length - 1;
    else return;

    event.preventDefault();
    selectDocument(documents[nextIndex].id);
    document.getElementById(`central-lab-tab-${documents[nextIndex].id}`)?.focus();
  };

  return (
    <>
      <Header />
      <main
        className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]"
        dir={isEnglish ? 'ltr' : 'rtl'}
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <header className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
              <h1 className={`text-3xl font-black leading-tight sm:text-4xl ${isEnglish ? 'text-left' : 'text-right'}`}>
                {isEnglish ? 'Central Laboratory' : 'المعمل المركزي'}
              </h1>
              <p className={`mt-3 text-sm leading-7 text-slate-600 ${isEnglish ? 'text-left' : 'text-right'}`}>
                {isEnglish
                  ? 'Browse the eight central laboratory documents in order. The source content is displayed in Arabic.'
                  : 'تصفح ملفات المعمل المركزي الثمانية بالترتيب، مع الحفاظ على محتوى الملفات الأصلي.'}
              </p>
            </header>

            <div className="space-y-5 px-4 py-6 sm:px-8 sm:py-8">
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label={isEnglish ? 'Central laboratory documents' : 'ملفات المعمل المركزي'}
              >
                {documents.map((document, index) => {
                  const isSelected = document.id === selectedDocument.id;
                  return (
                    <button
                      key={document.id}
                      type="button"
                      role="tab"
                      id={`central-lab-tab-${document.id}`}
                      aria-selected={isSelected}
                      aria-controls="central-lab-document-panel"
                      onClick={() => selectDocument(document.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                        isSelected
                          ? 'border-[#0a3555] bg-[#0a3555] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-[#0a3555] hover:border-[#0a3555]/50 hover:bg-slate-50'
                      }`}
                    >
                      <span className="me-1.5">{document.id}.</span>
                      {isEnglish ? document.en : document.ar}
                    </button>
                  );
                })}
              </div>

              <section
                id="central-lab-document-panel"
                role="tabpanel"
                aria-labelledby={`central-lab-tab-${selectedDocument.id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {isLoading ? (
                  <p className="p-8 text-center text-sm font-semibold text-slate-500" role="status">
                    {isEnglish ? 'Loading document...' : 'جارٍ تحميل الصفحة...'}
                  </p>
                ) : loadError ? (
                  <p className="p-8 text-center text-sm font-semibold text-red-700" role="alert">
                    {loadError}
                  </p>
                ) : (
                  <div
                    className="central-lab-document"
                    aria-label={selectedTitle}
                    dangerouslySetInnerHTML={{ __html: documentHtml }}
                  />
                )}
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LaboratoriesSectorCentralLabPage;
