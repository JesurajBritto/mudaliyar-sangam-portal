import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  User,
  Heart,
  Lock,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Building2,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language, AddressPrivacyLevel } from '../types';

export interface RegistrationReviewData {
  fullName: string;
  fullNameTa?: string;
  phone: string;
  email?: string;
  username: string;
  password?: string;
  doorNumber: string;
  streetName: string;
  areaLocality?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  age?: number | string;
  gender: 'male' | 'female' | 'other';
  branch: string;
  occupation?: string;
  bloodGroup: string;
  privacyLevel: AddressPrivacyLevel;
}

interface RegistrationReviewOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDetails: () => void;
  language: Language;
  data: RegistrationReviewData;
  onConfirmSuccess: () => void;
}

export const RegistrationReviewOtpModal: React.FC<RegistrationReviewOtpModalProps> = ({
  isOpen,
  onClose,
  onEditDetails,
  language,
  data,
  onConfirmSuccess
}) => {
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generate OTP whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setEnteredOtp('');
      setOtpError('');
      setOtpTimer(60);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any;
    if (isOpen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, otpTimer]);

  if (!isOpen) return null;

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setOtpTimer(60);
  };

  const handleAutoFillOtp = () => {
    setEnteredOtp(generatedOtp);
    setOtpError('');
  };

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      setOtpError(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் மொபைலுக்கு அனுப்பப்பட்ட 6 இலக்க OTP-ஐ உள்ளிடவும்'
          : 'Please enter the 6-digit OTP sent to your mobile'
      );
      return;
    }

    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError(
        language === 'ta'
          ? 'தவறான OTP குறியீடு. மீண்டும் சரிபார்த்து உள்ளிடவும்.'
          : 'Invalid OTP code. Please verify and enter again.'
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#801524] via-[#941c2c] to-[#600f1a] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {language === 'ta'
                  ? 'விவரங்களைச் சரிபார்த்தல் & மொபைல் OTP'
                  : 'Review Details & Verify Mobile OTP'}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {language === 'ta'
                  ? 'பதிவு நிறைவடைய உங்கள் விவரங்களை உறுதிசெய்து OTP உள்ளிடவும்'
                  : 'Confirm your details and verify mobile OTP to complete registration'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-800">
          {/* Notification Banner */}
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-0.5">
              <p className="font-bold">
                {language === 'ta'
                  ? `மொபைல் எண் +91 ${data.phone}-க்கு OTP அனுப்பப்பட்டுள்ளது`
                  : `OTP dispatched to registered mobile: +91 ${data.phone}`}
              </p>
              <p className="text-amber-800">
                {language === 'ta'
                  ? 'கீழே கொடுக்கப்பட்டுள்ள உங்கள் பதிவு மற்றும் முகவரி விவரங்களைச் சரிபார்த்து, OTP-ஐ உள்ளிட்டு பதிவை உறுதிசெய்யவும்.'
                  : 'Please review your personal & address details below and enter the OTP to finalize registration.'}
              </p>
            </div>
          </div>

          {/* Section 1: All Filed Details Grid */}
          <div className="bg-[#faf8f5] border border-[#e8dcbb] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2d5b4] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7e5b0b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {language === 'ta' ? 'பதிவு செய்யப்பட்ட விவரங்கள்' : 'All Filed Registration Details'}
              </span>
              <button
                type="button"
                onClick={onEditDetails}
                className="text-xs text-[#801524] hover:text-[#a01a2e] font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                {language === 'ta' ? 'விவரங்களைத் திருத்து' : 'Edit Details'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Full Name */}
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  {language === 'ta' ? 'முழு பெயர் (ஆங்கிலம்)' : 'Full Name (English)'}
                </span>
                <span className="font-bold text-stone-900 text-sm">{data.fullName}</span>
                {data.fullNameTa && (
                  <span className="block text-xs text-stone-600 font-medium mt-0.5">
                    {data.fullNameTa}
                  </span>
                )}
              </div>

              {/* Login Username & Next Login Credential */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-300 bg-amber-50/40">
                <span className="text-[10px] font-bold uppercase text-amber-800 block flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-700" />
                  {language === 'ta' ? 'அடுத்த உள்நுழைவு பயனர் பெயர்' : 'Username for Next Login'}
                </span>
                <span className="font-bold text-amber-950 font-mono text-sm">{data.username}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-stone-500">
                    {language === 'ta' ? 'கடவுச்சொல்:' : 'Password:'}
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {showPassword ? data.password : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer ml-auto"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'}
                </span>
                <span className="font-bold text-stone-900 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  +91 {data.phone}
                </span>
              </div>

              {/* Email Address */}
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
                </span>
                <span className="font-semibold text-stone-900 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {data.email || '—'}
                </span>
              </div>

              {/* Complete Address */}
              <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block mb-1">
                  {language === 'ta' ? 'முழுமையான குடியிருப்பு முகவரி' : 'Full Residential Address (Census)'}
                </span>
                <p className="font-medium text-stone-800 leading-relaxed">
                  {data.doorNumber}, {data.streetName}
                  {data.areaLocality ? `, ${data.areaLocality}` : ''}
                  {data.city ? `, ${data.city}` : ''}
                  {data.district ? `, ${data.district} மாவட்டம்` : ''}
                  {data.state ? `, ${data.state}` : ''}
                  {data.pincode ? ` - ${data.pincode}` : ''}
                </p>
              </div>

              {/* Demographics & Branch */}
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  {language === 'ta' ? 'வயது / பாலினம் / இரத்த வகை' : 'Demographics & Blood Group'}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-bold text-stone-900">{data.age || 35} Yrs</span>
                  <span className="text-stone-300">|</span>
                  <span className="capitalize text-stone-700">{data.gender}</span>
                  <span className="text-stone-300">|</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {data.bloodGroup}
                  </span>
                </div>
              </div>

              {/* Branch & Occupation */}
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  {language === 'ta' ? 'கிளை & தொழில்' : 'Branch & Occupation'}
                </span>
                <span className="font-semibold text-stone-900 block truncate">{data.branch}</span>
                <span className="text-[11px] text-stone-600 truncate block">
                  {data.occupation || 'Community Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Mobile OTP Input Box */}
          <form onSubmit={handleVerifyAndProceed} className="space-y-4 pt-1">
            <div className="p-4 bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-2xl border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  {language === 'ta'
                    ? '6 இலக்க மொபைல் OTP-ஐ உள்ளிடவும் *'
                    : 'Enter 6-Digit Mobile OTP *'}
                </label>
                {/* Auto-fill testing helper */}
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-xs font-bold text-amber-800 bg-amber-100/90 hover:bg-amber-200 px-2 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                >
                  {language === 'ta'
                    ? `தானாக நிரப்ப (${generatedOtp})`
                    : `Auto-Fill OTP (${generatedOtp})`}
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  placeholder="• • • • • •"
                  className="flex-1 px-4 py-3 text-center text-lg font-mono font-black tracking-widest rounded-xl border border-amber-400 bg-white text-stone-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpTimer > 0}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {otpTimer > 0
                    ? `${otpTimer}s`
                    : language === 'ta'
                    ? 'மீண்டும் அனுப்புக'
                    : 'Resend OTP'}
                </button>
              </div>

              {otpError && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  {otpError}
                </p>
              )}

              <p className="text-[11px] text-stone-500">
                {language === 'ta'
                  ? '🔒 OTP சரிபார்க்கப்பட்டவுடன் உங்கள் உறுப்பினர் எண் மற்றும் டிஜிட்டல் ஸ்மார்ட் கார்டு உருவாக்கப்படும்.'
                  : '🔒 Once OTP is verified, your Official Membership ID and Digital Smart Card will be generated.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={onEditDetails}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'ta' ? 'விவரங்களைத் திருத்து' : 'Edit Details'}</span>
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>{language === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'ta'
                        ? 'OTP சரிபார்த்து பதிவை முடிக்க'
                        : 'Verify OTP & Complete Registration'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
