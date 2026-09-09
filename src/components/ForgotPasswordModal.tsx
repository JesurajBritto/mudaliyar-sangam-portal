import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Send,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { requestPasswordReset, updatePasswordForUser, saveCurrentUser } from '../data/authData';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: AuthUser) => void;
  language: Language;
  initialIdentifier?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  language,
  initialIdentifier = ''
}) => {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [stage, setStage] = useState<'request' | 'link_sent' | 'set_new_password' | 'success'>('request');
  const [error, setError] = useState('');
  const [matchedUser, setMatchedUser] = useState<AuthUser | null>(null);
  const [dispatchedEmail, setDispatchedEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleRequestLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = requestPasswordReset(identifier);
    if (!res.success || !res.user) {
      setError(
        res.error ||
          (language === 'ta'
            ? 'இந்த மின்னஞ்சல் அல்லது மொபைல் எண்ணில் கணக்கு எதுவும் இல்லை.'
            : 'No account found with this Email or Mobile Number.')
      );
      return;
    }

    setMatchedUser(res.user);
    setDispatchedEmail(res.email || res.user.email || `${res.user.phone}@mudaliyarsangam.org`);
    setResetToken(res.resetToken || `rst-${Date.now()}`);
    setStage('link_sent');
  };

  const handleOpenSetPassword = () => {
    setStage('set_new_password');
    setError('');
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError(
        language === 'ta'
          ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'
          : 'New password must be at least 6 characters'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        language === 'ta'
          ? 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் சரிபார்க்கவும்.'
          : 'Passwords do not match. Please verify.'
      );
      return;
    }

    if (!matchedUser) return;

    setIsUpdating(true);
    setTimeout(() => {
      const updateRes = updatePasswordForUser(matchedUser.id, newPassword);
      setIsUpdating(false);

      if (updateRes.success && updateRes.user) {
        setStage('success');
        saveCurrentUser(updateRes.user);
        setTimeout(() => {
          onSuccessLogin(updateRes.user!);
          onClose();
        }, 1200);
      } else {
        setError(updateRes.error || 'Failed to update password');
      }
    }, 600);
  };

  const handleResetModal = () => {
    setStage('request');
    setError('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#801524] via-[#941c2c] to-[#600f1a] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {language === 'ta' ? 'கடவுச்சொல் மீட்டமைப்பு' : 'Forgot / Reset Password'}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {language === 'ta'
                  ? 'மின்னஞ்சல் மூலம் புதிய கடவுச்சொல் இணைப்பு பெறுக'
                  : 'Receive Set New Password link via registered email'}
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

        {/* Body Content */}
        <div className="p-5 sm:p-6 text-stone-800 space-y-4">
          {/* Stage 1: Request link by Email or Mobile Number */}
          {stage === 'request' && (
            <form onSubmit={handleRequestLink} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-950 leading-relaxed">
                  {language === 'ta'
                    ? 'உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் முகவரி அல்லது மொபைல் எண்ணை உள்ளிடவும். உங்கள் மின்னஞ்சலுக்கு புதிய கடவுச்சொல் அமைக்கும் இணைப்பு அனுப்பப்படும்.'
                    : 'Enter your registered Email ID or Mobile Number. A secure Set New Password link will be dispatched to your email address.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta'
                    ? 'மின்னஞ்சல் முகவரி அல்லது மொபைல் எண் *'
                    : 'Registered Email ID or Mobile Number *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. member@gmail.com / 9840012345"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {language === 'ta'
                      ? 'மின்னஞ்சலுக்கு கடவுச்சொல் இணைப்பு அனுப்புக'
                      : 'Send Reset Link via Email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  {language === 'ta' ? 'உள்நுழைவுக்குத் திரும்பு' : 'Back to Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* Stage 2: Link Sent Preview & Click to Set New Password */}
          {stage === 'link_sent' && matchedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <p className="font-bold">
                    {language === 'ta'
                      ? 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது!'
                      : 'Password Reset Link Dispatched!'}
                  </p>
                  <p className="text-emerald-800">
                    {language === 'ta'
                      ? `உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் (${dispatchedEmail})-க்கு 'புதிய கடவுச்சொல் அமைக்கும் இணைப்பு' அனுப்பப்பட்டுள்ளது.`
                      : `A secure link to set your new password has been sent to your registered email address: ${dispatchedEmail}.`}
                  </p>
                </div>
              </div>

              {/* Simulated Email Notification Card with Clickable Set New Password Link */}
              <div className="p-4 bg-gradient-to-b from-stone-50 to-blue-50/40 rounded-2xl border-2 border-blue-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    {language === 'ta' ? 'மின்னஞ்சல் இன்பாக்ஸ் செய்தி' : 'Incoming Email in Inbox'}
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    Mudaliyar Sangam
                  </span>
                </div>

                <div className="text-xs text-stone-800 space-y-1">
                  <p className="font-bold text-stone-900">
                    {language === 'ta'
                      ? `அன்புள்ள ${matchedUser.fullNameTa || matchedUser.fullName},`
                      : `Dear ${matchedUser.fullName},`}
                  </p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {language === 'ta'
                      ? 'உங்கள் கணக்கிற்கான கடவுச்சொல்லை மீட்டமைக்க கீழே உள்ள இணைப்பை கிளிக் செய்யவும்:'
                      : 'We received a request to reset your password. Click the secure link below to set your new password:'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenSetPassword}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>
                    {language === 'ta'
                      ? 'புதிய கடவுச்சொல் அமைக்க இங்கே கிளிக் செய்யவும்'
                      : 'Click Here to Set New Password'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{language === 'ta' ? 'வேறு எண் / மின்னஞ்சல்' : 'Try another Email/Phone'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
                >
                  {language === 'ta' ? 'உள்நுழைவுக்குத் திரும்பு' : 'Back to Sign In'}
                </button>
              </div>
            </div>
          )}

          {/* Stage 3: Set New Password Form */}
          {stage === 'set_new_password' && matchedUser && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-blue-950 block">
                  {matchedUser.fullNameTa || matchedUser.fullName}
                </span>
                <p className="text-blue-800 text-[11px]">
                  ID: <span className="font-mono font-bold">{matchedUser.membershipCode}</span> •{' '}
                  {dispatchedEmail}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta'
                    ? 'புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்) *'
                    : 'Set New Password (Min 6 characters) *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'புதிய கடவுச்சொல்லை உறுதிசெய் *' : 'Confirm New Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isUpdating
                      ? language === 'ta'
                        ? 'மாற்றப்படுகிறது...'
                        : 'Updating...'
                      : language === 'ta'
                      ? 'கடவுச்சொல்லை மாற்றி உள்நுழைக'
                      : 'Update Password & Sign In'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStage('request')}
                  className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  {language === 'ta' ? 'பின்செல்' : 'Back'}
                </button>
              </div>
            </form>
          )}

          {/* Stage 4: Success Message */}
          {stage === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">
                {language === 'ta' ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : 'Password Successfully Updated!'}
              </h4>
              <p className="text-xs text-stone-600">
                {language === 'ta' ? 'தானாக உள்நுழைகிறது...' : 'Signing in automatically...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
