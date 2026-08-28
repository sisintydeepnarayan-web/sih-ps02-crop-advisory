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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto grid grid-cols-6 items-center px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[54px] py-1 px-0.5 rounded-xl text-center transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-950 font-black'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50 font-bold'
                }`
              }
            >
              <Icon size={20} className="stroke-[2.4] shrink-0" />
              <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 truncate max-w-[54px] sm:max-w-none">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
