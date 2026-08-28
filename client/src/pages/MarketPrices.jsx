import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PriceChart from '../components/PriceChart';
import { getStoredFarmerId, MAJOR_CROPS, STATE_DISTRICTS } from '../utils/helpers';
import { fetchCropPrices, getFarmerById } from '../api/client';

export default function MarketPrices() {
  const { t, i18n } = useTranslation();
  const farmerId = getStoredFarmerId();

  // Active crop and district
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');

  // Price history and loading states
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrices = async (crop, district) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCropPrices(crop, district);
      setPriceHistory(data || []);
    } catch (err) {
      console.error('Failed to load crop prices:', err);
      setError(err.message || 'Failed to load price data');
    } finally {
      setLoading(false);
    }
  };

  // On mount, load fresh farmer details directly from Supabase first
  useEffect(() => {
    const initPrices = async () => {
      let crop = 'wheat';
      let district = 'Nashik';

      if (farmerId) {
        try {
          const freshFarmer = await getFarmerById(farmerId);
          if (freshFarmer) {
            if (freshFarmer.primary_crop) crop = freshFarmer.primary_crop;
            if (freshFarmer.district) district = freshFarmer.district;
          }
        } catch (err) {
          console.warn('Could not fetch fresh farmer for market prices:', err.message);
        }
      }

      setSelectedCrop(crop);
      setSelectedDistrict(district);
      loadPrices(crop, district);
    };

    initPrices();
  }, [farmerId]);

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    loadPrices(crop, selectedDistrict);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    loadPrices(selectedCrop, district);
  };

  const isMarathi = i18n.language?.startsWith('mr');
  const isHindi = i18n.language?.startsWith('hi');
  const allDistricts = Object.values(STATE_DISTRICTS).flat();

  // Find human display name for currently selected crop
  const currentCropObj = MAJOR_CROPS.find(
    (c) => c.id.toLowerCase() === String(selectedCrop).toLowerCase()
  );
  const selectedCropDisplayName = currentCropObj
    ? isMarathi
      ? (currentCropObj.mr || currentCropObj.hi)
      : isHindi
      ? currentCropObj.hi
      : currentCropObj.en
    : selectedCrop;

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('market.title')}
        subtitle={`${t('common.district')}: ${selectedDistrict} • ${selectedCropDisplayName}`}
        icon={TrendingUp}
      />

      <div className="px-4 space-y-4">
        
        {/* Commodity & District Filter Controls */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-gray-200 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-900 tracking-wider">
            <Filter size={16} className="text-emerald-700 stroke-[2.5]" />
            <span>{t('market.selectCropLabel')} & {t('market.selectDistrictLabel')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('common.crop')}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full h-13 px-3.5 bg-gray-50 border-2 border-gray-300 rounded-2xl text-sm font-bold text-gray-950 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
              >
                {MAJOR_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isMarathi ? (c.mr || c.hi) : isHindi ? c.hi : c.en}
                  </option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('common.district')}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full h-13 px-3.5 bg-gray-50 border-2 border-gray-300 rounded-2xl text-sm font-bold text-gray-950 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
              >
                {allDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-emerald-700 mx-auto" />
            <p className="text-base font-black text-gray-800">{t('common.loading')}</p>
          </div>
        )}

        {/* Price Trend Line Chart Component (Real crop_prices data only) */}
        {!loading && (
          <PriceChart
            prices={priceHistory}
            crop={selectedCropDisplayName}
            district={selectedDistrict}
          />
        )}

      </div>
    </div>
  );
}
