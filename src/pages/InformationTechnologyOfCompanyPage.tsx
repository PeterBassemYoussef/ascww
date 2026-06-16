import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type Program = {
    name: {
        ar: string;
        en: string;
    };
    description: {
        ar: string;
        en: string;
    };
};

const ownedPrograms: Program[] = [
    {
        name: { ar: 'File Archive', en: 'File Archive' },
        description: {
            ar: 'نظام إلكتروني متكامل لإدارة ملفات الموظفين داخل الشركة منذ تاريخ استلام العمل وحتى نهاية الخدمة، مع حفظ وأرشفة البيانات بشكل منظم وآمن.',
            en: 'An integrated electronic system for managing employee files from the start of employment through end of service, with organized and secure data archiving.',
        },
    },
    {
        name: { ar: 'Website (ASCWW.ORG)', en: 'Website (ASCWW.ORG)' },
        description: {
            ar: 'المنصة الرسمية لنشر الأخبار والمناقصات والأنشطة، وتقديم خدمات إلكترونية للعملاء والموظفين بما يعزز الشفافية وسهولة الوصول للخدمات.',
            en: 'The official platform for publishing news, tenders, and activities, and for providing electronic services to customers and employees.',
        },
    },
    {
        name: { ar: 'Technical Support', en: 'Technical Support' },
        description: {
            ar: 'برنامج لإدارة وتتبع الأجهزة والمعدات داخل الشركة، وتسجيلها وتوزيعها ومتابعتها على مستوى الشركات والقطاعات والإدارات.',
            en: 'A system for managing and tracking company devices and equipment, including registration, distribution, and follow-up across sectors and departments.',
        },
    },
    {
        name: { ar: 'Information Center', en: 'Information Center' },
        description: {
            ar: 'برنامج لإدارة وتتبع الأجهزة والمعدات داخل الشركة بما يضمن تنظيم العمل ودقة البيانات وسهولة المتابعة.',
            en: 'A system that supports organized work, accurate data, and easier operational follow-up inside the company.',
        },
    },
    {
        name: { ar: 'Healthy Care System', en: 'Healthy Care System' },
        description: {
            ar: 'نظام لإدارة ومتابعة التعاقدات الطبية الخاصة بالموظفين داخل المؤسسة بهدف تنظيم الخدمات الصحية وضمان حقوق العاملين.',
            en: 'A system for managing and following up employee medical contracts to organize healthcare services and protect employee rights.',
        },
    },
    {
        name: { ar: 'RPTH', en: 'RPTH' },
        description: {
            ar: 'نظام لإدارة حضور العاملين وحساب الساعات الإضافية وبدلات الانتقال، مع متابعة خطوط السير الخاصة بالعاملين.',
            en: 'A system for managing attendance, calculating overtime and transportation allowances, and following employee routes.',
        },
    },
    {
        name: { ar: 'IWWS', en: 'IWWS' },
        description: {
            ar: 'نظام إداري وفني لمتابعة أعمال الصرف الصناعي للمحلات والمنشآت، وتسجيل البيانات ومتابعة الالتزام ورصد المخالفات والغرامات.',
            en: 'An administrative and technical system for monitoring industrial wastewater activities, recording data, tracking compliance, and documenting violations and fines.',
        },
    },
    {
        name: { ar: 'Billing SYS', en: 'Billing SYS' },
        description: {
            ar: 'نظام متخصص في إدارة الفواتير والقراءات لكبار المشتركين والمصالح الحكومية، مع متابعة التحصيل واستخراج التقارير المالية.',
            en: 'A specialized system for managing bills and readings for major customers and government entities, with collection follow-up and financial reports.',
        },
    },
];

