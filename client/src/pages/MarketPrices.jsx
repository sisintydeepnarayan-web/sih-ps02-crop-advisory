import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Search, Store } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function MarketPrices() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const mandiData = [
    {
      id: 1,
      commodity: t('market.wheat'),
      variety: 'Sharbati / Lok-1',
      mandi: 'Varanasi APMC',
      min: 2350,
      max: 2550,
      modal: 2450,
      trend: 'up',
      change: '+₹50',
    },
    {
      id: 2,
      commodity: t('market.mustard'),
      variety: 'Pusa Bold',
      mandi: 'Agra APMC',
      min: 5400,
      max: 5800,
      modal: 5650,
      trend: 'up',
      change: '+₹80',
    },
    {
      id: 3,
      commodity: t('market.rice'),
      variety: 'Basmati / Common',
      mandi: 'Karnal APMC',
      min: 2200,
      max: 2450,
      modal: 2300,
      trend: 'stable',
      change: '0',
    },
    {
      id: 4,
      commodity: t('market.potato'),
      variety: 'Jyoti / Chipsona',
      mandi: 'Farrukhabad APMC',
      min: 1100,
      max: 1350,
      modal: 1220,
      trend: 'down',
      change: '-₹30',
    },
    {
      id: 5,
      commodity: t('market.cotton'),
      variety: 'Medium Staple',
      mandi: 'Rajkot APMC',
      min: 6800,
      max: 7400,
      modal: 7150,
      trend: 'up',
      change: '+₹110',
    },
  ];

  const filteredData = mandiData.filter((item) =>
    item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mandi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto pb-28">
      <PageHeader
        title={t('market.title')}
        subtitle={t('market.subtitle')}
        icon={TrendingUp}
      />

      <div className="px-4 space-y-4">
        {/* Search filter */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search crop or mandi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-13 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-bold text-gray-900 focus:border-emerald-600 focus:outline-none shadow-sm"
          />
        </div>

        {/* Mandi Cards List */}
        <div className="space-y-3.5">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{item.commodity}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mt-0.5">
                    <Store size={14} className="text-emerald-600" />
                    <span>{item.mandi}</span> • <span>{item.variety}</span>
                  </div>
                </div>

                <div className="text-right">
                  {item.trend === 'up' && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                      <ArrowUpRight size={14} />
                      <span>{item.change}</span>
                    </span>
                  )}
                  {item.trend === 'down' && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-black text-red-800 bg-red-100 px-2 py-1 rounded-lg">
                      <ArrowDownRight size={14} />
                      <span>{item.change}</span>
                    </span>
                  )}
                  {item.trend === 'stable' && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                      <Minus size={14} />
                      <span>{t('market.trendStable')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Price Triad */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-2xl p-3 text-center">
                <div>
                  <p className="text-[11px] font-bold text-gray-500">{t('market.minPrice')}</p>
                  <p className="text-base font-black text-gray-800 mt-0.5">₹{item.min}</p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="text-[11px] font-bold text-emerald-700">{t('market.modalPrice')}</p>
                  <p className="text-lg font-black text-emerald-800 mt-0.5">₹{item.modal}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500">{t('market.maxPrice')}</p>
                  <p className="text-base font-black text-gray-800 mt-0.5">₹{item.max}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
