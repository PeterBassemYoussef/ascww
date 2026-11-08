import { memo, useLayoutEffect } from 'react';
import { ROUTES } from '../constants/routes';

const MOBILE_SLIDER_QUERY = '(max-width: 767px)';

export const setHeroSlideImageLoaded = (slide: HTMLElement, loaded: boolean): void => {
    const source = slide.querySelector<HTMLSourceElement>('source[data-mobile-srcset]');
    const image = slide.querySelector<HTMLImageElement>('img[data-desktop-src]');

    if (!source || !image) return;

    if (loaded) {
        source.srcset = source.dataset.mobileSrcset || '';
        image.src = image.dataset.desktopSrc || '';
        return;
    }

    source.removeAttribute('srcset');
    image.removeAttribute('src');
};

function HeroSlider() {
    useLayoutEffect(() => {
        const slides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
        if (slides.length === 0) return;

        const mediaQuery = window.matchMedia(MOBILE_SLIDER_QUERY);

        const updateLoadedSlides = () => {
            const activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
            const mobileLoadedIndices = new Set([activeIndex, (activeIndex + 1) % slides.length]);

            slides.forEach((slide, index) => {
                setHeroSlideImageLoaded(slide, !mediaQuery.matches || mobileLoadedIndices.has(index));
            });
        };

        updateLoadedSlides();
        mediaQuery.addEventListener('change', updateLoadedSlides);

        return () => mediaQuery.removeEventListener('change', updateLoadedSlides);
    }, []);

    return (
        <section id="home" className="relative overflow-hidden bg-[#0a3555]">
            <div className="hero-slider absolute inset-0 z-0" dir="ltr" aria-hidden="true">
                <div
                    className="hero-slide"
                    data-title="معامل علي اعلي مستوي"
                    data-title-ar="معامل علي اعلي مستوي"
                    data-title-en="Advanced laboratories"
                    data-subtitle="الاهتمام بمعايير منظمة الصحة العالمية للتاكد من جودة المياه بأحدث المعايير والتقنيات"
                    data-subtitle-ar="الاهتمام بمعايير منظمة الصحة العالمية للتاكد من جودة المياه بأحدث المعايير والتقنيات"
                    data-subtitle-en="We follow World Health Organization standards to verify water quality with the latest methods and technologies."
                    data-link={ROUTES.laboratoriesSector}
                    data-cta="تعرف علي المزيد"
                    data-cta-ar="تعرف علي المزيد"
                    data-cta-en="Learn more"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-1-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/1.webp" alt="المعمل المركزي لمياه الشرب" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
                <div
                    className="hero-slide"
                    data-title="لتنزيل برنامج قرائتي اضغط هنا"
                    data-title-ar="لتنزيل برنامج قرائتي اضغط هنا"
                    data-title-en="Click here to download My Reading app"
                    data-subtitle=""
                    data-subtitle-ar=""
                    data-subtitle-en=""
                    data-link={ROUTES.myReadingApp}
                    data-cta="المزيد"
                    data-cta-ar="المزيد"
                    data-cta-en="More"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-2-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/2.webp" alt="تطبيق قرائتي لتسجيل قراءة عدادات المياه" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
                <div
                    className="hero-slide is-active"
                    data-title="شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد"
                    data-title-ar="شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد"
                    data-title-en="Assiut and New Valley Water and Wastewater Company"
                    data-subtitle="ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه"
                    data-subtitle-ar="ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه"
                    data-subtitle-en="Welcomes you. We are proud to be one of the leading companies in the Arab Republic of Egypt."
                    data-link={ROUTES.aboutCompany}
                    data-cta="تعرف علي المزيد"
                    data-cta-ar="تعرف علي المزيد"
                    data-cta-en="Learn more"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-3-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/3.webp" alt="محطة معالجة مياه الشرب" width={1600} height={900} {...{ fetchpriority: 'high' }} />
                    </picture>
                </div>
                <div
                    className="hero-slide"
                    data-title="الإداره العامه للتدريب"
                    data-title-ar="الإداره العامه للتدريب"
                    data-title-en="General Administration of Training"
                    data-subtitle="متاح حجز قاعات التدريب من داخل و خارج الشركة"
                    data-subtitle-ar="متاح حجز قاعات التدريب من داخل و خارج الشركة"
                    data-subtitle-en="Training halls are available for booking from inside and outside the company."
                    data-link={ROUTES.generalAdminTraining}
                    data-cta="تعرف علي المزيد"
                    data-cta-ar="تعرف علي المزيد"
                    data-cta-en="Learn more"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-4-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/4.webp" alt="قاعة تدريب" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
                <div
                    className="hero-slide"
                    data-title="مركز خدمة العملاء"
                    data-title-ar="مركز خدمة العملاء"
                    data-title-en="Customer service center"
                    data-subtitle="مراكز خدمه العملاء وطرق التواصل وعنوان أقرب فرع"
                    data-subtitle-ar="مراكز خدمه العملاء وطرق التواصل وعنوان أقرب فرع"
                    data-subtitle-en="Customer service centers, contact channels, and the address of the nearest branch."
                    data-link={ROUTES.callCenter}
                    data-cta="تعرف علي المزيد"
                    data-cta-ar="تعرف علي المزيد"
                    data-cta-en="Learn more"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-5-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/5.webp" alt="مركز الخط الساخن 125" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
                <div
                    className="hero-slide"
                    data-title="لتنزيل برنامج الخط الساخن اضغط هنا"
                    data-title-ar="لتنزيل برنامج الخط الساخن اضغط هنا"
                    data-title-en="Click here to download the Hotline app"
                    data-subtitle=""
                    data-subtitle-ar=""
                    data-subtitle-en=""
                    data-link={ROUTES.hotlineApp}
                    data-cta="فتح الخدمة"
                    data-cta-ar="فتح الخدمة"
                    data-cta-en="Open service"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-6-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/6.webp" alt="تطبيق الهاتف الذكي hcww-125" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
                <div
                    className="hero-slide"
                    data-title="المنصة الرقمية لخدمة مياه الشرب والصرف الصحي"
                    data-title-ar="المنصة الرقمية لخدمة مياه الشرب والصرف الصحي"
                    data-title-en="Digital Platform for Drinking Water and Sanitation Services"
                    data-subtitle="يمكنك الاستعلام عن قيمة الفاتورة وتسجيل قراءة عداد المياه وسداد الفواتير إلكترونيًا"
                    data-subtitle-ar="يمكنك الاستعلام عن قيمة الفاتورة وتسجيل قراءة عداد المياه وسداد الفواتير إلكترونيًا"
                    data-subtitle-en="You can check your bill, submit your water meter reading, and pay bills electronically."
                    data-link="https://dsp.hcww.com.eg/"
                    data-cta="زيارة المنصة الرقمية"
                    data-cta-ar="زيارة المنصة الرقمية"
                    data-cta-en="Visit the Digital Platform"
                >
                    <picture>
                        <source media="(max-width: 767px)" data-mobile-srcset="/images/slider/slide-7-mobile.webp" width={828} height={1500} />
                        <img data-desktop-src="/images/slider/7.webp" alt="المنصة الرقمية لخدمات مياه الشرب والصرف الصحي" width={1600} height={900} loading="lazy" />
                    </picture>
                </div>
            </div>
            <div className="hero-overlay"></div>
            <button id="hero-prev" type="button" aria-label="السلايد السابق" className="hero-nav-btn hero-nav-btn--left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button id="hero-next" type="button" aria-label="السلايد التالي" className="hero-nav-btn hero-nav-btn--right">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div className="hero-content-wrapper relative z-20 mx-auto grid min-h-[85vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:min-h-[82vh] lg:px-8">
                <div id="hero-content" className="hero-content-animate text-center text-white">
                    <h1 id="hero-title" className="hero-title hero-anim-item">شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد</h1>
                    <p id="hero-subtitle" className="hero-anim-item mx-auto mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه</p>
                    <a id="hero-cta" href={ROUTES.aboutCompany} className="hero-anim-item mt-7 inline-flex rounded-md border border-[#d7b05a]/80 bg-[#d7b05a]/95 px-7 py-3 text-sm font-bold text-[#0a3555] transition hover:bg-[#d7b05a]">تعرف علي المزيد</a>
                </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex items-center justify-center gap-2">
                <button type="button" data-hero-dot data-slide-index="0" aria-label="Slide 1" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="1" aria-label="Slide 2" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="2" aria-label="Slide 3" className="hero-dot hero-dot--active pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="3" aria-label="Slide 4" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="4" aria-label="Slide 5" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="5" aria-label="Slide 6" className="hero-dot pointer-events-auto"></button>
                <button type="button" data-hero-dot data-slide-index="6" aria-label="Slide 7" className="hero-dot pointer-events-auto"></button>
            </div>
        </section>
    );
}

export default memo(HeroSlider);
