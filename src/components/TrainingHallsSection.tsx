import { useCallback, useEffect, useState } from 'react';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type LocalizedText = { ar: string; en: string };
type TrainingHall = { id: string; image: string; title: LocalizedText; alt: LocalizedText; description: LocalizedText };
type BookingFormData = {
  companyName: string;
  activityType: string;
  phone: string;
  commercialRegister: string;
  contactName: string;
  date: string;
  time: string;
  period: 'صباحًا' | 'مساءً';
  hallType: string;
  invoice: 'نعم' | 'لا';
  taxNumber: string;
};

const hallFeatures: LocalizedText[] = [
  { ar: 'شاشة عرض ( Projector ( smart board ))', en: 'Display screen (Projector / smart board).' },
  { ar: 'جهاز كبيوتر ( pc )', en: 'Computer (PC).' },
  { ar: 'ميكرفون ( Sound system )', en: 'Microphone (sound system).' },
  { ar: 'كاميرا ( Video cam )', en: 'Video camera.' },
  { ar: 'أدوات مساعدات تدريبيه', en: 'Training aids.' },
  { ar: 'سبوره بيضاء ( White board )', en: 'White board.' },
  { ar: 'قلم سبوره ( penboard )', en: 'Whiteboard marker.' },
  { ar: 'حقيبه أدوات التدريب ( Training tools bag )', en: 'Training tools bag.' },
];

const trainingHalls: TrainingHall[] = [
  { id: 'hall-1', image: '/images/training/47.webp', title: { ar: 'قاعة رقم ( 1 )', en: 'Hall No. (1)' }, alt: { ar: 'قاعة رقم 1', en: 'Hall 1' }, description: { ar: 'لعقد ورش عمل تسع 30 فرد مجهزه بأحدث الأجهزه.', en: 'A workshop hall for 30 participants equipped with the latest devices.' } },
  { id: 'hall-2', image: '/images/training/48.webp', title: { ar: 'قاعة رقم ( 2 )', en: 'Hall No. (2)' }, alt: { ar: 'قاعة رقم 2', en: 'Hall 2' }, description: { ar: 'قاعة محاضرات تسع 50 متدريب مجهزه بأحدث الأجهزه.', en: 'A lecture hall for 50 trainees equipped with the latest devices.' } },
  { id: 'hall-3', image: '/images/training/49.webp', title: { ar: 'قاعة رقم ( 3 )', en: 'Hall No. (3)' }, alt: { ar: 'قاعة رقم 3', en: 'Hall 3' }, description: { ar: 'قاعه التعليم الاَلكتروني تسع 20 متدرب مجهزه بأحدث الأجهزه.', en: 'An e-learning hall for 20 trainees equipped with the latest devices.' } },
  { id: 'hall-4', image: '/images/training/50.webp', title: { ar: 'قاعة رقم ( 4 )', en: 'Hall No. (4)' }, alt: { ar: 'قاعة رقم 4', en: 'Hall 4' }, description: { ar: 'قاعة إجتماعات (U-SHAPE) تسع 30 متدرب مجهزه بأحدث الأجهزه.', en: 'A U-shape meeting hall for 30 trainees equipped with the latest devices.' } },
];

const sectionTitle: LocalizedText = { ar: 'قاعات التدريب', en: 'Training Halls' };
const sectionDescription: LocalizedText = {
  ar: 'يوجد لدينا قاعات تدريب بشركه مياه أسيوط والصرف الصحي متاح الاستعلام والحجز من أي جهه داخل أو خارج الشركة.',
  en: 'We offer training halls at Assiut Water and Wastewater Company, and they are available for inquiry and booking by entities inside or outside the company.',
};

