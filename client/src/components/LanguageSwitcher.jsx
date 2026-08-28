import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('mr') 
    ? 'mr' 
    : i18n.language?.startsWith('hi') 
    ? 'hi' 
    : 'en';

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  return (
    <div className="inline-flex items-center rounded-2xl bg-emerald-950/60 p-1 border border-emerald-500/40 shadow-sm">
      <button
        type="button"
        onClick={() => toggleLanguage('hi')}
        className={`min-h-[38px] px-3 rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center ${
          currentLang === 'hi'
            ? 'bg-amber-400 text-gray-950 shadow-sm font-black'
            : 'text-emerald-100 hover:text-white font-bold'
        }`}
        aria-label="Switch to Hindi"
      >
        <span>हिंदी</span>
      </button>
      <button
        type="button"
        onClick={() => toggleLanguage('mr')}
        className={`min-h-[38px] px-3 rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center ${
          currentLang === 'mr'
            ? 'bg-amber-400 text-gray-950 shadow-sm font-black'
            : 'text-emerald-100 hover:text-white font-bold'
        }`}
        aria-label="Switch to Marathi"
      >
        <span>मराठी</span>
      </button>
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`min-h-[38px] px-3 rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center ${
          currentLang === 'en'
            ? 'bg-amber-400 text-gray-950 shadow-sm font-black'
            : 'text-emerald-100 hover:text-white font-bold'
        }`}
        aria-label="Switch to English"
      >
        <span>EN</span>
      </button>
    </div>
  );
}
