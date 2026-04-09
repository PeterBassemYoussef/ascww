import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

function IntegritySupportHighlightsPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const workshopImages = [
    { src: '/images/nabza-an-elnazaha/72.webp', alt: t('ورشة عمل 1', 'Workshop 1') },
    { src: '/images/nabza-an-elnazaha/73.webp', alt: t('ورشة عمل 2', 'Workshop 2') },
    { src: '/images/nabza-an-elnazaha/74.webp', alt: t('ورشة عمل 3', 'Workshop 3') },
    { src: '/images/nabza-an-elnazaha/75.webp', alt: t('ورشة عمل 4', 'Workshop 4') },
    { src: '/images/nabza-an-elnazaha/76.webp', alt: t('ورشة عمل 5', 'Workshop 5') },
    { src: '/images/nabza-an-elnazaha/77.webp', alt: t('ورشة عمل 6', 'Workshop 6') },
  ];

  return (
    <>
      <Header />
      <main className="bg-white py-6" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className={`mb-8 overflow-hidden rounded-3xl px-6 py-8 text-white shadow-[0_18px_40px_rgba(2,6,23,0.15)] ${headerGradientClass}`}>
            <div className={textAlignmentClass}>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {t('أبرز أعمال دعم النزاهة', 'Key Integrity Support Activities')}
              </h1>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
                {t('عرض ملفات الإنجازات ومبادى ادارة دعم النزاهة.', 'Presentation of achievement files and the principles of the Integrity Support Department.')}
              </p>
            </div>
          </div>

          <section className={`space-y-8 text-slate-700 ${textAlignmentClass}`}>
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">
                {t('انجازات ادارة دعم النزاهة', 'Integrity Support Department Achievements')}
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  title={t('إنجازات إدارة دعم النزاهة', 'Integrity Support Department achievements')}
                  src="/achivement_daam_elnzaha.pdf"
                  className="h-[85vh] w-full bg-white"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">
                {t('مبادى ادارة دعم النزاهة', 'Principles of the Integrity Support Department')}
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  title={t('مبادئ إدارة دعم النزاهة', 'Integrity Support Department principles')}
                  src="/daamElnazaha.pdf"
                  className="h-[85vh] w-full bg-white"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">
                {t('صور ورش العمل تطبيق الدليل التجارى الموحد', 'Workshop Photos for Implementing the Unified Commercial Guide')}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {workshopImages.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={t(`تكبير ${image.alt}`, `Open ${image.alt}`)}
                    className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    onClick={() => setLightboxImage(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-48 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[95vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t('إغلاق الصورة', 'Close image')}
              className="absolute -top-3 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow transition hover:bg-white"
              onClick={() => setLightboxImage(null)}
            >
              {t('إغلاق', 'Close')}
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              loading="lazy"
              className="max-h-[90vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default IntegritySupportHighlightsPage;