const supportedPrograms: Program[] = [
    {
        name: { ar: 'CMS with HCSS', en: 'CMS with HCSS' },
        description: {
            ar: 'برنامج خاص بشكاوى العملاء الخاصة بتلوث المياه أو انقطاعها أو الصرف الصحي أو الفواتير من خلال الخط الساخن.',
            en: 'A system for customer complaints related to water quality, outages, wastewater, or bills through the hotline.',
        },
    },
    {
        name: { ar: 'EDAMS', en: 'EDAMS' },
        description: {
            ar: 'نظام لإصدار وإدارة الفواتير ومتابعة المدفوعات والمستحقات وتقليل الأخطاء اليدوية وتحسين كفاءة التحصيل.',
            en: 'A system for issuing and managing bills, tracking payments and dues, reducing manual errors, and improving collection efficiency.',
        },
    },
    {
        name: { ar: 'ELSWEDY', en: 'ELSWEDY' },
        description: {
            ar: 'يستخدم لتسجيل العملاء في منظومة العدادات مسبقة الدفع وشحن كروت المياه وإصدار التقارير الشهرية مع الربط بشركة فوري.',
            en: 'Used to register prepaid meter customers, recharge water cards, issue monthly reports, and integrate with Fawry.',
        },
    },
    {
        name: { ar: 'ADVAC', en: 'ADVAC' },
        description: {
            ar: 'نظام يعتمد على SQL Server ويخدم شؤون العاملين والمخازن والحسابات العامة وإدارة الأصول ومتابعة التكاليف.',
            en: 'A SQL Server-based system serving human resources, stores, general accounts, asset management, and cost follow-up.',
        },
    },
    {
        name: { ar: 'DMS', en: 'DMS' },
        description: {
            ar: 'برنامج لتسجيل الدورة المستندية للمكاتبات الداخلية والخارجية وأرشفتها بكود فريد يسهل البحث والاستعلام.',
            en: 'A system for recording and archiving internal and external correspondence with a unique code for easier search and inquiry.',
        },
    },
    {
        name: { ar: 'برنامج معامل الشركة', en: 'Company Laboratories System' },
        description: {
            ar: 'برنامج لمحاضر الغسيل ونسب الكلور وتعقيم الآبار تحت إشراف كيميائي الشركة والصحة، مع طباعة التقارير وتسجيل الاحتياجات والردود.',
            en: 'A system for wash records, chlorine ratios, and well disinfection under company and health chemist supervision, with report printing and request tracking.',
        },
    },
    {
        name: { ar: 'Attendance Management', en: 'Attendance Management' },
        description: {
            ar: 'يستخدم في طباعة تقارير الحضور والانصراف والتأخيرات والساعات الإضافية وخطوط السير وتنظيم العمل بنظام الورديات.',
            en: 'Used to print attendance, departure, delay, overtime, and route reports, and to organize shift-based work.',
        },
    },
    {
        name: { ar: 'SQUAD SQUARE', en: 'SQUAD SQUARE' },
        description: {
            ar: 'ينظم الدورة المستندية لإدارة كبار المشتركين والمصالح الحكومية من تسجيل العملاء وحساب المطالبات والتحصيل والتقارير الشهرية.',
            en: 'Organizes document workflows for major customers and government entities, including registration, claims, collection, and monthly reports.',
        },
    },
    {
        name: { ar: 'MASTER', en: 'MASTER' },
        description: {
            ar: 'برنامج لتخزين بيانات صيانة المحطات والمباني والمعدات وحساب أجور العاملين حسب طبيعة العمل وساعات العمل الخارجية.',
            en: 'A system for storing maintenance data for stations, buildings, and equipment, and calculating wages based on work type and external hours.',
        },
    },
    {
        name: { ar: 'SAP', en: 'SAP' },
        description: {
            ar: 'نظام تخطيط موارد المؤسسات لربط الأقسام المختلفة في منصة واحدة وإدارة العمليات المالية والموارد البشرية والمشتريات وسلاسل التوريد.',
            en: 'An enterprise resource planning system that connects departments on one platform and manages finance, HR, procurement, and supply chains.',
        },
    },
    {
        name: { ar: 'MAXIMO', en: 'MAXIMO' },
        description: {
            ar: 'منصة لإدارة الأصول والصيانة ومتابعة دورة حياة الأصول والتخطيط ومراقبة الأداء وتقليل الأعطال.',
            en: 'A platform for asset and maintenance management, lifecycle tracking, planning, performance monitoring, and reducing breakdowns.',
        },
    },
    {
        name: { ar: 'Water CAD, Sewer CAD', en: 'Water CAD, Sewer CAD' },
        description: {
            ar: 'برنامج هندسي متخصص في تصميم وتحليل شبكات المياه والصرف ومحاكاة التدفق والضغط لدعم التخطيط والتشغيل.',
            en: 'Specialized engineering software for designing and analyzing water and wastewater networks and simulating flow and pressure.',
        },
    },
    {
        name: { ar: 'DMAS', en: 'DMAS' },
        description: {
            ar: 'نظام أرشفة إلكترونية لحفظ وإدارة ملفات العملاء والمشتركين بشكل آمن ومنظم، مع تسهيل البحث ودعم الصلاحيات.',
            en: 'An electronic archiving system for securely organizing customer and subscriber files, with search and permission support.',
        },
    },
    {
        name: { ar: 'AZITEMS', en: 'AZITEMS' },
        description: {
            ar: 'أحد البرامج الخارجية المدرجة ضمن نطاق البرامج التي تدعمها إدارة تكنولوجيا المعلومات.',
            en: 'One of the external applications supported and followed up by the Information Technology Department.',
        },
    },
    {
        name: { ar: 'WCSS Website', en: 'WCSS Website' },
        description: {
            ar: 'منصة خارجية مدرجة ضمن البرامج التي تقدم لها إدارة تكنولوجيا المعلومات الدعم والمتابعة.',
            en: 'An external platform included in the systems supported and monitored by the Information Technology Department.',
        },
    },
];

