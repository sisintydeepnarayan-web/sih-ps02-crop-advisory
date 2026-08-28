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
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import { getStoredFarmerId, clearStoredFarmerId } from '../utils/helpers';
import { fetchDistressScore, getFarmerById } from '../api/client';

export default function Dashboard() {
  const { t } = useTranslation();
  const farmerId = getStoredFarmerId();

  // Fresh farmer profile fetched from database
  const [farmer, setFarmer] = useState(null);
  const [loadingFarmer, setLoadingFarmer] = useState(true);

  // Distress Score state
  const [distressData, setDistressData] = useState(null);
  const [loadingDistress, setLoadingDistress] = useState(false);

  // Load fresh farmer details & distress score on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingFarmer(true);

      if (!farmerId) {
        setFarmer(null);
        setLoadingFarmer(false);
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

      try {
        // 1. Fetch fresh farmer row from Supabase
        const freshFarmer = await getFarmerById(farmerId);
        if (freshFarmer && freshFarmer.id) {
          setFarmer(freshFarmer);
          
          // 2. Fetch fresh distress score for this farmer
          setLoadingDistress(true);
          const scoreData = await fetchDistressScore(freshFarmer.id);
          if (scoreData) {
            setDistressData(scoreData);
          }
        } else {
          // If farmer no longer exists in Supabase, clear stale ID
          console.log('Farmer record no longer in database, resetting state...');
          clearStoredFarmerId();
          setFarmer(null);
        }
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err.message);
      } finally {
        setLoadingFarmer(false);
        setLoadingDistress(false);
      }
    };

    loadDashboardData();
  }, [farmerId]);

  const handleRefreshDistress = async () => {
    if (!farmerId) return;
    setLoadingDistress(true);
    try {
      const scoreData = await fetchDistressScore(farmerId);
      if (scoreData) {
        setDistressData(scoreData);
      }
    } catch (err) {
      console.warn('Could not refresh distress score:', err.message);
    } finally {
      setLoadingDistress(false);
    }
  };

  const cropDisplay = (farmer?.primary_crop || 'wheat').toUpperCase();
  const farmerDistrict = farmer?.district || 'India';

  // Color styles based on risk level
  const getRiskStyles = (level = 'low') => {
    switch (level) {
      case 'high':
        return {
          cardBg: 'bg-red-50/95 border-red-300 text-red-950',
          badgeBg: 'bg-red-700 text-white font-black',
          iconColor: 'text-red-700',
          progressBg: 'bg-red-600',
          statusText: t('dashboard.scoreCritical'),
          icon: ShieldAlert,
        };
      case 'medium':
        return {
          cardBg: 'bg-amber-50/95 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-800 text-white font-black',
          iconColor: 'text-amber-800',
          progressBg: 'bg-amber-600',
          statusText: t('dashboard.scoreModerate'),
          icon: AlertTriangle,
        };
      case 'low':
      default:
        return {
          cardBg: 'bg-emerald-50/95 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-800 text-white font-black',
          iconColor: 'text-emerald-800',
          progressBg: 'bg-emerald-600',
          statusText: t('dashboard.scoreSafe'),
          icon: ShieldCheck,
        };
    }
  };

  const riskStyles = getRiskStyles(distressData?.riskLevel);
  const RiskIcon = riskStyles.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-4">
      
      {/* Top Banner / Farmer Greeting */}
      <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 border-2 border-emerald-900">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-black uppercase tracking-wider mb-1">
            <MapPin size={14} />
            <span>
              {farmerDistrict}
              {farmer?.state ? `, ${farmer.state}` : ''} • {cropDisplay}
              {farmer?.land_size ? ` • ${farmer.land_size} Acres` : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black leading-tight">
            {t('dashboard.greeting')} {farmer?.name ? `, ${farmer.name}` : ''} 🙏
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-0.5">
            {t('app.tagline')}
          </p>
        </div>
        <Link
          to="/onboarding"
          className="min-h-[44px] bg-emerald-900 hover:bg-emerald-950 text-white px-4 py-2.5 rounded-2xl text-xs font-black border border-emerald-600/60 shrink-0 flex items-center justify-center text-center shadow-sm transition-colors"
        >
          {farmer?.id ? t('nav.onboarding') : 'Setup Profile'}
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
              <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0 border border-black/5">
                <RiskIcon size={28} className={riskStyles.iconColor} />
              </div>
              <div>
                <span className={`text-[10px] sm:text-[11px] uppercase px-2.5 py-0.5 rounded-full tracking-wide ${riskStyles.badgeBg}`}>
                  {t('dashboard.distressRiskLevel')}: {distressData?.riskLevel?.toUpperCase() || 'EVALUATING'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-950 mt-1.5 leading-tight">
                  {t('dashboard.distressCardTitle')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefreshDistress}
              disabled={loadingDistress}
              title={t('dashboard.refreshScoreBtn')}
              className="p-3 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-2xl border border-black/10 text-gray-800 shadow-sm shrink-0 transition-colors"
            >
              <RefreshCw size={18} className={loadingDistress ? 'animate-spin text-emerald-700' : ''} />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
            {t('dashboard.distressSubtitle')}
          </p>

          {/* Distress Score Meter */}
          <div className="bg-white rounded-2xl p-4 border border-black/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-sm font-black text-gray-950">
              <span className="flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-700" />
                <span>{t('dashboard.distressScore')}</span>
              </span>
              <span className="text-xl font-black">
                {distressData?.score ?? 0} <span className="text-xs text-gray-500 font-bold">/ 100</span>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${riskStyles.progressBg}`}
                style={{ width: `${distressData?.score ?? 0}%` }}
              />
            </div>

            <p className="text-xs font-bold text-gray-700 pt-0.5">
              {riskStyles.statusText}
            </p>
          </div>

          {/* Triggered Factors */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-800" />
              <span>{t('dashboard.triggeredFactorsTitle')}</span>
            </h4>

            <div className="space-y-2">
              {distressData?.triggeredFactors && distressData.triggeredFactors.length > 0 ? (
                distressData.triggeredFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="bg-white/95 rounded-2xl p-3.5 border border-black/10 flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="text-amber-700 font-black text-base shrink-0 leading-none mt-0.5">•</span>
                    <p className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                      {factor}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-gray-700 bg-white/90 p-3.5 rounded-2xl">
                  {t('dashboard.noFactorsTriggered')}
                </p>
              )}
            </div>
          </div>

          {/* High-Risk Mock Alert Routing Box */}
          {distressData?.riskLevel === 'high' && distressData?.mockAlertRouting && (
            <div className="bg-red-900 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-md border-2 border-red-500">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-red-800 rounded-xl text-red-200 shrink-0">
                  <Radio size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-red-950 px-2.5 py-0.5 rounded text-red-200 border border-red-700">
                    {t('dashboard.alertRoutedTitle')}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-white mt-1">
                    {distressData.mockAlertRouting.routedTo}
                  </h4>
                  <p className="text-xs text-red-100 font-medium mt-0.5 leading-relaxed">
                    {distressData.mockAlertRouting.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 gap-2 border-t border-red-800">
                <div className="text-xs text-red-100 font-semibold">
                  <span>{t('dashboard.contactOfficer')}: </span>
                  <span className="font-mono font-black text-white">
                    {distressData.mockAlertRouting.contact}
                  </span>
                </div>
                <a
                  href={`tel:${distressData.mockAlertRouting.contact}`}
                  className="min-h-[40px] bg-white hover:bg-gray-100 active:bg-gray-200 text-red-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <PhoneCall size={14} />
                  <span>{t('dashboard.callOfficerBtn')}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Primary Action Hub (Large Tap Cards) */}
      <section className="space-y-3">
        <h3 className="text-lg font-black text-gray-950 flex items-center gap-2">
          <span>{t('dashboard.quickActions')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Crop Advisory */}
          <ActionCard
            to="/advisory"
            title={t('nav.advisory')}
            subtitle={t('advisory.subtitle')}
            icon={Sprout}
            iconBgColor="bg-emerald-100 text-emerald-950"
            badge="Updated"
            badgeColor="bg-emerald-100 text-emerald-950 font-black"
          />

          {/* Mandi Prices */}
          <ActionCard
            to="/market"
            title={t('nav.market')}
            subtitle={t('market.subtitle')}
            icon={TrendingUp}
            iconBgColor="bg-blue-100 text-blue-950"
            badge="Live APMC"
            badgeColor="bg-blue-100 text-blue-950 font-black"
          />

          {/* Disease Check */}
          <ActionCard
            to="/disease-check"
            title={t('nav.diseaseCheck')}
            subtitle={t('diseaseCheck.subtitle')}
            icon={ScanLine}
            iconBgColor="bg-purple-100 text-purple-950"
            badge="Beta"
            badgeColor="bg-purple-100 text-purple-950 font-black"
          />

          {/* Government Schemes */}
          <ActionCard
            to="/schemes"
            title={t('nav.schemes')}
            subtitle={t('schemes.subtitle')}
            icon={FileText}
            iconBgColor="bg-amber-100 text-amber-950"
            badge="Active Subsidies"
            badgeColor="bg-amber-100 text-amber-950 font-black"
          />
        </div>
      </section>

      {/* Mandi Snapshot Preview */}
      <section className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-950">
              <TrendingUp size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-950">
              {t('dashboard.mandiHighlight')}
            </h3>
          </div>
          <Link
            to="/market"
            className="text-xs sm:text-sm font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>{t('dashboard.viewMarket')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5">
            <p className="text-xs text-gray-600 font-bold">{t('market.wheat')}</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">₹2,425 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1.5">↑ +₹40 Today</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5">
            <p className="text-xs text-gray-600 font-bold">{t('market.mustard')}</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">₹5,650 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1.5">↑ +₹85 Today</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-600 font-bold">{t('market.rice')}</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">₹2,300 <span className="text-xs font-semibold text-gray-500">/Qtl</span></p>
            <span className="text-[10px] font-black text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1.5">Stable</span>
          </div>
        </div>
      </section>

      {/* Direct Distress Emergency Call Card */}
      <section>
        <div className="bg-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-md flex items-center justify-between gap-4 border-2 border-red-700">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-3 bg-white text-red-600 rounded-2xl shrink-0">
              <PhoneCall size={28} className="stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-base sm:text-lg font-black leading-tight">
                {t('contacts.kccName')}
              </h4>
              <p className="text-xs text-red-100 font-semibold mt-0.5 leading-snug">
                {t('contacts.kccHours')}
              </p>
            </div>
          </div>
          <a
            href="tel:1551"
            className="min-h-[52px] bg-white text-red-900 hover:bg-red-50 active:bg-gray-100 px-4 py-2.5 rounded-2xl font-black text-base shrink-0 shadow-sm transition-colors flex items-center gap-2"
          >
            <PhoneCall size={18} />
            <span>1551</span>
          </a>
        </div>
      </section>
    </div>
  );
}
