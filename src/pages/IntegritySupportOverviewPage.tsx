import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const definitionText: LocalizedText = {
  ar: 'إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد تتبع الإدارة العامة لشئون مجلس الإدارة، وتحت الإشراف المباشر لإدارة الجودة والنزاهة بالشركة القابضة بالقاهرة وتنطلق من الهدف من وراء إنشائها وهو توفير الخدمات بكفاءة وفاعلية للوفاء بتوقعات أصحاب المصالح، والربط بين متطلبات النزاهة والشفافية وبين المتطلبات التي تفرض على الشركة من خلال الأجهزة السيادية والتنظيمية من داخل وخارج قطاع المياه.',
  en: 'The Integrity Support Department at Assiut and New Valley Water and Wastewater Company is affiliated with the General Department of Board Affairs and operates under the direct supervision of the Quality and Integrity Department at the Holding Company in Cairo. It was established to provide services efficiently and effectively, meet stakeholder expectations, and connect integrity and transparency requirements with the obligations imposed on the company by sovereign and regulatory bodies inside and outside the water sector.',
};

const achievementsParagraphs: LocalizedText[] = [
  {
    ar: 'بناء على تكليفات الشركة القابضة، وتوجيهات السيد لواء أركان حرب مهندس رئيس مجلس الإدارة والعضو المنتدب لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
    en: 'Based on the directives of the Holding Company and the guidance of the Chairman of the Board and Managing Director of Assiut and New Valley Water and Wastewater Company.',
  },
  {
    ar: 'قامت إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي باسيوط والوادي الجديد، بتحديد العمليات الخاصة بالمخازن وكذلك العمليات ذات الصلة، والتي لها تأثير مباشر على المخازن.',
    en: 'The Integrity Support Department identified warehouse-related operations and associated processes that have a direct impact on storage activities.',
  },
  {
    ar: 'وفيما يخص العمل بالدليل التجاري الموحد بالقطاع التجاري بالشركات التابعة، تم عقد عديد من ورش العمل الخاصة بتطبيق الدليل التجارى الموحد بالقطاع التجارى وتم رصد عدة ملاحظات خاصة بالاجراءات تؤثر على اجراءات سير العمل بشركة مياه أسيوط مما تأخذه من وقت وادوات.',
    en: 'Regarding the implementation of the unified commercial guide in the commercial sector of affiliated companies, several workshops were held. A number of procedural observations were documented because they affect workflow at Assiut Water Company in terms of time and tools used.',
  },
  {
    ar: 'وعليه فأن اجراءات العمل بشركة مياه أسيوط تتم بشكل اسرع وأدق خصوصا دورة الاصدار و التحصيل حيث أن عدد أيام التحصيل بناءا على نظام وجدول العمل بمركز الاصدار يتيح لكل فرع من (29 إلى 30 يوم تحصيل). كما يتم مراجعة جميع تقارير الأصدار من قبل إدارة المراجعة بمركز الاصدار وإبداء جميع الملاحظات وتلافيها قبل طباعة الفواتير.',
    en: 'As a result, workflows at Assiut Water Company have become faster and more accurate, especially in billing and collection cycles, as the issuance center schedule allows each branch from 29 to 30 collection days. All billing reports are also reviewed by the issuance center review team and remarks are addressed before invoice printing.',
  },
  {
    ar: 'أما بالنسبة لمراكز خدمة العملاء يتم التعامل من خلال الشباك الواحد بمراكز خدمة العملاء مما يقلل الاحتياج لاعداد كثيرة من العاملين بالمركز الواحد ويؤدى إلى سرعة الانجاز وعدم ضياع المستندات. وعليه تم إعتماد الدليل التجارى الموحد بالقطاع التجارى على مستوى الشركات مع مراعاة نظام الإصدار والتحصيل المتبع حالياً بالشركة لحين توحيد النظم والبرامج الإلكترونية والمراجعة مع الشركة القابضة.',
    en: 'At customer service centers, work is handled through a one-stop window model, which reduces the need for large staffing numbers at each center, speeds up completion, and prevents document loss. Accordingly, the unified commercial guide was approved across the commercial sector at company level while taking into account the current billing and collection system until systems and software are unified with the Holding Company.',
  },
];

