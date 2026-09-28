import React, { createContext, useContext, useState, useEffect } from 'react';
import { fr } from './dictionaries/fr';
import { ar } from './dictionaries/ar';

export type Locale = 'fr' | 'ar';
export type Dictionary = typeof fr;

interface I18nContextValue {
  locale: Locale;
  isRtl: boolean;
  t: Dictionary;
  setLocale: (loc: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('edumanage_locale');
      return saved === 'ar' ? 'ar' : 'fr';
    } catch {
      return 'fr';
    }
  });

  const isRtl = locale === 'ar';
  const t = isRtl ? (ar as Dictionary) : fr;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('edumanage_locale', locale);
    } catch {}
  }, [locale, isRtl]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  };

  return (
    <I18nContext.Provider value={{ locale, isRtl, t, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
