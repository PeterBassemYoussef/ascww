import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = {
  ar: string;
  en: string;
};

const bathroomTips: LocalizedText[] = [
  {
    ar: 'الحرص على احتواء المرحاض على سيفون منخفض الاستهلاك، أي بسعة غالون ونصف فقط مع كل استخدام.',
    en: 'Use a low-consumption toilet flush with a capacity of only one and a half gallons per use.',
  },
  {
    ar: 'عند الاستحمام، يفضّل جمع المياه الباردة التي تتدفق في البداية الى حين وصول المياه الساخنة، وعدم إهدارها، وتجميعها لاستعمالات أخرى كري المزروعات، والذي من شأنه توفير ما يزيد عن 200-300 غالون شهرياً.',
    en: 'When showering, collect the cold water that flows at the beginning until hot water arrives and reuse it for other purposes such as watering plants, which can save more than 200 to 300 gallons per month.',
  },
  {
    ar: 'فحص المراحيض والتأكد من عدم وجود تسريب؛ فمثلاً يمكن وضع صبغة ملونة في خزان المرحاض، وفي حال ظهور اللون من دون سحب السيفون فذلك يدل على وجود تسريب يجب إصلاحه فوراً، مما يساعد على توفير اكثر من 400 غالون شهرياً.',
    en: 'Inspect toilets and make sure there are no leaks. For example, you can place colored dye in the toilet tank, and if the color appears without flushing, this indicates a leak that should be repaired immediately. This can save more than 400 gallons per month.',
  },
  {
    ar: 'اغلاق صنبور المياه أثناء تنظيف الأسنان بالفرشاة، أو أثناء الحلاقة مع استخدام وعاء يحتوي على الماء لغسل أداة الحلاقة، مما يساعد على توفير 3 غالونات يومياً.',
    en: 'Turn off the water tap while brushing your teeth or shaving, and use a container of water to rinse the razor. This can save about 3 gallons per day.',
  },
];

const gardenTips: LocalizedText[] = [
  {
    ar: 'الاعتماد على مياه الأمطار في ري الأعشاب والاستغناء عن الرشاشات التي تستهلك ما يقارب الألف لتر من الماء في الساعة.',
    en: 'Rely on rainwater to irrigate grass and avoid sprinklers that consume nearly one thousand liters of water per hour.',
  },
  {
    ar: 'استخدام خزانات لتجميع مياه الأمطار والاستفادة منها في ري المزروعات، وتنظيف الحديقة، وغسل السيارات وغيرها.',
    en: 'Use tanks to collect rainwater and benefit from it in irrigating plants, cleaning the garden, washing cars, and other uses.',
  },
  {
    ar: 'خلط التربة مع نشارة الخشب مما يساعد في الحفاظ على رطوبتها وخفض نسبة تبخر الماء منها بنسبة 75%.',
    en: 'Mix soil with wood chips to help retain moisture and reduce water evaporation by up to 75%.',
  },
  {
    ar: 'زراعة النباتات المقاومة للجفاف والتي تحتاج لكميات أقل من الماء.',
    en: 'Plant drought-resistant species that require smaller quantities of water.',
  },
];

const whySaveWater: LocalizedText[] = [
  {
    ar: 'تبرز أهمية المياه على إبقاء البشر، والحيوانات، والنباتات على قيد الحياة.',
    en: 'Water is essential for keeping humans, animals, and plants alive.',
  },
  {
    ar: 'توفّر الماء أيضاً مواطن بيئية متخصصة للحياة البرية.',
    en: 'Water also provides specialized habitats for wildlife.',
  },
  {
    ar: 'إنّ ترشيد استهلاك المياه ينعكس إيجاباً على البيئة وعلى الدخل المادي للفرد؛ فتوفير استهلاك الماء يوفّر الطاقة التي يتم استخدامها لتنقية المياه، وتسخينها، وضخّها الى المنازل، مما يساعد بالتالي على التقليل من انبعاثات ثاني أكسيد الكربون الى الهواء، والمحافظة على البيئة.',
    en: 'Rationalizing water consumption has a positive effect on both the environment and household expenses. Saving water also saves the energy used to treat, heat, and pump it into homes, which helps reduce carbon dioxide emissions and protect the environment.',
  },
  {
    ar: 'أما من الناحية المادية الاقتصادية، فكلّما قلّ استهلاك الفرد اليومي للمياه، قلّت قيمة فاتورة الاستهلاك المترتبة عليه، مما يساعد بالتالي على توفير الأموال.',
    en: 'From an economic perspective, the lower a person’s daily water consumption, the lower the resulting bill, which helps save money.',
  },
];

