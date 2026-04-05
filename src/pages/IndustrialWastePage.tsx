import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const industrialWasteParagraphs = [
  'مع التقدم الصناعي لكثير من دول العالم وازدياد عدد المنشأت الصناعية في معظم دول العالم النامي والمتقدم ، ظهرت مشكلة التخلص من المخلفات الصناعية السائلة الناتجة عن النشاط الصناعي ، واتجهت كثير من الشركات الصناعية الي التخلص من مخلفاتها السائلة بصرفها الي المجاري العمومية ( شبكات الصرف الصحي ) ولذلك فمن الضروري مراقبة عمليات صرف أية مخلفات صناعية وألا تسمح السلطات الرقابية بصرف أية مياه صرف صناعية على الشبكة العمومية قبل معرفة كافة خصائص هذه المياه ومدى قدرة شبكة الصرف علي استيعابها ، بالاضافة الى معرفة تأثير ومدى خطورة صرف المركبات المختلفة الموجودة في هذه المياه على شبكات الصرف الصحي وذلك علي المدى القريب والمدى البعيد',
  'إن اهتمام المجتمع الحقيقي بالبيئة على المدى الطويل مطلوب لتحقيق تغيير في مفهوم العامة للحفاظ على البيئة من أجل التنمية المستدامة',
  'ومياه الصرف الصناعي يختلف وضعها من صناعة لأخرى نتيجة لاختلاف المواد الأولية اللازمة للصناعة والمواد الناتجة أو المصنعة',
  'إن التصنيف النهائى للملوثات من حيث كونها مطابقة أو غير مطابقة يعتمد علي دراسة نظام الصرف الصحى( محطات المعالجة وشبكات الصرف الصحي ).',
];

const treatmentStationParagraphs = [
  'باختصار يتم في المدن والقرى تجميع مياه الصرف الصحي في خطوط يتم توجيهها الى محطات المعالجة التي هي على نوعين :',
  'المحطات المفتوحة',
  'الطريقة المغلقة',
  'للنظامين الاحجام المناسبة والتصميم المناسب حسب كميات المياه المطلوب معالجتها يومياً .',
];

const pollutantsParagraphs = [
  'المواد الصلبة العالقة – المواد المغذية – الملوثات ذات الأهمية القصوى – المواد العضوية صعبة التحلل- المعادن الثقيلة – الأملاح الغير العضوية الذائبة',
];

const treatmentMethodsParagraphs = [
  'عمليات المعالجة الفيزيائية',
  'عمليات المعالجة البيولوجية',
  'عمليات المعالجة الكيميائية',
  'إن دور الإدارة العامة للصرف الصناعي بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد لا يقتصر على الإشراف على المنشآت بجميع أنواعها ( صناعية – تجارية – سياحية – طبية ،،،،،،،،،،)ولكن أيضا يكمن في الحفاظ على شبكات الصرف الصحى من أجل غدا أفضل',
];

function IndustrialWastePage() {
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const openLightbox = (image: { src: string; alt: string }) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">الصرف الصناعي</h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">نبذه عن الصرف الصناعي</h2>
                <div className="mt-4 flow-root">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/manufactring-waste1.webp"
                      alt="نبذه عن الصرف الصناعي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/manufactring-waste1.webp',
                          alt: 'نبذه عن الصرف الصناعي',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {industrialWasteParagraphs.map((paragraph) => (
                      <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">محطات المعالجه</h2>
                <div className="mt-4 flow-root">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/manufactring-waste2.webp"
                      alt="محطات المعالجه"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/manufactring-waste2.webp',
                          alt: 'محطات المعالجه',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {treatmentStationParagraphs.map((paragraph) => (
                      <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">الملوثات فى مياه الصرف الصناعي</h2>
                <div className="mt-4 flow-root">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/manufactring-waste3.webp"
                      alt="الملوثات فى مياه الصرف الصناعي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/manufactring-waste3.webp',
                          alt: 'الملوثات فى مياه الصرف الصناعي',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {pollutantsParagraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-right text-base leading-8 text-slate-700 md:text-lg md:leading-[4rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">الطرق الشائعة لمعالجة مياه الصرف الصناعي</h2>
                <div className="mt-4 flow-root">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/manufactring-waste4.webp"
                      alt="الطرق الشائعة لمعالجة مياه الصرف الصناعي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/manufactring-waste4.webp',
                          alt: 'الطرق الشائعة لمعالجة مياه الصرف الصناعي',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {treatmentMethodsParagraphs.map((paragraph) => (
                      <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 px-2 py-4 sm:px-4 sm:py-6"
          onClick={closeLightbox}
          role="presentation"
        >
          <div
            className="relative max-h-full max-w-[96vw]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.alt}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow"
            >
              إغلاق
            </button>
            <img loading="lazy" decoding="async"
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[92vh] w-auto max-w-full rounded-2xl border border-white/20 bg-white object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default IndustrialWastePage;
