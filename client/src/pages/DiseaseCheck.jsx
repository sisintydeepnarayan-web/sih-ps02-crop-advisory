import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, Camera, Upload, AlertCircle, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';
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
        prevention: 'Avoid excessive nitrogen fertilization and avoid water stagnation near crop roots.',
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('diseaseCheck.title')}
        subtitle={t('diseaseCheck.subtitle')}
        icon={ScanLine}
      />

      <div className="px-4 space-y-4">
        {/* Banner note */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
          <AlertCircle size={24} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-black uppercase tracking-wide bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              Beta / Prototype
            </span>
            <p className="text-sm font-bold mt-1">
              {t('diseaseCheck.bannerNote')}
            </p>
          </div>
        </div>

        {/* Upload / Camera Action Container */}
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Camera size={38} className="stroke-[2.2]" />
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900">
              {t('diseaseCheck.uploadTitle')}
            </h3>
            <p className="text-sm text-gray-600 font-medium max-w-sm mx-auto mt-1">
              {t('diseaseCheck.uploadDesc')}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              type="button"
              onClick={simulateScan}
              disabled={scanning}
              className="w-full sm:w-auto flex-1 h-14 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              {scanning ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Analyzing leaf...</span>
                </>
              ) : (
                <>
                  <ScanLine size={20} />
                  <span>{t('diseaseCheck.mockAnalyzeBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Result Output */}
        {result && (
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <h4 className="text-lg font-black text-gray-900">
                {t('diseaseCheck.sampleResultTitle')}
              </h4>
              <span className="ml-auto text-xs font-black px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {result.confidence} Match
              </span>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200">
              <p className="text-xs text-emerald-900 font-bold uppercase">Identified Disease</p>
              <p className="text-lg font-black text-gray-950 mt-0.5">{result.disease}</p>
            </div>

            <div className="space-y-2">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-xs text-amber-900 font-bold uppercase">Recommended Action & Remedy</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">{result.action}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-bold uppercase">Prevention Advice</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{result.prevention}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
