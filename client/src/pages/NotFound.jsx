import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 bg-emerald-100 text-emerald-800 rounded-3xl mb-4">
        <Sprout size={48} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2">404</h2>
      <p className="text-base text-gray-600 font-bold mb-6">
        Page not found / पृष्ठ नहीं मिला
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base shadow-md active:scale-95 transition-transform"
      >
        <Home size={20} />
        <span>{t('nav.dashboard')}</span>
      </Link>
    </div>
  );
}
