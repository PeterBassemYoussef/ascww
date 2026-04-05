import Header from '../components/Header';
import Footer from '../components/Footer';

function CallCenterPage() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-8" dir="rtl">
        <div className="container mx-auto max-w-6xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">خدمه العملاء</h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">مركز خدمه العملاء</p>
            </div>

            <div className="space-y-5 px-6 py-6 text-slate-700 sm:px-8 sm:py-8">
              <p className="text-justify leading-8">
                تعتبر خدمة العملاء البوابة الاولى لدخول العميل لشركة مياه الشرب والصرف الصحى بأسيوط الوادى الجديد
                حيث ان الهدف الاهم لخدمة العملاء هو كسب رضا العميل وتحسين الصورة الذهنية عن الشركة.
              </p>
              <p className="text-justify leading-8">
                تعد الادارة العامة لخدمة العملاء من الادارات ذات اهمية كبرى بشركة مياه الشرب والصرف الصحى بأسيوط
                والوادى الجديد حيث تقوم من خلال فروعها المنتشرة بجميع مراكز المحافظة من تقديم العديد من الخدمات
                ومنها التعاقد على عداد مياه جديد ( تنظيمى – كودى ) والتعاقد على توصيلة صرف صحى وتغير العدادات
                المعطلة والتنازل عن ملكية العداد للغير وغسيل الخزانات وشحن عداد مسبق الدفع وتلقى الشكاوى التجارية
                وفتعد هى الوجه المشرفة التى تقوم بحركة الوصل المباشر مع العملاء.
              </p>
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <h2 className="text-base font-extrabold text-[#0a3555] sm:text-lg">
                  ولكى تتمكن الشركـة من تقديم أفضل مستوى لخدمة العملاء قامت الشركــة بإنشاء مجموعة من مراكز خدمة العملاء فى مراكز مختلفة بحيث تقوم بتغطية أغلب المناطق الجغرافية للسكان داخل المحافظة ومراكزها.
                </h2>
                <div className="mt-8 space-y-6">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/4.webp"
                        alt="مركز خدمة عملاء الرئيسي"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء الرئيسي</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01278648276
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          أسيوط-امتداد شارع الجيش امام مول النصر
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/35.webp"
                        alt="مركز خدمة عملاء فرع ديروط"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع ديروط</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487781
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع البحر الاعظم
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/33.webp"
                        alt="مركز خدمة عملاء فرع أبوتيج"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع أبوتيج</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487708
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          بجوار رعاية الطفل
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/32.webp"
                        alt="مركز خدمة عملاء فرع ساحل سليم"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع ساحل سليم</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487718
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع الجمهوريه
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/10.webp"
                        alt="مركز خدمة عملاء فرع منفلوط"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع منفلوط</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487749
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع جسر ابومنديل - بجوار المعهد الأزهري
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/31.webp"
                        alt="مركز خدمة عملاء فرع القوصيه"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع القوصيه</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487678
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          امام المرور القديم
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/2.webp"
                        alt="مركز خدمة عملاء فرع أبنوب"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع أبنوب</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487737
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع عثمان الغزالي بجوار المخبز الاَلي
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/1.webp"
                        alt="مركز خدمة عملاء فرع مركز الفتح"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع مركز الفتح</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487740
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          الناصريه أمام مركز الشرطة
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/40.webp"
                        alt="مركز خدمة عملاء فرع صدفا"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع صدفا</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487698
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع الصيانة
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/31.webp"
                        alt="مركز خدمة عملاء فرع مركز البداري"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع مركز البداري</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01284447689
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          شارع مجلس النيابه القديم
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
                    <div className="mx-auto w-full max-w-[520px] aspect-[13/7] overflow-hidden rounded-2xl border border-slate-200 bg-white md:mx-0">
                      <img decoding="async"
                        src="/images/call-center/1.webp"
                        alt="مركز خدمة عملاء فرع الغنايم"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
                      <h3 className="text-lg font-extrabold text-[#0a3555]">مركز خدمة عملاء فرع الغنايم</h3>
                      <div className="mt-4 space-y-3 text-sm leading-7">
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📞</span>
                          01210487696
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">☎️</span>
                          088-2131662
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm" aria-hidden="true">📍</span>
                          الغنايم بحري خلف مركز الشرطة
                        </p>
                      </div>
                    </div>
                  </div>
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

export default CallCenterPage;
