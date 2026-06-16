import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type AchievementItem = {
    id: number;
    value: string;
    unitAr: string;
    unitEn: string;
    titleAr: string;
    titleEn: string;
    detailsAr: string;
    detailsEn: string;
    icon: string;
    tone: 'blue' | 'teal' | 'orange';
    side: 'left' | 'right';
};

const ACHIEVEMENTS_2021: AchievementItem[] = [
    { id: 1, value: '80', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'قطاع الوادي الجديد', titleEn: 'New Valley sector', detailsAr: 'إحلال وتجديد محطات وشبكات المياه والصرف الصحي والتوريدات.', detailsEn: 'Replacement and renovation of water and wastewater stations, networks, and supply works.', icon: '💧', tone: 'blue', side: 'left' },
    { id: 2, value: '246.5', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'مشروعات بتمويلات خارجية', titleEn: 'Externally funded projects', detailsAr: 'إحلال وتجديد محطتي مياه الشاميه وديروط المرشحة.', detailsEn: 'Replacement and renovation of Al-Shamia and Dayrout water filtration stations.', icon: '🏗️', tone: 'teal', side: 'left' },
    { id: 3, value: '30', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'خطوط طرد بجامعة أسيوط', titleEn: 'Force mains at Assiut University', detailsAr: 'وخطوط طرد ميادين المجاهدين والجندي وسعد.', detailsEn: 'Including force mains for Al-Mujahideen, Al-Gendy, and Saad squares.', icon: '🧱', tone: 'orange', side: 'left' },
    { id: 4, value: '1', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'شبكات صرف صحي', titleEn: 'Wastewater networks', detailsAr: 'مد وتدعيم 155 ألف متر، وتنفيذ 21 ألف وصلة منزلية بـ 7 قرى ريفية.', detailsEn: 'Extension and reinforcement of 155,000 meters and implementation of 21,000 house connections across 7 rural villages.', icon: '🛠️', tone: 'blue', side: 'left' },
    { id: 5, value: '11', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'معدات تشغيل', titleEn: 'Operational equipment', detailsAr: 'توريد 6 معدات صرف وعدد 4 وحدات نقالي، ومولد ديزل.', detailsEn: 'Supply of 6 wastewater machines, 4 mobile units, and a diesel generator.', icon: '🚛', tone: 'teal', side: 'left' },
    { id: 6, value: '40', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'إحلال وتجديد محطات مياه', titleEn: 'Replacement and renovation of water stations', detailsAr: '3 محطات: النزلة، أبوتيج، منفلوط.', detailsEn: 'Three stations: Al-Nazla, Abutig, and Manfalut.', icon: '🏭', tone: 'blue', side: 'right' },
    { id: 7, value: '112', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'محطات صرف صحي', titleEn: 'Wastewater stations', detailsAr: 'إحلال وتجديد 6 محطات صرف صحي وخط طرد محطة البنك الدولي وقطار.', detailsEn: 'Replacement and renovation of 6 wastewater stations and the force main for the World Bank station and Qattar.', icon: '🌊', tone: 'teal', side: 'right' },
    { id: 8, value: '16', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'تدعيم شبكات المياه والصرف', titleEn: 'Support for water and wastewater networks', detailsAr: 'مد وتدعيم شبكات مياه بالقوصية ومنفلوط ومد خطوط طرد للصرف بديروط ومنفلوط.', detailsEn: 'Expansion and reinforcement of water networks in Al-Qusiyah and Manfalut and wastewater force mains in Dayrout and Manfalut.', icon: '🔧', tone: 'orange', side: 'right' },
    { id: 9, value: '52', unitAr: 'مليون جنيه', unitEn: 'million EGP', titleAr: 'وصلات منزلية', titleEn: 'House connections', detailsAr: 'تنفيذ وصلات منزلية بأنبوب المنتج وساحل سليم.', detailsEn: 'Implementation of house connections in Anoub Al-Montag and Sahel Selim.', icon: '🏠', tone: 'blue', side: 'right' },
];

const toneClasses: Record<AchievementItem['tone'], string> = {
    blue: 'from-[#0a3555] to-[#1170b0]',
    teal: 'from-[#0f766e] to-[#14b8a6]',
    orange: 'from-[#b45309] to-[#f97316]'
};

function CompanyAchievementsPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const achievementsInfographicImage = isEnglish
        ? '/images/achievements/infographicEN.webp'
        : '/images/achievements/infographic.webp';
    const headerGradientStyle = {
        background: isEnglish
            ? 'linear-gradient(270deg,#1c76b2 0%,#0f5f94 46%,#0a3555 100%)'
            : 'linear-gradient(90deg,#1c76b2 0%,#0f5f94 46%,#0a3555 100%)'
    };
    const leftItems = ACHIEVEMENTS_2021.filter((item) => item.side === 'left');
    const rightItems = ACHIEVEMENTS_2021.filter((item) => item.side === 'right');

    return (
        <>
            <Header />
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.12),_transparent_46%)] py-8" dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <span className="pointer-events-none absolute -top-24 left-8 h-56 w-56 rounded-full bg-[#1170b0]/10 blur-3xl"></span>
                        <span className="pointer-events-none absolute -bottom-24 right-8 h-56 w-56 rounded-full bg-[#0f766e]/10 blur-3xl"></span>

                        <div className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
                            <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                                {t('إنجازات الشركة', 'Company achievements')}
                            </h1>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="w-full rounded-2xl border-2 border-[#d7b05a]/45 bg-white shadow-sm">
                                <img decoding="async"
                                    src={achievementsInfographicImage}
                                    alt={t('إنفوجراف إنجازات قطاع المشروعات', 'Projects sector achievements infographic')}
                                    className="block h-auto w-full rounded-2xl border border-slate-200 object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <section className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#f8fbff_100%)] p-4 sm:p-5">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {[leftItems, rightItems].map((group, groupIndex) => (
                                        <div key={`group-${groupIndex}`} className="space-y-4">
                                            {group.map((item) => (
                                                <article key={item.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                                    <span className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClasses[item.tone]}`}></span>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`min-w-[92px] rounded-2xl bg-gradient-to-br px-3 py-2 text-center text-white ${toneClasses[item.tone]}`}>
                                                            <p className="text-2xl font-extrabold leading-none">{item.value}</p>
                                                            <p className="mt-1 text-[11px] font-bold">{isEnglish ? item.unitEn : item.unitAr}</p>
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                                                                <span className="text-sm leading-none">{item.icon}</span>
                                                                <span>{isEnglish ? item.titleEn : item.titleAr}</span>
                                                            </div>
                                                            <p className="text-sm font-semibold leading-7 text-slate-700 text-justify">{isEnglish ? item.detailsEn : item.detailsAr}</p>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default CompanyAchievementsPage;
