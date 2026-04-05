import { memo, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../types';
import {
    PROJECTS_ENDPOINT,
    PROJECTS_ARCHIVE_PATH,
    PROJECT_IMAGE_ENDPOINT,
    extractPlainTextFromHtml,
    getProjectImagePath,
    truncateText,
} from '../utils/helpers';

const PROJECT_AUTOPLAY_MS = 18000;

function ProjectsShowcase() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadProjects = async () => {
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
                    .filter((item) => Number(item.active ?? 1) !== 0);

                if (!active) return;
                setProjects(validProjects);
                setActiveIndex(0);
            } catch {
                if (!active) return;
                setProjectsError('تعذر تحميل المشاريع حاليًا.');
            } finally {
                if (active) setProjectsLoading(false);
            }
        };

        loadProjects();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (projects.length <= 1) return;
        const timerId = window.setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, PROJECT_AUTOPLAY_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [activeIndex, projects.length]);

    const currentProject = useMemo(() => {
        if (projects.length === 0) return null;
        const safeIndex = Math.min(activeIndex, projects.length - 1);
        return projects[safeIndex];
    }, [projects, activeIndex]);

    if (projectsLoading) {
        return (
            <section id="home-projects" className="bg-white py-12 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                        جاري تحميل المشاريع...
                    </div>
                </div>
            </section>
        );
    }

    if (projectsError) {
        return (
            <section id="home-projects" className="bg-white py-12 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center font-semibold text-amber-800">
                        {projectsError}
                    </div>
                </div>
            </section>
        );
    }

    if (!currentProject) return null;

    const projectImagePath = getProjectImagePath(currentProject);
    const projectImageUrl = projectImagePath ? `${PROJECT_IMAGE_ENDPOINT}/${encodeURIComponent(projectImagePath)}` : '';
    const projectDescription = truncateText(extractPlainTextFromHtml(currentProject.description), 680);

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const goToPrev = () => {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    return (
        <section id="home-projects" className="bg-white py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">مشـروعاتنا</h2>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
                    <div className="grid lg:grid-cols-2">
                        <div className="order-2 p-5 sm:p-8 lg:order-1 lg:p-10">
                            <h3 className="break-words text-justify text-2xl font-extrabold text-slate-900 sm:text-3xl">{currentProject.title || 'مشروع'}</h3>
                            <div className="mt-3 h-[3px] w-36 bg-[#d7b05a]"></div>
                            <p className="mt-5 text-justify text-base leading-8 text-slate-700 sm:mt-6 sm:text-lg sm:leading-9">
                                {projectDescription || 'لا يوجد وصف متاح لهذا المشروع.'}
                            </p>
                            <div className="mt-6 text-center sm:mt-8">
                                <Link
                                    to={PROJECTS_ARCHIVE_PATH}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-8 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:from-[#082b47] hover:to-[#0a3555]"
                                >
                                    <span>أرشيف المشروعات</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 lg:pt-12">
                            <div className="relative flex items-center justify-center px-10 py-4 sm:px-14 lg:px-16 lg:py-6">
                                <div className="relative w-full max-w-[780px] sm:max-w-[860px] lg:max-w-[980px]">
                                    {projects.length > 1 && (
                                        <div className="home-project-progress-top" aria-hidden="true">
                                            <span
                                                key={`project-progress-${activeIndex}`}
                                                className="home-project-progress-top-fill"
                                                style={{ animationDuration: `${PROJECT_AUTOPLAY_MS}ms` }}
                                            ></span>
                                        </div>
                                    )}

                                    <div className="home-project-image-frame relative w-full aspect-[6/5] overflow-hidden bg-transparent">
                                        {projectImageUrl ? (
                                            <img
                                                src={projectImageUrl}
                                                alt={currentProject.title || 'صورة مشروع'}
                                                className="absolute inset-0 !h-full !w-full object-cover object-center"
                                                loading="lazy"
                                                decoding="async"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : null}

                                        {projects.length > 1 && (
                                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                                {projects.map((project, index) => (
                                                    <button
                                                        key={project.id ?? `project-dot-${index}`}
                                                        type="button"
                                                        aria-label={`عرض مشروع ${index + 1}`}
                                                        onClick={() => setActiveIndex(index)}
                                                        className={`project-dot ${index === activeIndex ? 'project-dot--active project-slider-dot project-slider-dot--active' : 'project-slider-dot'}`}
                                                    ></button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {projects.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="المشروع السابق"
                                            onClick={goToPrev}
                                            className="absolute left-2 top-1/2 inline-flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-b from-black/70 to-black/80 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/60 hover:from-black/85 hover:to-black/90 hover:shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="المشروع التالي"
                                            onClick={goToNext}
                                            className="absolute right-2 top-1/2 inline-flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-b from-black/70 to-black/80 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/60 hover:from-black/85 hover:to-black/90 hover:shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(ProjectsShowcase);

