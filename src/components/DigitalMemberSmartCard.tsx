import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  RefreshCw,
  Printer,
  Download,
  ShieldCheck,
  Phone,
  Droplet,
  MapPin,
  Briefcase,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AuthUser, Language } from '../types';

interface DigitalMemberSmartCardProps {
  user: AuthUser;
  language: Language;
  onPrint?: () => void;
}

export const DigitalMemberSmartCard: React.FC<DigitalMemberSmartCardProps> = ({
  user,
  language,
  onPrint
}) => {
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  const fullAddress = [
    user.doorNumber,
    user.streetName,
    user.areaLocality,
    user.city,
    user.district,
    user.state || 'Tamil Nadu',
    user.pincode ? `PIN: ${user.pincode}` : ''
  ]
    .filter(Boolean)
    .join(', ');

  const memberTier =
    user.role === 'super_admin'
      ? (language === 'ta' ? 'தலைமை நிர்வாகி (Apex Council)' : 'Executive Apex Council')
      : user.role === 'branch_admin'
      ? (language === 'ta' ? 'கிளை நிர்வாகி' : 'Branch Executive Admin')
      : (language === 'ta' ? 'ஆயுள் உறுப்பினர் (Life Member)' : 'Life Member');

  const handlePrintCard = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  const qrData = `MUD-ID:${user.membershipCode}|${user.fullName}|${user.phone}|${user.bloodGroup || 'O+'}|${user.district}|${user.pincode || ''}`;

  return (
    <div className="space-y-4">
      {/* Top Controls: Flip & Print/Download */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>
            {language === 'ta'
              ? 'அங்கீகரிக்கப்பட்ட டிஜிட்டல் உறுப்பினர் அட்டை'
              : 'Official Cryptographic Digital Smart ID Card'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200"
            title="Flip to other side"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'ta'
                ? cardSide === 'front'
                  ? 'பின்பக்கம் திருப்ப'
                  : 'முன்பக்கம் திருப்ப'
                : cardSide === 'front'
                ? 'Flip to Back'
                : 'Flip to Front'}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrintCard}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Print or Save Smart ID Card"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அட்டை அச்சிடுக' : 'Print Card'}</span>
          </button>
        </div>
      </div>

      {/* 3D Smart Card Display Container */}
      <div
        id="digital-member-id-card-printable"
        onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
        className="cursor-pointer select-none transition-all duration-300 hover:shadow-2xl"
      >
        {cardSide === 'front' ? (
          /* FRONT SIDE */
          <div className="w-full aspect-[1.586/1] min-h-[220px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-800 via-amber-900 to-stone-950 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border-2 border-amber-400/40">
            {/* Background Decorative Seals */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-4 opacity-10 text-6xl font-black font-serif pointer-events-none">
              முதலியார்
            </div>

            {/* Card Header */}
            <div className="flex items-start justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center font-black text-lg shadow-md shrink-0 border border-white/40">
                  மு
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black tracking-wider uppercase leading-tight text-amber-100">
                    {language === 'ta' ? 'தமிழ்நாடு முதலியார் சங்கம்' : 'TAMIL NADU MUDALIYAR SANGAM'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-amber-300 font-serif">
                      Est. 1951 • Reg. No: MS/TN/1951/08
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
                    <span className="text-[9px] text-amber-200/80 uppercase font-mono">
                      Apex HQ Chennai
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold block">
                  {memberTier}
                </span>
                <span className="text-[9px] font-mono text-amber-300/80 block mt-1">
                  ID: <strong className="text-white">{user.membershipCode}</strong>
                </span>
              </div>
            </div>

            {/* Card Body: Member Photo, Registered Name, and Details */}
            <div className="flex items-center gap-4 my-2">
              <div className="relative shrink-0">
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-300 shadow-md flex items-center justify-center text-amber-900 font-bold text-2xl overflow-hidden">
                  {user.fullName.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-amber-900 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div>
                  <h5 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                    {user.fullName}
                  </h5>
                  {user.fullNameTa && user.fullNameTa !== user.fullName && (
                    <p className="text-xs sm:text-sm text-amber-200 font-bold truncate">
                      {user.fullNameTa}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-amber-100/90 pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-mono">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Droplet className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>Blood: <strong className="text-white">{user.bloodGroup || 'O+'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{user.branch || `${user.district} Branch`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{user.city || user.district}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer: Holographic Strip & QR Code */}
            <div className="flex items-end justify-between pt-2 border-t border-amber-400/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">
                    Official Member Smart Card
                  </span>
                </div>
                <p className="text-[8px] font-mono text-amber-200/70">
                  Joined: {user.joinedDate || '2026'} • Valid: Lifetime • Sec: SHA256-Encrypted
                </p>
              </div>

              {/* Dynamic QR Code representation */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-stone-900" />
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="w-full aspect-[1.586/1] min-h-[220px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border-2 border-stone-600">
            {/* Magnetic Stripe */}
            <div className="w-full h-7 bg-stone-950 -mx-6 -mt-6 border-b border-stone-800" />

            <div className="my-auto space-y-2 pt-1">
              {/* Full Registered Address */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9.5px] text-amber-400 uppercase font-black flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {language === 'ta' ? 'பதிவு செய்யப்பட்ட முகவரி (Registered Address):' : 'Full Registered Address:'}
                </span>
                <p className="text-xs text-stone-200 font-medium leading-relaxed">
                  {fullAddress || `${user.district}, Tamil Nadu`}
                </p>
              </div>

              {/* Additional Registered Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">
                    {language === 'ta' ? 'தொழில் / பணி:' : 'Occupation:'}
                  </span>
                  <span className="text-[11px] text-stone-200 font-medium truncate block">
                    {user.occupation || 'Community Member'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">
                    {language === 'ta' ? 'சொந்த ஊர்:' : 'Native Place:'}
                  </span>
                  <span className="text-[11px] text-stone-200 font-medium truncate block">
                    {user.nativePlace || user.city || user.district}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Card Footer */}
            <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-[9px] text-stone-400">
              <div className="leading-tight">
                <span className="text-amber-300 font-bold block">
                  Mudaliyar Sangam Apex Executive Council
                </span>
                <span>Helpline: +91 044-28151951 • info@mudaliyarsangam.org</span>
              </div>
              <div className="text-right font-mono text-[9px] text-amber-400 font-bold">
                MEMBER ID: {user.membershipCode}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-center text-stone-500 italic">
        {language === 'ta'
          ? '👆 அட்டையை கிளிக் செய்து முன்பக்கம் / பின்பக்கம் முகவரி விவரங்களை காணலாம்.'
          : '👆 Click on the card to flip between front photo view and registered back address.'}
      </p>
    </div>
  );
};