export function TrainingHallsIntro() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = useCallback((text: LocalizedText) => (isEnglish ? text.en : text.ar), [isEnglish]);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 ${textAlignmentClass}`}>
      <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t(sectionTitle)}</h1>
      <div className="mt-2 text-sm leading-7 text-slate-700">
        <p className="text-base font-semibold leading-7">{t(sectionDescription)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1170b0]/10 px-3 py-1 font-bold text-[#1170b0]">📞 0882334346</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0a3555]/10 px-3 py-1 font-bold text-[#0a3555]">📱 01280733381</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">
            {t({ ar: 'وسائل التواصل', en: 'Social links' })}
            <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label={t({ ar: 'فيسبوك', en: 'Facebook' })} className="text-[#1877f2]">Facebook</a>
            <a href="https://api.whatsapp.com/send?phone=201281565653" target="_blank" rel="noopener noreferrer" aria-label={t({ ar: 'واتساب', en: 'WhatsApp' })} className="text-[#25d366]">WhatsApp</a>
          </span>
        </div>
      </div>
    </section>
  );
}

function TrainingHallsSection({ showIntro = true }: { showIntro?: boolean }) {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = useCallback((text: LocalizedText) => (isEnglish ? text.en : text.ar), [isEnglish]);
  const [openedHallImage, setOpenedHallImage] = useState<{ src: string; alt: string } | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    companyName: '',
    activityType: '',
    phone: '',
    commercialRegister: '',
    contactName: '',
    date: '',
    time: '',
    period: 'صباحًا',
    hallType: '',
    invoice: 'لا',
    taxNumber: '',
  });
  const [showBookingValidation, setShowBookingValidation] = useState(false);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const hallFeaturesPaddingClass = isEnglish ? 'pl-0 pr-2' : 'pl-2 pr-0';
  const hallFeaturesIconSpacingClass = isEnglish ? 'mr-2' : 'ml-2';
  const hallFeatureIcons = ['📽️', '🖥️', '🎤', '📹', '🧰', '🧾', '✍️', '🎒'] as const;

  const updateBookingData = <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
    setBookingData((current) => ({ ...current, [field]: value }));
  };

  const isBookingFieldEmpty = (field: keyof BookingFormData) => {
    const value = bookingData[field];
    return typeof value === 'string' && !value.trim();
  };

  const handleBookingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowBookingValidation(true);
    const requiredFields: Array<{ value: string; label: string }> = [
      { value: bookingData.companyName.trim(), label: 'اسم الشركة' },
      { value: bookingData.activityType.trim(), label: 'نوع النشاط' },
      { value: bookingData.phone.trim(), label: 'رقم الهاتف' },
      { value: bookingData.contactName.trim(), label: 'اسم مسؤول التواصل' },
      { value: bookingData.date, label: 'التاريخ' },
      { value: bookingData.time, label: 'الساعة' },
      { value: bookingData.hallType, label: 'نوع القاعة' },
    ];
    if (bookingData.invoice === 'نعم') {
      requiredFields.push({ value: bookingData.taxNumber.trim(), label: 'الرقم الضريبي' });
    }

    const emptyField = requiredFields.find((field) => !field.value);
    if (emptyField) {
      return;
    }

    if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(bookingData.time)) {
      return;
    }

    const timeWithoutSeconds = bookingData.time.split(':').slice(0, 2).join(':');
    const message = [
      'طلب حجز قاعة تدريب',
      `اسم الشركة: ${bookingData.companyName}`,
      `نوع النشاط: ${bookingData.activityType}`,
      `رقم الهاتف: ${bookingData.phone}`,
      ...(bookingData.commercialRegister.trim() ? [`السجل التجاري: ${bookingData.commercialRegister}`] : []),
      `اسم مسؤول التواصل: ${bookingData.contactName}`,
      `التاريخ: ${bookingData.date}`,
      `الساعة: ${timeWithoutSeconds} ${bookingData.period}`,
      `نوع القاعة: ${bookingData.hallType}`,
      `فاتورة إلكترونية: ${bookingData.invoice}`,
      ...(bookingData.invoice === 'نعم' ? [`الرقم الضريبي: ${bookingData.taxNumber}`] : []),
    ].join('\n');

    window.open(`https://wa.me/201067006714?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!openedHallImage) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedHallImage(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openedHallImage]);

  return (
    <>
      {showIntro ? <TrainingHallsIntro /> : null}

      {trainingHalls.map((hall, hallIndex) => (
        <section key={hall.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-stretch">
            <button type="button" onClick={() => setOpenedHallImage({ src: hall.image, alt: t(hall.alt) })} className="group relative h-[240px] cursor-zoom-in overflow-hidden rounded-3xl sm:h-[300px] lg:h-full" aria-label={t({ ar: `تكبير صورة ${hall.alt.ar}`, en: `Open ${hall.alt.en} image` })}>
              <img decoding="async" src={hall.image} alt={t(hall.alt)} loading="lazy" className="h-full w-full rounded-3xl object-cover transition duration-300 group-hover:scale-[1.02]" />
            </button>
            <div className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700 lg:h-full lg:overflow-hidden xl:p-4 ${textAlignmentClass}`}>
              <h2 className="text-xl font-extrabold text-[#0a3555]">{t(hall.title)}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">📞 0882334346</p>
              <p className="mt-3 leading-7">{t(hall.description)}</p>
              <ul className={`mt-4 space-y-2 text-sm leading-7 ${hallFeaturesPaddingClass}`}>
                {hallFeatures.map((feature, featureIndex) => (
                  <li key={`${hall.id}-${feature.ar}`}><span className={`${hallFeaturesIconSpacingClass} inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm`}>{hallFeatureIcons[featureIndex % hallFeatureIcons.length]}</span>{t(feature)}</li>
                ))}
              </ul>
              <div className="mt-4 rounded-2xl border border-dashed border-[#1170b0]/25 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600">{t({ ar: `القاعة رقم ${hallIndex + 1} متاحة للحجز والاستعلام عبر إدارة التدريب.`, en: `Hall ${hallIndex + 1} is available for booking and inquiry through the training administration.` })}</div>
            </div>
          </div>
        </section>
      ))}

      <section className={`rounded-3xl border border-[#1170b0]/20 bg-white p-5 shadow-sm sm:p-6 ${textAlignmentClass}`}>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-[#0a3555] sm:text-3xl">{t({ ar: 'طلب حجز قاعة تدريب', en: 'Training Hall Booking Request' })}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{t({ ar: 'املأ البيانات التالية وسيتم إرسال الطلب مباشرة إلى واتساب إدارة الحجز.', en: 'Fill in the details below and the request will be sent directly to the booking administration WhatsApp.' })}</p>
        </div>
        <form noValidate onSubmit={handleBookingSubmit} className="grid gap-4 md:grid-cols-2">
          {[
            ['companyName', 'اسم الشركة', 'Company name'],
            ['activityType', 'نوع النشاط', 'Activity type'],
            ['phone', 'رقم الهاتف', 'Phone number'],
            ['commercialRegister', 'السجل التجاري', 'Commercial register'],
            ['contactName', 'اسم مسؤول التواصل', 'Contact person name'],
          ].map(([field, label, englishLabel]) => (
            <label key={field} className="block text-sm font-bold text-slate-700">
              {t({ ar: label, en: englishLabel })}{field !== 'commercialRegister' ? <span className="text-red-600" aria-hidden="true">*</span> : null}
              <input
                required={field !== 'commercialRegister'}
                type={field === 'phone' ? 'tel' : 'text'}
                value={bookingData[field as keyof BookingFormData] as string}
                onChange={(event) => updateBookingData(field as keyof BookingFormData, event.target.value as never)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15"
              />
              {showBookingValidation && field !== 'commercialRegister' && isBookingFieldEmpty(field as keyof BookingFormData) ? <span className="mt-1 block text-xs font-bold text-red-600">{`برجاء إدخال ${label}`}</span> : null}
              {field === 'commercialRegister' && !bookingData.commercialRegister.trim() ? (
                <span className="mt-1 block text-xs font-semibold text-slate-500">{t({ ar: 'يمكن ترك هذا الحقل فارغًا وإرسال الطلب.', en: 'This field is optional and can be left empty.' })}</span>
              ) : null}
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-700">
            {t({ ar: 'التاريخ', en: 'Date' })} <span className="text-red-600" aria-hidden="true">*</span>
            <input required type="date" value={bookingData.date} onChange={(event) => updateBookingData('date', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15" />
            {showBookingValidation && isBookingFieldEmpty('date') ? <span className="mt-1 block text-xs font-bold text-red-600">برجاء إدخال التاريخ</span> : null}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-slate-700">
              {t({ ar: 'الساعة', en: 'Time' })} <span className="text-red-600" aria-hidden="true">*</span>
              <span className="relative mt-2 block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1170b0]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                  placeholder="00:00"
                  value={bookingData.time}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                    const formattedTime = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
                    updateBookingData('time', formattedTime);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 font-normal outline-none transition focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15"
                />
              </span>
              {showBookingValidation && isBookingFieldEmpty('time') ? <span className="mt-1 block text-xs font-bold text-red-600">برجاء إدخال الساعة</span> : null}
              {showBookingValidation && bookingData.time && !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(bookingData.time) ? <span className="mt-1 block text-xs font-bold text-red-600">برجاء إدخال الساعة بصيغة HH:MM</span> : null}
            </label>
            <label className="block text-sm font-bold text-slate-700">
              {t({ ar: 'الفترة', en: 'Period' })} <span className="text-red-600" aria-hidden="true">*</span>
              <select value={bookingData.period} onChange={(event) => updateBookingData('period', event.target.value as BookingFormData['period'])} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15">
                <option value="صباحًا">{t({ ar: 'صباحًا', en: 'Morning' })}</option>
                <option value="مساءً">{t({ ar: 'مساءً', en: 'Evening' })}</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold text-slate-700">
            {t({ ar: 'نوع القاعة', en: 'Hall type' })} <span className="text-red-600" aria-hidden="true">*</span>
            <select required value={bookingData.hallType} onChange={(event) => updateBookingData('hallType', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15">
              <option value="">{t({ ar: 'اختر القاعة', en: 'Select a hall' })}</option>
              {trainingHalls.map((hall) => <option key={hall.id} value={t(hall.title)}>{t(hall.title)}</option>)}
            </select>
            {showBookingValidation && isBookingFieldEmpty('hallType') ? <span className="mt-1 block text-xs font-bold text-red-600">برجاء إدخال نوع القاعة</span> : null}
          </label>
          <label className="block text-sm font-bold text-slate-700">
            {t({ ar: 'هل تريد فاتورة إلكترونية؟', en: 'Do you need an electronic invoice?' })} <span className="text-red-600" aria-hidden="true">*</span>
            <span className="mr-1 text-xs font-semibold text-red-600">{t({ ar: '(عند اختيار نعم يجب إدخال الرقم الضريبي)', en: '(Selecting yes requires a tax number)' })}</span>
            <select value={bookingData.invoice} onChange={(event) => updateBookingData('invoice', event.target.value as BookingFormData['invoice'])} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15">
              <option value="لا">{t({ ar: 'لا', en: 'No' })}</option>
              <option value="نعم">{t({ ar: 'نعم', en: 'Yes' })}</option>
            </select>
          </label>
          {bookingData.invoice === 'نعم' ? (
            <label className="block text-sm font-bold text-slate-700">
              {t({ ar: 'الرقم الضريبي', en: 'Tax number' })} <span className="text-red-600" aria-hidden="true">*</span>
              <input required value={bookingData.taxNumber} onChange={(event) => updateBookingData('taxNumber', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#1170b0] focus:ring-2 focus:ring-[#1170b0]/15" />
              {showBookingValidation && isBookingFieldEmpty('taxNumber') ? <span className="mt-1 block text-xs font-bold text-red-600">برجاء إدخال الرقم الضريبي</span> : null}
            </label>
          ) : null}
          <div className="md:col-span-2 flex justify-start">
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-[#1da851]">
              <span aria-hidden="true">WhatsApp</span>
              {t({ ar: 'إرسال طلب الحجز', en: 'Send booking request' })}
            </button>
          </div>
        </form>
      </section>

      {openedHallImage ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setOpenedHallImage(null)}>
          <div className="relative w-full max-w-[92vw] overflow-hidden rounded-xl border border-white/15 bg-slate-950" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={openedHallImage.alt}>
            <button type="button" onClick={() => setOpenedHallImage(null)} className={`absolute top-3 z-10 rounded-lg bg-black/60 px-3 py-1 text-sm font-bold text-white transition hover:bg-black/80 ${isEnglish ? 'right-3' : 'left-3'}`}>{t({ ar: 'إغلاق', en: 'Close' })}</button>
            <img loading="lazy" decoding="async" src={openedHallImage.src} alt={openedHallImage.alt} className="max-h-[82vh] w-full object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TrainingHallsSection;