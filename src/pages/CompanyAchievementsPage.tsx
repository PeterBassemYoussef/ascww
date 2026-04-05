import Footer from '../components/Footer';
import Header from '../components/Header';

const achievementsInfographicImage = '/images/achievements/infographic.webp';

type AchievementItem = {
    id: number;
    value: string;
    unit: string;
    title: string;
    details: string;
    icon: string;
    tone: 'blue' | 'teal' | 'orange';
    side: 'left' | 'right';
};

const ACHIEVEMENTS_2021: AchievementItem[] = [
    {
        id: 1,
        value: '80',
        unit: 'مليون جنيه',
        title: 'قطاع الوادي الجديد',
        details: 'إحلال وتجديد محطات وشبكات المياه والصرف الصحي والتوريدات.',
        icon: '💧',
        tone: 'blue',
        side: 'left'
    },
    {
        id: 2,
        value: '246.5',
        unit: 'مليون جنيه',
        title: 'مشروعات بتمويلات خارجية',
        details: 'إحلال وتجديد محطتي مياه الشاميه وديروط المرشحة.',
        icon: '🏗️',
        tone: 'teal',
        side: 'left'
    },
    {
        id: 3,
        value: '30',
        unit: 'مليون جنيه',
        title: 'خطوط طرد بجامعة أسيوط',
        details: 'وخطوط طرد ميادين المجاهدين والجندي وسعد.',
        icon: '🧱',
        tone: 'orange',
        side: 'left'
    },
    {
        id: 4,
        value: '1',
        unit: 'مليون جنيه',
        title: 'شبكات صرف صحي',
        details: 'مد وتدعيم 155 ألف متر، وتنفيذ 21 ألف وصلة منزلية بـ 7 قرى ريفية.',
        icon: '🛠️',
        tone: 'blue',
        side: 'left'
    },
    {
        id: 5,
        value: '11',
        unit: 'مليون جنيه',
        title: 'معدات تشغيل',
        details: 'توريد 6 معدات صرف وعدد 4 وحدات نقالي، ومولد ديزل.',
        icon: '🚛',
        tone: 'teal',
        side: 'left'
    },
    {
        id: 6,
        value: '40',
        unit: 'مليون جنيه',
        title: 'إحلال وتجديد محطات مياه',
        details: '3 محطات: النزلة، أبوتيج، منفلوط.',
        icon: '🏭',
        tone: 'blue',
        side: 'right'
    },
    {
        id: 7,
        value: '112',
        unit: 'مليون جنيه',
        title: 'محطات صرف صحي',
        details: 'إحلال وتجديد 6 محطات صرف صحي وخط طرد محطة البنك الدولي وقطار.',
        icon: '🌊',
        tone: 'teal',
        side: 'right'
    },
    {
        id: 8,
        value: '16',
        unit: 'مليون جنيه',
        title: 'تدعيم شبكات المياه والصرف',
        details: 'مد وتدعيم شبكات مياه بالقوصية ومنفلوط ومد خطوط طرد للصرف بديروط ومنفلوط.',
        icon: '🔧',
        tone: 'orange',
        side: 'right'
    },
    {
        id: 9,
        value: '52',
        unit: 'مليون جنيه',
        title: 'وصلات منزلية',
        details: 'تنفيذ وصلات منزلية بأنبوب المنتج وساحل سليم.',
        icon: '🏠',
        tone: 'blue',
        side: 'right'
    }
];

const toneClasses: Record<AchievementItem['tone'], string> = {
    blue: 'from-[#0a3555] to-[#1170b0]',
    teal: 'from-[#0f766e] to-[#14b8a6]',
    orange: 'from-[#b45309] to-[#f97316]'
};

function CompanyAchievementsPage() {
    const leftItems = ACHIEVEMENTS_2021.filter((item) => item.side === 'left');
    const rightItems = ACHIEVEMENTS_2021.filter((item) => item.side === 'right');

    return (
        <>
            <Header />
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.12),_transparent_46%)] py-8" dir="rtl">
                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <span className="pointer-events-none absolute -top-24 left-8 h-56 w-56 rounded-full bg-[#1170b0]/10 blur-3xl"></span>
                        <span className="pointer-events-none absolute -bottom-24 right-8 h-56 w-56 rounded-full bg-[#0f766e]/10 blur-3xl"></span>

                        <div className="bg-[linear-gradient(90deg,#1c76b2_0%,#0f5f94_46%,#0a3555_100%)] px-6 py-7 text-white sm:px-8">
                            <div className="relative">
                                <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-base font-extrabold tracking-wide sm:text-lg">
                                    إنجازات الشركة
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="w-full rounded-2xl border-2 border-[#d7b05a]/45 bg-white shadow-sm">
                                <img decoding="async"
                                    src={achievementsInfographicImage}
                                    alt="إنفوجراف إنجازات قطاع المشروعات"
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
                                                            <p className="mt-1 text-[11px] font-bold">{item.unit}</p>
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                                                                <span className="text-sm leading-none">{item.icon}</span>
                                                                <span>{item.title}</span>
                                                            </div>
                                                            <p className="text-sm font-semibold leading-7 text-slate-700 text-justify">{item.details}</p>
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
