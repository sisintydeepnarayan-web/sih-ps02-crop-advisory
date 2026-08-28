import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ActionCard({
  to,
  onClick,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-emerald-100 text-emerald-950',
  cardColor = 'bg-white',
  iconBgColor = 'bg-emerald-100 text-emerald-900',
}) {
  const content = (
    <div
      className={`relative w-full min-h-[72px] rounded-3xl p-4 sm:p-5 border-2 border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md active:bg-gray-50 transition-colors flex items-center justify-between gap-3.5 ${cardColor}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className={`p-3 rounded-2xl shrink-0 ${iconBgColor}`}>
            <Icon size={26} className="stroke-[2.5]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-gray-950 leading-tight">
              {title}
            </h3>
            {badge && (
              <span className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wide ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-700 mt-1 font-semibold line-clamp-2 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="text-gray-500 shrink-0">
        <ChevronRight size={22} className="stroke-[2.5]" />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-3xl">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-3xl"
    >
      {content}
    </button>
  );
}
