import { useState, type FormEvent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const LABORATORY_WHATSAPP_NUMBER = '201005797550';
const isValidCompanyAddress = (value: string) => /^(?=.*[\p{L}\p{N}])[\p{L}\p{N} ]{1,100}$/u.test(value);

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <span className="mt-1 block text-sm font-semibold text-red-600" role="alert">{message}</span>;
}

function useRequiredFieldErrors(isEnglish: boolean) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInvalid = (event: FormEvent<HTMLFormElement>) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
    if (!field.validity.valueMissing) return;

    const label = field.labels?.[0]?.childNodes[0]?.textContent?.trim() || field.name;
    setErrors((current) => ({
      ...current,
      [field.name]: isEnglish ? `Please fill in ${label}.` : `برجاء ملء ${label}`,
    }));
  };

  const handleInput = (event: FormEvent<HTMLFormElement>) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
    if (!field.value.trim()) return;

    setErrors((current) => {
      if (!(field.name in current)) return current;
      const next = { ...current };
      delete next[field.name];
      return next;
    });
  };

  return { errors, handleInvalid, handleInput };
}

function ServiceCard({
  number,
  title,
  description,
  details,
}: {
  number: string;
  title: string;
  description: string;
  details: string[];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(10,53,85,0.07)]">
      <div className="flex items-start gap-4 border-b border-slate-200 bg-[#f7f9fb] p-5 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a3555] text-lg font-black text-white">
          {number}
        </span>
        <h2 className="pt-1 text-lg font-extrabold leading-7 text-[#0a3555] sm:text-xl">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">
        <p className="leading-8 text-slate-700">{description}</p>
        <ul className="mt-4 grid gap-3">
          {details.map((detail) => (
            <li key={detail} className="flex gap-3 leading-7 text-slate-700">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#d7b05a]" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SampleRequestForm({ isEnglish }: { isEnglish: boolean }) {
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const { errors, handleInvalid, handleInput } = useRequiredFieldErrors(isEnglish);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const applicantName = String(formData.get('applicantName') ?? '').trim();
    const sampleCount = String(formData.get('sampleCount') ?? '').trim();
    const sampleType = String(formData.get('sampleType') ?? '').trim();
    const companyName = String(formData.get('companyName') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();

    const message = isEnglish
      ? [
        'To the Head of the Laboratory Sector,',
        'Assiut Water and Wastewater Company',
        'Greetings,',
        `Submitted by: ${applicantName}`,
        `Please examine ${sampleCount} ${sampleType} sample(s) for ${companyName}.`,
        `Location (address): ${address}`,
        'Please conduct the required analyses.',
        '*We are prepared to pay the applicable fees.*',
        'With sincere regards,',
        `Contact number: ${phone}`,
      ].join('\n\n')
      : [
        'السيد / رئيس قطاع المعامل -',
        'بشركة مياه الشرب والصرف الصحي بأسيوط',
        'تحية إعزاز وتقدير،،',
        `مقدمه لسيادتكم / ${applicantName}`,
        `الرجاء من سيادتكم التكرم بفحص عدد (${sampleCount}) عينة (${sampleType})`,
        `الخاصة بشركة ${companyName} وموقعها (العنوان) ${address}، وإجراء التحاليل اللازمة لها.`,
        '*ونحن على أتم الاستعداد لدفع الرسوم المقررة.*',
        'وتفضلوا بقبول وافر التحية والاحترام،،،',
        `مقدمه لسيادتكم / ${applicantName}`,
        `رقم للتواصل: ${phone}`,
      ].join('\n\n');

    const whatsappUrl = `https://wa.me/${LABORATORY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.assign(whatsappUrl);
  };

  const fieldClassName = 'mt-1.5 block min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20';
  const labelClassName = 'block text-sm font-bold text-slate-700';

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-extrabold leading-7 text-[#0a3555]">
        {t('طلب فحص وتحليل عينات', 'Sample Testing and Analysis Request')}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        {t('املأ بيانات الطلب، وستُفتح رسالة جاهزة في واتساب لمراجعتها ثم إرسالها.', 'Fill in the request details. A prepared WhatsApp message will open for you to review and send.')}
      </p>
      <form onSubmit={handleSubmit} onInvalidCapture={handleInvalid} onInputCapture={handleInput} onChangeCapture={handleInput} className="mt-5 flex flex-1 flex-col justify-between gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            {t('عدد العينات', 'Number of samples')}
            <input
              className={fieldClassName}
              name="sampleCount"
              type="text"
              inputMode="numeric"
              pattern="(?:[1-9]|[1-9][0-9])"
              title={t('أدخل رقمًا من 1 إلى 99.', 'Enter a number from 1 to 99.')}
              maxLength={2}
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 2);
              }}
              required
            />
            <FormFieldError message={errors.sampleCount} />
          </label>
          <label className={labelClassName}>
            {t('نوع العينة', 'Sample type')}
            <select className={fieldClassName} name="sampleType" defaultValue="" required>
              <option value="" disabled>{t('اختر نوع العينة', 'Select a sample type')}</option>
              <option value={t('مياه شرب', 'drinking water')}>{t('مياه شرب', 'Drinking water')}</option>
              <option value={t('صرف صحي', 'wastewater')}>{t('صرف صحي', 'Wastewater')}</option>
              <option value={t('زلط', 'gravel')}>{t('زلط', 'Gravel')}</option>
              <option value={t('رمل', 'sand')}>{t('رمل', 'Sand')}</option>
            </select>
            <FormFieldError message={errors.sampleType} />
          </label>
        </div>

        <label className={labelClassName}>
          {t('اسم الشركة', 'Company name')}
          <input
            className={fieldClassName}
            name="companyName"
            autoComplete="organization"
            pattern="(?=.*[\p{L}\p{N}])[\p{L}\p{N} ]{1,30}"
            title={t('أدخل اسم الشركة باستخدام الحروف والأرقام فقط، بحد أقصى 30 خانة.', 'Enter a company name using letters and numbers only, up to 30 characters.')}
            maxLength={30}
            required
          />
          <FormFieldError message={errors.companyName} />
        </label>

        <label className={labelClassName}>
          {t('موقع الشركة (العنوان)', 'Company location (address)')}
          <textarea
            className={`${fieldClassName} min-h-24 resize-y`}
            name="address"
            autoComplete="street-address"
            title={t('أدخل العنوان باستخدام الحروف والأرقام فقط، بحد أقصى 100 خانة.', 'Enter the address using letters and numbers only, up to 100 characters.')}
            maxLength={100}
            onInput={(event) => {
              const address = event.currentTarget.value;
              event.currentTarget.setCustomValidity(
                address && !isValidCompanyAddress(address)
                  ? t('استخدم الحروف والأرقام والمسافات فقط، بحد أقصى 100 خانة.', 'Use only letters, numbers, and spaces, up to 100 characters.')
                  : ''
              );
            }}
            required
          />
          <FormFieldError message={errors.address} />
        </label>

        <label className={labelClassName}>
          {t('رقم للتواصل', 'Contact number')}
          <input
            className={fieldClassName}
            name="phone"
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            pattern="[0-9]{11}"
            title={t('أدخل رقم هاتف مكوّنًا من 11 رقمًا.', 'Enter an 11-digit phone number.')}
            maxLength={11}
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 11);
            }}
            required
          />
          <FormFieldError message={errors.phone} />
        </label>

        <p className="rounded-lg border-r-4 border-[#d7b05a] bg-[#fbf8ef] px-4 py-3 font-bold leading-7 text-[#0a3555]">
          {t('ونحن على أتم الاستعداد لدفع الرسوم المقررة.', 'We are prepared to pay the applicable fees.')}
        </p>

        <label className={labelClassName}>
          {t('مقدمه لسيادتكم / أ', 'Submitted by / Mr./Ms.')}
          <input
            className={fieldClassName}
            name="applicantName"
            autoComplete="name"
            pattern="(?=.*\p{L})[\p{L} ]{5,50}"
            title={t('أدخل الاسم بالحروف والمسافات، من 5 إلى 50 حرفًا.', 'Enter a name using letters and spaces, 5 to 50 characters long.')}
            minLength={5}
            maxLength={50}
            required
          />
          <FormFieldError message={errors.applicantName} />
        </label>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0a7a57] px-5 py-3 font-bold text-white transition hover:bg-[#086447] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1687a7]"
        >
          {t('إرسال الطلب عبر واتساب', 'Send request via WhatsApp')}
        </button>
      </form>
    </section>
  );
}

function TankCleaningRequestForm({ isEnglish }: { isEnglish: boolean }) {
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const { errors, handleInvalid, handleInput } = useRequiredFieldErrors(isEnglish);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tankCount = String(formData.get('tankCount') ?? '').trim();
    const tankType = String(formData.get('tankType') ?? '').trim();
    const tankCapacity = String(formData.get('tankCapacity') ?? '').trim();
    const companyName = String(formData.get('tankCompanyName') ?? '').trim();
    const address = String(formData.get('tankAddress') ?? '').trim();
    const phone = String(formData.get('tankPhone') ?? '').trim();
    const applicantName = String(formData.get('tankApplicantName') ?? '').trim();

    const message = isEnglish
      ? [
        'To the Head of the Laboratory Sector,',
        'Assiut Water and Wastewater Company',
        'Greetings,',
        `Submitted by: ${applicantName}`,
        `Please clean, disinfect, and sterilize ${tankCount} ${tankType} tank(s).`,
        `Capacity of each tank: ${tankCapacity} cubic meters.`,
        `Company: ${companyName}`,
        `Location (address): ${address}`,
        '*We are prepared to pay the applicable fees.*',
        'With sincere regards,',
        `Contact number: ${phone}`,
      ].join('\n\n')
      : [
        'السيد / رئيس قطاع المعامل -',
        'بشركة مياه الشرب والصرف الصحي بأسيوط',
        'تحية إعزاز وتقدير،،',
        `مقدمه لسيادتكم / ${applicantName}`,
        `الرجاء من سيادتكم التكرم بغسيل وتعقيم وتطهير عدد (${tankCount}) خزان (${tankType})،`,
        `سعة الخزان الواحد (${tankCapacity}) متر مكعب، وموقعه (العنوان) ${address}.`,
        `الخاصة بشركة ${companyName}.`,
        'ونحن على أتم الاستعداد لدفع الرسوم المقررة.',
        'وتفضلوا بقبول وافر التحية والاحترام،،،',
        `مقدمه لسيادتكم / ${applicantName}`,
        `رقم للتواصل: ${phone}`,
      ].join('\n\n');

    const whatsappUrl = `https://wa.me/${LABORATORY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.assign(whatsappUrl);
  };

  const fieldClassName = 'mt-1.5 block min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20';
  const labelClassName = 'block text-sm font-bold text-slate-700';

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-extrabold leading-7 text-[#0a3555]">
        {t('طلب غسيل خزان', 'Tank Cleaning Request')}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        {t('املأ جميع البيانات، وستُفتح رسالة جاهزة في واتساب لمراجعتها ثم إرسالها.', 'Complete all fields. A prepared WhatsApp message will open for you to review and send.')}
      </p>
      <form onSubmit={handleSubmit} onInvalidCapture={handleInvalid} onInputCapture={handleInput} onChangeCapture={handleInput} className="mt-5 flex flex-1 flex-col justify-between gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            {t('عدد الخزانات', 'Number of tanks')}
            <input
              className={fieldClassName}
              name="tankCount"
              type="text"
              inputMode="numeric"
              pattern="(?:[1-9]|[1-9][0-9])"
              title={t('أدخل رقمًا من 1 إلى 99.', 'Enter a number from 1 to 99.')}
              maxLength={2}
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 2);
              }}
              required
            />
            <FormFieldError message={errors.tankCount} />
          </label>
          <label className={labelClassName}>
            {t('نوع الخزان', 'Tank type')}
            <select className={fieldClassName} name="tankType" defaultValue="" required>
              <option value="" disabled>{t('اختر نوع الخزان', 'Select a tank type')}</option>
              <option value={t('حكومي', 'government')}>{t('حكومي', 'Government')}</option>
              <option value={t('أهلي', 'residential')}>{t('أهلي', 'Residential')}</option>
            </select>
            <FormFieldError message={errors.tankType} />
          </label>
        </div>

        <label className={labelClassName}>
          {t('سعة الخزان الواحد (متر مكعب)', 'Capacity of each tank (cubic meters)')}
          <input
            className={fieldClassName}
            name="tankCapacity"
            type="number"
            min="0.01"
            step="any"
            inputMode="decimal"
            required
          />
          <FormFieldError message={errors.tankCapacity} />
        </label>

        <label className={labelClassName}>
          {t('اسم الشركة', 'Company name')}
          <input
            className={fieldClassName}
            name="tankCompanyName"
            autoComplete="organization"
            pattern="(?=.*[\p{L}\p{N}])[\p{L}\p{N} ]{1,30}"
            title={t('أدخل اسم الشركة باستخدام الحروف والأرقام فقط، بحد أقصى 30 خانة.', 'Enter a company name using letters and numbers only, up to 30 characters.')}
            maxLength={30}
            required
          />
          <FormFieldError message={errors.tankCompanyName} />
        </label>

        <label className={labelClassName}>
          {t('موقع الخزان (العنوان)', 'Tank location (address)')}
          <textarea
            className={`${fieldClassName} min-h-24 resize-y`}
            name="tankAddress"
            autoComplete="street-address"
            title={t('أدخل العنوان باستخدام الحروف والأرقام فقط، بحد أقصى 100 خانة.', 'Enter the address using letters and numbers only, up to 100 characters.')}
            maxLength={100}
            onInput={(event) => {
              const address = event.currentTarget.value;
              event.currentTarget.setCustomValidity(
                address && !isValidCompanyAddress(address)
                  ? t('استخدم الحروف والأرقام والمسافات فقط، بحد أقصى 100 خانة.', 'Use only letters, numbers, and spaces, up to 100 characters.')
                  : ''
              );
            }}
            required
          />
          <FormFieldError message={errors.tankAddress} />
        </label>

        <label className={labelClassName}>
          {t('رقم للتواصل', 'Contact number')}
          <input
            className={fieldClassName}
            name="tankPhone"
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            pattern="[0-9]{11}"
            title={t('أدخل رقم هاتف مكوّنًا من 11 رقمًا.', 'Enter an 11-digit phone number.')}
            maxLength={11}
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 11);
            }}
            required
          />
          <FormFieldError message={errors.tankPhone} />
        </label>

        <p className="rounded-lg border-r-4 border-[#d7b05a] bg-[#fbf8ef] px-4 py-3 font-bold leading-7 text-[#0a3555]">
          {t('ونحن على أتم الاستعداد لدفع الرسوم المقررة.', 'We are prepared to pay the applicable fees.')}
        </p>

        <label className={labelClassName}>
          {t('مقدمه لسيادتكم / أ', 'Submitted by / Mr./Ms.')}
          <input
            className={fieldClassName}
            name="tankApplicantName"
            autoComplete="name"
            pattern="(?=.*\p{L})[\p{L} ]{5,50}"
            title={t('أدخل الاسم بالحروف والمسافات، من 5 إلى 50 حرفًا.', 'Enter a name using letters and spaces, 5 to 50 characters long.')}
            minLength={5}
            maxLength={50}
            required
          />
          <FormFieldError message={errors.tankApplicantName} />
        </label>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0a7a57] px-5 py-3 font-bold text-white transition hover:bg-[#086447] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1687a7]"
        >
          {t('إرسال الطلب عبر واتساب', 'Send request via WhatsApp')}
        </button>
      </form>
    </section>
  );
}

function LaboratoriesSectorServicesPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

  const services = [
    {
      title: t('تحليل عينات مياه الشرب', 'Drinking Water Sample Analysis'),
      description: t(
        'استقبال العملاء واستلام عينات مياه الشرب الخارجية المدفوعة بأجر ضمن خدمة التشغيل لصالح الغير.',
        'Receive customers and paid external drinking water samples through the third-party laboratory service.'
      ),
      details: [
        t('إجراء التحاليل الكيميائية والبكتريولوجية والبيولوجية بالمعمل المركزي للشركة.', 'Conduct chemical, bacteriological, and biological analyses at the Company Central Laboratory.'),
        t('إعداد تقرير بنتائج تحليل العينة وتسليمه إلى الجهة المعنية.', 'Prepare a report of the sample analysis results and deliver it to the relevant party.'),
      ],
    },
    {
      title: t('تحليل عينات مياه الصرف الصحي', 'Wastewater Sample Analysis'),
      description: t(
        'استلام عينات الصرف الصحي الخارجية المدفوعة بأجر وتحليلها بمعامل الشركة.',
        'Receive and analyze paid external wastewater samples at company laboratories.'
      ),
      details: [
        t('إجراء التحاليل الكيميائية والبكتريولوجية بمعمل الصرف الصحي بعرب المدابغ.', 'Conduct chemical and bacteriological analyses at the Arab Al-Madabegh Wastewater Laboratory.'),
        t('إعداد تقرير بنتائج تحليل العينة وتسليمه إلى الجهة المعنية.', 'Prepare a report of the sample analysis results and deliver it to the relevant party.'),
      ],
    },
    {
      title: t('فحص عينات الرمل والزلط', 'Sand and Gravel Sample Testing'),
      description: t(
        'استلام عينات الرمل والزلط الخارجية المدفوعة بأجر وفحصها بالمعمل المركزي للشركة.',
        'Receive paid external sand and gravel samples for testing at the Company Central Laboratory.'
      ),
      details: [
        t('إعداد تقرير بنتائج الفحص وتسليمه إلى الجهة المعنية.', 'Prepare a report of the test results and deliver it to the relevant party.'),
      ],
    },
    {
      title: t('غسيل وتطهير الخزانات', 'Tank Cleaning and Disinfection'),
      description: t(
        'غسيل الخزانات الخارجية المدفوعة بأجر وتطهيرها وتعقيمها، سواء كانت أهلية أو حكومية.',
        'Wash, disinfect, and sterilize paid external tanks, whether residential or government-owned.'
      ),
      details: [
        t('إعداد محضر بأعمال الغسيل والتطهير.', 'Prepare a record of the cleaning and disinfection work.'),
        t('إمكانية سحب عينات من الخزان بعد انتهاء الغسيل.', 'Samples may be collected from the tank after cleaning is complete.'),
      ],
    },
  ];

  return (
    <>
      <Header />
      <main
        dir={isEnglish ? 'ltr' : 'rtl'}
        className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]"
      >
        <div className="container mx-auto max-w-7xl space-y-7 px-4 py-8 md:py-10">
          <section className="relative overflow-hidden rounded-2xl bg-[#0a3555] px-5 py-9 text-center shadow-[0_18px_45px_rgba(10,53,85,0.18)] sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[#d7b05a]" aria-hidden="true" />
            <p className="font-bold text-[#e7c875]">{t('قطاع المعامل وضبط الجودة', 'Laboratory and Quality Control Sector')}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">
              {t('خدمات قطاع المعامل', 'Laboratory Sector Services')}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-white/85 sm:text-lg">
              {t(
                'خدمات فحص وتحليل العينات وغسيل الخزانات التي يقدمها قطاع المعامل.',
                'Sample testing, analysis, and tank cleaning services provided by the Laboratory Sector.'
              )}
            </p>
          </section>

          <section aria-label={t('الخدمات وطلبات الخدمة', 'Services and service requests')} className="space-y-7">
            <div>
              <h2 className="text-2xl font-black leading-8 text-[#0a3555]">
                {t('بيانات طلب الخدمة', 'Service Request Details')}
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {t(
                  'يرجى تجهيز البيانات التالية عند تقديم طلب تحليل العينات أو غسيل الخزانات.',
                  'Please prepare the following details when requesting sample analysis or tank cleaning.'
                )}
              </p>
            </div>

            <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <SampleRequestForm isEnglish={isEnglish} />
              <div className="grid gap-5">
                {services.slice(0, 3).map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    number={String(index + 1).padStart(2, '0')}
                    title={service.title}
                    description={service.description}
                    details={service.details}
                  />
                ))}
              </div>
            </div>

            <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <TankCleaningRequestForm isEnglish={isEnglish} />
              <ServiceCard
                number="04"
                title={services[3].title}
                description={services[3].description}
                details={services[3].details}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#d7b05a]/50 bg-[#fbf8ef] p-5 sm:p-7">
            <h2 className="text-xl font-extrabold leading-8 text-[#0a3555]">
              {t('للاستفسار والتواصل', 'Contact and Inquiries')}
            </h2>
            <p className="mt-2 leading-7 text-slate-700">
              {t('تُقدم الخدمات الخارجية بأجر وفق الرسوم المقررة. للتواصل مع قطاع المعامل:', 'External services are provided for a fee according to the applicable rates. Contact the Laboratory Sector:')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="tel:01280002087"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0a3555] px-5 py-3 font-bold text-white transition hover:bg-[#082b47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1687a7]"
              >
                {t('اتصل: 01280002087', 'Call: 01280002087')}
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LaboratoriesSectorServicesPage;
