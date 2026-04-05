import Footer from '../components/Footer';
import Header from '../components/Header';

const KIDS_VIDEOS = [
  {
    title: 'ترشيد الأطفال في استهلاك المياه',
    src: 'https://www.youtube.com/embed/MLgpjaS6TX4',
  },
  {
    title: 'نوره والماء',
    src: 'https://www.youtube.com/embed/_xmmPrvbc9I',
  },
  {
    title: 'نصائح للحفاظ على الماء',
    src: 'https://www.youtube.com/embed/gZsstDIp24o',
  },
  {
    title: 'المحافظة على الماء',
    src: 'https://www.youtube.com/embed/1G28AbR6pA8',
  },
];

const WOMEN_SECTION_IMAGES = [
  '/images/awareness/1.webp',
  '/images/awareness/2.webp',
  '/images/awareness/3.webp',
];
const WOMEN_TIPS = [
  'غلق الحنفية أثناء غسيل الأسنان بالفرشاة (إن معدل الوقت المستغرق لتنظيف الأسنان هو دقيقة وعشرين ثانية فإذا فتحنا حنفية الماء طوال تلك المدة فسنكون قد أهدرنا حوالي 8 لترات من الماء.)',
  'تأكدي من غلق الأولاد الحنفية جيدا بعد الاستخدام مباشرة، سواء بعد غسيل الأيدي أو الاستحمام.',
  'يمكنك وضع وعاء في الحوض عند غسيل الخضروات وإعادة استخدامها في ري النباتات أو ملء صندوق الصرف (السيفون) منها.',
  'تأكدي من عدم تسريب أي من الأدوات الصحية للمياه بالمنزل وسارعي في صيانتها إن وجد التسريب.',
  'يمكنك صيانة الأدوات الصحية الخفيفية بنفسك، من خلال الاسترشاد بدليل مبادىء «فنيات السباكة».',
  'باستخدامك للقطع الموفرة في الأدوات الصحية يمكنك توفير 50% من الاستهلاك الشهري، فالقطع الموفرة تعمل على تخفيض تدفق المياه بنسبة 35% من خلال شكة المصفاة الموجودة بالقطعة.',
  'انتظامك في سداد فاتورتك يضمن لك استمرار توصيل الخدمة بالجودة المطلوبة.',
  'تطهير خزانات المياه يضمن لكي ولأولادك مياه نظيفة وصحية، لطلب تطهير خزانك برجاء الاتصال بالخط الساخن 125.',
  'في حال وجود شكاوى او استفسارات تتعلق بالمياه أو الصرف الصحي يمكنك الاتصال برقم 125 من أي تليفون ارضي.',
];

function ForKidsAndWomenPage() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                التوعية والاتصال
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">ركن الأطفال ولكِ سيدتي</h1>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0a3555]">ركن الأطفال</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {KIDS_VIDEOS.map((video) => (
                    <article key={video.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="border-b border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 text-justify">
                        {video.title}
                      </div>
                      <div className="aspect-video w-full">
                        <iframe
                          src={video.src}
                          title={video.title}
                          className="h-full w-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0a3555]">لكِ سيدتي</h2>
                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {WOMEN_SECTION_IMAGES.map((imageUrl, index) => (
                    <div key={imageUrl} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                      <img decoding="async"
                        src={imageUrl}
                        alt={`صورة توعوية ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mb-4 text-base font-bold text-slate-800 text-justify">
                  الخطوات التي يجب اتباعها لتخفيض استهلاك الفاتورة والمحافظة على المياه
                </p>
                <ul className="mb-5 space-y-2 text-slate-700">
                  {WOMEN_TIPS.map((tip) => (
                    <li key={tip} className="leading-8 text-justify">- {tip}</li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ForKidsAndWomenPage;
