import { useEffect } from 'react';

export type GalleryLightboxImage = {
  src: string;
  alt: string;
};

type GalleryLightboxProps = {
  images: GalleryLightboxImage[];
  currentIndex: number | null;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

function GalleryLightbox({
  images,
  currentIndex,
  closeLabel,
  previousLabel,
  nextLabel,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const isOpen = currentIndex !== null && images[currentIndex] !== undefined;
  const currentImage = isOpen ? images[currentIndex] : null;

  const showPrevious = () => {
    if (!isOpen) return;
    onChange((currentIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (!isOpen) return;
    onChange((currentIndex + 1) % images.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const bodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const htmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyStyles.overflow;
      document.body.style.paddingRight = bodyStyles.paddingRight;
      document.body.style.position = bodyStyles.position;
      document.body.style.top = bodyStyles.top;
      document.body.style.width = bodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        showPrevious();
      }

      if (event.key === 'ArrowRight') {
        showNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, isOpen, onClose]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 sm:p-5"
    >
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={onClose}
      >
        {closeLabel}
      </button>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#1170b0]/90 text-2xl font-bold leading-none text-white shadow-[0_12px_32px_rgba(10,53,85,0.35)] backdrop-blur transition hover:bg-[#0a3555] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black sm:left-6 sm:h-12 sm:w-12"
            onClick={showPrevious}
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#1170b0]/90 text-2xl font-bold leading-none text-white shadow-[0_12px_32px_rgba(10,53,85,0.35)] backdrop-blur transition hover:bg-[#0a3555] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black sm:right-6 sm:h-12 sm:w-12"
            onClick={showNext}
          >
            &rarr;
          </button>
        </>
      ) : null}

      <img
        src={currentImage.src}
        alt={currentImage.alt}
        className="max-h-[92vh] max-w-[92vw] object-contain shadow-2xl"
      />
    </div>
  );
}

export default GalleryLightbox;
