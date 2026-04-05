import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import type { ProjectItem } from '../types';
import { PROJECTS_ENDPOINT } from '../utils/helpers';

const ITEMS_PER_LOAD = 6;

function ProjectsArchive() {
    const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const appendPage = useCallback((nextPage: number, source: ProjectItem[]) => {
        const nextItems = source.slice(0, nextPage * ITEMS_PER_LOAD);
        setProjects(nextItems);
        setHasMore(nextItems.length < source.length);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadProjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(PROJECTS_ENDPOINT, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Projects request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const rawProjectItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.value)
                        ? payloadObject.value
                        : Array.isArray(payloadObject.data)
                            ? payloadObject.data
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validProjects = rawProjectItems
                    .filter((item): item is ProjectItem => typeof item === 'object' && item !== null)
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
                setAllProjects(validProjects);
                appendPage(1, validProjects);
            } catch {
                if (!active) return;
                setError('فشل تحميل المشروعات. يرجى المحاولة مرة أخرى.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProjects();
        return () => {
            active = false;
            controller.abort();
        };
    }, [appendPage]);

    const loadMore = useCallback(() => {
        if (loading || loadingMore || !hasMore) return;
        setLoadingMore(true);
        window.setTimeout(() => {
            setProjects((prevItems) => {
                const nextCount = prevItems.length + ITEMS_PER_LOAD;
                const nextItems = allProjects.slice(0, nextCount);
                setHasMore(nextItems.length < allProjects.length);
                return nextItems;
            });
            setLoadingMore(false);
        }, 0);
    }, [allProjects, hasMore, loading, loadingMore]);

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

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 py-8" dir="rtl">
                <div className="mb-10 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">أرشيف المشروعات</h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        تصفح مشروعات الشركة وتفاصيل التنفيذ.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        <p className="font-medium text-gray-500">جاري تحميل المشروعات...</p>
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
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.id ?? project.slug} project={project} />
                            ))}
                        </div>

                        {loadingMore && (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                            </div>
                        )}

                        {projects.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                لا توجد مشروعات لعرضها حاليًا.
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default ProjectsArchive;