const departmentSections = [
    {
        title: {
            ar: 'أولاً: قسم البرامج والتطبيقات',
            en: 'First: Programs and Applications Section',
        },
        description: {
            ar: 'يُعد قسم البرامج والتطبيقات المسؤول عن دعم وتشغيل الأنظمة والبرامج المستخدمة داخل الشركة، سواء كانت مطورة داخلياً أو من خلال جهات خارجية. ويتولى القسم متابعة التحديثات الدورية، ومعالجة الأعطال البرمجية، وتقديم الدعم الفني للمستخدمين، بالإضافة إلى المساهمة في تطوير الحلول الرقمية التي تساعد على تحسين الأداء ورفع كفاءة الخدمات.',
            en: 'The Programs and Applications Section supports and operates the systems used across the company, whether developed internally or supplied by external providers. It follows up periodic updates, resolves software issues, supports users, and contributes to digital solutions that improve performance and service efficiency.',
        },
    },
    {
        title: {
            ar: 'ثانياً: قسم البنية التحتية والشبكات',
            en: 'Second: Infrastructure Section',
        },
        description: {
            ar: 'يتولى قسم البنية التحتية إدارة الخوادم (Servers) وشبكات الاتصال وخدمات الإنترنت داخل الشركة، مع ضمان استقرار وكفاءة عملها على مدار الساعة. كما يختص بمراقبة الأنظمة والشبكات، وتأمين البيانات، ومعالجة المشاكل المتعلقة بالبنية التحتية التقنية، بما يضمن استمرارية الخدمات الرقمية ودعم مختلف قطاعات الشركة.',
            en: 'The Infrastructure Section manages servers, communication networks, and internet services across the company while maintaining their stability and efficiency. It monitors systems and networks, protects data, and handles infrastructure-related issues to keep digital services available for company sectors.',
        },
    },
    {
        title: {
            ar: 'ثالثاً: إدارة الدعم الفني',
            en: 'Third: Technical Support Department',
        },
        description: {
            ar: 'تختص إدارة الدعم الفني بتقديم الدعم المباشر للمستخدمين وتحليل المشاكل التقنية المتعلقة بأجهزة الحاسب الآلي وابلاغ القسم التابع لها. كما تتولى أعمال الصيانة الدورية والتعامل مع الأعطال المفاجئة، بالإضافة إلى إعداد وتجهيز الأجهزة وتوصيفها بما يتناسب مع احتياجات العمل المختلفة. وتمثل هذه الإدارة خط الدفاع الأول لضمان استمرارية العمل وتقليل فترات التوقف الناتجة عن الأعطال التقنية.',
            en: 'The Technical Support Department provides direct support to users, analyzes technical issues related to computers, and reports them to the relevant section. It also handles periodic maintenance, sudden faults, device preparation, and configuration according to work needs, helping ensure business continuity and reduce downtime.',
        },
    },
];

const BuildIcon = () => (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3 18v3h3l6.4-6.4a4 4 0 0 0 5.3-5.3l-2.6 2.6-3-3 2.6-2.6Z" />
    </svg>
);

const SupportIcon = () => (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 7v6c0 5 3.4 7.7 8 8 4.6-.3 8-3 8-8V7l-8-4Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
);

function ProgramCard({ program, isEnglish }: { program: Program; isEnglish: boolean }) {
    return (
        <article className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-base font-extrabold text-slate-950">{isEnglish ? program.name.en : program.name.ar}</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{isEnglish ? program.description.en : program.description.ar}</p>
        </article>
    );
}

