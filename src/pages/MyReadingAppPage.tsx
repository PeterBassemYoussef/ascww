import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

function MyReadingAppPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const appImageSrc = isEnglish ? '/images/services/readmeEN.webp' : '/images/services/readme.webp';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const listPaddingClass = isEnglish ? 'pl-6' : 'pr-6';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_55%)] py-10" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <h1 className={`text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl ${textAlignmentClass}`}>{t('تطبيق قراءتي', 'My Reading App')}</h1>
            </div>

            <div className="space-y-10 px-6 py-8 text-slate-800 sm:px-8">
              <section className="space-y-6">
                <figure className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                  <img
                    src={appImageSrc}
                    alt={t('تطبيق قراءتي', 'My Reading app')}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className={`space-y-4 break-words leading-8 ${textAlignmentClass}`}>
                  <p>
                    {t(
                      'خدمات عدة، تقدمها الشركة القابضة لمياه الشرب والصرف الصحى، للمواطنين، وذلك لتوفير كل سبل التواصل بين الشركة بجميع فروعها داخل المحافظات والمواطنين.',
                      'The Holding Company for Water and Wastewater provides several services to citizens to ensure smooth communication between the company, its branches in all governorates, and the public.'
                    )}
                  </p>
                  <p>
                    {t(
                      'ومن ضمن تلك الخدمات، أتاحت الشركة القابضة لمياه الشرب والصرف الصحى، تطبيق «قراءتى»، والذى يتيح للمواطن تسجيل قراءة العداد بنفسه، وإضافة صورة العداد وهو ما يضمن دقة القراءة، على أن ترسل القراءات من يوم 1 إلى 15 من كل شهر وذلك لكل الشركات التابعة للشركة القابضة.',
                      'Among these services, the Holding Company introduced the "My Reading" app, which allows citizens to register the meter reading themselves and add a photo of the meter, ensuring accurate readings. Readings can be submitted from the 1st to the 15th of each month for all affiliated companies.'
                    )}
                  </p>
                  <p>
                    {t(
                      'وذلك وفقا لما نشرته الشركة القابضة لمياه الشرب والصرف الصحى على الصفحة الرسمية لها.',
                      'This is according to what the Holding Company for Water and Wastewater published on its official page.'
                    )}
                  </p>
                  <p>
                    {t(
                      'ويسمح تطبيق «قراءتي» لتسجيل قراءة عدادات المياه الخاصة للمواطنين عبر الهاتف، كأحد الإجراءات الاحترازية التي انتهجتها الشركة لمواجهة فيروس كورونا المستجد.',
                      'The "My Reading" app allows citizens to record water meter readings by phone as one of the precautionary measures adopted by the company to address the spread of the coronavirus.'
                    )}
                  </p>
                  <p>
                    {t(
                      'أى يتيح هذا التطبيق للمواطن تسجيل قراءة العداد بنفسه، وإبلاغ القراءات، وذلك لكل الشركات التابعة بمختلف محافظات الجمهورية.',
                      'This means the app enables citizens to submit their own meter readings for all affiliated companies across the governorates of Egypt.'
                    )}
                  </p>
                  <p>
                    {t(
                      'ويمكن للمواطن تحميل التطبيق من خلال Google play مجانًا.',
                      'Citizens can download the app for free through Google Play.'
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="https://apps.apple.com/eg/app/%D9%A1%D9%A2%D9%A5/id1431089961"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('تحميل تطبيق قراءتي من متجر App Store', 'Download My Reading app from the App Store')}
                      className="transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                      <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt={t('تحميل من App Store', 'Download on the App Store')}
                        className="block h-16 w-[210px] max-w-full object-contain sm:h-20 sm:w-[240px]"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.hcww.it.myreading"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('تحميل تطبيق قراءتي من متجر Google Play', 'Download My Reading app from Google Play')}
                      className="transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                      <img
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt={t('تحميل من Google Play', 'Get it on Google Play')}
                        className="block h-[80px] w-[250px] max-w-full object-contain sm:h-[110px] sm:w-[320px]"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  </div>
                  <p>
                    {t(
                      'وخلال السطور التالية، تستعرض «الوطن» كيفية استخدام تطبيق «قراءتي»:.',
                      'The following points explain how to use the "My Reading" app.'
                    )}
                  </p>
                  <ul className={`list-disc space-y-3 leading-8 ${listPaddingClass}`}>
                    <li>
                      {t(
                        'يحتاج الدخول لأول مرة تسجيل العميل لبياناته الموجودة على فاتورة المياه مثل اسم المشترك ورقم الاشتراك واختيار الشركة التابع لها ورقم الهاتف وتعيين كلمة مرور ثم إعادة إدخالها مرة أخرى.',
                        'On first use, the customer needs to register the information shown on the water bill, such as subscriber name, subscription number, affiliated company, phone number, and password confirmation.'
                      )}
                    </li>
                  </ul>
                  <p>
                    {t(
                      'يمكن تسجيل أكثر من عداد للعميل ويتيح البرنامج أيضًا للعميل ميزة الاستعلام عن آخر قراءة قام العميل بإدخالها.',
                      'More than one meter can be registered for the same customer, and the app also allows the customer to check the last reading they entered.'
                    )}
                  </p>
                  <p>
                    {t(
                      'يستطيع العميل تسجيل العميل للقراءة الخاصة به في الخانة المخصصة للقراءة الحالية على التطبيق..',
                      'The customer can enter their current meter reading in the designated field inside the app.'
                    )}
                  </p>
                  <p>
                    {t(
                      'كما يتيح للعميل إضافة صورة العداد وهو ما يضمن لك أن تكون القراءة دقيقة بنسبة 100%.',
                      'The app also allows the customer to upload a photo of the meter, which helps ensure the reading is fully accurate.'
                    )}
                  </p>
                  <p>
                    {t(
                      'ليس ذلك فقط بل تقوم الشركة القابضة لمياه الشرب والصرف الصحى، برفع حالة الطوارئ، داخل جميع شركات المياه بالمحافظات، عند حدوث موجة من التقلبات الجوية، وسقوط كميات كبيرة من مياه الأمطار، من خلال اتخاذ كل التدابير لسحب تجمعات مياه الأمطار، تجنبًا لحدوث أي أضرار أو تعطل في الحركة المرورية داخل المناطق والطرق على مستوى الجمهورية.',
                      'In addition, the Holding Company for Water and Wastewater raises the state of readiness across all water companies in the governorates during severe weather and heavy rainfall, taking all necessary measures to remove rainwater accumulations and avoid damage or traffic disruption.'
                    )}
                  </p>
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

export default MyReadingAppPage;
