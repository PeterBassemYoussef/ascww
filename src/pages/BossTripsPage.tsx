import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import GalleryLightbox, { type GalleryLightboxImage } from '../components/GalleryLightbox';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import { fetchGallerySources, resolveGalleryImageSrc } from '../utils/gallery';

const toImageAlt = (index: number, isEnglish: boolean) =>
  isEnglish ? `Chairman tours - ${index + 1}` : `جولات رئيس مجلس الإدارة - ${index + 1}`;

type GalleryImage = GalleryLightboxImage;

const fallbackImageSources = [
  resolveGalleryImageSrc('trip_boss', '111.webp'),
  resolveGalleryImageSrc('trip_boss', '112.webp'),
  resolveGalleryImageSrc('trip_boss', '113.webp'),
  resolveGalleryImageSrc('trip_boss', '114.webp'),
  resolveGalleryImageSrc('trip_boss', '115.webp'),
  resolveGalleryImageSrc('trip_boss', '116.webp'),
  resolveGalleryImageSrc('trip_boss', '117.webp'),
  resolveGalleryImageSrc('trip_boss', '118.jpg'),
];

const fallbackImages: GalleryImage[] = fallbackImageSources.map((src, index) => ({
  src,
  alt: toImageAlt(index, false),
}));

function BossTripsPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const [tripImages, setTripImages] = useState(fallbackImages);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setTripImages((previous) => previous.map((image, index) => ({ ...image, alt: toImageAlt(index, isEnglish) })));
  }, [isEnglish]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const sources = await fetchGallerySources('trip_boss', controller.signal);
        if (sources.length === 0) return;

        const nextImages = sources.map((src, index) => ({
          src,
          alt: toImageAlt(index, isEnglish),
        }));

        if (isMounted) {
          setTripImages(nextImages);
        }
      } catch (error) {
        // Keep fallback list when the gallery API is unavailable.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isEnglish]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_12%_8%,_rgba(17,112,176,0.12),_transparent_45%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t('جولات رئيس مجلس الإداره', 'Chairman Tours')}</h1>
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  {t('جارٍ تحميل الصور...', 'Loading images...')}
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tripImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={t(`تكبير ${image.alt}`, `Open ${image.alt}`)}
                    className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-56 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <GalleryLightbox
        images={tripImages}
        currentIndex={lightboxIndex}
        closeLabel={t('إغلاق', 'Close')}
        previousLabel={t('الصورة السابقة', 'Previous image')}
        nextLabel={t('الصورة التالية', 'Next image')}
        closeButtonSide={isEnglish ? 'left' : 'right'}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
      <Footer />
    </>
  );
}

export default BossTripsPage;
