import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('hi') ? 'hi' : 'en';

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  return (
    <div className="inline-flex items-center rounded-lg bg-emerald-950/40 p-1 border border-emerald-500/30">
      <button
        type="button"
        onClick={() => toggleLanguage('hi')}
        className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 transition-colors ${
          currentLang === 'hi'
            ? 'bg-amber-400 text-gray-950 shadow-sm'
            : 'text-emerald-100 hover:text-white'
        }`}
        aria-label="Switch to Hindi"
      >
        <span>हिंदी</span>
      </button>
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 transition-colors ${
          currentLang === 'en'
            ? 'bg-amber-400 text-gray-950 shadow-sm'
            : 'text-emerald-100 hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        <span>EN</span>
      </button>
    </div>
  );
}
