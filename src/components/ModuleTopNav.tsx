import React from 'react';
import { ArrowLeft, Home, ChevronRight, Sparkles, LucideIcon } from 'lucide-react';
import { Language } from '../types';

interface ModuleTopNavProps {
  language: Language;
  moduleNameEn: string;
  moduleNameTa: string;
  badgeEn: string;
  badgeTa: string;
  subtitleEn: string;
  subtitleTa: string;
  themeColor?: 'amber' | 'rose' | 'blue' | 'emerald' | 'sky' | 'indigo' | 'purple' | 'violet' | 'teal' | 'orange';
  icon: LucideIcon;
  onBackToHome?: () => void;
  rightAction?: React.ReactNode;
}

const themeStyles = {
  amber: {
    badgeBg: 'bg-[#faf6ed]',
    badgeBorder: 'border-[#e8dcbb]',
    badgeText: 'text-[#7e5b0b]',
    iconBg: 'bg-[#b8860b]',
    accentText: 'text-[#b8860b]',
    backHover: 'hover:bg-amber-50 text-stone-700 hover:text-[#7e5b0b]',
    borderAccent: 'border-b-[#b8860b]/30',
  },
  rose: {
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-800',
    iconBg: 'bg-rose-600',
    accentText: 'text-rose-600',
    backHover: 'hover:bg-rose-50 text-stone-700 hover:text-rose-700',
    borderAccent: 'border-b-rose-400/30',
  },
  blue: {
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-600',
    accentText: 'text-blue-600',
    backHover: 'hover:bg-blue-50 text-stone-700 hover:text-blue-700',
    borderAccent: 'border-b-blue-400/30',
  },
  emerald: {
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    iconBg: 'bg-emerald-600',
    accentText: 'text-emerald-600',
    backHover: 'hover:bg-emerald-50 text-stone-700 hover:text-emerald-700',
    borderAccent: 'border-b-emerald-400/30',
  },
  sky: {
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200',
    badgeText: 'text-sky-800',
    iconBg: 'bg-sky-600',
    accentText: 'text-sky-600',
    backHover: 'hover:bg-sky-50 text-stone-700 hover:text-sky-700',
    borderAccent: 'border-b-sky-400/30',
  },
  indigo: {
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-800',
    iconBg: 'bg-indigo-600',
    accentText: 'text-indigo-600',
    backHover: 'hover:bg-indigo-50 text-stone-700 hover:text-indigo-700',
    borderAccent: 'border-b-indigo-400/30',
  },
  purple: {
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-800',
    iconBg: 'bg-purple-700',
    accentText: 'text-purple-700',
    backHover: 'hover:bg-purple-50 text-stone-700 hover:text-purple-700',
    borderAccent: 'border-b-purple-400/30',
  },
  violet: {
    badgeBg: 'bg-violet-50',
    badgeBorder: 'border-violet-200',
    badgeText: 'text-violet-800',
    iconBg: 'bg-violet-700',
    accentText: 'text-violet-700',
    backHover: 'hover:bg-violet-50 text-stone-700 hover:text-violet-700',
    borderAccent: 'border-b-violet-400/30',
  },
  teal: {
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    badgeText: 'text-teal-800',
    iconBg: 'bg-teal-600',
    accentText: 'text-teal-600',
    backHover: 'hover:bg-teal-50 text-stone-700 hover:text-teal-700',
    borderAccent: 'border-b-teal-400/30',
  },
  orange: {
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-800',
    iconBg: 'bg-orange-600',
    accentText: 'text-orange-600',
    backHover: 'hover:bg-orange-50 text-stone-700 hover:text-orange-700',
    borderAccent: 'border-b-orange-400/30',
  },
};

export const ModuleTopNav: React.FC<ModuleTopNavProps> = ({
  language,
  moduleNameEn,
  moduleNameTa,
  badgeEn,
  badgeTa,
  subtitleEn,
  subtitleTa,
  themeColor = 'amber',
  icon: Icon,
  onBackToHome,
  rightAction,
}) => {
  const t = (themeColor && themeStyles[themeColor]) || themeStyles.purple || themeStyles.amber;

  return (
    <div className={`mb-6 pb-4 border-b border-[#e8e3d8] ${t.borderAccent}`}>
      {/* Breadcrumb & Back Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          {onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e8e3d8] font-bold transition-all shadow-2xs cursor-pointer ${t.backHover}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Back to Portal Home' : 'முகப்புக்குத் திரும்பு'}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-stone-400" />
              <span>{language === 'en' ? 'Sangam Portal' : 'சங்க போர்ட்டல்'}</span>
            </span>
          )}

          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-stone-800 font-bold">
            {language === 'en' ? moduleNameEn : moduleNameTa}
          </span>
        </div>

        {rightAction && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>

      {/* Module Identity Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${t.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display tracking-tight">
                {language === 'en' ? moduleNameEn : moduleNameTa}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${t.badgeBg} ${t.badgeBorder} ${t.badgeText}`}>
                <Sparkles className="w-3 h-3" />
                <span>{language === 'en' ? badgeEn : badgeTa}</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl">
              {language === 'en' ? subtitleEn : subtitleTa}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
