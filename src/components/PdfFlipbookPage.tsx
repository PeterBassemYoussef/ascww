import { forwardRef, type FormEvent, type TouchEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import HTMLFlipBook from 'react-pageflip';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const FAST_OPEN_PAGES = 2;
const INITIAL_BACKGROUND_PAGES = 6;
const BACKGROUND_FLUSH_INTERVAL = 4;
const PAGE_CHUNK_SIZE = 6;
const PDF_RENDER_SCALE = 1.15;
const PDF_IMAGE_QUALITY = 0.9;

GlobalWorkerOptions.workerSrc = workerSrc;

const getIsMobileViewport = () => (
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 767px)').matches
    : false
);

type PdfDoc = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (params: { scale: number }) => { width: number; height: number };
    render: (params: { canvas: HTMLCanvasElement; canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
  }>;
  destroy?: () => void;
  cleanup?: () => void;
};

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (page: number) => void;
  };
};

type BookPageProps = {
  imageUrl: string;
  pageNumber: number;
  totalPages: number;
  isBlank?: boolean;
  isCover?: boolean;
};

type PdfFlipbookPageProps = {
  title: string;
  pdfUrl: string;
  downloadFileName: string;
  loadingErrorMessage: string;
  viewerKey?: string;
};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({
  imageUrl,
  pageNumber,
  totalPages,
  isBlank = false,
  isCover = false,
}, ref) => {
  if (isBlank) {
    return <div ref={ref} className="h-full w-full rounded-md bg-[#f2eee3]" />;
  }

  return (
    <div
      ref={ref}
      className={`relative h-full w-full overflow-hidden rounded-md ${isCover ? 'bg-[#eadfc8]' : 'bg-[#f4f2ea]'}`}
    >
      {imageUrl ? (
        <img loading="lazy" decoding="async"
          alt={`صفحة ${pageNumber}`}
          className="!h-full !w-full object-contain"
          draggable={false}
          src={imageUrl}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#faf8f2] to-[#efe9da]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0a3555]/15 border-t-[#d7b05a]" />
        </div>
      )}
    </div>
  );
});

BookPage.displayName = 'BookPage';

