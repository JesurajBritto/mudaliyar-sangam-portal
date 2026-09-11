import React, { useState, useEffect } from 'react';
import {
  Crown,
  Shield,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mail,
  RefreshCw,
  Info,
  Sparkles,
  Lock,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  Database,
  Users,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { Language, UserRole } from '../types';
import {
  AdminEmailEntry,
  PRIMARY_SUPER_ADMIN_EMAIL,
  fetchAdminEmails,
  grantAdminEmail,
  revokeAdminEmail
} from '../services/firebase';

interface AdminEmailAccessManagerProps {
  language: Language;
  currentAdminEmail?: string;
  onAdminListChanged?: () => void;
}

const PRESET_ADMIN_POSITIONS = [
  { en: 'State Super Administrator', ta: 'மாநில முதன்மை நிர்வாகி' },
  { en: 'State President', ta: 'மாநிலத் தலைவர்' },
  { en: 'State General Secretary', ta: 'மாநில பொதுச் செயலாளர்' },
  { en: 'State Treasurer', ta: 'மாநில பொருளாளர்' },
  { en: 'State Vice President', ta: 'மாநில துணைத் தலைவர்' },
  { en: 'State Joint Secretary', ta: 'மாநில இணைச் செயலாளர்' },
  { en: 'District Secretary', ta: 'மாவட்டச் செயலாளர்' },
  { en: 'Zonal Coordinator', ta: 'மண்டல ஒருங்கிணைப்பாளர்' },
  { en: 'IT & Media Wing Secretary', ta: 'தகவல் தொழில்நுட்ப & ஊடகப் பிரிவு செயலாளர்' }
];

export const AdminEmailAccessManager: React.FC<AdminEmailAccessManagerProps> = ({
  language,
  currentAdminEmail,
  onAdminListChanged
}) => {
  const [adminList, setAdminList] = useState<AdminEmailEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConsoleGuide, setShowConsoleGuide] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'branch_admin'>('super_admin');
  const [newPositionEn, setNewPositionEn] = useState('State Joint Secretary');
  const [newPositionTa, setNewPositionTa] = useState('மாநில இணைச் செயலாளர்');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectId = 'ai-studio-sangamcommunityp-76df7ba6-00d5-4bfc-8952-4dae6179a66f';
  const firebaseConsoleAuthProvidersUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
  const firebaseConsoleUsersUrl = `https://console.firebase.google.com/project/${projectId}/authentication/users`;
  const firebaseFirestoreUrl = `https://console.firebase.google.com/project/${projectId}/firestore`;

  const loadList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminEmails();
      setAdminList(data);
    } catch (err) {
      console.error('Error fetching admin emails:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleSelectPreset = (pos: { en: string; ta: string }) => {
    setNewPositionEn(pos.en);
    setNewPositionTa(pos.ta);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg(
        language === 'ta'
          ? 'செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும் (எ.கா: admin@gmail.com)'
          : 'Please enter a valid email address (e.g. admin@gmail.com)'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const entry: AdminEmailEntry = {
        email: cleanEmail,
        role: newRole,
        position: newPositionEn,
        positionTa: newPositionTa,
        grantedBy: currentAdminEmail || PRIMARY_SUPER_ADMIN_EMAIL,
        grantedAt: new Date().toISOString()
      };

      await grantAdminEmail(entry);
      setSuccessMsg(
        language === 'ta'
          ? `${cleanEmail} என்ற மின்னஞ்சலுக்கு ${newRole === 'super_admin' ? 'சூப்பர் அட்மின்' : 'கிளை நிர்வாகி'} அதிகாரம் வெற்றிகரமாக வழங்கப்பட்டது!`
          : `Admin privileges successfully granted to ${cleanEmail} as ${newRole === 'super_admin' ? 'Super Admin' : 'Branch Admin'}!`
      );

      await loadList();
      setNewEmail('');
      setIsAdding(false);
      onAdminListChanged?.();

      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (emailToRevoke: string) => {
    if (emailToRevoke.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert(
        language === 'ta'
          ? 'முதன்மை சூப்பர் அட்மின் கணக்கை நீக்க முடியாது!'
          : 'Primary Super Administrator cannot be removed!'
      );
      return;
    }

    const confirmPrompt =
      language === 'ta'
        ? `${emailToRevoke} அவர்களின் அட்மின் அனுமதியை ரத்து செய்ய உறுதிப்படுத்துகிறீர்களா?`
        : `Are you sure you want to revoke admin privileges for ${emailToRevoke}?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      await revokeAdminEmail(emailToRevoke);
      await loadList();
      setSuccessMsg(
        language === 'ta'
          ? `${emailToRevoke} அட்மின் அனுமதி வெற்றிகரமாக நீக்கப்பட்டது.`
          : `Admin access revoked for ${emailToRevoke}.`
      );
      onAdminListChanged?.();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error revoking access');
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/80 shadow-xs space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-600 text-white flex items-center gap-1.5 shadow-2xs">
              <Crown className="w-3.5 h-3.5" />
              {language === 'ta' ? 'Firebase Cloud அட்மின் மேலாண்மை' : 'Firebase Cloud Admin Access'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {language === 'ta' ? 'Google OAuth & Email/Password' : 'Google OAuth & Email/Password'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
            {language === 'ta'
              ? 'அட்மின் & சூப்பர் அட்மின் மின்னஞ்சல் மேலாண்மை'
              : 'Authorized Admin & Super Admin Emails'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
            {language === 'ta'
              ? 'Firebase Console-ல் பயனர்களை நேரடியாக உருவாக்கி, இங்கு அவர்களுக்கு சூப்பர் அட்மின் அல்லது கிளை நிர்வாகி அதிகாரம் வழங்கலாம்.'
              : 'Add users manually in Firebase Console and authorize them here for Super Admin or Branch Admin access upon sign in.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={loadList}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {isAdding
                ? language === 'ta'
                  ? 'படிவத்தை மூடு'
                  : 'Close Form'
                : language === 'ta'
                ? '+ அட்மின் மின்னஞ்சல் அங்கீகரிக்க'
                : '+ Authorize Admin Email'}
            </span>
          </button>
        </div>
      </div>

      {/* STEP-BY-STEP FIREBASE CONSOLE MANUAL SETUP GUIDE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {language === 'ta'
                ? 'Firebase Console: Google & Email/Password கைமுறை அமைப்பு வழிகாட்டி'
                : 'Firebase Console: Step-by-Step Manual Setup Guide for Google & Email/Password'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConsoleGuide(!showConsoleGuide)}
            className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showConsoleGuide ? (language === 'ta' ? 'மறை' : 'Hide') : (language === 'ta' ? 'வழிகாட்டி' : 'Guide')}</span>
          </button>
        </div>

        {showConsoleGuide && (
          <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300 pt-2 border-t border-amber-200/60 dark:border-amber-900/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1: Sign-in Providers */}
              <div className="p-3.5 bg-white dark:bg-zinc-800/90 rounded-xl border border-amber-200/80 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span>{language === 'ta' ? 'Sign-in Providers இயக்கு' : 'Enable Sign-in Providers'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                  {language === 'ta'
                    ? 'Firebase Console > Authentication > "Sign-in method" தாவலுக்குச் சென்று Google மற்றும் Email/Password ஆகிய இரண்டையும் "Enable" செய்யவும்.'
                    : 'In Firebase Console > Authentication > "Sign-in method" tab, click and enable both Google and Email/Password providers.'}
                </p>
                <a
                  href={firebaseConsoleAuthProvidersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <span>{language === 'ta' ? 'Sign-in Providers திற' : 'Open Providers Tab'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Step 2: Manually Add Users */}
              <div className="p-3.5 bg-white dark:bg-zinc-800/90 rounded-xl border border-amber-200/80 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span>{language === 'ta' ? 'பயனர்களை நேரடியாக சேர்க்க' : 'Add Users in Auth'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                  {language === 'ta'
                    ? 'Firebase Console > Authentication > "Users" தாவலுக்குச் சென்று "Add user" அழுத்தி மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிட்டு பயனரை உருவாக்கலாம்.'
                    : 'In Firebase Console > Authentication > "Users" tab, click "Add user" to create user accounts with their Email & Password.'}
                </p>
                <a
                  href={firebaseConsoleUsersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <span>{language === 'ta' ? 'Users Tab திற' : 'Open Users Tab'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Step 3: Manage Roles */}
              <div className="p-3.5 bg-white dark:bg-zinc-800/90 rounded-xl border border-amber-200/80 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <span>{language === 'ta' ? 'அதிகாரங்களை மாற்றுதல்' : 'Assign / Change Roles'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                  {language === 'ta'
                    ? 'இங்கு கீழே உள்ள "+ அட்மின் மின்னஞ்சல் அங்கீகரிக்க" படிவத்தில் அல்லது Firestore > "users" ஆவணத்தில் role-ஐ super_admin என மாற்றிவிடலாம்.'
                    : 'Use the "+ Authorize Admin Email" form below, or edit the role field directly in Firestore Database to super_admin or branch_admin.'}
                </p>
                <a
                  href={firebaseFirestoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <span>{language === 'ta' ? 'Firestore திற' : 'Open Firestore DB'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900 dark:text-white">
                  {language === 'ta' ? 'Firebase Project ID:' : 'Firebase Project ID:'}
                </span>
                <p className="text-[11px] font-mono text-stone-600 dark:text-stone-400 break-all">
                  {projectId}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyLink(firebaseConsoleAuthProvidersUrl)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'இணைப்பு நகல்' : 'Copy Link')}</span>
                </button>
                <a
                  href={firebaseConsoleUsersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{language === 'ta' ? 'Firebase Console திற' : 'Open Console'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AUTHORIZE ADMIN FORM */}
      {isAdding && (
        <form
          onSubmit={handleFormSubmit}
          className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 space-y-4 animate-fade-in"
        >
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm border-b border-amber-200 dark:border-amber-800 pb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              {language === 'ta'
                ? 'அங்கீகரிக்கப்பட்ட அட்மின் மின்னஞ்சலைச் சேர்த்தல்'
                : 'Authorize Admin Email Address'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Input */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'ta' ? 'மின்னஞ்சல் முகவரி (Email Address) *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. user@gmail.com / admin@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                {language === 'ta'
                  ? 'இந்த மின்னஞ்சலில் பயனர் Google அல்லது Email/Password மூலம் உள்நுழையும்போது தானாகவே முழு அதிகாரம் பெறுவார்.'
                  : 'When this user logs in with Google or Email/Password, they will automatically receive elevated admin privileges.'}
              </p>
            </div>

            {/* Role Selection */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'ta' ? 'நிர்வாக அதிகாரம் (Role) *' : 'Administrative Role *'}
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'super_admin' | 'branch_admin')}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              >
                <option value="super_admin">
                  👑 Super Admin ({language === 'ta' ? 'மாநில முழு அதிகாரம் & நேரடி CMS Live Editor' : 'Full Control & Live CMS Editor'})
                </option>
                <option value="branch_admin">
                  🛡️ Branch Admin ({language === 'ta' ? 'கிளை & மாவட்ட உறுப்பினர்கள் மேலாண்மை' : 'Branch & District Member Management'})
                </option>
              </select>
            </div>

            {/* Position Presets */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {language === 'ta' ? 'முக்கிய பதவிகள் (பரிந்துரைகள்):' : 'Official Position Presets:'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ADMIN_POSITIONS.map((pos) => (
                  <button
                    key={pos.en}
                    type="button"
                    onClick={() => handleSelectPreset(pos)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-900 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? pos.ta : pos.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Position English */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'ta' ? 'பதவிப் பெயர் (ஆங்கிலத்தில்)' : 'Official Position Title (English)'}
              </label>
              <input
                type="text"
                value={newPositionEn}
                onChange={(e) => setNewPositionEn(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Position Tamil */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'ta' ? 'பதவிப் பெயர் (தமிழில்)' : 'Official Position Title (Tamil)'}
              </label>
              <input
                type="text"
                value={newPositionTa}
                onChange={(e) => setNewPositionTa(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-50"
            >
              {language === 'ta' ? 'ரத்து' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{language === 'ta' ? 'அட்மின் அனுமதி வழங்குக' : 'Grant Admin Access'}</span>
            </button>
          </div>
        </form>
      )}

      {/* AUTHORIZED ADMIN LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="font-bold">
            {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட நிர்வாகிகள்' : 'Authorized Administrators'} ({adminList.length})
          </span>
          <span>
            {language === 'ta' ? 'Email/Password & Google Auth மூலம் உள்நுழையலாம்' : 'Enabled for Email/Password & Google login'}
          </span>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-zinc-800 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
          {adminList.map((entry) => {
            const isPrimary = entry.email.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase();
            const isSuper = entry.role === 'super_admin';

            return (
              <div
                key={entry.email}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-white shadow-2xs ${
                      isSuper ? 'bg-[#801524]' : 'bg-sky-700'
                    }`}
                  >
                    {isSuper ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {entry.email}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isSuper
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                        }`}
                      >
                        {isSuper
                          ? language === 'ta'
                            ? '👑 சூப்பர் அட்மின்'
                            : '👑 Super Admin'
                          : language === 'ta'
                          ? '🛡️ கிளை நிர்வாகி'
                          : '🛡️ Branch Admin'}
                      </span>

                      {isPrimary && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          {language === 'ta' ? 'முதன்மை உரிமையாளர்' : 'Primary Owner'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                      {language === 'ta' ? entry.positionTa || entry.position : entry.position}
                    </p>

                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {language === 'ta' ? 'வழங்கப்பட்டது:' : 'Granted:'}{' '}
                      {new Date(entry.grantedAt).toLocaleDateString()}
                      {entry.grantedBy && ` • By: ${entry.grantedBy}`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center self-end">
                  {isPrimary ? (
                    <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 italic px-2 py-1">
                      {language === 'ta' ? 'பூட்டப்பட்டது (System Root)' : 'Root Super Admin'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevoke(entry.email)}
                      className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'ரத்து செய்' : 'Revoke'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
