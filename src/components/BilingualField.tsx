import React from 'react';
import { Languages, Loader2 } from 'lucide-react';

interface BilingualFieldProps {
  labelTa: string;
  labelEn: string;
  valueTa: string;
  valueEn: string;
  onChangeTa: (val: string) => void;
  onChangeEn: (val: string) => void;
  isTextarea?: boolean;
  rows?: number;
  fieldId: string;
  autoTranslateEnabled?: boolean;
  isTranslating?: boolean;
  onTranslate?: (from: 'ta' | 'en') => void;
  placeholderTa?: string;
  placeholderEn?: string;
  helperText?: string;
  className?: string;
}

export const BilingualField: React.FC<BilingualFieldProps> = ({
  labelTa,
  labelEn,
  valueTa,
  valueEn,
  onChangeTa,
  onChangeEn,
  isTextarea = false,
  rows = 2,
  fieldId,
  autoTranslateEnabled = true,
  isTranslating = false,
  onTranslate,
  placeholderTa = '',
  placeholderEn = '',
  helperText,
  className = ''
}) => {
  const handleBlurTa = () => {
    if (autoTranslateEnabled && valueTa?.trim() && onTranslate) {
      onTranslate('ta');
    }
  };

  const handleBlurEn = () => {
    if (autoTranslateEnabled && valueEn?.trim() && onTranslate) {
      onTranslate('en');
    }
  };

  return (
    <div className={`space-y-1.5 p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 ${className}`}>
      {helperText && (
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium pb-1">
          {helperText}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Tamil Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1.5">
            <label
              htmlFor={`${fieldId}-ta`}
              className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5"
            >
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-200/90 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                தமிழ்
              </span>
              <span>{labelTa}</span>
            </label>

            {onTranslate && (
              <button
                type="button"
                onClick={() => onTranslate('ta')}
                disabled={isTranslating || !valueTa?.trim()}
                className="text-[10.5px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
                title="Convert Tamil to English"
              >
                {isTranslating ? (
                  <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                ) : (
                  <Languages className="w-3 h-3 text-amber-600" />
                )}
                <span>➔ ஆங்கிலத்திற்கு</span>
              </button>
            )}
          </div>

          {isTextarea ? (
            <textarea
              id={`${fieldId}-ta`}
              rows={rows}
              value={valueTa || ''}
              onChange={(e) => onChangeTa(e.target.value)}
              onBlur={handleBlurTa}
              placeholder={placeholderTa || 'தமிழில் உள்ளிடவும்...'}
              className="w-full text-xs p-2.5 rounded-xl border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed font-sans"
            />
          ) : (
            <input
              id={`${fieldId}-ta`}
              type="text"
              value={valueTa || ''}
              onChange={(e) => onChangeTa(e.target.value)}
              onBlur={handleBlurTa}
              placeholder={placeholderTa || 'தமிழில் உள்ளிடவும்...'}
              className="w-full text-xs p-2.5 rounded-xl border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans"
            />
          )}
        </div>

        {/* English Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1.5">
            <label
              htmlFor={`${fieldId}-en`}
              className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
            >
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                English
              </span>
              <span>{labelEn}</span>
            </label>

            {onTranslate && (
              <button
                type="button"
                onClick={() => onTranslate('en')}
                disabled={isTranslating || !valueEn?.trim()}
                className="text-[10.5px] font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
                title="Convert English to Tamil"
              >
                {isTranslating ? (
                  <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
                ) : (
                  <Languages className="w-3 h-3 text-sky-600" />
                )}
                <span>➔ தமிழுக்கு</span>
              </button>
            )}
          </div>

          {isTextarea ? (
            <textarea
              id={`${fieldId}-en`}
              rows={rows}
              value={valueEn || ''}
              onChange={(e) => onChangeEn(e.target.value)}
              onBlur={handleBlurEn}
              placeholder={placeholderEn || 'Enter in English...'}
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed font-sans"
            />
          ) : (
            <input
              id={`${fieldId}-en`}
              type="text"
              value={valueEn || ''}
              onChange={(e) => onChangeEn(e.target.value)}
              onBlur={handleBlurEn}
              placeholder={placeholderEn || 'Enter in English...'}
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-sans"
            />
          )}
        </div>
      </div>
    </div>
  );
};
