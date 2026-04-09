import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

type Member = {
    name: string;
    role: string;
};

type OrgSection = {
    id: string;
    title: string;
    members: Member[];
};

const isVacantMember = (member: Member) =>
    member.name.includes('شاغر') || member.role.includes('شاغر');

const normalizeArabicText = (value: string) =>
    value
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/[ـ]/g, '')
        .replace(/[\u064B-\u0652\u0670]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const tokenVariants = (token: string) =>
    token.startsWith('ال') && token.length > 2
        ? [token, token.slice(2)]
        : [token];

const normalizeEnglishText = (value: string) =>
    value
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

const normalizeSearchText = (value: string, isEnglish: boolean) =>
    isEnglish ? normalizeEnglishText(value) : normalizeArabicText(value);

const ORGANIZATION_SECTIONS: OrgSection[] = [
    {
        id: 'upper-management',
        title: 'الإدارة العليا',
        members: [
            { name: 'مهندس / محمود شحاته محمد', role: 'رئيس مجلس الإدارة والعضو المنتدب.' },
            { name: 'أ / لبنى أحمد عبدالله', role: 'نائب رئيس مجلس الإدارة للشئون المالية والإدارية ورئيس القطاع المالي.' },
            { name: 'م / بهاء عبد المنجي حسن أبو النجا', role: 'نائب رئيس مجلس الإدارة للشئون الفنية ورئيس قطاع الدعم الفني.' }
        ]
    },
    {
        id: 'general-management',
        title: 'الإدارات العامة',
        members: [
            { name: 'أ / عبد المنعم حسني محمد', role: 'الإدارة العامة للمراجعة الداخلية والتفتيش.' },
            { name: 'لواء / بهاء أحمد علي بخيت', role: 'الإدارة العامة للسلامة والصحة المهنية.' },
            { name: 'أ / غادة مصطفى محمد', role: 'الإدارة العامة للتحليل الاقتصادي.' },
            { name: '(شاغر)', role: 'الإدارة العامة للخدمات الفنية.' },
            { name: 'لواء / محمد يسري يحيى', role: 'الإدارة العامة للأمن بالوادي الجديد.' },
            { name: 'أ / حسين سيد حسين', role: 'الإدارة العامة لمكتب رئيس مجلس الإدارة.' },
            { name: 'أ / إيمان حامد مرغني', role: 'الإدارة العامة للشئون القانونية.' },
            { name: 'أ / آمال جميل جاد', role: 'الإدارة العامة للعلاقات العامة والتوعية.' },
            { name: 'أ / مؤمن محمد نشأت', role: 'الإدارة العامة لتكنولوجيا المعلومات.' },
            { name: 'م / هشام عبد الفتاح مصطفى', role: 'الإدارة العامة للتعاون الدولي.' },
            { name: 'أ / إبراهيم محمد أبو العلا', role: 'الإدارة العامة لشئون مجلس الإدارة.' },
            { name: 'خالد محمد محمود فرغلي', role: 'الإدارة العامة للأمن بأسيوط.' },
            { name: 'م / عمرو عوض حسين', role: 'الإدارة العامة للمكتب الفني.' },
            { name: 'م / عبير كمال عبد الظاهر', role: 'الإدارة العامة للأملاك.' }
        ]
    },
    {
        id: 'projects',
        title: 'قطاع المشروعات',
        members: [
            { name: 'م / محمد عثمان عبد العزيز', role: 'رئيس قطاع المشروعات.' },
            { name: '(شاغر)', role: 'الإدارة العامة للتنفيذ الذاتي.' },
            { name: 'م / عبد الله عمر أحمد', role: 'الإدارة العامة لتنفيذ المشروعات.' },
            { name: 'م / حنان ناجح عبد السيد', role: 'الإدارة العامة لبحوث المشروعات.' },
            { name: 'م / فاطمة كامل حسين', role: 'الإدارة العامة للمراجعة الفنية.' }
        ]
    },
    {
        id: 'technical-support',
        title: 'قطاع الدعم الفني',
        members: [
            { name: 'م / بهاء عبد المنجي حسن', role: 'رئيس قطاع الدعم الفني.' },
            { name: 'م / شيماء جمال أحمد', role: 'مدير الإدارة العامة للدعم الفني مياه.' },
            { name: 'م / زينب محمد عبد اللطيف', role: 'الإدارة العامة للكهرباء وترشيد الطاقة.' },
            { name: '(شاغر)', role: 'الإدارة العامة للاحتياجات.' },
            { name: '(شاغر)', role: 'الإدارة العامة للدعم الفني صرف.' },
            { name: '(شاغر)', role: 'الإدارة العامة للإسكادا.' }
        ]
    },
    {
        id: 'new-valley',
        title: 'قطاع الوادي الجديد',
        members: [
            { name: 'م / حسام أحمد علي', role: 'رئيس قطاع الوادي الجديد.' },
            { name: 'م / أحمد محمد عبد الوهاب', role: 'الإدارة العامة لمنطقة الخارجة.' },
            { name: 'م / محمد حسين علي', role: 'الإدارة العامة لمنطقة الداخلة.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة باريس.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة الفرافرة.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة بلاط.' }
        ]
    },
    {
        id: 'north-sector',
        title: 'قطاع شمال',
        members: [
            { name: 'م / محسن فوزي كامل', role: 'رئيس قطاع شمال.' },
            { name: 'أ / أشرف صلاح عبد الحميد', role: 'الإدارة العامة لمنطقة ديروط.' },
            { name: 'م / عصام أحمد عبد المنعم', role: 'الإدارة العامة لمنطقة القوصية.' },
            { name: 'م / مروة جمعة أحمد', role: 'الإدارة العامة لمنطقة منفلوط.' }
        ]
    },
    {
        id: 'south-sector',
        title: 'قطاع جنوب',
        members: [
            { name: 'م / مرفت زوزو متري', role: 'رئيس قطاع جنوب.' },
            { name: 'م / أحمد زكريا محمود', role: 'الإدارة العامة لمنطقة أبوتيج.' },
            { name: 'م / رامز شوقي إسحاق', role: 'الإدارة العامة لمنطقة صدفا.' },
            { name: 'م / رمضان عبد العظيم محمد', role: 'الإدارة العامة لمنطقة الغنايم.' }
        ]
    },
    {
        id: 'middle-sector',
        title: 'قطاع وسط',
        members: [
            { name: 'م / حسام رفعت حكيم', role: 'رئيس قطاع وسط.' },
            { name: 'م / كريم محمد محمد أحمد', role: 'الإدارة العامة لمنطقة غرب.' },
            { name: 'م / محمد عبد الرشيد موسى', role: 'الإدارة العامة لمنطقة مركز أسيوط بحري.' },
            { name: 'م / مصطفى صلاح فراج', role: 'الإدارة العامة لمنطقة مركز أسيوط قبلي.' },
            { name: 'م / أحمد محمد علي', role: 'الإدارة العامة لمنطقة شرق.' }
        ]
    },
    {
        id: 'financial-sector',
        title: 'القطاع المالي',
        members: [
            { name: 'أ / لبنى أحمد عبدالله', role: 'رئيس القطاع المالي.' },
            { name: 'أ / شيماء حسين عبدالله', role: 'الإدارة العامة للعقود والمشتريات.' },
            { name: 'أ / هبه الله محمود أحمد', role: 'الإدارة العامة للمراجعة العامة.' },
            { name: 'أ / سيدة صاوى عبد العليم', role: 'الإدارة العامة للتكاليف والأصول.' },
            { name: 'أ / عبدالناصر حسن علي', role: 'الإدارة العامة للحسابات العامة.' },
            { name: 'أ / عبدالوهاب ماهر عبدالرحيم', role: 'الإدارة العامة للمخازن.' },
            { name: 'أ / عواطف فرغلي محمد', role: 'الإدارة العامة للموازنة.' },
            { name: 'أ / أحمد جمال جلال', role: 'الإدارة العامة للمتابعة المالية.' }
        ]
    },
    {
        id: 'commercial-sector',
        title: 'القطاع التجاري',
        members: [
            { name: 'أ / همت مصطفى محمود', role: 'رئيس القطاع التجاري.' },
            { name: 'أ / لبنى عثمان فياض', role: 'الإدارة العامة للإيرادات والتحصيل.' },
            { name: 'أ / نهى أحمد أبو ضيف', role: 'الإدارة العامة لإصدار الفواتير.' },
            { name: 'أ / محمد خليفة حفنى', role: 'الإدارة العامة للمصالح الحكومية وكبار المشتركين.' },
            { name: 'أ / محمد أحمد حسين', role: 'الإدارة العامة للعدادات والاشتراكات.' },
            { name: '(شاغر)', role: 'الإدارة العامة لخدمة العملاء.' },
            { name: 'أ / محمود تمام علي', role: 'الإدارة العامة للمخالفات والخلسة.' }
        ]
    },
    {
        id: 'hr-sector',
        title: 'قطاع الموارد البشرية',
        members: [
            { name: 'لواء / ياسر حسن محمد', role: 'رئيس قطاع الموارد البشرية.' },
            { name: 'أ / عماد محمد حسين', role: 'الإدارة العامة للموارد البشرية.' },
            { name: 'أ / إسلام محمد محمد', role: 'الإدارة العامة للتدريب.' },
            { name: '(شاغر)', role: 'الإدارة العامة للشئون الإدارية.' }
        ]
    },
    {
        id: 'planning',
        title: 'قطاع التخطيط',
        members: [
            { name: 'م / محمد مصطفى محمد', role: 'رئيس قطاع التخطيط.' },
            { name: 'م / مروة زكريا عرفان', role: 'الإدارة العامة للتخطيط وتطوير الأداء المؤسسي.' },
            { name: 'م / مروة حسنى دياب', role: 'الإدارة العامة للمخطط العام.' },
            { name: 'م / فاطمة كمال عبدالحكم', role: 'الإدارة العامة للتحليل الهيدروليكي.' },
            { name: 'م / مروة أحمد محمود', role: 'الإدارة العامة للمياه غير محاسب عليها وتقليل الفاقد والقياسات.' },
            { name: 'م / أسماء مصطفى كامل', role: 'الإدارة العامة الفنية للأصول.' },
            { name: 'أ / زينب رمضان عبدالباقي', role: 'الإدارة العامة للـ GIS.' },
            { name: 'ك / عاطف محمد جاد', role: 'الإدارة العامة للبحوث والتطوير.' }
        ]
    },
    {
        id: 'labs-quality',
        title: 'قطاع المعامل والجودة',
        members: [
            { name: 'ك / إسلام محمد حسانين', role: 'رئيس قطاع المعامل والجودة.' },
            { name: 'ك / مصطفى محمد عليوه', role: 'الإدارة العامة للصرف الصناعي.' },
            { name: 'ك / كمال محمد عبدالحميد', role: 'الإدارة العامة لمعامل محطات مياه الشرب.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمعامل محطات الصرف الصحي.' },
            { name: 'ك / محمد أحمد ثابت', role: 'الإدارة العامة لسلامة ومأمونية مياه الشرب ومأمونية الصرف الصحي.' },
            { name: '(شاغر)', role: 'الإدارة العامة للمعمل المركزي لتحاليل الصرف الصحي.' },
            { name: 'ك / محمد عبدالجابر أحمد', role: 'الإدارة العامة لضبط الجودة وشئون البيئة.' },
            { name: 'ك / محمد عاطف أحمد', role: 'الإدارة العامة للمعمل المركزي لمياه الشرب.' }
        ]
    },
    {
        id: 'east-sector',
        title: 'قطاع شرق',
        members: [
            { name: 'ك / محمد عبدالتواب عبدالحافظ', role: 'رئيس قطاع شرق.' },
            { name: 'م / أحمد كمال محمد حرويه', role: 'الإدارة العامة لمنطقة الفتح.' },
            { name: 'م / أحمد جمال شحاته', role: 'الإدارة العامة لمنطقة أبنوب.' },
            { name: 'م / إبراهيم عبدالله حلمي', role: 'الإدارة العامة لمنطقة البداري.' },
            { name: 'م / عبدالرحمن طلعت عبدالرحمن', role: 'الإدارة العامة لمنطقة ساحل سليم.' }
        ]
    }
];

const SECTION_TITLE_TRANSLATIONS: Record<string, string> = {
    'الإدارة العليا': 'Executive Management',
    'الإدارات العامة': 'General Departments',
    'قطاع المشروعات': 'Projects Sector',
    'قطاع الدعم الفني': 'Technical Support Sector',
    'قطاع الوادي الجديد': 'New Valley Sector',
    'قطاع شمال': 'North Sector',
    'قطاع جنوب': 'South Sector',
    'قطاع وسط': 'Central Sector',
    'القطاع المالي': 'Financial Sector',
    'القطاع التجاري': 'Commercial Sector',
    'قطاع الموارد البشرية': 'Human Resources Sector',
    'قطاع التخطيط': 'Planning Sector',
    'قطاع المعامل والجودة': 'Laboratories and Quality Sector',
    'قطاع شرق': 'East Sector'
};

const ROLE_TRANSLATIONS: Record<string, string> = {
    'رئيس مجلس الإدارة والعضو المنتدب.': 'Chairman of the Board and Managing Director.',
    'نائب رئيس مجلس الإدارة للشئون المالية والإدارية ورئيس القطاع المالي.': 'Deputy Chairman for Financial and Administrative Affairs and Head of the Financial Sector.',
    'نائب رئيس مجلس الإدارة للشئون الفنية ورئيس قطاع الدعم الفني.': 'Deputy Chairman for Technical Affairs and Head of the Technical Support Sector.',
    'الإدارة العامة للمراجعة الداخلية والتفتيش.': 'General Department of Internal Audit and Inspection.',
    'الإدارة العامة للسلامة والصحة المهنية.': 'General Department of Occupational Safety and Health.',
    'الإدارة العامة للتحليل الاقتصادي.': 'General Department of Economic Analysis.',
    'الإدارة العامة للخدمات الفنية.': 'General Department of Technical Services.',
    'الإدارة العامة للأمن بالوادي الجديد.': 'General Department of Security in New Valley.',
    'الإدارة العامة لمكتب رئيس مجلس الإدارة.': 'General Department of the Chairman Office.',
    'الإدارة العامة للشئون القانونية.': 'General Department of Legal Affairs.',
    'الإدارة العامة للعلاقات العامة والتوعية.': 'General Department of Public Relations and Awareness.',
    'الإدارة العامة لتكنولوجيا المعلومات.': 'General Department of Information Technology.',
    'الإدارة العامة للتعاون الدولي.': 'General Department of International Cooperation.',
    'الإدارة العامة لشئون مجلس الإدارة.': 'General Department of Board Affairs.',
    'الإدارة العامة للأمن بأسيوط.': 'General Department of Security in Assiut.',
    'الإدارة العامة للمكتب الفني.': 'General Department of the Technical Office.',
    'الإدارة العامة للأملاك.': 'General Department of Properties.',
    'رئيس قطاع المشروعات.': 'Head of the Projects Sector.',
    'الإدارة العامة للتنفيذ الذاتي.': 'General Department of Self-Execution.',
    'الإدارة العامة لتنفيذ المشروعات.': 'General Department of Project Execution.',
    'الإدارة العامة لبحوث المشروعات.': 'General Department of Project Research.',
    'الإدارة العامة للمراجعة الفنية.': 'General Department of Technical Review.',
    'رئيس قطاع الدعم الفني.': 'Head of the Technical Support Sector.',
    'مدير الإدارة العامة للدعم الفني مياه.': 'Director of the General Department of Technical Support for Water.',
    'الإدارة العامة للكهرباء وترشيد الطاقة.': 'General Department of Electricity and Energy Conservation.',
    'الإدارة العامة للاحتياجات.': 'General Department of Requirements.',
    'الإدارة العامة للدعم الفني صرف.': 'General Department of Technical Support for Wastewater.',
    'الإدارة العامة للإسكادا.': 'General Department of SCADA.',
    'رئيس قطاع الوادي الجديد.': 'Head of the New Valley Sector.',
    'الإدارة العامة لمنطقة الخارجة.': 'General Department of Kharga Area.',
    'الإدارة العامة لمنطقة الداخلة.': 'General Department of Dakhla Area.',
    'الإدارة العامة لمنطقة باريس.': 'General Department of Paris Area.',
    'الإدارة العامة لمنطقة الفرافرة.': 'General Department of Farafra Area.',
    'الإدارة العامة لمنطقة بلاط.': 'General Department of Balat Area.',
    'رئيس قطاع شمال.': 'Head of the North Sector.',
    'الإدارة العامة لمنطقة ديروط.': 'General Department of Dayrout Area.',
    'الإدارة العامة لمنطقة القوصية.': 'General Department of Al-Qusiyah Area.',
    'الإدارة العامة لمنطقة منفلوط.': 'General Department of Manfalut Area.',
    'رئيس قطاع جنوب.': 'Head of the South Sector.',
    'الإدارة العامة لمنطقة أبوتيج.': 'General Department of Abutig Area.',
    'الإدارة العامة لمنطقة صدفا.': 'General Department of Sidfa Area.',
    'الإدارة العامة لمنطقة الغنايم.': 'General Department of Al-Ghanayem Area.',
    'رئيس قطاع وسط.': 'Head of the Central Sector.',
    'الإدارة العامة لمنطقة غرب.': 'General Department of West Area.',
    'الإدارة العامة لمنطقة مركز أسيوط بحري.': 'General Department of Assiut North Center Area.',
    'الإدارة العامة لمنطقة مركز أسيوط قبلي.': 'General Department of Assiut South Center Area.',
    'الإدارة العامة لمنطقة شرق.': 'General Department of East Area.',
    'رئيس القطاع المالي.': 'Head of the Financial Sector.',
    'الإدارة العامة للعقود والمشتريات.': 'General Department of Contracts and Procurement.',
    'الإدارة العامة للمراجعة العامة.': 'General Department of General Audit.',
    'الإدارة العامة للتكاليف والأصول.': 'General Department of Costs and Assets.',
    'الإدارة العامة للحسابات العامة.': 'General Department of General Accounts.',
    'الإدارة العامة للمخازن.': 'General Department of Stores.',
    'الإدارة العامة للموازنة.': 'General Department of Budget.',
    'الإدارة العامة للمتابعة المالية.': 'General Department of Financial Follow-up.',
    'رئيس القطاع التجاري.': 'Head of the Commercial Sector.',
    'الإدارة العامة للإيرادات والتحصيل.': 'General Department of Revenue and Collection.',
    'الإدارة العامة لإصدار الفواتير.': 'General Department of Billing.',
    'الإدارة العامة للمصالح الحكومية وكبار المشتركين.': 'General Department of Government Entities and Major Subscribers.',
    'الإدارة العامة للعدادات والاشتراكات.': 'General Department of Meters and Subscriptions.',
    'الإدارة العامة لخدمة العملاء.': 'General Department of Customer Service.',
    'الإدارة العامة للمخالفات والخلسة.': 'General Department of Violations and Illegal Connections.',
    'رئيس قطاع الموارد البشرية.': 'Head of the Human Resources Sector.',
    'الإدارة العامة للموارد البشرية.': 'General Department of Human Resources.',
    'الإدارة العامة للتدريب.': 'General Department of Training.',
    'الإدارة العامة للشئون الإدارية.': 'General Department of Administrative Affairs.',
    'رئيس قطاع التخطيط.': 'Head of the Planning Sector.',
    'الإدارة العامة للتخطيط وتطوير الأداء المؤسسي.': 'General Department of Planning and Institutional Performance Development.',
    'الإدارة العامة للمخطط العام.': 'General Department of the Master Plan.',
    'الإدارة العامة للتحليل الهيدروليكي.': 'General Department of Hydraulic Analysis.',
    'الإدارة العامة للمياه غير محاسب عليها وتقليل الفاقد والقياسات.': 'General Department of Non-Revenue Water, Loss Reduction, and Measurements.',
    'الإدارة العامة الفنية للأصول.': 'General Technical Department of Assets.',
    'الإدارة العامة للـ GIS.': 'General Department of GIS.',
    'الإدارة العامة للبحوث والتطوير.': 'General Department of Research and Development.',
    'رئيس قطاع المعامل والجودة.': 'Head of the Laboratories and Quality Sector.',
    'الإدارة العامة للصرف الصناعي.': 'General Department of Industrial Wastewater.',
    'الإدارة العامة لمعامل محطات مياه الشرب.': 'General Department of Drinking Water Station Laboratories.',
    'الإدارة العامة لمعامل محطات الصرف الصحي.': 'General Department of Wastewater Station Laboratories.',
    'الإدارة العامة لسلامة ومأمونية مياه الشرب ومأمونية الصرف الصحي.': 'General Department of Drinking Water Safety and Wastewater Safety.',
    'الإدارة العامة للمعمل المركزي لتحاليل الصرف الصحي.': 'General Department of the Central Wastewater Analysis Laboratory.',
    'الإدارة العامة لضبط الجودة وشئون البيئة.': 'General Department of Quality Control and Environmental Affairs.',
    'الإدارة العامة للمعمل المركزي لمياه الشرب.': 'General Department of the Central Drinking Water Laboratory.',
    'رئيس قطاع شرق.': 'Head of the East Sector.',
    'الإدارة العامة لمنطقة الفتح.': 'General Department of Al-Fath Area.',
    'الإدارة العامة لمنطقة أبنوب.': 'General Department of Abnoub Area.',
    'الإدارة العامة لمنطقة البداري.': 'General Department of Al-Badari Area.',
    'الإدارة العامة لمنطقة ساحل سليم.': 'General Department of Sahel Selim Area.'
};

const NAME_WORD_TRANSLATIONS: Record<string, string> = {
    'محمود': 'Mahmoud',
    'شحاته': 'Shehata',
    'محمد': 'Mohamed',
    'لبنى': 'Lobna',
    'أحمد': 'Ahmed',
    'عبدالله': 'Abdallah',
    'بهاء': 'Bahaa',
    'عبد': 'Abdel',
    'المنجي': 'Mongey',
    'حسن': 'Hassan',
    'أبو': 'Abo',
    'النجا': 'El-Naga',
    'عبدالمنعم': 'Abdel Moneim',
    'حسني': 'Hosny',
    'علي': 'Ali',
    'بخيت': 'Bekheit',
    'غادة': 'Ghada',
    'مصطفى': 'Mostafa',
    'يسري': 'Yousry',
    'يحيى': 'Yehia',
    'حسين': 'Hussein',
    'إيمان': 'Eman',
    'حامد': 'Hamed',
    'مرغني': 'Marghany',
    'آمال': 'Amal',
    'جميل': 'Gameel',
    'جاد': 'Gad',
    'مؤمن': 'Moamen',
    'نشأت': 'Nashaat',
    'هشام': 'Hesham',
    'الفتاح': 'El-Fattah',
    'إبراهيم': 'Ibrahim',
    'العلا': 'El-Ela',
    'خالد': 'Khaled',
    'فرغلي': 'Farghaly',
    'عمرو': 'Amr',
    'عوض': 'Awad',
    'عبير': 'Abeer',
    'كمال': 'Kamal',
    'الظاهر': 'El-Zaher',
    'عثمان': 'Othman',
    'عبدالعزيز': 'Abdelaziz',
    'حنان': 'Hanan',
    'ناجح': 'Nageh',
    'السيد': 'El-Sayed',
    'فاطمة': 'Fatma',
    'شيماء': 'Shaimaa',
    'جمال': 'Gamal',
    'زينب': 'Zeinab',
    'عبداللطيف': 'Abdel Latif',
    'حسام': 'Hossam',
    'عبدالوهاب': 'Abdel Wahab',
    'محسن': 'Mohsen',
    'فوزي': 'Fawzy',
    'أشرف': 'Ashraf',
    'صلاح': 'Salah',
    'عبدالحميد': 'Abdel Hamid',
    'عصام': 'Essam',
    'مروة': 'Marwa',
    'جمعة': 'Gomaa',
    'مرفت': 'Mervat',
    'زوزو': 'Zouzou',
    'متري': 'Metry',
    'زكريا': 'Zakaria',
    'رامز': 'Ramez',
    'شوقي': 'Shawky',
    'إسحاق': 'Ishak',
    'رمضان': 'Ramadan',
    'العظيم': 'El-Azeem',
    'رفعت': 'Refaat',
    'حكيم': 'Hakim',
    'كريم': 'Karim',
    'عبدالرشيد': 'Abdel Rashid',
    'موسى': 'Mousa',
    'فراج': 'Farag',
    'همت': 'Hemmat',
    'فياض': 'Fayad',
    'نهى': 'Noha',
    'ضيف': 'Deif',
    'هبه': 'Heba',
    'الله': 'Allah',
    'سيدة': 'Sayeda',
    'صاوى': 'Sawy',
    'عبدالعليم': 'Abdel Aleem',
    'عبدالناصر': 'Abdel Nasser',
    'عواطف': 'Awatif',
    'عماد': 'Emad',
    'إسلام': 'Islam',
    'عرفان': 'Irfan',
    'حسنى': 'Hosny',
    'دياب': 'Diab',
    'عبدالحكم': 'Abdel Hakam',
    'أسماء': 'Asmaa',
    'كامل': 'Kamel',
    'حسانين': 'Hassanain',
    'عاطف': 'Atef',
    'عليوه': 'Aliwa',
    'ثابت': 'Thabet',
    'عبدالجابر': 'Abdel Gaber',
    'عبدالتواب': 'Abdel Tawab',
    'عبدالحافظ': 'Abdel Hafeez',
    'حرويه': 'Haraweya',
    'طلعت': 'Talaat',
    'عبدالرحمن': 'Abdel Rahman'
};

const NAME_PREFIX_TRANSLATIONS: Record<string, string> = {
    'مهندس': 'Eng.',
    'م': 'Eng.',
    'لواء': 'Maj. Gen.',
    'ك': 'Chem.'
};

const ARABIC_CHAR_TRANSLITERATIONS: Record<string, string> = {
    'ا': 'a',
    'أ': 'a',
    'إ': 'e',
    'آ': 'aa',
    'ب': 'b',
    'ت': 't',
    'ث': 'th',
    'ج': 'g',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'dh',
    'ر': 'r',
    'ز': 'z',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'd',
    'ط': 't',
    'ظ': 'z',
    'ع': 'a',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'q',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'ه': 'h',
    'ة': 'a',
    'و': 'w',
    'ؤ': 'o',
    'ي': 'y',
    'ى': 'a',
    'ئ': 'e'
};

const translateSectionTitle = (title: string, isEnglish: boolean) =>
    isEnglish ? SECTION_TITLE_TRANSLATIONS[title] ?? title : title;

const translateRole = (role: string, isEnglish: boolean) =>
    isEnglish ? ROLE_TRANSLATIONS[role] ?? role : role;

const transliterateArabicToken = (word: string): string => {
    const normalized = word.trim();
    if (!normalized) return normalized;

    if (normalized.startsWith('ال') && normalized.length > 2) {
        return `Al-${transliterateArabicToken(normalized.slice(2))}`;
    }

    return normalized
        .split('')
        .map((char) => ARABIC_CHAR_TRANSLITERATIONS[char] ?? char)
        .join('')
        .replace(/aa+/g, 'aa')
        .replace(/yy+/g, 'y')
        .replace(/ww+/g, 'w')
        .replace(/^a(?=[b-df-hj-np-tv-z])/i, 'A')
        .replace(/^./, (char) => char.toUpperCase());
};

const transliterateArabicName = (value: string) => {
    const normalized = value
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const [prefixPart, bodyPart] = normalized.includes('/')
        ? normalized.split('/').map((part) => part.trim())
        : ['', normalized];

    const translatedPrefix = NAME_PREFIX_TRANSLATIONS[prefixPart] ?? '';
    const transliteratedBody = bodyPart
        .split(' ')
        .filter(Boolean)
        .map((word) => NAME_WORD_TRANSLATIONS[word] ?? transliterateArabicToken(word))
        .join(' ');

    return translatedPrefix ? `${translatedPrefix} ${transliteratedBody}` : transliteratedBody;
};

const translateMemberName = (name: string, isEnglish: boolean) => {
    if (!isEnglish) return name;
    if (name.includes('شاغر')) return '(Vacant)';
    return transliterateArabicName(name);
};

const CHAIRMAN = ORGANIZATION_SECTIONS.flatMap((section) => section.members).find((member) => member.role.includes('رئيس مجلس الإدارة'));

const INFOGRAPHIC_COLORS = [
    { from: '#003049', to: '#005b7f', soft: '#e3edf2', badge: '#c7dbe5' },
    { from: '#7a3e2e', to: '#a65943', soft: '#f2e7e2', badge: '#e5d2cb' },
    { from: '#6b3f1f', to: '#8a552c', soft: '#f1e8df', badge: '#e2d2c2' },
    { from: '#4a2333', to: '#6b2f47', soft: '#efe6ea', badge: '#decbd3' },
    { from: '#3c2a63', to: '#564086', soft: '#e9e6f1', badge: '#d6cfe5' },
    { from: '#1f5b63', to: '#2e7680', soft: '#e3edf0', badge: '#c9dde2' },
    { from: '#5d4030', to: '#7a5642', soft: '#efe8e3', badge: '#ddcec3' },
    { from: '#2f3e4e', to: '#475a6c', soft: '#e6ebef', badge: '#ced8e1' },
    { from: '#2c2b66', to: '#43439a', soft: '#e7e8f3', badge: '#d0d4e7' },
    { from: '#1e5a56', to: '#2c7a74', soft: '#e3efed', badge: '#cadfdb' },
    { from: '#25245a', to: '#3d3c86', soft: '#e6e7f1', badge: '#cdd0e2' },
    { from: '#5f4a1f', to: '#7c6330', soft: '#f0ece2', badge: '#e0d5c1' },
    { from: '#5a1f24', to: '#7a2c33', soft: '#f0e4e6', badge: '#dfc8cb' },
    { from: '#6b2335', to: '#8d3248', soft: '#f2e5e9', badge: '#e2cdd4' },
    { from: '#1b4d49', to: '#2a6963', soft: '#e3eeec', badge: '#c9ddd9' },
    { from: '#4a2a64', to: '#683c89', soft: '#eee6f4', badge: '#dccfe7' }
];
const ORGANIZATION_PDF_DOWNLOAD_URL = 'https://backend.ascww.org/api/admin-structure/download';
const DEFAULT_SECTION_ID = ORGANIZATION_SECTIONS.find((section) => section.id === 'upper-management')?.id ?? ORGANIZATION_SECTIONS[0]?.id ?? '';

function OrganizationStructurePage() {
    const { language } = useSiteLanguage();
    const isEnglish = language === 'en';
    const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
    const headerGradientStyle = {
        background: isEnglish
            ? 'linear-gradient(240deg,#0a3555 0%,#0f4f7b 55%,#0a3555 100%)'
            : 'linear-gradient(120deg,#0a3555 0%,#0f4f7b 55%,#0a3555 100%)'
    };
    const [activeSectionId, setActiveSectionId] = useState<string>(DEFAULT_SECTION_ID);
    const [query, setQuery] = useState('');
    const [selectedLineSectionId, setSelectedLineSectionId] = useState<string | null>(DEFAULT_SECTION_ID);
    const normalizedSections = useMemo(
        () =>
            ORGANIZATION_SECTIONS.map((section) => ({
                ...section,
                members: [
                    ...section.members.filter((member) => !isVacantMember(member)),
                    ...section.members.filter((member) => isVacantMember(member))
                ]
            })),
        []
    );

    const normalizedQuery = normalizeSearchText(query, isEnglish);
    const filteredSections = useMemo(() => {
        if (!normalizedQuery) return normalizedSections;
        const queryTokens = normalizedQuery.split(' ').filter(Boolean);

        return normalizedSections.filter((section) => {
            const titleText = normalizeSearchText(translateSectionTitle(section.title, isEnglish), isEnglish);
            const roleTexts = section.members.map((member) => normalizeSearchText(translateRole(member.role, isEnglish), isEnglish));
            const haystacks = [titleText, ...roleTexts];

            return queryTokens.every((token) =>
                tokenVariants(token).some((variant) =>
                    haystacks.some((text) => text.includes(variant))
                )
            );
        });
    }, [isEnglish, normalizedQuery, normalizedSections]);

    useEffect(() => {
        if (!filteredSections.length) return;
        if (filteredSections.some((section) => section.id === activeSectionId)) return;
        setActiveSectionId(filteredSections[0].id);
    }, [filteredSections, activeSectionId]);

    useEffect(() => {
        if (!selectedLineSectionId) return;
        if (filteredSections.some((section) => section.id === selectedLineSectionId)) return;
        setSelectedLineSectionId(null);
    }, [filteredSections, selectedLineSectionId]);

    useEffect(() => {
        if (!normalizedQuery) return;
        if (filteredSections.length !== 1) return;

        const onlySectionId = filteredSections[0].id;
        if (activeSectionId !== onlySectionId) {
            setActiveSectionId(onlySectionId);
        }
        if (selectedLineSectionId !== onlySectionId) {
            setSelectedLineSectionId(onlySectionId);
        }
    }, [activeSectionId, filteredSections, normalizedQuery, selectedLineSectionId]);

    const activeSection = filteredSections.find((section) => section.id === activeSectionId) ?? filteredSections[0] ?? normalizedSections[0];
    const activeSectionMembers = (activeSection?.members ?? []).filter((member) => !isVacantMember(member));
    const activeSectionIndex = normalizedSections.findIndex((section) => section.id === activeSection.id);
    const activePalette = INFOGRAPHIC_COLORS[(activeSectionIndex >= 0 ? activeSectionIndex : 0) % INFOGRAPHIC_COLORS.length];
    const sectionAccentColorMap = useMemo(
        () =>
            normalizedSections.reduce<Record<string, string>>((accumulator, section, index) => {
                accumulator[section.id] = INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length].to;
                return accumulator;
            }, {}),
        [normalizedSections]
    );
    const getSectionAccentColor = (sectionId: string) => sectionAccentColorMap[sectionId] ?? '#1170b0';
    const highlightedSectionId = selectedLineSectionId;
    const highlightedLineColor = highlightedSectionId ? getSectionAccentColor(highlightedSectionId) : '#1170b0';
    const mapWidth = 1220;
    const mapHeight = 1100;
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    const mapHorizontalBias = -40;
    const chairmanCenterX = centerX + mapHorizontalBias;
    const centerCardWidth = 220;
    const centerCardHeight = 98;
    const nodeWidth = 180;
    const nodeHeight = 88;
    const nodeHorizontalGap = 60;
    const nodeVerticalGap = 70;

    const ringNodes = useMemo(() => {
        const sections = normalizedSections;
        if (!sections.length) return [];

        const outerCount = sections.length <= 8 ? sections.length : Math.ceil(sections.length * 0.62);
        const innerCount = sections.length - outerCount;
        const minArc = nodeWidth + nodeHorizontalGap;
        const innerRadius = innerCount > 0
            ? Math.max(250, (minArc * innerCount) / (Math.PI * 2))
            : 0;
        const outerRadius = Math.max(
            innerCount > 0 ? innerRadius + nodeHeight + nodeVerticalGap + 30 : 350,
            (minArc * Math.max(outerCount, 1)) / (Math.PI * 2)
        );

        const nodes = sections.map((section, index) => {
            const isOuter = index < outerCount || innerCount === 0;
            const ringIndex = isOuter ? index : index - outerCount;
            const ringTotal = isOuter ? Math.max(outerCount, 1) : Math.max(innerCount, 1);
            const radius = isOuter ? outerRadius : innerRadius;
            const angle = ((Math.PI * 2) / ringTotal) * ringIndex - Math.PI / 2 + (isOuter ? 0 : Math.PI / ringTotal);

            return {
                section,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });

        const minDx = nodeWidth + 24;
        const minDy = nodeHeight + 24;
        const clampMinX = (nodeWidth / 2) + 20;
        const clampMaxX = mapWidth - (nodeWidth / 2) - 20;
        const clampMinY = (nodeHeight / 2) + 24;
        const clampMaxY = mapHeight - (nodeHeight / 2) - 24;
        const centerAvoidX = (centerCardWidth / 2) + 72;
        const centerAvoidY = (centerCardHeight / 2) + 110;

        for (let iter = 0; iter < 140; iter += 1) {
            nodes.forEach((node) => {
                const dx = node.x - centerX;
                const dy = node.y - centerY;
                if (Math.abs(dx) < centerAvoidX && Math.abs(dy) < centerAvoidY) {
                    if (Math.abs(dx) >= Math.abs(dy)) {
                        node.x += (Math.sign(dx) || 1) * 2.2;
                    } else {
                        node.y += (Math.sign(dy) || 1) * 2.2;
                    }
                }
            });

            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const first = nodes[i];
                    const second = nodes[j];
                    const dx = second.x - first.x;
                    const dy = second.y - first.y;
                    const overlapX = minDx - Math.abs(dx);
                    const overlapY = minDy - Math.abs(dy);
                    if (overlapX <= 0 || overlapY <= 0) continue;

                    const nx = dx === 0 ? (i % 2 === 0 ? 1 : -1) : Math.sign(dx);
                    const ny = dy === 0 ? (j % 2 === 0 ? 1 : -1) : Math.sign(dy);
                    const pushX = (overlapX / 2) + 0.8;
                    const pushY = (overlapY / 2) + 0.8;

                    first.x -= nx * pushX;
                    second.x += nx * pushX;
                    first.y -= ny * pushY;
                    second.y += ny * pushY;
                }
            }

            nodes.forEach((node) => {
                node.x = Math.min(clampMaxX, Math.max(clampMinX, node.x));
                node.y = Math.min(clampMaxY, Math.max(clampMinY, node.y));
            });
        }

        const lowerDistributionIds = new Set(['labs-quality', 'hr-sector']);
        nodes.forEach((node) => {
            if (!lowerDistributionIds.has(node.section.id)) return;
            node.x += node.x < centerX ? -70 : 70;
            node.y = Math.min(clampMaxY - 40, node.y + 180);
        });

        const upperNudgeIds = new Set(['technical-support', 'south-sector']);
        nodes.forEach((node) => {
            if (!upperNudgeIds.has(node.section.id)) return;
            node.y = Math.max(clampMinY + 40, node.y - 100);
        });

        const bounds = nodes.reduce(
            (accumulator, node) => ({
                minX: Math.min(accumulator.minX, node.x - (nodeWidth / 2)),
                maxX: Math.max(accumulator.maxX, node.x + (nodeWidth / 2)),
                minY: Math.min(accumulator.minY, node.y - (nodeHeight / 2)),
                maxY: Math.max(accumulator.maxY, node.y + (nodeHeight / 2))
            }),
            {
                minX: Number.POSITIVE_INFINITY,
                maxX: Number.NEGATIVE_INFINITY,
                minY: Number.POSITIVE_INFINITY,
                maxY: Number.NEGATIVE_INFINITY
            }
        );

        const currentCenterX = (bounds.minX + bounds.maxX) / 2;
        const currentCenterY = (bounds.minY + bounds.maxY) / 2;
        const targetShiftX = centerX - currentCenterX;
        const targetShiftY = centerY - currentCenterY;

        const maxShiftLeft = Math.min(...nodes.map((node) => node.x - clampMinX));
        const maxShiftRight = Math.min(...nodes.map((node) => clampMaxX - node.x));
        const maxShiftUp = Math.min(...nodes.map((node) => node.y - clampMinY));
        const maxShiftDown = Math.min(...nodes.map((node) => clampMaxY - node.y));

        const appliedShiftX = Math.max(-maxShiftLeft, Math.min(maxShiftRight, targetShiftX));
        const appliedShiftY = Math.max(-maxShiftUp, Math.min(maxShiftDown, targetShiftY));
        const leftBias = mapHorizontalBias;
        const finalShiftX = Math.max(-maxShiftLeft, Math.min(maxShiftRight, appliedShiftX + leftBias));

        nodes.forEach((node) => {
            node.x += finalShiftX;
            node.y += appliedShiftY;
        });

        // Keep result cards visible after search recentering; prevent overlap with the chairman card.
        nodes.forEach((node) => {
            const dxFromCenter = node.x - centerX;
            const dyFromCenter = node.y - centerY;
            if (Math.abs(dxFromCenter) < centerAvoidX && Math.abs(dyFromCenter) < centerAvoidY) {
                if (Math.abs(dxFromCenter) >= Math.abs(dyFromCenter)) {
                    node.x = centerX + (Math.sign(dxFromCenter) || -1) * centerAvoidX;
                } else {
                    node.y = centerY + (Math.sign(dyFromCenter) || -1) * centerAvoidY;
                }
            }

            node.x = Math.min(clampMaxX, Math.max(clampMinX, node.x));
            node.y = Math.min(clampMaxY, Math.max(clampMinY, node.y));
        });

        return nodes;
    }, [
        centerCardHeight,
        centerCardWidth,
        centerX,
        centerY,
        normalizedSections,
        mapHorizontalBias,
        mapHeight,
        mapWidth,
        nodeHeight,
        nodeHorizontalGap,
        nodeVerticalGap,
        nodeWidth
    ]);

    const visibleSectionIds = useMemo(
        () => new Set(filteredSections.map((section) => section.id)),
        [filteredSections]
    );
    const visibleRingNodes = useMemo(
        () => ringNodes.filter((node) => visibleSectionIds.has(node.section.id)),
        [ringNodes, visibleSectionIds]
    );

    const highlightedNodeIndex = visibleRingNodes.findIndex((node) => node.section.id === highlightedSectionId);
    const highlightedNode = highlightedNodeIndex >= 0 ? visibleRingNodes[highlightedNodeIndex] : null;

    const getRectEdgeOffset = (dx: number, dy: number, halfWidth: number, halfHeight: number) => {
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX === 0 && absY === 0) return { x: 0, y: 0 };
        const scaleX = absX === 0 ? Number.POSITIVE_INFINITY : halfWidth / absX;
        const scaleY = absY === 0 ? Number.POSITIVE_INFINITY : halfHeight / absY;
        const scale = Math.min(scaleX, scaleY);
        return { x: dx * scale, y: dy * scale };
    };

    const highlightedLine = useMemo(() => {
        if (!highlightedNode) return null;

        const start = getRectEdgeOffset(
            highlightedNode.x - chairmanCenterX,
            highlightedNode.y - centerY,
            centerCardWidth / 2,
            centerCardHeight / 2
        );
        const end = getRectEdgeOffset(
            chairmanCenterX - highlightedNode.x,
            centerY - highlightedNode.y,
            nodeWidth / 2,
            nodeHeight / 2
        );

        const dx = highlightedNode.x - chairmanCenterX;
        const dy = highlightedNode.y - centerY;
        const length = Math.hypot(dx, dy) || 1;
        const ux = dx / length;
        const uy = dy / length;
        const startIntoChairmanCard = 2;
        const endIntoTargetCard = 2;

        return {
            x1: chairmanCenterX + start.x - (ux * startIntoChairmanCard),
            y1: centerY + start.y - (uy * startIntoChairmanCard),
            x2: highlightedNode.x + end.x + (ux * endIntoTargetCard),
            y2: highlightedNode.y + end.y + (uy * endIntoTargetCard),
            color: highlightedLineColor
        };
    }, [
        centerCardHeight,
        centerCardWidth,
        chairmanCenterX,
        centerY,
        highlightedLineColor,
        highlightedNode,
        nodeHeight,
        nodeWidth
    ]);

    return (
        <>
            <Header />
            <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.12),_transparent_45%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_52%,#ffffff_100%)] py-8" dir={isEnglish ? 'ltr' : 'rtl'}>
                <span className="pointer-events-none absolute -top-20 left-[-120px] h-64 w-64 rounded-full bg-[#1170b0]/10 blur-3xl"></span>
                <span className="pointer-events-none absolute -bottom-24 right-[-100px] h-64 w-64 rounded-full bg-[#0f766e]/10 blur-3xl"></span>

                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="px-6 py-7 text-white sm:px-8" style={headerGradientStyle}>
                            <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
                                {t('خريطة ذهنية تفاعلية', 'Interactive mind map')}
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{t('الهيكل التنظيمي للشركة', 'Company Organizational Structure')}</h1>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
                                    <div className="w-full md:flex-1">
                                        <label htmlFor="org-search" className="mb-2 block text-xs font-bold text-slate-600">{t('بحث ذكي داخل القطاعات والادارات', 'Smart search across sectors and departments')}</label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0a3555]/70">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <path d="m21 21-4.35-4.35"></path>
                                                </svg>
                                            </span>
                                            <input
                                                id="org-search"
                                                type="search"
                                                value={query}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder={t('اكتب قطاعًا أو إدارةً أو منطقةً...', 'Type a sector, department, or area...')}
                                                className="h-10 w-full rounded-full border border-[#d7b05a]/55 bg-white pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-[#0a3555] focus:ring-2 focus:ring-[#0a3555]/15"
                                            />
                                        </div>
                                    </div>
                                    <a
                                        href={ORGANIZATION_PDF_DOWNLOAD_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0a3555] px-4 text-center text-sm font-extrabold text-white transition hover:bg-[#082b47] sm:w-auto"
                                    >
                                        {t('تحميل ملف الهيكل التنظيمي (PDF)', 'Download organizational structure file (PDF)')}
                                    </a>
                                </div>
                            </div>

                            <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                                <h2 className="text-lg font-extrabold text-slate-800 sm:text-xl">{t('الخريطة الذهنية للهيكل التنظيمي', 'Organizational structure mind map')}</h2>
                                <p className="mt-1 text-center text-sm text-slate-600">{t('ارشادات تصفح الخريطة : اضغط على أي كرت لعرض الأسماء والوظائف الخاصة به بالاسفل مع تثبيت خط الربط من رئيس مجلس الإدارة.', 'Map navigation tips: click any card to display its names and job titles below while keeping the connection line from the Chairman fixed.')}</p>

                                <div className="org-map-mobile mt-5 space-y-3 md:hidden">
                                    {filteredSections.map((section) => {
                                        const isLineSelected = section.id === selectedLineSectionId;
                                        const selectedAccentColor = getSectionAccentColor(section.id);
                                        return (
                                            <button
                                                key={`mobile-map-${section.id}`}
                                                type="button"
                                                onClick={() => { setActiveSectionId(section.id); setSelectedLineSectionId(section.id); }}
                                                className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:bg-slate-50 hover:shadow-sm"
                                                style={isLineSelected ? { borderColor: 'transparent', backgroundColor: `${selectedAccentColor}20`, boxShadow: `0 0 0 2px ${selectedAccentColor}55` } : undefined}
                                            >
                                                <h3 className="text-sm font-extrabold text-slate-800">{translateSectionTitle(section.title, isEnglish)}</h3>
                                            </button>
                                        );
                                    })}
                                    {!filteredSections.length && (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                                            {t('لا توجد نتائج مطابقة للبحث.', 'No matching search results were found.')}
                                        </div>
                                    )}
                                </div>

                                <div className="org-map-desktop mt-5 hidden md:block">
                                    <div className="mx-auto w-full max-w-[1220px]">
                                        <div className="relative h-[1100px] rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_center,_rgba(17,112,176,0.13),_rgba(255,255,255,0.97)_55%)]">
                                            <svg className="org-map-svg pointer-events-none absolute inset-0 z-[5] h-full w-full">
                                                {highlightedLine ? (
                                                    <>
                                                        <line
                                                            x1={highlightedLine.x1}
                                                            y1={highlightedLine.y1}
                                                            x2={highlightedLine.x2}
                                                            y2={highlightedLine.y2}
                                                            stroke="#ffffff"
                                                            strokeWidth={4.4}
                                                            strokeOpacity={0.7}
                                                            strokeLinecap="round"
                                                        />
                                                        <line
                                                            x1={highlightedLine.x1}
                                                            y1={highlightedLine.y1}
                                                            x2={highlightedLine.x2}
                                                            y2={highlightedLine.y2}
                                                            stroke={highlightedLine.color}
                                                            strokeWidth={2.4}
                                                            strokeOpacity={1}
                                                            strokeLinecap="round"
                                                        />
                                                    </>
                                                ) : null}
                                            </svg>

                                            <article
                                                className="absolute z-20 flex flex-col justify-center rounded-2xl border border-slate-300 bg-white p-3 text-center shadow-lg"
                                                style={{ top: centerY - (centerCardHeight / 2), left: chairmanCenterX - (centerCardWidth / 2), width: centerCardWidth, height: centerCardHeight }}
                                            >
                                                <h3 className="mt-1 text-sm font-extrabold text-[#0a3555]">{t('رئيس مجلس الإدارة', 'Chairman of the Board')}</h3>
                                                <p className="mt-1 text-xs font-semibold text-slate-700">{CHAIRMAN?.name ? translateMemberName(CHAIRMAN.name, isEnglish) : t('غير محدد', 'Not specified')}</p>
                                            </article>

                                            {visibleRingNodes.map(({ section, x, y }) => {
                                                const isLineSelected = section.id === selectedLineSectionId;
                                                const selectedAccentColor = getSectionAccentColor(section.id);
                                                const nodeTitle = translateSectionTitle(section.title, isEnglish).trim() || t('بدون عنوان', 'Untitled');
                                                return (
                                                    <button
                                                        key={`desktop-map-${section.id}`}
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveSectionId(section.id);
                                                            setSelectedLineSectionId(section.id);
                                                        }}
                                                        title={nodeTitle}
                                                        className="absolute z-10 flex h-[88px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 text-center shadow-md transition hover:bg-slate-50 hover:shadow-lg"
                                                        style={{
                                                            width: nodeWidth,
                                                            left: x - nodeWidth / 2,
                                                            top: y - nodeHeight / 2,
                                                            ...(isLineSelected
                                                                ? {
                                                                    borderColor: 'transparent',
                                                                    backgroundColor: `${selectedAccentColor}20`,
                                                                    boxShadow: `0 0 0 2px ${selectedAccentColor}55`
                                                                }
                                                                : {})
                                                        }}
                                                    >
                                                        <h4 className="text-xs font-extrabold leading-5 text-slate-800 break-words">{nodeTitle}</h4>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {activeSection ? (
                                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <header
                                        className="px-5 py-4"
                                        style={{ background: `linear-gradient(140deg, ${activePalette.from}, ${activePalette.to})` }}
                                    >
                                        <h2 className="text-lg font-extrabold text-white sm:text-xl">{translateSectionTitle(activeSection.title, isEnglish)}</h2>
                                    </header>

                                    <div className="space-y-4 p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {activeSectionMembers.slice(0, 6).map((member) => (
                                                <span
                                                    key={`${activeSection.id}-${member.name}-role`}
                                                    className="rounded-full border px-2 py-1 text-[11px] font-bold text-slate-700"
                                                    style={{ backgroundColor: activePalette.soft, borderColor: '#dbeafe' }}
                                                >
                                                    {translateRole(member.role, isEnglish)}
                                                </span>
                                            ))}
                                        </div>
                                        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {activeSectionMembers.map((member) => (
                                                <li
                                                    key={`${activeSection.id}-${member.name}`}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                                                >
                                                    <p className="text-sm font-extrabold text-slate-800">{translateMemberName(member.name, isEnglish)}</p>
                                                    <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{translateRole(member.role, isEnglish)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ) : (
                                <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                                    {t('لا توجد بيانات مطابقة للبحث الحالي.', 'No data matches the current search.')}
                                </article>
                            )}

                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default OrganizationStructurePage;
