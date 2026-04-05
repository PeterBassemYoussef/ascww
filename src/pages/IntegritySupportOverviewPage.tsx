import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

function IntegritySupportOverviewPage() {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(
    null
  );

  return (
    <>
      <Header />
      <main className="bg-white py-6" dir="rtl">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-8 text-white shadow-[0_18px_40px_rgba(2,6,23,0.15)]">
            <div className="text-right">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                نبذه عن إداره دعم النزاهة
              </h1>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
                نبذة تعريفية عن الإدارة، وأبرز الإنجازات ومؤشرات الأداء.
              </p>
            </div>
          </div>

          <section className="space-y-6 text-right text-justify text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">التعريف</h2>
              <p className="mt-4 leading-8">
                إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد
                تتبع الإدارة العامة لشئون مجلس الإدارة، وتحت الإشراف المباشر لإدارة
                الجودة والنزاهة بالشركة القابضة بالقاهرة وتنطلق من الهدف من وراء
                إنشائها وهو توفير الخدمات بكفاءة وفاعلية للوفاء بتوقعات أصحاب
                المصالح، والربط بين متطلبات النزاهة والشفافية وبين المتطلبات التي
                تفرض على الشركة من خلال الأجهزة السيادية والتنظيمية من داخل وخارج
                قطاع المياه.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">الإنجازات</h2>
              <p className="mt-4 leading-8">
                بناء على تكليفات الشركة القابضة،وتوجيهات السيد لواء أركان حرب مهندس
                رئيس مجلس الإدارة والعضو المنتدب لشركة مياه الشرب والصرف الصحي بأسيوط
                والوادي الجديد.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  aria-label="تكبير صورة الإنجازات"
                  className="group float-left mb-4 mr-6 w-72 cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md md:w-80 lg:w-96"
                  onClick={() =>
                    setLightboxImage({
                      src: '/images/nabza-an-elnazaha/Achievements.webp',
                      alt: 'Achievements',
                    })
                  }
                >
                  <img
                    src="/images/nabza-an-elnazaha/Achievements.webp"
                    alt="Achievements"
                    className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
                <p className="leading-8">
                  قامت إدارة دعم النزاهة بشركة مياه الشرب والصرف الصحي باسيوط والوادي
                  الجديد، بتحديد العمليات الخاصة بالمخازن وكذلك العمليات ذات الصلة،
                  والتي لها تأثير مباشر على المخازن.
                </p>
                <p className="mt-4 leading-8">
                  وفيما يخص العمل بالدليل التجاري الموحد بالقطاع التجاري بالشركات
                  التابعة، تم عقد عديد من ورش العمل الخاصة بتطبيق الدليل التجارى الموحد
                  بالقطاع التجارى وتم رصد عدة ملاحظات خاصة بالاجراءات تؤثر على اجراءات
                  سير العمل بشركة مياه أسيوط مما تأخذه من وقت وادوات.
                </p>
                <p className="mt-4 leading-8">
                  وعليه فأن اجراءات العمل بشركة مياه أسيوط تتم بشكل اسرع وأدق خصوصا
                  دورة الاصدار و التحصيل حيث أن عدد أيام التحصيل بناءا على نظام وجدول
                  العمل بمركز الاصدار يتيح لكل فرع من (29 إلى 30 يوم تحصيل). كما يتم
                  مراجعة جميع تقارير الأصدار من قبل إدارة المراجعة بمركز الاصدار وإبداء
                  جميع الملاحظات وتلافيها قبل طباعة الفواتير.
                </p>
                <p className="mt-4 leading-8">
                  أما بالنسبة لمراكز خدمة العملاء يتم التعامل من خلال الشباك الواحد
                  بمراكز خدمة العملاء مما يقلل الاحتياج لاعداد كثيرة من العاملين بالمركز
                  الواحد ويؤدى إلى سرعة الانجاز وعدم ضياع المستندات. وعليه تم إعتماد
                  الدليل التجارى الموحد بالقطاع التجارى على مستوى الشركات مع مراعاة
                  نظام الإصدار والتحصيل المتبع حالياً بالشركة لحين توحيد النظم والبرامج
                  الإلكترونية والمراجعة مع الشركة القابضة.
                </p>
                <div className="clear-both" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">
                مؤشرات الأداء (القطاع التجاري)
              </h2>
              <div className="mt-4">
                <button
                  type="button"
                  aria-label="تكبير صورة مؤشرات الأداء"
                  className="group mx-auto mb-4 block w-full max-w-3xl cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  onClick={() =>
                    setLightboxImage({
                      src: '/images/nabza-an-elnazaha/Performance indicator.webp',
                      alt: 'Performance indicator',
                    })
                  }
                >
                  <img
                    src="/images/nabza-an-elnazaha/Performance indicator.webp"
                    alt="Performance indicator"
                    className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
                <p className="leading-8">
                  وبناء على الخطط التي تم وضعها وإعتمادها ومراجعتها من الشركة القابضة
                  لعمليات القطاع التجاري ( عدد ستة عمليات) تم رصد وقياس نسب مؤشرات
                  الأداء و أهمها فيما يلي:
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    التعاقدات والإشتراكات:
                  </h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>انخفاض شكاوى العملاء المتضررين من عدم اتمام طلباتهم إلى الصفر.</li>
                    <li>
                      انخفاض عدد المقايسات التي تم رفضها لأسباب غير منطقية إلى الصفر،
                      وذلك كنتيجة لتدريب العاملين.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">المقايسات :</h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>
                      انخفاض نسبة شكاوى العملاء من طول المدة الزمنية لإتمام المعاينة
                      والتوصيل والتركيب من 33% في 1/7/2019 إلى 10% في 1/7/2020 ثم 6%
                      في 1/1/2021.
                    </li>
                    <li>
                      انخفاض نسبة شكاوى العملاء من عدم إصدار فواتير رغم تركيب العداد
                      إلى الصفر، وذلك نتيجة ميكنة خدمة العملاء وانتظام الدورة المستندية
                      بمركز الإصدار وتركيب العدادات مسبقة الدفع.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    العدادات مسبقة الدفع :
                  </h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>
                      انخفاض نسبة شكاوى العملاء من تأخر تركيب العداد بالرغم من سداد
                      كافة المستحقات، حتى وصلت إلى 3% تقريباً في 1/10/2020.
                    </li>
                    <li>
                      ارتفاع نسبة تركيب العدادات مسبقة الدفع مقارنة بالشهور السابقة،
                      من 3209 في 1/7/2019 إلى 3752 في 1/10/2020.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    مراجعة الإيرادات :
                  </h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>
                      انخفاض نسبة العجز لدى المحصلين إلى الصفر، وذلك بسبب تطبيق
                      الفاتورة التراكمية وزيادة عدد المحصلين
                    </li>
                    <li>
                      انخفاض شكاوى العملاء من سداد الفاتورة وإعادة تحصيلها مرة أخرى ـ
                      إلى الصفر، وذلك بسبب تطبيق الفاتورة التراكمية وعدم تطبيق التحصيل
                      الإلكتروني.
                    </li>
                    <li>
                      انخفاض نسبة الفواتير المرتجعة وغير الملغاه من 368816 في 1/7/2019
                      إلى 227631 في 1/7/2020 ثم 169826 في 1/10/2020.
                    </li>
                    <li>
                      زيادة نسبة التسويات وبالتالي انخفاض شكاوى العملاء من وجود رصيد
                      سابق رغم السداد، حيث كانت 1152 في 1/7/2019 و 3918 في 1/7/2020 ثم
                      4039 في 1/10/2020.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    عملية تركيب العدادات :
                  </h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>
                      بالنسبة لخطط تركيب العدادت يوجد صعوبة في تحديد القيمة الصفرية في
                      الفترة من 1/7/2020 حتى 31/12/2020 وذلك لظروف غلق مراكز خدمة العملاء
                      لظروف جائحة كورونا، وعند فتح مراكز خدمة العملاء وبدء التعامل مع
                      الجمهور تم اتخاذ إجراءات تغيير العدادات المعطلة وتركيب العدادت
                      السليمة حيث تم تركيب (50000) عداد وهي نسبة كبيرة في فترة زمنية
                      قصيرة، ثم تم فتح تركيب العدادات الكودية، وتم البدء في تطبيق خطة
                      الشركة القابضة لإحلال وتغيير العدادات القديمة بعدادات مسبقة الدفع.
                    </li>
                    <li>تم تركيب عدد (5) عدادات ميكانيكية ذات أقطار كبيرة.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">عملية التحصيل :</h3>
                  <ol className="mt-3 list-decimal space-y-2 pr-5">
                    <li>
                      ارتفاع نسب تحصيل بالشركة من الإصدار (بدون الحكومي) من 94% عام
                      2018 إلى 97% عام 2019/2020 وذلك بعد تطبيق الجدول الزمنى لخطة
                      التحصيل، وزيادة كفاءة عملية قراءة العدادات والقضاء على القراءات
                      العشوائية وانعدام شكاوى العملاء وانهاء مشكلة التراكمات والمتأخرات
                      ومن ثم زيادة جودة الخدمة.
                    </li>
                    <li>
                      تفعيل خدمة الموبايل ابليكيشن لتلقي الشكاوى، وتم تفعيل استخدام
                      هذه الخدمة في الإستعلام وسداد الفواتير.
                    </li>
                    <li>
                      عمل دورات تدريبية للمحصلين مما زاد من معدل التوريد اليومي لكل محصل
                      من 5.2 % عام 2019 إلى 4% عام 2020وحتى الان
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0a3555]">موضوعات أخري</h2>
              <ul className="mt-4 list-disc space-y-2 pr-5">
                <li>
                  تم دراسة موضوع مقدم من إدارة المخالفات بالقطاع التجاري بخصوص تحصيل
                  مستحقات الشركة في حالة إنشاء خطوط تعدي على شبكة المياه أو الصرف، وقد
                  تم إعداد الدراسة المطلوبة وتم تعميمها على جميع مناطق الشركة
                </li>
                <li>
                  وقامت الإدارة بدراسة مشكلات المحصلين التي تعوق عملية التحصيل والحلول
                  لمقترحة، وقد تم اعتماد الحلول وتعميمها ( مثال : المنازل المهجورة في
                  بعض المناطق وكذلك المغلقة معظم شهور السنة في دير درنكة).
                </li>
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
              aria-label="إغلاق الصورة"
              className="absolute -top-3 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow transition hover:bg-white"
              onClick={() => setLightboxImage(null)}
            >
              إغلاق
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
