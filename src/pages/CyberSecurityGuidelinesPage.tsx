import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const IMAGE_URL = '/images/safety-guidelines/Safety%20guidelines.webp';

function CyberSecurityGuidelinesPage() {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = (image: { src: string; alt: string }) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                التوعية والاتصال
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">ارشادات الامن السيبرانى</h1>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="mx-auto flex flex-col gap-6 sm:max-w-5xl md:flex-row md:items-start" dir="ltr">
                <figure className="mx-auto w-full max-w-[32rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:mx-0 md:w-[44%]">
                  <img
                    src={IMAGE_URL}
                    alt="إرشادات الأمن السيبراني"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-contain"
                  />
                </figure>
                <div className="min-w-0 flex-1 space-y-4 text-base leading-8 text-slate-700 text-justify break-words" dir="rtl">
                  <h2 className="text-lg font-extrabold text-[#0a3555]">دليل سياسات وإرشادات الأمن السيبراني</h2>
                  <p>
                    يُعد الأمن السيبراني عنصرًا أساسيًا لحماية البيانات والمعلومات من الاختراق والتهديدات الرقمية المتزايدة.
                  </p>
                  <p>
                    اتباع الإرشادات الصحيحة مثل استخدام كلمات مرور قوية وتحديث الأنظمة بشكل مستمر يساهم في تقليل المخاطر.
                  </p>
                  <p>
                    كما يساعد الوعي الأمني وتجنب الروابط المشبوهة في حماية المستخدمين من الهجمات الإلكترونية.
                  </p>
                  <p>
                    الالتزام بسياسات الأمن السيبراني يعزز الثقة ويضمن بيئة رقمية آمنة ومستقرة للجميع.
                  </p>
                </div>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <figure className="space-y-8">
                  <figcaption className="text-sm font-bold text-[#0a3555]">ارشادات رقم 1</figcaption>
                  <img
                    src="/images/safety-guidelines/1.webp"
                    alt="إرشادات الأمن السيبراني - 1"
                    loading="lazy"
                    decoding="async"
                    onClick={() =>
                      openLightbox({
                        src: '/images/safety-guidelines/1.webp',
                        alt: 'إرشادات الأمن السيبراني - 1',
                      })
                    }
                    className="w-full cursor-zoom-in rounded-2xl object-contain"
                    style={{ maxHeight: 'min(60vh, 520px)' }}
                  />
                </figure>
                <figure className="space-y-8">
                  <figcaption className="text-sm font-bold text-[#0a3555]">ارشادات رقم 2</figcaption>
                  <img
                    src="/images/safety-guidelines/2.webp"
                    alt="إرشادات الأمن السيبراني - 2"
                    loading="lazy"
                    decoding="async"
                    onClick={() =>
                      openLightbox({
                        src: '/images/safety-guidelines/2.webp',
                        alt: 'إرشادات الأمن السيبراني - 2',
                      })
                    }
                    className="w-full cursor-zoom-in rounded-2xl object-contain"
                    style={{ maxHeight: 'min(60vh, 520px)' }}
                  />
                </figure>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-auto bg-slate-950/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xl font-bold text-white transition hover:bg-white/20"
            aria-label="إغلاق الصورة المكبرة"
          >
            ×
          </button>

          <figure className="my-6 w-full max-w-[95vw]" onClick={(event) => event.stopPropagation()}>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              loading="lazy"
              decoding="async"
              className="w-full rounded-xl object-contain"
              style={{ maxHeight: '85vh' }}
            />
          </figure>
        </div>
      )}
    </>
  );
}

export default CyberSecurityGuidelinesPage;
