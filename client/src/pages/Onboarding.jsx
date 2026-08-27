import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, MapPin, Wheat, CheckCircle2, ShieldCheck } from 'lucide-react';
import { STATE_DISTRICTS, MAJOR_CROPS, saveStoredProfile, getStoredProfile } from '../utils/helpers';
import PageHeader from '../components/PageHeader';

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const existingProfile = getStoredProfile() || {};

  const [state, setState] = useState(existingProfile.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState(existingProfile.district || 'Varanasi');
  const [crop, setCrop] = useState(existingProfile.crop || 'wheat');
  const [phone, setPhone] = useState(existingProfile.phone || '');

  const availableDistricts = STATE_DISTRICTS[state] || STATE_DISTRICTS['Uttar Pradesh'];

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStoredProfile({
      state,
      district,
      crop,
      phone,
      setupCompleted: true,
      updatedAt: new Date().toISOString(),
    });
    navigate('/dashboard');
  };

  const isHindi = i18n.language?.startsWith('hi');

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 pt-4">
      <div className="bg-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1.5 rounded-full text-xs font-bold mb-3 border border-emerald-500/40">
            <ShieldCheck size={16} />
            <span>{t('onboarding.welcomeBanner')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
            {t('onboarding.title')}
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base font-medium">
            {t('onboarding.subtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
        {/* State Selection */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <MapPin size={20} className="text-emerald-600" />
            <span>{t('onboarding.stateLabel')}</span>
          </label>
          <select
            value={state}
            onChange={(e) => {
              const newState = e.target.value;
              setState(newState);
              setDistrict(STATE_DISTRICTS[newState]?.[0] || '');
            }}
            className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-300 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {Object.keys(STATE_DISTRICTS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* District Selection */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <MapPin size={20} className="text-emerald-600" />
            <span>{t('onboarding.districtLabel')}</span>
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-300 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Selection */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <Wheat size={20} className="text-emerald-600" />
            <span>{t('onboarding.cropLabel')}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MAJOR_CROPS.map((c) => {
              const isSelected = crop === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCrop(c.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[70px] ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">
                    {isHindi ? c.hi : c.en}
                  </span>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-emerald-600 self-end mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Phone */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t('onboarding.phoneLabel')}
          </label>
          <input
            type="tel"
            maxLength={10}
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-300 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Sprout size={24} />
          <span>{t('onboarding.submitBtn')}</span>
        </button>
      </form>
    </div>
  );
}
