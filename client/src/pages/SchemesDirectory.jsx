import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Search, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X,
  Building2,
  Sparkles
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { fetchSchemes } from '../api/client';

export default function SchemesDirectory() {
  const { t } = useTranslation();

  // State
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load schemes from backend API
  const loadSchemes = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSchemes(query);
      setSchemes(data || []);
    } catch (err) {
      console.error('Failed to load schemes:', err);
      setError(err.message || 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes(debouncedSearch);
  }, [debouncedSearch]);

  // Extract a clean phone number from contact_info string (e.g. "155261 / 011-24300606" -> "155261")
  const getPrimaryPhone = (contactStr) => {
    if (!contactStr) return null;
    const match = contactStr.match(/[\d-]{3,15}/);
    return match ? match[0].replace(/-/g, '') : null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('schemes.title')}
        subtitle={t('schemes.subtitle')}
        icon={FileText}
      />

      <div className="px-4 space-y-4">
        
        {/* Search Bar with Clear Button */}
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder={t('schemes.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-12 bg-white border-2 border-gray-300 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:outline-none shadow-sm placeholder:text-gray-400 placeholder:font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl transition-colors"
              title={t('schemes.clearSearch')}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results Header Count */}
        {!loading && (
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-700 px-1">
            <span className="flex items-center gap-1.5">
              <Building2 size={15} className="text-emerald-700" />
              <span>{t('schemes.totalSchemes')}</span>
            </span>
            <span className="bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full font-black">
              {schemes.length}
            </span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center space-y-2">
            <RefreshCw size={28} className="animate-spin text-emerald-700 mx-auto" />
            <p className="text-sm font-black text-gray-700">{t('common.loading')}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-5 flex items-center gap-3 text-red-950 shadow-sm">
            <AlertCircle size={24} className="text-red-700 shrink-0" />
            <p className="text-sm font-bold text-red-950">{error}</p>
          </div>
        )}

        {/* Empty State: No Schemes Found */}
        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-gray-300 text-center space-y-3 shadow-sm">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl w-fit mx-auto">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-lg font-black text-gray-950">
              {t('schemes.noSchemesFound')}
            </h4>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-2 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white px-5 py-2 rounded-xl text-xs font-black shadow-sm transition-colors"
              >
                {t('schemes.clearSearch')}
              </button>
            )}
          </div>
        )}

        {/* Schemes Cards List */}
        {!loading && !error && schemes.length > 0 && (
          <div className="space-y-4">
            {schemes.map((scheme) => {
              const primaryPhone = getPrimaryPhone(scheme.contact_info);

              return (
                <div
                  key={scheme.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm space-y-4 hover:border-emerald-300 transition-colors"
                >
                  {/* Card Title & Badge */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl shrink-0">
                      <Sparkles size={24} className="stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-black text-gray-950 leading-tight">
                        {scheme.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1.5 leading-relaxed">
                        {scheme.description}
                      </p>
                    </div>
                  </div>

                  {/* Eligibility Section */}
                  {scheme.eligibility && (
                    <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3.5 space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-800" />
                        <span>{t('schemes.eligibilityLabel')}</span>
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-normal">
                        {scheme.eligibility}
                      </p>
                    </div>
                  )}

                  {/* Actions & Contact Bar */}
                  <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Contact Info / Phone Call Link */}
                    {scheme.contact_info ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">
                          {t('schemes.contactLabel')}:
                        </span>
                        {primaryPhone ? (
                          <a
                            href={`tel:${primaryPhone}`}
                            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-red-950 bg-red-50 hover:bg-red-100 active:bg-red-200 px-3.5 py-2 rounded-xl border border-red-200 shadow-sm transition-colors"
                          >
                            <PhoneCall size={14} className="stroke-[2.5]" />
                            <span>{scheme.contact_info}</span>
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                            {scheme.contact_info}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Official Portal External Link */}
                    {scheme.link && (
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-emerald-950 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
                      >
                        <span>{t('schemes.officialPortalBtn')}</span>
                        <ExternalLink size={14} className="stroke-[2.5]" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
