import { memo } from 'react';
import { ROUTES } from '../constants/routes';

function HeroSlider() {
    return (
        <section id="home" className="relative overflow-hidden bg-[#0a3555]">
            <div className="hero-slider absolute inset-0 z-0" aria-hidden="true">
                <div
                    className="hero-slide"
                    data-bg="/images/slider/1.webp"
                    data-title="معامل علي اعلي مستوي"
                    data-subtitle="الاهتمام بمعايير منظمة الصحة العالمية للتاكد من جودة المياه بأحدث المعايير والتقنيات"
                    data-link={ROUTES.labOfCompanyWater}
                    data-cta="تعرف علي المزيد"
                ></div>
                <div
                    className="hero-slide"
                    data-bg="/images/slider/2.webp"
                    data-title="لتنزيل برنامج قرائتي اضغط هنا"
                    data-subtitle=""
                    data-link={ROUTES.myReadingApp}
                    data-cta="المزيد"
                ></div>
                <div
                    className="hero-slide is-active"
                    style={{ backgroundImage: "url('/images/slider/3.webp')" }}
                    data-bg="/images/slider/3.webp"
                    data-title="شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد"
                    data-subtitle="ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه"
                    data-link={ROUTES.aboutCompany}
                    data-cta="تعرف علي المزيد"
                ></div>
                <div
                    className="hero-slide"
                    data-bg="/images/slider/4.webp"
                    data-title="الإداره العامه للتدريب"
                    data-subtitle="متاح حجز قاعات التدريب من داخل و خارج الشركة"
                    data-link={ROUTES.generalAdminTraining}
                    data-cta="تعرف علي المزيد"
                ></div>
                <div
                    className="hero-slide"
                    data-bg="/images/slider/5.webp"
                    data-title="مركز خدمة العملاء"
                    data-subtitle="مراكز خدمه العملاء وطرق التواصل وعنوان أقرب فرع"
                    data-link={ROUTES.callCenter}
                    data-cta="تعرف علي المزيد"
                ></div>
                <div
                    className="hero-slide"
                    data-bg="/images/slider/6.webp"
                    data-title="لتنزيل برنامج الخط الساخن اضغط هنا"
                    data-subtitle=""
                    data-link={ROUTES.hotlineApp}
                    data-cta="فتح الخدمة"
                ></div>
            </div>
            <div className="hero-overlay"></div>
            <button id="hero-prev" type="button" aria-label="السلايد السابق" className="hero-nav-btn hero-nav-btn--left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button id="hero-next" type="button" aria-label="السلايد التالي" className="hero-nav-btn hero-nav-btn--right">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div className="relative z-20 mx-auto grid min-h-[85vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:min-h-[82vh] lg:px-8">
                <div id="hero-content" className="hero-content-animate text-center text-white">
                    <h1 id="hero-title" className="hero-title hero-anim-item">شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد</h1>
                    <p id="hero-subtitle" className="hero-anim-item mx-auto mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه</p>
                    <a id="hero-cta" href={`https://ascww.org${ROUTES.aboutCompany}`} target="_blank" rel="noopener noreferrer" className="hero-anim-item mt-7 inline-flex rounded-md border border-[#d7b05a]/80 bg-[#d7b05a]/95 px-7 py-3 text-sm font-bold text-[#0a3555] transition hover:bg-[#d7b05a]">تعرف علي المزيد</a>
                </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex items-center justify-center gap-2">
                <button type="button" data-hero-dot data-slide-index="0" aria-label="Slide 1" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="1" aria-label="Slide 2" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="2" aria-label="Slide 3" className="hero-dot hero-dot--active pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="3" aria-label="Slide 4" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="4" aria-label="Slide 5" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="5" aria-label="Slide 6" className="hero-dot pointer-events-auto"></button>
            </div>
        </section>
    );
}

export default memo(HeroSlider);

