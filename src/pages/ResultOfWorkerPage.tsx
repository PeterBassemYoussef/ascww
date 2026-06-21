import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import type { CareerItem } from '../types';
import {
    CAREERS_ENDPOINT,
    CAREERS_PCR_ENDPOINT,
    CAREERS_GER_ENDPOINT,
    CAREERS_WED_ENDPOINT,
    CAREERS_WTR_ENDPOINT,
    CAREERS_PED_ENDPOINT,
    CAREERS_PTR_ENDPOINT,
    CAREERS_ID_ENDPOINT,
    CAREERS_AN_ENDPOINT,
    CAREER_FILE_ENDPOINT,
    CAREER_IMAGE_ENDPOINT,
    sanitizeHtmlContent,
} from '../utils/helpers';

const getArrayPayload = (payload: unknown) => {
    const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
        data?: unknown;
        value?: unknown;
        items?: unknown;
    };

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payloadObject.data)) return payloadObject.data;
    if (Array.isArray(payloadObject.value)) return payloadObject.value;
    if (Array.isArray(payloadObject.items)) return payloadObject.items;
    return [];
};

const renderTabIcon = (key: string) => {
    const wrapClass =
        'flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm ring-1 ring-black/5';
    const iconClass = 'h-4 w-4';

    switch (key) {
        case 'pcr':
            return (
                <span className={`${wrapClass} bg-emerald-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M8 3h6l4 4v14H8z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m10 14 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'ger':
            return (
                <span className={`${wrapClass} bg-rose-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M6 4h12v10H9l-3 3V4z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m9 9 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'wed':
            return (
                <span className={`${wrapClass} bg-sky-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <rect x="4" y="6" width="16" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'wtr':
            return (
                <span className={`${wrapClass} bg-indigo-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M7 3h7l4 4v14H7z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12h6M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'ped':
            return (
                <span className={`${wrapClass} bg-amber-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <rect x="6" y="4" width="12" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 4v3h6V4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12h6M9 16h4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'ptr':
            return (
                <span className={`${wrapClass} bg-teal-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'id':
            return (
                <span className={`${wrapClass} bg-violet-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <circle cx="9" cy="8" r="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 19c1.2-2.6 3.2-4 5-4s3.8 1.4 5 4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="18" cy="9" r="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 9v2l1 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        case 'an':
            return (
                <span className={`${wrapClass} bg-orange-500`}>
                    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9">
                        <circle cx="9" cy="8" r="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 19c1.2-2.6 3.2-4 5-4s3.8 1.4 5 4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m15 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            );
        default:
            return null;
    }
};

const renderPanels = (
    items: CareerItem[],
    isEnglish: boolean,
    t: (arabic: string, english: string) => string
) => {
    const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
    const buttonRowClass = isEnglish ? 'justify-start' : 'justify-end';

    return (
        <div className="space-y-4">
            {items.map((item) => {
                const filePath = String(item.file_path || '').trim();
                const imagePath = String(item.image_path || '').trim();
                const descriptionHtml = sanitizeHtmlContent(String(item.description || '').trim());
                const fileUrl = filePath ? `${CAREER_FILE_ENDPOINT}/${encodeURIComponent(filePath)}` : '';
                const downloadUrl = filePath
                    ? `${CAREER_FILE_ENDPOINT.replace('/file', '/download')}/${encodeURIComponent(filePath)}`
                    : '';
                const pdfEmbedUrl = fileUrl
                    ? `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                    : '';
                const imageUrl = imagePath ? `${CAREER_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}` : '';

                return (
                    <details
                        key={item.id ?? item.slug ?? item.title}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        <summary className={`cursor-pointer px-5 py-4 text-sm font-bold text-slate-800 ${textAlignmentClass}`}>
                            {item.title}
                        </summary>
                        <div className="space-y-4 border-t border-slate-100 bg-slate-50/40 px-5 py-5">
                            {descriptionHtml ? (
                                <div
                                    className={`ql-editor text-sm text-slate-700 ${textAlignmentClass}`}
                                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                />
                            ) : null}

                            {downloadUrl ? (
                                <div className={`flex flex-wrap gap-3 ${buttonRowClass}`}>
                                    <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                                    >
                                        {t('تحميل الملف', 'Download file')}
                                    </a>
                                </div>
                            ) : null}

                            {fileUrl ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <iframe
                                        title={item.title || t('ملف', 'File')}
                                        src={pdfEmbedUrl}
                                        className="h-[520px] w-full"
                                    />
                                </div>
                            ) : null}

                            {imageUrl ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <img src={imageUrl} alt={item.title || ''} className="w-full" loading="lazy" />
                                </div>
                            ) : null}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

function ResultOfWorkerPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const [allCareer, setAllCareer] = useState<CareerItem[]>([]);
    const [pcr, setPcr] = useState<CareerItem[]>([]);
    const [ger, setGer] = useState<CareerItem[]>([]);
    const [wed, setWed] = useState<CareerItem[]>([]);
    const [wtr, setWtr] = useState<CareerItem[]>([]);
    const [ped, setPed] = useState<CareerItem[]>([]);
    const [ptr, setPtr] = useState<CareerItem[]>([]);
    const [idcar, setIdcar] = useState<CareerItem[]>([]);
    const [an, setAn] = useState<CareerItem[]>([]);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const fetchList = async (endpoint: string) => {
            const response = await fetch(endpoint, { signal: controller.signal });
            if (!response.ok) return [];
            const payload = await response.json();
            return getArrayPayload(payload)
                .filter((item): item is CareerItem => typeof item === 'object' && item !== null);
        };

        const loadAll = async () => {
            setLoading(true);

            try {
                const [
                    allCareerData,
                    pcrData,
                    gerData,
                    wedData,
                    wtrData,
                    pedData,
                    ptrData,
                    idData,
                    anData,
                ] = await Promise.all([
                    fetchList(CAREERS_ENDPOINT),
                    fetchList(CAREERS_PCR_ENDPOINT),
                    fetchList(CAREERS_GER_ENDPOINT),
                    fetchList(CAREERS_WED_ENDPOINT),
                    fetchList(CAREERS_WTR_ENDPOINT),
                    fetchList(CAREERS_PED_ENDPOINT),
                    fetchList(CAREERS_PTR_ENDPOINT),
                    fetchList(CAREERS_ID_ENDPOINT),
                    fetchList(CAREERS_AN_ENDPOINT),
                ]);

                if (!active) return;
                setAllCareer(allCareerData);
                setPcr(pcrData);
                setGer(gerData);
                setWed(wedData);
                setWtr(wtrData);
                setPed(pedData);
                setPtr(ptrData);
                setIdcar(idData);
                setAn(anData);
            } catch {
                if (!active) return;
            } finally {
                if (active) setLoading(false);
            }
        };

        loadAll();
        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const tabItems = useMemo(() => {
        const items = [];
        if (pcr.length) items.push({ key: 'pcr', label: t('نتيجه فحص الورق', 'Document review results'), data: pcr });
        if (ger.length) items.push({ key: 'ger', label: t('نتيجه فحص التظلمات', 'Appeals review results'), data: ger });
        if (wed.length) items.push({ key: 'wed', label: t('مواعيد الإختبارات التحريريه', 'Written exam schedules'), data: wed });
        if (wtr.length) items.push({ key: 'wtr', label: t('نتائج الإختبار التحريري', 'Written exam results'), data: wtr });
        if (ped.length) items.push({ key: 'ped', label: t('مواعيد الإختبار العملية', 'Practical exam schedules'), data: ped });
        if (ptr.length) items.push({ key: 'ptr', label: t('نتائج الاختبار العملي', 'Practical exam results'), data: ptr });
        if (idcar.length) items.push({ key: 'id', label: t('مواعيد المقابله الشخصيه', 'Interview schedules'), data: idcar });
        if (an.length) items.push({ key: 'an', label: t('أسماء المقبولين', 'Accepted candidates'), data: an });
        return items;
    }, [an, ger, idcar, isEnglish, pcr, ped, ptr, wed, wtr]);

    useEffect(() => {
        if (tab >= tabItems.length) {
            setTab(0);
        }
    }, [tab, tabItems.length]);

    return (
        <>
            <Header />
            <main className="bg-slate-50" dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <div className="mb-6 border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
                        <h1 className="text-center text-2xl font-medium text-slate-900 sm:text-3xl">
                            {t('نتائج وظائف شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد', 'Results of Assiut and New Valley Water and Wastewater Company Jobs')}
                        </h1>
                    </div>

                    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="space-y-6 px-4 py-3 sm:px-8 sm:py-4">
                            <h1 className="sr-only">
                                {t('نتائج وظائف شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد', 'Results of Assiut and New Valley Water and Wastewater Company Jobs')}
                            </h1>
                            {loading ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center shadow-sm">
                                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                                </div>
                            ) : null}

                            {!loading && allCareer.length >= 1 ? (
                                <section className="rounded-3xl bg-white px-4 pb-5 pt-2 sm:px-5 sm:pb-6 sm:pt-1">
                                    <div className="mb-7 text-center">
                                        <h2 className="text-2xl font-extrabold text-[#0a3555]">
                                            {t('نتائج كل ما يخص إعلان الوظائف', 'All job-announcement results')}
                                        </h2>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-2">
                                        {tabItems.map((item, index) => (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => setTab(index)}
                                                className={`tab-hover-shift rounded-full px-4 py-2.5 text-sm font-bold transition ${
                                                    index === tab
                                                        ? 'bg-[#005f73] text-white shadow-[0_10px_24px_rgba(0,95,115,0.22)]'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                                                }`}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    {renderTabIcon(item.key)}
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        {tabItems[tab] ? renderPanels(tabItems[tab].data, isEnglish, t) : null}
                                    </div>
                                </section>
                            ) : null}

                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ResultOfWorkerPage;
