'use client';

import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
        <button
          onClick={() => setLanguage('de')}
          className={`px-2 py-1 text-sm font-medium rounded transition-all ${
            language === 'de'
              ? 'bg-white text-primary-900'
              : 'text-white/80 hover:text-white'
          }`}
          aria-label="Deutsch"
        >
          DE
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-sm font-medium rounded transition-all ${
            language === 'en'
              ? 'bg-white text-primary-900'
              : 'text-white/80 hover:text-white'
          }`}
          aria-label="English"
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('de')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          language === 'de'
            ? 'bg-accent-500 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        aria-label="Deutsch"
      >
        <span className="text-lg">🇩🇪</span>
        Deutsch
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-accent-500 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        aria-label="English"
      >
        <span className="text-lg">🇬🇧</span>
        English
      </button>
    </div>
  );
}

