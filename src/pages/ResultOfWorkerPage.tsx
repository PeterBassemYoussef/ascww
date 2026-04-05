import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

const renderPanels = (items: CareerItem[]) => {
    return (
        <div className="space-y-3">
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
                        className="rounded-xl border border-slate-200 bg-white"
                    >
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
                            {item.title}
                        </summary>
                        <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                            {descriptionHtml ? (
                                <div
                                    className="ql-editor text-sm text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                />
                            ) : null}
                            {downloadUrl ? (
                                <div className="text-sm font-semibold text-green-700">
                                    لتحميل الملف أضغط هنا{' '}
                                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                        ⤓
                                    </a>
                                </div>
                            ) : null}
                            {fileUrl ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <iframe
                                        title={item.title || 'ملف'}
                                        src={pdfEmbedUrl}
                                        className="h-[520px] w-full"
                                    />
                                </div>
                            ) : null}
                            {imageUrl ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200">
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
                // intentionally silent
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
        if (pcr.length) items.push({ key: 'pcr', label: 'نتيجه فحص الورق', data: pcr });
        if (ger.length) items.push({ key: 'ger', label: 'نتيجه فحص التظلمات', data: ger });
        if (wed.length) items.push({ key: 'wed', label: 'مواعيد الإختبارات التحريريه', data: wed });
        if (wtr.length) items.push({ key: 'wtr', label: 'نتائج الإختبار التحريري', data: wtr });
        if (ped.length) items.push({ key: 'ped', label: 'مواعيد الإختبار العملية', data: ped });
        if (ptr.length) items.push({ key: 'ptr', label: 'نتائج الاختبار العملي', data: ptr });
        if (idcar.length) items.push({ key: 'id', label: 'مواعيد المقابله الشخصيه', data: idcar });
        if (an.length) items.push({ key: 'an', label: 'أسماء المقبولين', data: an });
        return items;
    }, [pcr, ger, wed, wtr, ped, ptr, idcar, an]);

    useEffect(() => {
        if (tab >= tabItems.length) {
            setTab(0);
        }
    }, [tab, tabItems.length]);

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-6xl px-4 py-8" dir="rtl">
                <div className="mb-6 text-right text-xl font-semibold text-slate-900">
                    نتائج وظائف شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد
                </div>

                {allCareer.length >= 1 ? (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-4 text-center text-lg font-bold text-[#0a3555]">
                            نتائج كل ما يخص إعلان الوظائف
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {tabItems.map((item, index) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setTab(index)}
                                    className={`tab-hover-shift rounded-full px-4 py-2 text-sm font-semibold transition ${index === tab
                                            ? 'bg-[#0a3555] text-white'
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
                            {tabItems[tab] ? renderPanels(tabItems[tab].data) : null}
                        </div>
                    </section>
                ) : null}
            </main>
            <Footer />
        </>
    );
}

export default ResultOfWorkerPage;
