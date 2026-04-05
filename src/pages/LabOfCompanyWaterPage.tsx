import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const labImages = [
  { src: '/images/Labofcompany/lab-1.webp', alt: 'صور المعمل المركزي - 1' },
  { src: '/images/Labofcompany/lab-2.webp', alt: 'صور المعمل المركزي - 2' },
  { src: '/images/Labofcompany/lab-3.webp', alt: 'صور المعمل المركزي - 3' },
  { src: '/images/Labofcompany/lab-4.webp', alt: 'صور المعمل المركزي - 4' },
];
const labSectorStructureImages = Array.from({ length: 13 }, (_, index) => ({
  src: `/images/lap-pdf/${index + 1}.webp`,
  alt: `عرض هيكل قطاع المعامل - ${index + 1}`,
  rank: index + 1,
}));

const slideLabImage = '/images/Labofcompany/slide-lab.webp';

const wrapIndex = (value: number, total: number) => ((value % total) + total) % total;

function LabOfCompanyWaterPage() {
  const [selectedLabImage, setSelectedLabImage] = useState(labImages[0]);
  const [selectedStructureIndex, setSelectedStructureIndex] = useState(labSectorStructureImages.length - 1);
  const [openedStructureIndex, setOpenedStructureIndex] = useState<number | null>(null);
  const selectedStructureImage = labSectorStructureImages[selectedStructureIndex];
  const openedStructureImage = openedStructureIndex === null ? null : labSectorStructureImages[openedStructureIndex];

  const handleStructureStep = (direction: 1 | -1) => {
    setSelectedStructureIndex((previous) => wrapIndex(previous + direction, labSectorStructureImages.length));
  };

  const handleLightboxStep = (direction: 1 | -1) => {
    setOpenedStructureIndex((previous) => {
      if (previous === null) return previous;
      return wrapIndex(previous + direction, labSectorStructureImages.length);
    });
  };

  useEffect(() => {
    if (openedStructureIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedStructureIndex(null);
        return;
      }
      if (event.key === 'ArrowRight') {
        setOpenedStructureIndex((previous) => {
          if (previous === null) return previous;
          return wrapIndex(previous + 1, labSectorStructureImages.length);
        });
      }
      if (event.key === 'ArrowLeft') {
        setOpenedStructureIndex((previous) => {
          if (previous === null) return previous;
          return wrapIndex(previous - 1, labSectorStructureImages.length);
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openedStructureIndex]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">المعمل المركزي</h1>
              <p className="mt-2 text-sm font-semibold text-white/90 sm:text-base">
                شركه مياه الشرب والصرف الصحي بأسيوط و الوادي الجديد / المعمل
              </p>
            </div>

            <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img decoding="async"
                  src={slideLabImage}
                  alt="المعمل المركزي لمياه الشركة"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </section>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-extrabold text-[#0a3555]">تحليل العينات</h2>
                <p className="mt-3 text-justify leading-8 text-slate-700">
                  يتم متابعة جودة المياه المنتجة من المحطات بكافة انواعها (مرشحة ونقالى و زلطية وجوفية ومعالجة
                  حديد ومنجنيز ) بأخذ عينات دورية من تلك المحطات وتحليلها بمعامل الشركة وذلك للوقوف على جودة المياه
                  المنتجة و التأكد من مدى مطابقتها للمواصفات و المعايير الواردة بقرار وزارة الصحة رقم 458 لسنة 2007
                  وانواع التحاليل كالتالى :
                </p>
                <ul className="mt-4 space-y-2 text-slate-700">
                  <li className="rounded-lg bg-white px-4 py-2 leading-7">
                    تحاليل فيزيائية : الرقم الهيدروجينى : العكارة , اللون , الطعم ,الرائحة
                  </li>
                  <li className="rounded-lg bg-white px-4 py-2 leading-7">
                    تحاليل كيميائية : حديد ، منجيز ، امونيا , عسر كلى ، عسر كالسيوم , عسر ماغنسيوم , القلوية الكلية
                    , الاملاح الذائبة الكلية
                  </li>
                  <li className="rounded-lg bg-white px-4 py-2 leading-7">تحاليل ميكروبيولوجية</li>
                  <li className="rounded-lg bg-white px-4 py-2 leading-7">فحص ميكروسكوبى</li>
                </ul>
              </article>

              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                <h3 className="mb-4 text-lg font-extrabold text-[#0a3555] sm:text-xl">صور المعمل المركزى</h3>
                <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
                  <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                    <img decoding="async"
                      src={selectedLabImage.src}
                      alt={selectedLabImage.alt}
                      loading="lazy"
                      className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[280px] lg:h-[320px]"
                    />
                  </article>

                  <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                    {labImages.map((image) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setSelectedLabImage(image)}
                        className={`group relative h-full min-h-[105px] overflow-hidden rounded-xl border bg-white text-right shadow-sm transition ${
                          selectedLabImage.src === image.src
                            ? 'border-[#0a3555] ring-2 ring-[#0a3555]/25'
                            : 'border-slate-200 hover:border-[#0a3555]/45'
                        }`}
                      >
                        <img decoding="async"
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                <h3 className="mb-4 text-lg font-extrabold text-[#0a3555] sm:text-xl">عرض هيكل قطاع المعامل</h3>
                <div className="mx-auto max-w-[980px] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
                  <div className="relative h-[240px] bg-slate-900 sm:h-[310px] lg:h-[420px]" dir="ltr">
                    <button
                      type="button"
                      onClick={() => handleStructureStep(-1)}
                      aria-label="الصورة السابقة"
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded bg-black/55 px-3 py-2 text-xl font-black text-white transition hover:bg-black/75"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStructureStep(1)}
                      aria-label="الصورة التالية"
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded bg-black/55 px-3 py-2 text-xl font-black text-white transition hover:bg-black/75"
                    >
                      ›
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenedStructureIndex(selectedStructureIndex)}
                      className="absolute bottom-3 right-3 z-10 rounded bg-black/60 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-black/80"
                    >
                      تكبير
                    </button>
                    <span className="absolute bottom-3 left-3 z-10 rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">
                      {selectedStructureImage.rank} / {labSectorStructureImages.length}
                    </span>
                    <img decoding="async"
                      src={selectedStructureImage.src}
                      alt={selectedStructureImage.alt}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="border-t border-slate-200 bg-[#ececec] p-2">
                    <div className="flex gap-2 overflow-x-auto pb-1" dir="ltr">
                      {labSectorStructureImages.map((image, index) => (
                        <button
                          key={image.src}
                          type="button"
                          onClick={() => setSelectedStructureIndex(index)}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 bg-white transition sm:h-[72px] sm:w-[108px] ${
                            index === selectedStructureIndex
                              ? 'border-[#0a3555] shadow-[0_0_0_1px_rgba(10,53,85,0.35)]'
                              : 'border-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <img decoding="async" src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 right-1 rounded bg-white/90 px-1 text-[10px] font-black text-slate-900">
                            {image.rank}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
      {openedStructureImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setOpenedStructureIndex(null)}
        >
          <div
            className="relative w-full max-w-[96vw] overflow-hidden rounded-lg border border-white/20 bg-slate-950 sm:max-w-[760px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleLightboxStep(1)}
              aria-label="الصورة التالية"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded bg-black/55 px-2.5 py-1.5 text-lg font-black text-white transition hover:bg-black/75 sm:left-3 sm:px-3 sm:py-2 sm:text-xl"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => handleLightboxStep(-1)}
              aria-label="الصورة السابقة"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded bg-black/55 px-2.5 py-1.5 text-lg font-black text-white transition hover:bg-black/75 sm:right-3 sm:px-3 sm:py-2 sm:text-xl"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setOpenedStructureIndex(null)}
              className="absolute left-3 top-3 z-10 rounded-lg bg-black/55 px-3 py-1 text-sm font-bold text-white transition hover:bg-black/75"
            >
              إغلاق
            </button>
            <span className="absolute right-3 top-3 z-10 rounded bg-black/55 px-2 py-1 text-xs font-bold text-white">
              {openedStructureImage.rank} / {labSectorStructureImages.length}
            </span>
            <img loading="lazy" decoding="async"
              src={openedStructureImage.src}
              alt={openedStructureImage.alt}
              className="mx-auto max-h-[78vh] w-auto max-w-full object-contain sm:max-h-[72vh]"
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default LabOfCompanyWaterPage;
