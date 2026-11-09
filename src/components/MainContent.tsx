import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProjectsShowcase from './ProjectsShowcase';
import CompanyStats from './CompanyStats';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type ServiceIconName =
    | 'portal'
    | 'bill'
    | 'payment'
    | 'meter'
    | 'hotline'
    | 'reading'
    | 'booking'
    | 'wastewater'
    | 'filter'
    | 'water'
    | 'tank'
    | 'calibration';

type HomeService = {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    category: { ar: string; en: string };
    href: string;
    icon: ServiceIconName;
    external?: boolean;
};

const homeServices: HomeService[] = [
    { title: { ar: 'المنصة الرقمية لخدمات مياه الشرب والصرف الصحي', en: 'Digital Platform for Water and Sanitation Services' }, description: { ar: 'أنجز معاملات خدمات مياه الشرب والصرف الصحي إلكترونيًا من مكان واحد.', en: 'Complete water and sanitation service transactions online in one place.' }, category: { ar: 'منصة رقمية', en: 'Digital platform' }, href: 'https://dsp.hcww.com.eg/', icon: 'portal', external: true },
    { title: { ar: 'الاستعلام عن الفاتورة', en: 'Check Your Bill' }, description: { ar: 'استعلم عن قيمة فاتورة مياه الشرب والصرف الصحي بسهولة.', en: 'Check your drinking water and sanitation bill details.' }, category: { ar: 'الفواتير', en: 'Billing' }, href: 'https://dsp.hcww.com.eg/bills', icon: 'bill', external: true },
    { title: { ar: 'سداد الفاتورة', en: 'Pay Your Bill' }, description: { ar: 'سدّد فاتورتك إلكترونيًا عبر المنصة الرقمية.', en: 'Pay your bill online through the digital platform.' }, category: { ar: 'الفواتير', en: 'Billing' }, href: 'https://dsp.hcww.com.eg/bills', icon: 'payment', external: true },
    { title: { ar: 'تسجيل قراءة العداد', en: 'Submit a Meter Reading' }, description: { ar: 'سجّل قراءة عداد المياه إلكترونيًا.', en: 'Submit your water meter reading online.' }, category: { ar: 'عدادات المياه', en: 'Water meters' }, href: 'https://dsp.hcww.com.eg/reading', icon: 'meter', external: true },
    { title: { ar: 'تطبيق الخط الساخن', en: 'Hotline App' }, description: { ar: 'تواصل مع خدمة الخط الساخن للشكاوى والخدمات.', en: 'Reach hotline support for complaints and services.' }, category: { ar: 'تطبيقات', en: 'Apps' }, href: ROUTES.hotlineApp, icon: 'hotline' },
    { title: { ar: 'تطبيق قراءتي', en: 'My Reading App' }, description: { ar: 'استخدم تطبيق قراءتي لتسجيل قراءات عداد المياه.', en: 'Use My Reading to submit your water meter readings.' }, category: { ar: 'تطبيقات', en: 'Apps' }, href: ROUTES.myReadingApp, icon: 'reading' },
    { title: { ar: 'حجز القاعات', en: 'Book a Training Hall' }, description: { ar: 'تعرّف على قاعات التدريب وقدّم طلب الحجز إلكترونيًا.', en: 'Explore the training halls and submit a booking request online.' }, category: { ar: 'التدريب', en: 'Training' }, href: `${ROUTES.trainingHallsBooking}#booking-form`, icon: 'booking' },
    { title: { ar: 'تحليل عينات مياه الصرف الصحي', en: 'Wastewater Sample Analysis' }, description: { ar: 'اطلب خدمة تحليل عينات مياه الصرف الصحي من معامل الشركة.', en: 'Request wastewater sample analysis from the company laboratories.' }, category: { ar: 'المعامل', en: 'Laboratories' }, href: `${ROUTES.laboratoriesSectorServices}#wastewater-sample-service`, icon: 'wastewater' },
    { title: { ar: 'فحص عينات وسط ترشيحي', en: 'Filter Media Sample Testing' }, description: { ar: 'اطلب فحص عينات الوسط الترشيحي لدى معامل الشركة.', en: 'Request filter media sample testing at the company laboratories.' }, category: { ar: 'المعامل', en: 'Laboratories' }, href: `${ROUTES.laboratoriesSectorServices}#sand-gravel-sample-service`, icon: 'filter' },
    { title: { ar: 'تحليل عينات مياه الشرب', en: 'Drinking Water Sample Analysis' }, description: { ar: 'تحقق من جودة مياه الشرب من خلال خدمة تحليل العينات.', en: 'Check drinking water quality with the sample analysis service.' }, category: { ar: 'المعامل', en: 'Laboratories' }, href: `${ROUTES.laboratoriesSectorServices}#drinking-water-sample-service`, icon: 'water' },
    { title: { ar: 'غسيل وتطهير الخزانات', en: 'Tank Cleaning and Disinfection' }, description: { ar: 'اطلب خدمة غسيل وتطهير خزانات المياه.', en: 'Request water tank cleaning and disinfection.' }, category: { ar: 'المعامل', en: 'Laboratories' }, href: `${ROUTES.laboratoriesSectorServices}#tank-cleaning-service`, icon: 'tank' },
    { title: { ar: 'معايرة الأجهزة', en: 'Instrument Calibration' }, description: { ar: 'اطلب معايرة الأجهزة لدى معامل الشركة.', en: 'Request instrument calibration at the company laboratories.' }, category: { ar: 'المعامل', en: 'Laboratories' }, href: `${ROUTES.laboratoriesSectorServices}#instrument-calibration-form`, icon: 'calibration' },
];

