import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const purificationTypes = [
  { ar: 'التنقية لأغراض الشرب', en: 'Purification for drinking purposes' },
  { ar: 'التنقية لأغراض الصناعة', en: 'Purification for industrial purposes' },
];

const waterDisinfectionTypes = [
  { ar: 'معالجة اشعاعية', en: 'Radiation treatment' },
  { ar: 'معالجة حرارية', en: 'Thermal treatment' },
  { ar: 'معالجة كيميائية', en: 'Chemical treatment' },
];

const chlorineEffectivenessFactors = [
  { ar: 'درجة الحرارة', en: 'Temperature' },
  { ar: 'مدة التفاعل بين الكلور والماء (فترة التلامس)', en: 'Reaction time between chlorine and water (contact time)' },
  { ar: 'درجة تركيز أيون الهيدروجين', en: 'Hydrogen ion concentration (pH)' },
  { ar: 'عكارة الماء', en: 'Water turbidity' },
  { ar: 'قلوية وحامضية الماء', en: 'Water alkalinity and acidity' },
  { ar: 'وجود مركبات الحديد والمنجنيز', en: 'Presence of iron and manganese compounds' },
  { ar: 'نوع وعدد البكتريا المراد القضاء عليها', en: 'Type and amount of bacteria to be eliminated' },
];

const importantSites = [
  { labelAr: 'بوابه الحكومه المصريه', labelEn: 'Egyptian Government Portal', href: 'https://www.egypt.gov.eg/arabic/home.aspx' },
  { labelAr: 'رئاسه مجلس الوزراء', labelEn: 'Cabinet of Ministers', href: 'https://www.cabinet.gov.eg/Arabic/Pages/default.aspx' },
  { labelAr: 'الشركة القابضة لمياه الشرب و الصرف الصحى', labelEn: 'Holding Company for Water and Wastewater', href: 'https://www.hcww.com.eg/ar' },
  { labelAr: 'بوابه محافظه أسيوط', labelEn: 'Assiut Governorate Portal', href: 'http://assiut.gov.eg/' },
  { labelAr: 'بوابة رئاسة الجمهوريه', labelEn: 'Presidency Portal', href: 'https://www.presidency.eg/ar' },
];

const facebookWidgetSrc =
  'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F%25D8%25A7%25D9%2584%25D8%25B5%25D9%2581%25D8%25AD%25D8%25A9-%25D8%25A7%D9%84%D8%B1%D8%B3%D9%85%D9%8A%D8%A9-%25D9%2584%25D8%25B4%25D8%25B1%25D9%2583%25D8%25A9-%25D9%2585%25D9%258A%25D8%25A7%25D9%2587-%25D8%25A7%D9%84%D8%B4%D8%B1%D8%A8-%25D9%2588%25D8%25A7%D9%84%D8%B5%D8%B1%D9%81-%25D8%A7%D9%84%D8%B5%D8%AD%D9%89-%25D8%A8%D8%A3%D8%B3%D9%8A%D9%88%D8%B7-%25D9%2588%25D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%89-%25D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF-364679160333044%2F&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId=887228017981898';

function RefiningWaterPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const companyMessageImage = isEnglish
    ? '/images/about/company-messageEN.webp'
    : '/images/about/company-message.webp';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)] lg:col-span-8">
              <div className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
                <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t('تنقيه مياه الشرب', 'Drinking Water Purification')}</h1>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-600 sm:text-base">{t('المهام الرئيسيه لتنقيه مياه الشرب', 'Main tasks of drinking water purification')}</p>
              </div>

              <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('الهدف من تنقية المياه', 'Purpose of water purification')}</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('يقصد بالتنقية التخلص من كل أو بعض المواد الغريبة الدخيلة على المياه سواء كانت ذائبة أو عالقة أو غروية ، حيث أن المياه السطحية معرضة لعوامل كثيرة تؤدي إلي تلوثها فتصبح غير صالحة للاستعمال إلا بعد تنقيتها.', 'Purification means removing all or some foreign substances from water, whether dissolved, suspended, or colloidal. Surface water is exposed to many factors that may contaminate it, making it unsuitable for use unless it is purified.')}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('تقسيم عمليات التنقية', 'Classification of purification processes')}</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">{t('ويمكن تقسيم المياه طبقاً لدرجة نقائها إلى:', 'Water can be classified according to its degree of purity into:')}</p>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {purificationTypes.map((item) => (
                      <li key={item.ar} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {isEnglish ? item.en : item.ar}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('انواع تطهير المياة', 'Types of water disinfection')}</h2>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {waterDisinfectionTypes.map((item) => (
                      <li key={item.ar} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {isEnglish ? item.en : item.ar}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('التطهير بالكلور', 'Disinfection with chlorine')}</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('أكثر الطرق شيوعا في عمليات تطهير المياه هي إضافة الكلور حيث أنه يقضى بدرجة كبيرة على الأمراض التي ينقلها الماء وذلك بأقل التكاليف وأبسط المعدات وأقل عدد من العاملين ولولا عملية الكلورة لانتشرت اوبئه الكوليرا والتيفود. ويتميز التطهير بواسطة الكلور بسهولة استعماله ، وكذلك سهولة الحكم على مدى فاعليته بالتأكد من بقاء قدرا من الكلور في الماء بعد فترة من إضافته؛ حيث أن الكلورين عامل مؤكسد قوي وعندما يستخدم بكميات كافية فإنه يوقف نمو الطحالب في المرشحات.', 'One of the most common water disinfection methods is chlorine addition, as it significantly reduces waterborne diseases at low cost and with simple equipment. Chlorination is easy to apply, and its effectiveness can be assessed by checking residual chlorine in the water after a period of time. Chlorine is a strong oxidizing agent and, when used in adequate quantities, it inhibits algae growth in filters.')}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">
                    {t('العوامل المؤثرة في عملية التطهير (فاعلية الكلور) في قتل البكتريا', 'Factors affecting the disinfection process (chlorine effectiveness) in killing bacteria')}
                  </h2>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {chlorineEffectivenessFactors.map((item) => (
                      <li key={item.ar} className="rounded-lg bg-slate-50 px-4 py-2 leading-7">
                        {isEnglish ? item.en : item.ar}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('إضافة الكلور', 'Chlorine dosing')}</h2>
                  <h3 className="mt-3 text-lg font-bold text-slate-800">{t('جرعه الكلور', 'Chlorine dose')}</h3>
                  <p className="mt-2 text-justify leading-8 text-slate-700">
                    {t('ويتم تحديد الجرعة المثلى للكلور عن طريق تجارب معملية حسب نوعية المياه المراد معالجتها ، ويمكن القول أنه : إذا أضفنا كمية الكلورين اللازمة لحد الطلب + كمية الكلورين اللازمة للتطهير فإننا نحصل على ما يسمى بجرعة الكلور.', 'The optimal chlorine dose is determined through laboratory tests according to the type of water to be treated. In general, the chlorine dose equals the chlorine required to satisfy demand plus the amount needed for disinfection.')}
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('إضافة الكلور المبدئي -:أي حقن الكلور بعد عملية تجميع المياه من المصدر مباشرة وقبل الدخول الى عملية التنقية (المروقات والمرشحات).', 'Pre-chlorination means injecting chlorine directly after collecting water from the source and before entering the purification process, including clarifiers and filters.')}
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('إضافة الكلور النهائي: أي إضافة الكلور إلى الماء بعد مرحلة الترشيح أي عند مدخل خزان المياه النقية ، وهي طريقة سهلة في تشغيلها ويكون الكلور اكثر فاعلية على البكتريا بسبب خلو الماء من أي عكارة أو شوائب .ويضاف جرعة زائدة من الكلور النهائي في الخزانات الملحقة بالمحطات وذلك لضمان خروج الكلور بنسبة معينة مطلوبة إذا كانت شبكات مواسير التوزيع تمتد إلى مسافات بعيدة ويخشي من تواجد البكتريا في الأطراف البعيدة منها وحتى يصل الكلور ولو بنسبة ضئيلة إلى آخر متر في الشبكة .', 'Post-chlorination means adding chlorine after filtration at the clean water tank inlet. It is easy to operate, and chlorine becomes more effective against bacteria because the water is free from turbidity and impurities. An additional final chlorine dose may be added in station tanks to ensure the required residual chlorine level when distribution networks extend over long distances.')}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#0a3555]">{t('كيماويات الترسيب (كبريتات الألومنيوم)', 'Coagulation chemicals (aluminum sulfate)')}</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('تعرف عادة باسم الشبة ، وحتى يكون التعبير دقيقا فهى خليط من الكبريتات المعدنية المتنوعة- يصل وزنها إلى 480 كجم/م3 ويمكن الحصول عليها فى أكياس تزن من 40-50 كجم ،على شكل كتل أو حبيبات أو مسحوق .', 'Usually known as alum, it is more accurately described as a mixture of various metallic sulfates. It can weigh up to 480 kg/m3 and is supplied in 40-50 kg bags in the form of lumps, granules, or powder.')}
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('والشبة المستخدمة فى محطات المياه تحتوى على 14-16٪ من أكسيد الألومنيوم ،بالإضافة إلى ماء التبلور ، ولهذا فإن كبريتات الألومنيوم الفعالة تكون نسبتها فى الوزن 84-86٪.', 'The alum used in water stations contains 14-16% aluminum oxide in addition to crystallization water, which means effective aluminum sulfate represents 84-86% by weight.')}
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('والشبة سريعة الذوبان فى الماء ، وينتج محلول حمضى يتطلب استخدام المواد المقاومة للتآكل فى الأحواض والمضخات وشبكات المواسير.', 'Alum dissolves quickly in water and produces an acidic solution that requires corrosion-resistant materials in tanks, pumps, and pipe networks.')}
                  </p>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    {t('وللتوصل إلى مزج سليم يفضل أن لا تزيد قوة تركيز المحلول فى الجرعات المضافة عن 10٪.', 'For proper mixing, it is preferable that the concentration of the added solution does not exceed 10%.')}
                  </p>
                </article>
              </div>
            </section>

            <aside className="space-y-4 lg:col-span-4">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
                <div className="bg-[#0a3555] px-5 py-4 text-white">
                  <h2 className="text-lg font-extrabold">{t('روابط سريعة', 'Quick links')}</h2>
                </div>

                <div className="divide-y divide-slate-200">
                  <details className="group" open>
                    <summary className="cursor-pointer list-none px-4 py-3 text-base font-bold text-slate-800">
                      {t('رساله الشركة', 'Company message')}
                    </summary>
                    <div className="px-4 pb-4">
                      <img decoding="async"
                        src={companyMessageImage}
                        alt={t('رساله الشركة', 'Company message')}
                        loading="lazy"
                        className="w-full rounded-xl border border-slate-200"
                      />
                    </div>
                  </details>

                  <details className="group" open>
                    <summary className="cursor-pointer list-none px-4 py-3 text-base font-bold text-slate-800">
                      {t('صفحتنا علي الفيسبوك', 'Our Facebook page')}
                    </summary>
                    <div className="px-4 pb-4">
                      <iframe
                        title={t('صفحتنا علي الفيسبوك', 'Our Facebook page')}
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
                      {t('مواقع هامة', 'Important sites')}
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
                              {isEnglish ? site.labelEn : site.labelAr}
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
