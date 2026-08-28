import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, Camera, CheckCircle2, RefreshCw, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function DiseaseCheck() {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult({
        disease: 'Blight / Leaf Spot (पत्ती झुलसा रोग)',
        confidence: '94%',
        severity: 'Moderate',
        action: 'Spray Mancozeb 75% WP @ 2.5g per litre of water or Copper Oxychloride 50% WP @ 3g/L.',
        prevention: 'Avoid excessive nitrogen fertilization and prevent water stagnation near crop roots.',
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('diseaseCheck.title')}
        subtitle={t('diseaseCheck.subtitle')}
        icon={ScanLine}
      />

      <div className="px-4 space-y-4">
        {/* Banner Note */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950 shadow-sm">
          <AlertCircle size={24} className="text-amber-800 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
              Beta / Prototype
            </span>
            <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1.5 leading-relaxed">
              {t('diseaseCheck.bannerNote')}
            </p>
          </div>
        </div>

        {/* Upload / Camera Action Container */}
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Camera size={38} className="stroke-[2.3]" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950">
              {t('diseaseCheck.uploadTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold max-w-sm mx-auto mt-1 leading-relaxed">
              {t('diseaseCheck.uploadDesc')}
            </p>
          </div>

          <div className="pt-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={simulateScan}
              disabled={scanning}
              className="w-full min-h-[56px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-emerald-400 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-colors shadow-md"
            >
              {scanning ? (
                <>
                  <RefreshCw size={22} className="animate-spin" />
                  <span>Analyzing leaf image...</span>
                </>
              ) : (
                <>
                  <Sparkles size={22} className="stroke-[2.5]" />
                  <span>{t('diseaseCheck.mockAnalyzeBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Result Output */}
        {result && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <CheckCircle2 size={24} className="text-emerald-700 shrink-0" />
              <h4 className="text-lg sm:text-xl font-black text-gray-950 leading-tight">
                {t('diseaseCheck.sampleResultTitle')}
              </h4>
              <span className="ml-auto text-xs font-black px-2.5 py-1 bg-emerald-100 text-emerald-950 rounded-full shrink-0">
                {result.confidence} Match
              </span>
            </div>

            <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-300">
              <p className="text-xs text-emerald-950 font-black uppercase tracking-wider">Identified Disease</p>
              <p className="text-lg font-black text-emerald-950 mt-1">{result.disease}</p>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300">
                <p className="text-xs text-amber-950 font-black uppercase tracking-wider">Recommended Remedy & Spray</p>
                <p className="text-sm font-bold text-amber-950 mt-1 leading-relaxed">{result.action}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-700 font-black uppercase tracking-wider">Prevention Advice</p>
                <p className="text-sm font-semibold text-gray-800 mt-1 leading-relaxed">{result.prevention}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
