type AboutSidebarWidgetProps = {
    videoUrl?: string;
    variant?: 'formal' | 'modern';
    showFacebookSection?: boolean;
    showImportantSitesSection?: boolean;
};

const FACEBOOK_PAGE_URL = 'https://ar-ar.facebook.com/ASCWWeg/';
const FACEBOOK_PLUGIN_URL = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F%25D8%25A7%25D9%2584%25D8%25B5%25D9%2581%25D8%25AD%25D8%25A9-%25D8%25A7%25D9%2584%25D8%25B1%25D8%25B3%25D9%2585%25D9%258A%25D8%25A9-%25D9%2584%25D8%25B4%25D8%25B1%25D9%2583%25D8%25A9-%25D9%2585%25D9%258A%25D8%25A7%25D9%2587-%25D8%25A7%25D9%2584%25D8%25B4%25D8%25B1%25D8%25A8-%25D9%2588%25D8%25A7%25D9%2584%25D8%25B5%25D8%25B1%25D9%2581-%25D8%25A7%25D9%2584%25D8%25B5%25D8%25AD%25D9%2589-%25D8%25A8%25D8%25A3%25D8%25B3%25D9%258A%25D9%2588%25D8%25B7-%25D9%2588%25D8%25A7%25D9%2584%25D9%2588%25D8%25A7%25D8%25AF%25D9%2589-%25D8%25A7%25D9%2584%25D8%25AC%25D8%25AF%25D9%258A%25D8%25AF-364679160333044%2F&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId=887228017981898';
const IMPORTANT_SITES = [
    { label: 'بوابه الحكومه المصريه', href: 'https://www.egypt.gov.eg/arabic/home.aspx' },
    { label: 'رئاسه مجلس الوزراء', href: 'https://www.cabinet.gov.eg/Arabic/Pages/default.aspx' },
    { label: 'الشركة القابضة لمياه الشرب و الصرف الصحى', href: 'https://www.hcww.com.eg/ar' },
    { label: 'بوابه محافظه أسيوط', href: 'http://assiut.gov.eg/' },
    { label: 'بوابة رئاسة الجمهوريه', href: 'https://www.presidency.eg/ar' }
];

function AboutSidebarWidget({
    videoUrl,
    variant = 'modern',
    showFacebookSection = true,
    showImportantSitesSection = true
}: AboutSidebarWidgetProps) {
    const isFormal = variant === 'formal';

    return (
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <section className={`rounded-2xl border p-4 shadow-sm ${isFormal ? 'border-slate-200 bg-white' : 'border-slate-200 bg-white'}`}>
                <h3 className={`mb-3 text-lg font-extrabold ${isFormal ? 'text-slate-700' : 'text-[#1f8b3c]'}`}>فيديو عن الشركه</h3>
                <div className="overflow-hidden rounded-xl border border-slate-300 bg-black">
                    {videoUrl ? (
                        <iframe
                            src={videoUrl}
                            title="فيديو عن الشركة"
                            className="aspect-video w-full"
                            frameBorder={0}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex aspect-video items-center justify-center bg-slate-100 px-4 text-sm text-slate-600">
                            لا يوجد فيديو متاح حاليًا.
                        </div>
                    )}
                </div>
            </section>

            <section className={`rounded-2xl border p-4 shadow-sm ${isFormal ? 'border-slate-200 bg-white' : 'border-slate-200 bg-white'}`}>
                <h3 className={`mb-3 text-lg font-extrabold ${isFormal ? 'text-slate-700' : 'text-[#1f8b3c]'}`}>روابط سريعه</h3>
                <div className="space-y-3">
                    <details className={`group overflow-hidden rounded-xl border ${isFormal ? 'border-slate-200 bg-slate-50' : 'border-[#d7cfc3] bg-[#e3ddd3]'}`} open>
                        <summary className={`flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold ${isFormal ? 'text-slate-700' : 'text-slate-700'}`}>
                            <span>رسالة شركة</span>
                            <span className="transition-transform duration-200 group-open:rotate-180">▾</span>
                        </summary>
                        <div className={`border-t px-3 py-3 ${isFormal ? 'border-slate-200' : 'border-[#d7cfc3]'}`}>
                            <img decoding="async"
                                src="/images/about/company-message.webp"
                                alt="رسالة الشركة"
                                className="w-full rounded-lg border border-slate-300 bg-white"
                                loading="lazy"
                            />
                        </div>
                    </details>

                    {showFacebookSection && (
                        <details className={`group overflow-hidden rounded-xl border ${isFormal ? 'border-slate-200 bg-slate-50' : 'border-[#d7cfc3] bg-[#e3ddd3]'}`} open>
                            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-slate-700">
                                <span>صفحتنا علي الفيسبوك</span>
                                <span className="transition-transform duration-200 group-open:rotate-180">▾</span>
                            </summary>
                            <div className={`border-t px-3 py-3 ${isFormal ? 'border-slate-200' : 'border-[#d7cfc3]'}`}>
                                <iframe
                                    src={FACEBOOK_PLUGIN_URL}
                                    title="صفحة الشركة على فيسبوك"
                                    className="w-full overflow-hidden rounded-lg border border-slate-300 bg-white"
                                    style={{ height: '350px', border: 'none' }}
                                    scrolling="no"
                                    loading="lazy"
                                    allowTransparency
                                ></iframe>
                                <a
                                    href={FACEBOOK_PAGE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                                        isFormal
                                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                            : 'bg-[#1f8b3c]/10 text-[#1f8b3c] hover:bg-[#1f8b3c]/15'
                                    }`}
                                >
                                    زيارة الصفحة الرسمية
                                </a>
                            </div>
                        </details>
                    )}

                    {showImportantSitesSection && (
                        <details className={`group overflow-hidden rounded-xl border ${isFormal ? 'border-slate-200 bg-slate-50' : 'border-[#d7cfc3] bg-[#e3ddd3]'}`} open>
                            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-slate-700">
                                <span>مواقع هامة</span>
                                <span className="transition-transform duration-200 group-open:rotate-180">▾</span>
                            </summary>
                            <ul className={`space-y-2 border-t px-4 py-3 ${isFormal ? 'border-slate-200' : 'border-[#d7cfc3]'}`}>
                                {IMPORTANT_SITES.map((site) => (
                                    <li key={site.href}>
                                        <a
                                            href={site.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center text-sm font-semibold ${
                                                isFormal ? 'text-slate-700 hover:text-slate-900' : 'text-[#1f8b3c] hover:text-[#156c2d]'
                                            }`}
                                        >
                                            <span className="ml-2">‹</span>
                                            {site.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            </section>
        </aside>
    );
}

export default AboutSidebarWidget;
