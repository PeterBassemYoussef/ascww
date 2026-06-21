import { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = { ar: string; en: string };
type TrainingSlide = { src: string; alt: LocalizedText };
type TrainingTab = { id: string; title: LocalizedText; description: LocalizedText[] };
type TrainingShowcaseItem = { id: string; title: LocalizedText; image: string; points: LocalizedText[] };
type TrainingHall = { id: string; image: string; title: LocalizedText; alt: LocalizedText; description: LocalizedText };

const trainingSlides: TrainingSlide[] = [
  { src: '/images/training/47.webp', alt: { ar: 'قاعة التدريب رقم 1', en: 'Training hall 1' } },
  { src: '/images/training/48.webp', alt: { ar: 'قاعة التدريب رقم 2', en: 'Training hall 2' } },
  { src: '/images/training/49.webp', alt: { ar: 'قاعة التدريب رقم 3', en: 'Training hall 3' } },
  { src: '/images/training/50.webp', alt: { ar: 'قاعة التدريب رقم 4', en: 'Training hall 4' } },
];

const SLIDE_INTERVAL_MS = 4000;

const trainingTabs: TrainingTab[] = [
  { id: 'goals', title: { ar: 'أهدافنا الاستراتيجية', en: 'Our Strategic Goals' }, description: [
    { ar: 'إعداد الكوادر الإدارية والفنية المتخصصة كل في مجاله', en: 'Preparing specialized administrative and technical staff in each field.' },
    { ar: 'تنمية الموارد البشرية بمساعدتها على اكتساب وتحسين المهارات والكفاءات للقيام بالواجبات الحالية والمستقبلية', en: 'Developing human resources by helping them acquire and improve the skills and competencies needed for current and future responsibilities.' },
    { ar: 'تمكين الشركة من العمل طبقا لمعايير الجودة المطلوبة', en: 'Enabling the company to operate according to the required quality standards.' },
    { ar: 'تعزيز فرص النمو والتطور لدى موظفي الشركة من أجل تنمية طاقاتهم', en: 'Enhancing growth and development opportunities for company employees to build their capabilities.' },
  ] },
  { id: 'values', title: { ar: 'قيمنا', en: 'Our Values' }, description: [
    { ar: 'الولاء والانتماء . المصداقية . الالتزام وبناء الثقة . الشفافية', en: 'Loyalty and belonging, credibility, commitment and trust-building, and transparency.' },
  ] },
  { id: 'mission', title: { ar: 'رسالتنا', en: 'Our Mission' }, description: [
    { ar: 'الإشراف الكامل على مختلف صور التدريب', en: 'Providing full supervision over all forms of training.' },
    { ar: 'حسن اختيار الكوادر المسئولة عن إدارة منظومة التدريب.', en: 'Selecting the most suitable staff to manage the training system.' },
  ] },
  { id: 'vision', title: { ar: 'رؤيتنا', en: 'Our Vision' }, description: [
    { ar: 'الوصول إلى مستوى أداء عالمى فى إطار منظومة من القيم السائدة', en: 'Reaching a world-class level of performance within a strong values-based system.' },
  ] },
];

const trainingShowcaseItems: TrainingShowcaseItem[] = [
  { id: 'training-specialist', title: { ar: 'اخصائى تدريب', en: 'Training Specialist' }, image: '/images/training/61.webp', points: [
    { ar: 'قياس مردود التدريب والعائد على الاستثمار', en: 'Measuring training impact and return on investment.' },
    { ar: 'برنامج المحاسب المحترف الشامل', en: 'Comprehensive professional accountant program.' },
    { ar: 'التحويل الرقمى وكيفية تطبيق من خلال البرامج', en: 'Digital transformation and how to apply it through software solutions.' },
    { ar: 'مهارات اعداد المواد التفاعلية للتدريب الالكتروني', en: 'Skills for preparing interactive materials for e-learning.' },
    { ar: 'التسويق الالكتروني', en: 'Digital marketing.' },
  ] },
  { id: 'item-2-mechanic', title: { ar: 'فنى حملة', en: 'Vehicle Technician' }, image: '/images/training/64.webp', points: [
    { ar: 'دورة الزيت', en: 'Lubrication cycle.' },
    { ar: 'الدوائر الاساسية فى المركبات', en: 'Basic circuits in vehicles.' },
    { ar: 'انواع المركبات و مكوناتها والاعطال الشائعة', en: 'Types of vehicles, their components, and common faults.' },
    { ar: 'انواع المركبات ومكوناتها والاعطال الشائعة', en: 'Vehicle components and the most common breakdowns.' },
  ] },
  { id: 'community-awareness', title: { ar: 'ادارة التوعية -المشاركه الاجتماعيه', en: 'Awareness and Community Participation' }, image: '/images/training/56.webp', points: [
    { ar: 'كيفية اعداد البحوث الكمية والنوعية واعداد المسوح المجتمعية الميداني', en: 'How to prepare quantitative and qualitative research and field community surveys.' },
    { ar: 'مهارات الارشاد والتوعية', en: 'Guidance and awareness skills.' },
    { ar: 'الاتصال والتواصل المجتمعى والمشاركة المجتمعية', en: 'Community communication, outreach, and participation.' },
  ] },
  { id: 'admin', title: { ar: 'إدارى', en: 'Administrative' }, image: '/images/training/59.webp', points: [
    { ar: 'fidic', en: 'FIDIC.' }, { ar: 'مسار وظيفى للدرجات القيادية', en: 'Career path for leadership grades.' }, { ar: 'ادارة الازمات', en: 'Crisis management.' }, { ar: 'ادارة الوقت', en: 'Time management.' },
    { ar: 'الاتجاهات الحديثة فى الادارة', en: 'Modern management trends.' }, { ar: 'طرق الوقاية من مخاطر بيئة العمل وانواع هذه المخاطر', en: 'Methods of preventing workplace hazards and understanding their types.' },
    { ar: 'المهارات المتقدمة فى اعداد التقارير والخطابات والمذكرات', en: 'Advanced skills in preparing reports, letters, and memoranda.' }, { ar: 'مهارات وضع معايير التقييم ومؤشرات الاداء', en: 'Skills for setting evaluation criteria and performance indicators.' },
    { ar: 'TOT', en: 'TOT.' }, { ar: 'اعداد كوادر لصف ثانى', en: 'Preparing second-line cadres.' }, { ar: 'لغة انجليزية', en: 'English language.' },
  ] },
  { id: 'hr', title: { ar: 'موارد بشرية', en: 'Human Resources' }, image: '/images/training/60.webp', points: [
    { ar: 'احكام قانون كسب العمل وتعديلاتة', en: 'Provisions of labor law and its amendments.' }, { ar: 'تقييم الأداء', en: 'Performance evaluation.' }, { ar: 'اعداد الهياكل التنظيمية تحليل الوظائف', en: 'Preparing organizational structures and job analysis.' },
    { ar: 'التسويات', en: 'Settlements.' }, { ar: 'انشاء وثائق الخدمة', en: 'Preparing service records.' }, { ar: 'اجراءات العمل بالموارد البشرية', en: 'Human resources work procedures.' },
    { ar: 'اجراءات العمل بالموارد البشرية', en: 'HR operating procedures.' }, { ar: 'استراتيجة الموارد البشرية', en: 'Human resources strategy.' }, { ar: 'دليل لائحة واجراءات', en: 'Regulations and procedures guide.' },
  ] },
  { id: 'item-6-public-relations', title: { ar: 'علاقات عامة', en: 'Public Relations' }, image: '/images/training/58.webp', points: [
    { ar: 'PHOTOSHOP', en: 'Photoshop.' }, { ar: 'التسويق الرقمى', en: 'Digital marketing.' }, { ar: 'بحوث الراى', en: 'Opinion research.' }, { ar: 'العلاقات العامة من منظور جديد', en: 'Public relations from a new perspective.' },
    { ar: 'ادارة المراسم والبروتوكولات وتنظيم المعارض والمؤتمرات', en: 'Managing ceremonies, protocols, exhibitions, and conferences.' }, { ar: 'كتابة وصياغة الاخبار الصحفية والتقارير الصحفية', en: 'Writing and editing press news and press reports.' },
  ] },
  { id: 'item-9-it-programs', title: { ar: 'برامج تكنولوجيا المعلومات', en: 'Information Technology Programs' }, image: '/images/training/57.webp', points: [
    { ar: 'CCNA Certification', en: 'CCNA Certification.' }, { ar: 'icdl', en: 'ICDL.' },
  ] },
  { id: 'secretariat', title: { ar: 'سكرتارية', en: 'Secretariat' }, image: '/images/training/63.webp', points: [
    { ar: 'الارشفة وحفظ الملفات', en: 'Archiving and file preservation.' }, { ar: 'مهارات السكرتارية', en: 'Secretarial skills.' },
  ] },
  { id: 'security-specialist', title: { ar: 'أخصائي أمن', en: 'Security Specialist' }, image: '/images/training/62.webp', points: [
    { ar: 'كتابة التقارير الامني', en: 'Writing security reports.' }, { ar: 'تأمين المنشأت', en: 'Facility security.' },
  ] },
];

const hallFeatures: LocalizedText[] = [
  { ar: 'شاشة عرض ( Projector ( smart board ))', en: 'Display screen (Projector / smart board).' },
  { ar: 'جهاز كبيوتر ( pc )', en: 'Computer (PC).' },
  { ar: 'ميكرفون ( Sound system )', en: 'Microphone (sound system).' },
  { ar: 'كاميرا ( Video cam )', en: 'Video camera.' },
  { ar: 'أدوات مساعدات تدريبيه', en: 'Training aids.' },
  { ar: 'سبوره بيضاء ( White board )', en: 'White board.' },
  { ar: 'قلم سبوره ( penboard )', en: 'Whiteboard marker.' },
  { ar: 'حقيبه أدوات التدريب ( Training tools bag )', en: 'Training tools bag.' },
];

const trainingHalls: TrainingHall[] = [
  { id: 'hall-1', image: '/images/training/47.webp', title: { ar: 'قاعة رقم ( 1 )', en: 'Hall No. (1)' }, alt: { ar: 'قاعة رقم 1', en: 'Hall 1' }, description: { ar: 'لعقد ورش عمل تسع 30 فرد مجهزه بأحدث الأجهزه.', en: 'A workshop hall for 30 participants equipped with the latest devices.' } },
  { id: 'hall-2', image: '/images/training/48.webp', title: { ar: 'قاعة رقم ( 2 )', en: 'Hall No. (2)' }, alt: { ar: 'قاعة رقم 2', en: 'Hall 2' }, description: { ar: 'قاعة محاضرات تسع 50 متدريب مجهزه بأحدث الأجهزه.', en: 'A lecture hall for 50 trainees equipped with the latest devices.' } },
  { id: 'hall-3', image: '/images/training/49.webp', title: { ar: 'قاعة رقم ( 3 )', en: 'Hall No. (3)' }, alt: { ar: 'قاعة رقم 3', en: 'Hall 3' }, description: { ar: 'قاعه التعليم الاَلكتروني تسع 20 متدرب مجهزه بأحدث الأجهزه.', en: 'An e-learning hall for 20 trainees equipped with the latest devices.' } },
  { id: 'hall-4', image: '/images/training/50.webp', title: { ar: 'قاعة رقم ( 4 )', en: 'Hall No. (4)' }, alt: { ar: 'قاعة رقم 4', en: 'Hall 4' }, description: { ar: 'قاعة إجتماعات (U-SHAPE) تسع 30 متدرب مجهزه بأحدث الأجهزه.', en: 'A U-shape meeting hall for 30 trainees equipped with the latest devices.' } },
];

const renderTrainingTabIcon = (id: string) => {
  const wrapClass = 'flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm ring-1 ring-black/5';
  const iconClass = 'h-4 w-4';
  switch (id) {
    case 'goals': return <span className={`${wrapClass} bg-emerald-500`}><svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M5 4h9l4 4v12H5z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 4v4h4" strokeLinecap="round" strokeLinejoin="round" /><path d="m9 13 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
    case 'values': return <span className={`${wrapClass} bg-rose-500`}><svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
    case 'mission': return <span className={`${wrapClass} bg-sky-500`}><svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
    case 'vision': return <span className={`${wrapClass} bg-amber-500`}><svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
    default: return null;
  }
};

const trainingProgramsIntro: LocalizedText = {
  ar: 'أنواع البرامج التدريبية',
  en: 'Training Program Types',
};

const trainingProgramsList: LocalizedText[] = [
  { ar: 'حصول التدريب علي الايزو', en: 'The training unit has obtained ISO certification.' },
];

const hallsSectionTitle: LocalizedText = {
  ar: 'القاعات',
  en: 'Training Halls',
};

const hallsSectionDescription: LocalizedText = {
  ar: 'يوجد لدينا قاعات تدريب بشركه مياه أسيوط والصرف الصحي متاح الاستعلام والحجز من أي جهه داخل أو خارج الشركة.',
  en: 'We offer training halls at Assiut Water and Wastewater Company, and they are available for inquiry and booking by entities inside or outside the company.',
};

function GeneralAdminTrainingPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = useCallback((text: LocalizedText) => (isEnglish ? text.en : text.ar), [isEnglish]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState(trainingTabs[0]?.id ?? 'goals');
  const [openedHallImage, setOpenedHallImage] = useState<{ src: string; alt: string } | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const currentTab = trainingTabs.find((tab) => tab.id === activeTab) ?? trainingTabs[0];
  const activeSlideItem = trainingSlides[activeSlide];
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const hallFeaturesPaddingClass = isEnglish ? 'pl-0 pr-2' : 'pl-2 pr-0';
  const hallFeaturesIconSpacingClass = isEnglish ? 'mr-2' : 'ml-2';
  const hallFeatureIcons = ['📽️', '🖥️', '🎤', '📹', '🧰', '🧾', '✍️', '🎒'] as const;

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (trainingSlides.length <= 1) return;
    stopAutoplay();
    autoplayRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % trainingSlides.length);
    }, SLIDE_INTERVAL_MS);
  }, [stopAutoplay]);

  const goToSlide = useCallback((index: number) => {
    const total = trainingSlides.length;
    setActiveSlide((index + total) % total);
    if (!isPaused) {
      startAutoplay();
    }
  }, [isPaused, startAutoplay]);

  useEffect(() => {
    if (isPaused) {
      stopAutoplay();
      return undefined;
    }

    startAutoplay();
    return () => stopAutoplay();
  }, [isPaused, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!openedHallImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedHallImage(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openedHallImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                {t({ ar: 'الإدارة العامة للتدريب', en: 'General Administration of Training' })}
              </h1>
              <p className={`mt-2 text-sm leading-7 text-slate-600 sm:text-base ${textAlignmentClass}`}>
                {t({
                  ar: 'عرض أنواع التدريب المتاحة والقاعات المجهزة لعقد البرامج التدريبية.',
                  en: 'An overview of available training types and fully equipped halls for delivering training programs.',
                })}
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section
                className="relative h-[260px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 sm:h-[360px] lg:h-[460px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  role="img"
                  aria-label={activeSlideItem ? t(activeSlideItem.alt) : t({ ar: 'قاعة التدريب', en: 'Training hall' })}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: activeSlideItem?.src ? `url(${activeSlideItem.src})` : undefined }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent" />

                <button
                  type="button"
                  onClick={() => goToSlide(activeSlide - 1)}
                  aria-label={t({ ar: 'الصورة السابقة', en: 'Previous image' })}
                  className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white backdrop-blur transition hover:bg-white/30 sm:inline-flex"
                >
                  {isEnglish ? '‹' : '›'}
                </button>
                <button
                  type="button"
                  onClick={() => goToSlide(activeSlide + 1)}
                  aria-label={t({ ar: 'الصورة التالية', en: 'Next image' })}
                  className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white backdrop-blur transition hover:bg-white/30 sm:inline-flex"
                >
                  {isEnglish ? '›' : '‹'}
                </button>

                <div className={`absolute bottom-4 z-10 flex items-center gap-2 ${isEnglish ? 'left-4' : 'right-4'}`}>
                  {trainingSlides.map((slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={t({
                        ar: `عرض الصورة رقم ${index + 1}`,
                        en: `View image ${index + 1}`,
                      })}
                      className={`inline-flex h-3 w-3 shrink-0 rounded-full transition-all sm:h-2.5 sm:w-2.5 ${
                        index === activeSlide
                          ? 'bg-[#d7b05a] shadow-[0_0_10px_rgba(215,176,90,0.7)] ring-2 ring-white/70'
                          : 'bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap gap-3">
                  {trainingTabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition sm:text-base ${
                          isActive
                            ? 'bg-gradient-to-l from-[#0a3555] to-[#1170b0] text-white shadow-[0_10px_24px_rgba(10,53,85,0.3)]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {renderTrainingTabIcon(tab.id)}
                          {t(tab.title)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className={`mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-slate-700 sm:p-5 ${textAlignmentClass}`}>
                  {currentTab.description.length > 1 ? (
                    <ul className="space-y-2 leading-8">
                      {currentTab.description.map((line) => (
                        <li key={line.ar}>• {t(line)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="leading-8">{t(currentTab.description[0])}</p>
                  )}
                </div>
              </section>

              <section className={`rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm sm:p-6 ${textAlignmentClass}`}>
                <h2 className="text-lg font-extrabold text-[#0a3555] sm:text-xl">{t(trainingProgramsIntro)}</h2>
                <ul className="mt-3 space-y-2 leading-8">
                  {trainingProgramsList.map((item) => (
                    <li key={item.ar}>• {t(item)}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {trainingShowcaseItems.map((item) => (
                    <article
                      key={item.id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1170b0]/40 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,53,85,0.08),_transparent_55%)] transition duration-300 group-hover:opacity-80" />
                      <div className="relative">
                        <h3 className={`text-xl font-extrabold text-[#0a3555] transition duration-300 group-hover:text-[#1170b0] ${textAlignmentClass}`}>
                          {t(item.title)}
                        </h3>
                        <div className="mx-auto mt-4 flex h-44 w-56 items-center justify-center rounded-2xl bg-slate-50 p-2">
                          <img
                            decoding="async"
                            src={item.image}
                            alt={t(item.title)}
                            loading="lazy"
                            className="h-full w-full rounded-xl object-contain object-center transition duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                        <ul className={`mt-4 space-y-2 text-sm leading-7 text-slate-700 ${textAlignmentClass}`}>
                          {item.points.map((point) => (
                            <li key={point.ar}>• {t(point)}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={`rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 ${textAlignmentClass}`}>
                <h2 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl text-[#0a3555]">{t(hallsSectionTitle)}</h2>
                <div className="mt-2 text-sm leading-7 text-slate-700">
                  <p className="text-base font-semibold leading-7">{t(hallsSectionDescription)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#1170b0]/10 px-3 py-1 font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-sm">📞</span>
                      0882334346
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0a3555]/10 px-3 py-1 font-bold text-[#0a3555]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm">📱</span>
                      01280733381
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">
                      {t({ ar: 'وسائل التواصل', en: 'Social links' })}
                      <a
                        href="https://www.facebook.com/ASCWWeg"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t({ ar: 'فيسبوك', en: 'Facebook' })}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1877f2] shadow-sm transition hover:-translate-y-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" />
                        </svg>
                      </a>
                      <a
                        href="https://api.whatsapp.com/send?phone=201281565653"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t({ ar: 'واتساب', en: 'WhatsApp' })}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#25d366] shadow-sm transition hover:-translate-y-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </section>

              {trainingHalls.map((hall, hallIndex) => (
                <section key={hall.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-stretch">
                    <button
                      type="button"
                      onClick={() => setOpenedHallImage({ src: hall.image, alt: t(hall.alt) })}
                      className="group relative h-[240px] cursor-zoom-in overflow-hidden rounded-3xl sm:h-[300px] lg:h-full"
                      aria-label={t({
                        ar: `تكبير صورة ${hall.alt.ar}`,
                        en: `Open ${hall.alt.en} image`,
                      })}
                    >
                      <img
                        decoding="async"
                        src={hall.image}
                        alt={t(hall.alt)}
                        loading="lazy"
                        className="h-full w-full rounded-3xl object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </button>
                    <div className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700 lg:h-full lg:overflow-hidden xl:p-4 ${textAlignmentClass}`}>
                      <h2 className="text-xl font-extrabold text-[#0a3555]">{t(hall.title)}</h2>
                      <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📞</span>
                        0882334346
                      </p>
                      <p className="mt-3 leading-7">{t(hall.description)}</p>
                      <ul className={`mt-4 space-y-2 text-sm leading-7 ${hallFeaturesPaddingClass}`}>
                        {hallFeatures.map((feature, featureIndex) => (
                          <li key={`${hall.id}-${feature.ar}`}>
                            <span className={`${hallFeaturesIconSpacingClass} inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm`}>
                              {hallFeatureIcons[featureIndex % hallFeatureIcons.length]}
                            </span>
                            {t(feature)}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-2xl border border-dashed border-[#1170b0]/25 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600">
                        {t({
                          ar: `القاعة رقم ${hallIndex + 1} متاحة للحجز والاستعلام عبر إدارة التدريب.`,
                          en: `Hall ${hallIndex + 1} is available for booking and inquiry through the training administration.`,
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      </main>
      {openedHallImage ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setOpenedHallImage(null)}
        >
          <div
            className="relative w-full max-w-[92vw] overflow-hidden rounded-xl border border-white/15 bg-slate-950"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={openedHallImage.alt}
          >
            <button
              type="button"
              onClick={() => setOpenedHallImage(null)}
              className={`absolute top-3 z-10 rounded-lg bg-black/60 px-3 py-1 text-sm font-bold text-white transition hover:bg-black/80 ${isEnglish ? 'right-3' : 'left-3'}`}
            >
              {t({ ar: 'إغلاق', en: 'Close' })}
            </button>
            <img
              loading="lazy"
              decoding="async"
              src={openedHallImage.src}
              alt={openedHallImage.alt}
              className="max-h-[82vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default GeneralAdminTrainingPage;

