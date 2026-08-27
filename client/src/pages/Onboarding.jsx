import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  MapPin, 
  Wheat, 
  User, 
  Calendar, 
  Ruler, 
  Languages, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw,
  Edit3
} from 'lucide-react';
import { 
  STATE_DISTRICTS, 
  MAJOR_CROPS, 
  AVAILABLE_LANGUAGES, 
  saveStoredProfile, 
  getStoredProfile,
  getStoredFarmerId,
  clearStoredProfile
} from '../utils/helpers';
import { createFarmer, updateFarmer, getFarmerById } from '../api/client';

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const initialProfile = getStoredProfile() || {};
  const existingFarmerId = getStoredFarmerId() || initialProfile.id || null;

  // Farmer UUID (null for fresh registration, string for updates)
  const [farmerId, setFarmerId] = useState(existingFarmerId);

  // Form states
  const [name, setName] = useState(initialProfile.name || '');
  const [state, setState] = useState(initialProfile.state || 'Maharashtra');
  const [district, setDistrict] = useState(initialProfile.district || 'Nashik');
  const [primaryCrop, setPrimaryCrop] = useState(
    initialProfile.primary_crop || initialProfile.crop || 'wheat'
  );
  const [landSize, setLandSize] = useState(
    initialProfile.land_size ? String(initialProfile.land_size) : '2.5'
  );
  
  // Default loan due date: 30 days from now
  const defaultDueDate = () => {
    if (initialProfile.loan_due_date) return initialProfile.loan_due_date;
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [loanDueDate, setLoanDueDate] = useState(defaultDueDate());
  const [preferredLanguage, setPreferredLanguage] = useState(
    initialProfile.preferred_language || (i18n.language?.startsWith('mr') ? 'mr' : i18n.language?.startsWith('hi') ? 'hi' : 'en')
  );

  // Status & Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const availableDistricts = STATE_DISTRICTS[state] || STATE_DISTRICTS['Maharashtra'] || STATE_DISTRICTS['Uttar Pradesh'];
  const isMarathi = i18n.language?.startsWith('mr');
  const isHindi = i18n.language?.startsWith('hi');

  // Load existing farmer data on mount if ID exists; if invalid or deleted in DB, clear stale ID
  useEffect(() => {
    if (existingFarmerId) {
      setIsLoadingProfile(true);
      getFarmerById(existingFarmerId)
        .then((farmer) => {
          if (farmer && farmer.id) {
            // Farmer exists in DB -> prefill form with latest data
            setFarmerId(farmer.id);
            setName(farmer.name || '');
            if (farmer.state) setState(farmer.state);
            if (farmer.district) setDistrict(farmer.district);
            if (farmer.primary_crop) setPrimaryCrop(farmer.primary_crop);
            if (farmer.land_size) setLandSize(String(farmer.land_size));
            if (farmer.loan_due_date) setLoanDueDate(farmer.loan_due_date);
            if (farmer.preferred_language) {
              setPreferredLanguage(farmer.preferred_language);
              if (['en', 'hi', 'mr'].includes(farmer.preferred_language)) {
                i18n.changeLanguage(farmer.preferred_language);
                localStorage.setItem('app_language', farmer.preferred_language);
              }
            }
          } else {
            // Farmer ID no longer exists in Supabase -> clear stale ID and treat as fresh signup
            console.log('Stored farmer ID is not found in database. Resetting to fresh signup.');
            clearStoredProfile();
            setFarmerId(null);
            setName('');
            setPrimaryCrop('wheat');
            setLandSize('2.5');
            const d = new Date();
            d.setDate(d.getDate() + 30);
            setLoanDueDate(d.toISOString().split('T')[0]);
          }
        })
        .catch((err) => {
          console.warn('Could not verify profile with server, resetting stale state:', err.message);
          clearStoredProfile();
          setFarmerId(null);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [existingFarmerId, i18n]);

  // Handle language change from dropdown
  const handleLanguageChange = (langCode) => {
    setPreferredLanguage(langCode);
    if (['en', 'hi', 'mr'].includes(langCode)) {
      i18n.changeLanguage(langCode);
      localStorage.setItem('app_language', langCode);
    }
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = t('onboarding.errors.nameRequired');
    }

    if (!state.trim()) {
      errors.state = t('onboarding.errors.stateRequired');
    }

    if (!district.trim()) {
      errors.district = t('onboarding.errors.districtRequired');
    }

    if (!primaryCrop) {
      errors.primaryCrop = t('onboarding.errors.cropRequired');
    }

    const parsedLand = parseFloat(landSize);
    if (isNaN(parsedLand) || parsedLand <= 0) {
      errors.landSize = t('onboarding.errors.landSizeRequired');
    }

    if (!loanDueDate) {
      errors.loanDueDate = t('onboarding.errors.loanDateRequired');
    } else {
      const selectedDate = new Date(loanDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        errors.loanDueDate = t('onboarding.errors.loanDateFuture');
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // 1. Validate inputs
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      district: district.trim(),
      state: state.trim(),
      primary_crop: primaryCrop,
      land_size: parseFloat(landSize),
      loan_due_date: loanDueDate,
      preferred_language: preferredLanguage,
    };

    try {
      let savedFarmer = null;

      if (farmerId) {
        // 2a. Farmer ID exists -> call UPDATE
        savedFarmer = await updateFarmer(farmerId, payload);
        
        // If farmer was deleted in the meantime, fall back to INSERT
        if (!savedFarmer) {
          console.log('Farmer record no longer in database, creating new record...');
          savedFarmer = await createFarmer(payload);
        }
      } else {
        // 2b. First-time registration -> call INSERT
        savedFarmer = await createFarmer(payload);
      }

      // 3. Store returned farmer profile in localStorage for persistent access
      saveStoredProfile({
        ...savedFarmer,
        setupCompleted: true,
        updatedAt: new Date().toISOString(),
      });

      // 4. Navigate to Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save farmer profile:', err);
      setApiError(err.message || t('onboarding.errors.saveFailed'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-28 px-4 pt-4">
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-full text-xs font-black mb-3 border border-emerald-500/40 text-emerald-200">
            {farmerId ? <Edit3 size={16} /> : <ShieldCheck size={16} />}
            <span>
              {farmerId
                ? `${t('nav.onboarding')} • ID: ${farmerId.slice(0, 8)}...`
                : t('onboarding.welcomeBanner')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
            {t('onboarding.title')}
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base font-medium">
            {t('onboarding.subtitle')}
          </p>
        </div>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex items-start gap-3 text-red-950 shadow-sm">
          <AlertTriangle size={24} className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm uppercase tracking-wide text-red-800">
              {t('common.status')}: Error
            </h4>
            <p className="text-sm font-bold text-red-900 mt-0.5">
              {apiError}
            </p>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-6">
        
        {/* 1. Farmer Name */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <User size={20} className="text-emerald-700" />
            <span>{t('onboarding.nameLabel')}</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder={t('onboarding.namePlaceholder')}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
            }}
            className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-2xl text-base font-bold text-gray-900 focus:bg-white focus:outline-none transition-colors ${
              fieldErrors.name
                ? 'border-red-500 focus:border-red-600 bg-red-50/30'
                : 'border-gray-300 focus:border-emerald-600'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-xs font-black text-red-600 mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {fieldErrors.name}
            </p>
          )}
        </div>

        {/* 2. State & District Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
              <MapPin size={20} className="text-emerald-700" />
              <span>{t('onboarding.stateLabel')}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => {
                const newState = e.target.value;
                setState(newState);
                setDistrict(STATE_DISTRICTS[newState]?.[0] || '');
                if (fieldErrors.state) setFieldErrors({ ...fieldErrors, state: null });
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

          {/* District */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
              <MapPin size={20} className="text-emerald-700" />
              <span>{t('onboarding.districtLabel')}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                if (fieldErrors.district) setFieldErrors({ ...fieldErrors, district: null });
              }}
              className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-2xl text-base font-bold text-gray-900 focus:bg-white focus:outline-none ${
                fieldErrors.district
                  ? 'border-red-500 focus:border-red-600 bg-red-50/30'
                  : 'border-gray-300 focus:border-emerald-600'
              }`}
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {fieldErrors.district && (
              <p className="text-xs font-black text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.district}
              </p>
            )}
          </div>
        </div>

        {/* 3. Primary Crop Selection (Large Tap Cards) */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <Wheat size={20} className="text-emerald-700" />
            <span>{t('onboarding.cropLabel')}</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MAJOR_CROPS.map((c) => {
              const isSelected = primaryCrop === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setPrimaryCrop(c.id);
                    if (fieldErrors.primaryCrop) setFieldErrors({ ...fieldErrors, primaryCrop: null });
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[72px] ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-100/70 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-600/30'
                      : 'border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">
                    {isMarathi ? (c.mr || c.hi) : isHindi ? c.hi : c.en}
                  </span>
                  {isSelected && (
                    <CheckCircle2 size={18} className="text-emerald-700 self-end mt-1" />
                  )}
                </button>
              );
            })}
          </div>
          {fieldErrors.primaryCrop && (
            <p className="text-xs font-black text-red-600 mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {fieldErrors.primaryCrop}
            </p>
          )}
        </div>

        {/* 4. Land Size & Loan Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Land Size */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
              <Ruler size={20} className="text-emerald-700" />
              <span>{t('onboarding.landSizeLabel')}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder={t('onboarding.landSizePlaceholder')}
              value={landSize}
              onChange={(e) => {
                setLandSize(e.target.value);
                if (fieldErrors.landSize) setFieldErrors({ ...fieldErrors, landSize: null });
              }}
              className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-2xl text-base font-bold text-gray-900 focus:bg-white focus:outline-none ${
                fieldErrors.landSize
                  ? 'border-red-500 focus:border-red-600 bg-red-50/30'
                  : 'border-gray-300 focus:border-emerald-600'
              }`}
            />
            {fieldErrors.landSize && (
              <p className="text-xs font-black text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.landSize}
              </p>
            )}
          </div>

          {/* Loan Due Date */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
              <Calendar size={20} className="text-emerald-700" />
              <span>{t('onboarding.loanDueDateLabel')}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={loanDueDate}
              onChange={(e) => {
                setLoanDueDate(e.target.value);
                if (fieldErrors.loanDueDate) setFieldErrors({ ...fieldErrors, loanDueDate: null });
              }}
              className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-2xl text-base font-bold text-gray-900 focus:bg-white focus:outline-none ${
                fieldErrors.loanDueDate
                  ? 'border-red-500 focus:border-red-600 bg-red-50/30'
                  : 'border-gray-300 focus:border-emerald-600'
              }`}
            />
            {fieldErrors.loanDueDate && (
              <p className="text-xs font-black text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.loanDueDate}
              </p>
            )}
          </div>
        </div>

        {/* 5. Preferred Language Dropdown */}
        <div>
          <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-2">
            <Languages size={20} className="text-emerald-700" />
            <span>{t('onboarding.preferredLanguageLabel')}</span>
          </label>
          <select
            value={preferredLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-300 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {AVAILABLE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit / Update Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoadingProfile}
            className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-2xl font-black text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                <span>{farmerId ? t('onboarding.updating') : t('onboarding.saving')}</span>
              </>
            ) : (
              <>
                {farmerId ? <Edit3 size={24} /> : <Sprout size={24} />}
                <span>{farmerId ? t('onboarding.updateBtn') : t('onboarding.submitBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
