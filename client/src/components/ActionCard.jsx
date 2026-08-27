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
  badgeColor = 'bg-emerald-100 text-emerald-800',
  cardColor = 'bg-white',
  iconBgColor = 'bg-emerald-50 text-emerald-700',
  variant = 'default',
}) {
  const content = (
    <div
      className={`relative w-full rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between gap-4 ${cardColor}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className={`p-3 rounded-2xl shrink-0 ${iconBgColor}`}>
            <Icon size={28} className="stroke-[2.3]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              {title}
            </h3>
            {badge && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="text-gray-400 shrink-0">
        <ChevronRight size={24} className="stroke-[2.5]" />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
    >
      {content}
    </button>
  );
}
