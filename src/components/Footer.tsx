import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

function Footer() {
    return (
        <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.22),_transparent_55%)]"></div>
            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-full">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f1f5f9d9] p-3 shadow-[0_14px_35px_rgba(2,6,23,0.35)]">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">مقر الشركة</h3>
                                <span className="rounded-full bg-[#0a3555]/80 px-2.5 py-1 text-[11px] font-bold text-slate-100">أسيوط</span>
                            </div>
                            <iframe
                                title="موقع شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد"
                                src="https://maps.google.com/maps?q=%D8%B4%D8%B1%D9%83%D8%A9%20%D9%85%D9%8A%D8%A7%D9%87%20%D8%A7%D9%84%D8%B4%D8%B1%D8%A8%20%D9%88%D8%A7%D9%84%D8%B5%D8%B1%D9%81%20%D8%A7%D9%84%D8%B5%D8%AD%D9%8A%20%D8%A8%D8%A3%D8%B3%D9%8A%D9%88%D8%B7%20%D9%88%D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%8A%20%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF&z=14&output=embed"
                                className="h-48 w-full rounded-xl border-0 sm:h-56"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=%D8%B4%D8%B1%D9%83%D8%A9+%D9%85%D9%8A%D8%A7%D9%87+%D8%A7%D9%84%D8%B4%D8%B1%D8%A8+%D9%88%D8%A7%D9%84%D8%B5%D8%B1%D9%81+%D8%A7%D9%84%D8%B5%D8%AD%D9%8A+%D8%A8%D8%A3%D8%B3%D9%8A%D9%88%D8%B7+%D9%88%D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%8A+%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-5 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:from-[#082b47] hover:to-[#0a3555]"
                            >
                                فتح في خرائط جوجل
                            </a>
                        </div>
                    </div>

                    <div className="h-full px-1 py-1">
                        <h3 className="mb-4 text-base font-bold text-white">بيانات الشركة</h3>
                        <div className="space-y-3 text-sm leading-7 text-slate-300">
                            <p>عنوان الفرع الرئيسى : محطه مياه المرشحه بنزله عباللاه- اسيوط</p>
                            <p>رقم الهاتف : 2331604-088</p>
                            <p>صندوق بريد : 71111</p>
                            <p>رقم الفاكس : 2131662-088</p>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="social-icon social-icon--facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" /></svg>
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=201281565653" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </a>
                            <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                            </a>
                        </div>
                    </div>

                    <div className="h-full px-1 py-1">
                        <h3 className="mb-4 text-base font-bold text-white">روابط تهمك</h3>
                        <div className="space-y-2 text-sm">
                            <a className="block transition hover:text-white" href="http://bills.ascww.com.eg/Inqeury.aspx" target="_blank" rel="noopener noreferrer">استعلم عن فاتورتك</a>
                            <Link className="block transition hover:text-white" to={ROUTES.callCenter}>خدمة العملاء</Link>
                            <Link className="block transition hover:text-white" to={ROUTES.projectsArchive}>أرشيف المشروعات</Link>
                            <Link className="block transition hover:text-white" to={ROUTES.newsArchive}>أرشيف الأخبار</Link>
                            <Link className="block transition hover:text-white" to={ROUTES.tendersArchive}>المناقصات</Link>
                            <Link className="block transition hover:text-white" to={ROUTES.generalAdminTraining}>الإدارة العامة للتدريب</Link>
                            <Link className="block transition hover:text-white" to={ROUTES.schoolSubmissionData}>المدرسة الفنية</Link>
                        </div>
                    </div>

                </div>

                <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-slate-400 sm:text-sm">
                    جميع الحقوق محفوظة © لشركة مياه الشرب و الصرف الصحى بأسيوط و الوادى الجديد 2026 | الموقع من تطوير الإداره العامة لتكنولوجيا المعلومات بالشركة
                </div>
            </div>
        </footer>
    );
}

export default memo(Footer);

