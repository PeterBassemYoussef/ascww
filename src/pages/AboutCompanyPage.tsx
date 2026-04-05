import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSidebarWidget from '../components/AboutSidebarWidget';
import { API_BASE_ENDPOINT } from '../utils/helpers';

type BoardMember = {
    index?: number;
    name?: string;
    position?: string;
};

function AboutCompanyPage() {
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const variant = 'modern' as const;

    const isFormal = false;

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
                setError('تعذر تحميل بيانات مجلس الإدارة حاليًا.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadBoardMembers();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadAdminInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_ENDPOINT}/admin-info`, {
                    signal: controller.signal
                });
                if (!response.ok) return;
                const payload = (await response.json()) as { ascww_video_link?: string };
                if (!active) return;
                setVideoUrl(String(payload.ascww_video_link || '').trim());
            } catch {
                if (!active) return;
            }
        };

        loadAdminInfo();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    return (
        <>
            <Header />
            <main
                className={isFormal ? 'bg-slate-50' : 'bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]'}
                dir="rtl"
            >
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className={`${isFormal ? 'bg-gradient-to-l from-slate-700 to-slate-600' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]'} px-6 py-7 text-white sm:px-8`}>
                            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                                عن الشركة
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                                شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد
                            </h1>
                            <p className="mt-2 text-sm text-white/90 text-justify sm:text-base">
                                نبذة رسمية عن قرار الإنشاء، الأهداف الاستراتيجية، وتشكيل مجلس الإدارة.
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
                            <div className="space-y-6">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${isFormal ? 'bg-slate-100 text-slate-700' : 'bg-[#1170b0]/15 text-[#0a3555]'}`}>1</span>
                                            <h2 className="text-xl font-bold text-[#0a3555]">قرار إنشاء الشركة</h2>
                                        </div>
                                        <div className="space-y-3 leading-8 text-slate-700 text-justify">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <p className="font-bold text-[#0a3555]">2006 قرار رئيس الجمهورية رقم (249)</p>
                                                <p>نقل تبعية أصول مرافق مياه الشرب والصرف الصحي بوحدات الإدارت المحلية إلي الشركة القابضة.</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <p className="font-bold text-[#0a3555]">2008 قرار وزير الأسكان والمرافق رقم (95)</p>
                                                <p>بالترخيص لتأسيس شركة تابعة مساهمة مصرية لمياه الشرب والصرف الصحي لمحافظة أسيوط.</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <p className="font-bold text-[#0a3555]">عام 2011</p>
                                                <p>ضم أصول مرافق مياه الشرب والصرف الصحى بمحافظة الوادى الجديد إلى شركة مياه الشرب والصرف الصحى بأسيوط وتغيير مسمى الشركة إلى شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد.</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${isFormal ? 'bg-slate-100 text-slate-700' : 'bg-[#1170b0]/15 text-[#0a3555]'}`}>2</span>
                                            <h2 className="text-xl font-bold text-[#0a3555]">الأهداف الاستراتيجية للشركة</h2>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">رفع كفاءة محاور التشغيل والصيانه.</span>
                                            </li>
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">تحسين آليات المحافظة على مصادر المياه للمقاييس المصرية.</span>
                                            </li>
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">الإرتقاء بمستوى أداء المعامل فنياً وإدارياً للمحافظة على جودة مياه الشرب ومعالجة الصرف الصحي.</span>
                                            </li>
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">رفع كفاءة العاملين فنيا وإداريا بإستخدام التقنيات الحديثة.</span>
                                            </li>
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">التحقق من مستوى الرضا الوظيفي الحالى للعاملين وتحسينه.</span>
                                            </li>
                                            <li className="flex items-start gap-3 leading-8 text-slate-700">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${isFormal ? 'bg-slate-500' : 'bg-[#1170b0]'}`}></span>
                                                <span className="text-justify">إدخال برنامج التحول الرقمي في الشركة لتحسين مستوى الخدمة وتقديم الخدمات الإلكترونية في كافة فروع وإدارات الشركة.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between gap-2">
                                            <h3 className="text-xl font-bold text-[#0a3555]">مجلس الإداره</h3>
                                        </div>

                                        {loading ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-slate-600">
                                                جاري تحميل بيانات مجلس الإدارة...
                                            </div>
                                        ) : error ? (
                                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-red-700">
                                                {error}
                                            </div>
                                        ) : boardMembers.length === 0 ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-slate-600">
                                                لا توجد بيانات متاحة لمجلس الإدارة حاليًا.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                    <thead className={isFormal ? 'bg-slate-100' : 'bg-slate-100'}>
                                                        <tr>
                                                            <th className="px-4 py-3 text-right font-bold text-slate-700">أسم العضـو</th>
                                                            <th className="px-4 py-3 text-right font-bold text-slate-700">المنصـب</th>
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
                                        <h3 className="text-justify text-xl font-bold text-[#0a3555]">كلمه رئيس مجلس الإداره</h3>
                                        <p className={`mt-3 border-r-4 pr-4 text-justify leading-8 text-slate-700 ${isFormal ? 'border-slate-300' : 'border-[#d7b05a]'}`}>
                                            الماء هو القلب النابض للحياة، وهو المكون الأساسي لكل ما هو موجود على سطح الأرض، تصديقاً لقول الله تعالى (وَجَعَلْنَا مِنَ الْمَاء كُلَّ شَيْءٍ حَيٍّ)، فلولا الماء لانعدمت الحياة، فوجوده هو السبب الرئيسي لوجود الحياة، ومن نعم الله علينا أن وهب مصرنا الحبيبة نهر النيل العظيم الذى يمثل شريان الحياة، الأمر الذى يدعو إلى ضرورة أن نمنحها قيمه عظيمة تكمن وراء مكانتها الحقيقية التى تستلزم الحفاظ على كل قطرة فيها، وتنفى شتى الإستخدامات والسلوكيات الخاطئة فى التعامل معها، وتمكننا من استغلالها الإستغلال الأمثل الذى يضمن بقاءها ودوامها، مما يكفل الكسب للجميع.
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
