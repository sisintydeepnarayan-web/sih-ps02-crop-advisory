import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PageHeader({ title, subtitle, icon: Icon, showBack = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3.5 mb-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('common.back')}
            className="p-2 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>
        )}
        {Icon && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <Icon size={24} className="stroke-[2.5]" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-snug mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
