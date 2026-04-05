import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import {
    NEWS_ARCHIVE_PATH,
    NEWS_IMAGE_ENDPOINT,
    getLatestNewsImagePath,
    getNewsDetailsPath,
    truncateText,
    extractPlainTextFromHtml,
    formatArabicDate,
} from '../utils/helpers';

type LatestNewsProps = {
    latestNews: NewsItem[];
    newsLoading: boolean;
    newsError: string | null;
};

function LatestNews({ latestNews, newsLoading, newsError }: LatestNewsProps) {
    const preparedNews = useMemo(
        () =>
            latestNews.map((newsItem, index) => {
                const imagePath = getLatestNewsImagePath(newsItem);
                const imageUrl = imagePath ? `${NEWS_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}` : '';
                const detailsPath = getNewsDetailsPath(newsItem);
                const articleTitle = truncateText((newsItem.title || 'بدون عنوان').trim(), 80);
                const articleExcerpt = truncateText(extractPlainTextFromHtml(newsItem.description), 100) || 'للاطلاع على كامل الخبر يمكن زيارة أرشيف الأخبار.';
                const articleDate = formatArabicDate(newsItem.created_at || newsItem.updated_at);

                return {
                    key: newsItem.id ?? `${newsItem.slug || 'news'}-${index}`,
                    index,
                    imageUrl,
                    detailsPath,
                    articleTitle,
                    articleExcerpt,
                    articleDate,
                    newsItem,
                };
            }),
        [latestNews]
    );

    return (
        <section id="latest-news" className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">أحدث الأخبار</h2>
                </div>

                <div>
                    {newsLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <article key={`news-loading-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    <div className="h-44 w-full animate-pulse bg-slate-200"></div>
                                    <div className="space-y-3 p-4">
                                        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200"></div>
                                        <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
                                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : newsError ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
                            {newsError}
                        </div>
                    ) : latestNews.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                            لا توجد أخبار متاحة حاليًا.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {preparedNews.map(({ key, index, imageUrl, detailsPath, articleTitle, articleExcerpt, articleDate, newsItem }) => (
                                <article
                                    key={key}
                                    className="flex h-full flex-col animate-on-scroll overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                    data-delay={60 + index * 60}
                                >
                                    <Link to={detailsPath} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={newsItem.title || 'صورة الخبر'}
                                                className="absolute inset-0 !h-full !w-full object-cover transition duration-500 hover:scale-105"
                                                loading="lazy"
                                                decoding="async"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                            {articleDate && (
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                    </svg>
                                                    <span>{articleDate}</span>
                                                </div>
                                            )}
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span>المركز الإعلامي</span>
                                        </div>

                                        <h3 className="mb-2 text-base font-bold leading-snug text-slate-900 transition hover:text-[#0a3555] line-clamp-2">
                                            <Link to={detailsPath} title={newsItem.title}>{articleTitle}</Link>
                                        </h3>

                                        <p className="mb-4 text-sm text-justify leading-relaxed text-slate-600 line-clamp-3">
                                            {articleExcerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!newsLoading && !newsError && latestNews.length > 0 && (
                        <div className="mt-8 text-center">
                            <Link
                                to={NEWS_ARCHIVE_PATH}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-8 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:from-[#082b47] hover:to-[#0a3555]"
                            >
                                <span>أرشيف الاخبار</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default memo(LatestNews);
