import { Link } from 'react-router-dom';
import { memo } from 'react';
import type { ProjectItem } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import {
    PROJECT_IMAGE_ENDPOINT,
    getProjectDetailsPath,
    getProjectImagePath,
} from '../utils/helpers';

type ProjectCardProps = {
    project: ProjectItem;
};

function ProjectCard({ project }: ProjectCardProps) {
    const { speak, stop, isReading } = useSpeech();
    const imagePath = getProjectImagePath(project);
    const imageUrl = imagePath ? `${PROJECT_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}` : '';
    const projectPath = getProjectDetailsPath(project);
    const projectUrl = `${window.location.origin}${projectPath}`;

    const stripHtml = (html?: string) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    };

    const contentText = stripHtml(project.description);
    const shareDescription = contentText.slice(0, 140);
    return (
        <div className="project-card group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" dir="rtl">
            <Link to={projectPath} className="relative block h-48 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={project.title || 'صورة المشروع'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">لا توجد صورة</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-row-reverse items-center space-x-4 space-x-reverse text-xs text-gray-500">
                    <span className="flex max-w-[150px] flex-row-reverse items-center truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                       قسم المشروعات
                    </span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-justify text-lg font-bold leading-tight text-gray-900 transition-colors hover:text-blue-600">
                    <Link to={projectPath}>{project.title || 'بدون عنوان'}</Link>
                </h3>

                <p className="mb-4 line-clamp-3 flex-1 text-justify text-sm text-gray-600">{contentText}</p>

                <div className="project-card-footer mt-auto flex flex-row-reverse items-center justify-between border-t border-gray-100 pt-4">
                    <Link
                        to={projectPath}
                        className="group flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        اقرأ المزيد
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <div className="project-card-actions flex gap-2">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                const quote = `${project.title || ''}\n${shareDescription}`;
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}&quote=${encodeURIComponent(quote)}`,
                                    '_blank'
                                );
                            }}
                            className="rounded-full bg-blue-50 p-1.5 text-blue-600 transition-colors hover:bg-blue-100"
                            title="مشاركة على فيسبوك"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                const text = `${project.title || ''}\n${shareDescription}\n${projectUrl}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="rounded-full bg-green-50 p-1.5 text-green-600 transition-colors hover:bg-green-100"
                            title="مشاركة على واتساب"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                            </svg>
                        </button>
                        {!isReading ? (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const text = `${project.title || ''}. ${contentText}`;
                                    speak(text, 'ar-SA');
                                }}
                                className="rounded-full bg-purple-50 p-1.5 text-purple-600 transition-colors hover:bg-purple-100"
                                title="اقرأ المقال"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    stop();
                                }}
                                className="rounded-full bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100"
                                title="إيقاف القراءة"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(ProjectCard);

