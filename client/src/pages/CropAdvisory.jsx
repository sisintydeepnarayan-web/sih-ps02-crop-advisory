import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  Droplets, 
  Bug, 
  Sun, 
  Waves, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Thermometer, 
  CloudRain, 
  RefreshCw, 
  Sparkles, 
  PhoneCall, 
  Filter, 
  MapPin, 
  Wheat 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getStoredProfile, STATE_DISTRICTS, MAJOR_CROPS } from '../utils/helpers';
import { fetchCropAdvisory } from '../api/client';

export default function CropAdvisory() {
  const { t, i18n } = useTranslation();
  const profile = getStoredProfile() || {};

  // Active district & crop selections
  const [selectedDistrict, setSelectedDistrict] = useState(
    profile.district || 'Nashik'
  );
  const [selectedCrop, setSelectedCrop] = useState(
    profile.primary_crop || profile.crop || 'wheat'
  );

  // Advisory data & UI state
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const loadAdvisory = async (district, crop) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCropAdvisory(district, crop);
      setAdvisoryData(data);
    } catch (err) {
      console.error('Failed to load crop advisory:', err);
      setError(err.message || 'Failed to load advisory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisory(selectedDistrict, selectedCrop);
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setShowFilter(false);
    loadAdvisory(selectedDistrict, selectedCrop);
  };

  // Helper to pick category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'irrigation':
        return Droplets;
      case 'drainage':
        return Waves;
      case 'protection':
        return Sun;
      case 'pest_control':
        return Bug;
      case 'sowing':
      default:
        return Sprout;
    }
  };

  // Severity color styles
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high':
        return {
          card: 'bg-red-50/80 border-red-300 text-red-950',
          badge: 'bg-red-600 text-white',
          iconBg: 'bg-red-100 text-red-700',
          border: 'border-red-400',
          label: t('advisory.severityLabels.high'),
        };
      case 'medium':
        return {
          card: 'bg-amber-50/80 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          iconBg: 'bg-amber-100 text-amber-800',
          border: 'border-amber-400',
          label: t('advisory.severityLabels.medium'),
        };
      case 'low':
      default:
        return {
          card: 'bg-emerald-50/80 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-700 text-white',
          iconBg: 'bg-emerald-100 text-emerald-800',
          border: 'border-emerald-400',
          label: t('advisory.severityLabels.low'),
        };
    }
  };

  // District list for quick filter
  const allDistricts = Object.values(STATE_DISTRICTS).flat();
  const isMarathi = i18n.language?.startsWith('mr');
  const isHindi = i18n.language?.startsWith('hi');

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('advisory.title')}
        subtitle={`${t('common.district')}: ${selectedDistrict} • ${selectedCrop.toUpperCase()}`}
        icon={Sprout}
      />

      <div className="px-4 space-y-4">
        
        {/* District & Crop Selector Toggle */}
        <div className="flex items-center justify-between gap-3 bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-500 uppercase">{t('common.district')} & {t('common.crop')}</p>
              <p className="text-sm font-black text-gray-900 truncate">
                {selectedDistrict} • {selectedCrop.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform shadow-sm"
          >
            <Filter size={14} />
            <span>{t('advisory.filterTitle')}</span>
          </button>
        </div>

        {/* Expandable Filter Box */}
        {showFilter && (
          <form onSubmit={handleFilterSubmit} className="bg-white rounded-3xl p-5 border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in">
            <h4 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Filter size={18} className="text-emerald-700" />
              <span>{t('advisory.filterTitle')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('common.district')}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full h-12 px-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                >
                  {allDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('common.crop')}</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full h-12 px-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                >
                  {MAJOR_CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isMarathi ? (c.mr || c.hi) : isHindi ? c.hi : c.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
            >
              <RefreshCw size={16} />
              <span>{t('advisory.refreshBtn')}</span>
            </button>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-emerald-700 mx-auto" />
            <p className="text-base font-black text-gray-800">{t('common.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-center space-y-3">
            <ShieldAlert size={36} className="text-red-600 mx-auto" />
            <p className="text-sm font-bold text-red-900">{error}</p>
            <button
              type="button"
              onClick={() => loadAdvisory(selectedDistrict, selectedCrop)}
              className="px-4 py-2 bg-red-600 text-white font-black text-xs rounded-xl"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Advisory Content */}
        {!loading && !error && advisoryData && (
          <div className="space-y-4">
            
            {/* 1. Weather Snapshot Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <CloudRain size={20} />
                  </div>
                  <h3 className="text-base font-black text-gray-900">
                    {t('advisory.weatherSnapshot')}
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {selectedDistrict}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Temperature */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-center">
                  <p className="text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1">
                    <Thermometer size={14} />
                    <span>{t('advisory.temperature')}</span>
                  </p>
                  <p className="text-lg font-black text-amber-950 mt-0.5">
                    {advisoryData.weather?.temp_c}°C
                  </p>
                </div>

                {/* Actual Rainfall */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-center">
                  <p className="text-[11px] font-bold text-blue-900 flex items-center justify-center gap-1">
                    <CloudRain size={14} />
                    <span>{t('advisory.actual')}</span>
                  </p>
                  <p className="text-lg font-black text-blue-950 mt-0.5">
                    {advisoryData.weather?.rainfall_mm} mm
                  </p>
                </div>

                {/* Expected Rainfall */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
                  <p className="text-[11px] font-bold text-gray-600">
                    {t('advisory.expected')}
                  </p>
                  <p className="text-lg font-black text-gray-900 mt-0.5">
                    {advisoryData.weather?.expected_rainfall_mm} mm
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Primary Critical Advisory Banner (If High / Medium Severity) */}
            {advisoryData.primary_advisory && advisoryData.primary_advisory.severity !== 'low' && (
              (() => {
                const styles = getSeverityStyles(advisoryData.primary_advisory.severity);
                const Icon = getCategoryIcon(advisoryData.primary_advisory.category);
                return (
                  <div className={`rounded-3xl border-2 p-5 shadow-md space-y-3 relative overflow-hidden ${styles.card}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-3 rounded-2xl shrink-0 ${styles.iconBg}`}>
                          <Icon size={28} className="stroke-[2.5]" />
                        </div>
                        <div>
                          <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide ${styles.badge}`}>
                            {styles.label}
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-gray-950 mt-1 leading-tight">
                            {t(advisoryData.primary_advisory.issue_key, advisoryData.primary_advisory.params)}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-2xl p-4 border border-black/5">
                      <p className="text-sm sm:text-base font-bold leading-relaxed text-gray-900">
                        {t(advisoryData.primary_advisory.recommendation_key, advisoryData.primary_advisory.params)}
                      </p>
                    </div>

                    {/* Quick Helpline Call Button on Critical Alert */}
                    {advisoryData.primary_advisory.severity === 'high' && (
                      <a
                        href="tel:1551"
                        className="w-full h-13 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mt-1"
                      >
                        <PhoneCall size={18} />
                        <span>{t('app.emergencyHelpline')}</span>
                      </a>
                    )}
                  </div>
                );
              })()
            )}

            {/* 3. All Advisory Action Cards */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-700" />
                <span>{t('advisory.allAdvisoriesTitle')}</span>
              </h3>

              <div className="space-y-3.5">
                {advisoryData.advisories?.map((item) => {
                  const styles = getSeverityStyles(item.severity);
                  const Icon = getCategoryIcon(item.category);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-3xl border-2 p-5 shadow-sm space-y-3 transition-shadow hover:shadow-md ${styles.card}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl shrink-0 ${styles.iconBg}`}>
                            <Icon size={24} className="stroke-[2.5]" />
                          </div>
                          <div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${styles.badge}`}>
                              {styles.label}
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-gray-900 mt-1 leading-snug">
                              {t(item.issue_key, item.params)}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm font-semibold leading-relaxed text-gray-800 bg-white/70 p-3.5 rounded-2xl border border-black/5">
                        {t(item.recommendation_key, item.params)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Folded Favourable Resilient Crop Recommendation */}
            {advisoryData.favourable_crop_recommendation && (
              <div className="bg-emerald-800 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white text-emerald-800 rounded-2xl shrink-0">
                      <Sprout size={28} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-950/70 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        {t('advisory.favourableCropTitle')}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {t(
                          advisoryData.favourable_crop_recommendation.crop_key,
                          advisoryData.favourable_crop_recommendation.crop_name
                        )}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-black bg-amber-400 text-gray-950 px-3 py-1 rounded-full shrink-0 shadow-sm">
                    {t('advisory.waterSavingPill', {
                      waterSaving: advisoryData.favourable_crop_recommendation.water_saving || '35%'
                    })}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/50">
                  {t(
                    advisoryData.favourable_crop_recommendation.reason_key,
                    advisoryData.favourable_crop_recommendation.params
                  )}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
