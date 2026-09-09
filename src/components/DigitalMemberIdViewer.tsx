import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Language, AuthUser } from '../types';
import { ModuleTopNav } from './ModuleTopNav';
import { DigitalMemberSmartCard } from './DigitalMemberSmartCard';
import { loadCurrentUser } from '../data/authData';

interface DigitalMemberIdViewerProps {
  language: Language;
  onBackToHome?: () => void;
  currentUser?: AuthUser | null;
}

export const DigitalMemberIdViewer: React.FC<DigitalMemberIdViewerProps> = ({
  language,
  onBackToHome,
  currentUser: propUser
}) => {
  const currentUser = propUser || loadCurrentUser();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          {language === 'ta'
            ? 'அடையாள அட்டையைக் காண உள்நுழையவும்'
            : 'Please Sign In to View Your Digital Member Smart ID Card'}
        </h2>
        <p className="text-xs text-stone-600 mt-2">
          {language === 'ta'
            ? 'உங்கள் உறுப்பினர் எண் மற்றும் முகவரி விவரங்கள் தானாகவே அட்டையில் தோன்றும்.'
            : 'Your official membership code and registered address details are embedded on the smart card.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ModuleTopNav
        language={language}
        moduleTitleEn="Digital Member Smart ID Card"
        moduleTitleTa="டிஜிட்டல் உறுப்பினர் ஸ்மார்ட் அடையாள அட்டை"
        onBackToHome={onBackToHome}
        badgeText={language === 'ta' ? 'அதிகாரப்பூர்வ அட்டை' : 'Official Smart Card'}
      />

      <div className="bg-white rounded-3xl border border-[#e8e3d8] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              {language === 'ta'
                ? 'உங்கள் அதிகாரப்பூர்வ ஸ்மார்ட் அட்டை & முகவரி பதிவு'
                : 'Your Official Member Smart Card & Address Details'}
            </h3>
            <p className="text-[11px] text-stone-500">
              {language === 'ta'
                ? 'இந்த அட்டை உங்கள் சுயவிவரத்தில் எப்போதும் கிடைக்கும்.'
                : 'Accessible directly from your profile under your logged-in name.'}
            </p>
          </div>
        </div>

        <DigitalMemberSmartCard user={currentUser} language={language} />
      </div>
    </div>
  );
};
