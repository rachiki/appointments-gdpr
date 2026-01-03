'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/i18n/translations';

const STORAGE_KEY = 'terminvergabe_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function loadLanguage(): Language {
  if (typeof window === 'undefined') return 'de';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    // Default to browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('de') ? 'de' : 'en';
  } catch {
    return 'de';
  }
}

function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage might be full or disabled
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLanguageState(loadLanguage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveLanguage(language);
      // Update html lang attribute
      document.documentElement.lang = language;
    }
  }, [language, isLoaded]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

