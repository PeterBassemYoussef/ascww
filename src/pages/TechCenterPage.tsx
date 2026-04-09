import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { fetchGallerySources } from '../utils/gallery';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const toImageAlt = (index: number, isEnglish: boolean) => (
    isEnglish ? `Information Technology Center - ${index + 1}` : `مركز تكنولوجيا المعلومات - ${index + 1}`
);

type GalleryImage = { src: string; alt: string };

const fallbackImageSources = [
    '/images/tech_dep/149.jpg',
    '/images/tech_dep/150.jpg',
    '/images/tech_dep/151.jpg',
    '/images/tech_dep/152.jpg',
    '/images/tech_dep/153.jpg',
    '/images/tech_dep/154.jpg',
    '/images/tech_dep/155.jpg',
    '/images/tech_dep/156.jpg',
    '/images/tech_dep/157.jpg',
    '/images/tech_dep/158.jpg',
];

function TechCenterPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
        fallbackImageSources.map((src, index) => ({ src, alt: toImageAlt(index, isEnglish) }))
    );
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

    useEffect(() => {
        setGalleryImages((previous) => previous.map((image, index) => ({ ...image, alt: toImageAlt(index, isEnglish) })));
    }, [isEnglish]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadImages = async () => {
            try {
                const sources = await fetchGallerySources('tech_dep', controller.signal);
                if (sources.length === 0) return;

                const nextImages = sources.map((src, index) => ({
                    src,
                    alt: toImageAlt(index, isEnglish),
                }));

                if (isMounted) {
                    setGalleryImages(nextImages);
                }
            } catch {
                // Keep fallback list when the gallery API is unavailable.
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadImages();

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
                        <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                            <h1 className="text-2xl font-extrabold sm:text-3xl">{t('مركز تكنولوجيا المعلومات', 'Information Technology Center')}</h1>
                        </div>

                        <div className="px-4 py-6 sm:px-8 sm:py-8">
                            {isLoading ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    {t('جارٍ تحميل الصور...', 'Loading images...')}
                                </div>
                            ) : null}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {galleryImages.map((image) => (
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

export default TechCenterPage;