function ServiceIcon({ name }: { name: ServiceIconName }) {
    const iconPaths: Record<ServiceIconName, string> = {
        portal: 'M3 4h18v13H3z M8 21h8 M12 17v4 M7 8h4 M7 12h10 M15 8h2',
        bill: 'M6 3h9l4 4v14H6z M14 3v5h5',
        payment: 'M3 6h18v13H3z M3 10h18 M7 15h4',
        meter: 'M8 3h8v3H8z M9 6v1 M15 6v1 M10.5 17.5V21 M14.5 17.5V21 M8.5 21h8 M10.5 20h4 M5 12a5.5 5.5 0 1 0 11 0a5.5 5.5 0 0 0-11 0z M7 12a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0z M10.5 12l1.8-1.6',
        hotline: 'M4 13v-2a8 8 0 0 1 16 0v2 M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2 M20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2 M17 19a6 6 0 0 1-5 2',
        reading: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 M9 5h6 M10 18h4 M12 8c-2 2-3 3.5-3 5a3 3 0 0 0 6 0c0-1.5-1-3-3-5z',
        booking: 'M3 21V5l9-3 9 3v16 M3 10h18 M8 21v-6h8v6 M7 7h.01 M12 7h.01 M17 7h.01',
        wastewater: 'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M8 15h8 M10 18h4',
        filter: 'M3 5h18l-7 8v6l-4 2v-8z M7 9h10',
        water: 'M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z M9 16a3 3 0 0 0 3 3',
        tank: 'M7 3h10v2h2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5h2z M9 21v1 M15 21v1 M7 22h10',
        calibration: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M2 14h4 M10 8h4 M18 16h4',
    };
    const iconAccentPaths: Record<ServiceIconName, string> = {
        portal: 'M7 8h4',
        bill: 'M9 11h7 M9 16h7',
        payment: 'M7 15h4',
        meter: 'M10.5 12l1.8-1.6',
        hotline: 'M9 10a3 3 0 0 1 6 0',
        reading: 'M12 8c-2 2-3 3.5-3 5a3 3 0 0 0 6 0c0-1.5-1-3-3-5z',
        booking: 'M7 7h.01 M12 7h.01 M17 7h.01',
        wastewater: 'M8 15h8',
        filter: 'M7 9h10',
        water: 'M9 16a3 3 0 0 0 3 3',
        tank: 'M9 10l.35.75.75.35-.75.35L9 12.2l-.35-.75-.75-.35.75-.35z M15 10l.35.75.75.35-.75.35-.35.75-.35-.75-.75-.35.75-.35z M12 14l.35.75.75.35-.75.35-.35.75-.35-.75-.75-.35.75-.35z',
        calibration: 'M10 8h4',
    };

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#0a3555" strokeWidth={name === 'meter' ? 1.4 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <path d={iconPaths[name]} />
            {iconAccentPaths[name] && <path d={iconAccentPaths[name]} stroke="#d7b05a" strokeWidth={name === 'tank' || name === 'meter' ? 1.5 : 2} />}
        </svg>
    );
}

function HomeServiceCard({ service, index, isEnglish }: { service: HomeService; index: number; isEnglish: boolean }) {
    const title = isEnglish ? service.title.en : service.title.ar;
    const description = isEnglish ? service.description.en : service.description.ar;
    const category = isEnglish ? service.category.en : service.category.ar;
    const linkClass = `group flex min-h-[236px] h-full flex-col rounded-md border border-blue-200 bg-white p-4 ${isEnglish ? 'text-left' : 'text-right'} shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1170b0]`;
    const cardContent = (
        <>
            <div className="flex items-start justify-between gap-3">
                <ServiceIcon name={service.icon} />
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800">{category}</span>
                </div>
            </div>
            <div className="mt-3">
                <h3 className="text-base font-bold leading-7 text-slate-950">{title}</h3>
                <span className="mt-1 block h-0.5 w-10 bg-[#d7b05a] transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:from-[#082b47] group-hover:to-[#0a3555]">
                {isEnglish ? 'Open service' : 'استخدم الخدمة'}
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 ${isEnglish ? '' : 'rotate-180'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </>
    );

    return (
        <div className="animate-on-scroll h-full" data-delay={50 + index * 35}>
            {service.external ? (
                <a href={service.href} target="_blank" rel="noopener noreferrer" aria-label={`${title} — ${isEnglish ? 'Open service' : 'استخدم الخدمة'}`} className={linkClass}>
                    {cardContent}
                </a>
            ) : (
                <Link to={service.href} aria-label={`${title} — ${isEnglish ? 'Open service' : 'استخدم الخدمة'}`} className={linkClass}>
                    {cardContent}
                </Link>
            )}
        </div>
    );
}

function MainContent() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

    return (
        <>
            {/* الخدمات الإلكترونية */}
            <section id="our-services" dir={isEnglish ? 'ltr' : 'rtl'} className="scroll-mt-28 bg-slate-50 py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center animate-on-scroll sm:mb-16">
                        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">{t('خدماتنا الإلكترونية', 'Our E-Services')}</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {homeServices.map((service, index) => (
                            <HomeServiceCard key={`${service.href}-${service.icon}`} service={service} index={index} isEnglish={isEnglish} />
                        ))}
                    </div>
                </div>
            </section>

            <ProjectsShowcase />
            <CompanyStats />

        </>
    );
}

export default memo(MainContent);
