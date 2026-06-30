import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const IMAGE_URL = '/images/safety-guidelines/Safety-guidelines.webp';

function CyberSecurityGuidelinesPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const contentOrderClass = 'md:order-1';
  const figureOrderClass = 'md:order-2';
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
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <div className="hidden">
                {t('التوعية والاتصال', 'Awareness and Communication')}
              </div>
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t('ارشادات الامن السيبرانى', 'Cybersecurity Guidelines')}</h1>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="mx-auto flex flex-col gap-6 sm:max-w-5xl md:flex-row md:items-start">
                <div className={`min-w-0 flex-1 space-y-4 break-words text-base leading-8 text-slate-700 ${textAlignmentClass} ${contentOrderClass}`}>
                  <h2 className="text-lg font-extrabold text-[#0a3555]">{t('دليل سياسات وإرشادات الأمن السيبراني', 'Cybersecurity Policies and Guidelines Guide')}</h2>
                  <p>
                    {t(
                      'يُعد الأمن السيبراني عنصرًا أساسيًا لحماية البيانات والمعلومات من الاختراق والتهديدات الرقمية المتزايدة.',
                      'Cybersecurity is an essential element in protecting data and information from breaches and growing digital threats.'
                    )}
                  </p>
                  <p>
                    {t(
                      'اتباع الإرشادات الصحيحة مثل استخدام كلمات مرور قوية وتحديث الأنظمة بشكل مستمر يساهم في تقليل المخاطر.',
                      'Following proper guidance such as using strong passwords and continuously updating systems helps reduce risks.'
                    )}
                  </p>
                  <p>
                    {t(
                      'كما يساعد الوعي الأمني وتجنب الروابط المشبوهة في حماية المستخدمين من الهجمات الإلكترونية.',
                      'Security awareness and avoiding suspicious links also help protect users from cyberattacks.'
                    )}
                  </p>
                  <p>
                    {t(
                      'الالتزام بسياسات الأمن السيبراني يعزز الثقة ويضمن بيئة رقمية آمنة ومستقرة للجميع.',
                      'Compliance with cybersecurity policies strengthens trust and ensures a safe and stable digital environment for everyone.'
                    )}
                  </p>
                </div>
                <figure className={`mx-auto w-full max-w-[32rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:mx-0 md:w-[44%] ${figureOrderClass}`}>
                  <img
                    src={IMAGE_URL}
                    alt={t('إرشادات الأمن السيبراني', 'Cybersecurity guidelines')}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-contain"
                  />
                </figure>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <figure className={`space-y-8 ${textAlignmentClass}`}>
                  <figcaption className="text-sm font-bold text-[#0a3555]">{t('ارشادات رقم 1', 'Guideline No. 1')}</figcaption>
                  <img
                    src="/images/safety-guidelines/1.webp"
                    alt={t('إرشادات الأمن السيبراني - 1', 'Cybersecurity guidelines - 1')}
                    loading="lazy"
                    decoding="async"
                    onClick={() =>
                      openLightbox({
                        src: '/images/safety-guidelines/1.webp',
                        alt: t('إرشادات الأمن السيبراني - 1', 'Cybersecurity guidelines - 1'),
                      })
                    }
                    className="w-full cursor-zoom-in rounded-2xl object-contain"
                    style={{ maxHeight: 'min(60vh, 520px)' }}
                  />
                </figure>
                <figure className={`space-y-8 ${textAlignmentClass}`}>
                  <figcaption className="text-sm font-bold text-[#0a3555]">{t('ارشادات رقم 2', 'Guideline No. 2')}</figcaption>
                  <img
                    src="/images/safety-guidelines/2.webp"
                    alt={t('إرشادات الأمن السيبراني - 2', 'Cybersecurity guidelines - 2')}
                    loading="lazy"
                    decoding="async"
                    onClick={() =>
                      openLightbox({
                        src: '/images/safety-guidelines/2.webp',
                        alt: t('إرشادات الأمن السيبراني - 2', 'Cybersecurity guidelines - 2'),
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
            aria-label={t('إغلاق الصورة المكبرة', 'Close enlarged image')}
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
