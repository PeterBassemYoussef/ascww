import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const bathroomTips = [
  'الحرص على احتواء المرحاض على سيفون منخفض الاستهلاك، أي بسعة غالون ونصف فقط مع كل استخدام.',
  'عند الاستحمام، يفضّل جمع المياه الباردة التي تتدفق في البداية الى حين وصول المياه الساخنة، وعدم إهدارها، وتجميعها لاستعمالات أخرى كري المزروعات، والذي من شأنه توفير ما يزيد عن 200-300 غالون شهرياً.',
  'فحص المراحيض والتأكد من عدم وجود تسريب؛ فمثلاً يمكن وضع صبغة ملونة في خزان المرحاض، وفي حال ظهور اللون من دون سحب السيفون فذلك يدل على وجود تسريب يجب إصلاحه فوراً، مما يساعد على توفير اكثر من 400 غالون شهرياً.',
  'اغلاق صنبور المياه أثناء تنظيف الأسنان بالفرشاة، أو أثناء الحلاقة مع استخدام وعاء يحتوي على الماء لغسل أداة الحلاقة، مما يساعد على توفير 3 غالونات يومياً.',
];

const gardenTips = [
  'الاعتماد على مياه الأمطار في ري الأعشاب والاستغناء عن الرشاشات التي تستهلك ما يقارب الألف لتر من الماء في الساعة.',
  'استخدام خزانات لتجميع مياه الأمطار والاستفادة منها في ري المزروعات، وتنظيف الحديقة، وغسل السيارات وغيرها.',
  'خلط التربة مع نشارة الخشب مما يساعد في الحفاظ على رطوبتها وخفض نسبة تبخر الماء منها بنسبة 75%.',
  'زراعة النباتات المقاومة للجفاف والتي تحتاج لكميات أقل من الماء.',
];

const whySaveWater = [
  'تبرز أهمية المياه على إبقاء البشر، والحيوانات، والنباتات على قيد الحياة.',
  'توفّر الماء أيضاً مواطن بيئية متخصصة للحياة البرية.',
  'إنّ ترشيد استهلاك المياه ينعكس إيجاباً على البيئة وعلى الدخل المادي للفرد؛ فتوفير استهلاك الماء يوفّر الطاقة التي يتم استخدامها لتنقية المياه، وتسخينها، وضخّها الى المنازل، مما يساعد بالتالي على التقليل من انبعاثات ثاني أكسيد الكربون الى الهواء، والمحافظة على البيئة.',
  'أما من الناحية المادية الاقتصادية، فكلّما قلّ استهلاك الفرد اليومي للمياه، قلّت قيمة فاتورة الاستهلاك المترتبة عليه، مما يساعد بالتالي على توفير الأموال.',
];

const awarenessCards = [
  {
    imageUrl: 'https://ascww.org/img/10.98017ad9.jpg',
    title: 'ترشيد الاستهلاك اليومي',
    description: 'ممارسات بسيطة داخل المنزل تحدث فرقًا كبيرًا في حفظ المياه.',
  },
  {
    imageUrl: 'https://ascww.org/img/11.45d63748.jpg',
    title: 'سلوك مائي صحيح',
    description: 'صيانة أجزاء منظومة المياه بحكمة يحافظ على الموارد ويقلل استهلاك المياه.',
  },
  {
    imageUrl: 'https://ascww.org/img/12.87637cb4.jpg',
    title: 'مشاركة مجتمعية',
    description: 'نشر الوعي المائي مسؤولية مشتركة تبدأ من كل فرد.',
  },
];

function AdviceAndContactPage() {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectedCard = awarenessCards[selectedCardIndex];

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
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">التوعية والاتصال</h1>
              <p className="mt-2 text-sm text-white/90 text-justify sm:text-base">
                وتعتمد منهجية التوعية والإتصال علي الاتى :-
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-l from-[#0a3555] to-[#1170b0] p-4 shadow-[0_16px_30px_rgba(2,6,23,0.2)] sm:p-5">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#d7b05a]/35 blur-2xl" />

                <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <article className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/30 shadow-[0_12px_25px_rgba(2,6,23,0.28)] sm:min-h-[360px]">
                    <img decoding="async"
                      src={selectedCard.imageUrl}
                      alt={`صورة توعوية ${selectedCardIndex + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                      <h3 className="mt-2 text-base font-extrabold sm:text-xl">{selectedCard.title}</h3>
                      <p className="mt-1 text-xs leading-6 text-white/90 text-justify sm:text-sm">{selectedCard.description}</p>
                    </div>
                  </article>

                  <div className="grid grid-cols-1 gap-3">
                    {awarenessCards.map((card, index) => {
                      const isActive = index === selectedCardIndex;
                      return (
                        <button
                          key={card.imageUrl}
                          type="button"
                          onClick={() => setSelectedCardIndex(index)}
                          className={`group relative overflow-hidden rounded-2xl border text-right shadow-[0_10px_20px_rgba(2,6,23,0.25)] transition ${isActive
                            ? 'border-[#d7b05a] ring-2 ring-[#d7b05a]/60'
                            : 'border-white/35 hover:border-[#d7b05a]/80'
                            }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                          <img decoding="async"
                            src={card.imageUrl}
                            alt={`صورة مصغرة ${index + 1}`}
                            loading="lazy"
                            className="h-24 w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-2 text-white">
                            <p className="mt-1 text-xs font-bold">{card.title}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0a3555]">المحافظة على الماء في دورة المياه</h2>
                <ul className="space-y-2 text-slate-700">
                  {bathroomTips.map((tip) => (
                    <li key={tip} className="leading-8 text-justify">• {tip}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0a3555]">المحافظة على الماء في الحديقة</h2>
                <ul className="space-y-2 text-slate-700">
                  {gardenTips.map((tip) => (
                    <li key={tip} className="leading-8 text-justify">• {tip}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-xl font-bold text-[#0a3555]">أهمية المحافظة على الماء من التلوث أو الاستهلاك</h2>
                <p className="mb-3 leading-8 text-slate-700 text-justify">
                  هنا أنّ هناك العديد من الأسباب التي تدعو للمحافظة على المياه.
                </p>
                <ul className="space-y-2 text-slate-700">
                  {whySaveWater.map((item) => (
                    <li key={item} className="leading-8 text-justify">• {item}</li>
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

export default AdviceAndContactPage;