const awarenessCards = [
  {
    imageUrl: '/images/advice-and-contact/1.webp',
    title: {
      ar: 'ترشيد الاستهلاك اليومي',
      en: 'Rational daily consumption',
    },
    description: {
      ar: 'ممارسات بسيطة داخل المنزل تحدث فرقًا كبيرًا في حفظ المياه.',
      en: 'Simple practices inside the home can make a big difference in water conservation.',
    },
  },
  {
    imageUrl: '/images/advice-and-contact/2.webp',
    title: {
      ar: 'سلوك مائي صحيح',
      en: 'Responsible water behavior',
    },
    description: {
      ar: 'صيانة أجزاء منظومة المياه بحكمة يحافظ على الموارد ويقلل استهلاك المياه.',
      en: 'Maintaining parts of the water system wisely preserves resources and reduces water use.',
    },
  },
  {
    imageUrl: '/images/advice-and-contact/3.webp',
    title: {
      ar: 'مشاركة مجتمعية',
      en: 'Community participation',
    },
    description: {
      ar: 'نشر الوعي المائي مسؤولية مشتركة تبدأ من كل فرد.',
      en: 'Spreading water awareness is a shared responsibility that starts with every individual.',
    },
  },
];

function AdviceAndContactPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (text: LocalizedText) => (isEnglish ? text.en : text.ar);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectedCard = awarenessCards[selectedCardIndex];

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <div className="hidden">
                {t({ ar: 'التوعية والاتصال', en: 'Awareness and Communication' })}
              </div>
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t({ ar: 'التوعية والاتصال', en: 'Awareness and Communication' })}</h1>
              <p className={`mt-2 text-sm leading-7 text-slate-600 sm:text-base ${textAlignmentClass}`}>
                {t({
                  ar: 'وتعتمد منهجية التوعية والإتصال علي الاتى :-',
                  en: 'The awareness and communication methodology is based on the following:',
                })}
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section className={`relative overflow-hidden rounded-3xl border border-slate-200 p-4 shadow-[0_16px_30px_rgba(2,6,23,0.2)] sm:p-5 ${headerGradientClass}`}>
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#d7b05a]/35 blur-2xl" />

                <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <article className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/30 shadow-[0_12px_25px_rgba(2,6,23,0.28)] sm:min-h-[360px]">
                    <img
                      decoding="async"
                      src={selectedCard.imageUrl}
                      alt={t({
                        ar: `صورة توعوية ${selectedCardIndex + 1}`,
                        en: `Awareness image ${selectedCardIndex + 1}`,
                      })}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className={`absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 ${textAlignmentClass}`}>
                      <h3 className="mt-2 text-base font-extrabold sm:text-xl">{t(selectedCard.title)}</h3>
                      <p className="mt-1 text-xs leading-6 text-white/90 sm:text-sm">{t(selectedCard.description)}</p>
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
                          className={`group relative overflow-hidden rounded-2xl border shadow-[0_10px_20px_rgba(2,6,23,0.25)] transition ${textAlignmentClass} ${
                            isActive
                              ? 'border-[#d7b05a] ring-2 ring-[#d7b05a]/60'
                              : 'border-white/35 hover:border-[#d7b05a]/80'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                          <img
                            decoding="async"
                            src={card.imageUrl}
                            alt={t({
                              ar: `صورة مصغرة ${index + 1}`,
                              en: `Thumbnail image ${index + 1}`,
                            })}
                            loading="lazy"
                            className="h-24 w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-2 text-white">
                            <p className="mt-1 text-xs font-bold">{t(card.title)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className={`mb-4 text-xl font-bold text-[#0a3555] ${textAlignmentClass}`}>
                  {t({ ar: 'المحافظة على الماء في دورة المياه', en: 'Saving water in the bathroom' })}
                </h2>
                <ul className="space-y-2 text-slate-700">
                  {bathroomTips.map((tip) => (
                    <li key={tip.ar} className={`leading-8 ${textAlignmentClass}`}>• {t(tip)}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className={`mb-4 text-xl font-bold text-[#0a3555] ${textAlignmentClass}`}>
                  {t({ ar: 'المحافظة على الماء في الحديقة', en: 'Saving water in the garden' })}
                </h2>
                <ul className="space-y-2 text-slate-700">
                  {gardenTips.map((tip) => (
                    <li key={tip.ar} className={`leading-8 ${textAlignmentClass}`}>• {t(tip)}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className={`mb-3 text-xl font-bold text-[#0a3555] ${textAlignmentClass}`}>
                  {t({
                    ar: 'أهمية المحافظة على الماء من التلوث أو الاستهلاك',
                    en: 'The importance of protecting water from pollution and wasteful consumption',
                  })}
                </h2>
                <p className={`mb-3 leading-8 text-slate-700 ${textAlignmentClass}`}>
                  {t({
                    ar: 'هنا أنّ هناك العديد من الأسباب التي تدعو للمحافظة على المياه.',
                    en: 'There are many reasons that make water conservation essential.',
                  })}
                </p>
                <ul className="space-y-2 text-slate-700">
                  {whySaveWater.map((item) => (
                    <li key={item.ar} className={`leading-8 ${textAlignmentClass}`}>• {t(item)}</li>
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
