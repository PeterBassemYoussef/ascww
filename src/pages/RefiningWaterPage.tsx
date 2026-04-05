import Footer from '../components/Footer';
import Header from '../components/Header';

const purificationTypes = [
  'التنقية لأغراض الشرب',
  'التنقية لأغراض الصناعة',
];

const waterDisinfectionTypes = [
  'معالجة اشعاعية',
  'معالجة حرارية',
  'معالجة كيميائية',
];

const chlorineEffectivenessFactors = [
  'درجة الحرارة',
  'مدة التفاعل بين الكلور والماء (فترة التلامس)',
  'درجة تركيز أيون الهيدروجين',
  'عكارة الماء',
  'قلوية وحامضية الماء',
  'وجود مركبات الحديد والمنجنيز',
  'نوع وعدد البكتريا المراد القضاء عليها',
];

const importantSites = [
  { label: 'بوابه الحكومه المصريه', href: 'https://www.egypt.gov.eg/arabic/home.aspx' },
  { label: 'رئاسه مجلس الوزراء', href: 'https://www.cabinet.gov.eg/Arabic/Pages/default.aspx' },
  { label: 'الشركة القابضة لمياه الشرب و الصرف الصحى', href: 'https://www.hcww.com.eg/ar' },
  { label: 'بوابه محافظه أسيوط', href: 'http://assiut.gov.eg/' },
  { label: 'بوابة رئاسة الجمهوريه', href: 'https://www.presidency.eg/ar' },
];

const companyMessageImage = 'https://ascww.org/img/7.82d7d17e.png';
const facebookWidgetSrc =
  'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F%25D8%25A7%25D9%2584%25D8%25B5%25D9%2581%25D8%25AD%25D8%25A9-%25D8%25A7%25D9%2584%25D8%25B1%25D8%25B3%25D9%2585%25D9%258A%25D8%25A9-%25D9%2584%25D8%25B4%25D8%25B1%25D9%2583%25D8%25A9-%25D9%2585%25D9%258A%25D8%25A7%25D9%2587-%25D8%25A7%25D9%2584%25D8%25B4%25D8%25B1%25D8%25A8-%25D9%2588%25D8%25A7%25D9%2584%25D8%25B5%25D8%25B1%25D9%2581-%25D8%25A7%25D9%2584%25D8%25B5%25D8%25AD%25D9%2589-%25D8%25A8%25D8%25A3%25D8%25B3%25D9%258A%25D9%2588%25D8%25B7-%25D9%2588%25D8%25A7%25D9%2584%25D9%2588%25D8%25A7%25D8%25AF%25D9%2589-%25D8%25A7%25D9%2584%25D8%25AC%25D8%25AF%25D9%258A%25D8%25AF-364679160333044%2F&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId=887228017981898';

