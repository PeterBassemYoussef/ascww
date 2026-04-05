import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TenderCard from '../components/TenderCard';
import type { TenderItem } from '../types';
import {
    TENDER_FILE_ENDPOINT,
    TENDERS_ENDPOINT,
    extractPlainTextFromHtml,
    getTenderImagePath,
    getTenderRouteId,
} from '../utils/helpers';

const ITEMS_PER_LOAD = 6;

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

function TendersArchive() {
    const [allTenders, setAllTenders] = useState<TenderItem[]>([]);
    const [tenders, setTenders] = useState<TenderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const appendPage = useCallback((nextPage: number, source: TenderItem[]) => {
        const nextItems = source.slice(0, nextPage * ITEMS_PER_LOAD);
        setTenders(nextItems);
        setHasMore(nextItems.length < source.length);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadTenders = async () => {
            setLoading(true);
            setError(null);

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
                    .filter((item) => Number(item.active ?? 1) !== 0)
                    .sort((first, second) => {
                        const firstDate = new Date(first.created_at || first.updated_at || '').getTime();
                        const secondDate = new Date(second.created_at || second.updated_at || '').getTime();
                        if (!Number.isNaN(secondDate - firstDate) && secondDate !== firstDate) {
                            return secondDate - firstDate;
                        }
                        return Number(second.id ?? 0) - Number(first.id ?? 0);
                    });

                if (!active) return;
                setAllTenders(validTenders);
                appendPage(1, validTenders);
            } catch {
                if (!active) return;
                setError('فشل تحميل المناقصات. يرجى المحاولة مرة أخرى.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadTenders();
        return () => {
            active = false;
            controller.abort();
        };
    }, [appendPage]);

    const loadMore = useCallback(() => {
        if (loading || loadingMore || !hasMore) return;
        setLoadingMore(true);
        window.setTimeout(() => {
            setTenders((prevItems) => {
                const nextCount = prevItems.length + ITEMS_PER_LOAD;
                const nextItems = allTenders.slice(0, nextCount);
                setHasMore(nextItems.length < allTenders.length);
                return nextItems;
            });
            setLoadingMore(false);
        }, 0);
    }, [allTenders, hasMore, loading, loadingMore]);

    useEffect(() => {
        const onScroll = () => {
            if (loading || loadingMore || !hasMore) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            if (scrollTop + viewportHeight >= fullHeight - 250) {
                loadMore();
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [hasMore, loadMore, loading, loadingMore]);

    useEffect(() => {
        const pageUrl = window.location.href;
        const firstTender = allTenders[0] || null;
        const title = 'أرشيف المناقصات';
        const description = firstTender
            ? extractPlainTextFromHtml(firstTender.description || '').slice(0, 180) || 'تابع أحدث المناقصات والمواصفات الفنية وملفاتها.'
            : 'تابع أحدث المناقصات والمواصفات الفنية وملفاتها.';
        const imagePath = firstTender ? getTenderImagePath(firstTender) : '';
        const imageUrl = imagePath
            ? `${TENDER_FILE_ENDPOINT}/${encodeURIComponent(imagePath)}`
            : `${window.location.origin}/images/ascww-logo.png`;

        document.title = `${title} | شركة مياه أسيوط`;
        setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
        setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
        setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
        setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
        setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    }, [allTenders]);

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 py-8" dir="rtl">
                <div className="mb-10 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">أرشيف المناقصات</h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        تابع أحدث المناقصات والمواصفات الفنية وملفاتها.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        <p className="font-medium text-gray-500">جاري تحميل المناقصات...</p>
                    </div>
                ) : error ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-red-500">
                        <p className="text-lg font-medium text-red-800">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-lg border border-red-200 bg-white px-6 py-2 text-red-700 shadow-sm transition-colors hover:bg-red-50"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {tenders.map((tender, index) => (
                                <TenderCard key={`${getTenderRouteId(tender) || 'tender'}-${index}`} tender={tender} />
                            ))}
                        </div>

                        {loadingMore && (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                            </div>
                        )}

                        {tenders.length === 0 && (
                            <section className="mx-auto mt-4 max-w-2xl overflow-hidden rounded-2xl border border-[#d7b05a]/35 bg-gradient-to-b from-[#0a3555]/5 to-white p-6 text-center shadow-sm sm:p-8">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0a3555]/10 text-[#0a3555]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 7h18" />
                                        <path d="M8 3v4" />
                                        <path d="M16 3v4" />
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <path d="M8 12h8" />
                                    </svg>
                                </div>
                                <h2 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                    لا توجد مناقصات لعرضها حاليًا.
                                </h2>
                                <p className="mt-3 mx-auto max-w-full text-center text-xs leading-6 text-slate-600 sm:text-sm">
                                    سيتم نشر أي مناقصات جديدة فور إضافتها. يمكنك تحديث الصفحة لاحقًا للاطلاع على أحدث المحتوى.
                                </p>

                            </section>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default TendersArchive;
