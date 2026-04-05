import { memo, useEffect, useRef, useState } from 'react';

type CompanyStat = {
    id: string;
    label: string;
    value: number;
    icon: JSX.Element;
    iconWrapClass: string;
    barClass: string;
};

const companyStats: CompanyStat[] = [
    {
        id: 'wastewater-stations',
        label: 'محطات الصرف',
        value: 57,
        iconWrapClass: 'bg-sky-100 text-sky-700',
        barClass: 'bg-sky-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <circle cx="5" cy="5" r="2"></circle>
                <circle cx="19" cy="9" r="2"></circle>
                <circle cx="5" cy="19" r="2"></circle>
                <path d="M7 5h4a4 4 0 0 1 4 4v0"></path>
                <path d="M5 7v10"></path>
                <path d="M7 19h8"></path>
            </svg>
        ),
    },
    {
        id: 'drinking-stations',
        label: 'محطات الشرب',
        value: 278,
        iconWrapClass: 'bg-indigo-100 text-indigo-700',
        barClass: 'bg-indigo-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <path d="M3 21h18"></path>
                <path d="M6 21V9h6v12"></path>
                <path d="M14 21V4h6v17"></path>
                <path d="M16 7h2"></path>
                <path d="M8 12h2"></path>
                <path d="M8 16h2"></path>
            </svg>
        ),
    },
    {
        id: 'subscribers',
        label: 'مشترك',
        value: 752981,
        iconWrapClass: 'bg-emerald-100 text-emerald-700',
        barClass: 'bg-emerald-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <circle cx="8" cy="9" r="3"></circle>
                <circle cx="16.5" cy="9.5" r="2.5"></circle>
                <path d="M2.5 19a5.5 5.5 0 0 1 11 0"></path>
                <path d="M13.5 19a4.5 4.5 0 0 1 8 0"></path>
            </svg>
        ),
    },
    {
        id: 'labs',
        label: 'معمل',
        value: 5,
        iconWrapClass: 'bg-amber-100 text-amber-700',
        barClass: 'bg-amber-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <path d="M10 3v5l-5.5 9A2 2 0 0 0 6.2 20h11.6a2 2 0 0 0 1.7-3L14 8V3"></path>
                <path d="M8 13h8"></path>
            </svg>
        ),
    },
    {
        id: 'workers',
        label: 'عامل',
        value: 8338,
        iconWrapClass: 'bg-rose-100 text-rose-700',
        barClass: 'bg-rose-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M4 20a8 8 0 0 1 16 0"></path>
                <path d="M6 4.5A8.5 8.5 0 0 1 12 2a8.5 8.5 0 0 1 6 2.5"></path>
            </svg>
        ),
    },
];

const numberFormatter = new Intl.NumberFormat('en-US');

function CompanyStats() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [displayValues, setDisplayValues] = useState<number[]>(() => companyStats.map(() => 0));

    useEffect(() => {
        if (hasAnimated) return;
        const sectionElement = sectionRef.current;
        if (!sectionElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(sectionElement);
        return () => observer.disconnect();
    }, [hasAnimated]);

    useEffect(() => {
        if (!hasAnimated) return;

        const animationDurationMs = 2200;
        const animationStart = performance.now();
        let animationFrame = 0;

        const animateNumbers = (timestamp: number) => {
            const progress = Math.min((timestamp - animationStart) / animationDurationMs, 1);
            const easedProgress = 1 - (1 - progress) ** 3;

            setDisplayValues(companyStats.map((stat) => Math.round(stat.value * easedProgress)));

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(animateNumbers);
            }
        };

        animationFrame = window.requestAnimationFrame(animateNumbers);
        return () => window.cancelAnimationFrame(animationFrame);
    }, [hasAnimated]);

    return (
        <section id="company-stats" ref={sectionRef} className="relative overflow-hidden bg-slate-100/85 py-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-[#0a3555]/8 blur-3xl"></div>
                <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#d7b05a]/20 blur-3xl"></div>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {companyStats.map((stat, index) => (
                        <article
                            key={stat.id}
                            className="animate-on-scroll group relative overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(10,53,85,0.18)]"
                            data-delay={String(60 + index * 70)}
                        >
                            <div className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconWrapClass}`}>
                                {stat.icon}
                            </div>
                            <p className="mt-4 text-3xl font-normal tracking-tight text-slate-900">
                                {numberFormatter.format(displayValues[index] ?? 0)}
                            </p>
                            <p className="mt-2 text-lg font-bold text-slate-700">{stat.label}</p>
                            <div className={`mx-auto mt-4 h-1 w-12 rounded-full ${stat.barClass}`}></div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(CompanyStats);
