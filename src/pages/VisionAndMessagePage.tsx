import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AboutSidebarWidget from '../components/AboutSidebarWidget';
import { API_BASE_ENDPOINT } from '../utils/helpers';

const COMPANY_VALUES = [
    'جودة الاداء',
    'السلوك الاخلاقي',
    'المشاركة',
    'الإنتماء',
    'المصداقيه الشفافيه',
    'العمل بروح الفريق',
    'المسؤليه'
];

function VisionAndMessagePage() {
    const [videoUrl, setVideoUrl] = useState('');

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
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir="rtl">
                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                                عن الشركة
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                                الــرؤيـة والـرسـالـة والقــيـم
                            </h1>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
                                <div className="space-y-6">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">الـرؤيـه</h2>
                                        <p className="leading-8 text-slate-700 text-justify">
                                            التميز والريادة والاستدامه في تقديم خدمات مياه شرب نقية وصرف صحي اّمن
                                        </p>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">الـرسـالـة</h2>
                                        <p className="leading-8 text-slate-700 text-justify">
                                            تقديم خدمات مياه شرب نقيه وصرف صحي اّمن من خلال الاستخدام الامثل للموارد والامكانيات بأحدث التقنيات بما يضمن
                                            الاستدامه والموائمه البينيه والصحيه ونشر الوعي والثقافه المائيه في المجتمع
                                        </p>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="mb-3 text-xl font-bold text-[#0a3555]">القـيـم</h2>
                                        <ul className="space-y-2 text-slate-700">
                                            {COMPANY_VALUES.map((value) => (
                                                <li key={value} className="leading-8 text-justify">. {value}</li>
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
