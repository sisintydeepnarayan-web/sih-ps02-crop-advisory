import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Phone, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Contacts() {
  const { t } = useTranslation();

  const contactsList = [
    {
      id: 'kcc',
      name: t('contacts.kccName'),
      number: '1551',
      desc: t('contacts.kccHours'),
      priority: true,
      badge: '24x7 Toll-Free',
      badgeColor: 'bg-red-100 text-red-950',
    },
    {
      id: 'kvk',
      name: t('contacts.kvkName'),
      number: '18001801551',
      displayNumber: '1800-180-1551',
      desc: t('contacts.kvkHours'),
      priority: false,
      badge: 'District KVK',
      badgeColor: 'bg-emerald-100 text-emerald-950',
    },
    {
      id: 'agridept',
      name: t('contacts.agriDeptName'),
      number: '01123381012',
      displayNumber: '011-23381012',
      desc: 'Central Ministry & State Agriculture Extension Support',
      priority: false,
      badge: 'Govt Extension',
      badgeColor: 'bg-blue-100 text-blue-950',
    },
    {
      id: 'distress',
      name: t('contacts.distressHelpline'),
      number: '18002005142',
      displayNumber: '1800-200-5142',
      desc: 'Counseling & Emergency Crop Distress Assistance',
      priority: true,
      badge: 'Crisis Support',
      badgeColor: 'bg-purple-100 text-purple-950',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('contacts.title')}
        subtitle={t('contacts.subtitle')}
        icon={PhoneCall}
      />

      <div className="px-4 space-y-4">
        {/* Emergency Top Banner */}
        <div className="bg-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 border-2 border-red-700">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-red-950/60 px-3 py-1 rounded-full w-fit border border-red-400/40 text-red-100">
            <ShieldAlert size={15} />
            <span>Emergency Farmer Support</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black leading-tight">
            Kisan Call Center (1551)
          </h3>
          <p className="text-xs sm:text-sm text-red-100 font-semibold leading-relaxed">
            Talk directly to agricultural scientists and agronomists in your mother tongue for free advice.
          </p>
          <a
            href="tel:1551"
            className="w-full min-h-[56px] bg-white text-red-900 hover:bg-red-50 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 active:bg-gray-100 transition-colors shadow-md mt-2"
          >
            <PhoneCall size={22} className="stroke-[2.5]" />
            <span>Call 1551 Now (Toll Free)</span>
          </a>
        </div>

        {/* Directory Cards */}
        <div className="space-y-4">
          {contactsList.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm space-y-3.5 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wide ${contact.badgeColor}`}>
                    {contact.badge}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-gray-950 mt-1.5 leading-tight">
                    {contact.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1 leading-snug">
                    {contact.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <a
                  href={`tel:${contact.number}`}
                  className="w-full min-h-[52px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-colors shadow-sm"
                >
                  <Phone size={20} className="stroke-[2.5]" />
                  <span>{contact.displayNumber || contact.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