function PdfFlipbookPage({
  title,
  pdfUrl,
  downloadFileName,
  loadingErrorMessage,
  viewerKey,
}: PdfFlipbookPageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loadedPagesCount, setLoadedPagesCount] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChunkLoading, setIsChunkLoading] = useState(false);
  const [isMobileViewer, setIsMobileViewer] = useState(getIsMobileViewport);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageInputValue, setPageInputValue] = useState('1');
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<PdfDoc | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundAtRef = useRef(0);
  const pageObjectUrlsRef = useRef<string[]>([]);
  const pageImagesRef = useRef<string[]>([]);
  const loadedPagesCountRef = useRef(0);
  const totalPagesRef = useRef(0);
  const aliveRef = useRef(true);
  const touchStartXRef = useRef<number | null>(null);
  const componentId = useId();

  const resolvedViewerKey = viewerKey ?? componentId;

  const bookPages = useMemo(() => {
    if (pageImages.length === 0 || loadedPagesCount === 0) return [];
    const loadedOnly = pageImages.slice(0, loadedPagesCount);
    if (loadedOnly.length % 2 === 0) return loadedOnly;
    return [...loadedOnly, ''];
  }, [pageImages, loadedPagesCount]);

  const stageHeightClass = isFullscreen
    ? 'h-[98vh]'
    : isMobileViewer
      ? 'h-[68vh]'
      : 'h-[76vh] sm:h-[82vh] lg:h-[86vh]';
  const startPageIndex = Math.max(currentPage - 1, 0);
  const zoomPercent = Math.round(zoomLevel * 100);
  const canFlipPrev = currentPage > 1;
  const canFlipNext = totalPages > 0 && (currentPage < loadedPagesCount || (loadedPagesCount < totalPages && !isChunkLoading));
  const currentPageImage = pageImages[currentPage - 1] || '';
  const isCurrentPageReady = Boolean(currentPageImage);

  const baseBookSizes = isFullscreen
    ? { width: 2000, height: 1400, minWidth: 900, minHeight: 700, maxWidth: 4200, maxHeight: 3000 }
    : isMobileViewer
      ? { width: 620, height: 860, minWidth: 260, minHeight: 340, maxWidth: 1800, maxHeight: 2200 }
      : { width: 900, height: 900, minWidth: 360, minHeight: 420, maxWidth: 2600, maxHeight: 2000 };
  const bookSizes = {
    width: Math.round(baseBookSizes.width * zoomLevel),
    height: Math.round(baseBookSizes.height * zoomLevel),
    minWidth: Math.max(320, Math.round(baseBookSizes.minWidth * zoomLevel)),
    minHeight: Math.max(360, Math.round(baseBookSizes.minHeight * zoomLevel)),
    maxWidth: Math.round(baseBookSizes.maxWidth * zoomLevel),
    maxHeight: Math.round(baseBookSizes.maxHeight * zoomLevel),
  };

  const releaseObjectUrls = () => {
    if (pageObjectUrlsRef.current.length === 0) return;
    pageObjectUrlsRef.current.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    pageObjectUrlsRef.current = [];
  };

  useEffect(() => {
    pageImagesRef.current = pageImages;
  }, [pageImages]);

  useEffect(() => {
    loadedPagesCountRef.current = loadedPagesCount;
  }, [loadedPagesCount]);

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  const playFlipSound = () => {
    if (!isSoundEnabled) return;
    const now = performance.now();
    if (now - lastSoundAtRef.current < 120) return;
    lastSoundAtRef.current = now;

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = audioContextRef.current ?? new AudioContextCtor();
    audioContextRef.current = context;
    const triggerSound = () => {
      const duration = 0.12;
      const sampleSize = Math.floor(context.sampleRate * duration);
      const buffer = context.createBuffer(1, sampleSize, context.sampleRate);
      const channel = buffer.getChannelData(0);

      for (let i = 0; i < sampleSize; i += 1) {
        const decay = 1 - i / sampleSize;
        channel[i] = (Math.random() * 2 - 1) * decay * decay;
      }

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = 860;
      filter.Q.value = 0.8;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      source.stop(context.currentTime + duration);
    };

    if (context.state === 'suspended') {
      void context.resume().then(triggerSound).catch(() => {
        // Ignore resume failures on restricted mobile browsers.
      });
      return;
    }

    triggerSound();
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncMobileState = () => setIsMobileViewer(mediaQuery.matches);
    syncMobileState();

    mediaQuery.addEventListener('change', syncMobileState);
    return () => {
      mediaQuery.removeEventListener('change', syncMobileState);
    };
  }, []);

  const handlePdfDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = downloadFileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = pdfUrl;
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.target = '_blank';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } finally {
      setIsDownloading(false);
    }
  };

  const renderPdfPageToImageUrl = async (doc: PdfDoc, pageNumber: number) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return '';

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const imageDataUrl = await new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(canvas.toDataURL('image/webp', PDF_IMAGE_QUALITY));
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        pageObjectUrlsRef.current.push(blobUrl);
        resolve(blobUrl);
      }, 'image/webp', PDF_IMAGE_QUALITY);
    });

    return imageDataUrl;
  };

  const loadPageRange = async (fromPage: number, toPage: number) => {
    const doc = pdfDocRef.current;
    if (!doc) return;
    if (fromPage > toPage) return;

    setIsChunkLoading(true);
    const nextImages = [...pageImagesRef.current];
    let nextLoadedCount = loadedPagesCountRef.current;

    try {
      for (let pageNumber = fromPage; pageNumber <= toPage; pageNumber += 1) {
        if (!aliveRef.current) return;
        if (nextImages[pageNumber - 1]) {
          nextLoadedCount = Math.max(nextLoadedCount, pageNumber);
          continue;
        }

        const imageDataUrl = await renderPdfPageToImageUrl(doc, pageNumber);
        if (!aliveRef.current) return;
        if (!imageDataUrl) continue;

        nextImages[pageNumber - 1] = imageDataUrl;
        nextLoadedCount = Math.max(nextLoadedCount, pageNumber);

        if (pageNumber % BACKGROUND_FLUSH_INTERVAL === 0 || pageNumber === toPage) {
          pageImagesRef.current = [...nextImages];
          loadedPagesCountRef.current = nextLoadedCount;
          setPageImages([...nextImages]);
          setLoadedPagesCount(nextLoadedCount);
        }

        if (pageNumber % 4 === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }

      pageImagesRef.current = [...nextImages];
      loadedPagesCountRef.current = nextLoadedCount;
      setPageImages([...nextImages]);
      setLoadedPagesCount(nextLoadedCount);
    } finally {
      if (aliveRef.current) {
        setIsChunkLoading(false);
      }
    }
  };

  useEffect(() => {
    aliveRef.current = true;
    let loadingTask: ReturnType<typeof getDocument> | null = null;

    const loadPdf = async () => {
      setIsLoadingDocument(true);
      setLoadingError(null);
      setTotalPages(0);
      setLoadedPagesCount(0);
      setCurrentPage(1);
      setPageImages([]);
      releaseObjectUrls();

      try {
        let doc: unknown;
        try {
          loadingTask = getDocument({
            url: pdfUrl,
            disableRange: false,
            disableStream: false,
          });
          doc = await loadingTask.promise;
        } catch {
          const response = await fetch(pdfUrl);
          if (!response.ok) {
            throw new Error(`PDF request failed with status ${response.status}`);
          }
          const pdfBytes = new Uint8Array(await response.arrayBuffer());
          loadingTask = getDocument({ data: pdfBytes });
          doc = await loadingTask.promise;
        }
        if (!aliveRef.current) return;

        const typedDoc = doc as unknown as PdfDoc;
        pdfDocRef.current = typedDoc;
        setTotalPages(typedDoc.numPages);
        totalPagesRef.current = typedDoc.numPages;
        const placeholders = Array.from({ length: typedDoc.numPages }, () => '');
        pageImagesRef.current = placeholders;
        loadedPagesCountRef.current = 0;
        setPageImages(placeholders);
        setLoadedPagesCount(0);

        const firstPaintEnd = Math.min(FAST_OPEN_PAGES, typedDoc.numPages);
        await loadPageRange(1, firstPaintEnd);
        if (!aliveRef.current) return;
        setIsLoadingDocument(false);

        const backgroundEnd = Math.min(INITIAL_BACKGROUND_PAGES, typedDoc.numPages);
        if (firstPaintEnd < backgroundEnd) {
          void loadPageRange(firstPaintEnd + 1, backgroundEnd).catch(() => {
            // Ignore background preload failures; page-demand loading still works.
          });
        }
      } catch {
        if (!aliveRef.current) return;
        setIsLoadingDocument(false);
        setLoadingError(loadingErrorMessage);
      }
    };

    void loadPdf();

    return () => {
      aliveRef.current = false;
      void loadingTask?.destroy();
      pdfDocRef.current?.cleanup?.();
      pdfDocRef.current?.destroy?.();
      pdfDocRef.current = null;
      releaseObjectUrls();
    };
  }, [loadingErrorMessage, pdfUrl]);

  const handleFlip = (event: { data?: number }) => {
    const nextPage = Number(event?.data ?? 0) + 1;
    setCurrentPage(nextPage);
    playFlipSound();

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;
    if (nextPage + 1 >= loadedCount && loadedCount < allCount && !isChunkLoading) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      void loadPageRange(nextStart, nextEnd);
    }
  };

  const flipPrev = () => {
    if (!canFlipPrev) return;
    flipBookRef.current?.pageFlip().flipPrev();
  };

  const flipNext = async () => {
    if (!canFlipNext) return;

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;

    if (currentPage >= loadedCount && loadedCount < allCount) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      await loadPageRange(nextStart, nextEnd);
      if (!aliveRef.current) return;
    }

    flipBookRef.current?.pageFlip().flipNext();
  };

  const goToPage = async (pageNumber: number) => {
    if (totalPagesRef.current === 0) return;
    const clampedPage = Math.min(Math.max(pageNumber, 1), totalPagesRef.current);

    const loadedCount = loadedPagesCountRef.current;
    if (clampedPage > loadedCount && loadedCount < totalPagesRef.current) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(clampedPage + PAGE_CHUNK_SIZE, totalPagesRef.current);
      await loadPageRange(nextStart, nextEnd);
      if (!aliveRef.current) return;
    }

    flipBookRef.current?.pageFlip().turnToPage(clampedPage - 1);
    if (isMobileViewer && clampedPage !== currentPage) {
      playFlipSound();
    }
    setCurrentPage(clampedPage);
  };

  const handlePageInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetPage = Number(pageInputValue);
    if (!Number.isFinite(targetPage)) {
      setPageInputValue(String(currentPage));
      return;
    }
    void goToPage(targetPage);
  };

  const handleMobileTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleMobileTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;

    if (deltaX > 0) {
      void goToPage(currentPage - 1);
      return;
    }

    void goToPage(currentPage + 1);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(1.8, Number((prev + 0.1).toFixed(2))));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))));
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const element = stageRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen API errors on unsupported browsers.
    }
  };

  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_top,_rgba(13,91,143,0.06),_transparent_48%)]"
        dir="rtl"
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#082e4a] to-[#0d5b8f] px-6 py-7 text-white sm:px-8">
              <h1 className="text-xl font-extrabold sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="px-4 py-5 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#082e4a]/25 bg-gradient-to-l from-[#082e4a] to-[#0d5b8f] px-2.5 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-1">
                    <button
                      className={`inline-flex h-8 items-center justify-center rounded-md border border-white/20 px-2 text-xs font-bold text-white transition ${
                        isSoundEnabled ? 'bg-white/8 hover:bg-white/15' : 'bg-[#6b3f3f]/70 hover:bg-[#7a4646]/80'
                      }`}
                      onClick={toggleSound}
                      type="button"
                    >
                      {isSoundEnabled ? 'الصوت: تشغيل' : 'الصوت: كتم'}
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md border border-white/20 bg-white/8 px-2 text-xs font-bold text-white transition hover:bg-white/15"
                      onClick={toggleFullscreen}
                      type="button"
                    >
                      {isFullscreen ? 'خروج من الملء' : 'ملء الشاشة'}
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-extrabold text-[#0a3555] transition hover:bg-slate-50"
                      disabled={isDownloading}
                      onClick={handlePdfDownload}
                      type="button"
                    >
                      {isDownloading ? 'جارٍ التحميل...' : 'تحميل PDF'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isMobileViewer ? (
                      <>
                        <button
                          aria-label="تصغير"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/8 text-lg font-black text-white transition hover:bg-white/15 disabled:opacity-45"
                          disabled={zoomLevel <= 0.8}
                          onClick={zoomOut}
                          type="button"
                        >
                          -
                        </button>
                        <span className="inline-flex min-w-[64px] items-center justify-center rounded-md border border-white/20 bg-black/15 px-2 py-1 text-xs font-black tracking-wide text-[#edf4e4]">
                          {zoomPercent}%
                        </span>
                        <button
                          aria-label="تكبير"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/8 text-lg font-black text-white transition hover:bg-white/15 disabled:opacity-45"
                          disabled={zoomLevel >= 1.8}
                          onClick={zoomIn}
                          type="button"
                        >
                          +
                        </button>
                      </>
                    ) : null}

                    <form className="flex items-center gap-1" onSubmit={handlePageInputSubmit}>
                      <span className="text-xs font-bold text-[#e7f3ff]">الصفحة</span>
                      <input
                        className={`h-8 rounded-md border border-slate-200 bg-white px-2 text-center text-xs font-black text-[#0a3555] outline-none focus:border-[#0d5b8f] ${isMobileViewer ? 'w-14' : 'w-16'}`}
                        inputMode="numeric"
                        max={totalPages || undefined}
                        min={1}
                        onChange={(event) => setPageInputValue(event.target.value)}
                        value={pageInputValue}
                      />
                      <span className="text-xs font-bold text-[#e7f3ff]">/ {totalPages || 0}</span>
                    </form>
                  </div>
                </div>

                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                  {isLoadingDocument
                    ? 'جاري تجهيز الملف...'
                    : loadingError
                      ? 'تعذر العرض'
                      : isChunkLoading
                        ? `الصفحة ${currentPage} من ${totalPages} (جاري تجهيز صفحات إضافية...)`
                        : `الصفحة ${currentPage} من ${totalPages} (تم تجهيز ${loadedPagesCount} صفحة)`}
                </div>

                {isLoadingDocument ? (
                  <div className="mt-3 flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0a3555]/20 border-t-[#1170b0]" />
                  </div>
                ) : loadingError ? (
                  <div className="mt-3 rounded-xl border border-red-300/60 bg-red-50/95 px-4 py-5 text-center text-sm font-semibold text-red-700">
                    {loadingError}
                  </div>
                ) : (
                  <div className={`mt-3 ${stageHeightClass}`}>
                    <div className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white" ref={stageRef}>
                      {isFullscreen ? (
                        <button
                          aria-label="إغلاق ملء الشاشة"
                          className="absolute left-3 top-3 z-30 inline-flex items-center gap-1 rounded-md border border-[#0a3555]/20 bg-white/95 px-2.5 py-1.5 text-xs font-extrabold text-[#0a3555] shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition hover:bg-white"
                          onClick={toggleFullscreen}
                          type="button"
                        >
                          ✕
                          <span>خروج</span>
                        </button>
                      ) : null}

                      {!isMobileViewer ? (
                        <>
                          <button
                            aria-label="الصفحة السابقة"
                            className="absolute left-2 top-1/2 z-20 inline-flex h-16 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-white/35 bg-[#0a3555]/90 text-2xl font-black text-[#f2f8ff] shadow-[0_8px_20px_rgba(10,53,85,0.3)] transition hover:bg-[#1170b0] disabled:opacity-35"
                            disabled={!canFlipPrev}
                            onClick={flipPrev}
                            type="button"
                          >
                            <span className="inline-block rotate-180" dir="ltr">❯</span>
                          </button>
                          <button
                            aria-label="الصفحة التالية"
                            className="absolute right-2 top-1/2 z-20 inline-flex h-16 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-white/35 bg-[#0a3555]/90 text-2xl font-black text-[#f2f8ff] shadow-[0_8px_20px_rgba(10,53,85,0.3)] transition hover:bg-[#1170b0] disabled:opacity-35"
                            disabled={!canFlipNext}
                            onClick={() => { void flipNext(); }}
                            type="button"
                          >
                            <span dir="ltr">❯</span>
                          </button>

                          <div className="h-full w-full px-8 py-5 sm:px-10">
                            <div className="book-viewer-shell relative h-full w-full rounded-xl border border-slate-200 bg-white p-2 sm:p-3">
                              <HTMLFlipBook
                                key={`${resolvedViewerKey}-${isFullscreen ? 'fullscreen' : 'regular'}`}
                                autoSize
                                className="mx-auto h-full w-full"
                                clickEventForward
                                disableFlipByClick={false}
                                drawShadow
                                flippingTime={920}
                                height={bookSizes.height}
                                maxHeight={bookSizes.maxHeight}
                                maxShadowOpacity={0.68}
                                maxWidth={bookSizes.maxWidth}
                                minHeight={bookSizes.minHeight}
                                minWidth={bookSizes.minWidth}
                                mobileScrollSupport
                                onFlip={handleFlip}
                                showCover
                                showPageCorners
                                size="stretch"
                                startPage={startPageIndex}
                                startZIndex={0}
                                style={{ margin: '0 auto', width: '100%', height: '100%' }}
                                swipeDistance={22}
                                useMouseEvents
                                usePortrait
                                width={bookSizes.width}
                                ref={flipBookRef}
                              >
                                {bookPages.map((imageUrl, index) => (
                                  <BookPage
                                    imageUrl={imageUrl}
                                    isBlank={imageUrl === ''}
                                    isCover={index === 0 || index === bookPages.length - 1}
                                    key={`${index}-${imageUrl ? 'loaded' : 'placeholder'}`}
                                    pageNumber={Math.min(index + 1, totalPages)}
                                    totalPages={totalPages}
                                  />
                                ))}
                              </HTMLFlipBook>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          className="h-full w-full p-2.5"
                          onTouchEnd={handleMobileTouchEnd}
                          onTouchStart={handleMobileTouchStart}
                        >
                          <div className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-[#f6f7fb] p-2">
                            <div className="flex h-full items-center justify-center overflow-auto rounded-lg bg-[#f4f2ea] p-1.5">
                              {isCurrentPageReady ? (
                                <img
                                  alt={`صفحة ${currentPage}`}
                                  className="block !h-full !w-full rounded-md object-contain"
                                  decoding="async"
                                  draggable={false}
                                  loading="eager"
                                  src={currentPageImage}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#0a3555]/20 border-t-[#1170b0]" />
                                </div>
                              )}
                            </div>

                            <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-2">
                              <div className="flex items-center gap-2 rounded-full border border-[#0a3555]/20 bg-white/95 px-2 py-1.5 shadow-[0_8px_20px_rgba(10,53,85,0.18)]">
                                <button
                                  className="inline-flex h-8 items-center justify-center rounded-md border border-[#0a3555]/20 px-3 text-xs font-extrabold text-[#0a3555] transition hover:bg-[#0a3555]/5 disabled:opacity-40"
                                  disabled={!canFlipPrev}
                                  onClick={() => { void goToPage(currentPage - 1); }}
                                  type="button"
                                >
                                  السابق
                                </button>
                                <span className="min-w-[84px] text-center text-xs font-black text-[#0a3555]">
                                  {currentPage} / {totalPages}
                                </span>
                                <button
                                  className="inline-flex h-8 items-center justify-center rounded-md border border-[#0a3555]/20 px-3 text-xs font-extrabold text-[#0a3555] transition hover:bg-[#0a3555]/5 disabled:opacity-40"
                                  disabled={!canFlipNext}
                                  onClick={() => { void goToPage(currentPage + 1); }}
                                  type="button"
                                >
                                  التالي
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PdfFlipbookPage;
