import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  TrendingUp, 
  FileText, 
  ScanLine, 
  PhoneCall, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Activity,
  RefreshCw,
  UserCheck,
  Clock,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import { getStoredProfile, getStoredFarmerId } from '../utils/helpers';
import { fetchDistressScore } from '../api/client';

export default function Dashboard() {
  const { t } = useTranslation();
  const profile = getStoredProfile() || { name: '', district: 'Nashik', primary_crop: 'wheat' };
  const farmerId = getStoredFarmerId() || profile.id || null;
  const cropDisplay = (profile.primary_crop || profile.crop || 'wheat').toUpperCase();

  // Distress Score state
  const [distressData, setDistressData] = useState(null);
  const [loadingDistress, setLoadingDistress] = useState(false);
  const [distressError, setDistressError] = useState(null);

  const loadDistressScore = async () => {
    if (!farmerId) {
      // Fallback baseline for unregistered preview
      setDistressData({
        score: 25,
        riskLevel: 'low',
        triggeredFactors: [
          'Weather conditions, market commodity rates, and loan repayment timelines are currently within stable limits.'
        ],
        mockAlertRouting: null,
      });
      return;
    }

    setLoadingDistress(true);
    setDistressError(null);
    try {
      const data = await fetchDistressScore(farmerId);
      if (data) {
        setDistressData(data);
      } else {
        // Fallback default
        setDistressData({
          score: 30,
          riskLevel: 'low',
          triggeredFactors: [
            'All conditions (rainfall, commodity prices, loan schedules) are currently stable.'
          ],
          mockAlertRouting: null,
        });
      }
    } catch (err) {
      console.warn('Could not fetch distress score:', err.message);
      setDistressError(err.message);
    } finally {
      setLoadingDistress(false);
    }
  };

  useEffect(() => {
    loadDistressScore();
  }, [farmerId]);

  // Color styles based on risk level
  const getRiskStyles = (level = 'low') => {
    switch (level) {
      case 'high':
        return {
          cardBg: 'bg-red-50/90 border-red-300 text-red-950',
          badgeBg: 'bg-red-600 text-white',
          iconColor: 'text-red-600',
          progressBg: 'bg-red-600',
          border: 'border-red-400',
          statusText: t('dashboard.scoreCritical'),
          icon: ShieldAlert,
        };
      case 'medium':
        return {
          cardBg: 'bg-amber-50/90 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          iconColor: 'text-amber-600',
          progressBg: 'bg-amber-500',
          border: 'border-amber-400',
          statusText: t('dashboard.scoreModerate'),
          icon: AlertTriangle,
        };
      case 'low':
      default:
        return {
          cardBg: 'bg-emerald-50/90 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-700 text-white',
          iconColor: 'text-emerald-700',
          progressBg: 'bg-emerald-600',
          border: 'border-emerald-400',
          statusText: t('dashboard.scoreSafe'),
          icon: ShieldCheck,
        };
    }
  };

  const riskStyles = getRiskStyles(distressData?.riskLevel);
  const RiskIcon = riskStyles.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-5">
      {/* Top Banner / Farmer Greeting */}
      <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin size={14} />
            <span>
              {profile.district || 'India'}
              {profile.state ? `, ${profile.state}` : ''} • {cropDisplay}
              {profile.land_size ? ` • ${profile.land_size} Acres` : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {t('dashboard.greeting')} {profile.name ? `, ${profile.name}` : ''} 🙏
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
            {t('app.tagline')}
          </p>
        </div>
        <Link
          to="/onboarding"
          className="bg-emerald-900/80 hover:bg-emerald-950 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-emerald-600/50 shrink-0 text-center shadow-sm active:scale-95 transition-transform"
        >
          {t('nav.onboarding')}
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* DISTRESS RISK SCORER & EARLY-WARNING SECTION */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className={`rounded-3xl border-2 p-5 sm:p-6 shadow-sm space-y-4 ${riskStyles.cardBg}`}>
          
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
                <RiskIcon size={28} className={riskStyles.iconColor} />
              </div>
              <div>
                <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide ${riskStyles.badgeBg}`}>
                  {t('dashboard.distressRiskLevel')}: {distressData?.riskLevel?.toUpperCase() || 'EVALUATING'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-950 mt-1 leading-tight">
                  {t('dashboard.distressCardTitle')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={loadDistressScore}
              disabled={loadingDistress}
              title={t('dashboard.refreshScoreBtn')}
              className="p-2.5 bg-white hover:bg-gray-100 rounded-xl border border-black/10 text-gray-700 shadow-sm shrink-0 active:scale-95 transition-transform"
            >
              <RefreshCw size={18} className={loadingDistress ? 'animate-spin text-emerald-700' : ''} />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            {t('dashboard.distressSubtitle')}
          </p>

          {/* Distress Score Meter */}
          <div className="bg-white rounded-2xl p-4 border border-black/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-sm font-black text-gray-900">
              <span className="flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-700" />
                <span>{t('dashboard.distressScore')}</span>
              </span>
              <span className="text-lg font-black">
                {distressData?.score ?? 0} <span className="text-xs text-gray-500 font-bold">/ 100</span>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${riskStyles.progressBg}`}
                style={{ width: `${distressData?.score ?? 0}%` }}
              />
            </div>

            <p className="text-xs font-bold text-gray-600 pt-0.5">
              {riskStyles.statusText}
            </p>
          </div>

          {/* Triggered Factors (Plain language non-technical summaries for NGO / Field Officers) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-700" />
              <span>{t('dashboard.triggeredFactorsTitle')}</span>
            </h4>

            <div className="space-y-2">
              {distressData?.triggeredFactors && distressData.triggeredFactors.length > 0 ? (
                distressData.triggeredFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="bg-white/90 rounded-2xl p-3.5 border border-black/10 flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="text-amber-600 font-black text-sm shrink-0 mt-0.5">•</span>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {factor}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-gray-600 bg-white/80 p-3 rounded-xl">
                  {t('dashboard.noFactorsTriggered')}
                </p>
              )}
            </div>
          </div>

          {/* High-Risk Mock Alert Routing Box (Demo Feature) */}
          {distressData?.riskLevel === 'high' && distressData?.mockAlertRouting && (
            <div className="bg-red-900 text-white rounded-2xl p-4 space-y-3 shadow-md border-2 border-red-500">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-red-800 rounded-xl text-red-200 shrink-0">
                  <Radio size={20} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-red-950 px-2 py-0.5 rounded text-red-200 border border-red-700">
                    {t('dashboard.alertRoutedTitle')}
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">
                    {distressData.mockAlertRouting.routedTo}
                  </h4>
                  <p className="text-xs text-red-200 font-medium mt-0.5">
                    {distressData.mockAlertRouting.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2 border-t border-red-800/80">
                <div className="text-xs text-red-200 font-semibold">
                  <span>{t('dashboard.contactOfficer')}: </span>
                  <span className="font-mono font-bold text-white">
                    {distressData.mockAlertRouting.contact}
                  </span>
                </div>
                <a
                  href={`tel:${distressData.mockAlertRouting.contact}`}
                  className="bg-white hover:bg-gray-100 text-red-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
                >
                  <PhoneCall size={13} />
                  <span>{t('dashboard.callOfficerBtn')}</span>
                </a>
              </div>
            </div>
          )}

        </div>
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

          {/* Disease Check */}
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
