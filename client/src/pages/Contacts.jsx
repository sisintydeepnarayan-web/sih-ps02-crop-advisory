import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, MapPin, Clock, ShieldAlert, Phone, UserCheck, MessageSquare } from 'lucide-react';
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
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      id: 'kvk',
      name: t('contacts.kvkName'),
      number: '18001801551',
      displayNumber: '1800-180-1551',
      desc: t('contacts.kvkHours'),
      priority: false,
      badge: 'District KVK',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'agridept',
      name: t('contacts.agriDeptName'),
      number: '01123381012',
      displayNumber: '011-23381012',
      desc: 'Central Ministry & State Extension Support',
      priority: false,
      badge: 'Govt Extension',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'distress',
      name: t('contacts.distressHelpline'),
      number: '18002005142',
      displayNumber: '1800-200-5142',
      desc: 'Counseling & Emergency Crop Distress Assistance',
      priority: true,
      badge: 'Crisis Support',
      badgeColor: 'bg-purple-100 text-purple-800',
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
        {/* Emergency top banner */}
        <div className="bg-red-600 text-white rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-red-700/80 px-2.5 py-1 rounded-full w-fit">
            <ShieldAlert size={14} />
            <span>Urgent Farmer Support</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Kisan Call Center (1551)
          </h3>
          <p className="text-xs sm:text-sm text-red-100 font-medium">
            Talk directly to agricultural scientists and agronomists in your mother tongue.
          </p>
          <a
            href="tel:1551"
            className="w-full h-14 bg-white text-red-700 hover:bg-red-50 rounded-2xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md mt-2"
          >
            <PhoneCall size={22} className="stroke-[2.5]" />
            <span>Call 1551 Now (Toll Free)</span>
          </a>
        </div>

        {/* Directory cards */}
        <div className="space-y-3.5">
          {contactsList.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded ${contact.badgeColor}`}>
                    {contact.badge}
                  </span>
                  <h4 className="text-lg font-black text-gray-900 mt-1">
                    {contact.name}
                  </h4>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">
                    {contact.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`tel:${contact.number}`}
                  className="flex-1 h-13 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
                >
                  <Phone size={18} />
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
