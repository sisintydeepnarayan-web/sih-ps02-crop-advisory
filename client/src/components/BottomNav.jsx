import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  FileText, 
  ScanLine, 
  PhoneCall 
} from 'lucide-react';

export default function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/advisory', label: t('nav.advisory'), icon: Sprout },
    { to: '/market', label: t('nav.market'), icon: TrendingUp },
    { to: '/schemes', label: t('nav.schemes'), icon: FileText },
    { to: '/disease-check', label: t('nav.diseaseCheck'), icon: ScanLine },
    { to: '/contacts', label: t('nav.contacts'), icon: PhoneCall },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg pb-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-around px-1 py-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[62px] text-center transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-extrabold shadow-sm scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`
              }
            >
              <Icon size={22} className="stroke-[2.2] shrink-0" />
              <span className="text-[11px] leading-tight mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
