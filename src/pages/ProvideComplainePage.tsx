import Footer from '../components/Footer';
import Header from '../components/Header';

function ProvideComplainePage() {
  return (
    <>
      <Header />
      <main className="bg-white py-4" dir="rtl">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-6 text-white shadow-[0_18px_40px_rgba(2,6,23,0.15)]">
            <div className="text-right">
              <h1 className="text-2xl font-extrabold sm:text-3xl">تقديم شكوي</h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                شركه مياه الشرب والصرف الصحي بأسيوط والوادي الجديد
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="نموذج تقديم شكوى"
              src="https://cms.hcww.com.eg/WebsiteComplaints/Web_CustomerComplaint"
              className="h-[430px] w-full bg-white sm:h-[460px] lg:h-[500px]"
              loading="lazy"
            />
          </div>

          <section className="mb-2 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="قنوات التواصل السريعة">
            <a
              href="mailto:media-water@ascww.com.eg"
              className="group rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition duration-300 hover:border-slate-300 hover:bg-slate-50"
              aria-label="إرسال بريد إلكتروني إلى الشركة"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 8 8 5 8-5" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-[#0a3555]">البريد الإلكتروني</h2>
              <p className="mt-1 text-sm text-slate-600">راسلنا عبر البريد الإلكتروني</p>
              <span className="mt-2 block text-sm font-medium text-slate-700 transition group-hover:text-[#0a3555]">
                media-water@ascww.com.eg
              </span>
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=201281565653"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition duration-300 hover:border-slate-300 hover:bg-slate-50"
              aria-label="التواصل عبر واتساب"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 6.03 14.734L4 22l7.534-1.974a7.84 7.84 0 0 0 2.066.272h.001a7.85 7.85 0 0 0 0-15.7m4.65 11.698c-.196.552-.972 1.023-1.586 1.159-.42.093-.969.166-2.815-.6-2.361-.98-3.885-3.392-4.003-3.548-.117-.156-.96-1.279-.96-2.44s.608-1.73.824-1.968c.215-.235.47-.294.627-.294s.314.002.45.009c.144.007.337-.054.527.399.196.47.665 1.625.724 1.743.058.117.098.255.02.411-.078.156-.117.255-.235.392-.117.136-.245.304-.35.408-.117.117-.24.245-.103.48s.61 1.006 1.31 1.63c.898.8 1.654 1.048 1.89 1.165.235.117.372.098.51-.059.136-.156.588-.686.744-.921.156-.235.313-.196.528-.117.215.078 1.362.644 1.596.762.235.117.392.176.45.274.058.098.058.568-.137 1.12" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-[#0a3555]">واتساب</h2>
              <p className="mt-1 text-sm text-slate-600">تواصل معنا عبر واتساب مباشرة</p>
              <span className="mt-2 block text-sm font-medium text-slate-700 transition group-hover:text-[#0a3555]">
                01281565653
              </span>
            </a>

            <a
              href="tel:125"
              className="group rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition duration-300 hover:border-slate-300 hover:bg-slate-50"
              aria-label="الاتصال بالخط الساخن 125"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14v2a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" />
                  <path d="M20 14v2a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
                  <path d="M4 14a8 8 0 1 1 16 0" />
                  <path d="M12 18.5v1.5" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-[#0a3555]">الخط الساخن</h2>
              <p className="mt-1 text-sm text-slate-600">متاح 24 ساعة عبر الرقم المختصر</p>
              <span className="mt-2 block text-sm font-medium text-slate-700 transition group-hover:text-[#0a3555]">
                125
              </span>
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProvideComplainePage;


