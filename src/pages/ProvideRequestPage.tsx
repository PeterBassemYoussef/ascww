import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

function ProvideRequestPage() {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!zoomedImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-8" dir="rtl">
        <div className="container mx-auto max-w-6xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">الأسئلة الشائعة عن طلبات شركة المياه</h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">كل ما تحتاج معرفته قبل تقديم طلبات المياه أو الصرف الصحي.</p>
            </div>

            <div className="space-y-8 px-6 py-8 text-slate-800 sm:px-8">
              <section className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">الاحتياجات اللازمة للتعاقد علي العداد التنظيمي والمباني الإنشائية</h2>
                    <ul className="list-disc space-y-3 pr-6 leading-8">
                      <li>موافقة الجهة المختصة علي دخول المياه والصرف الصحي محل الأشتراك وصورة من مستندات الترخيص الصادرة من الجهات الرسمية.</li>
                      <li>نسخة معتمدة من الرسومات المعمارية لكافة الأدوار المبنية بمستندات الترخيص الصادرة من الجهات الرسمية في حالة الحاجة لها.</li>
                      <li>صورة بطاقة الرقم القومي للأشخاص الطبيعيين.</li>
                      <li>المستندات المؤيدة لحيازته لمحل الأشتراك (مستند ملكية-ترخيص مباني-عقد إيجار) أو أي مستند يؤيد الحيازة.</li>
                      <li>صورة من تعاقد أو إيصال مرافق أخرى (كهرباء، غاز، تليفونات) إن وجد.</li>
                      <li>تنازل من المشترك السابق في حالة طلب نقل الاشتراك باسمه.</li>
                      <li>تنازل من الورثة في حالة طلب نقل الاشتراك من اسم المشترك المتوفي إلى طالب الاشتراك الجديد مرفقًا به صورة من إعلام الوراثة (الأصل للاطلاع).</li>
                      <li>في حالة النشاط غير المنزلي سواء كان خدمي أو تجاري أو صناعي أو سياحي يلزم الحصول علي مستند يفيد نوع النشاط والموافقة الكتابية من مالك العقار أو اتحاد الشاغلين حسب الأحوال والتي تفيد بعدم الممانعة في توصيل مياه الشرب للوحدة موضوع الطلب من بريزة العقار وصورة من السجل التجاري لم يمض عليه 6 أشهر.</li>
                      <li>وفي حالة تصحيح وضع وصلة مياه أو صرف صحي يلزم الحصول علي كشوف مشتملات من تاريخ إنشاء العقار مبين بها مكونات العقار وتاريخ الربط أو أي مستندات أخرى تدل علي تاريخ إنشاء العقار.</li>
                      <li>أي مستند آخر ترى الشركة طلبه ويكون ضروريًا لصحة وسلامة عملية التوصيل.</li>
                    </ul>
                  </div>
                  <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img
                      src="/images/ask/ask2.webp"
                      alt="متطلبات التعاقد على العداد التنظيمي"
                      className="h-full w-full cursor-zoom-in object-cover transition hover:brightness-95"
                      loading="lazy"
                      decoding="async"
                      onClick={() => setZoomedImage({ src: '/images/ask/ask2.webp', alt: 'متطلبات التعاقد على العداد التنظيمي' })}
                    />
                  </figure>
                </div>
              </section>

              <section className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">المستندات المطلوبة للتعاقد علي العداد الكودي</h2>
                    <ul className="list-disc space-y-3 pr-6 leading-8">
                      <li>صورة الرقم القومي (البطاقة الشخصية).</li>
                      <li>صورة من عقد الملكية المستخرج من المحكمة أو صورة عقد الإيجار الموثق بالنسبة للمدينة أو عقد بيع ابتدائي بالنسبة للقرى.</li>
                      <li>رسم كروكي معتمد من مكتب هندسي أو مهندس نقابي يكون موضحًا به الأبعاد والمساحة وعدد الآدوار وعدد الوحدات وعدد الغرف بكل وحدة وكذلك الحدود.</li>
                      <li>صورة إيصال من أي خدمات أخرى (كهرباء - غاز) إن وجدت.</li>
                    </ul>
                    <p className="rounded-2xl bg-slate-50 px-4 py-3 leading-8 text-slate-700">
                      أخذ إقرار على المواطن صاحب العقار أو من ينوب عنه (بتوكيل رسمي موثق في الشهر العقاري مع إرفاق صورة من التوكيل) بأنه قام بالتعدي على خطوط شبكة شركة مياه الشرب والصرف الصحي وأن العقار غير مقام على مناطق أثرية أو أملاك دولة وغير مخالف لقيود الارتفاع المقررة طبقًا لقانون الطيران المدني، وإذا ظهر خلاف ذلك يكون مسئول مسؤولية مدنية وجنائية مع حفظ حقوق الشركة في إزالة ورفع العداد والتوصيلة والرجوع على المواطن المذكور بالإجراءات اللازمة ضده دون أدنى مسئولية في ذلك على الشركة كما يتضمن الإقرار موافقة المواطن علي محاسبته بطريقة الممارسة ولحين تركيب العداد وبعد توقيع المواطن على الإقرار المعد لذلك والخاص بتوكيل خدمتي مياه الشرب أو الصرف الصحي طبقًا لقرار وزير الإسكان والمرافق والمجتمعات العمرانية رقم 377 لعام 2016 بتاريخ 31/5/2016 أو من ينوب عنه بتوكيل رسمي موثق في الشهر العقاري ويتم الاحتفاظ بصورة من التوكيل الرسمي العام أو أصل التوكيل الخاص بملف التوصيل.
                    </p>
                  </div>
                  <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img
                      src="/images/ask/ask1.webp"
                      alt="متطلبات التعاقد على العداد الكودي"
                      className="h-full w-full cursor-zoom-in object-cover transition hover:brightness-95"
                      loading="lazy"
                      decoding="async"
                      onClick={() => setZoomedImage({ src: '/images/ask/ask1.webp', alt: 'متطلبات التعاقد على العداد الكودي' })}
                    />
                  </figure>
                </div>
              </section>

              <section className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">المستندات المطلوبة في الصرف الصحي للحصول علي الخدمة</h2>
                    <ul className="list-disc space-y-3 pr-6 leading-8">
                      <li>إحضار الموافقة التنظيمية من الوحدة المحلية (منزلي – تجاري) وبالنسبة للنشاط التجاري يجب توضيح نوع النشاط في الموافقة التنظيمية.</li>
                      <li>الحصول علي تصريح حفر من الجهة المختصة بالمنطقة التابع لها الموقع المراد توصيل الصرف الصحي.</li>
                      <li>رسومات هندسية للمسقط الأفقي للعقار للدور الأرضي موضح عليه طريقة الصرف الصحي ومعتمد من مهندس نقابي.</li>
                      <li>عدد 1 رسم موقع للعقار معتمد من مهندس نقابي، وعدد 2 رسومات هندسية للمحل موضح عليها طريقة الصرف الصحي والموقع العام للمحل ومعتمد من مهندس نقابي.</li>
                    </ul>
                  </div>
                  <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img
                      src="/images/ask/ask3.webp"
                      alt="المستندات المطلوبة لخدمات الصرف الصحي"
                      className="h-full w-full cursor-zoom-in object-cover transition hover:brightness-95"
                      loading="lazy"
                      decoding="async"
                      onClick={() => setZoomedImage({ src: '/images/ask/ask3.webp', alt: 'المستندات المطلوبة لخدمات الصرف الصحي' })}
                    />
                  </figure>
                </div>
              </section>

              <section className="rounded-2xl border border-dashed border-[#0a3555]/25 bg-[#0a3555]/3 px-4 py-5 text-slate-800">
                <p className="text-lg font-bold text-[#0a3555]">
                  لتقديم الطلب اضغط على الرابط التالي{' '}
                  <a
                    href="https://ecp.hcww.com.eg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-extrabold text-[#0a3555] underline decoration-2 underline-offset-4 hover:text-[#1170b0]"
                  >
                    اضغط هنا
                    <span aria-hidden="true">↗</span>
                  </a>
                </p>
                <p className="mt-2 text-sm text-slate-700">سيتم فتح موقع الشركة القابضة لتقديم الطلب.</p>
              </section>
            </div>
          </section>
        </div>

        {zoomedImage && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setZoomedImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-h-[90vh] max-w-full object-contain"
                loading="eager"
              />
              <button
                type="button"
                aria-label="إغلاق الصورة"
                className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#0a3555] shadow hover:bg-white"
                onClick={() => setZoomedImage(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ProvideRequestPage;