function InformationTechnologyOfCompanyPage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);

    return (
        <>
            <Header />
            <main className="bg-[#f6f8fb] [zoom:0.9]" dir={isEnglish ? 'ltr' : 'rtl'}>
                <section className="border-b border-[#d7b05a]/35 bg-white">
                    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                        <h1 className="text-3xl font-black leading-tight text-[#0a3555] sm:text-4xl">
                            {t('الإدارة العامة لتكنولوجيا المعلومات والتحول الرقمي', 'Information Technology and Digital Transformation Department')}
                        </h1>
                    </div>
                </section>

                <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <section className="mb-8 rounded-2xl border border-[#d7b05a]/35 bg-white p-5 shadow-sm sm:p-7">
                        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
                            <p className="flex min-h-80 items-center text-justify text-xl leading-[3.6rem] text-slate-700">
                                {t(
                                    'تُعد الإدارة العامة لتكنولوجيا المعلومات والتحول الرقمي أحد الركائز الأساسية في شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد، حيث تقوم بدور محوري في دعم التحول الرقمي ورفع كفاءة العمل وتحسين جودة الخدمات المقدمة. وتسعى الإدارة إلى توفير بيئة تقنية متطورة وآمنة تضمن استمرارية الأعمال وتدعم اتخاذ القرار من خلال الأنظمة والتطبيقات الحديثة.',
                                    'The Information Technology and Digital Transformation Department is one of the core pillars of the Assiut and New Valley Water and Wastewater Company. It plays a central role in supporting digital transformation, improving work efficiency, and enhancing service quality. The department works to provide an advanced and secure technical environment that ensures business continuity and supports decision-making through modern systems and applications.'
                                )}
                            </p>
                            <img
                                src="/images/information-technology-of-company/information-technology-of-company.webp"
                                alt={t('الإدارة العامة لتكنولوجيا المعلومات والتحول الرقمي', 'Information Technology and Digital Transformation Department')}
                                loading="lazy"
                                className="h-full min-h-80 w-full rounded-xl border border-[#d7b05a]/35 object-cover shadow-sm"
                            />
                        </div>

                        <h3 className="mt-6 border-t border-[#d7b05a]/25 pt-5 text-xl font-black text-[#0a3555]">
                            {t('الإدارات الفرعية', 'Department Sections')}
                        </h3>

                        <div className="mt-4 grid gap-4">
                            {departmentSections.map((section) => (
                                <article key={section.title.ar} className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4">
                                    <h4 className="text-lg font-extrabold text-[#1170b0]">{isEnglish ? section.title.en : section.title.ar}</h4>
                                    <p className="mt-2 text-base leading-9 text-slate-700">
                                        {isEnglish ? section.description.en : section.description.ar}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#d7b05a]/35 bg-[#d7b05a]/10 p-4">
                            <h3 className="text-xl font-black text-[#0a3555]">{t('دور الإدارة في التحول الرقمي', 'The Department Role in Digital Transformation')}</h3>
                            <p className="mt-2 text-base leading-9 text-slate-700">
                                {t(
                                    'تسهم إدارة تكنولوجيا المعلومات والتحول الرقمي في تنفيذ رؤية الشركة نحو التحول الرقمي الشامل من خلال تطوير الأنظمة الإلكترونية، وتحسين البنية التحتية التقنية، وتعزيز أمن المعلومات، ودعم الخدمات الرقمية الحديثة. كما تعمل الإدارة على رفع كفاءة العمليات التشغيلية وتسهيل الوصول إلى المعلومات، بما ينعكس إيجابياً على جودة الخدمات المقدمة للمواطنين.',
                                    'The department contributes to the company vision for comprehensive digital transformation by developing electronic systems, improving technical infrastructure, strengthening information security, and supporting modern digital services. It also improves operational efficiency and access to information, which positively affects the quality of services provided to citizens.'
                                )}
                            </p>
                        </div>
                    </section>

                    <div className="mb-5">
                        <h2 className="text-2xl font-black text-[#0a3555]">
                            {t('قسم البرامج والتطبيقات', 'Programs and Applications Section')}
                        </h2>
                        <p className="mt-3 text-base leading-8 text-slate-600 lg:whitespace-nowrap">
                            {t(
                                'عرض منظم للبرامج المصممة داخل الشركة والبرامج الخارجية التي تقوم إدارة تكنولوجيا المعلومات بدعمها ومتابعتها تشغيليا.',
                                'A structured view of in-house systems and external platforms supported by the Information Technology Department.'
                            )}
                        </p>
                        <img
                            src="/images/information-technology-of-company/program.webp"
                            alt={t('قسم البرامج والتطبيقات', 'Programs and Applications Section')}
                            loading="lazy"
                            className="mt-4 max-h-[280px] w-full rounded-xl border border-[#1170b0]/25 object-cover shadow-sm"
                        />
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-[#1170b0]/25 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1170b0] text-white">
                                    <BuildIcon />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-950">
                                        {t('برامج قامت بها إدارة تكنولوجيا المعلومات', 'Programs Built by IT')}
                                    </h2>
                                    <p className="mt-1 text-sm font-semibold text-[#1170b0]">
                                        {t('برامج داخلية مصممة داخل الشركة', 'In-house systems designed inside the company')}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {ownedPrograms.map((program) => (
                                    <ProgramCard key={program.name.en} program={program} isEnglish={isEnglish} />
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-[#d7b05a]/45 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d7b05a] text-[#0a3555]">
                                    <SupportIcon />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-950">
                                        {t('برامج تدعمها إدارة تكنولوجيا المعلومات', 'Programs Supported by IT')}
                                    </h2>
                                    <p className="mt-1 text-sm font-semibold text-[#8a6720]">
                                        {t('برامج خارجية يتم دعمها ومتابعتها', 'External platforms supported and followed up')}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {supportedPrograms.map((program) => (
                                    <ProgramCard key={program.name.en} program={program} isEnglish={isEnglish} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default InformationTechnologyOfCompanyPage;
