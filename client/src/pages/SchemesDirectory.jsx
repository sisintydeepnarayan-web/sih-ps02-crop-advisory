import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, ShieldCheck, CreditCard, Sprout, ExternalLink, HelpCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function SchemesDirectory() {
  const { t } = useTranslation();

  const schemes = [
    {
      id: 'pm-kisan',
      title: t('schemes.pmKisanTitle'),
      desc: t('schemes.pmKisanDesc'),
      icon: Sprout,
      benefit: '₹6,000 / Year',
      benefitColor: 'bg-emerald-100 text-emerald-800',
      officialPortal: 'https://pmkisan.gov.in',
      portalLabel: 'pmkisan.gov.in',
    },
    {
      id: 'pmfby',
      title: t('schemes.pmfbyTitle'),
      desc: t('schemes.pmfbyDesc'),
      icon: ShieldCheck,
      benefit: '100% Risk Cover',
      benefitColor: 'bg-blue-100 text-blue-800',
      officialPortal: 'https://pmfby.gov.in',
      portalLabel: 'pmfby.gov.in',
    },
    {
      id: 'kcc',
      title: t('schemes.kccTitle'),
      desc: t('schemes.kccDesc'),
      icon: CreditCard,
      benefit: '4% Concessional Interest',
      benefitColor: 'bg-purple-100 text-purple-800',
      officialPortal: 'https://myscheme.gov.in',
      portalLabel: 'myscheme.gov.in',
    },
    {
      id: 'soil-card',
      title: t('schemes.soilCardTitle'),
      desc: t('schemes.soilCardDesc'),
      icon: FileText,
      benefit: 'Free Soil Testing',
      benefitColor: 'bg-amber-100 text-amber-800',
      officialPortal: 'https://soilhealth.dac.gov.in',
      portalLabel: 'soilhealth.dac.gov.in',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('schemes.title')}
        subtitle={t('schemes.subtitle')}
        icon={FileText}
      />

      <div className="px-4 space-y-4">
        {schemes.map((scheme) => {
          const Icon = scheme.icon;
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0">
                  <Icon size={26} className="stroke-[2.3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                      {scheme.title}
                    </h3>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${scheme.benefitColor}`}>
                      {scheme.benefit}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {scheme.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-500">Official Portal</span>
                <a
                  href={scheme.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span>{scheme.portalLabel}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
