import React from 'react';
import { Landmark, Crown, Flower2, Flame, Feather, ScrollText, Sparkles } from 'lucide-react';
import { PortalBranding } from '../data/portalContentData';

interface SangamLogoProps {
  branding?: PortalBranding;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const SangamLogo: React.FC<SangamLogoProps> = ({
  branding,
  size = 'md',
  className = '',
  showBorder = true
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl'
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4.5 h-4.5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  };

  const borderClass = showBorder
    ? 'border border-[#d4af37]/60 shadow-[0_4px_12px_rgba(180,130,20,0.15)] ring-1 ring-[#b8860b]/20'
    : '';

  // 1. Custom Image URL or Base64 Uploaded Logo
  if (branding?.logoUrl) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden bg-white shrink-0 ${sizeClasses[size]} ${borderClass} ${className}`}
      >
        <img
          src={branding.logoUrl}
          alt={branding.sangamNameTa || branding.sangamNameEn || 'Sangam Logo'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            // Fallback if image link fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Preset Heritage Emblems
  const preset = branding?.logoIconPreset || 'gopuram';
  const monogram = branding?.monogram || 'MS';

  const renderPresetIcon = () => {
    switch (preset) {
      case 'lion':
        return <Crown className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
      case 'lotus':
        return <Flower2 className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
      case 'lamp':
        return <Flame className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
      case 'peacock':
        return <Feather className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
      case 'palmleaf':
        return <ScrollText className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
      case 'gopuram':
      default:
        return <Landmark className={`${iconSizes[size]} text-[#fbf0d9] drop-shadow-xs`} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#801524] via-[#942031] to-[#670f1b] text-white font-black shrink-0 ${sizeClasses[size]} ${borderClass} ${className}`}
    >
      {/* Background Decorative Gold Ring */}
      <div className="absolute inset-0 bg-radial from-[#d4af37]/25 to-transparent pointer-events-none rounded-2xl" />

      {/* Preset Icon or Monogram */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {renderPresetIcon()}
        {size === 'xl' && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#fbf0d9] mt-0.5 font-display">
            {monogram}
          </span>
        )}
      </div>
    </div>
  );
};
