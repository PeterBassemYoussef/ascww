import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProjectsShowcase from './ProjectsShowcase';
import CompanyStats from './CompanyStats';
import { useSiteLanguage } from '../context/SiteLanguageContext';

function MainContent() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

    return (
        <>
            {/* الخدمات الإلكترونية */}
            <section id="our-services" dir={isEnglish ? 'ltr' : 'rtl'} className="bg-slate-50 py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center animate-on-scroll sm:mb-16">
                        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">{t('خدماتنا الإلكترونية', 'Our E-Services')}</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="animate-on-scroll h-full" data-delay="50">
                            <a href="http://bills.ascww.com.eg/Inqeury.aspx" target="_blank" rel="noopener noreferrer" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="flex h-full flex-col transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        <img
                                            src="/images/services/inquire-bill.webp"
                                            alt={t('استعلم عن فاتورتك', 'Check your bill')}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">{t('استعلم عن فاتورتك', 'Check your bill')}</h3>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="100">
                            <Link to={ROUTES.myReadingApp} className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="flex h-full flex-col transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        <img
                                            src="/images/services/enter-reading.webp"
                                            alt={t('أدخل قراءة عدادك', 'Enter your meter reading')}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">{t('أدخل قراءة عدادك', 'Enter your meter reading')}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="150">
                            <Link to={ROUTES.hotlineApp} className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="flex h-full flex-col transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        <img
                                            src="/images/services/hotline.webp"
                                            alt={t('تطبيق الخط الساخن', 'Hotline app')}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">{t('تطبيق الخط الساخن', 'Hotline app')}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="200">
                            <Link to={ROUTES.myReadingApp} className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="flex h-full flex-col transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        <img
                                            src="/images/services/readme.webp"
                                            alt={t('تطبيق قراءتي', 'My Reading app')}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">{t('تطبيق قراءتي', 'My Reading app')}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectsShowcase />
            <CompanyStats />

        </>
    );
}

export default memo(MainContent);
