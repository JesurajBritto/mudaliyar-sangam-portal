import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Scan,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building,
  UserCheck,
  Utensils,
  PackageCheck,
  RefreshCw
} from 'lucide-react';
import { Language, DigitalMemberCard, EventCheckInRecord } from '../types';
import { ModuleTopNav } from './ModuleTopNav';

interface DigitalMemberIdViewerProps {
  language: Language;
  onBackToHome?: () => void;
}

const SAMPLE_MEMBERS: DigitalMemberCard[] = [
  {
    membershipCode: 'MUD-CHN-2024-0012',
    fullName: 'Er. S. Karthikeyan Mudaliyar',
    fullNameTa: 'பொறியாளர் எஸ். கார்த்திகேயன்',
    memberTier: 'Life Member',
    joinedYear: '2024',
    validUntil: 'Lifetime',
    nativePlace: 'Kanchipuram Silk Town',
    bloodGroup: 'O+ Positive',
    phone: '+91 98401 22345',
    kulaDeivam: 'Sri Vaitheeswaran Kovil, Angaragan Sannidhi',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    qrPayload: 'MUD-ID:MUD-CHN-2024-0012|KARTHIKEYAN|O_POS|LIFE_MEMBER',
    verificationHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    membershipCode: 'MUD-VLR-2022-0145',
    fullName: 'Dr. Keerthana Soundararajan, MD',
    fullNameTa: 'மருத்துவர் கீர்த்தனா சௌந்தரராஜன்',
    memberTier: 'Patron Member',
    joinedYear: '2022',
    validUntil: 'Lifetime',
    nativePlace: 'Vellore Fort Area',
    bloodGroup: 'B+ Positive',
    phone: '+91 98403 44556',
    kulaDeivam: 'Sri Jalakanteswarar Temple, Vellore',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    qrPayload: 'MUD-ID:MUD-VLR-2022-0145|KEERTHANA|B_POS|PATRON_MEMBER',
    verificationHash: 'SHA256:4a89047b4d1b7a2d67e583e7890b9b3e6488d5e8080f55f2d62d3a36284fe904'
  }
];

const INITIAL_CHECKINS: EventCheckInRecord[] = [
  {
    id: 'chk-001',
    eventId: 'evt-jubilee-2026',
    eventName: '75th Sangam Diamond Jubilee Mega Convention',
    memberCode: 'MUD-CHN-2024-0012',
    memberName: 'Er. S. Karthikeyan Mudaliyar',
    checkInTime: '09:14 AM, Today',
    verifiedByOfficer: 'Gate 2 - Thiru. Chandrasekaran',
    gateLocation: 'Main Auditorium West Gate',
    foodCouponIssued: true,
    delegateKitIssued: true,
    status: 'verified'
  },
  {
    id: 'chk-002',
    eventId: 'evt-jubilee-2026',
    eventName: '75th Sangam Diamond Jubilee Mega Convention',
    memberCode: 'MUD-CBE-2023-0481',
    memberName: 'Thiru. K. Shanmugasundaram Mudaliyar',
    checkInTime: '09:22 AM, Today',
    verifiedByOfficer: 'Gate 1 - Executive Admin Portal',
    gateLocation: 'VIP Entry Portico',
    foodCouponIssued: true,
    delegateKitIssued: true,
    status: 'verified'
  }
];

