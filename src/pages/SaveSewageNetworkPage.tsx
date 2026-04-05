import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const introParagraphs = [
  'يتمّ تجميع مياه الصرف الصحي ونقلها من المدينة ومن القرية إلى المعهد لتنقية المجاري من خلال شبكة المواسير بواسطة قوة التجاذب والضخّ. وتحتاج هذه الشبكات إلى الرعاية والصيانة',
  'في الماضي قامت السلطات المحلية المسؤولة عن الصرف الصحي البلدي بتصريف المجاري دون التخطيط المنظم مع الصيانة طويلة الأمد للشبكة والأنابيب',
  'وفي نوفمبر عام 2011 م نشرت وزارة حماية البيئة والأنظمة الخاصّة بإدارة شبكات نقل الصرف الصحي، والتي تفرض على السلطات المحلية القيام بدراسة شاملة لشبكات النقل ضمن حدودها بالإضافة إلى وضع التخطيط المفصَّل للصيانة المستمرّة وطويلة الأمد وتبديل الأنابيب القديمة من فترة إلى أخرى',
  'تتطلب شبكات الصرف الصحي عمليات الصيانة الدورية والمهنية وذلك للحفاظ على الشبكة من عوامل الهدر وتحقيق الاستفادة القصوى من الشبكة',
];

const networkProblems = [
  'أكسدة المواسير وتآكلها وانكسارها حيث تتسرب مياه الصرف الصحي إلى الأرض والمياه الجوفية',
  'انسداد الأنابيب بالمواد العالقة',
  'الوقف المتكرر للمضخات بسبب انقطاع الكهرباء أو خلل ميكانيكي حيث تجري مياه الصرف الصحي إلى البيئة',
  'انتشار الرائحة الكريهة من معاهد الضخّ',
];

const endingParagraphs = [
  'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها',
  'تتم الصيانة بالطرق التالية :',
  'إقامة نظام كهربائي بديل لضمان استمرار عمل المضخات في أوقات انقطاع الكهرباء',
  'إبعاد معاهد الضخ من التجمعات السكانية أو إقامة المنشآت لتخفيض الروائح',
  'استعمال التكنولوجيا المتقدمة منها تصوير الأنابيب',
  'دراسة الوسائل الهندسية لتخفيض التآكل والتصدع',
  'في المخططات لتطوير البناء في المدن والقري',
  'المطالبة بإبعاد مواسير الصرف الصحي عن الأحياء السكنية الجديدة .',
  'المطالبة بالحماية الخاصّة للمواسير المتواجدة بالقرب من حفريات مياه الشرب',
  'نص التعليمات حول تخطيط المحطات لضخ مياه الصرف الصحي وصيانتها',
];

const regulationsParagraphs = [
  'تفرض أنظمة شبكة نقل الصرف الصحي التي نشرتها وزارة حماية البيئة في نوفمبر 2011 م على السلطات المحلية القيام بالدراسة الشاملة لشبكات نقل الصرف الصحي ضمن حدودها بالإضافة إلى وضع التخطيط المفصَّل للصيانة المستمرّة وتبديل المواسير القديمة.',
  'هدف الأنظمة:',
  'منع تسرب مياه الصرف الصحي من شبكة نقل المجاري من أجل حماية موارد المياه والنظم الإيكولوجية والتنوع البيولوجي ومنع الإزعاجات للبيئة.',
  'أهمّ مبادئ الأنظمة',
  'تقوم السلطة المحلية التي تنقل الصرف الصحي إلى حدود سلطة أخرى بإخبار السلطة التي تستوعب المجاري عن كل تغير في كمية الصرف الصحي وعن أي خلل في شبكة النقل تقوم السلطة المحلية بإقامة شبكة نقل الصرف الصحي وبإدارتها وبصيانتها لضمان منع تسرب مياه الصرف الصحي إلى البيئة.تقوم السلطة المحلية التي تستوعب الصرف الصحي من سلطة أخرى بإخبار السلطة المحلية التي تصرف المياه إليها عن كل تغيير في الشبكة المتواجدة في حدودها والتي قد تسبب التسرب والمكاره البيئيةتقوم السلطة المحلية باحتفاظ جميع المعطيات عن شبكة نقل الصرف الصحي في الحاسوب وفي نظام المعلومات الجغرافي تقوم السلطة المحلية التي تمتلك شبكة نقل الصرف الصحي بالتخطيط المفصَّل لتجديد الشبكة وتطويرها حسينها قطع الصلة بين شبكة النقل وشبكة مصارف المياه وبالأعمال لتصليح أي تسرب وخلل بالإضافة إلى الصيانة اليومية يجب على السلطة المحلية تشغيل المحطة لضخ مياه الصرف الصحي وصيانتها بموجب إرشادات الوزارة لحماية البيئة تقوم السلطة المحلية بالفحص المنتظم لشبكة نقل مياه الصرف الصحي وتحتفظ بالمعطيات لمدّة 7 سنوات على الأقلّتضع السلطة المحلية التعليمات لعلاج تسرب مياه الصرف الصحي وتقوم بالتصليح الفوري للخللتنشر السلطة المحلية جميع المعطيات عن شبكة نقل مياه الصرف الصحي على موقع الإنترنت التابع للسلطة المحلية وتفتح أمام الجمهور في مكاتبها جميع المعطياتيفصل الملحق للأنظمة طول حياه مختلف أنواع المواسير لنقل الصرف الصحي حسب مادّة الماسورة إذا كانت من أسبست الاسمنت أو الفلاذ أو مختلف أنواع Polyethelen.',
];

function SaveSewageNetworkPage() {
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
              <h1 className="text-2xl font-extrabold sm:text-3xl">أهمية الحفاظ على شبكة الصرف الصحى</h1>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  طريقه الحفاظ علي شبكات مياه الصرف الصحي
                </h2>
                <div className="mt-4">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/save1.webp"
                      alt="أهمية الحفاظ على شبكة الصرف الصحي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/save1.webp',
                          alt: 'أهمية الحفاظ على شبكة الصرف الصحي',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                  {introParagraphs.map((paragraph) => (
                    <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">مشاكل صيانه الشبكه</h2>
                <div className="mt-4">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/save2.webp"
                      alt="مشاكل صيانة شبكة الصرف الصحي"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/save2.webp',
                          alt: 'مشاكل صيانة شبكة الصرف الصحي',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <p className="text-right text-base leading-8 text-slate-700">من أهمّ المشاكل في صيانة هذه الشبكة</p>
                  <div className="mt-4 space-y-4">
                    {networkProblems.map((paragraph) => (
                      <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها
                </h2>
                <div className="mt-4">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[36%]">
                    <img decoding="async"
                      src="/images/prosses-water/save3.webp"
                      alt="التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/save3.webp',
                          alt: 'التعليمات حول تخطيط شبكة النقل ومحطات الضخ وصيانتها',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {endingParagraphs.slice(1).map((paragraph) => (
                      <p key={paragraph} className="text-right text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555] sm:text-2xl">
                  الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها
                </h2>
                <div className="mt-4">
                  <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:float-left md:mb-3 md:ml-6 md:w-[44%]">
                    <img decoding="async"
                      src="/images/prosses-water/save4.webp"
                      alt="الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها"
                      loading="lazy"
                      onClick={() =>
                        openLightbox({
                          src: '/images/prosses-water/save4.webp',
                          alt: 'الأنظمة حول تخطيط شبكة نقل الصرف الصحي وصيانتها',
                        })
                      }
                      title="اضغط للتكبير"
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  </figure>
                  <div className="space-y-4">
                    {regulationsParagraphs.map((paragraph) => (
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

export default SaveSewageNetworkPage;
