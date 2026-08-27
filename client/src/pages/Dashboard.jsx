import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  TrendingUp, 
  FileText, 
  ScanLine, 
  PhoneCall, 
  MapPin, 
  CloudRain, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner';
import ActionCard from '../components/ActionCard';
import { getStoredProfile } from '../utils/helpers';

export default function Dashboard() {
  const { t } = useTranslation();
  const profile = getStoredProfile() || { district: 'Varanasi', crop: 'wheat' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-5">
      {/* Top Banner / Farmer Greeting */}
      <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin size={14} />
            <span>{profile.district || 'India'} • {profile.crop ? profile.crop.toUpperCase() : 'WHEAT'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {t('dashboard.greeting')} 🙏
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
            {t('app.tagline')}
          </p>
        </div>
        <Link
          to="/onboarding"
          className="bg-emerald-900/80 hover:bg-emerald-950 text-white px-3 py-2 rounded-xl text-xs font-bold border border-emerald-600/50 shrink-0 text-center"
        >
          {t('common.district')}
        </Link>
      </div>

      {/* Distress Early-Warning Section */}
      <section className="space-y-2">
        <AlertBanner
          type="weather"
          severity="high"
          title={t('dashboard.activeAlertsTitle')}
          message={t('dashboard.alertSample')}
          actionText={t('common.viewDetails')}
          actionLink="/advisory"
        />
      </section>

      {/* Primary Action Hub (Large Tap Cards for Low Tech Literacy) */}
      <section className="space-y-3">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <span>{t('dashboard.quickActions')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Crop Advisory */}
          <ActionCard
            to="/advisory"
            title={t('nav.advisory')}
            subtitle={t('advisory.subtitle')}
            icon={Sprout}
            iconBgColor="bg-emerald-100 text-emerald-800"
            badge="Updated"
            badgeColor="bg-emerald-100 text-emerald-800"
          />

          {/* Mandi Prices */}
          <ActionCard
            to="/market"
            title={t('nav.market')}
            subtitle={t('market.subtitle')}
            icon={TrendingUp}
            iconBgColor="bg-blue-100 text-blue-800"
            badge="Live APMC"
            badgeColor="bg-blue-100 text-blue-800"
          />

          {/* Disease Check Placeholder */}
          <ActionCard
            to="/disease-check"
            title={t('nav.diseaseCheck')}
            subtitle={t('diseaseCheck.subtitle')}
            icon={ScanLine}
            iconBgColor="bg-purple-100 text-purple-800"
            badge="Beta"
            badgeColor="bg-purple-100 text-purple-800"
          />

          {/* Government Schemes */}
          <ActionCard
            to="/schemes"
            title={t('nav.schemes')}
            subtitle={t('schemes.subtitle')}
            icon={FileText}
            iconBgColor="bg-amber-100 text-amber-800"
            badge="4 Active"
            badgeColor="bg-amber-100 text-amber-800"
          />
        </div>
      </section>

      {/* Mandi Snapshot Preview */}
      <section className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-base font-black text-gray-900">
              {t('dashboard.mandiHighlight')}
            </h3>
          </div>
          <Link
            to="/market"
            className="text-xs sm:text-sm font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>{t('dashboard.viewMarket')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
            <p className="text-xs text-gray-500 font-bold">{t('market.wheat')}</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹2,425 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1">↑ +₹40 Today</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
            <p className="text-xs text-gray-500 font-bold">{t('market.mustard')}</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹5,650 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1">↑ +₹85 Today</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 font-bold">{t('market.rice')}</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹2,300 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded inline-block mt-1">Stable</span>
          </div>
        </div>
      </section>

      {/* Direct Distress Emergency Call Card */}
      <section>
        <div className="bg-red-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white text-red-600 rounded-2xl shrink-0">
              <PhoneCall size={28} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black leading-tight">
                {t('contacts.kccName')}
              </h4>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                {t('contacts.kccHours')}
              </p>
            </div>
          </div>
          <a
            href="tel:1551"
            className="bg-white text-red-700 hover:bg-red-50 px-4 py-3 rounded-2xl font-black text-sm shrink-0 shadow-sm active:scale-95 transition-transform flex items-center gap-2"
          >
            <PhoneCall size={18} />
            <span>1551</span>
          </a>
        </div>
      </section>
    </div>
  );
}
