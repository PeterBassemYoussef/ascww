import Header from '../components/Header';
import Footer from '../components/Footer';

const STAGES = [
  {
    title: 'المرحلة الأولى: الاستعلام والتحضير',
    steps: [
      'الحصول على المعلومات: من الموقع الإلكتروني، تطبيق HCWW-125، الخط الساخن 125، أو دليل الخدمات لمعرفة المستندات المطلوبة.',
      'الاستقبال (3 دقائق): مراجعة مبدئية للمستندات، تسليم بطاقة تعارف، وتخصيص رقم عميل.',
    ],
    image: '/images/ContractOnService/ContractOnService 1.webp',
  },
  {
    title: 'المرحلة الثانية: تقديم الطلب والسداد المبدئي',
    steps: [
      'تقديم طلب الخدمة (5 دقائق): مراجعة نهائية للمستندات والتوقيع على الأوراق الرسمية.',
      'الخزينة - السداد الأول (5 دقائق): دفع رسم المعاينة فقط ثم المغادرة.',
    ],
    image: '/images/ContractOnService/ContractOnService2.webp',
  },
  {
    title: 'المرحلة الثالثة: الإجراءات الفنية والمقايسة',
    steps: [
      'إجراءات داخلية (خلال 48 ساعة): تحويل الطلب لعمل المعاينة الميدانية وتحديد قيمة المقايسة.',
      'التواصل: يتم الاتصال لإبلاغك بالقيمة النهائية وطلب الحضور للسداد.',
    ],
    image: '/images/ContractOnService/ContractOnService3.webp',
  },
  {
    title: 'المرحلة الرابعة: التعاقد النهائي والتركيب',
    steps: [
      'الخزينة - السداد النهائي (5 دقائق): سداد الرسوم النهائية (قيمة المقايسة).',
      'الحصول على الخدمة (خلال 48 ساعة): تحويل الطلب للتركيب، تركيب العداد، وبدء إصدار الفواتير.',
    ],
    image: '/images/ContractOnService/ContractOnService4.webp',
  },
];

function ContractOnServicePage() {
  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_20%_10%,_rgba(89,173,121,0.2),_transparent_45%),linear-gradient(180deg,#f2f8f3_0%,#e9f3ea_100%)]"
        dir="rtl"
      >
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-xl font-extrabold sm:text-2xl">رحلة المتعامل للتعاقد على طلب خدمة</h1>
              <p className="mt-2 text-sm text-white/80">
                أربع مراحل مختصرة توضح رحلتك من الاستعلام حتى تركيب العداد.
              </p>
            </div>

            <div className="px-4 py-8 sm:px-8 space-y-6">
              {STAGES.map((stage, index) => (
                <div
                  key={stage.title}
                  className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition hover:shadow-lg sm:grid-cols-2"
                >
                  <div className="flex flex-col justify-center gap-2">
                    <div className="inline-flex items-center gap-2 text-[#0a3555] font-extrabold">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d7b05a] text-[#0a3555] text-sm">
                        {index + 1}
                      </span>
                      <span className="text-lg">{stage.title}</span>
                    </div>
                    <ul className="list-disc space-y-1 pr-5 text-sm text-slate-800">
                      {stage.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    <img
                      src={stage.image}
                      alt={stage.title}
                      loading="lazy"
                      className="h-full w-full object-contain bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContractOnServicePage;
