import { useCallback, useEffect, useRef, useState } from 'react';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = { ar: string; en: string };
type TrainingSlide = { src: string; alt: LocalizedText };

const trainingSlides: TrainingSlide[] = [
  { src: '/images/training/47.webp', alt: { ar: 'قاعة التدريب رقم 1', en: 'Training hall 1' } },
  { src: '/images/training/48.webp', alt: { ar: 'قاعة التدريب رقم 2', en: 'Training hall 2' } },
  { src: '/images/training/49.webp', alt: { ar: 'قاعة التدريب رقم 3', en: 'Training hall 3' } },
  { src: '/images/training/50.webp', alt: { ar: 'قاعة التدريب رقم 4', en: 'Training hall 4' } },
];

const SLIDE_INTERVAL_MS = 4000;

function TrainingSlider() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = useCallback((text: LocalizedText) => (isEnglish ? text.en : text.ar), [isEnglish]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<number | null>(null);
  const activeSlideItem = trainingSlides[activeSlide];

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (trainingSlides.length <= 1) return;
    stopAutoplay();
    autoplayRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % trainingSlides.length);
    }, SLIDE_INTERVAL_MS);
  }, [stopAutoplay]);

  const goToSlide = useCallback((index: number) => {
    const total = trainingSlides.length;
    setActiveSlide((index + total) % total);
    if (!isPaused) startAutoplay();
  }, [isPaused, startAutoplay]);

  useEffect(() => {
    if (isPaused) {
      stopAutoplay();
      return undefined;
    }

    startAutoplay();
    return () => stopAutoplay();
  }, [isPaused, startAutoplay, stopAutoplay]);

  return (
    <section
      className="relative h-[260px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 sm:h-[360px] lg:h-[460px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        role="img"
        aria-label={activeSlideItem ? t(activeSlideItem.alt) : t({ ar: 'قاعة التدريب', en: 'Training hall' })}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: activeSlideItem?.src ? `url(${activeSlideItem.src})` : undefined }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent" />

      <button type="button" onClick={() => goToSlide(activeSlide - 1)} aria-label={t({ ar: 'الصورة السابقة', en: 'Previous image' })} className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white backdrop-blur transition hover:bg-white/30 sm:inline-flex">
        {isEnglish ? '‹' : '›'}
      </button>
      <button type="button" onClick={() => goToSlide(activeSlide + 1)} aria-label={t({ ar: 'الصورة التالية', en: 'Next image' })} className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white backdrop-blur transition hover:bg-white/30 sm:inline-flex">
        {isEnglish ? '›' : '‹'}
      </button>

      <div className={`absolute bottom-4 z-10 flex items-center gap-2 ${isEnglish ? 'left-4' : 'right-4'}`}>
        {trainingSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={t({ ar: `عرض الصورة رقم ${index + 1}`, en: `View image ${index + 1}` })}
            className={`inline-flex h-3 w-3 shrink-0 rounded-full transition-all sm:h-2.5 sm:w-2.5 ${index === activeSlide ? 'bg-[#d7b05a] shadow-[0_0_10px_rgba(215,176,90,0.7)] ring-2 ring-white/70' : 'bg-white/70 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default TrainingSlider;