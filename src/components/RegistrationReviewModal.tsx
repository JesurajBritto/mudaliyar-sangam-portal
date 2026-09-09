import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Phone,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Send,
  ExternalLink,
  Check
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

interface RegistrationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDetails: () => void;
  language: Language;
  data: RegistrationReviewData;
  onConfirmSuccess: () => void;
}

export const RegistrationReviewModal: React.FC<RegistrationReviewModalProps> = ({
  isOpen,
  onClose,
  onEditDetails,
  language,
  data,
  onConfirmSuccess
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Email Verification States
  const registeredEmail = data.email?.trim() || `${data.phone}@mudaliyarsangam.org`;
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [enteredEmailCode, setEnteredEmailCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setEmailVerificationCode(code);
      setEnteredEmailCode('');
      setIsEmailVerified(false);
      setEmailSent(true);
      setEmailError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResendEmail = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerificationCode(code);
    setEnteredEmailCode('');
    setIsEmailVerified(false);
    setEmailSent(true);
    setEmailError('');
  };

  const handleInstantVerifyEmail = () => {
    setEnteredEmailCode(emailVerificationCode);
    setIsEmailVerified(true);
    setEmailError('');
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredEmailCode.trim()) {
      setEmailError(
        language === 'ta'
          ? 'மின்னஞ்சலுக்கு அனுப்பப்பட்ட சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்'
          : 'Please enter the verification code sent to your email'
      );
      return;
    }

    if (enteredEmailCode.trim() !== emailVerificationCode) {
      setEmailError(
        language === 'ta'
          ? 'தவறான மின்னஞ்சல் சரிபார்ப்புக் குறியீடு'
          : 'Invalid verification code. Please check your email inbox.'
      );
      return;
    }

    setIsEmailVerified(true);
    setEmailError('');
  };

  const handleFinalRegister = () => {
    if (!isEmailVerified) {
      // If user hasn't verified yet, prompt or allow 1-click verify
      setEmailError(
        language === 'ta'
          ? 'பதிவை முடிக்க உங்கள் மின்னஞ்சலை சரிபார்க்கவும்'
          : 'Please verify your email address to complete registration'
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
                  ? 'விவரங்களைச் சரிபார்த்து பதிவு செய்ய'
                  : 'Review Details & Register'}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {language === 'ta'
                  ? 'விவரங்களை உறுதிசெய்து மின்னஞ்சல் சரிபார்ப்புடன் பதிவை நிறைவு செய்யவும்'
                  : 'Confirm entered details and verify your email address to register'}
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
          {/* Section 1: All Filed Details Grid */}
          <div className="bg-[#faf8f5] border border-[#e8dcbb] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2d5b4] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7e5b0b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {language === 'ta' ? 'பதிவு செய்யப்பட்ட விவரங்கள்' : 'All Registration Details'}
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
                  {language === 'ta' ? 'முழு பெயர்' : 'Full Name'}
                </span>
                <span className="font-bold text-stone-900 text-sm">{data.fullName}</span>
                {data.fullNameTa && (
                  <span className="block text-xs text-stone-600 font-medium mt-0.5">
                    {data.fullNameTa}
                  </span>
                )}
              </div>

              {/* Login Username & Password */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-300 bg-amber-50/40">
                <span className="text-[10px] font-bold uppercase text-amber-800 block flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-700" />
                  {language === 'ta' ? 'உள்நுழைவு பயனர் பெயர்' : 'Username for Login'}
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
                  {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                </span>
                <span className="font-semibold text-stone-900 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {registeredEmail}
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

              {/* Demographics & Blood Group */}
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

          {/* Section 2: Email Verification Card */}
          <div className="p-4 bg-gradient-to-b from-blue-50/60 to-indigo-50/30 rounded-2xl border-2 border-blue-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'ta'
                    ? 'மின்னஞ்சல் சரிபார்ப்பு (Email Verification)'
                    : 'Email Verification'}
                </h4>
              </div>
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                  {language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300">
                  {language === 'ta' ? 'சரிபார்ப்பு தேவை' : 'Action Required'}
                </span>
              )}
            </div>

            {isEmailVerified ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">
                    {language === 'ta'
                      ? `மின்னஞ்சல் (${registeredEmail}) வெற்றிகரமாக சரிபார்க்கப்பட்டது!`
                      : `Email (${registeredEmail}) has been successfully verified!`}
                  </p>
                  <p className="text-emerald-700 text-[11px]">
                    {language === 'ta'
                      ? 'இப்போது நீங்கள் பதிவை உறுதிசெய்து உங்கள் உறுப்பினர் எண்ணைப் பெறலாம்.'
                      : 'You can now complete registration and generate your digital membership ID.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-700">
                  {language === 'ta'
                    ? `உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சலுக்கு (${registeredEmail}) சரிபார்ப்புக் குறியீடு மற்றும் இணைப்பு அனுப்பப்பட்டுள்ளது.`
                    : `A verification code and secure verification link has been sent to ${registeredEmail}.`}
                </p>

                {/* Simulated Email Notification Card */}
                {emailSent && (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Send className="w-3 h-3 text-blue-600" />
                        {language === 'ta' ? 'மின்னஞ்சல் இன்பாக்ஸ் அறிவிப்பு:' : 'Email Inbox Notification:'}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Code: {emailVerificationCode}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <p className="text-[11px] text-stone-600">
                        {language === 'ta'
                          ? 'முதலியார் சங்கம் - மின்னஞ்சல் சரிபார்ப்பு இணைப்பு தயார்'
                          : 'Subject: Mudaliyar Sangam - Verify Your Email Address'}
                      </p>
                      <button
                        type="button"
                        onClick={handleInstantVerifyEmail}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>
                          {language === 'ta'
                            ? 'மின்னஞ்சலை உடனே சரிபார்க்கவும்'
                            : 'Verify Email Instantly'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual Code Input Form */}
                <form onSubmit={handleVerifyCodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredEmailCode}
                    onChange={(e) => {
                      setEnteredEmailCode(e.target.value.replace(/\D/g, ''));
                      setEmailError('');
                    }}
                    placeholder="Enter 6-digit Code"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-mono font-bold tracking-wider text-center"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                  >
                    {language === 'ta' ? 'குறியீட்டைச் சரிபார்' : 'Verify Code'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'மீண்டும் அனுப்புக' : 'Resend'}
                  </button>
                </form>

                {emailError && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
              type="button"
              onClick={handleFinalRegister}
              disabled={isVerifying}
              className={`w-full sm:w-2/3 py-3 px-4 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isEmailVerified
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
              }`}
            >
              {isVerifying ? (
                <span>{language === 'ta' ? 'பதிவு செய்யப்படுகிறது...' : 'Registering...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {language === 'ta'
                      ? 'பதிவை உறுதிசெய்து உறுப்பினர் அடையாள அட்டை பெறுக'
                      : 'Complete Registration & Register'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