const performanceSections = [
  {
    title: { ar: 'التعاقدات والإشتراكات:', en: 'Contracts and subscriptions:' },
    items: [
      {
        ar: 'انخفاض شكاوى العملاء المتضررين من عدم اتمام طلباتهم إلى الصفر.',
        en: 'Customer complaints from affected applicants whose requests were not completed dropped to zero.',
      },
      {
        ar: 'انخفاض عدد المقايسات التي تم رفضها لأسباب غير منطقية إلى الصفر، وذلك كنتيجة لتدريب العاملين.',
        en: 'The number of estimates rejected for unjustified reasons dropped to zero as a result of staff training.',
      },
    ],
  },
  {
    title: { ar: 'المقايسات :', en: 'Estimates:' },
    items: [
      {
        ar: 'انخفاض نسبة شكاوى العملاء من طول المدة الزمنية لإتمام المعاينة والتوصيل والتركيب من 33% في 1/7/2019 إلى 10% في 1/7/2020 ثم 6% في 1/1/2021.',
        en: 'Customer complaints about the long time required for inspection, connection, and installation decreased from 33% on 1/7/2019 to 10% on 1/7/2020, then to 6% on 1/1/2021.',
      },
      {
        ar: 'انخفاض نسبة شكاوى العملاء من عدم إصدار فواتير رغم تركيب العداد إلى الصفر، وذلك نتيجة ميكنة خدمة العملاء وانتظام الدورة المستندية بمركز الإصدار وتركيب العدادات مسبقة الدفع.',
        en: 'Customer complaints about not issuing bills despite meter installation dropped to zero thanks to customer service automation, regular document cycles at the issuance center, and the installation of prepaid meters.',
      },
    ],
  },
  {
    title: { ar: 'العدادات مسبقة الدفع :', en: 'Prepaid meters:' },
    items: [
      {
        ar: 'انخفاض نسبة شكاوى العملاء من تأخر تركيب العداد بالرغم من سداد كافة المستحقات، حتى وصلت إلى 3% تقريباً في 1/10/2020.',
        en: 'Customer complaints about delays in meter installation despite payment of all dues decreased to about 3% on 1/10/2020.',
      },
      {
        ar: 'ارتفاع نسبة تركيب العدادات مسبقة الدفع مقارنة بالشهور السابقة، من 3209 في 1/7/2019 إلى 3752 في 1/10/2020.',
        en: 'The number of installed prepaid meters increased compared with previous months, rising from 3,209 on 1/7/2019 to 3,752 on 1/10/2020.',
      },
    ],
  },
  {
    title: { ar: 'مراجعة الإيرادات :', en: 'Revenue review:' },
    items: [
      {
        ar: 'انخفاض نسبة العجز لدى المحصلين إلى الصفر، وذلك بسبب تطبيق الفاتورة التراكمية وزيادة عدد المحصلين.',
        en: 'Collector shortages dropped to zero due to applying cumulative billing and increasing the number of collectors.',
      },
      {
        ar: 'انخفاض شكاوى العملاء من سداد الفاتورة وإعادة تحصيلها مرة أخرى إلى الصفر، وذلك بسبب تطبيق الفاتورة التراكمية وعدم تطبيق التحصيل الإلكتروني.',
        en: 'Customer complaints about paying a bill and being charged again fell to zero because of cumulative billing and the non-application of duplicate electronic collection.',
      },
      {
        ar: 'انخفاض نسبة الفواتير المرتجعة وغير الملغاه من 368816 في 1/7/2019 إلى 227631 في 1/7/2020 ثم 169826 في 1/10/2020.',
        en: 'Returned and non-cancelled invoices decreased from 368,816 on 1/7/2019 to 227,631 on 1/7/2020, then to 169,826 on 1/10/2020.',
      },
      {
        ar: 'زيادة نسبة التسويات وبالتالي انخفاض شكاوى العملاء من وجود رصيد سابق رغم السداد، حيث كانت 1152 في 1/7/2019 و3918 في 1/7/2020 ثم 4039 في 1/10/2020.',
        en: 'Settlement rates increased, which reduced customer complaints about previous balances despite payment. The related figures were 1,152 on 1/7/2019, 3,918 on 1/7/2020, and 4,039 on 1/10/2020.',
      },
    ],
  },
  {
    title: { ar: 'عملية تركيب العدادات :', en: 'Meter installation process:' },
    items: [
      {
        ar: 'بالنسبة لخطط تركيب العدادت يوجد صعوبة في تحديد القيمة الصفرية في الفترة من 1/7/2020 حتى 31/12/2020 وذلك لظروف غلق مراكز خدمة العملاء لظروف جائحة كورونا، وعند فتح مراكز خدمة العملاء وبدء التعامل مع الجمهور تم اتخاذ إجراءات تغيير العدادات المعطلة وتركيب العدادت السليمة حيث تم تركيب (50000) عداد وهي نسبة كبيرة في فترة زمنية قصيرة، ثم تم فتح تركيب العدادات الكودية، وتم البدء في تطبيق خطة الشركة القابضة لإحلال وتغيير العدادات القديمة بعدادات مسبقة الدفع.',
        en: 'Regarding meter installation plans, it was difficult to determine the zero baseline during the period from 1/7/2020 to 31/12/2020 because customer service centers were closed during the COVID-19 pandemic. After reopening and resuming public service, actions were taken to replace faulty meters and install proper ones. A total of 50,000 meters were installed within a short period, followed by the launch of coded meter installation and the start of the Holding Company plan to replace old meters with prepaid ones.',
      },
      {
        ar: 'تم تركيب عدد (5) عدادات ميكانيكية ذات أقطار كبيرة.',
        en: 'Five large-diameter mechanical meters were installed.',
      },
    ],
  },
  {
    title: { ar: 'عملية التحصيل :', en: 'Collection process:' },
    items: [
      {
        ar: 'ارتفاع نسب تحصيل بالشركة من الإصدار (بدون الحكومي) من 94% عام 2018 إلى 97% عام 2019/2020 وذلك بعد تطبيق الجدول الزمنى لخطة التحصيل، وزيادة كفاءة عملية قراءة العدادات والقضاء على القراءات العشوائية وانعدام شكاوى العملاء وانهاء مشكلة التراكمات والمتأخرات ومن ثم زيادة جودة الخدمة.',
        en: 'The company collection rate from issued bills, excluding government accounts, increased from 94% in 2018 to 97% in 2019/2020 after applying the collection timetable, improving meter reading efficiency, eliminating random readings, removing customer complaints, and reducing accumulation and arrears, which improved service quality.',
      },
      {
        ar: 'تفعيل خدمة الموبايل ابليكيشن لتلقي الشكاوى، وتم تفعيل استخدام هذه الخدمة في الإستعلام وسداد الفواتير.',
        en: 'The mobile application service was activated to receive complaints, and it is now also used for inquiries and bill payment.',
      },
      {
        ar: 'عمل دورات تدريبية للمحصلين مما زاد من معدل التوريد اليومي لكل محصل من 5.2 % عام 2019 إلى 4% عام 2020وحتى الان',
        en: 'Training courses were held for collectors, improving the daily remittance performance of each collector compared with previous operational levels.',
      },
    ],
  },
];

