import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, PhoneCall, Radio } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { checkBackendHealth } from '../api/client';

export default function Navbar() {
  const { t } = useTranslation();
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendOnline(res?.status === 'ok');
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md">
      {/* Top micro emergency alert bar */}
      <div className="bg-emerald-900 px-3 py-1 text-xs flex justify-between items-center border-b border-emerald-700/50">
        <div className="flex items-center gap-1.5 font-medium text-emerald-200">
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline === true
                ? 'bg-green-400 animate-pulse'
                : backendOnline === false
                ? 'bg-amber-400'
                : 'bg-gray-400'
            }`}
            title={backendOnline ? 'Backend Online' : 'Connecting to API'}
          />
          <span className="truncate">
            {t('app.subtitle')}
          </span>
        </div>
        <a
          href="tel:1551"
          className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
        >
          <PhoneCall size={12} />
          <span>1551</span>
        </a>
      </div>

      {/* Main header row */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-white text-emerald-800 p-2 rounded-xl shadow-sm group-active:scale-95">
            <Sprout size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none text-white">
              {t('app.name')}
            </h1>
            <p className="text-xs text-emerald-200 font-medium hidden sm:block mt-0.5">
              {t('common.offlineNotice')}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
