import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Bell,
  Calendar,
  Award,
  Users,
  BookOpen,
  HeartHandshake,
  ArrowRight,
  FileText,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Heart,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronRight,
  ShieldCheck,
  Send,
  Eye,
  Megaphone,
  CreditCard,
  GitBranch,
  BookUser,
  Edit3,
  Sliders,
  Settings,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { Language, TabType, AuthUser } from '../types';
import {
  CompletePortalData,
  INITIAL_PORTAL_DATA,
  loadPortalContent,
  savePortalContent,
  PortalAnnouncement,
  PortalEvent,
  MissionPillar
} from '../data/portalContentData';
import { SuperAdminCmsModal } from './SuperAdminCmsModal';
import { SangamLogo } from './SangamLogo';
import { UserCheck, KeyRound, Smartphone, Shield, User } from 'lucide-react';

interface SangamPortalViewerProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'register' | 'mobile') => void;
  portalData?: CompletePortalData;
  onSaveData?: (data: CompletePortalData) => void;
  onOpenCms?: (tab?: string) => void;
}

export const SangamPortalViewer: React.FC<SangamPortalViewerProps> = ({
  language,
  onNavigateTab,
  currentUser,
  onOpenAuth,
  portalData: propPortalData,
  onSaveData: propOnSaveData,
  onOpenCms: propOnOpenCms
}) => {
  const [localPortalData, setLocalPortalData] = useState<CompletePortalData>(
    propPortalData || loadPortalContent()
  );
  // Authoritative portal data: reactive single source of truth updated via props and custom events
  const portalData = propPortalData || localPortalData;

  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsInitialTab, setCmsInitialTab] = useState<string>('ticker');
  const [activeAnnouncementFilter, setActiveAnnouncementFilter] = useState<string>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<PortalAnnouncement | null>(null);
  const [rsvpEventId, setRsvpEventId] = useState<string | null>(null);

  useEffect(() => {
    if (propPortalData) {
      setLocalPortalData(propPortalData);
    }
  }, [propPortalData]);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CompletePortalData>;
      if (customEvent && customEvent.detail) {
        setLocalPortalData(customEvent.detail);
      } else {
        setLocalPortalData(loadPortalContent());
      }
    };
    window.addEventListener('sangam_portal_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('sangam_portal_content_updated', handleUpdate);
    };
  }, []);

  // Super Admin CMS Edit Access is only available when logged in as super_admin
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const adminModeActive = isSuperAdmin;

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    subject: '',
    message: ''
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Sync content state
  const handleSaveData = (newData: CompletePortalData) => {
    setLocalPortalData(newData);
    savePortalContent(newData);
    if (propOnSaveData) {
      propOnSaveData(newData);
    }
  };

  const openCmsAt = (tab: string) => {
    if (propOnOpenCms) {
      propOnOpenCms(tab);
    } else {
      setCmsInitialTab(tab);
      setIsCmsOpen(true);
    }
  };

  const filteredAnnouncements =
    activeAnnouncementFilter === 'all'
      ? portalData.announcements
      : portalData.announcements.filter((a) => a.category === activeAnnouncementFilter);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquiryForm({ name: '', phone: '', email: '', city: '', subject: '', message: '' });
      setEnquirySubmitted(false);
    }, 4500);
  };

  const getPillarIcon = (iconType: string) => {
    switch (iconType) {
      case 'graduation':
        return <GraduationCap className="w-5 h-5" />;
      case 'heart':
        return <Heart className="w-5 h-5" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'medical':
        return <HeartHandshake className="w-5 h-5" />;
      case 'tree':
        return <GitBranch className="w-5 h-5" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'rose':
        return {
          bg: 'bg-[#faf0f2] text-[#801524] border border-[#f0d0d5]',
          hover: 'hover:border-[#801524]/60'
        };
      case 'blue':
        return {
          bg: 'bg-[#f0f5fa] text-[#1e3a8a] border border-[#d0e0f0]',
          hover: 'hover:border-[#1e3a8a]/60'
        };
      case 'emerald':
        return {
          bg: 'bg-[#f0faf4] text-[#166534] border border-[#ccebd7]',
          hover: 'hover:border-[#166534]/60'
        };
      case 'purple':
        return {
          bg: 'bg-[#f7f0fa] text-[#581c87] border border-[#ebd0f5]',
          hover: 'hover:border-[#581c87]/60'
        };
      case 'amber':
      default:
        return {
          bg: 'bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]',
          hover: 'hover:border-[#b8860b]/60'
        };
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. ROLE-BASED TOP BANNER */}
      {isSuperAdmin ? (
        /* SUPER ADMIN CMS MANAGEMENT BAR (PREMIUM EXECUTIVE INSTITUTIONAL) */
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent opacity-80" />
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#faf6ed] text-[#801524] border border-[#e8dcbb] flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Sliders className="w-5 h-5 text-[#b8860b]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <span>👑</span>
                  {language === 'en' ? 'Super Admin Live CMS Dashboard' : 'சூப்பர் அட்மின் நேரடி கட்டுப்பாட்டு அறை'}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Dynamic Sync
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {language === 'en'
                  ? 'Welcome, State Administrator. You have full edit access to branding, logo, circulars, ticker, counters, and branch records.'
                  : 'வணக்கம் மாநில நிர்வாகி. லோகோ, அடையாளங்கள், அறிவிப்புகள், சுற்றறிக்கைகள், புள்ளிவிவரங்கள் மற்றும் தலைவர்களின் உரைகளை மாற்றலாம்.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => openCmsAt('branding_logo')}
              className="px-3.5 py-2 rounded-xl bg-[#801524] hover:bg-[#600f1a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>{language === 'en' ? '🏛️ Logo & Branding' : '🏛️ லோகோ & முகப்பு தலைப்பு'}</span>
            </button>

            <button
              type="button"
              onClick={() => openCmsAt('members_roles')}
              className="px-3.5 py-2 rounded-xl bg-[#faf6ed] hover:bg-[#f3eedf] text-[#7e5b0b] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-[#e8dcbb]"
            >
              <Users className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? '👥 Member Roles' : '👥 உறுப்பினர் நிலைகள்'}</span>
            </button>

            <button
              type="button"
              onClick={() => openCmsAt('announcements')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#e8e3d8]"
            >
              <Plus className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? '+ Circular' : '+ சுற்றறிக்கை'}</span>
            </button>

            <button
              type="button"
              onClick={() => openCmsAt('ticker')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'Full CMS' : 'முழு சி.எம்.எஸ்'}</span>
            </button>
          </div>
        </div>
      ) : !currentUser ? (
        /* GUEST / NEW VISITOR REGISTRATION & LOGIN PROMPT BANNER */
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#faf6ed] text-[#7e5b0b] font-bold text-[10px] tracking-wide uppercase border border-[#e8dcbb]">
                {language === 'ta' ? 'உறுப்பினர் சேர்க்கை' : 'Member Registration'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {language === 'ta' ? 'முதலியார் சங்கம் டிஜிட்டல் தளம் - புதிய உறுப்பினர் பதிவு' : 'Mudaliyar Sangam Digital Community Portal'}
              </h3>
            </div>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              {language === 'ta'
                ? 'முகவரி புத்தகம் மூலம் உறுப்பினர்களுடன் இணையவும், வணிக விளம்பரங்கள், இளைஞர் கல்வி உதவித்தொகை மற்றும் வரன் தகவல்களை அணுகவும் உடனே பதிவு செய்யவும்.'
                : 'Register or sign in to connect with members in the Address Book, explore Business Ads and Feed, and access Youth Career & Scholarship.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => onOpenAuth?.('register')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#801524] hover:bg-[#600f1a] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{language === 'ta' ? 'புதிய பதிவு (Register)' : 'New Registration'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth?.('login')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs border border-[#e8e3d8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#b8860b]" />
              <span>{language === 'ta' ? 'உள்நுழைவு (Sign In)' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth?.('mobile')}
              className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f0ece1] text-stone-800 font-bold text-xs border border-[#e8e3d8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Open on Mobile / QR"
            >
              <Smartphone className="w-4 h-4 text-[#801524]" />
              <span className="hidden sm:inline">{language === 'ta' ? 'மொபைலில்' : 'Mobile'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* LOGGED IN MEMBER / BRANCH ADMIN WELCOME RIBBON (REFINED INSTITUTIONAL) */
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#801524] to-[#a32235] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs border border-[#70101f]">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  {language === 'ta' ? `வணக்கம், ${currentUser.fullNameTa || currentUser.fullName}` : `Welcome, ${currentUser.fullName}`}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-stone-900 text-amber-200">
                  {currentUser.membershipCode}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]">
                  {currentUser.branch}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {language === 'ta'
                  ? `மாவட்டம்: ${currentUser.district} • சொந்த ஊர்: ${currentUser.nativePlace || 'தமிழ்நாடு'} • உறுப்பினர் நிலை: சரிபார்க்கப்பட்டது`
                  : `District: ${currentUser.district} • Native: ${currentUser.nativePlace || 'Tamil Nadu'} • Verified Member`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateTab('digital-id')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'டிஜிட்டல் ஐடி கார்டு' : 'My Digital ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('address-book')}
              className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e8e3d8] text-stone-800 font-bold text-xs hover:bg-white transition-colors cursor-pointer"
            >
              <BookUser className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'ta' ? 'முகவரி புத்தகம்' : 'Address Book'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Breaking News & Circular Ticker (HERITAGE GOLD ACCENT) */}
      {portalData.ticker.isVisible && (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col sm:flex-row items-stretch border border-[#e8e3d8] relative group">
          <div className="bg-[#801524] text-white px-4 py-3 flex items-center gap-2 font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0">
            <Bell className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{language === 'en' ? (portalData.ticker.badgeEn || portalData.ticker.badgeTa) : (portalData.ticker.badgeTa || portalData.ticker.badgeEn)}</span>
          </div>

          <div className="px-4 py-3 flex-1 flex items-center justify-between text-xs sm:text-sm font-medium overflow-hidden bg-[#faf8f5]">
            <div className="truncate">
              <span className="font-bold text-[#801524]">
                {language === 'en' ? (portalData.ticker.tagEn || portalData.ticker.tagTa) : (portalData.ticker.tagTa || portalData.ticker.tagEn)}
              </span>{' '}
              <span className="text-stone-800 font-medium">
                {language === 'en' ? (portalData.ticker.textEn || portalData.ticker.textTa) : (portalData.ticker.textTa || portalData.ticker.textEn)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                type="button"
                onClick={() => {
                  if (portalData.announcements.length > 0) {
                    setSelectedAnnouncement(portalData.announcements[0]);
                  }
                }}
                className="text-xs font-bold text-[#801524] hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                {language === 'en' ? (portalData.ticker.linkTextEn || portalData.ticker.linkTextTa) : (portalData.ticker.linkTextTa || portalData.ticker.linkTextEn)}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {adminModeActive && (
                <button
                  type="button"
                  onClick={() => openCmsAt('ticker')}
                  className="p-1 rounded bg-[#f0ece1] hover:bg-[#e8e3d8] text-stone-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="Edit Ticker (Super Admin)"
                >
                  <Edit3 className="w-3 h-3 text-[#b8860b]" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section - Official Sangam Header in 2026 SaaS & Heritage Style */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#e8e3d8] p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        {/* Subtle top golden accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent opacity-80" />

        {adminModeActive && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCmsAt('branding_logo')}
              className="px-3 py-1.5 rounded-xl bg-[#faf6ed] hover:bg-[#f3eedf] text-[#7e5b0b] border border-[#e8dcbb] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Logo & Branding' : 'லோகோ மாற்று'}</span>
            </button>
            <button
              type="button"
              onClick={() => openCmsAt('hero_stats')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-[#e8e3d8] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Edit Hero' : 'முகப்பு உரை'}</span>
            </button>
          </div>
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-3">
              <SangamLogo branding={portalData.branding} size="lg" showBorder={true} />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf6ed] border border-[#e8dcbb] text-[#7e5b0b] text-xs font-semibold tracking-wide shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>{language === 'en' ? (portalData.hero.regBadgeEn || portalData.branding?.regNumberEn) : (portalData.hero.regBadgeTa || portalData.branding?.regNumberTa)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight font-display">
                {language === 'en'
                  ? (portalData.hero.titleEn || portalData.branding?.sangamNameEn)
                  : (portalData.hero.titleTa || portalData.branding?.sangamNameTa)}
              </h1>
              <p className="text-[#801524] text-base sm:text-lg font-bold">
                {language === 'en'
                  ? (portalData.hero.taglineEn || portalData.branding?.subTitleEn)
                  : (portalData.hero.taglineTa || portalData.branding?.subTitleTa)}
              </p>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
              {language === 'en' ? portalData.hero.introEn : portalData.hero.introTa}
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('address-book')}
                className="px-5 py-2.5 rounded-xl bg-[#801524] hover:bg-[#600f1a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookUser className="w-4 h-4 text-[#e8c872]" />
                <span>{language === 'en' ? 'Member Address Book' : 'முகவரி புத்தகப் பதிவு'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('matrimonial')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-xs sm:text-sm border border-[#e8e3d8] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Heart className="w-4 h-4 text-rose-600" />
                <span>{language === 'en' ? 'Matrimonial Matchmaking' : 'திருமண தகவல் மையம்'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('association-members')}
                className="px-4 py-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f0ece1] text-stone-800 font-semibold text-xs sm:text-sm border border-[#e8e3d8] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#b8860b]" />
                <span>{language === 'en' ? 'Office Bearers' : 'சங்க நிர்வாகிகள்'}</span>
              </button>
            </div>
          </div>

          {/* 4 Quick Metrics at a Glance (Refined Heritage Stone/Gold Cards) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e3d8] text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {portalData.stats.registeredFamilies}
              </div>
              <div className="text-[11px] sm:text-xs text-[#7e5b0b] font-bold mt-1">
                {language === 'en'
                  ? portalData.stats.registeredFamiliesLabelEn
                  : portalData.stats.registeredFamiliesLabelTa}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e3d8] text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {portalData.stats.districtBranches}
              </div>
              <div className="text-[11px] sm:text-xs text-[#7e5b0b] font-bold mt-1">
                {language === 'en'
                  ? portalData.stats.districtBranchesLabelEn
                  : portalData.stats.districtBranchesLabelTa}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e3d8] text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {portalData.stats.scholarshipsAmount}
              </div>
              <div className="text-[11px] sm:text-xs text-[#7e5b0b] font-bold mt-1">
                {language === 'en'
                  ? portalData.stats.scholarshipsLabelEn
                  : portalData.stats.scholarshipsLabelTa}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e3d8] text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {portalData.stats.matrimonialAlliances}
              </div>
              <div className="text-[11px] sm:text-xs text-[#7e5b0b] font-bold mt-1">
                {language === 'en'
                  ? portalData.stats.matrimonialLabelEn
                  : portalData.stats.matrimonialLabelTa}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Message & Vision (தலைவர் மற்றும் பொதுச்செயலாளர் வாழ்த்துரை) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7e5b0b] uppercase tracking-wider">
              {language === 'en' ? 'State Leadership Desk' : 'சங்கத் தலைமை உரைகள்'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              {language === 'en' ? 'Messages from State Office Bearers' : 'தலைவர் மற்றும் பொதுச்செயலாளர் உரை'}
            </h2>
          </div>

          {adminModeActive && (
            <button
              type="button"
              onClick={() => openCmsAt('leadership')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e8e3d8] text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Edit Messages' : 'உரைகளை மாற்ற'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {portalData.leadership.map((lead) => (
            <div
              key={lead.id}
              className="rounded-3xl p-6 bg-white border border-[#e8e3d8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#faf6ed] border-2 border-[#b8860b] text-[#7e5b0b] flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
                    {lead.initials}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]">
                      {language === 'en' ? (lead.badgeEn || lead.badgeTa) : (lead.badgeTa || lead.badgeEn)}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      {language === 'en' ? (lead.officerNameEn || lead.officerNameTa) : (lead.officerNameTa || lead.officerNameEn)}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      {language === 'en' ? (lead.designationEn || lead.designationTa) : (lead.designationTa || lead.designationEn)}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed italic border-l-3 border-[#b8860b] pl-3.5">
                  {language === 'en' ? (lead.quoteEn || lead.quoteTa) : (lead.quoteTa || lead.quoteEn)}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0ece1] flex items-center justify-between text-xs text-[#7e5b0b] font-semibold">
                <span>{language === 'en' ? (lead.themeFocusEn || lead.themeFocusTa) : (lead.themeFocusTa || lead.themeFocusEn)}</span>
                <span className="text-stone-500 text-[11px]">
                  {language === 'en' ? (lead.locationEn || lead.locationTa) : (lead.locationTa || lead.locationEn)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Sangam Core Objectives & Mission Pillars (சங்கத்தின் கொள்கைகள் & நோக்கங்கள்) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#7e5b0b] tracking-wider uppercase">
              {language === 'en' ? 'Core Objectives & Commitments' : 'சங்கத்தின் கொள்கைகளும் நோக்கங்களும்'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
              {language === 'en' ? 'Six Pillars of Community Service' : 'சமூக மேம்பாட்டின் ஆறு முக்கிய தூண்கள்'}
            </h2>
          </div>

          {adminModeActive && (
            <button
              type="button"
              onClick={() => openCmsAt('pillars')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e8e3d8] text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Edit Pillars' : 'கொள்கைகளை மாற்ற'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portalData.pillars.map((pil) => {
            const themeStyle = getThemeClasses(pil.colorTheme);
            return (
              <div
                key={pil.id}
                className={`p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_2px_12px_rgba(0,0,0,0.02)] ${themeStyle.hover} transition-all group`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl ${themeStyle.bg} flex items-center justify-center font-bold mb-3.5 group-hover:scale-105 transition-transform`}
                >
                  {getPillarIcon(pil.iconType)}
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1.5 font-display">
                  {language === 'en' ? (pil.titleEn || pil.titleTa) : (pil.titleTa || pil.titleEn)}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {language === 'en' ? (pil.descriptionEn || pil.descriptionTa) : (pil.descriptionTa || pil.descriptionEn)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Official Circulars & Announcements (அதிகாரப்பூர்வ பொது அறிவிப்புகள்) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#7e5b0b] uppercase tracking-wider">
              {language === 'en' ? 'Official Press & Circulars' : 'அதிகாரப்பூர்வ பொது அறிவிப்புகள்'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              {language === 'en' ? 'Latest Sangam Notifications' : 'சங்கத்தின் முக்கிய சுற்றறிக்கைகள்'}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', labelEn: 'All Circulars', labelTa: 'அனைத்தும்' },
                { id: 'event', labelEn: 'Events & AGM', labelTa: 'கூட்டங்கள் & மாநாடு' },
                { id: 'education', labelEn: 'Scholarships', labelTa: 'கல்வி உதவி' },
                { id: 'matrimony', labelEn: 'Matrimonial', labelTa: 'திருமண தகவல்' },
                { id: 'general', labelEn: 'General', labelTa: 'பொது அறிவிப்பு' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveAnnouncementFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeAnnouncementFilter === f.id
                      ? 'bg-[#801524] text-white shadow-xs'
                      : 'bg-white border border-[#e8e3d8] text-stone-700 hover:bg-[#faf8f5]'
                  }`}
                >
                  {language === 'en' ? f.labelEn : f.labelTa}
                </button>
              ))}
            </div>

            {adminModeActive && (
              <button
                type="button"
                onClick={() => openCmsAt('announcements')}
                className="px-3.5 py-1.5 rounded-xl bg-[#801524] hover:bg-[#600f1a] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>{language === 'en' ? 'Manage Circulars' : 'சுற்றறிக்கைகள் நிர்வாகம்'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Announcement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#b8860b]/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#faf8f5] text-stone-800 border border-[#e8e3d8]">
                      {ann.circularNo}
                    </span>
                    {ann.isUrgent && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-red-600" />
                        {language === 'en' ? 'Important' : 'முக்கியமானது'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 font-semibold">
                    {ann.date}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug font-display">
                  {language === 'en' ? (ann.titleEn || ann.titleTa) : (ann.titleTa || ann.titleEn)}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {language === 'en' ? (ann.summaryEn || ann.summaryTa) : (ann.summaryTa || ann.summaryEn)}
                </p>

                {ann.venue && (
                  <div className="flex items-center gap-1.5 text-xs text-[#7e5b0b] font-semibold pt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#b8860b]" />
                    <span className="truncate">{ann.venue}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0ece1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="text-xs font-bold text-[#801524] hover:text-[#600f1a] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Read Full Circular' : 'முழு சுற்றறிக்கையைப் படிக்க'}</span>
                </button>

                <span className="text-[11px] text-stone-500 font-mono font-medium">
                  TNMS Secretariat
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Upcoming Events & State Assemblies (வரவிருக்கும் நிகழ்வுகள்) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7e5b0b] uppercase tracking-wider">
              {language === 'en' ? 'Conferences & Programs' : 'வரவிருக்கும் நிகழ்வுகள் & மாநாடுகள்'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              {language === 'en' ? 'Upcoming State & Regional Events' : 'மாநில மற்றும் மாவட்ட நிகழ்வு அட்டவணை'}
            </h2>
          </div>

          {adminModeActive && (
            <button
              type="button"
              onClick={() => openCmsAt('events')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e8e3d8] text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Manage Events' : 'நிகழ்வுகள் நிர்வாகம்'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {portalData.events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]">
                    {language === 'en' ? evt.categoryEn : evt.categoryTa}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug font-display">
                  {language === 'en' ? (evt.titleEn || evt.titleTa) : (evt.titleTa || evt.titleEn)}
                </h3>

                <div className="space-y-1.5 text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                    <span className="font-bold text-stone-900">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0 mt-0.5" />
                    <span>{language === 'en' ? (evt.locationEn || evt.locationTa) : (evt.locationTa || evt.locationEn)}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {language === 'en' ? (evt.descriptionEn || evt.descriptionTa) : (evt.descriptionTa || evt.descriptionEn)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0ece1]">
                {rsvpEventId === evt.id ? (
                  <div className="text-center py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'en'
                        ? 'Attendance Confirmed! See you there.'
                        : 'உங்கள் வருகை உறுதிசெய்யப்பட்டது!'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRsvpEventId(evt.id)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'en' ? 'Register / RSVP for Event' : 'நிகழ்வில் பங்கேற்க பதிவு'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Quick Portal Services Grid (அனைத்து சேவைகளுக்கும் விரைவு நுழைவு) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-[#7e5b0b] uppercase tracking-wider">
            {language === 'en' ? 'Digital Services Gateway' : 'சங்கத்தின் இணையவழி சேவைகள்'}
          </span>
          <h2 className="text-xl font-bold text-stone-900 font-display">
            {language === 'en' ? 'Explore Sangam Platform Modules' : 'முக்கிய சேவைப் பிரிவுகள்'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => onNavigateTab('address-book')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-[#b8860b]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <BookUser className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Address Book' : 'முகவரி புத்தகம்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Census & Family Directory' : 'உறுப்பினர் & குடும்ப விவரங்கள்'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('matrimonial')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-rose-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Matrimony Hub' : 'திருமண தகவல்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Profiles & Matchmaking' : 'வரன் தேடல் & ஜாதகப் பொருத்தம்'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('association-members')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-[#b8860b]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <Award className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Sangam Officers' : 'சங்க நிர்வாகிகள்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Year-wise Office Bearers' : 'ஆண்டு வாரியான பொறுப்பாளர்கள்'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('family-tree')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-emerald-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <GitBranch className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Family Tree' : 'வம்சாவளி மரம்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Genealogy & Lineage' : 'குடும்ப தலைமுறை வரைபடம்'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('youth-career')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Youth Career' : 'இளைஞர் வழிகாட்டல்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Jobs & Scholarships' : 'வேலைவாய்ப்பு & உதவித்தொகை'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('digital-id')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-purple-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Digital Member ID' : 'டிஜிட்டல் அட்டை'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'QR Badge & Event Entry' : 'QR உறுப்பினர் அட்டை'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('donations')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-[#b8860b]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <HeartHandshake className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Accounts & Ledger' : 'நன்கொடை & கணக்குகள்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'AutoPay & Balance Sheet' : 'வரவு செலவு & தானியங்கி சந்தா'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('business-ads')}
            className="p-4 rounded-3xl bg-white border border-[#e8e3d8] hover:border-[#b8860b]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
              <Megaphone className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-display">
              {language === 'en' ? 'Business Ads' : 'வணிக விளம்பரம்'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Promotions & Merchant Feed' : 'சமூக வணிக விளம்பரங்கள்'}
            </p>
          </button>
        </div>
      </section>

      {/* 8. Sangam District Branches Directory (மாவட்ட கிளை அலுவலகங்கள்) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7e5b0b] uppercase tracking-wider">
              {language === 'en' ? 'Statewide Network' : 'மாநிலம் தழுவிய கிளை கட்டமைப்பு'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              {language === 'en' ? 'Registered District Branches' : 'மாவட்ட மற்றும் நகர கிளை அலுவலகங்கள்'}
            </h2>
          </div>

          {adminModeActive && (
            <button
              type="button"
              onClick={() => openCmsAt('branches')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e8e3d8] text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{language === 'en' ? 'Manage Branches' : 'கிளைகளை நிர்வகிக்க'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {portalData.branches.map((br) => (
            <div
              key={br.id}
              className="p-5 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2 hover:border-[#b8860b]/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7e5b0b]">
                  {language === 'en' ? br.districtEn : br.districtTa}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#faf8f5] text-stone-700 border border-[#e8e3d8]">
                  Branch Office
                </span>
              </div>

              <h4 className="text-sm font-bold text-stone-900 font-display">
                {language === 'en' ? br.branchNameEn : br.branchNameTa}
              </h4>

              <div className="text-xs text-stone-600 space-y-1 pt-1">
                <div className="font-semibold text-stone-800">
                  {br.presidentName}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-stone-700">
                  <Phone className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>{br.phone}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0 mt-0.5" />
                  <span className="truncate">{br.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Headquarters & Contact / Public Enquiry Form (தொடர்பு & பொது மக்கள் கருத்துப் படிவம்) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Top hairline gold accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent opacity-80" />

        {adminModeActive && (
          <button
            type="button"
            onClick={() => openCmsAt('contact')}
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs border border-[#e8e3d8]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#b8860b]" />
            <span>{language === 'en' ? 'Edit HQ Details' : 'தொடர்பு விவரங்களை மாற்ற'}</span>
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf6ed] text-[#7e5b0b] text-xs font-bold border border-[#e8dcbb] shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>{language === 'en' ? 'Official Headquarters' : 'தலைமையகம் & தொடர்பு'}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2.5 tracking-tight font-display">
                {language === 'en' ? (portalData.contact.hqTitleEn || portalData.contact.hqTitleTa) : (portalData.contact.hqTitleTa || portalData.contact.hqTitleEn)}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed font-normal">
                {language === 'en'
                  ? (portalData.contact.hqDescriptionEn || portalData.contact.hqDescriptionTa)
                  : (portalData.contact.hqDescriptionTa || portalData.contact.hqDescriptionEn)}
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-800">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">
                    {language === 'en' ? 'Main Headquarters Address:' : 'தலைமை அலுவலக முகவரி:'}
                  </div>
                  <div className="text-stone-600 mt-0.5 font-medium leading-relaxed">
                    {language === 'en' ? (portalData.contact.addressEn || portalData.contact.addressTa) : (portalData.contact.addressTa || portalData.contact.addressEn)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">
                    {language === 'en' ? 'Helpline & Office Phone:' : 'அலுவலக தொலைபேசி எண்கள்:'}
                  </div>
                  <div className="text-stone-800 mt-0.5 font-mono font-bold">
                    {portalData.contact.phones}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">
                    {language === 'en' ? 'Official Email Address:' : 'அதிகாரப்பூர்வ மின்னஞ்சல்:'}
                  </div>
                  <div className="text-stone-800 mt-0.5 font-mono font-bold">
                    {portalData.contact.emails}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">
                    {language === 'en' ? 'Office Working Hours:' : 'பணி நேரம்:'}
                  </div>
                  <div className="text-stone-600 mt-0.5 font-medium">
                    {language === 'en'
                      ? (portalData.contact.workingHoursEn || portalData.contact.workingHoursTa)
                      : (portalData.contact.workingHoursTa || portalData.contact.workingHoursEn)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-[#faf8f5] p-5 sm:p-7 rounded-3xl border border-[#e8e3d8] shadow-2xs">
            <h4 className="text-sm font-bold text-stone-900 mb-1 font-display">
              {language === 'en'
                ? 'Send a Message / Public Feedback'
                : 'சங்க நிர்வாகத்திற்கு கருத்து அல்லது கோரிக்கை அனுப்பவும்'}
            </h4>
            <p className="text-xs text-stone-600 mb-4">
              {language === 'en'
                ? 'Your message will be routed to the respective district branch or state committee.'
                : 'உங்கள் செய்தி உரிய மாவட்ட கிளை அல்லது மாநிலக் குழுவிற்கு அனுப்பி வைக்கப்படும்.'}
            </p>

            {enquirySubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="text-sm font-bold">
                  {language === 'en' ? 'Message Sent Successfully!' : 'உங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!'}
                </h5>
                <p className="text-xs font-medium">
                  {language === 'en'
                    ? 'Thank you for reaching out. Our Sangam representative will contact you shortly.'
                    : 'நன்றி. எங்கள் சங்கப் பொறுப்பாளர் விரைவில் உங்களைத் தொடர்பு கொள்வார்.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Full Name *' : 'முழுப் பெயர் *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. R. Sundaram"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Mobile Number *' : 'மொபைல் எண் *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'City / Branch' : 'ஊர் / கிளை'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai / Vellore / Madurai"
                      value={enquiryForm.city}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {language === 'en' ? 'Subject / Category' : 'பொருள் / துறை'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scholarship Application / Member ID Query"
                    value={enquiryForm.subject}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, subject: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {language === 'en' ? 'Message / Feedback' : 'செய்தி அல்லது கருத்து'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Type your message here..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e8e3d8] bg-white text-stone-900 focus:outline-none focus:border-[#b8860b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#801524] hover:bg-[#600f1a] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#e8c872]" />
                  <span>{language === 'en' ? 'Submit Inquiry / Feedback' : 'விண்ணப்பம் / கருத்து அனுப்புக'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Circular Modal Details */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-[#e8e3d8] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]">
                  {selectedAnnouncement.circularNo}
                </span>
                <span className="text-xs text-stone-500 font-semibold">
                  {selectedAnnouncement.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="text-stone-500 hover:text-stone-900 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-stone-900 leading-snug font-display">
              {language === 'en' ? (selectedAnnouncement.titleEn || selectedAnnouncement.titleTa) : (selectedAnnouncement.titleTa || selectedAnnouncement.titleEn)}
            </h3>

            {selectedAnnouncement.venue && (
              <div className="p-3 rounded-2xl bg-[#faf6ed] border border-[#e8dcbb] text-xs text-[#7e5b0b] font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#b8860b]" />
                <span>{selectedAnnouncement.venue}</span>
              </div>
            )}

            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
              <p>{language === 'en' ? (selectedAnnouncement.detailsEn || selectedAnnouncement.detailsTa) : (selectedAnnouncement.detailsTa || selectedAnnouncement.detailsEn)}</p>
            </div>

            <div className="pt-4 border-t border-[#f0ece1] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {language === 'en' ? 'Close' : 'மூடுக'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin CMS Modal (fallback only if onOpenCms not supplied by parent) */}
      {!propOnOpenCms && (
        <SuperAdminCmsModal
          isOpen={isCmsOpen}
          onClose={() => setIsCmsOpen(false)}
          portalData={portalData}
          onSaveData={handleSaveData}
          language={language}
          initialTab={cmsInitialTab}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
