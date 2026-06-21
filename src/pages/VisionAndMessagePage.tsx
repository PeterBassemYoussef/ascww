import Footer from '../components/Footer';
import Header from '../components/Header';
import AboutSidebarWidget from '../components/AboutSidebarWidget';
import { useCompanyVideoUrl } from '../hooks/useCompanyVideoUrl';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const COMPANY_VALUES = [
    { ar: 'جودة الاداء', en: 'Performance quality' },
    { ar: 'السلوك الاخلاقي', en: 'Ethical conduct' },
    { ar: 'المشاركة', en: 'Participation' },
    { ar: 'الإنتماء', en: 'Belonging' },
    { ar: 'المصداقيه الشفافيه', en: 'Credibility and transparency' },
    { ar: 'العمل بروح الفريق', en: 'Team spirit' },
    { ar: 'المسؤليه', en: 'Responsibility' }
];

function VisionAndMessagePage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
    const videoUrl = useCompanyVideoUrl();

    return (
        <>
            <Header />
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
                            <div className="hidden">
                                {t('عن الشركة', 'About the company')}
                            </div>
                            <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                                {t('الــرؤيـة والـرسـالـة والقــيـم', 'Vision, Mission, and Values')}
                            </h1>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
                                <div className="space-y-6">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">{t('الـرؤيـه', 'Vision')}</h2>
                                        <p className="leading-8 text-slate-700 text-justify">
                                            {t('التميز والريادة والاستدامه في تقديم خدمات مياه شرب نقية وصرف صحي اّمن', 'Excellence, leadership, and sustainability in delivering clean drinking water and safe wastewater services.')}
                                        </p>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">{t('الـرسـالـة', 'Mission')}</h2>
                                        <p className="leading-8 text-slate-700 text-justify">
                                            {t('تقديم خدمات مياه شرب نقيه وصرف صحي اّمن من خلال الاستخدام الامثل للموارد والامكانيات بأحدث التقنيات بما يضمن الاستدامه والموائمه البينيه والصحيه ونشر الوعي والثقافه المائيه في المجتمع', 'Provide clean drinking water and safe wastewater services through optimal use of resources and capabilities, supported by modern technologies that ensure sustainability, environmental and health compatibility, and the spread of water awareness across the community.')}
                                        </p>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">{t('القـيـم', 'Values')}</h2>
                                        <ul className="space-y-2 text-slate-700">
                                            {COMPANY_VALUES.map((value) => (
                                                <li key={value.ar} className="leading-8 text-justify">. {isEnglish ? value.en : value.ar}</li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>

                                <AboutSidebarWidget
                                    videoUrl={videoUrl}
                                    variant="modern"
                                    showFacebookSection={false}
                                    showImportantSitesSection={false}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default VisionAndMessagePage;
