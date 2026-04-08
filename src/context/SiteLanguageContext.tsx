import { createContext, useContext, useState, type ReactNode } from 'react';

export type SiteLanguage = 'ar' | 'en';

type SiteLanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | undefined>(undefined);

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>('ar');

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
