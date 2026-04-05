import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { buildSearchApiUrl, normalizeSearchPayload, type SearchResultItem } from '../utils/helpers';

const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = String(searchParams.get('q') || '').trim();
    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'tenders' | 'news'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        setSearchTerm(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        const trimmed = initialQuery.trim();
        if (trimmed.length < 2) {
            setResults([]);
            setIsSearching(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const load = async () => {
            setIsSearching(true);
            setError(null);

            try {
                const response = await fetch(buildSearchApiUrl(trimmed), {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`Search request failed with status ${response.status}`);
                }
                const payload = (await response.json()) as unknown;
                setResults(normalizeSearchPayload(payload));
            } catch (err) {
                if ((err as Error).name === 'AbortError') return;
                setResults([]);
                setError('تعذر تنفيذ البحث الآن. حاول مرة أخرى.');
            } finally {
                setIsSearching(false);
            }
        };

        load();
        return () => controller.abort();
    }, [initialQuery]);

    const hasQuery = initialQuery.trim().length >= 2;
    const totalResults = results.length;
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = searchTerm.trim();
        if (trimmed.length < 2) return;
        setSearchParams({ q: trimmed });
    };

    const newsCount = useMemo(() => results.filter((item) => item.kind === 'news').length, [results]);
    const tenderCount = useMemo(() => results.filter((item) => item.kind === 'tender').length, [results]);
    const projectCount = useMemo(() => results.filter((item) => item.kind === 'project').length, [results]);
    const filteredResults = useMemo(() => {
        if (activeTab === 'news') {
            return results.filter((item) => item.kind === 'news');
        }
        if (activeTab === 'tenders') {
            return results.filter((item) => item.kind === 'tender');
        }
        if (activeTab === 'projects') {
            return results.filter((item) => item.kind === 'project');
        }
        return results;
    }, [activeTab, results]);
    const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredResults.length / pageSize)), [filteredResults.length, pageSize]);
    const displayedFilteredResults = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredResults.slice(start, start + pageSize);
    }, [currentPage, filteredResults, pageSize]);

    const statsLabel = hasQuery
        ? `تم العثور على ${totalResults} نتيجة (أخبار: ${newsCount} - مناقصات: ${tenderCount} - مشروعات: ${projectCount})`
        : 'ابدأ بكتابة كلمة البحث لعرض النتائج.';

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, initialQuery]);

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-6xl px-4 py-10" dir="rtl">
                <section className="rounded-3xl border border-[#d7b05a]/35 bg-gradient-to-br from-[#0a3555]/10 via-white to-white p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0a3555] sm:text-3xl">نتائج البحث</h1>
                            <p className="mt-2 text-sm text-slate-600">{statsLabel}</p>
                        </div>
                        <form onSubmit={onSubmit} className="w-full sm:w-96">
                            <div className="flex items-center rounded-full border border-[#d7b05a]/50 bg-white px-3 py-2 transition-colors hover:border-[#0a3555]/60">
                                <span className="ml-1 text-[#0a3555]/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </span>
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="ابحث في أخبار الشركة وخدماتها..."
                                    className="h-9 w-full bg-transparent px-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="mr-1 inline-flex h-9 items-center justify-center rounded-full bg-[#0a3555] px-4 text-sm font-semibold text-white transition hover:bg-[#082b47]"
                                >
                                    بحث
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="mt-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'all'
                                ? 'bg-[#0a3555] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-sky-400 to-blue-500 text-white">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </span>
                            البحث
                            {totalResults ? ` (${totalResults})` : ''}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('news')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'news'
                                ? 'bg-[#0a3555] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 text-white">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M4 4h16v16H4z" />
                                    <path d="M8 8h8" />
                                    <path d="M8 12h8" />
                                    <path d="M8 16h5" />
                                </svg>
                            </span>
                            الأخبار
                            {newsCount ? ` (${newsCount})` : ''}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('tenders')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'tenders'
                                ? 'bg-[#0a3555] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400 text-white">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <path d="M7 8h10" />
                                    <path d="M7 12h10" />
                                    <path d="M7 16h6" />
                                </svg>
                            </span>
                            المناقصات
                            {tenderCount ? ` (${tenderCount})` : ''}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'projects'
                                ? 'bg-[#0a3555] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-green-400 to-lime-500 text-white">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M3 7h18" />
                                    <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
                                    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                            </span>
                            المشروعات
                            {projectCount ? ` (${projectCount})` : ''}
                        </button>
                    </div>
                    {isSearching ? (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-500">
                            جاري البحث...
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                            {error}
                        </div>
                    ) : !hasQuery ? (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-500">
                            اكتب عبارة البحث لعرض النتائج.
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-500">
                            لا توجد نتائج مطابقة.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayedFilteredResults.map((item) => {
                                const tenderMatcher = /مناقصة|مناقص/;
                                const isTenderItem =
                                    item.kind === 'tender' ||
                                    tenderMatcher.test(item.typeLabel) ||
                                    tenderMatcher.test(item.title);
                                const metaText = [item.typeLabel, item.dateLabel].filter(Boolean).join(' - ');
                                const cardContent = (
                                    <article className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#0a3555]/40">
                                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#0a3555]/15 to-[#d7b05a]/20">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[#0a3555]/70">
                                                    {isTenderItem ? 'مناقصة' : item.typeLabel}
                                                </div>
                                            )}
                                            {isTenderItem ? (
                                                <span className="absolute inset-2 flex items-center justify-center rounded-lg bg-white/90 text-xs font-bold text-[#0a3555]">
                                                    مناقصة
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1 text-right">
                                            {metaText ? (
                                                <div className="mb-1 text-xs font-semibold text-[#0a3555]/75">
                                                    {metaText}
                                                </div>
                                            ) : null}
                                            <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#0a3555]">
                                                {item.title}
                                            </h2>
                                            {item.description ? (
                                                <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                            {item.url ? (
                                                <span className="mt-3 inline-flex items-center text-xs font-semibold text-[#0a3555]">
                                                    عرض التفاصيل
                                                </span>
                                            ) : null}
                                        </div>
                                    </article>
                                );

                                if (!item.url) {
                                    return <div key={item.key}>{cardContent}</div>;
                                }

                                if (isExternalUrl(item.url)) {
                                    return (
                                        <a
                                            key={item.key}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            {cardContent}
                                        </a>
                                    );
                                }

                                return (
                                    <Link key={item.key} to={item.url} className="block">
                                        {cardContent}
                                    </Link>
                                );
                            })}
                            {filteredResults.length > pageSize ? (
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0a3555]/40 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        السابق
                                    </button>
                                    <span className="text-sm font-semibold text-slate-600">
                                        صفحة {currentPage} من {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0a3555]/40 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        التالي
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default SearchPage;
