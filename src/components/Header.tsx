import React from 'react';
import {
  Landmark,
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
  Languages,
  Crown,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, Language, AuthUser } from '../types';
import { CompletePortalData, loadPortalContent } from '../data/portalContentData';
import { SangamLogo } from './SangamLogo';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenCms?: (tab?: string) => void;
  portalData?: CompletePortalData;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  onOpenCms,
  portalData: propPortalData
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const branding = propPortalData?.branding || loadPortalContent().branding;

  const navTabs: { id: TabType; labelEn: string; labelTa: string; icon: React.ReactNode }[] = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', icon: <Landmark className="w-4 h-4 text-[#801524]" /> },
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
    { id: 'address-book', labelEn: 'Address Book', labelTa: 'முகவரி புத்தகம்', icon: <BookUser className="w-4 h-4 text-stone-600" /> },
    { id: 'association-members', labelEn: 'Officers', labelTa: 'நிர்வாகிகள்', icon: <Award className="w-4 h-4 text-stone-600" /> },
    { id: 'business-ads', labelEn: 'Business Ads & Feed', labelTa: 'வணிக விளம்பரம் & ஊட்டம்', icon: <Megaphone className="w-4 h-4 text-stone-600" /> },
    { id: 'donations', labelEn: 'Donations & Accounts', labelTa: 'நன்கொடை & வரவு செலவு கணக்குகள்', icon: <HeartHandshake className="w-4 h-4 text-stone-600" /> },
    { id: 'matrimonial', labelEn: 'Matrimonial Matchmaking Hub', labelTa: 'திருமண தகவல் மையம்', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { id: 'youth-career', labelEn: 'Youth Career & Scholarships', labelTa: 'இளைஞர் வழிகாட்டல் & கல்வி உதவி', icon: <GraduationCap className="w-4 h-4 text-sky-600" /> },
    { id: 'family-tree', labelEn: 'Family Tree', labelTa: 'குடும்ப மரம்', icon: <GitBranch className="w-4 h-4 text-emerald-600" /> },
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

  const navContainerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const hasDraggedRef = React.useRef(false);
  const prevActiveTabRef = React.useRef<TabType>(activeTab);

  // Smoothly glides the clicked tab into position with comfortable breathing room:
  // - Right-Center with comfortable breathing room (~68% anchor, leaving generous cushion on the right so tabs never slam into the border)
  // - Left-Center (~28% anchor, leaving room on the left and exposing upcoming tabs on the right)
  const scrollToTab = React.useCallback(
    (tabId: TabType, forceMode?: 'left-center' | 'right-center') => {
      const container = navContainerRef.current;
      const tabEl = document.getElementById(`nav-tab-${tabId}`);
      if (!container || !tabEl) return;

      if (tabId === 'home' || tabEl.offsetLeft < 60) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      const containerWidth = container.clientWidth;
      const tabLeft = tabEl.offsetLeft;
      const tabWidth = tabEl.offsetWidth;
      const tabCenter = tabLeft + tabWidth / 2;

      // Position of tab relative to current scroll viewport
      const currentScroll = container.scrollLeft;
      const tabRelativeX = tabCenter - currentScroll;
      const relativeRatio = tabRelativeX / containerWidth;

      const tabIndex = navTabs.findIndex((t) => t.id === tabId);
      const prevIndex = navTabs.findIndex((t) => t.id === prevActiveTabRef.current);
      const isMovingBackward = prevIndex > tabIndex;
      const isTrailingTab = tabIndex >= navTabs.length - 2;

      let targetScroll: number;

      // Determine whether Right-Center or Left-Center provides the most comfortable breathing room
      if (
        forceMode === 'right-center' ||
        isTrailingTab ||
        (forceMode !== 'left-center' && (isMovingBackward || relativeRatio < 0.44))
      ) {
        // Right-Center with comfortable breathing room:
        // Positions the tab at ~66%-68% of the visible toolbar, preserving a comfortable ~32% breathing cushion on the right
        const rightCenterAnchor = containerWidth * 0.67;
        targetScroll = tabCenter - rightCenterAnchor;
      } else if (forceMode === 'left-center' || relativeRatio > 0.56) {
        // Left-Center:
        // Positions the tab at ~28% of the visible toolbar, exposing subsequent items to the right
        const leftCenterAnchor = containerWidth * 0.28;
        targetScroll = tabCenter - leftCenterAnchor;
      } else {
        // Balanced center with comfortable room on both sides
        targetScroll = tabCenter - containerWidth / 2;
      }

      const maxScroll = Math.max(0, container.scrollWidth - containerWidth);
      const safeScroll = Math.max(0, Math.min(maxScroll, targetScroll));

      container.scrollTo({ left: safeScroll, behavior: 'smooth' });
    },
    [navTabs]
  );

  // Auto-align when active tab changes externally or on mount
  React.useEffect(() => {
    scrollToTab(activeTab);
    prevActiveTabRef.current = activeTab;
  }, [activeTab, scrollToTab]);

  const handleTabClick = (tabId: TabType) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    scrollToTab(tabId);

    if (!currentUser) {
      if (tabId === 'home') {
        setActiveTab('home');
        return;
      }
      onOpenAuth?.('login');
      return;
    }
    setActiveTab(tabId);
  };

  // Drag-to-scroll for desktop users
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = navContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = navContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Convert vertical mouse wheel into horizontal scroll inside toolbar
  const handleWheel = (e: React.WheelEvent) => {
    const el = navContainerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > 0) {
      el.scrollLeft += e.deltaY;
    }
  };

  // Automatically slide to active tab when it changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTab(activeTab);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, scrollToTab]);

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
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h1
                      key={`brand-title-${language}`}
                      initial={{ opacity: 0, y: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -1 }}
                      transition={{ duration: 0.18, ease: 'easeInOut' }}
                      className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight font-display"
                    >
                      {language === 'en'
                        ? (branding?.sangamNameEn || 'Tamil Nadu Mudaliyar Sangam')
                        : (branding?.sangamNameTa || 'தமிழ்நாடு முதலியார் சங்கம்')}
                    </motion.h1>
                  </AnimatePresence>
                  <span className="text-[10.5px] px-2.5 py-0.5 rounded-full font-semibold bg-[#faf6ed] text-[#825c07] border border-[#e8dcbb] shadow-2xs">
                    {branding?.monogram || 'MS'} Portal
                  </span>
                  {!currentUser && (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`login-req-${language}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#fcf9f2] text-stone-600 border border-[#e8e2d4] flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-[#b8860b]" />
                        <span>{language === 'ta' ? 'உள்நுழைவு தேவை' : 'Login Required'}</span>
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`brand-sub-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    className="text-xs text-stone-500 font-medium line-clamp-1 tracking-tight"
                  >
                    {language === 'en'
                      ? (branding?.subTitleEn || 'Statewide Association Management, Census Directory & Member Ecosystem')
                      : (branding?.subTitleTa || 'மாநில அளவிலான சங்கம், முகவரி புத்தகம் & உறுப்பினர் கட்டமைப்பு')}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile View Fast Auth Trigger - When logged in */}
            {currentUser && (
              <div className="lg:hidden flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={onOpenProfile}
                    className="px-2.5 py-1.5 text-xs rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
                    title={language === 'ta' ? 'ஸ்மார்ட் அடையாள அட்டை' : 'Digital Member Smart ID Card'}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-200" />
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`mob-card-label-${language}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {language === 'ta' ? 'அட்டை' : 'Smart ID'}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('login')}
                    className="px-2 py-1.5 text-xs rounded-xl font-bold bg-[#801524] text-white truncate max-w-[80px] shadow-2xs"
                  >
                    {currentUser.role === 'super_admin' ? '👑 Admin' : '👤'}
                  </button>
                </div>
              </div>
            )}
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
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`cms-label-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {language === 'ta' ? '🎨 லோகோ & மேலாண்மை' : '🎨 Logo & CMS'}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}

            {/* Language Switcher with Subtle Animated Indicator */}
            <div
              className="relative inline-flex items-center rounded-xl p-1 bg-[#f4efe6] border border-[#e2d9c8] shadow-2xs"
              role="group"
              aria-label="Language selector"
            >
              <Languages className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-0.5 shrink-0" />
              <button
                id="lang-btn-en"
                type="button"
                onClick={() => setLanguage('en')}
                className={`relative px-2.5 py-1 text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none ${
                  language === 'en'
                    ? 'text-[#801524]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                {language === 'en' && (
                  <motion.div
                    layoutId="activeLanguagePill"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-amber-200/80 -z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 35,
                      mass: 0.8
                    }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
              <button
                id="lang-btn-ta"
                type="button"
                onClick={() => setLanguage('ta')}
                className={`relative px-2.5 py-1 text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none ${
                  language === 'ta'
                    ? 'text-[#801524]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="தமிழுக்கு மாற்றுக"
              >
                {language === 'ta' && (
                  <motion.div
                    layoutId="activeLanguagePill"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-amber-200/80 -z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 35,
                      mass: 0.8
                    }}
                  />
                )}
                <span className="relative z-10">தமிழ்</span>
              </button>
            </div>

            {/* USER AUTH & PROFILE SECTION */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#e8e3d8]">
                {/* User Info Capsule - Opens Profile & Digital Smart ID Card */}
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/80 via-white to-stone-50 hover:bg-amber-100/60 hover:border-amber-400 transition-all text-left cursor-pointer shadow-2xs group"
                  title={language === 'ta' ? 'சுயவிவரம் & ஸ்மார்ட் அடையாள அட்டை' : 'View Profile & Smart ID Card'}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#801524] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`user-name-${language}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-xs font-bold text-stone-900 leading-tight max-w-[130px] truncate"
                      >
                        {language === 'ta' ? (currentUser.fullNameTa || currentUser.fullName) : currentUser.fullName}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center gap-1 mt-0.5">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={`user-badge-${language}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`inline-block text-[8.5px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role).color}`}
                        >
                          {getRoleBadge(currentUser.role).label}
                        </motion.span>
                      </AnimatePresence>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={`user-smart-pill-${language}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded flex items-center gap-0.5 border border-amber-200"
                        >
                          <CreditCard className="w-2.5 h-2.5 text-amber-700" />
                          <span>{language === 'ta' ? 'ஸ்மார்ட் அட்டை' : 'Smart ID'}</span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </button>

                {/* Direct Smart ID Card Button */}
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  title={language === 'ta' ? 'ஸ்மார்ட் அடையாள அட்டை' : 'Digital Member Smart ID Card'}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-200" />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`smart-id-btn-${language}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {language === 'ta' ? 'அடையாள அட்டை' : 'Smart ID Card'}
                    </motion.span>
                  </AnimatePresence>
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
            ) : null}
          </div>
        </div>

        {/* Navigation Tabs - smoothly glides to the left/center on click so all subsequent tabs are exposed */}
        <div className="relative mt-2.5 pt-2 border-t border-[#f0ece1]">
          <nav
            ref={navContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
            className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none w-full scroll-smooth select-none cursor-grab active:cursor-grabbing px-2 sm:px-3"
          >
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#801524] text-white font-semibold shadow-xs ring-1 ring-[#801524]'
                    : 'text-stone-600 hover:bg-[#f5f2eb] hover:text-stone-900 border border-transparent hover:border-[#e8e3d8]'
                }`}
              >
                {tab.icon}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`nav-label-${tab.id}-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    {language === 'en' ? tab.labelEn : tab.labelTa}
                  </motion.span>
                </AnimatePresence>
              </button>
            ))}
            {/* Trailing breathing room cushion for comfortable Right-Center positioning */}
            <div className="w-16 sm:w-28 shrink-0 pointer-events-none" aria-hidden="true" />
          </nav>
        </div>
      </div>
    </header>
  );
};