function RefiningWaterPage() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)] lg:col-span-8">
              <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                <h1 className="text-2xl font-extrabold sm:text-3xl">تنقيه مياه الشرب</h1>
                <p className="mt-2 text-sm font-semibold text-white/90 sm:text-base">المهام الرئيسيه لتنقيه مياه الشرب</p>
              </div>

              <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">الهدف من تنقية المياه</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    يقصد بالتنقية التخلص من كل أو بعض المواد الغريبة الدخيلة على المياه سواء كانت ذائبة أو عالقة أو
                    غروية ، حيث أن المياه السطحية معرضة لعوامل كثيرة تؤدي إلي تلوثها فتصبح غير صالحة للاستعمال إلا بعد
                    تنقيتها.
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">تقسيم عمليات التنقية</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">ويمكن تقسيم المياه طبقاً لدرجة نقائها إلى:</p>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {purificationTypes.map((item) => (
                      <li key={item} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">انواع تطهير المياة</h2>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {waterDisinfectionTypes.map((item) => (
                      <li key={item} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">التطهير بالكلور</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    أكثر الطرق شيوعا في عمليات تطهير المياه هي إضافة الكلور حيث أنه يقضى بدرجة كبيرة على الأمراض التي
                    ينقلها الماء وذلك بأقل التكاليف وأبسط المعدات وأقل عدد من العاملين ولولا عملية الكلورة لانتشرت
                    اوبئه الكوليرا والتيفود. ويتميز التطهير بواسطة الكلور بسهولة استعماله ، وكذلك سهولة الحكم على مدى
                    فاعليته بالتأكد من بقاء قدرا من الكلور في الماء بعد فترة من إضافته؛ حيث أن الكلورين عامل مؤكسد قوي
                    وعندما يستخدم بكميات كافية فإنه يوقف نمو الطحالب في المرشحات.
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">
                    العوامل المؤثرة في عملية التطهير (فاعلية الكلور) في قتل البكتريا
                  </h2>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {chlorineEffectivenessFactors.map((item) => (
                      <li key={item} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">إضافة الكلور</h2>
                  <h3 className="mt-3 text-lg font-bold text-slate-800">جرعه الكلور</h3>
                  <p className="mt-2 text-justify leading-8 text-slate-700">
                    ويتم تحديد الجرعة المثلى للكلور عن طريق تجارب معملية حسب نوعية المياه المراد معالجتها ، ويمكن القول
                    أنه : إذا أضفنا كمية الكلورين اللازمة لحد الطلب + كمية الكلورين اللازمة للتطهير فإننا نحصل على ما
                    يسمى بجرعة الكلور.
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    إضافة الكلور المبدئي -:أي حقن الكلور بعد عملية تجميع المياه من المصدر مباشرة وقبل الدخول الى عملية
                    التنقية (المروقات والمرشحات).
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    إضافة الكلور النهائي: أي إضافة الكلور إلى الماء بعد مرحلة الترشيح أي عند مدخل خزان المياه النقية ،
                    وهي طريقة سهلة في تشغيلها ويكون الكلور اكثر فاعلية على البكتريا بسبب خلو الماء من أي عكارة أو شوائب
                    .ويضاف جرعة زائدة من الكلور النهائي في الخزانات الملحقة بالمحطات وذلك لضمان خروج الكلور بنسبة معينة
                    مطلوبة إذا كانت شبكات مواسير التوزيع تمتد إلى مسافات بعيدة ويخشي من تواجد البكتريا في الأطراف
                    البعيدة منها وحتى يصل الكلور ولو بنسبة ضئيلة إلى آخر متر في الشبكة .
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">كيماويات الترسيب (كبريتات الألومنيوم)</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    تعرف عادة باسم الشبة ، وحتى يكون التعبير دقيقا فهى خليط من الكبريتات المعدنية المتنوعة- يصل وزنها
                    إلى 480 كجم/م3 ويمكن الحصول عليها فى أكياس تزن من 40-50 كجم ،على شكل كتل أو حبيبات أو مسحوق .
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    والشبة المستخدمة فى محطات المياه تحتوى على 14-16٪ من أكسيد الألومنيوم ،بالإضافة إلى ماء التبلور ،
                    ولهذا فإن كبريتات الألومنيوم الفعالة تكون نسبتها فى الوزن 84-86٪.
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    والشبة سريعة الذوبان فى الماء ، وينتج محلول حمضى يتطلب استخدام المواد المقاومة للتآكل فى الأحواض
                    والمضخات وشبكات المواسير.
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    وللتوصل إلى مزج سليم يفضل أن لا تزيد قوة تركيز المحلول فى الجرعات المضافة عن 10٪.
                  </p>
                </article>
              </div>
            </section>

            <aside className="space-y-4 lg:col-span-4">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
                <div className="bg-[#0a3555] px-5 py-4 text-white">
                  <h2 className="text-lg font-extrabold">روابط سريعة</h2>
                </div>

                <div className="divide-y divide-slate-200">
                  <details className="group" open>
                    <summary className="cursor-pointer list-none px-4 py-3 text-base font-bold text-slate-800">
                      رساله الشركة
                    </summary>
                    <div className="px-4 pb-4">
                      <img decoding="async"
                        src={companyMessageImage}
                        alt="رساله الشركة"
                        loading="lazy"
                        className="w-full rounded-xl border border-slate-200"
                      />
                    </div>
                  </details>

                  <details className="group" open>
                    <summary className="cursor-pointer list-none px-4 py-3 text-base font-bold text-slate-800">
                      صفحتنا علي الفيسبوك
                    </summary>
                    <div className="px-4 pb-4">
                      <iframe
                        title="صفحتنا علي الفيسبوك"
                        src={facebookWidgetSrc}
                        width="100%"
                        height="350"
                        loading="lazy"
                        className="w-full overflow-hidden rounded-xl border border-slate-200"
                        style={{ border: 'none' }}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />
                    </div>
                  </details>

                  <details className="group" open>
                    <summary className="cursor-pointer list-none px-4 py-3 text-base font-bold text-slate-800">
                      مواقع هامة
                    </summary>
                    <div className="px-4 pb-4">
                      <ul className="space-y-2">
                        {importantSites.map((site) => (
                          <li key={site.href}>
                            <a
                              href={site.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-[#0a3555] transition hover:bg-slate-100"
                            >
                              {site.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RefiningWaterPage;
