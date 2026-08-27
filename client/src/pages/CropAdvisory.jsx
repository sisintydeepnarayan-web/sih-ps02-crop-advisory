import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Droplets, FlaskConical, Bug, ShieldAlert, CheckCircle2, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getStoredProfile } from '../utils/helpers';

export default function CropAdvisory() {
  const { t } = useTranslation();
  const profile = getStoredProfile() || { district: 'Varanasi', crop: 'wheat' };

  const advisoryItems = [
    {
      id: 'irrigation',
      title: t('advisory.irrigationStage'),
      desc: t('advisory.irrigationDesc'),
      icon: Droplets,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      iconBg: 'bg-blue-100 text-blue-700',
      tag: 'Immediate Action',
      tagColor: 'bg-blue-600 text-white',
    },
    {
      id: 'fertilizer',
      title: t('advisory.fertilizerStage'),
      desc: t('advisory.fertilizerDesc'),
      icon: FlaskConical,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconBg: 'bg-emerald-100 text-emerald-700',
      tag: 'Stage: Tillering',
      tagColor: 'bg-emerald-700 text-white',
    },
    {
      id: 'pest',
      title: t('advisory.pestWarning'),
      desc: t('advisory.pestDesc'),
      icon: Bug,
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      iconBg: 'bg-amber-100 text-amber-800',
      tag: 'Watch Closely',
      tagColor: 'bg-amber-600 text-white',
    },
    {
      id: 'sowing',
      title: t('advisory.sowingStage'),
      desc: t('advisory.sowingDesc'),
      icon: Sprout,
      color: 'bg-stone-50 border-stone-200 text-stone-900',
      iconBg: 'bg-stone-200 text-stone-800',
      tag: 'Preparation',
      tagColor: 'bg-stone-700 text-white',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('advisory.title')}
        subtitle={`${t('common.district')}: ${profile.district || 'All'} • ${profile.crop?.toUpperCase() || 'WHEAT'}`}
        icon={Sprout}
      />

      <div className="px-4 space-y-4">
        {/* Season status pill */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">{t('common.today')}</p>
              <h4 className="text-base font-black text-gray-900">Rabi Season 2026 Advisory</h4>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            Active
          </span>
        </div>

        {/* Advisory List */}
        <div className="space-y-3.5">
          {advisoryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rounded-3xl border-2 p-5 shadow-sm space-y-3 ${item.color}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl shrink-0 ${item.iconBg}`}>
                      <Icon size={26} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${item.tagColor}`}>
                        {item.tag}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-semibold leading-relaxed text-gray-800 bg-white/70 p-3.5 rounded-2xl border border-black/5">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
