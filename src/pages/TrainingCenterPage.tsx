import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { fetchGallerySources } from '../utils/gallery';

const toImageAlt = (index: number) => `مركز التدريب - ${index + 1}`;

type GalleryImage = { src: string; alt: string };

const fallbackImageSources = [
  '/images/traning_dep/131.webp',
  '/images/traning_dep/132.webp',
  '/images/traning_dep/133.webp',
  '/images/traning_dep/134.webp',
  '/images/traning_dep/135.webp',
  '/images/traning_dep/136.webp',
  '/images/traning_dep/137.webp',
  '/images/traning_dep/138.webp',
];

const fallbackImages: GalleryImage[] = fallbackImageSources.map((src, index) => ({
  src,
  alt: toImageAlt(index),
}));

function TrainingCenterPage() {
  const [galleryImages, setGalleryImages] = useState(fallbackImages);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const sources = await fetchGallerySources('traning_dep', controller.signal);
        if (sources.length === 0) return;

        const nextImages = sources.map((src, index) => ({
          src,
          alt: toImageAlt(index),
        }));

        if (isMounted) {
          setGalleryImages(nextImages);
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
  }, []);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_12%_8%,_rgba(17,112,176,0.12),_transparent_45%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">مركز التدريب</h1>
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  جارٍ تحميل الصور...
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`تكبير ${image.alt}`}
                    className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    onClick={() => setLightboxImage(image)}
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
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[95vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="إغلاق الصورة"
              className="absolute -top-3 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow transition hover:bg-white"
              onClick={() => setLightboxImage(null)}
            >
              إغلاق
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

export default TrainingCenterPage;
