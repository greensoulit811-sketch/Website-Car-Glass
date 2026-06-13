import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSettings } from '@/hooks/useDatabase';
import { translations, Language } from '@/lib/translations';
import { useLocation } from 'react-router-dom';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: (key) => key,
  isRTL: false,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useSettings();
  const location = useLocation();
  const defaultLang = ((settings as any)?.language || 'en') as Language;
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('visitor_language');
    return (stored === 'bn' || stored === 'en') ? stored : defaultLang;
  });
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const stored = localStorage.getItem('visitor_language');
    if (!stored && settings) {
      setLanguageState(defaultLang);
    }
  }, [defaultLang]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('visitor_language', lang);
    setLanguageState(lang);
  };

  // Bengali and English are both LTR, no RTL needed
  const isRTL = false;

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language, isAdminRoute]);

  return (
    <LanguageContext.Provider value={{ language, t, isRTL, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