export const DigitalMemberIdViewer: React.FC<DigitalMemberIdViewerProps> = ({ language, onBackToHome }) => {
  const [activeMemberIdx, setActiveMemberIdx] = useState<number>(0);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [checkIns, setCheckIns] = useState<EventCheckInRecord[]>(INITIAL_CHECKINS);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [selectedEvent] = useState<string>('75th Sangam Diamond Jubilee Mega Convention 2026');

  const currentMember = SAMPLE_MEMBERS[activeMemberIdx];

  // Simulated QR scan handler
  const handleSimulateScan = (member: DigitalMemberCard) => {
    const newRecord: EventCheckInRecord = {
      id: `chk-${Date.now().toString().slice(-4)}`,
      eventId: 'evt-jubilee-2026',
      eventName: selectedEvent,
      memberCode: member.membershipCode,
      memberName: member.fullName,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifiedByOfficer: 'Mobile QR Gate Terminal #1',
      gateLocation: 'Main Hall Turnstile A',
      foodCouponIssued: true,
      delegateKitIssued: true,
      status: 'verified'
    };

    setCheckIns([newRecord, ...checkIns]);
    setScanResult(`Verified: ${member.fullName} (${member.membershipCode}) • Food Token #FT-${Math.floor(100 + Math.random() * 900)} Generated`);
    setTimeout(() => setScanResult(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Digital Member Smart ID Card"
        moduleNameTa="டிஜிட்டல் உறுப்பினர் ஸ்மார்ட் அடையாள அட்டை"
        badgeEn="Cryptographic Credential & QR Pass"
        badgeTa="பாதுகாப்பான டிஜிட்டல் அட்டை"
        subtitleEn="Official tamper-proof cryptographic membership smart card with event QR check-in protocol."
        subtitleTa="பாதுகாப்பான QR குறியீடுடன் கூடிய சங்க அடையாள அட்டை & மாநாட்டு உடனடி வருகைப்பதிவு."
        themeColor="purple"
        icon={CreditCard}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Card (Violet / Indigo Security Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/90 via-white to-indigo-50/50 border border-purple-200/90 shadow-[0_4px_24px_rgba(124,58,237,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Digital Member Smart ID Card & Event QR Check-in'
                  : 'டிஜிட்டல் உறுப்பினர் ஸ்மார்ட் அடையாள அட்டை & மாநாட்டு QR வருகைப்பதிவு'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
              {language === 'en'
                ? 'Official tamper-proof cryptographic Sangam ID card with QR code. Seamless 1-second contactless check-in at Sangam conventions, automated delegate kit and food coupon tokens.'
                : 'பாதுகாப்பான கிரிப்டோகிராபிக் QR குறியீடுடன் கூடிய சங்க அடையாள அட்டை. சங்க மாநாடுகள் மற்றும் நிகழ்ச்சிகளில் 1-வினாடி வருகைப்பதிவு மற்றும் உணவு கூப்பன் டோக்கன்.'}
            </p>
          </div>

          {/* Member Switcher */}
          <div className="flex items-center gap-2.5 shrink-0 bg-white p-2 rounded-2xl border border-purple-200/80 shadow-2xs">
            <span className="text-xs text-stone-500 font-bold">{language === 'en' ? 'Select Member:' : 'உறுப்பினர்:'}</span>
            <select
              value={activeMemberIdx}
              onChange={(e) => setActiveMemberIdx(Number(e.target.value))}
              className="text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {SAMPLE_MEMBERS.map((m, idx) => (
                <option key={m.membershipCode} value={idx}>
                  {m.fullName} ({m.membershipCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Card on Left, QR Check-in Scanner on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Digital ID Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {language === 'en' ? 'Smart Card Preview' : 'அடையாள அட்டை பார்வை'}
            </h3>
            <button
              type="button"
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip to {cardSide === 'front' ? 'Back' : 'Front'}</span>
            </button>
          </div>

          {/* 3D-styled Flip Card Container */}
          <div
            onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
            className="cursor-pointer group select-none transition-transform hover:scale-[1.01]"
          >
            {cardSide === 'front' ? (
              /* Front of Card */
              <div className="w-full aspect-[1.586/1] rounded-3xl p-6 bg-gradient-to-br from-amber-700 via-amber-800 to-zinc-950 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-400/30">
                {/* Gold Watermark & Accents */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-15 text-5xl font-black font-serif pointer-events-none">
                  MUD
                </div>

                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shadow-xs">
                        மு
                      </div>
                      <div>
                        <h4 className="text-xs font-black tracking-wider uppercase leading-none">
                          Mudaliyar Sangam
                        </h4>
                        <span className="text-[10px] text-amber-300 font-serif leading-none block mt-0.5">
                          முதலியார் சங்கம் (Est. 1951)
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold">
                      {currentMember.memberTier.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Card Middle: Photo, Name, and Details */}
                <div className="flex items-center gap-4 my-2">
                  <img
                    src={currentMember.photoUrl}
                    alt={currentMember.fullName}
                    className="w-16 h-18 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-black text-white leading-tight truncate">
                      {currentMember.fullName}
                    </h5>
                    <p className="text-xs text-amber-200 font-medium truncate mt-0.5">
                      {currentMember.fullNameTa}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-amber-100/80">
                      <span>ID: <strong>{currentMember.membershipCode}</strong></span>
                      <span>•</span>
                      <span>Blood: <strong>{currentMember.bloodGroup}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: QR Code + Microprint */}
                <div className="flex items-end justify-between pt-2 border-t border-amber-500/20">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-amber-300/80 block">VALIDITY</span>
                    <span className="text-[11px] font-bold text-white">{currentMember.validUntil}</span>
                    <span className="text-[8px] font-mono text-amber-200/50 block mt-0.5">
                      {currentMember.verificationHash.slice(0, 24)}...
                    </span>
                  </div>

                  {/* Sharp vector QR code simulation */}
                  <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-xs flex items-center justify-center">
                    <QrCode className="w-full h-full text-zinc-950" />
                  </div>
                </div>
              </div>
            ) : (
              /* Back of Card */
              <div className="w-full aspect-[1.586/1] rounded-3xl p-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-zinc-700">
                {/* Magnetic Stripe representation */}
                <div className="w-full h-8 bg-zinc-950 -mx-6 -mt-6 border-b border-zinc-800" />

                <div className="space-y-2 text-xs my-2">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Paternal Lineage & Temple:</span>
                    <span className="text-[11px] text-zinc-200">{currentMember.kulaDeivam}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Native Place:</span>
                    <span className="text-[11px] text-zinc-200">{currentMember.nativePlace}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Registered Mobile & Helpline:</span>
                    <span className="text-[11px] font-mono text-zinc-200">{currentMember.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-700/60 flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Authorized by Mudaliyar Sangam Apex Executive Council</span>
                  <span className="font-mono text-amber-300">Secured Digital ID</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions for Member Card */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Downloaded Digital Member ID for ${currentMember.fullName} (PDF/PNG format).`)}
              className="flex-1 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital ID (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateScan(currentMember)}
              className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Simulate QR Scan</span>
            </button>
          </div>
        </div>

        {/* Right Column: Event QR Check-in Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Scan className="w-4 h-4 text-purple-600" />
                  <span>Event Gate QR Scanner Terminal</span>
                </h3>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{selectedEvent}</span>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Gate Camera Ready
              </span>
            </div>

            {/* Live Scan Notification Alert */}
            {scanResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs flex items-center justify-between animate-in zoom-in-95">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">1-Second Check-in Successful!</span>
                    <span>{scanResult}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                    Food Token Issued
                  </span>
                </div>
              </div>
            )}

            {/* Quick Test Scan Buttons */}
            <div>
              <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">
                Click a member below to simulate instant gate scan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_MEMBERS.map((m) => (
                  <button
                    key={m.membershipCode}
                    type="button"
                    onClick={() => handleSimulateScan(m)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-left transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-9 h-9 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate">
                        {m.fullName}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-semibold block truncate">
                        {m.membershipCode}
                      </span>
                    </div>
                    <Scan className="w-4 h-4 text-purple-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Check-in Attendance Log */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Recent Verified Attendees ({checkIns.length})
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">100% Validated</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {checkIns.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-white block leading-tight">
                          {rec.memberName}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">
                          {rec.memberCode} • {rec.checkInTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      {rec.foodCouponIssued && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                          <Utensils className="w-2.5 h-2.5" />
                          <span>Food</span>
                        </span>
                      )}
                      {rec.delegateKitIssued && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold flex items-center gap-1">
                          <PackageCheck className="w-2.5 h-2.5" />
                          <span>Kit</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
