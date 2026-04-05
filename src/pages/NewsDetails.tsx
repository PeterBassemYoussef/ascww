import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSpeech } from '../hooks/useSpeech';
import type { NewsItem } from '../types';
import {
    NEWS_ARCHIVE_PATH,
    NEWS_IMAGE_ENDPOINT,
    extractPlainTextFromHtml,
    getLatestNewsImagePath,
    sanitizeHtmlContent,
} from '../utils/helpers';

const NEWS_DETAILS_ENDPOINT = 'https://backend.ascww.org/api/news';
const NEWS_DETAILS_PROXY_ENDPOINT = '/api/news';

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

function NewsDetails() {
    const { id } = useParams<{ id: string }>();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openedImageUrl, setOpenedImageUrl] = useState<string | null>(null);
    const { speak, stop, isReading } = useSpeech();

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        const routeId = decodeURIComponent(id || '').trim();

        const loadNewsItem = async () => {
            if (!id) return;
            setLoading(true);

            try {
                let response: Response;
                try {
                    response = await fetch(NEWS_DETAILS_ENDPOINT, { signal: controller.signal });
                } catch (requestError) {
                    if (controller.signal.aborted) throw requestError;
                    response = await fetch(NEWS_DETAILS_PROXY_ENDPOINT, { signal: controller.signal });
                }
                if (!response.ok) {
                    throw new Error(`News request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };
                const nestedPayloadData = (
                    payloadObject.data && typeof payloadObject.data === 'object'
                        ? payloadObject.data
                        : {}
                ) as { data?: unknown };

                const rawNewsItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.data)
                        ? payloadObject.data
                        : Array.isArray(nestedPayloadData.data)
                            ? nestedPayloadData.data
                        : Array.isArray(payloadObject.value)
                            ? payloadObject.value
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validNewsItems = rawNewsItems
                    .filter((item): item is NewsItem => typeof item === 'object' && item !== null)
                    .filter((item) => Number(item.active ?? 1) !== 0);

                const item = validNewsItems.find((entry) => {
                    const entryId = String(entry.id ?? '').trim();
                    const entrySlug = String(entry.slug ?? '').trim();
                    return routeId === entryId || routeId === entrySlug;
                }) || null;

                if (!active) return;
                setNews(item);
                setCurrentIndex(0);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadNewsItem();
        return () => {
            active = false;
            controller.abort();
            window.speechSynthesis.cancel();
        };
    }, [id]);

    const images = useMemo(
        () => (news?.news_images || []).filter((image) => Boolean((image.path || '').trim())),
        [news]
    );

    const currentImageUrl = useMemo(() => {
        if (!images[currentIndex]?.path) return '';
        return `${NEWS_IMAGE_ENDPOINT}/${encodeURIComponent(images[currentIndex].path || '')}`;
    }, [images, currentIndex]);

    const shareDescription = useMemo(() => {
        if (!news) return '';
        return extractPlainTextFromHtml(news.description || '').slice(0, 180);
    }, [news]);

    useEffect(() => {
        if (!news) return;

        const title = news.title || 'خبر';
        const pageUrl = window.location.href;
        const imagePath = getLatestNewsImagePath(news);
        const imageUrl = imagePath ? `${NEWS_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}` : '';

        document.title = `${title} | أرشيف الأخبار`;
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
    }, [news, shareDescription]);

    const nextImage = () => {
        if (images.length < 2) return;
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (images.length < 2) return;
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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

    if (!news) {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-16 text-center" dir="rtl">
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">الخبر غير موجود</h2>
                    <Link to={NEWS_ARCHIVE_PATH} className="text-blue-600 hover:underline">العودة للأخبار</Link>
                </main>
                <Footer />
            </>
        );
    }

    const dateText = new Date(news.created_at || news.updated_at || '').toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const descriptionHtml = String(news.description || '');
    const cleanedDescriptionCandidate = descriptionHtml
        .replace(/لمزيد من التفاصيل/g, '')
        .replace(/اقرأ المزيد/g, '');
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
                    {images.length > 0 ? (
                        <div
                            className="relative h-[300px] cursor-zoom-in overflow-hidden bg-gray-100 md:h-[500px]"
                            onClick={() => {
                                if (currentImageUrl) setOpenedImageUrl(currentImageUrl);
                            }}
                        >
                            <img loading="lazy" decoding="async"
                                src={currentImageUrl}
                                alt={news.title || 'صورة الخبر'}
                                className="!h-full !w-full object-contain"
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                }}
                            />
                            {images.length > 1 && (
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
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-[300px] items-center justify-center bg-gray-100 text-gray-400 md:h-[500px]">
                            لا توجد صور
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {dateText}
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                المركز الإعلامي
                            </div>
                        </div>

                        <h1 className="mb-6 text-justify text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                            {news.title}
                        </h1>

                        {hasDetailsContent ? (
                            <div
                                className="prose prose-lg mb-8 max-w-none break-words text-justify leading-relaxed text-gray-700"
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />
                        ) : (
                            <p className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                                لا توجد تفاصيل متاحة لهذا الخبر حاليًا.
                            </p>
                        )}

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to={NEWS_ARCHIVE_PATH}
                                className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l-7-7 7-7" />
                                </svg>
                                العودة للأخبار
                            </Link>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const url = window.location.href;
                                        const text = `${news.title}\n${shareDescription}`;
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: news.title || 'خبر',
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
                                    title="مشاركة الخبر"
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
                                        const quote = `${news.title}\n${shareDescription}`;
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
                                        const text = `${news.title}\n${shareDescription}\n${url}`;
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
                                            speak(`${news.title}. ${stripped}`, 'ar-SA');
                                        }}
                                        className="rounded-full bg-purple-50 p-2 text-purple-600 transition-colors hover:bg-purple-100"
                                        title="اقرأ المقال"
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
                            alt={news.title || 'صورة الخبر'}
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

export default NewsDetails;
