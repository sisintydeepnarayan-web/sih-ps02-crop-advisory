import React from 'react';
import { AlertTriangle, ShieldAlert, CloudRain, Bug, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AlertBanner({
  type = 'weather', // 'weather' | 'pest' | 'market' | 'general'
  title,
  message,
  actionText,
  actionLink,
  severity = 'high', // 'high' | 'medium' | 'info'
}) {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (type) {
      case 'weather':
        return CloudRain;
      case 'pest':
        return Bug;
      default:
        return AlertTriangle;
    }
  };

  const Icon = getIcon();

  const colors = {
    high: 'bg-red-50 border-red-300 text-red-950',
    medium: 'bg-amber-50 border-amber-300 text-amber-950',
    info: 'bg-blue-50 border-blue-300 text-blue-950',
  }[severity];

  const badgeColor = {
    high: 'bg-red-600 text-white',
    medium: 'bg-amber-600 text-white',
    info: 'bg-blue-600 text-white',
  }[severity];

  const iconBg = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  }[severity];

  return (
    <div className={`rounded-2xl border-2 p-4 shadow-sm relative overflow-hidden ${colors}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
          <Icon size={26} className="stroke-[2.5]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${badgeColor}`}>
              {t('dashboard.activeAlertsTitle')}
            </span>
            {title && <span className="font-extrabold text-sm sm:text-base">{title}</span>}
          </div>
          <p className="text-sm font-semibold leading-relaxed text-gray-800">
            {message}
          </p>

          {actionLink && (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-1.5 font-black text-xs sm:text-sm mt-2.5 text-red-700 hover:text-red-900 underline underline-offset-4"
            >
              <span>{actionText || t('common.viewDetails')}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
