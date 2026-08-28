import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

/**
 * Custom Tooltip for Recharts with high contrast & tap-friendly sizing
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const price = payload[0].value;
    return (
      <div className="bg-gray-900 text-white rounded-2xl p-3 shadow-xl border border-gray-700 text-xs sm:text-sm">
        <p className="font-bold text-gray-300 mb-0.5">{label}</p>
        <p className="text-base sm:text-lg font-black text-emerald-400">
          ₹{price?.toLocaleString('en-IN')}{' '}
          <span className="text-xs font-semibold text-gray-400">/ Quintal</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceChart({ prices = [], crop = 'Wheat', district = 'Nashik' }) {
  const { t } = useTranslation();

  // Sort prices chronologically (oldest to newest) for chart display
  const sortedPrices = [...prices].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // If fewer than 2 price entries exist, show friendly empty state
  if (!sortedPrices || sortedPrices.length < 2) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 text-center space-y-2.5">
        <div className="p-3 bg-gray-100 rounded-2xl w-fit mx-auto text-gray-500">
          <AlertCircle size={28} />
        </div>
        <h4 className="text-base font-black text-gray-800">
          {t('market.chartTitle')}
        </h4>
        <p className="text-xs sm:text-sm font-bold text-gray-500 max-w-sm mx-auto">
          {t('market.notEnoughData')}
        </p>
      </div>
    );
  }

  // Format date strings for clean mobile X-axis (e.g. "22 Aug")
  const chartData = sortedPrices.map((item) => {
    const d = new Date(item.date);
    const formattedDate = !isNaN(d)
      ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
      : item.date;

    return {
      date: formattedDate,
      fullDate: item.date,
      price: Number(item.price_per_quintal),
    };
  });

  // Calculate percentage change between most recent and previous entry
  const latestEntry = sortedPrices[sortedPrices.length - 1];
  const previousEntry = sortedPrices[sortedPrices.length - 2];
  const latestPrice = Number(latestEntry.price_per_quintal);
  const previousPrice = Number(previousEntry.price_per_quintal);

  let percentChange = 0;
  if (previousPrice > 0) {
    percentChange = ((latestPrice - previousPrice) / previousPrice) * 100;
  }
  const formattedPercent = Math.abs(percentChange).toFixed(1);

  // Determine fluctuation badge state (>10% rise, >10% drop, or stable)
  const isSignificantRise = percentChange >= 10;
  const isSignificantDrop = percentChange <= -10;

  // Compute min/max for Y-axis domain
  const priceValues = chartData.map((d) => d.price);
  const minVal = Math.min(...priceValues);
  const maxVal = Math.max(...priceValues);
  const yMin = Math.max(0, Math.floor(minVal * 0.95));
  const yMax = Math.ceil(maxVal * 1.05);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-4">
      
      {/* Header & Fluctuation Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {district} • {crop}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-950 mt-1">
              {t('market.chartTitle')}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-gray-500 uppercase">{t('market.latestPriceLabel')}</p>
            <p className="text-lg sm:text-xl font-black text-gray-900">
              ₹{latestPrice.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-semibold text-gray-500">/Qtl</span>
            </p>
          </div>
        </div>

        {/* Significant Price Fluctuation Notification Banner */}
        {isSignificantRise && (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-950 shadow-sm">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
              <TrendingUp size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-emerald-900">
                {t('market.priceRiseBadge', { percent: formattedPercent })}
              </p>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                {t('market.previousPriceLabel')}: ₹{previousPrice.toLocaleString('en-IN')} ➔ ₹{latestPrice.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}

        {isSignificantDrop && (
          <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-3.5 flex items-center gap-3 text-red-950 shadow-sm">
            <div className="p-2 bg-red-600 text-white rounded-xl shrink-0">
              <TrendingDown size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-red-900">
                {t('market.priceDropBadge', { percent: formattedPercent })}
              </p>
              <p className="text-xs font-semibold text-red-800 mt-0.5">
                {t('market.previousPriceLabel')}: ₹{previousPrice.toLocaleString('en-IN')} ➔ ₹{latestPrice.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}

        {!isSignificantRise && !isSignificantDrop && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center gap-2.5 text-gray-800">
            <Minus size={18} className="text-gray-500 shrink-0" />
            <p className="text-xs font-bold text-gray-700">
              {t('market.priceStableBadge', { percent: formattedPercent })}
            </p>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 sm:h-64 pt-2 -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#047857"
              strokeWidth={3.5}
              dot={{ r: 4, fill: '#047857', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#059669', stroke: '#ffffff', strokeWidth: 2.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Stats Footer */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase">{t('market.highestPrice')}</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">₹{maxVal.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase">{t('market.lowestPrice')}</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">₹{minVal.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase">{t('market.averagePrice')}</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">
            ₹{Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

    </div>
  );
}
