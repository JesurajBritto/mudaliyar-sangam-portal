import React from 'react';
import {
  Users,
  Building2,
  MapPin,
  GitBranch,
  HeartPulse,
  TrendingUp,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../../types';
import { AddressBookAnalytics } from '../../data/addressBookData';

interface AddressBookAnalyticsCardsProps {
  language: Language;
  analytics: AddressBookAnalytics;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const AddressBookAnalyticsCards: React.FC<AddressBookAnalyticsCardsProps> = ({
  language,
  analytics,
  selectedDistrict,
  onSelectDistrict,
  selectedBranch,
  onSelectBranch,
  selectedCity,
  onSelectCity,
}) => {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-50 to-purple-500/5 dark:from-amber-950/30 dark:via-zinc-900 dark:to-purple-950/20 border border-amber-300/80 dark:border-amber-900/40 shadow-xs">
      {/* Top Stat Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
            {language === 'en'
              ? 'Sangam Demographics & Member Census (Admin & Super Admin View)'
              : 'சங்க மக்கள்தொகை & அங்கத்தினர் கணக்கெடுப்பு (நிர்வாக பார்வை)'}
          </h3>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
          {language === 'en' ? 'Live Dynamic Counts' : 'நேரடி கணக்கெடுப்பு'}
        </span>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold">{language === 'en' ? 'Total Family Heads' : 'குடும்பத் தலைவர்கள்'}</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono">
            {analytics.totalPrimaryMembers}
          </div>
          <span className="text-[10px] text-zinc-400 block">{language === 'en' ? 'Registered Primary Members' : 'முதன்மை உறுப்பினர்கள்'}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold">{language === 'en' ? 'Family Members' : 'குடும்ப உறுப்பினர்கள்'}</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300 font-mono">
            +{analytics.totalFamilyMembers}
          </div>
          <span className="text-[10px] text-zinc-400 block">{language === 'en' ? 'Wife, Children, Parents' : 'மனைவி, பிள்ளைகள், பெற்றோர்'}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-600 text-white shadow-xs">
          <div className="flex items-center justify-between text-amber-100 mb-1">
            <span className="text-[11px] font-semibold">{language === 'en' ? 'Total Community Strength' : 'மொத்த சமூக பலம்'}</span>
            <Building2 className="w-4 h-4 text-amber-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {analytics.totalCombinedPopulation}
          </div>
          <span className="text-[10px] text-amber-100 block">{language === 'en' ? 'Combined Total Individuals' : 'மொத்த குடும்ப உறுப்பினர்கள்'}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold">{language === 'en' ? 'Sangam Branches' : 'சங்க கிளைகள்'}</span>
            <GitBranch className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
            {analytics.branchCounts.length}
          </div>
          <span className="text-[10px] text-zinc-400 block">{language === 'en' ? `Across ${analytics.districtCounts.length} Districts` : `${analytics.districtCounts.length} மாவட்டங்களில்`}</span>
        </div>
      </div>

      {/* 3 Detailed Breakdown Grids: District-wise, City-wise, Branch-wise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* District-wise Count */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {language === 'en' ? 'District-wise Breakdown' : 'மாவட்டம் வாரியான கணக்கு'}
            </span>
            {selectedDistrict !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectDistrict('all')}
                className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 underline"
              >
                {language === 'en' ? 'Reset' : 'அனைத்தும்'}
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {analytics.districtCounts.map((item) => {
              const isSelected = selectedDistrict.toLowerCase() === item.district.toLowerCase();
              return (
                <button
                  key={item.district}
                  type="button"
                  onClick={() => onSelectDistrict(isSelected ? 'all' : item.district)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'bg-amber-100/80 dark:bg-amber-950/80 border-amber-400 text-amber-950 dark:text-amber-100 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-150 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate pr-1">{item.district}</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      {item.count} <span className="text-[10px] font-normal text-zinc-400">({item.percentage}%)</span>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* City-wise Count */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              {language === 'en' ? 'City / Town-wise Breakdown' : 'நகரம் வாரியான கணக்கு'}
            </span>
            {selectedCity !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectCity('all')}
                className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 underline"
              >
                {language === 'en' ? 'Reset' : 'அனைத்தும்'}
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {analytics.cityCounts.map((item) => {
              const isSelected = selectedCity.toLowerCase() === item.city.toLowerCase();
              return (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => onSelectCity(isSelected ? 'all' : item.city)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'bg-purple-100/80 dark:bg-purple-950/80 border-purple-400 text-purple-950 dark:text-purple-100 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-150 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate pr-1">{item.city}</span>
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-300 shrink-0">
                      {item.count} <span className="text-[10px] font-normal text-zinc-400">({item.percentage}%)</span>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Branch-wise Count */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'en' ? 'Branch-wise Breakdown' : 'சங்க கிளை வாரியான கணக்கு'}
            </span>
            {selectedBranch !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectBranch('all')}
                className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 underline"
              >
                {language === 'en' ? 'Reset' : 'அனைத்தும்'}
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {analytics.branchCounts.map((item) => {
              const isSelected = selectedBranch.toLowerCase() === item.branch.toLowerCase();
              return (
                <button
                  key={item.branch}
                  type="button"
                  onClick={() => onSelectBranch(isSelected ? 'all' : item.branch)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-400 text-emerald-950 dark:text-emerald-100 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-150 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate pr-1">{item.branch}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {item.count} <span className="text-[10px] font-normal text-zinc-400">({item.percentage}%)</span>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
