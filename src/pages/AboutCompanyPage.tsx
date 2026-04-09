import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSidebarWidget from '../components/AboutSidebarWidget';
import { API_BASE_ENDPOINT } from '../utils/helpers';
import { useCompanyVideoUrl } from '../hooks/useCompanyVideoUrl';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type BoardMember = {
    index?: number;
    name?: string;
    position?: string;
};

const establishmentDecisions = [
    {
        badgeAr: '2006 قرار رئيس الجمهورية رقم (249)',
        badgeEn: '2006 Presidential Decree No. (249)',
        descriptionAr: 'نقل تبعية أصول مرافق مياه الشرب والصرف الصحي بوحدات الإدارت المحلية إلي الشركة القابضة.',
        descriptionEn: 'Transferred the assets of drinking water and wastewater utilities in local administration units to the Holding Company.'
    },
    {
        badgeAr: '2008 قرار وزير الأسكان والمرافق رقم (95)',
        badgeEn: '2008 Minister of Housing and Utilities Decree No. (95)',
        descriptionAr: 'بالترخيص لتأسيس شركة تابعة مساهمة مصرية لمياه الشرب والصرف الصحي لمحافظة أسيوط.',
        descriptionEn: 'Approved the establishment of an Egyptian joint-stock subsidiary for drinking water and wastewater services in Assiut Governorate.'
    },
    {
        badgeAr: 'عام 2011',
        badgeEn: 'Year 2011',
        descriptionAr: 'ضم أصول مرافق مياه الشرب والصرف الصحى بمحافظة الوادى الجديد إلى شركة مياه الشرب والصرف الصحى بأسيوط وتغيير مسمى الشركة إلى شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد.',
        descriptionEn: 'Integrated the drinking water and wastewater utility assets of New Valley Governorate into the Assiut company and renamed it to Assiut and New Valley Water and Wastewater Company.'
    }
];

const strategicGoals = [
    {
        ar: 'رفع كفاءة محاور التشغيل والصيانه.',
        en: 'Improve the efficiency of operation and maintenance systems.'
    },
    {
        ar: 'تحسين آليات المحافظة على مصادر المياه للمقاييس المصرية.',
        en: 'Enhance mechanisms for protecting water sources in line with Egyptian standards.'
    },
    {
        ar: 'الإرتقاء بمستوى أداء المعامل فنياً وإدارياً للمحافظة على جودة مياه الشرب ومعالجة الصرف الصحي.',
        en: 'Raise the technical and administrative performance of laboratories to preserve drinking water quality and wastewater treatment standards.'
    },
    {
        ar: 'رفع كفاءة العاملين فنيا وإداريا بإستخدام التقنيات الحديثة.',
        en: 'Develop employees technically and administratively through modern technologies.'
    },
    {
        ar: 'التحقق من مستوى الرضا الوظيفي الحالى للعاملين وتحسينه.',
        en: 'Assess and improve current employee job satisfaction levels.'
    },
    {
        ar: 'إدخال برنامج التحول الرقمي في الشركة لتحسين مستوى الخدمة وتقديم الخدمات الإلكترونية في كافة فروع وإدارات الشركة.',
        en: 'Advance digital transformation across the company to improve service quality and deliver e-services in all branches and departments.'
    }
];

const chairmanMessage = {
    ar: 'الماء هو القلب النابض للحياة، وهو المكون الأساسي لكل ما هو موجود على سطح الأرض، تصديقاً لقول الله تعالى (وَجَعَلْنَا مِنَ الْمَاء كُلَّ شَيْءٍ حَيٍّ)، فلولا الماء لانعدمت الحياة، فوجوده هو السبب الرئيسي لوجود الحياة، ومن نعم الله علينا أن وهب مصرنا الحبيبة نهر النيل العظيم الذى يمثل شريان الحياة، الأمر الذى يدعو إلى ضرورة أن نمنحها قيمه عظيمة تكمن وراء مكانتها الحقيقية التى تستلزم الحفاظ على كل قطرة فيها، وتنفى شتى الإستخدامات والسلوكيات الخاطئة فى التعامل معها، وتمكننا من استغلالها الإستغلال الأمثل الذى يضمن بقاءها ودوامها، مما يكفل الكسب للجميع.',
    en: 'Water is the beating heart of life and the essential component of everything on earth. Without water, life would cease to exist. One of God’s greatest blessings upon Egypt is the River Nile, our lifeline. This calls on us to recognize its true value, preserve every drop, reject misuse and harmful behavior, and make the best possible use of it to ensure sustainability and benefit for all.'
};

function AboutCompanyPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const videoUrl = useCompanyVideoUrl();
    const variant = 'modern' as const;

    const isFormal = false;
    const headerGradientClass = isFormal
        ? (isEnglish ? 'bg-gradient-to-r from-slate-700 to-slate-600' : 'bg-gradient-to-l from-slate-700 to-slate-600')
        : (isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadBoardMembers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_ENDPOINT}/admin-board-members`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`Admin board request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const membersRaw = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.data)
                        ? payloadObject.data
                        : Array.isArray(payloadObject.value)
                            ? payloadObject.value
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const members = membersRaw
                    .filter((item): item is BoardMember => typeof item === 'object' && item !== null)
                    .sort((first, second) => Number(first.index ?? 0) - Number(second.index ?? 0));

                if (!active) return;
                setBoardMembers(members);
            } catch {
                if (!active) return;
                setError(t('تعذر تحميل بيانات مجلس الإدارة حاليًا.', 'Unable to load board member data right now.'));
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadBoardMembers();

        return () => {
            active = false;
            controller.abort();
        };
    }, [isEnglish]);

    return (
        <>
            <Header />
            <main
                className={isFormal ? 'bg-slate-50' : 'bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]'}
                dir={isEnglish ? 'ltr' : 'rtl'}
            >
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className={`${headerGradientClass} px-6 py-7 text-white sm:px-8`}>
                            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                                {t('عن الشركة', 'About the company')}
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                                {t('شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد', 'Assiut and New Valley Water and Wastewater Company')}
                            </h1>
                            <p className="mt-2 text-sm text-white/90 text-justify sm:text-base">
                                {t('نبذة رسمية عن قرار الإنشاء، الأهداف الاستراتيجية، وتشكيل مجلس الإدارة.', 'An official overview of the company establishment, strategic goals, and board formation.')}
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
                                <div className="space-y-6">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${isFormal ? 'bg-slate-100 text-slate-700' : 'bg-[#1170b0]/15 text-[#0a3555]'}`}>1</span>
                                            <h2 className="text-xl font-bold text-[#0a3555]">{t('قرار إنشاء الشركة', 'Company establishment decision')}</h2>
                                        </div>
                                        <div className="space-y-3 leading-8 text-slate-700 text-justify">
                                            {establishmentDecisions.map((decision) => (
                                                <div key={decision.badgeAr} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                    <p className="font-bold text-[#0a3555]">{isEnglish ? decision.badgeEn : decision.badgeAr}</p>
                                                    <p>{isEnglish ? decision.descriptionEn : decision.descriptionAr}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${isFormal ? 'bg-slate-100 text-slate-700' : 'bg-[#1170b0]/15 text-[#0a3555]'}`}>2</span>
                                            <h2 className="text-xl font-bold text-[#0a3555]">{t('الأهداف الاستراتيجية للشركة', 'Company strategic goals')}</h2>
                                        </div>
                                        <ul className="space-y-3">
                                            {strategicGoals.map((goal) => (
                                                <li key={goal.ar} className="flex items-start gap-3 leading-8 text-slate-700">
                                                    <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                    <span className="text-justify">{isEnglish ? goal.en : goal.ar}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between gap-2">
                                            <h3 className="text-xl font-bold text-[#0a3555]">{t('مجلس الإداره', 'Board of Directors')}</h3>
                                        </div>

                                        {loading ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-slate-600">
                                                {t('جاري تحميل بيانات مجلس الإدارة...', 'Loading board member data...')}
                                            </div>
                                        ) : error ? (
                                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-red-700">
                                                {error}
                                            </div>
                                        ) : boardMembers.length === 0 ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-slate-600">
                                                {t('لا توجد بيانات متاحة لمجلس الإدارة حاليًا.', 'No board member data is currently available.')}
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                    <thead className="bg-slate-100">
                                                        <tr>
                                                            <th className="px-4 py-3 text-right font-bold text-slate-700">{t('أسم العضـو', 'Member name')}</th>
                                                            <th className="px-4 py-3 text-right font-bold text-slate-700">{t('المنصـب', 'Position')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-white">
                                                        {boardMembers.map((member, index) => (
                                                            <tr key={`${member.name || 'member'}-${index}`} className="odd:bg-white even:bg-slate-50/40">
                                                                <td className="px-4 py-3 text-right text-slate-800">{member.name || '-'}</td>
                                                                <td className="px-4 py-3 text-right text-slate-700">{member.position || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </section>

                                    <section className={`rounded-2xl border p-5 shadow-sm ${isFormal ? 'border-slate-200 bg-slate-50' : 'border-[#d7b05a]/30 bg-gradient-to-b from-[#fffef9] to-[#f8f5eb]'}`}>
                                        <h3 className="text-justify text-xl font-bold text-[#0a3555]">{t('كلمه رئيس مجلس الإداره', 'Chairman’s message')}</h3>
                                        <p className={`mt-3 border-r-4 pr-4 text-justify leading-8 text-slate-700 ${isFormal ? 'border-slate-300' : 'border-[#d7b05a]'}`}>
                                            {isEnglish ? chairmanMessage.en : chairmanMessage.ar}
                                        </p>
                                    </section>
                                </div>

                                <AboutSidebarWidget videoUrl={videoUrl} variant={variant} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AboutCompanyPage;
