import React from 'react';
import {
  Landmark,
  ShieldCheck,
  Database,
  FileCode2,
  Users2,
  Search,
  Layers,
  BookUser,
  Megaphone,
  HeartHandshake,
  Award,
  Heart,
  GraduationCap,
  GitBranch,
  CreditCard,
  User,
  Smartphone,
  LogOut,
  ShieldAlert,
  Shield,
  UserCheck,
  Lock,
  KeyRound,
  Crown,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { TabType, Language, AuthUser } from '../types';
import { CompletePortalData, loadPortalContent } from '../data/portalContentData';
import { SangamLogo } from './SangamLogo';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register' | 'mobile') => void;
  onLogout: () => void;
  onOpenCms?: (tab?: string) => void;
  portalData?: CompletePortalData;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCms,
  portalData: propPortalData
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const branding = propPortalData?.branding || loadPortalContent().branding;

  const navTabs: { id: TabType; labelEn: string; labelTa: string; icon: React.ReactNode }[] = [
    { id: 'home', labelEn: 'Official Homepage', labelTa: 'அதிகாரப்பூர்வ முகப்பு', icon: <Landmark className="w-4 h-4 text-[#801524]" /> },
    ...(isSuperAdmin
      ? [
          {
            id: 'admin-management' as TabType,
            labelEn: 'Admin Role & Demographics',
            labelTa: 'அட்மின் பொறுப்பு & புள்ளிவிவரங்கள்',
            icon: <Crown className="w-4 h-4 text-[#b8860b]" />
          }
        ]
      : []),
    { id: 'address-book', labelEn: 'Address Book & Privacy', labelTa: 'முகவரி புத்தகம் & தனியுரிமை', icon: <BookUser className="w-4 h-4 text-stone-600" /> },
    { id: 'association-members', labelEn: 'Sangam Officers Year-wise', labelTa: 'சங்க நிர்வாகிகள் ஆண்டு வாரியாக', icon: <Award className="w-4 h-4 text-stone-600" /> },
    { id: 'business-ads', labelEn: 'Business Ads & Feed', labelTa: 'வணிக விளம்பரம் & ஊட்டம்', icon: <Megaphone className="w-4 h-4 text-stone-600" /> },
    { id: 'donations', labelEn: 'Donations & Accounts', labelTa: 'நன்கொடை & வரவு செலவு கணக்குகள்', icon: <HeartHandshake className="w-4 h-4 text-stone-600" /> },
    { id: 'matrimonial', labelEn: 'Matrimonial Matchmaking Hub', labelTa: 'திருமண தகவல் மையம்', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { id: 'youth-career', labelEn: 'Youth Career & Scholarships', labelTa: 'இளைஞர் வழிகாட்டல் & கல்வி உதவி', icon: <GraduationCap className="w-4 h-4 text-sky-600" /> },
    { id: 'family-tree', labelEn: 'Family Genealogical Tree', labelTa: 'குடும்ப வம்சாவளி மரம்', icon: <GitBranch className="w-4 h-4 text-emerald-600" /> },
    { id: 'digital-id', labelEn: 'Digital Member ID & Event QR', labelTa: 'டிஜிட்டல் உறுப்பினர் அட்டை & QR', icon: <CreditCard className="w-4 h-4 text-purple-600" /> },
    { id: 'checklist', labelEn: 'Pre-Check List', labelTa: 'முன் தயாரிப்பு பட்டியல்', icon: <ShieldCheck className="w-4 h-4 text-stone-600" /> },
    { id: 'schema', labelEn: 'Database Schema', labelTa: 'தரவுத்தள வடிவமைப்பு', icon: <Database className="w-4 h-4 text-stone-600" /> },
    { id: 'api', labelEn: 'API Documentation', labelTa: 'API ஆவணங்கள்', icon: <FileCode2 className="w-4 h-4 text-stone-600" /> },
    { id: 'rbac', labelEn: 'RBAC & Privacy Matrix', labelTa: 'பாதுகாப்பு & அணுகல் உரிமை', icon: <Users2 className="w-4 h-4 text-stone-600" /> },
    { id: 'architecture', labelEn: 'Cloud Architecture', labelTa: 'கிளவுட் கட்டமைப்பு', icon: <Layers className="w-4 h-4 text-stone-600" /> },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          label: language === 'ta' ? '👑 சூப்பர் அட்மின்' : '👑 Super Admin',
          color: 'bg-[#faf3e0] text-[#7e5b0b] border-[#e2d09d]'
        };
      case 'branch_admin':
        return {
          label: language === 'ta' ? '🛡️ கிளை நிர்வாகி' : '🛡️ Branch Admin',
          color: 'bg-sky-50 text-sky-800 border-sky-200'
        };
      case 'member':
      default:
        return {
          label: language === 'ta' ? '👤 சங்க உறுப்பினர்' : '👤 Sangam Member',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
    }
  };

  const handleTabClick = (tabId: TabType) => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e8e3d8] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Decorative Golden Accent Hairline at the very top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#7e1927] via-[#b8860b] to-[#7e1927] opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand Info with Dynamic SangamLogo & Texts */}
          <div className="flex items-center justify-between sm:justify-start space-x-3.5">
            <div className="flex items-center space-x-3.5">
              <SangamLogo branding={branding} size="md" showBorder={true} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight font-display">
                    {language === 'en'
                      ? (branding?.sangamNameEn || 'Tamil Nadu Mudaliyar Sangam')
                      : (branding?.sangamNameTa || 'தமிழ்நாடு முதலியார் சங்கம்')}
                  </h1>
                  <span className="text-[10.5px] px-2.5 py-0.5 rounded-full font-semibold bg-[#faf6ed] text-[#825c07] border border-[#e8dcbb] shadow-2xs">
                    {branding?.monogram || 'MS'} Portal
                  </span>
                  {!currentUser && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#fcf9f2] text-stone-600 border border-[#e8e2d4] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#b8860b]" />
                      {language === 'ta' ? 'உள்நுழைவு தேவை' : 'Login Required'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-medium line-clamp-1 tracking-tight">
                  {language === 'en'
                    ? (branding?.subTitleEn || 'Statewide Association Management, Census Directory & Member Ecosystem')
                    : (branding?.subTitleTa || 'மாநில அளவிலான சங்கம், முகவரி புத்தகம் & உறுப்பினர் கட்டமைப்பு')}
                </p>
              </div>
            </div>

            {/* Mobile View Fast Auth Trigger */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth('mobile')}
                className="p-2 rounded-xl border border-[#e8e3d8] bg-[#faf8f5] text-stone-700 hover:bg-[#f5f2eb]"
                title="Mobile QR"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs rounded-xl font-bold bg-[#801524] text-white truncate max-w-[110px] shadow-2xs"
                >
                  {currentUser.role === 'super_admin' ? '👑 Admin' : '👤 Member'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs rounded-xl font-bold bg-[#801524] text-white flex items-center gap-1 shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'உள்நுழைக' : 'Login'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls: Search, Super Admin Logo CMS Trigger, Language & User Profile */}
          <div className="flex items-center gap-2.5 flex-wrap justify-between lg:justify-end">
            {/* Super Admin Quick Logo & Branding Button */}
            {isSuperAdmin && onOpenCms && (
              <button
                type="button"
                onClick={() => onOpenCms('branding_logo')}
                className="px-3 py-1.5 rounded-xl border border-[#c8a86b] bg-gradient-to-r from-[#966b1e] to-[#b8860b] text-white hover:opacity-95 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title={language === 'ta' ? 'லோகோ & முகப்பு தலைப்பு மாற்று' : 'Customize Logo & Branding'}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-100" />
                <span>{language === 'ta' ? '🎨 லோகோ & மேலாண்மை' : '🎨 Logo & CMS'}</span>
              </button>
            )}

            {/* Search Input (Active when logged in) */}
            {currentUser && (
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="header-search-input"
                  type="text"
                  placeholder={language === 'en' ? 'Search directory...' : 'தேடுக...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] bg-[#faf8f5] text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1.5 focus:ring-[#b8860b] focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Mobile Connect Button */}
            <button
              id="header-mobile-qr-btn"
              type="button"
              onClick={() => onOpenAuth('mobile')}
              className="px-2.5 py-1.5 rounded-xl border border-[#e8e3d8] bg-[#faf8f5] text-stone-700 hover:bg-[#f2ede4] hover:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open on Mobile / QR Code"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">{language === 'ta' ? 'மொபைல்' : 'Mobile Access'}</span>
            </button>

            {/* Language Toggle */}
            <div className="inline-flex rounded-xl p-0.5 bg-[#f5f2eb] border border-[#e5dfd2]">
              <button
                id="lang-btn-en"
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-ta"
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'ta'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* USER AUTH & PROFILE SECTION */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#e8e3d8]">
                {/* User Info Capsule */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-[#e8e3d8] bg-[#faf8f5] hover:bg-[#f5f2eb] hover:border-[#d4cbb8] transition-all text-left cursor-pointer"
                  title="Switch Role / View Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#801524] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-stone-900 leading-tight max-w-[130px] truncate">
                      {language === 'ta' ? (currentUser.fullNameTa || currentUser.fullName) : currentUser.fullName}
                    </div>
                    <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role).color}`}>
                      {getRoleBadge(currentUser.role).label}
                    </span>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-xl border border-[#e8e3d8] bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-stone-500 transition-colors cursor-pointer"
                  title={language === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-[#e8e3d8]">
                <button
                  id="header-login-btn"
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[#e0d9cb] bg-white text-stone-800 hover:bg-[#faf8f5] hover:border-[#c5bb9f] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === 'ta' ? 'உள்நுழைவு' : 'Sign In'}</span>
                </button>
                <button
                  id="header-register-btn"
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#801524] hover:bg-[#68101c] text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'புதிய பதிவு' : 'Register'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {currentUser ? (
          <nav className="flex space-x-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none border-t border-[#f0ece1] pt-2">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#801524] text-white font-semibold shadow-2xs'
                    : 'text-stone-600 hover:bg-[#f5f2eb] hover:text-stone-900'
                }`}
              >
                {tab.icon}
                <span>{language === 'en' ? tab.labelEn : tab.labelTa}</span>
              </button>
            ))}
          </nav>
        ) : (
          <div className="mt-2.5 flex items-center justify-between py-2 px-3.5 rounded-xl bg-[#faf8f5] border border-[#e8e3d8] text-xs text-stone-700">
            <span className="flex items-center gap-2 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#b8860b]" />
              {language === 'ta'
                ? 'உறுப்பினர்கள் உள்நுழைந்த பிறகு முகவரி புத்தகம், திருமண மையம் மற்றும் அனைத்து விவரங்களும் தோன்றும்.'
                : 'Please sign in or register below to unlock full address book, matrimonial hub, and records.'}
            </span>
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="text-[#801524] font-bold hover:underline ml-2 whitespace-nowrap"
            >
              {language === 'ta' ? 'பதிவு செய்க →' : 'Register Now →'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

