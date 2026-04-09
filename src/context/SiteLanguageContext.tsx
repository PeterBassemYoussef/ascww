import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type SiteLanguage = 'ar' | 'en';

type SiteLanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | undefined>(undefined);
const SITE_LANGUAGE_STORAGE_KEY = 'ascww-site-language';

const getInitialLanguage = (): SiteLanguage => {
  if (typeof window === 'undefined') return 'ar';

  try {
    const storedLanguage = window.localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY);
    return storedLanguage === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
};

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(SITE_LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage failures and keep language in memory.
    }

    document.documentElement.lang = language === 'en' ? 'en' : 'ar';
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  }, [language]);

  return (
    <SiteLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </SiteLanguageContext.Provider>
  );
}

export function useSiteLanguage() {
  const context = useContext(SiteLanguageContext);

  if (!context) {
    throw new Error('useSiteLanguage must be used within a SiteLanguageProvider');
  }

  return context;
}
