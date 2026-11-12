import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const IMAGE_URL = '/images/safety-guidelines/Safety-guidelines.webp';

function CyberSecurityGuidelinesPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const textAlignmentClass = isEnglish ? 'text-left' : 'text-right';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const contentOrderClass = 'md:order-1';
  const figureOrderClass = 'md:order-2';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_48%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8`}>
              <div className="hidden">
                {t('التوعية والاتصال', 'Awareness and Communication')}
              </div>
              <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">{t('ارشادات الامن السيبرانى', 'Cybersecurity Guidelines')}</h1>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="mx-auto flex flex-col gap-6 sm:max-w-5xl md:flex-row md:items-start">
                <div className={`min-w-0 flex-1 space-y-4 break-words text-base leading-8 text-slate-700 ${textAlignmentClass} ${contentOrderClass}`}>
                  <h2 className="text-lg font-extrabold text-[#0a3555]">{t('دليل سياسات وإرشادات الأمن السيبراني', 'Cybersecurity Policies and Guidelines Guide')}</h2>
                  <p>
                    {t(
                      'يُعد الأمن السيبراني عنصرًا أساسيًا لحماية البيانات والمعلومات من الاختراق والتهديدات الرقمية المتزايدة.',
                      'Cybersecurity is an essential element in protecting data and information from breaches and growing digital threats.'
                    )}
                  </p>
                  <p>
                    {t(
                      'اتباع الإرشادات الصحيحة مثل استخدام كلمات مرور قوية وتحديث الأنظمة بشكل مستمر يساهم في تقليل المخاطر.',
                      'Following proper guidance such as using strong passwords and continuously updating systems helps reduce risks.'
                    )}
                  </p>
                  <p>
                    {t(
                      'كما يساعد الوعي الأمني وتجنب الروابط المشبوهة في حماية المستخدمين من الهجمات الإلكترونية.',
                      'Security awareness and avoiding suspicious links also help protect users from cyberattacks.'
                    )}
                  </p>
                  <p>
                    {t(
                      'الالتزام بسياسات الأمن السيبراني يعزز الثقة ويضمن بيئة رقمية آمنة ومستقرة للجميع.',
                      'Compliance with cybersecurity policies strengthens trust and ensures a safe and stable digital environment for everyone.'
                    )}
                  </p>
                </div>
                <figure className={`mx-auto w-full max-w-[32rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:mx-0 md:w-[44%] ${figureOrderClass}`}>
                  <img
                    src={IMAGE_URL}
                    alt={t('إرشادات الأمن السيبراني', 'Cybersecurity guidelines')}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-contain"
                  />
                </figure>
              </div>
              <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
                <article className={`flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${textAlignmentClass}`}>
                  <header className="border-b border-[#d7b05a]/50 pb-4">
                    <h2 className="text-xl font-black text-[#0a3555]">{t('اشتراطات أمن المعلومات والأمن السيبراني', 'Information Security and Cybersecurity Requirements')}</h2>
                  </header>
                  <div className={`mt-5 flex flex-1 flex-col justify-between text-slate-700 ${isEnglish ? 'gap-5 text-[15px] leading-[2.15]' : 'gap-6 text-[15px] leading-[2.05]'} ${textAlignmentClass}`}>
                    <p>
                      {t(
                        'بالإشارة إلى ما ورد من الأمانة العامة لرئاسة مجلس الوزراء ضمن كتابها الدوري رقم 2494 - 10 بتاريخ 27 / 1 / 2026 والذي يخص التوجيه بالمحافظة على سلامة وأمن الدولة وحفظ كيان نظامها السياسي وأمن الجهاز الإداري والهيئات والإدارات والمؤسسات العامة ومدى الالتزام باشتراطات أمن المعلومات والأمن السيبراني، حيث أنه انتشر في الآونة الأخيرة رسائل على مواقع التواصل الاجتماعي منسوبة لجهة رسمية والتى تم إرسالها لعدد من الموظفين ببعض الوزارات والهيئات بزعم دعوتهم لحضور اجتماع رسمي "أون لاين" وطلب تسجيل بياناتهم الشخصية عبر روابط إلكترونية وهي رسائل وهمية لا تمت بأي صلة لتلك الجهة.',
                        'Reference is made to Circular No. 2494-10 issued by the General Secretariat of the Council of Ministers on 27/1/2026, concerning directives to preserve the safety and security of the state, safeguard the political system, and maintain the security of the administrative apparatus, bodies, departments, and public institutions, as well as compliance with information security and cybersecurity requirements. Recently, fraudulent messages purporting to be from an official entity have been circulated on social media and sent to employees in some ministries and government bodies, claiming to invite them to attend an official online meeting and requesting their personal details through electronic links. These messages are fraudulent and have no connection to that entity.'
                      )}
                    </p>
                    <div>
                      <h3 className="font-black text-[#0a3555]">{t('وقد تم توصيف الرسائل الزائفة كالتالي:', 'The fraudulent messages are described as follows:')}</h3>
                      <ul className={`mt-3 list-disc ps-6 marker:text-[#d7b05a] ${isEnglish ? 'space-y-4' : 'space-y-3'}`}>
                        <li>{t('تأتي الرسائل الزائفة عادة من رقم مجهول.', 'Fraudulent messages usually come from an unknown number.')}</li>
                        <li>{t('التنكر: يتنكر المهاجم فيها كمؤسسة موثوق بها أو مسؤول بجهة حكومية.', 'Impersonation: the attacker pretends to be a trusted organization or a responsible official at a government entity.')}</li>
                        <li>{t('الإغراء والتهديد: مثل عروض مغرية أو تحذيرات أمنية.', 'Enticement or threats, such as attractive offers or security warnings.')}</li>
                        <li>{t('الروابط أو المرفقات الخبيثة: تحتوي على روابط أو مرفقات تهدف إلى سرقة المعلومات.', 'Malicious links or attachments that aim to steal information.')}</li>
                        <li>{t('الطلبات غير المتوقعة: معلومات عن المؤسسة أو شخصية أو مالية دون سبب واضح.', 'Unexpected requests for institutional, personal, or financial information without a clear reason.')}</li>
                        <li>{t('الضغط المستمر من الراسل لاتخاذ إجراء سريع (التصرف دون تفكير).', 'Persistent pressure from the sender to act quickly without thinking.')}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-black text-[#0a3555]">{t('وقد وجهت الأمانة العامة لرئاسة مجلس الوزراء بضرورة اتخاذ التدابير والإجراءات التالية:', 'The General Secretariat of the Council of Ministers directed the following measures and procedures:')}</h3>
                      <ul className={`mt-3 list-disc ps-6 marker:text-[#d7b05a] ${isEnglish ? 'space-y-4' : 'space-y-3'}`}>
                        <li>{t('الحذر الشديد من التفاعل مع هذه الرسائل أو فتح أي روابط مرفقة بها كونها رسائل تستهدف الاحتيال وسرقة البيانات الشخصية أو المالية، من خلال مطالبة المتلقين بسرعة الرد أو الضغط على روابط إلكترونية خبيثة.', 'Be extremely cautious when interacting with these messages or opening attached links, as they aim to commit fraud and steal personal or financial data by urging recipients to reply quickly or click malicious links.')}</li>
                        <li>{t('التأكد من هوية المرسل من تلك الرسائل قبل الرد على أي مطالب.', 'Verify the identity of the sender before responding to any request.')}</li>
                        <li>{t('حظر تداول المعلومات الخاصة بالعمل عبر تطبيقات وسائل التواصل الاجتماعي.', 'Prohibit sharing work-related information through social media applications.')}</li>
                        <li>{t('الإبلاغ الفوري لمسئولي ومديري قطاعات الأمن بالجهات المعنية عن أية شكوك أو مخالفات لدى العاملين بشأن الموضوعات عالية.', 'Immediately report any suspicions or violations by employees concerning the above-mentioned matters to the responsible security officials and managers at the relevant entities.')}</li>
                      </ul>
                    </div>
                  </div>
                </article>

                <article className={`min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${textAlignmentClass}`}>
                  <header className="border-b border-[#d7b05a]/50 pb-4">
                    <h2 className="text-xl font-black text-[#0a3555]">{t('دليل سياسات وإرشادات الأمن السيبراني', 'Cybersecurity Policies and Guidelines Guide')}</h2>
                  </header>
                  <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-700">
                    <p>
                      {t(
                        'يهدف هذا الدليل إلى توعية جميع العاملين بالجهاز الإداري بأهمية الأمن السيبراني، وتطبيق أفضل الممارسات والإجراءات لحماية الأنظمة والبيانات والمعلومات الحساسة من أي تهديدات أو اختراقات محتملة.',
                        'This guide aims to raise awareness among administrative employees about cybersecurity and promote best practices for protecting systems, data, and sensitive information from potential threats or breaches.'
                      )}
                    </p>
                    <ol className="space-y-4 marker:font-black marker:text-[#0a3555]" style={{ listStyleType: 'arabic-indic' }}>
                      <li className="ps-1">
                        <h3 className="font-black text-[#0a3555]">{t('السياسات العامة للأمن السيبراني:', 'General cybersecurity policies:')}</h3>
                        <ul className="mt-1 list-disc space-y-2 ps-6 marker:text-[#d7b05a]">
                          <li>{t('الحفاظ على سرية المعلومات والبيانات وعدم مشاركتها مع غير المخولين.', 'Keep information and data confidential and do not share them with unauthorized persons.')}</li>
                          <li>{t('عدم مشاركة كلمات المرور أو أي بيانات دخول خاصة بالحسابات الرسمية.', 'Do not share passwords or login credentials for official accounts.')}</li>
                          <li>{t('الالتزام بالتحديثات الأمنية للأنظمة والبرمجيات بشكل دوري بالتنسيق مع الإدارة العامة لتكنولوجيا المعلومات.', 'Apply security updates to systems and software periodically in coordination with the General Administration of Information Technology.')}</li>
                          <li>{t('استخدام البريد الإلكتروني والإنترنت في الأغراض الرسمية فقط.', 'Use email and the internet only for official purposes.')}</li>
                          <li>{t('الإبلاغ الفوري عن أي نشاط أو رسالة مشبوهة إلى الجهة الأمنية المختصة.', 'Immediately report any suspicious activity or message to the competent security authority.')}</li>
                        </ul>
                      </li>
                      <li className="ps-1">
                        <h3 className="font-black text-[#0a3555]">{t('سياسة استخدام البريد الإلكتروني:', 'Email usage policy:')}</h3>
                        <ul className="mt-1 list-disc space-y-2 ps-6 marker:text-[#d7b05a]">
                          <li>{t('استخدام البريد الإلكتروني الرسمي فقط في المراسلات المتعلقة بالعمل.', 'Use the official email account only for work-related correspondence.')}</li>
                          <li>{t('يمنع إرسال أو استقبال أي ملفات أو روابط مجهولة المصدر.', 'Sending or receiving files or links from unknown sources is prohibited.')}</li>
                          <li>{t('يحظر استخدام البريد الإلكتروني الشخصي في الأعمال الرسمية.', 'Using personal email for official work is prohibited.')}</li>
                          <li>{t('التأكد من خلو المرفقات من أي برمجيات خبيثة قبل فتحها ووفقًا للتنسيق مع الإدارة العامة لتكنولوجيا المعلومات.', 'Ensure that attachments are free of malicious software before opening them, in coordination with the General Administration of Information Technology.')}</li>
                        </ul>
                      </li>
                      <li className="ps-1">
                        <h3 className="font-black text-[#0a3555]">{t('سياسة استخدام الإنترنت والأجهزة:', 'Internet and device usage policy:')}</h3>
                        <ul className="mt-1 list-disc space-y-2 ps-6 marker:text-[#d7b05a]">
                          <li>{t('لا يسمح بتثبيت أي برامج أو تطبيقات دون موافقة الإدارة العامة لتكنولوجيا المعلومات.', 'No software or applications may be installed without approval from the General Administration of Information Technology.')}</li>
                          <li>{t('يمنع إدخال وسائط خارجية، مثل الفلاشات أو الأقراص الصلبة غير المعتمدة.', 'External media, such as unapproved USB drives or hard disks, may not be connected.')}</li>
                          <li>{t('يجب قفل الجهاز عند الانتهاء من العمل عليه بأي سبب.', 'The device must be locked whenever work on it is interrupted.')}</li>
                          <li>{t('يمنع الدخول إلى مواقع إلكترونية غير آمنة أو غير مصرح بها.', 'Access to unsafe or unauthorized websites is prohibited.')}</li>
                        </ul>
                      </li>
                      <li className="ps-1">
                        <h3 className="font-black text-[#0a3555]">{t('خطة الاستجابة للحوادث الأمنية:', 'Security incident response plan:')}</h3>
                        <p className="mt-1">{t('في حال اكتشاف أي تهديد أو اختراق أمني، يجب اتباع الخطوات التالية:', 'If any security threat or breach is detected, follow these steps:')}</p>
                        <ul className="mt-1 list-disc space-y-2 ps-6 marker:text-[#d7b05a]">
                          <li>{t('الإبلاغ الفوري إلى الإدارة العامة لتكنولوجيا المعلومات.', 'Immediately report the incident to the General Administration of Information Technology.')}</li>
                          <li>{t('فصل الجهاز المصاب عن الشبكة فورًا.', 'Immediately disconnect the affected device from the network.')}</li>
                          <li>{t('توثيق تفاصيل الحادث: الوقت، ونوع التهديد، والأجهزة المتأثرة.', 'Document the incident details, including the time, type of threat, and affected devices.')}</li>
                          <li>{t('عدم محاولة معالجة الحادث دون التنسيق مع الإدارة العامة لتكنولوجيا المعلومات.', 'Do not attempt to resolve the incident without coordinating with the General Administration of Information Technology.')}</li>
                          <li>{t('متابعة التوصيات والإجراءات الوقائية بعد معالجة الحادث.', 'Follow preventive recommendations and procedures after resolving the incident.')}</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </article>
              </div>
              <p className="mt-7 text-center text-base font-black leading-8 text-[#0a3555] sm:text-lg">
                {t('مع تحيات الإدارة العامة لتكنولوجيا المعلومات والتحول الرقمي', 'With regards from the General Administration of Information Technology and Digital Transformation')}
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />


    </>
  );
}

export default CyberSecurityGuidelinesPage;
