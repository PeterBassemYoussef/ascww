import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const featureItems = [
  'التعرف على المعلومات والأخبار الخاصة بقطاع مياه الشرب والصرف الصحى.',
  'إرسال إشعارات للمواطنين عند تحميل التطبيق بكيفية ترشيد الاستهلاك والحفاظ على شبكات الصرف الصحى.',
  'إرسال إشعارات بأعمال الصيانة المخططة وغير المخططة والتعرف على توقيتات انقطاع المياه لتنبيه المواطنين بتدبير احتياجاتهم من المياه.',
  'تلقى شكاوى المواطنين والرد عليها.',
  'إمكانية التصوير الفوتوغرافى لمكان الشكوى أو الكسر وإرساله عبر التطبيق.',
  'إمكانية الدفع الإلكترونى لفواتير استهلاك مياه الشرب والصرف الصحى.',
];

const complaintTypes = [
  'كسور مواسير المياه.',
  'طفوحات الصرف الصحى.',
  'قيمة الفواتير.',
];

function HotlineAppPage() {
  const videoUrl = 'https://www.youtube.com/watch?v=lxPod5W8rZs';
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-10" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">تطبيق الهاتف المحمول (HCWW 125)</h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                لتلقى شكاوى المواطنين والسداد الإلكترونى للفواتير المتعلقة بخدمات مياه الشرب والصرف الصحى.
              </p>
            </div>

            <div className="space-y-10 px-6 py-8 text-slate-800 sm:px-8">
              <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start">
                <div className="min-w-0 space-y-4 leading-8 break-words">
                  <p>
                    تطبيق الهاتف المحمول (HCWW 125)، لتلقى شكاوى المواطنين والسداد الالكتروني للفواتير المتعلقة بخدمات مياه
                    الشرب والصرف الصحى.
                  </p>
                  <p>
                    نشرت الشركة القابضة لمياه الشرب والصرف الصحى، فيديو تعريفى، يوضح كيفية تحميل والتسجيل فى التطبيق الجديد
                    125 الخاص بتلقى الشكاوى المتعلقة بالفواتير وانقطاع المياه وخلافه. وامكانية الدفع الالكتروني لفواتير
                    استهلاك مياه الشرب والصرف الصحي
                  </p>
                </div>
                <figure
                  className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxImage('/images/hotline/hotline1.webp')}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxImage('/images/hotline/hotline1.webp')}
                >
                  <img
                    src="/images/hotline/hotline1.webp"
                    alt="تطبيق الخط الساخن HCWW 125"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </section>

              <section className="space-y-4 leading-8">
                <h2 className="text-xl font-extrabold text-[#0a3555]">التحول الرقمى لخدمة المواطنين</h2>
                <p>
                  ياتي ذلك تنفيذا لتوجيهات القيادة السياسية نحو التحول الرقمي للقطاعات المختلفة بالدولة وخاصة الخدمات التي
                  تمس المواطنين وفي اطار تطوير منظومة تكنولوجيا المعلومات بالشركة القابضة وطبقا للاجراءات الوقائية التي
                  تتخذها الدولة المصرية للحد من انتشار فيروس كورونا المستجد .
                </p>
              </section>


              <section className="space-y-4">
                <h2 className="text-xl font-extrabold text-[#0a3555]">تحميل التطبيق</h2>
                <p className="leading-8 text-slate-700 break-words">
                  يمكنك تحميل تطبيق (HCWW 125) من المتاجر الرسمية على أبل وأندرويد.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://apps.apple.com/eg/app/%D9%A1%D9%A2%D9%A5/id1431089961"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="تحميل تطبيق الخط الساخن من متجر App Store"
                    className="transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="تحميل من App Store"
                      className="block h-16 w-[210px] max-w-full object-contain sm:h-20 sm:w-[240px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.hcww.it.myreading"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="تحميل تطبيق الخط الساخن من متجر Google Play"
                    className="transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="تحميل من Google Play"
                      className="block h-[80px] w-[250px] max-w-full object-contain sm:h-[110px] sm:w-[320px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-extrabold text-[#0a3555]">أهم مزايا التطبيق</h2>
                <p className="leading-8 break-words">
                  يتيح تطبيق الهاتف المحمول 125، عدة مزايا من أهمها، التعرف على المعلومات والأخبار الخاصة بقطاع مياه الشرب
                  والصرف الصحى، وإرسال إشعارات للمواطنين عند تحميل التطبيق بكيفية ترشيد الاستهلاك والحفاظ على شبكات الصرف
                  الصحى، وإرسال إشعارات بأعمال الصيانة المخططة وغير المخططة والتعرف على توقيتات انقطاع المياه لتنبيه
                  المواطنين بتدبير احتياجاتهم من المياه، وتلقى شكاوى المواطنين والرد عليها، وإمكانية التصوير الفوتوغرافى
                  لمكان الشكوى أو الكسر وإرساله عبر التطبيق.
                </p>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start">
                  <ul className="min-w-0 list-disc space-y-3 pr-6 leading-8 break-words">
                    {featureItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <figure
                    className="group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxImage('/images/hotline/hotline2.webp')}
                    onKeyDown={(e) => e.key === 'Enter' && setLightboxImage('/images/hotline/hotline2.webp')}
                  >
                    <img
                      src="/images/hotline/hotline2.webp"
                      alt="تطبيق الخط الساخن HCWW 125"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </div>
              </section>

              <section className="space-y-4 leading-8">
                <h2 className="text-xl font-extrabold text-[#0a3555]">تصريحات رئيس مجلس الإدارة</h2>
                <p>
                  كان المهندس ممدوح رسلان، رئيس مجلس إدارة الشركة القابضة لمياه الشرب والصرف الصحى، قد أكد أن الشركة أطلقت
                  تطبيق الهاتف المحمول (HCWW 125)، لتلقى شكاوى المواطنين المتعلقة بخدمات مياه الشرب والصرف الصحى، سواء كسور
                  مواسير المياه، أو طفوحات الصرف الصحى، أو قيمة الفواتير، حيث يقوم المواطن بتحميل التطبيق على هاتفه المحمول،
                  وتسجيل حساب عليه بالبيانات الشخصية للمواطن، موضحاً أن التطبيق يتيح أيضاً للمواطن تلقى الأخبار بمواعيد
                  انقطاع المياه وأعمال الصيانة المخططة لشبكات المياه والصرف الصحى، كما أنه جارٍ تفعيل خدمة دفع الفاتورة
                  باستخدام التطبيق.
                </p>
                <ul className="list-disc space-y-2 pr-6">
                  {complaintTypes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-dashed border-[#0a3555]/25 bg-[#0a3555]/3 px-4 py-5 text-slate-800">
                <p className="text-lg font-bold text-[#0a3555]">لمشاهدة الفيديو لتحميل واستخدام التطبيق</p>
                <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:max-w-lg">
                  <div className="relative aspect-video w-full bg-slate-100">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src="https://www.youtube.com/embed/lxPod5W8rZs"
                      title="فيديو شرح تطبيق الخط الساخن"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0a3555] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#082b47]"
                  >
                    مشاهدة الفيديو
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </section>


            </div>
          </section>
        </div>
      </main>
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="presentation"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-10 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 shadow-md hover:bg-white"
              onClick={() => setLightboxImage(null)}
            >
              إغلاق
            </button>
            <img
              src={lightboxImage}
              alt="تكبير الصورة"
              loading="lazy"
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default HotlineAppPage;
