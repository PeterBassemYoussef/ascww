import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import type { CareerItem } from '../types';
import {
    CAREERS_ENDPOINT,
    CAREER_FILE_ENDPOINT,
    CAREER_IMAGE_ENDPOINT,
    extractPlainTextFromHtml,
    formatArabicDate,
    sanitizeHtmlContent,
} from '../utils/helpers';

const isImageFile = (path: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);

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

function JobsAndCompetitionPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const [allItems, setAllItems] = useState<CareerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
    const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
    const buttonRowClass = isEnglish ? 'justify-start' : 'justify-end';
    const cardGridClass = isEnglish ? 'lg:grid-cols-[1fr,220px]' : 'lg:grid-cols-[220px,1fr]';

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadCareers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(CAREERS_ENDPOINT, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Careers request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const rawItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.data)
                        ? payloadObject.data
                        : Array.isArray(payloadObject.value)
                            ? payloadObject.value
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validItems = rawItems
                    .filter((item): item is CareerItem => typeof item === 'object' && item !== null)
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
                setAllItems(validItems);
            } catch {
                if (!active) return;
                setError(t('فشل تحميل بيانات مسابقات الوظائف. يرجى المحاولة مرة أخرى.', 'Unable to load jobs and competition data. Please try again.'));
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCareers();
        return () => {
            active = false;
            controller.abort();
        };
    }, [isEnglish]);

    const summaryText = useMemo(() => {
        const firstItem = allItems.find((item) => Number(item.type_id) === 1);
        if (!firstItem) {
            return t(
                'تابع أحدث الإعلانات والنتائج الخاصة بمسابقات الوظائف.',
                'Follow the latest job announcements and competition updates.'
            );
        }

        const extracted = extractPlainTextFromHtml(firstItem.description || '').slice(0, 180);
        return extracted || t(
            'تابع أحدث الإعلانات والنتائج الخاصة بمسابقات الوظائف.',
            'Follow the latest job announcements and competition updates.'
        );
    }, [allItems, isEnglish]);

    const jobItems = useMemo(
        () => allItems.filter((item) => Number(item.type_id) === 1),
        [allItems],
    );

    const openImageModal = (src: string) => setModalImageSrc(src);
    const closeImageModal = () => setModalImageSrc(null);

    useEffect(() => {
        const pageUrl = window.location.href;
        const imageUrl = `${window.location.origin}/images/ascww-logo.png`;
        const title = t('مسابقات و وظائف', 'Competitions and Jobs');

        document.title = `${title} | ${t('شركة مياه أسيوط', 'Assiut Water Company')}`;
        setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
        setMetaTag('meta[property="og:description"]', 'property', 'og:description', summaryText);
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
        setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
        setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', summaryText);
        setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    }, [summaryText, isEnglish]);

    return (
        <>
            <Header />
            <main className="bg-slate-50" dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
                            <h1 className="sr-only">
                                {t('مسابقات و وظائف', 'Competitions and Jobs')}
                            </h1>
                            <p className="text-center text-xl font-medium text-slate-600 sm:text-2xl">
                                {t(
                                    'تابع أحدث الوظائف الخاصة بالشركة.',
                                    'Follow the latest company job opportunities.'
                                )}
                            </p>
                        </div>

                        <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
                            {loading ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center shadow-sm">
                                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                                    <p className="font-medium text-slate-600">{t('جارٍ تحميل مسابقات الوظائف...', 'Loading job competitions...')}</p>
                                </div>
                            ) : null}

                            {!loading && error ? (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
                                    <p className="text-lg font-semibold">{error}</p>
                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()}
                                        className="mt-6 rounded-full border border-rose-200 bg-white px-6 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                                    >
                                        {t('إعادة المحاولة', 'Try again')}
                                    </button>
                                </div>
                            ) : null}

                            {!loading && !error && jobItems.length > 0 ? (
                                <div className="space-y-6">
                                    {jobItems.map((job) => {
                                        const filePath = String(job.file_path || '').trim();
                                        const imagePath = String(job.image_path || '').trim();
                                        const downloadName = filePath ? filePath.split('/').pop() || 'file' : 'file';
                                        const fileUrl = filePath
                                            ? `${CAREER_FILE_ENDPOINT}/${encodeURIComponent(filePath)}`
                                            : '';
                                        const pdfEmbedUrl = fileUrl
                                            ? `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                                            : '';
                                        const imageUrl = imagePath && isImageFile(imagePath)
                                            ? `${CAREER_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}`
                                            : '';
                                        const descriptionHtml = sanitizeHtmlContent(String(job.description || '').trim());

                                        return (
                                            <article
                                                key={job.id ?? job.title ?? fileUrl}
                                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                                            >
                                                <div className={`grid gap-0 lg:gap-6 ${imageUrl ? cardGridClass : ''}`} dir={isEnglish ? 'ltr' : 'rtl'}>
                                                    {imageUrl ? (
                                                        <button
                                                            type="button"
                                                            className="flex h-full items-center justify-center bg-slate-100 p-4 transition hover:bg-slate-200 focus:outline-none"
                                                            onClick={() => openImageModal(imageUrl)}
                                                            aria-label={t('عرض صورة الإعلان', 'Open announcement image')}
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt={job.title || t('صورة إعلان', 'Announcement image')}
                                                                className="max-h-52 w-full object-contain"
                                                                loading="lazy"
                                                            />
                                                        </button>
                                                    ) : null}

                                                    <div className={`space-y-4 p-6 ${textAlignmentClass}`} dir={isEnglish ? 'ltr' : 'rtl'}>
                                                        <div className="space-y-2">
                                                            <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
                                                            <div className={`flex flex-wrap gap-3 text-sm text-slate-500 ${buttonRowClass}`}>
                                                                {job.created_at ? (
                                                                    <span>{t('تاريخ النشر:', 'Publish date:')} {formatArabicDate(job.created_at)}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        {descriptionHtml ? (
                                                            <div
                                                                className={`prose prose-sm max-w-none text-slate-700 ${isEnglish ? 'prose-headings:text-left prose-p:text-left prose-li:text-left' : ''}`}
                                                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                                            />
                                                        ) : null}

                                                        {fileUrl ? (
                                                            <div className={`flex flex-wrap gap-3 ${buttonRowClass}`}>
                                                                <a
                                                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                                                                    href={fileUrl}
                                                                    download={downloadName}
                                                                >
                                                                    {t('تحميل الملف', 'Download file')}
                                                                </a>
                                                                <a
                                                                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                                                    href={fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {t('فتح الملف', 'Open file')}
                                                                </a>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {fileUrl ? (
                                                    <div className="border-t border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                                                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                                            <object
                                                                data={pdfEmbedUrl}
                                                                type="application/pdf"
                                                                className="h-[520px] w-full"
                                                            >
                                                                <iframe
                                                                    title={job.title || t('ملف الإعلان', 'Announcement file')}
                                                                    src={pdfEmbedUrl}
                                                                    className="h-[520px] w-full"
                                                                />
                                                            </object>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : null}

                            {!loading && !error && jobItems.length === 0 ? (
                                <section className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#d7b05a]/40 bg-gradient-to-b from-[#0a3555]/5 to-white p-4 text-center shadow-sm sm:p-5">
                                    <img
                                        src="/images/jobs.webp"
                                        alt={t('لا توجد وظائف حالياً', 'No jobs available right now')}
                                        className="mx-auto h-auto max-h-[420px] w-full rounded-2xl object-contain shadow-[0_14px_30px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/10"
                                        loading="lazy"
                                    />
                                </section>
                            ) : null}
                        </div>
                    </section>
                </div>
            </main>

            {modalImageSrc ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeImageModal}
                >
                    <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <button
                            type="button"
                            className={`absolute top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white transition hover:bg-black/80 ${isEnglish ? 'right-3' : 'left-3'}`}
                            onClick={closeImageModal}
                            aria-label={t('إغلاق الصورة', 'Close image')}
                        >
                            {t('إغلاق', 'Close')}
                        </button>
                        <img
                            src={modalImageSrc}
                            alt={t('صورة الإعلان', 'Announcement image')}
                            loading="lazy"
                            className="h-full max-h-[90vh] w-full object-contain bg-black"
                        />
                    </div>
                </div>
            ) : null}
            <Footer />
        </>
    );
}

export default JobsAndCompetitionPage;
