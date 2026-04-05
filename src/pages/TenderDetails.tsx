import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSpeech } from '../hooks/useSpeech';
import type { TenderItem } from '../types';
import {
    TENDER_FILE_ENDPOINT,
    TENDERS_ARCHIVE_PATH,
    TENDERS_ENDPOINT,
    extractPlainTextFromHtml,
    formatArabicDate,
    getTenderImagePath,
    getTenderRouteId,
    sanitizeHtmlContent,
} from '../utils/helpers';

const isImageFile = (path: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);
const isPdfFile = (path: string) => /\.pdf$/i.test(path);

function setMetaTag(
    selector: string,
    attrName: 'name' | 'property',
    attrValue: string,
    content: string
) {
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function TenderDetails() {
    const { id } = useParams<{ id: string }>();
    const [tender, setTender] = useState<TenderItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openedImageUrl, setOpenedImageUrl] = useState<string | null>(null);
    const { speak, stop, isReading } = useSpeech();

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        const routeId = decodeURIComponent(id || '').trim();

        const loadTenderItem = async () => {
            if (!id) return;
            setLoading(true);

            try {
                const response = await fetch(TENDERS_ENDPOINT, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Tenders request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const rawTenderItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.data)
                        ? payloadObject.data
                        : Array.isArray(payloadObject.value)
                            ? payloadObject.value
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validTenders = rawTenderItems
                    .filter((item): item is TenderItem => typeof item === 'object' && item !== null)
                    .filter((item) => Number(item.active ?? 1) !== 0);

                const item = validTenders.find((entry) => {
                    const entryRouteId = getTenderRouteId(entry);
                    return Boolean(entryRouteId && routeId === entryRouteId);
                }) || null;

                if (!active) return;
                setTender(item);
                setCurrentIndex(0);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadTenderItem();
        return () => {
            active = false;
            controller.abort();
            window.speechSynthesis.cancel();
        };
    }, [id]);

    const imageFiles = useMemo(() => {
        const files = tender?.tender_files || [];
        return files.filter((file) => {
            const path = String(file.path || '').trim();
            if (!path) return false;
            const type = String(file.type || '').toLowerCase().trim();
            return type === 'image' || isImageFile(path);
        });
    }, [tender]);

    const pdfFiles = useMemo(() => {
        const files = tender?.tender_files || [];
        return files.filter((file) => {
            const path = String(file.path || '').trim();
            if (!path) return false;
            const type = String(file.type || '').toLowerCase().trim();
            return type === 'pdf' || isPdfFile(path);
        });
    }, [tender]);

    const currentImageUrl = useMemo(() => {
        const path = String(imageFiles[currentIndex]?.path || '').trim();
        if (!path) return '';
        return `${TENDER_FILE_ENDPOINT}/${encodeURIComponent(path)}`;
    }, [imageFiles, currentIndex]);

    const shareDescription = useMemo(
        () => extractPlainTextFromHtml(tender?.description || '').slice(0, 180),
        [tender]
    );

    const nextImage = () => {
        if (imageFiles.length < 2) return;
        setCurrentIndex((prev) => (prev === imageFiles.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (imageFiles.length < 2) return;
        setCurrentIndex((prev) => (prev === 0 ? imageFiles.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!openedImageUrl) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenedImageUrl(null);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [openedImageUrl]);

    useEffect(() => {
        if (!tender) return;

        const title = tender.title || 'مناقصة';
        const pageUrl = window.location.href;
        const imagePath = getTenderImagePath(tender);
        const imageUrl = imagePath ? `${TENDER_FILE_ENDPOINT}/${encodeURIComponent(imagePath)}` : '';

        document.title = `${title} | أرشيف المناقصات`;
        setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
        setMetaTag('meta[property="og:description"]', 'property', 'og:description', shareDescription);
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article');
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
        if (imageUrl) {
            setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
        }

        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
        setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', shareDescription);
        if (imageUrl) {
            setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
        }
    }, [tender, shareDescription]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="flex min-h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
                </main>
                <Footer />
            </>
        );
    }

    if (!tender) {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-16 text-center" dir="rtl">
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">المناقصة غير موجودة</h2>
                    <Link to={TENDERS_ARCHIVE_PATH} className="text-blue-600 hover:underline">العودة إلى المناقصات</Link>
                </main>
                <Footer />
            </>
        );
    }

    const typeText = String(tender.type || '').trim();
    const expiryDateText = formatArabicDate(tender.expiration_date);
    const publishDateText = formatArabicDate(tender.created_at || tender.updated_at);
    const descriptionHtml = String(tender.description || '');
    const cleanedDescriptionCandidate = descriptionHtml
        .replace(/اقرأ المزيد/g, '')
        .replace(/لمزيد من التفاصيل/g, '');
    const sanitizedCandidate = sanitizeHtmlContent(cleanedDescriptionCandidate);
    const sanitizedDescription = sanitizeHtmlContent(descriptionHtml);
    const cleanContent = extractPlainTextFromHtml(sanitizedCandidate)
        ? sanitizedCandidate
        : sanitizedDescription;
    const hasDetailsContent = extractPlainTextFromHtml(cleanContent).length > 0;

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-4xl px-4 py-8" dir="rtl">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                    {imageFiles.length > 0 ? (
                        <div
                            className="relative h-[280px] cursor-zoom-in overflow-hidden bg-gray-100 md:h-[500px]"
                            onClick={() => {
                                if (currentImageUrl) setOpenedImageUrl(currentImageUrl);
                            }}
                        >
                            <img loading="lazy" decoding="async"
                                src={currentImageUrl}
                                alt={tender.title || 'صورة المناقصة'}
                                className="!h-full !w-full object-contain"
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                }}
                            />
                            {imageFiles.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            prevImage();
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                                        {currentIndex + 1} / {imageFiles.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-[280px] items-center justify-center bg-gray-100 text-gray-400 md:h-[500px]">
                            لا توجد صور
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 text-sm">
                            {typeText && (
                                <span className="rounded-full bg-[#0a3555]/10 px-3 py-1 font-bold text-[#0a3555]">
                                    {typeText}
                                </span>
                            )}
                            {expiryDateText && (
                                <span className="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">
                                    آخر موعد: {expiryDateText}
                                </span>
                            )}
                            {!expiryDateText && publishDateText && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-600">
                                    تاريخ النشر: {publishDateText}
                                </span>
                            )}
                        </div>

                        <h1 className="mb-6 text-justify text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                            {tender.title || 'مناقصة'}
                        </h1>

                        {hasDetailsContent ? (
                            <div
                                className="prose prose-lg mb-8 max-w-none break-words text-justify leading-relaxed text-gray-700"
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />
                        ) : (
                            <p className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                                لا توجد تفاصيل متاحة لهذه المناقصة حاليًا.
                            </p>
                        )}

                        {pdfFiles.length > 0 && (
                            <div className="mb-8 rounded-xl border border-red-100 bg-red-50/60 p-4">
                                <h2 className="mb-3 text-lg font-black text-red-800">ملفات المناقصة</h2>
                                <div className="flex flex-wrap gap-2">
                                    {pdfFiles.map((file, index) => {
                                        const path = String(file.path || '').trim();
                                        if (!path) return null;
                                        const fileUrl = `${TENDER_FILE_ENDPOINT}/${encodeURIComponent(path)}`;
                                        const fileName = String(file.name || `ملف ${index + 1}`).trim();

                                        return (
                                            <a
                                                key={`${path}-${index}`}
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-100"
                                            >
                                                <span className="rounded-lg bg-red-100 px-2.5 py-1 text-sm font-black text-red-800">ملف PDF</span>
                                                <span className="font-extrabold">{fileName}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to={TENDERS_ARCHIVE_PATH}
                                className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l-7-7 7-7" />
                                </svg>
                                العودة إلى المناقصات
                            </Link>

                            <div className="tender-details-actions flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const url = window.location.href;
                                        const text = `${tender.title || 'مناقصة'}\n${shareDescription}`;
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: tender.title || 'مناقصة',
                                                    text,
                                                    url,
                                                });
                                                return;
                                            } catch {
                                                // fallback to copy
                                            }
                                        }
                                        await navigator.clipboard.writeText(`${text}\n${url}`);
                                    }}
                                    className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
                                    title="مشاركة المناقصة"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="18" cy="5" r="3"></circle>
                                        <circle cx="6" cy="12" r="3"></circle>
                                        <circle cx="18" cy="19" r="3"></circle>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = window.location.href;
                                        const quote = `${tender.title || 'مناقصة'}\n${shareDescription}`;
                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`, '_blank');
                                    }}
                                    className="rounded-full bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                                    title="مشاركة على فيسبوك"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = window.location.href;
                                        const text = `${tender.title || 'مناقصة'}\n${shareDescription}\n${url}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                    }}
                                    className="rounded-full bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100"
                                    title="مشاركة على واتساب"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                                    </svg>
                                </button>
                                {!isReading ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const stripped = cleanContent.replace(/<[^>]*>/g, '');
                                            speak(`${tender.title || 'مناقصة'}. ${stripped}`, 'ar-SA');
                                        }}
                                        className="rounded-full bg-purple-50 p-2 text-purple-600 transition-colors hover:bg-purple-100"
                                        title="اقرأ المناقصة"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={stop}
                                        className="rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                        title="إيقاف القراءة"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {openedImageUrl ? (
                <div
                    className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4"
                    onClick={() => setOpenedImageUrl(null)}
                >
                    <div
                        className="relative w-full max-w-[95vw] overflow-hidden rounded-xl border border-white/20 bg-slate-950"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenedImageUrl(null)}
                            className="absolute left-3 top-3 z-10 rounded-lg bg-black/60 px-3 py-1 text-sm font-bold text-white transition hover:bg-black/80"
                        >
                            إغلاق
                        </button>
                        <img
                            src={openedImageUrl}
                            alt={tender.title || 'صورة المناقصة'}
                            loading="lazy"
                            className="max-h-[85vh] w-full object-contain"
                        />
                    </div>
                </div>
            ) : null}
            <Footer />
        </>
    );
}

export default TenderDetails;