const otherTopics: LocalizedText[] = [
  {
    ar: 'تم دراسة موضوع مقدم من إدارة المخالفات بالقطاع التجاري بخصوص تحصيل مستحقات الشركة في حالة إنشاء خطوط تعدي على شبكة المياه أو الصرف، وقد تم إعداد الدراسة المطلوبة وتم تعميمها على جميع مناطق الشركة.',
    en: 'A topic submitted by the Violations Department in the commercial sector regarding collection of company dues in cases of illegal lines connected to water or wastewater networks was studied, and the required report was prepared and circulated to all company areas.',
  },
  {
    ar: 'وقامت الإدارة بدراسة مشكلات المحصلين التي تعوق عملية التحصيل والحلول المقترحة، وقد تم اعتماد الحلول وتعميمها، مثل المنازل المهجورة في بعض المناطق وكذلك المغلقة معظم شهور السنة في دير درنكة.',
    en: 'The department also studied collectors’ problems that hinder the collection process along with proposed solutions. The approved solutions were circulated, including issues related to abandoned homes in some areas and houses closed for most months of the year in Dayr Dronka.',
  },
];

function IntegritySupportOverviewPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const imageFloatClass = isEnglish
    ? 'group float-right mb-4 ml-6 w-72 cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md md:w-80 lg:w-96'
    : 'group float-left mb-4 mr-6 w-72 cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md md:w-80 lg:w-96';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Header />
      <main className="bg-white py-6" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className={`mb-8 overflow-hidden rounded-3xl px-6 py-8 text-white shadow-[0_18px_40px_rgba(2,6,23,0.15)] ${headerGradientClass}`}>
            <div className={textAlignmentClass}>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {t({ ar: 'نبذه عن إداره دعم النزاهة', en: 'Overview of the Integrity Support Department' })}
              </h1>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
                {t({ ar: 'نبذة تعريفية عن الإدارة، وأبرز الإنجازات ومؤشرات الأداء.', en: 'An introduction to the department, its key achievements, and performance indicators.' })}
              </p>
            </div>
          </div>

          <section className={`space-y-6 text-slate-700 ${textAlignmentClass}`}>
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">{t({ ar: 'التعريف', en: 'Definition' })}</h2>
              <p className="mt-4 leading-8">{t(definitionText)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">{t({ ar: 'الإنجازات', en: 'Achievements' })}</h2>
              <div className="mt-4">
                <button
                  type="button"
                  aria-label={t({ ar: 'تكبير صورة الإنجازات', en: 'Open achievements image' })}
                  className={imageFloatClass}
                  onClick={() =>
                    setLightboxImage({
                      src: '/images/nabza-an-elnazaha/Achievements.webp',
                      alt: t({ ar: 'صورة الإنجازات', en: 'Achievements image' }),
                    })
                  }
                >
                  <img
                    src="/images/nabza-an-elnazaha/Achievements.webp"
                    alt={t({ ar: 'صورة الإنجازات', en: 'Achievements image' })}
                    className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
                {achievementsParagraphs.map((paragraph) => (
                  <p key={paragraph.ar} className="mt-4 leading-8 first:mt-0">
                    {t(paragraph)}
                  </p>
                ))}
                <div className="clear-both" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">
                {t({ ar: 'مؤشرات الأداء (القطاع التجاري)', en: 'Performance Indicators (Commercial Sector)' })}
              </h2>
              <div className="mt-4">
                <button
                  type="button"
                  aria-label={t({ ar: 'تكبير صورة مؤشرات الأداء', en: 'Open performance indicators image' })}
                  className="group mx-auto mb-4 block w-full max-w-3xl cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  onClick={() =>
                    setLightboxImage({
                      src: '/images/nabza-an-elnazaha/Performance indicator.webp',
                      alt: t({ ar: 'صورة مؤشرات الأداء', en: 'Performance indicators image' }),
                    })
                  }
                >
                  <img
                    src="/images/nabza-an-elnazaha/Performance indicator.webp"
                    alt={t({ ar: 'صورة مؤشرات الأداء', en: 'Performance indicators image' })}
                    className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
                <p className="leading-8">
                  {t({
                    ar: 'وبناء على الخطط التي تم وضعها وإعتمادها ومراجعتها من الشركة القابضة لعمليات القطاع التجاري (عدد ستة عمليات) تم رصد وقياس نسب مؤشرات الأداء وأهمها فيما يلي:',
                    en: 'Based on the plans developed, approved, and reviewed by the Holding Company for the commercial sector processes, performance indicator ratios were monitored and measured. The most important of them are as follows:',
                  })}
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {performanceSections.map((section) => (
                  <div key={section.title.ar}>
                    <h3 className="text-lg font-semibold text-slate-800">{t(section.title)}</h3>
                    <ol className={`mt-3 list-decimal space-y-2 ${isEnglish ? 'pl-5' : 'pr-5'}`}>
                      {section.items.map((item) => (
                        <li key={item.ar}>{t(item)}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">{t({ ar: 'موضوعات أخري', en: 'Other Topics' })}</h2>
              <ul className={`mt-4 list-disc space-y-2 ${isEnglish ? 'pl-5' : 'pr-5'}`}>
                {otherTopics.map((item) => (
                  <li key={item.ar}>{t(item)}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[95vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t({ ar: 'إغلاق الصورة', en: 'Close image' })}
              className="absolute -top-3 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow transition hover:bg-white"
              onClick={() => setLightboxImage(null)}
            >
              {t({ ar: 'إغلاق', en: 'Close' })}
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              loading="lazy"
              className="max-h-[90vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default IntegritySupportOverviewPage;
