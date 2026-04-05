import Footer from '../components/Footer';
import Header from '../components/Header';

function MyReadingAppPage() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-10" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">تطبيق قراءتي</h1>
            </div>

            <div className="space-y-10 px-6 py-8 text-slate-800 sm:px-8">
              <section className="space-y-6">
                <figure className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                  <img
                    src="/images/services/readme.webp"
                    alt="تطبيق قراءتي"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="space-y-4 leading-8 text-justify break-words">
                  <p>
                    خدمات عدة، تقدمها الشركة القابضة لمياه الشرب والصرف الصحى، للمواطنين، وذلك لتوفير كل سبل التواصل بين الشركة بجميع فروعها داخل المحافظات والمواطنين.
                  </p>
                  <p className="text-justify">
                    ومن ضمن تلك الخدمات، أتاحت الشركة القابضة لمياه الشرب والصرف الصحى، تطبيق «قراءتى»، والذى يتيح للمواطن تسجيل قراءة العداد بنفسه، وإضافة صورة العداد وهو ما يضمن دقة القراءة، على أن ترسل القراءات من يوم 1 إلى 15 من كل شهر وذلك لكل الشركات التابعة للشركة القابضة.
                  </p>
                  <p>
                    وذلك وفقا لما نشرته الشركة القابضة لمياه الشرب والصرف الصحى على الصفحة الرسمية لها.
                  </p>
                  <p>
                    ويسمح تطبيق «قراءتي» لتسجيل قراءة عدادات المياه الخاصة للمواطنين عبر الهاتف، كأحد الإجراءات الاحترازية التي انتهجتها الشركة لمواجهة فيروس كورونا المستجد.
                  </p>
                  <p>
                    أى يتيح هذا التطبيق للمواطن تسجيل قراءة العداد بنفسه، وإبلاغ القراءات، وذلك لكل الشركات التابعة بمختلف محافظات الجمهورية.
                  </p>
                  <p>
                    ويمكن للمواطن تحميل التطبيق من خلال Google play مجانًا.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="https://apps.apple.com/eg/app/%D9%A1%D9%A2%D9%A5/id1431089961"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تحميل تطبيق قراءتي من متجر App Store"
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
                      aria-label="تحميل تطبيق قراءتي من متجر Google Play"
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
                  <p>
                    وخلال السطور التالية، تستعرض «الوطن» كيفية استخدام تطبيق «قراءتي»:.
                  </p>
                  <ul className="list-disc space-y-3 pr-6 leading-8 text-justify">
                    <li>
                      يحتاج الدخول لأول مرة تسجيل العميل لبياناته الموجودة على فاتورة المياه مثل اسم المشترك ورقم الاشتراك واختيار الشركة التابع لها ورقم الهاتف وتعيين كلمة مرور ثم إعادة إدخالها مرة أخرى.
                    </li>
                  </ul>
                  <p>
                    يمكن تسجيل أكثر من عداد للعميل ويتيح البرنامج أيضًا للعميل ميزة الاستعلام عن آخر قراءة قام العميل بإدخالها.
                  </p>
                  <p>
                    يستطيع العميل تسجيل العميل للقراءة الخاصة به في الخانة المخصصة للقراءة الحالية على التطبيق..
                  </p>
                  <p>
                    كما يتيح للعميل إضافة صورة العداد وهو ما يضمن لك أن تكون القراءة دقيقة بنسبة 100%.
                  </p>
                  <p>
                    ليس ذلك فقط بل تقوم الشركة القابضة لمياه الشرب والصرف الصحى، برفع حالة الطوارئ، داخل جميع شركات المياه بالمحافظات، عند حدوث موجة من التقلبات الجوية، وسقوط كميات كبيرة من مياه الأمطار، من خلال اتخاذ كل التدابير لسحب تجمعات مياه الأمطار، تجنبًا لحدوث أي أضرار أو تعطل في الحركة المرورية داخل المناطق والطرق على مستوى الجمهورية.
                  </p>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MyReadingAppPage;
