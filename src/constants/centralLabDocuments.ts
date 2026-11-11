export const CENTRAL_LAB_DOCUMENTS = [
  {
    id: 1,
    slug: 'overview',
    ar: 'نبذة المعمل المركزي لمياه الشرب',
    en: 'Central Drinking Water Laboratory Overview',
  },
  {
    id: 2,
    slug: 'sampling-and-coding',
    ar: 'معمل سحب وتكويد العينات',
    en: 'Sample Collection and Coding Laboratory',
  },
  {
    id: 3,
    slug: 'organic-lab',
    ar: 'المعمل العضوي',
    en: 'Organic Laboratory',
  },
  {
    id: 4,
    slug: 'organic-equipment',
    ar: 'أجهزة المعمل العضوي',
    en: 'Organic Laboratory Equipment',
  },
  {
    id: 5,
    slug: 'inorganic-lab',
    ar: 'معمل غير العضوي',
    en: 'Inorganic Laboratory',
  },
  {
    id: 6,
    slug: 'bacteriology-lab',
    ar: 'المعمل البكتريولوجي',
    en: 'Bacteriology Laboratory',
  },
  {
    id: 7,
    slug: 'biology-lab',
    ar: 'المعمل البيولوجي',
    en: 'Biology Laboratory',
  },
  {
    id: 8,
    slug: 'quality-management',
    ar: 'إدارة الجودة',
    en: 'Quality Management',
  },
  {
    id: 9,
    slug: 'sampling-equipment',
    ar: 'أجهزة سحب وتكويد العينات',
    en: 'Sample Collection and Coding Equipment',
  },
  {
    id: 10,
    slug: 'inorganic-equipment',
    ar: 'أجهزة المعمل غير العضوي',
    en: 'Inorganic Laboratory Equipment',
  },
  {
    id: 11,
    slug: 'bacteriology-equipment',
    ar: 'أجهزة المعمل البكتريولوجي',
    en: 'Bacteriology Laboratory Equipment',
  },
  {
    id: 12,
    slug: 'biology-equipment',
    ar: 'أجهزة المعمل البيولوجي',
    en: 'Biology Laboratory Equipment',
  },
] as const;

export const getCentralLabDocumentPath = (
  document: Pick<(typeof CENTRAL_LAB_DOCUMENTS)[number], 'slug'>,
) => `/laboratories-sector/central-lab/${document.slug}`;
