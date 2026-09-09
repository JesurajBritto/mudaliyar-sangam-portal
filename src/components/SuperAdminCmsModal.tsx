import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Bell,
  Landmark,
  FileText,
  Calendar,
  Users2,
  Sparkles,
  Phone,
  Building2,
  Eye,
  AlertCircle,
  Download,
  Upload,
  ArrowRight,
  Image as ImageIcon,
  Crown,
  Flower2,
  Flame,
  Feather,
  ScrollText,
  RefreshCw,
  Palette,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  Languages,
  Loader2
} from 'lucide-react';
import {
  CompletePortalData,
  PortalAnnouncement,
  PortalEvent,
  MissionPillar,
  DistrictBranchItem,
  PortalBranding,
  resetPortalContentToDefault,
  savePortalContent,
  broadcastPortalContentUpdate
} from '../data/portalContentData';
import { Language, AuthUser } from '../types';
import { SuperAdminMemberManagement } from './SuperAdminMemberManagement';
import { SangamLogo } from './SangamLogo';
import { BilingualField } from './BilingualField';
import { translateText } from '../utils/translationService';

interface SuperAdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalData: CompletePortalData;
  onSaveData: (data: CompletePortalData) => void;
  language: Language;
  initialTab?: string;
  currentUser?: AuthUser | null;
}

type AdminSection =
  | 'branding_logo'
  | 'members_roles'
  | 'ticker'
  | 'hero_stats'
  | 'announcements'
  | 'events'
  | 'leadership'
  | 'pillars'
  | 'contact'
  | 'branches';

export const SuperAdminCmsModal: React.FC<SuperAdminCmsModalProps> = ({
  isOpen,
  onClose,
  portalData,
  onSaveData,
  language,
  initialTab = 'ticker',
  currentUser
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>(
    (initialTab as AdminSection) || 'ticker'
  );
  const [formData, setRawFormData] = useState<CompletePortalData>(
    JSON.parse(JSON.stringify(portalData))
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editingEvtId, setEditingEvtId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Auto-Translation state
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState<boolean>(true);
  const [translatingKeys, setTranslatingKeys] = useState<Record<string, boolean>>({});

  const translateAndSync = async (
    key: string,
    sourceText: string,
    fromLang: 'ta' | 'en',
    toLang: 'ta' | 'en',
    applyResult: (translated: string) => void
  ) => {
    if (!sourceText || !sourceText.trim()) return;
    setTranslatingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const result = await translateText(sourceText, fromLang, toLang);
      if (result && result.trim()) {
        applyResult(result.trim());
      }
    } catch (err) {
      console.warn('Auto translation error:', err);
    } finally {
      setTranslatingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Tabs scroll controls
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Only sync state when modal transitions from closed to open, or when opening to a specific tab
  const wasOpenRef = useRef(false);
  const lastSavedDataRef = useRef<string>(JSON.stringify(portalData));

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const cloned = JSON.parse(JSON.stringify(portalData));
      lastSavedDataRef.current = JSON.stringify(cloned);
      setRawFormData(cloned);
      if (initialTab) {
        setActiveSection(initialTab as AdminSection);
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialTab, portalData]);

  // Pure state setter - no side-effects inside state updater function!
  const setFormData = (value: React.SetStateAction<CompletePortalData>) => {
    setRawFormData(value);
  };

  // Run live auto-sync safely after render inside useEffect
  useEffect(() => {
    if (!isOpen) return;
    const currentStr = JSON.stringify(formData);
    if (currentStr !== lastSavedDataRef.current) {
      lastSavedDataRef.current = currentStr;
      savePortalContent(formData);
      if (onSaveData) {
        onSaveData(formData);
      }
    }
  }, [formData, isOpen, onSaveData]);

  // Immutable helpers to ensure state changes trigger clean re-renders across all sections
  const updateAnnouncement = (idx: number, patch: Partial<PortalAnnouncement>) => {
    const updated = formData.announcements.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setFormData({ ...formData, announcements: updated });
  };

  const updateEvent = (idx: number, patch: Partial<PortalEvent>) => {
    const updated = formData.events.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setFormData({ ...formData, events: updated });
  };

  const updateLeadership = (idx: number, patch: Partial<CompletePortalData['leadership'][0]>) => {
    const updated = formData.leadership.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setFormData({ ...formData, leadership: updated });
  };

  const updatePillar = (idx: number, patch: Partial<MissionPillar>) => {
    const updated = formData.pillars.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setFormData({ ...formData, pillars: updated });
  };

  const updateBranch = (idx: number, patch: Partial<DistrictBranchItem>) => {
    const updated = formData.branches.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setFormData({ ...formData, branches: updated });
  };

  // Scroll checking logic for toolbar
  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [isOpen]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 320);
    }
  };

  // Scroll active tab into view whenever section changes
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeBtn = tabsContainerRef.current.querySelector(`[data-section-id="${activeSection}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSection]);

  if (!isOpen) return null;

  const handleSave = () => {
    savePortalContent(formData);
    broadcastPortalContentUpdate(formData);
    if (onSaveData) {
      onSaveData(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to reset all site content to official defaults?'
          : 'அனைத்து உள்ளடக்கங்களையும் அதிகாரப்பூர்வ இயல்பு நிலைக்கு மீட்டமைக்க விரும்புகிறீர்களா?'
      )
    ) {
      const def = resetPortalContentToDefault();
      setRawFormData(JSON.parse(JSON.stringify(def)));
      broadcastPortalContentUpdate(def);
      if (onSaveData) {
        onSaveData(def);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sangam_portal_content_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        setRawFormData(imported);
        savePortalContent(imported);
        broadcastPortalContentUpdate(imported);
        if (onSaveData) {
          onSaveData(imported);
        }
        alert(language === 'en' ? 'Configuration imported successfully!' : 'அமைப்பு வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது!');
      } catch (err) {
        alert(language === 'en' ? 'Invalid JSON file!' : 'தவறான JSON கோப்பு!');
      }
    };
    reader.readAsText(file);
  };

  // Add new announcement helper
  const handleAddNewAnnouncement = () => {
    const newAnn: PortalAnnouncement = {
      id: `ann-${Date.now()}`,
      circularNo: `MS/CIR/2026/${Math.floor(10 + Math.random() * 90)}`,
      titleEn: 'New Sangam Circular Notice',
      titleTa: 'புதிய சங்க சுற்றறிக்கை அறிவிப்பு',
      category: 'general',
      date: new Date().toISOString().split('T')[0],
      isUrgent: false,
      summaryEn: 'Brief summary of the new announcement for community members.',
      summaryTa: 'சமூக உறுப்பினர்களுக்கான புதிய அறிவிப்பின் சுருக்கக் குறிப்பு.',
      detailsEn: 'Complete detailed description and official notice contents.',
      detailsTa: 'முழுமையான விரிவான அறிவிப்பு மற்றும் அதிகாரப்பூர்வ சுற்றறிக்கை விவரங்கள்.'
    };
    setFormData({
      ...formData,
      announcements: [newAnn, ...formData.announcements]
    });
    setEditingAnnId(newAnn.id);
  };

  // Add new event helper
  const handleAddNewEvent = () => {
    const newEvt: PortalEvent = {
      id: `evt-${Date.now()}`,
      titleEn: 'Upcoming Regional Community Meet',
      titleTa: 'வரவிருக்கும் மண்டல சங்கம நிகழ்வு',
      date: 'November 30, 2026',
      time: '10:00 AM - 01:00 PM',
      locationEn: 'Sangam Community Hall, Tamil Nadu',
      locationTa: 'முதலியார் சங்க அரங்கம், தமிழ்நாடு',
      categoryEn: 'Regional Conference',
      categoryTa: 'மண்டல மாநாடு',
      descriptionEn: 'Interactive gathering for community development, youth programs, and family welfare.',
      descriptionTa: 'சமூக வளர்ச்சி, இளைஞர் திட்டம் மற்றும் குடும்ப நலன் குறித்த ஒருங்கிணைப்பு கூட்டம்.'
    };
    setFormData({
      ...formData,
      events: [newEvt, ...formData.events]
    });
    setEditingEvtId(newEvt.id);
  };

  // Add new branch helper
  const handleAddNewBranch = () => {
    const newBr: DistrictBranchItem = {
      id: `br-${Date.now()}`,
      districtEn: 'New District Branch',
      districtTa: 'புதிய மாவட்டக் கிளை',
      branchNameEn: 'City Central Branch',
      branchNameTa: 'நகர மத்திய கிளை',
      presidentName: 'Thiru. Name Mudaliyar',
      phone: '+91 94440 00000',
      address: 'Main Road, Branch Office'
    };
    setFormData({
      ...formData,
      branches: [...formData.branches, newBr]
    });
    setEditingBranchId(newBr.id);
  };

  const sections: {
    id: AdminSection;
    labelEn: string;
    labelTa: string;
    shortEn: string;
    shortTa: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'branding_logo',
      labelEn: '🏛️ Sangam Logo & Branding',
      labelTa: '🏛️ லோகோ & முகப்பு தலைப்பு',
      shortEn: 'Logo & Branding',
      shortTa: 'லோகோ & தலைப்பு',
      icon: <ImageIcon className="w-3.5 h-3.5" />
    },
    {
      id: 'members_roles',
      labelEn: '👥 Member Roles & Demographics',
      labelTa: '👥 உறுப்பினர் நிலைகள் & புள்ளிவிவரங்கள்',
      shortEn: 'Roles & Members',
      shortTa: 'உறுப்பினர் நிலைகள்',
      icon: <Users2 className="w-3.5 h-3.5" />
    },
    {
      id: 'ticker',
      labelEn: '1. Live Ticker Notice',
      labelTa: '1. சுற்றறிக்கை டிஜிட்டல் பட்டை',
      shortEn: 'Live Ticker',
      shortTa: 'டிஜிட்டல் பட்டை',
      icon: <Bell className="w-3.5 h-3.5" />
    },
    {
      id: 'hero_stats',
      labelEn: '2. Hero Header & Stats',
      labelTa: '2. முகப்பு & புள்ளிவிவரங்கள்',
      shortEn: 'Hero & Stats',
      shortTa: 'முகப்பு விவரங்கள்',
      icon: <Landmark className="w-3.5 h-3.5" />
    },
    {
      id: 'announcements',
      labelEn: '3. Circulars & Press',
      labelTa: '3. சுற்றறிக்கைகள் & செய்திகள்',
      shortEn: 'Announcements',
      shortTa: 'சுற்றறிக்கைகள்',
      icon: <FileText className="w-3.5 h-3.5" />
    },
    {
      id: 'events',
      labelEn: '4. Events & Assemblies',
      labelTa: '4. நிகழ்வுகள் & மாநாடுகள்',
      shortEn: 'Events',
      shortTa: 'நிகழ்வுகள்',
      icon: <Calendar className="w-3.5 h-3.5" />
    },
    {
      id: 'leadership',
      labelEn: '5. Leadership Speeches',
      labelTa: '5. தலைவர் & செயலர் உரை',
      shortEn: 'Leadership',
      shortTa: 'தலைமை உரைகள்',
      icon: <Users2 className="w-3.5 h-3.5" />
    },
    {
      id: 'pillars',
      labelEn: '6. Mission Pillars',
      labelTa: '6. சங்கத்தின் கொள்கைகள்',
      shortEn: 'Mission Pillars',
      shortTa: 'கொள்கைகள்',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    {
      id: 'contact',
      labelEn: '7. HQ Office & Helpline',
      labelTa: '7. தலைமையகம் & தொடர்பு',
      shortEn: 'Contact & HQ',
      shortTa: 'தலைமையகம்',
      icon: <Phone className="w-3.5 h-3.5" />
    },
    {
      id: 'branches',
      labelEn: '8. District Branches',
      labelTa: '8. மாவட்டக் கிளைகள்',
      shortEn: 'District Branches',
      shortTa: 'மாவட்டக் கிளைகள்',
      icon: <Building2 className="w-3.5 h-3.5" />
    }
  ];

  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const prevSection = currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < sections.length - 1 ? sections[currentSectionIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-5xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {language === 'en'
                    ? 'Super Admin Live Content Manager'
                    : 'சூப்பர் அட்மின் இணையதள கட்டுப்பாட்டு மையம்'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-zinc-950 uppercase tracking-wider">
                  Live CMS
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {language === 'en'
                  ? 'Easily edit any text, ticker, announcements, events, numbers & contact details. Updates reflect instantly on the portal.'
                  : 'அறிவிப்புகள், சுற்றறிக்கைகள், புள்ளிவிவரங்கள் மற்றும் முகவரிகளை இங்கிருந்து சுலபமாக மாற்றலாம். உடனே இணையதளத்தில் தெரியும்.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Translation Toggle Button */}
            <button
              type="button"
              onClick={() => setAutoTranslateEnabled(!autoTranslateEnabled)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoTranslateEnabled
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
              title={
                language === 'en'
                  ? 'Toggle English ⇄ Tamil Bidirectional Auto-Translation'
                  : 'தமிழ் ⇄ ஆங்கிலம் தானியங்கி மொழிமாற்றம் நிலைமாற்றி'
              }
            >
              <Languages className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>
                {autoTranslateEnabled
                  ? (language === 'en' ? '⚡ Auto-Translate: ON' : '⚡ மொழிமாற்றம்: ஆன்')
                  : (language === 'en' ? 'Auto-Translate: OFF' : 'மொழிமாற்றம்: ஆஃப்')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'en' ? 'Save Changes' : 'மாற்றங்களைச் சேமிக்கவும்'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translation Banner */}
        {autoTranslateEnabled && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/70 dark:border-amber-900/40 px-4 py-1.5 text-[11.5px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {language === 'en'
                ? '⚡ Bidirectional Auto-Sync active: Type in Tamil to update English, or type in English to update Tamil automatically!'
                : '⚡ தானியங்கி மொழிமாற்றம் செயலில் உள்ளது: தமிழில் தட்டச்சு செய்தால் ஆங்கிலத்திலும், ஆங்கிலத்தில் செய்தால் தமிழிலும் தானாக மாறும்!'}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider hidden sm:inline">
              Tamil ⇄ English Live
            </span>
          </div>
        )}

        {/* Success Banner */}
        {savedSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'All changes have been successfully saved and applied to the portal!'
                : 'அனைத்து மாற்றங்களும் வெற்றிகரமாக சேமிக்கப்பட்டு இணையதளத்தில் புதுப்பிக்கப்பட்டது!'}
            </span>
          </div>
        )}

        {/* Section Navigation Toolbar with Left/Right Buttons & Quick Jump Dropdown */}
        <div className="border-b border-amber-200 dark:border-zinc-800 bg-[#fbf8f0] dark:bg-zinc-800/60 px-2 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs relative select-none">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              canScrollLeft
                ? 'bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 border-amber-300 dark:border-zinc-700 text-amber-950 dark:text-amber-300 shadow-xs hover:scale-105 active:scale-95'
                : 'opacity-40 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 border-zinc-200 dark:border-zinc-700 cursor-not-allowed'
            }`}
            title={language === 'ta' ? 'இடதுபுறம் நகர்த்த (Scroll Left)' : 'Scroll Left'}
            aria-label="Scroll Tabs Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Track */}
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scroll-smooth py-1 px-1 flex-1 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  data-section-id={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'text-stone-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 hover:text-amber-950 dark:hover:text-amber-300 border border-amber-200/80 dark:border-zinc-700 shadow-2xs'
                  }`}
                >
                  <span className={isActive ? 'text-amber-100' : 'text-amber-700 dark:text-amber-400'}>
                    {sec.icon}
                  </span>
                  <span>{language === 'en' ? sec.labelEn : sec.labelTa}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              canScrollRight
                ? 'bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 border-amber-300 dark:border-zinc-700 text-amber-950 dark:text-amber-300 shadow-xs hover:scale-105 active:scale-95'
                : 'opacity-40 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 border-zinc-200 dark:border-zinc-700 cursor-not-allowed'
            }`}
            title={language === 'ta' ? 'வலதுபுறம் நகர்த்த (Scroll Right)' : 'Scroll Right'}
            aria-label="Scroll Tabs Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Jump Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2 border-l border-amber-200 dark:border-zinc-700">
            <label className="sr-only">Jump to section</label>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as AdminSection)}
              className="text-xs font-bold text-amber-950 dark:text-amber-200 bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {sections.map((sec, i) => (
                <option key={sec.id} value={sec.id}>
                  {i + 1}. {language === 'en' ? sec.shortEn : sec.shortTa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Editor Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* SECTION: SANGAM LOGO & BRANDING STUDIO */}
          {activeSection === 'branding_logo' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-200 gap-2">
                <div>
                  <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <span>
                      {language === 'en'
                        ? 'Official Sangam Logo & Header Branding Control'
                        : 'அதிகாரப்பூர்வ சங்க லோகோ & முகப்பு அடையாள மேலாண்மை'}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {language === 'en'
                      ? 'Upload custom logo images, switch heritage emblem symbols, and customize association title texts across the entire portal.'
                      : 'உங்கள் சங்கத்தின் தனிப்பயன் லோகோவை பதிவேற்றலாம், பாரம்பரிய சின்னங்களைத் தேர்ந்தெடுக்கலாம் அல்லது தலைப்புப் பெயர்களை மாற்றலாம்.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    👑 Super Admin Exclusive
                  </span>
                </div>
              </div>

              {/* LIVE BRANDING PREVIEW BANNER */}
              <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/60 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-amber-200/80 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    {language === 'en' ? 'Live Header Preview (உடனடி முன்னோட்டம்):' : 'இணையதள முகப்பு நேரடி முன்னோட்டம்:'}
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-mono font-bold">
                    {formData.branding?.monogram || 'MS'}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 sm:gap-5 py-2">
                  <SangamLogo branding={formData.branding} size="xl" showBorder={true} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-black text-amber-950">
                        {language === 'ta'
                          ? (formData.branding?.sangamNameTa || 'தமிழ்நாடு முதலியார் சங்கம்')
                          : (formData.branding?.sangamNameEn || 'Tamil Nadu Mudaliyar Sangam')}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                        {formData.branding?.monogram || 'MS'} Portal
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 font-medium">
                      {language === 'ta'
                        ? (formData.branding?.subTitleTa || 'மாநில அளவிலான சங்கம், முகவரி புத்தகம் & உறுப்பினர் கட்டமைப்பு')
                        : (formData.branding?.subTitleEn || 'Statewide Association Management & Census Directory')}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-amber-900 font-bold pt-0.5">
                      <span>🏛️ {formData.branding?.regNumberTa || formData.branding?.regNumberEn || 'Reg: 124/1988'}</span>
                      <span>•</span>
                      <span>Est: {formData.branding?.establishedYear || '1988'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. LOGO IMAGE UPLOADER & PRESETS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Card: Custom File Upload & URL */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'Upload Custom Logo Image' : 'தனிப்பயன் லோகோ படம் பதிவேற்றவும்'}</span>
                    </h4>
                    {formData.branding?.logoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            branding: { ...formData.branding, logoUrl: '' }
                          })
                        }
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                      >
                        {language === 'en' ? 'Remove Custom Logo' : 'படத்தை நீக்கு'}
                      </button>
                    )}
                  </div>

                  {/* File Upload Zone */}
                  <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center bg-white hover:bg-amber-50/50 transition-colors">
                    <input
                      type="file"
                      id="cms-logo-file-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert(language === 'ta' ? 'படத்தின் அளவு 2MB-க்கு குறைவாக இருக்க வேண்டும்' : 'Image size must be under 2MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormData({
                                ...formData,
                                branding: {
                                  ...formData.branding,
                                  logoUrl: event.target.result as string
                                }
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="cms-logo-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-amber-900">
                        {language === 'en' ? 'Click or Drag to Upload PNG/JPG/SVG' : 'இங்கே கிளிக் செய்து லோகோ படத்தை தேர்வு செய்யவும்'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {language === 'en' ? 'Recommended: Square 512x512 PNG with transparent background' : 'பரிந்துரை: 512x512 தெளிவான சதுரப் படம்'}
                      </div>
                    </label>
                  </div>

                  {/* Image URL Alternative */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-700">
                      {language === 'en' ? 'Or Paste Online Image URL:' : 'அல்லது நேரடி இணையதள பட முகவரி (URL):'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/sangam-logo.png"
                      value={formData.branding?.logoUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            logoUrl: e.target.value
                          }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white text-stone-900 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Right Card: Heritage Emblem Preset Picker */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'Heritage Emblem Preset Icons' : 'பாரம்பரிய தமிழ் சின்னங்கள்'}</span>
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      {formData.branding?.logoUrl ? (language === 'en' ? '(Active when no image uploaded)' : '(படம் இல்லாதபோது செயல்படும்)') : (language === 'en' ? '(Active)' : '(செயலில் உள்ளது)')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'gopuram', nameEn: 'Temple Gopuram', nameTa: 'திருக்கோயில் கோபுரம்', icon: <Landmark className="w-5 h-5" /> },
                      { id: 'lion', nameEn: 'Simha Lion', nameTa: 'தங்க சிம்மம்', icon: <Crown className="w-5 h-5" /> },
                      { id: 'lotus', nameEn: 'Sacred Lotus', nameTa: 'மங்கள தாமரை', icon: <Flower2 className="w-5 h-5" /> },
                      { id: 'lamp', nameEn: 'Kuthu Vilakku', nameTa: 'திரு விளக்கு', icon: <Flame className="w-5 h-5" /> },
                      { id: 'peacock', nameEn: 'Royal Peacock', nameTa: 'மயில் சின்னம்', icon: <Feather className="w-5 h-5" /> },
                      { id: 'palmleaf', nameEn: 'Kural Palm Leaf', nameTa: 'சுவடி & எழுத்தாணி', icon: <ScrollText className="w-5 h-5" /> }
                    ].map((emblem) => {
                      const isSelected = formData.branding?.logoIconPreset === emblem.id;
                      return (
                        <button
                          key={emblem.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              branding: {
                                ...formData.branding,
                                logoIconPreset: emblem.id as any
                              }
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white shadow-xs font-bold'
                              : 'border-amber-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          <div className={isSelected ? 'text-amber-100' : 'text-amber-600'}>
                            {emblem.icon}
                          </div>
                          <div className="text-[10px] leading-tight line-clamp-1">
                            {language === 'ta' ? emblem.nameTa : emblem.nameEn}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. SANGAM TITLES & DETAILS CONFIGURATION */}
              <div className="rounded-2xl border border-amber-200 bg-white p-5 space-y-4 shadow-xs">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-100 pb-2">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'Association Name & Slogan Configuration' : 'சங்கத்தின் அதிகாரப்பூர்வ பெயர்கள் & வாசகங்கள்'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Short Monogram / Code' : 'சுருக்கக் குறியீடு / மோனோகிராம்'}
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={formData.branding?.monogram || 'MS'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, monogram: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Govt Reg. Number' : 'அரசு பதிவு எண்'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.regNumberTa || 'பதிவு எண்: 124/1988'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            regNumberTa: e.target.value,
                            regNumberEn: e.target.value
                          }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Established Year' : 'நிறுவப்பட்ட ஆண்டு'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.establishedYear || '1988'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, establishedYear: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <BilingualField
                  fieldId="sangam-name"
                  labelTa="சங்கத்தின் முழுப் பெயர்"
                  labelEn="Primary Sangam Name"
                  valueTa={formData.branding?.sangamNameTa || ''}
                  valueEn={formData.branding?.sangamNameEn || ''}
                  onChangeTa={(val) =>
                    setFormData({
                      ...formData,
                      branding: { ...formData.branding, sangamNameTa: val }
                    })
                  }
                  onChangeEn={(val) =>
                    setFormData({
                      ...formData,
                      branding: { ...formData.branding, sangamNameEn: val }
                    })
                  }
                  autoTranslateEnabled={autoTranslateEnabled}
                  isTranslating={translatingKeys['sangam-name']}
                  onTranslate={(from) => {
                    const src = from === 'ta' ? formData.branding?.sangamNameTa : formData.branding?.sangamNameEn;
                    translateAndSync('sangam-name', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                      setFormData((prev) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          ...(from === 'ta' ? { sangamNameEn: res } : { sangamNameTa: res })
                        }
                      }));
                    });
                  }}
                />

                <BilingualField
                  fieldId="sangam-subtitle"
                  labelTa="முகப்பு துணைத் தலைப்பு வாசகம்"
                  labelEn="Header Subtitle / Tagline"
                  valueTa={formData.branding?.subTitleTa || ''}
                  valueEn={formData.branding?.subTitleEn || ''}
                  onChangeTa={(val) =>
                    setFormData({
                      ...formData,
                      branding: { ...formData.branding, subTitleTa: val }
                    })
                  }
                  onChangeEn={(val) =>
                    setFormData({
                      ...formData,
                      branding: { ...formData.branding, subTitleEn: val }
                    })
                  }
                  autoTranslateEnabled={autoTranslateEnabled}
                  isTranslating={translatingKeys['sangam-subtitle']}
                  onTranslate={(from) => {
                    const src = from === 'ta' ? formData.branding?.subTitleTa : formData.branding?.subTitleEn;
                    translateAndSync('sangam-subtitle', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                      setFormData((prev) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          ...(from === 'ta' ? { subTitleEn: res } : { subTitleTa: res })
                        }
                      }));
                    });
                  }}
                />
              </div>
            </div>
          )}

          {/* SECTION: MEMBER ROLES & DEMOGRAPHICS */}
          {activeSection === 'members_roles' && (
            <div className="space-y-4">
              <SuperAdminMemberManagement
                language={language}
                currentUser={currentUser}
              />
            </div>
          )}

          {/* SECTION 1: LIVE TICKER */}
          {activeSection === 'ticker' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Live Circular & News Ticker Settings' : 'சுற்றறிக்கை டிஜிட்டல் அறிவிப்பு பட்டை'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'en'
                      ? 'Controls the highlighted alert strip displayed right at the top of the portal.'
                      : 'இணையதளத்தின் முகப்பில் மேலே ஓடும் முக்கிய அறிவிப்பு பட்டை விவரங்கள்.'}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ticker.isVisible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, isVisible: e.target.checked }
                      })
                    }
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>{language === 'en' ? 'Show Ticker on Website' : 'பட்டையைக் காட்டு'}</span>
                </label>
              </div>

              <div className="space-y-3">
                <BilingualField
                  fieldId="ticker-badge"
                  labelTa="பேட்ஜ் தலைப்பு"
                  labelEn="Badge Text"
                  valueTa={formData.ticker.badgeTa}
                  valueEn={formData.ticker.badgeEn}
                  onChangeTa={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, badgeTa: val }
                    })
                  }
                  onChangeEn={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, badgeEn: val }
                    })
                  }
                  autoTranslateEnabled={autoTranslateEnabled}
                  isTranslating={translatingKeys['ticker-badge']}
                  onTranslate={(from) => {
                    const src = from === 'ta' ? formData.ticker.badgeTa : formData.ticker.badgeEn;
                    translateAndSync('ticker-badge', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                      setFormData((prev) => ({
                        ...prev,
                        ticker: {
                          ...prev.ticker,
                          ...(from === 'ta' ? { badgeEn: res } : { badgeTa: res })
                        }
                      }));
                    });
                  }}
                />

                <BilingualField
                  fieldId="ticker-tag"
                  labelTa="குறிப்பு தலைப்பு"
                  labelEn="Category Tag"
                  valueTa={formData.ticker.tagTa}
                  valueEn={formData.ticker.tagEn}
                  onChangeTa={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, tagTa: val }
                    })
                  }
                  onChangeEn={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, tagEn: val }
                    })
                  }
                  autoTranslateEnabled={autoTranslateEnabled}
                  isTranslating={translatingKeys['ticker-tag']}
                  onTranslate={(from) => {
                    const src = from === 'ta' ? formData.ticker.tagTa : formData.ticker.tagEn;
                    translateAndSync('ticker-tag', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                      setFormData((prev) => ({
                        ...prev,
                        ticker: {
                          ...prev.ticker,
                          ...(from === 'ta' ? { tagEn: res } : { tagTa: res })
                        }
                      }));
                    });
                  }}
                />

                <BilingualField
                  fieldId="ticker-text"
                  labelTa="அறிவிப்பு வரி (சுற்றறிக்கை)"
                  labelEn="Ticker Headline Announcement"
                  valueTa={formData.ticker.textTa}
                  valueEn={formData.ticker.textEn}
                  isTextarea={true}
                  rows={2}
                  onChangeTa={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, textTa: val }
                    })
                  }
                  onChangeEn={(val) =>
                    setFormData({
                      ...formData,
                      ticker: { ...formData.ticker, textEn: val }
                    })
                  }
                  autoTranslateEnabled={autoTranslateEnabled}
                  isTranslating={translatingKeys['ticker-text']}
                  onTranslate={(from) => {
                    const src = from === 'ta' ? formData.ticker.textTa : formData.ticker.textEn;
                    translateAndSync('ticker-text', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                      setFormData((prev) => ({
                        ...prev,
                        ticker: {
                          ...prev.ticker,
                          ...(from === 'ta' ? { textEn: res } : { textTa: res })
                        }
                      }));
                    });
                  }}
                />
              </div>
            </div>
          )}

          {/* SECTION 2: HERO & STATS */}
          {activeSection === 'hero_stats' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                  {language === 'en' ? 'Official Hero Banner & Key Metrics' : 'பிரதான முகப்பு பேனர் & புள்ளிவிவரங்கள்'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'en'
                    ? 'Edit Sangam title, government registration number, tagline, and the 4 live count metrics.'
                    : 'சங்கத்தின் பெயர், பதிவு எண், கொள்கை முழக்கம் மற்றும் 4 முக்கிய புள்ளிவிவரங்களை மாற்றவும்.'}
                </p>
              </div>

              {/* Banner Details */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {language === 'en' ? 'Hero Banner Copywriting' : 'முகப்பு உரை விவரங்கள்'}
                </h4>
                <div className="space-y-3">
                  <BilingualField
                    fieldId="hero-reg-badge"
                    labelTa="பதிவு எண் குறிப்பு"
                    labelEn="Registration Badge"
                    valueTa={formData.hero.regBadgeTa}
                    valueEn={formData.hero.regBadgeEn}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, regBadgeTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, regBadgeEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['hero-reg-badge']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.hero.regBadgeTa : formData.hero.regBadgeEn;
                      translateAndSync('hero-reg-badge', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            ...(from === 'ta' ? { regBadgeEn: res } : { regBadgeTa: res })
                          }
                        }));
                      });
                    }}
                  />

                  <BilingualField
                    fieldId="hero-title"
                    labelTa="தளத்தின் முதன்மைப் பெயர்"
                    labelEn="Portal Main Title"
                    valueTa={formData.hero.titleTa}
                    valueEn={formData.hero.titleEn}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, titleTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, titleEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['hero-title']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.hero.titleTa : formData.hero.titleEn;
                      translateAndSync('hero-title', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            ...(from === 'ta' ? { titleEn: res } : { titleTa: res })
                          }
                        }));
                      });
                    }}
                  />

                  <BilingualField
                    fieldId="hero-tagline"
                    labelTa="சங்கத்தின் கொள்கை முழக்கம்"
                    labelEn="Tagline / Motto"
                    valueTa={formData.hero.taglineTa}
                    valueEn={formData.hero.taglineEn || ''}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, taglineTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, taglineEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['hero-tagline']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.hero.taglineTa : (formData.hero.taglineEn || '');
                      translateAndSync('hero-tagline', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            ...(from === 'ta' ? { taglineEn: res } : { taglineTa: res })
                          }
                        }));
                      });
                    }}
                  />

                  <BilingualField
                    fieldId="hero-intro"
                    labelTa="அறிமுக உரை"
                    labelEn="Introduction Text"
                    valueTa={formData.hero.introTa}
                    valueEn={formData.hero.introEn || ''}
                    isTextarea={true}
                    rows={2}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, introTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, introEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['hero-intro']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.hero.introTa : (formData.hero.introEn || '');
                      translateAndSync('hero-intro', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            ...(from === 'ta' ? { introEn: res } : { introTa: res })
                          }
                        }));
                      });
                    }}
                  />
                </div>
              </div>

              {/* 4 Stats Metrics */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {language === 'en' ? '4 Live Community Counters' : '4 பிரதான புள்ளிவிவர எண்கள்'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      {language === 'en' ? 'Registered Families Count' : 'பதிவு பெற்ற குடும்பங்கள்'}
                    </label>
                    <input
                      type="text"
                      value={formData.stats.registeredFamilies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, registeredFamilies: e.target.value }
                        })
                      }
                      className="w-full text-sm font-bold text-amber-600 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  {/* Metric 2 */}
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      {language === 'en' ? 'District Branches Count' : 'மாவட்டக் கிளைகள்'}
                    </label>
                    <input
                      type="text"
                      value={formData.stats.districtBranches}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, districtBranches: e.target.value }
                        })
                      }
                      className="w-full text-sm font-bold text-amber-600 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      {language === 'en' ? 'Scholarships Amount' : 'கல்வி நிதி உதவி'}
                    </label>
                    <input
                      type="text"
                      value={formData.stats.scholarshipsAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, scholarshipsAmount: e.target.value }
                        })
                      }
                      className="w-full text-sm font-bold text-amber-600 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  {/* Metric 4 */}
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      {language === 'en' ? 'Matrimonial Alliances' : 'நிறைவேறிய வரன்கள்'}
                    </label>
                    <input
                      type="text"
                      value={formData.stats.matrimonialAlliances}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, matrimonialAlliances: e.target.value }
                        })
                      }
                      className="w-full text-sm font-bold text-amber-600 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ANNOUNCEMENTS & PRESS CIRCULARS */}
          {activeSection === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Official Press & Circulars' : 'அதிகாரப்பூர்வ சுற்றறிக்கைகள் மேலாண்மை'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'en'
                      ? 'Add, edit, or delete circular notifications and AGM press releases.'
                      : 'புதிய சுற்றறிக்கைகளை சேர்க்கவும், திருத்தவும் அல்லது நீக்கவும்.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewAnnouncement}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add New Circular' : 'புதிய சுற்றறிக்கை சேர்க்க'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.announcements.map((ann, idx) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {ann.circularNo}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {language === 'en' ? ann.titleEn : ann.titleTa}
                        </span>
                        {ann.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Urgent / முக்கியமானது
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAnnId(editingAnnId === ann.id ? null : ann.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{editingAnnId === ann.id ? 'Close Edit' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(language === 'en' ? 'Delete this circular?' : 'இந்த சுற்றறிக்கையை நீக்கவா?')) {
                              setFormData({
                                ...formData,
                                announcements: formData.announcements.filter((a) => a.id !== ann.id)
                              });
                            }
                          }}
                          className="p-1.5 rounded-lg text-xs text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {editingAnnId === ann.id && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Circular Number
                          </label>
                          <input
                            type="text"
                            value={ann.circularNo}
                            onChange={(e) => updateAnnouncement(idx, { circularNo: e.target.value })}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Date (YYYY-MM-DD)
                          </label>
                          <input
                            type="text"
                            value={ann.date}
                            onChange={(e) => updateAnnouncement(idx, { date: e.target.value })}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        {/* Whole Circular Translator Button */}
                        <div className="sm:col-span-2 flex items-center justify-between p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            {language === 'en'
                              ? 'Auto-Translate all fields for this Circular:'
                              : 'இந்த சுற்றறிக்கையின் அனைத்து விவரங்களையும் மாற்ற:'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={async () => {
                                const key = `ann-all-${ann.id}`;
                                setTranslatingKeys((p) => ({ ...p, [key]: true }));
                                try {
                                  const [newTitle, newSummary, newDetails] = await Promise.all([
                                    ann.titleTa ? translateText(ann.titleTa, 'ta', 'en') : Promise.resolve(ann.titleEn),
                                    ann.summaryTa ? translateText(ann.summaryTa, 'ta', 'en') : Promise.resolve(ann.summaryEn),
                                    ann.detailsTa ? translateText(ann.detailsTa, 'ta', 'en') : Promise.resolve(ann.detailsEn)
                                  ]);
                                  updateAnnouncement(idx, {
                                    titleEn: newTitle || ann.titleEn,
                                    summaryEn: newSummary || ann.summaryEn,
                                    detailsEn: newDetails || ann.detailsEn
                                  });
                                } finally {
                                  setTranslatingKeys((p) => ({ ...p, [key]: false }));
                                }
                              }}
                              disabled={translatingKeys[`ann-all-${ann.id}`]}
                              className="px-2 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 dark:bg-amber-900/60 text-[10.5px] font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {translatingKeys[`ann-all-${ann.id}`] ? (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                              ) : (
                                <Languages className="w-3 h-3 text-amber-700" />
                              )}
                              <span>Tamil ➔ English</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                const key = `ann-all-${ann.id}`;
                                setTranslatingKeys((p) => ({ ...p, [key]: true }));
                                try {
                                  const [newTitle, newSummary, newDetails] = await Promise.all([
                                    ann.titleEn ? translateText(ann.titleEn, 'en', 'ta') : Promise.resolve(ann.titleTa),
                                    ann.summaryEn ? translateText(ann.summaryEn, 'en', 'ta') : Promise.resolve(ann.summaryTa),
                                    ann.detailsEn ? translateText(ann.detailsEn, 'en', 'ta') : Promise.resolve(ann.detailsTa)
                                  ]);
                                  updateAnnouncement(idx, {
                                    titleTa: newTitle || ann.titleTa,
                                    summaryTa: newSummary || ann.summaryTa,
                                    detailsTa: newDetails || ann.detailsTa
                                  });
                                } finally {
                                  setTranslatingKeys((p) => ({ ...p, [key]: false }));
                                }
                              }}
                              disabled={translatingKeys[`ann-all-${ann.id}`]}
                              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 text-[10.5px] font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {translatingKeys[`ann-all-${ann.id}`] ? (
                                <Loader2 className="w-3 h-3 animate-spin text-sky-700" />
                              ) : (
                                <Languages className="w-3 h-3 text-sky-700" />
                              )}
                              <span>English ➔ தமிழ்</span>
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <BilingualField
                            fieldId={`ann-title-${ann.id}`}
                            labelTa="சுற்றறிக்கை தலைப்பு"
                            labelEn="Circular Title"
                            valueTa={ann.titleTa}
                            valueEn={ann.titleEn || ''}
                            onChangeTa={(val) => updateAnnouncement(idx, { titleTa: val })}
                            onChangeEn={(val) => updateAnnouncement(idx, { titleEn: val })}
                            autoTranslateEnabled={autoTranslateEnabled}
                            isTranslating={translatingKeys[`ann-title-${ann.id}`]}
                            onTranslate={(from) => {
                              const src = from === 'ta' ? ann.titleTa : (ann.titleEn || '');
                              translateAndSync(`ann-title-${ann.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                                updateAnnouncement(idx, from === 'ta' ? { titleEn: res } : { titleTa: res });
                              });
                            }}
                          />

                          <BilingualField
                            fieldId={`ann-summary-${ann.id}`}
                            labelTa="சுருக்க விவரம்"
                            labelEn="Summary Description"
                            valueTa={ann.summaryTa}
                            valueEn={ann.summaryEn || ''}
                            isTextarea={true}
                            rows={2}
                            onChangeTa={(val) => updateAnnouncement(idx, { summaryTa: val })}
                            onChangeEn={(val) => updateAnnouncement(idx, { summaryEn: val })}
                            autoTranslateEnabled={autoTranslateEnabled}
                            isTranslating={translatingKeys[`ann-summary-${ann.id}`]}
                            onTranslate={(from) => {
                              const src = from === 'ta' ? ann.summaryTa : (ann.summaryEn || '');
                              translateAndSync(`ann-summary-${ann.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                                updateAnnouncement(idx, from === 'ta' ? { summaryEn: res } : { summaryTa: res });
                              });
                            }}
                          />

                          <BilingualField
                            fieldId={`ann-details-${ann.id}`}
                            labelTa="முழு சுற்றறிக்கை விவரங்கள்"
                            labelEn="Full Circular Details & Instructions"
                            valueTa={ann.detailsTa}
                            valueEn={ann.detailsEn || ''}
                            isTextarea={true}
                            rows={3}
                            onChangeTa={(val) => updateAnnouncement(idx, { detailsTa: val })}
                            onChangeEn={(val) => updateAnnouncement(idx, { detailsEn: val })}
                            autoTranslateEnabled={autoTranslateEnabled}
                            isTranslating={translatingKeys[`ann-details-${ann.id}`]}
                            onTranslate={(from) => {
                              const src = from === 'ta' ? ann.detailsTa : (ann.detailsEn || '');
                              translateAndSync(`ann-details-${ann.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                                updateAnnouncement(idx, from === 'ta' ? { detailsEn: res } : { detailsTa: res });
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Venue / Location (Optional)
                          </label>
                          <input
                            type="text"
                            value={ann.venue || ''}
                            onChange={(e) => updateAnnouncement(idx, { venue: e.target.value })}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ann.isUrgent || false}
                              onChange={(e) => updateAnnouncement(idx, { isUrgent: e.target.checked })}
                              className="w-4 h-4 text-red-600 rounded"
                            />
                            <span>{language === 'en' ? 'Mark as Urgent Notice' : 'முக்கிய அறிவிப்பாக குறி'}</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: EVENTS & ASSEMBLIES */}
          {activeSection === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Upcoming Conferences & Programs' : 'வரவிருக்கும் நிகழ்வுகள் & மாநாடுகள்'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'en'
                      ? 'Add, edit, or delete state meetings, seminars, and health camps.'
                      : 'மாநில மாநாடு, கருத்தரங்கம் மற்றும் முகாம்களை மேலாண்மை செய்யவும்.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewEvent}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add New Event' : 'புதிய நிகழ்வு சேர்க்க'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.events.map((evt, idx) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                          {evt.date} • {evt.time}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                          {language === 'en' ? evt.titleEn : evt.titleTa}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingEvtId(editingEvtId === evt.id ? null : evt.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{editingEvtId === evt.id ? 'Close Edit' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(language === 'en' ? 'Delete this event?' : 'இந்த நிகழ்வை நீக்கவா?')) {
                              setFormData({
                                ...formData,
                                events: formData.events.filter((e) => e.id !== evt.id)
                              });
                            }
                          }}
                          className="p-1.5 rounded-lg text-xs text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {editingEvtId === evt.id && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                              Date
                            </label>
                            <input
                              type="text"
                              value={evt.date}
                              onChange={(e) => updateEvent(idx, { date: e.target.value })}
                              className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                              Time
                            </label>
                            <input
                              type="text"
                              value={evt.time}
                              onChange={(e) => updateEvent(idx, { time: e.target.value })}
                              className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                        </div>

                        {/* Whole Event Translator Button */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            {language === 'en'
                              ? 'Auto-Translate this Event:'
                              : 'இந்த நிகழ்வின் விவரங்களை மொழிபெயர்:'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={async () => {
                                const key = `evt-all-${evt.id}`;
                                setTranslatingKeys((p) => ({ ...p, [key]: true }));
                                try {
                                  const [newTitle, newLoc, newDesc] = await Promise.all([
                                    evt.titleTa ? translateText(evt.titleTa, 'ta', 'en') : Promise.resolve(evt.titleEn),
                                    evt.locationTa ? translateText(evt.locationTa, 'ta', 'en') : Promise.resolve(evt.locationEn),
                                    evt.descriptionTa ? translateText(evt.descriptionTa, 'ta', 'en') : Promise.resolve(evt.descriptionEn)
                                  ]);
                                  updateEvent(idx, {
                                    titleEn: newTitle || evt.titleEn,
                                    locationEn: newLoc || evt.locationEn,
                                    descriptionEn: newDesc || evt.descriptionEn
                                  });
                                } finally {
                                  setTranslatingKeys((p) => ({ ...p, [key]: false }));
                                }
                              }}
                              disabled={translatingKeys[`evt-all-${evt.id}`]}
                              className="px-2 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 dark:bg-amber-900/60 text-[10.5px] font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {translatingKeys[`evt-all-${evt.id}`] ? (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                              ) : (
                                <Languages className="w-3 h-3 text-amber-700" />
                              )}
                              <span>Tamil ➔ English</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                const key = `evt-all-${evt.id}`;
                                setTranslatingKeys((p) => ({ ...p, [key]: true }));
                                try {
                                  const [newTitle, newLoc, newDesc] = await Promise.all([
                                    evt.titleEn ? translateText(evt.titleEn, 'en', 'ta') : Promise.resolve(evt.titleTa),
                                    evt.locationEn ? translateText(evt.locationEn, 'en', 'ta') : Promise.resolve(evt.locationTa),
                                    evt.descriptionEn ? translateText(evt.descriptionEn, 'en', 'ta') : Promise.resolve(evt.descriptionTa)
                                  ]);
                                  updateEvent(idx, {
                                    titleTa: newTitle || evt.titleTa,
                                    locationTa: newLoc || evt.locationTa,
                                    descriptionTa: newDesc || evt.descriptionTa
                                  });
                                } finally {
                                  setTranslatingKeys((p) => ({ ...p, [key]: false }));
                                }
                              }}
                              disabled={translatingKeys[`evt-all-${evt.id}`]}
                              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 text-[10.5px] font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {translatingKeys[`evt-all-${evt.id}`] ? (
                                <Loader2 className="w-3 h-3 animate-spin text-sky-700" />
                              ) : (
                                <Languages className="w-3 h-3 text-sky-700" />
                              )}
                              <span>English ➔ தமிழ்</span>
                            </button>
                          </div>
                        </div>

                        <BilingualField
                          fieldId={`evt-title-${evt.id}`}
                          labelTa="நிகழ்வு தலைப்பு"
                          labelEn="Event Title"
                          valueTa={evt.titleTa}
                          valueEn={evt.titleEn || ''}
                          onChangeTa={(val) => updateEvent(idx, { titleTa: val })}
                          onChangeEn={(val) => updateEvent(idx, { titleEn: val })}
                          autoTranslateEnabled={autoTranslateEnabled}
                          isTranslating={translatingKeys[`evt-title-${evt.id}`]}
                          onTranslate={(from) => {
                            const src = from === 'ta' ? evt.titleTa : (evt.titleEn || '');
                            translateAndSync(`evt-title-${evt.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                              updateEvent(idx, from === 'ta' ? { titleEn: res } : { titleTa: res });
                            });
                          }}
                        />

                        <BilingualField
                          fieldId={`evt-loc-${evt.id}`}
                          labelTa="நிகழ்விடம் / அரங்கம்"
                          labelEn="Location / Venue / Hall"
                          valueTa={evt.locationTa}
                          valueEn={evt.locationEn || ''}
                          onChangeTa={(val) => updateEvent(idx, { locationTa: val })}
                          onChangeEn={(val) => updateEvent(idx, { locationEn: val })}
                          autoTranslateEnabled={autoTranslateEnabled}
                          isTranslating={translatingKeys[`evt-loc-${evt.id}`]}
                          onTranslate={(from) => {
                            const src = from === 'ta' ? evt.locationTa : (evt.locationEn || '');
                            translateAndSync(`evt-loc-${evt.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                              updateEvent(idx, from === 'ta' ? { locationEn: res } : { locationTa: res });
                            });
                          }}
                        />

                        <BilingualField
                          fieldId={`evt-desc-${evt.id}`}
                          labelTa="நிகழ்வு விளக்கம்"
                          labelEn="Event Description"
                          valueTa={evt.descriptionTa}
                          valueEn={evt.descriptionEn || ''}
                          isTextarea={true}
                          rows={2}
                          onChangeTa={(val) => updateEvent(idx, { descriptionTa: val })}
                          onChangeEn={(val) => updateEvent(idx, { descriptionEn: val })}
                          autoTranslateEnabled={autoTranslateEnabled}
                          isTranslating={translatingKeys[`evt-desc-${evt.id}`]}
                          onTranslate={(from) => {
                            const src = from === 'ta' ? evt.descriptionTa : (evt.descriptionEn || '');
                            translateAndSync(`evt-desc-${evt.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                              updateEvent(idx, from === 'ta' ? { descriptionEn: res } : { descriptionTa: res });
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: LEADERSHIP DESKS */}
          {activeSection === 'leadership' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? 'State Leadership Desk Messages' : 'தலைவர் & பொதுச்செயலாளர் உரை'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'en'
                    ? 'Edit the official messages and leadership details of State President and General Secretary.'
                    : 'மாநிலத் தலைவர் மற்றும் பொதுச்செயலாளரின் உரை மற்றும் விவரங்களை மாற்றவும்.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {formData.leadership.map((lead, idx) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center">
                          {lead.initials}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            {language === 'en' ? lead.badgeEn : lead.badgeTa}
                          </span>
                          <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {language === 'en' ? lead.officerNameEn : lead.officerNameTa}
                          </span>
                        </div>
                      </div>

                      {/* Leadership Desk Quick Translate */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={async () => {
                            const key = `lead-${lead.id}`;
                            setTranslatingKeys((p) => ({ ...p, [key]: true }));
                            try {
                              const [newName, newDesig, newQuote] = await Promise.all([
                                lead.officerNameTa ? translateText(lead.officerNameTa, 'ta', 'en') : Promise.resolve(lead.officerNameEn),
                                lead.designationTa ? translateText(lead.designationTa, 'ta', 'en') : Promise.resolve(lead.designationEn),
                                lead.quoteTa ? translateText(lead.quoteTa, 'ta', 'en') : Promise.resolve(lead.quoteEn)
                              ]);
                              updateLeadership(idx, {
                                officerNameEn: newName || lead.officerNameEn,
                                designationEn: newDesig || lead.designationEn,
                                quoteEn: newQuote || lead.quoteEn
                              });
                            } finally {
                              setTranslatingKeys((p) => ({ ...p, [key]: false }));
                            }
                          }}
                          disabled={translatingKeys[`lead-${lead.id}`]}
                          className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-[10px] font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-200 cursor-pointer disabled:opacity-50"
                          title="Translate Tamil to English"
                        >
                          Ta ➔ En
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const key = `lead-${lead.id}`;
                            setTranslatingKeys((p) => ({ ...p, [key]: true }));
                            try {
                              const [newName, newDesig, newQuote] = await Promise.all([
                                lead.officerNameEn ? translateText(lead.officerNameEn, 'en', 'ta') : Promise.resolve(lead.officerNameTa),
                                lead.designationEn ? translateText(lead.designationEn, 'en', 'ta') : Promise.resolve(lead.designationTa),
                                lead.quoteEn ? translateText(lead.quoteEn, 'en', 'ta') : Promise.resolve(lead.quoteTa)
                              ]);
                              updateLeadership(idx, {
                                officerNameTa: newName || lead.officerNameTa,
                                designationTa: newDesig || lead.designationTa,
                                quoteTa: newQuote || lead.quoteTa
                              });
                            } finally {
                              setTranslatingKeys((p) => ({ ...p, [key]: false }));
                            }
                          }}
                          disabled={translatingKeys[`lead-${lead.id}`]}
                          className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-900/40 text-[10px] font-bold text-sky-900 dark:text-sky-300 hover:bg-sky-200 cursor-pointer disabled:opacity-50"
                          title="Translate English to Tamil"
                        >
                          En ➔ Ta
                        </button>
                      </div>
                    </div>

                    <BilingualField
                      fieldId={`lead-name-${lead.id}`}
                      labelTa="நிர்வாகி பெயர்"
                      labelEn="Officer Name"
                      valueTa={lead.officerNameTa}
                      valueEn={lead.officerNameEn || ''}
                      onChangeTa={(val) => updateLeadership(idx, { officerNameTa: val })}
                      onChangeEn={(val) => updateLeadership(idx, { officerNameEn: val })}
                      autoTranslateEnabled={autoTranslateEnabled}
                      isTranslating={translatingKeys[`lead-name-${lead.id}`]}
                      onTranslate={(from) => {
                        const src = from === 'ta' ? lead.officerNameTa : (lead.officerNameEn || '');
                        translateAndSync(`lead-name-${lead.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                          updateLeadership(idx, from === 'ta' ? { officerNameEn: res } : { officerNameTa: res });
                        });
                      }}
                    />

                    <BilingualField
                      fieldId={`lead-desig-${lead.id}`}
                      labelTa="பதவி / பொறுப்பு"
                      labelEn="Designation / Role"
                      valueTa={lead.designationTa}
                      valueEn={lead.designationEn || ''}
                      onChangeTa={(val) => updateLeadership(idx, { designationTa: val })}
                      onChangeEn={(val) => updateLeadership(idx, { designationEn: val })}
                      autoTranslateEnabled={autoTranslateEnabled}
                      isTranslating={translatingKeys[`lead-desig-${lead.id}`]}
                      onTranslate={(from) => {
                        const src = from === 'ta' ? lead.designationTa : (lead.designationEn || '');
                        translateAndSync(`lead-desig-${lead.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                          updateLeadership(idx, from === 'ta' ? { designationEn: res } : { designationTa: res });
                        });
                      }}
                    />

                    <BilingualField
                      fieldId={`lead-quote-${lead.id}`}
                      labelTa="அதிகாரப்பூர்வ உரை / வாழ்த்துச் செய்தி"
                      labelEn="Official Leadership Message"
                      valueTa={lead.quoteTa}
                      valueEn={lead.quoteEn || ''}
                      isTextarea={true}
                      rows={3}
                      onChangeTa={(val) => updateLeadership(idx, { quoteTa: val })}
                      onChangeEn={(val) => updateLeadership(idx, { quoteEn: val })}
                      autoTranslateEnabled={autoTranslateEnabled}
                      isTranslating={translatingKeys[`lead-quote-${lead.id}`]}
                      onTranslate={(from) => {
                        const src = from === 'ta' ? lead.quoteTa : (lead.quoteEn || '');
                        translateAndSync(`lead-quote-${lead.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                          updateLeadership(idx, from === 'ta' ? { quoteEn: res } : { quoteTa: res });
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: MISSION PILLARS */}
          {activeSection === 'pillars' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? '6 Pillars of Community Service' : 'சமூக மேம்பாட்டின் ஆறு முக்கிய தூண்கள்'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'en'
                    ? 'Edit titles and descriptions of the 6 core pillars displayed on the homepage.'
                    : 'முகப்பில் உள்ள 6 கொள்கை தூண்களின் தலைப்பு மற்றும் விளக்கங்களை மாற்றவும்.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.pillars.map((pil, idx) => (
                  <div
                    key={pil.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        Pillar #{pil.pillarNumber}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={async () => {
                            const key = `pil-${pil.id}`;
                            setTranslatingKeys((p) => ({ ...p, [key]: true }));
                            try {
                              const [newTitle, newDesc] = await Promise.all([
                                pil.titleTa ? translateText(pil.titleTa, 'ta', 'en') : Promise.resolve(pil.titleEn),
                                pil.descriptionTa ? translateText(pil.descriptionTa, 'ta', 'en') : Promise.resolve(pil.descriptionEn)
                              ]);
                              updatePillar(idx, {
                                titleEn: newTitle || pil.titleEn,
                                descriptionEn: newDesc || pil.descriptionEn
                              });
                            } finally {
                              setTranslatingKeys((p) => ({ ...p, [key]: false }));
                            }
                          }}
                          disabled={translatingKeys[`pil-${pil.id}`]}
                          className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-[10px] font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-200 cursor-pointer disabled:opacity-50"
                        >
                          Ta ➔ En
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const key = `pil-${pil.id}`;
                            setTranslatingKeys((p) => ({ ...p, [key]: true }));
                            try {
                              const [newTitle, newDesc] = await Promise.all([
                                pil.titleEn ? translateText(pil.titleEn, 'en', 'ta') : Promise.resolve(pil.titleTa),
                                pil.descriptionEn ? translateText(pil.descriptionEn, 'en', 'ta') : Promise.resolve(pil.descriptionTa)
                              ]);
                              updatePillar(idx, {
                                titleTa: newTitle || pil.titleTa,
                                descriptionTa: newDesc || pil.descriptionTa
                              });
                            } finally {
                              setTranslatingKeys((p) => ({ ...p, [key]: false }));
                            }
                          }}
                          disabled={translatingKeys[`pil-${pil.id}`]}
                          className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-[10px] font-bold text-sky-900 dark:text-sky-300 hover:bg-sky-200 cursor-pointer disabled:opacity-50"
                        >
                          En ➔ Ta
                        </button>
                      </div>
                    </div>

                    <BilingualField
                      fieldId={`pil-title-${pil.id}`}
                      labelTa="தூணின் தலைப்பு"
                      labelEn="Pillar Title"
                      valueTa={pil.titleTa}
                      valueEn={pil.titleEn || ''}
                      onChangeTa={(val) => updatePillar(idx, { titleTa: val })}
                      onChangeEn={(val) => updatePillar(idx, { titleEn: val })}
                      autoTranslateEnabled={autoTranslateEnabled}
                      isTranslating={translatingKeys[`pil-title-${pil.id}`]}
                      onTranslate={(from) => {
                        const src = from === 'ta' ? pil.titleTa : (pil.titleEn || '');
                        translateAndSync(`pil-title-${pil.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                          updatePillar(idx, from === 'ta' ? { titleEn: res } : { titleTa: res });
                        });
                      }}
                    />

                    <BilingualField
                      fieldId={`pil-desc-${pil.id}`}
                      labelTa="தூணின் விளக்கம்"
                      labelEn="Pillar Description"
                      valueTa={pil.descriptionTa}
                      valueEn={pil.descriptionEn || ''}
                      isTextarea={true}
                      rows={2}
                      onChangeTa={(val) => updatePillar(idx, { descriptionTa: val })}
                      onChangeEn={(val) => updatePillar(idx, { descriptionEn: val })}
                      autoTranslateEnabled={autoTranslateEnabled}
                      isTranslating={translatingKeys[`pil-desc-${pil.id}`]}
                      onTranslate={(from) => {
                        const src = from === 'ta' ? pil.descriptionTa : (pil.descriptionEn || '');
                        translateAndSync(`pil-desc-${pil.id}`, src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                          updatePillar(idx, from === 'ta' ? { descriptionEn: res } : { descriptionTa: res });
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: CONTACT & HQ */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? 'Central Headquarters & Contact Information' : 'தலைமையகம் & தொடர்பு விவரங்கள்'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'en'
                    ? 'Update office address, helpline numbers, email IDs, and operating hours.'
                    : 'தலைமை அலுவலக முகவரி, உதவி எண்கள் மற்றும் பணி நேரங்களை மாற்றவும்.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <div className="space-y-4">
                  <BilingualField
                    fieldId="contact-hq-title"
                    labelTa="தலைமை அலுவலகப் பெயர்"
                    labelEn="Headquarters Name"
                    valueTa={formData.contact.hqTitleTa}
                    valueEn={formData.contact.hqTitleEn || ''}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, hqTitleTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, hqTitleEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['contact-hq-title']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.contact.hqTitleTa : (formData.contact.hqTitleEn || '');
                      translateAndSync('contact-hq-title', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            ...(from === 'ta' ? { hqTitleEn: res } : { hqTitleTa: res })
                          }
                        }));
                      });
                    }}
                  />

                  <BilingualField
                    fieldId="contact-address"
                    labelTa="முகவரி"
                    labelEn="Office Address"
                    valueTa={formData.contact.addressTa}
                    valueEn={formData.contact.addressEn || ''}
                    isTextarea={true}
                    rows={2}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, addressTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, addressEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['contact-address']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.contact.addressTa : (formData.contact.addressEn || '');
                      translateAndSync('contact-address', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            ...(from === 'ta' ? { addressEn: res } : { addressTa: res })
                          }
                        }));
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                        {language === 'en' ? 'Helpline & Office Phones' : 'தொலைபேசி எண்கள்'}
                      </label>
                      <input
                        type="text"
                        value={formData.contact.phones}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, phones: e.target.value }
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                        {language === 'en' ? 'Official Emails' : 'மின்னஞ்சல் முகவரிகள்'}
                      </label>
                      <input
                        type="text"
                        value={formData.contact.emails}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, emails: e.target.value }
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      />
                    </div>
                  </div>

                  <BilingualField
                    fieldId="contact-hours"
                    labelTa="பணி நேரம்"
                    labelEn="Working Hours"
                    valueTa={formData.contact.workingHoursTa}
                    valueEn={formData.contact.workingHoursEn || ''}
                    onChangeTa={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, workingHoursTa: val }
                      })
                    }
                    onChangeEn={(val) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, workingHoursEn: val }
                      })
                    }
                    autoTranslateEnabled={autoTranslateEnabled}
                    isTranslating={translatingKeys['contact-hours']}
                    onTranslate={(from) => {
                      const src = from === 'ta' ? formData.contact.workingHoursTa : (formData.contact.workingHoursEn || '');
                      translateAndSync('contact-hours', src, from, from === 'ta' ? 'en' : 'ta', (res) => {
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            ...(from === 'ta' ? { workingHoursEn: res } : { workingHoursTa: res })
                          }
                        }));
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DISTRICT BRANCHES */}
          {activeSection === 'branches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Sangam District & Town Branches Directory' : 'மாவட்ட மற்றும் நகர கிளை அலுவலகங்கள்'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'en'
                      ? 'Add or update branch offices, branch president names, and contact phone numbers.'
                      : 'கிளை அலுவலகங்கள், தலைவர் பெயர் மற்றும் தொடர்பு எண்களை நிர்வகிக்கவும்.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewBranch}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add New Branch' : 'புதிய கிளை சேர்க்க'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.branches.map((br, idx) => (
                  <div
                    key={br.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        {br.districtTa}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(language === 'en' ? 'Delete this branch?' : 'இந்தக் கிளையை நீக்கவா?')) {
                            setFormData({
                              ...formData,
                              branches: formData.branches.filter((b) => b.id !== br.id)
                            });
                          }
                        }}
                        className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Branch Name (Tamil)"
                        value={br.branchNameTa}
                        onChange={(e) => updateBranch(idx, { branchNameTa: e.target.value })}
                        className="w-full text-xs font-bold p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />

                      <input
                        type="text"
                        placeholder="Branch President Name"
                        value={br.presidentName}
                        onChange={(e) => updateBranch(idx, { presidentName: e.target.value })}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />

                      <input
                        type="text"
                        placeholder="Contact Phone"
                        value={br.phone}
                        onChange={(e) => updateBranch(idx, { phone: e.target.value })}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      />

                      <input
                        type="text"
                        placeholder="Branch Address"
                        value={br.address}
                        onChange={(e) => updateBranch(idx, { address: e.target.value })}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section Paginator */}
          <div className="pt-6 border-t border-amber-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-amber-50/50 dark:bg-zinc-800/40 p-4 rounded-2xl mt-8">
            {prevSection ? (
              <button
                type="button"
                onClick={() => setActiveSection(prevSection.id)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-700 text-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-102 active:scale-98"
              >
                <ChevronLeft className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>
                  {language === 'ta' ? `முந்தைய பிரிவு: ${prevSection.shortTa}` : `Previous: ${prevSection.shortEn}`}
                </span>
              </button>
            ) : <div />}

            <div className="text-xs font-semibold text-stone-600 dark:text-zinc-400">
              {language === 'ta' ? `பிரிவு ${currentSectionIndex + 1} / ${sections.length}` : `Section ${currentSectionIndex + 1} of ${sections.length}`}
            </div>

            {nextSection ? (
              <button
                type="button"
                onClick={() => setActiveSection(nextSection.id)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-102 active:scale-98"
              >
                <span>
                  {language === 'ta' ? `அடுத்த பிரிவு: ${nextSection.shortTa}` : `Next: ${nextSection.shortEn}`}
                </span>
                <ChevronRight className="w-4 h-4 text-amber-100" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-102 active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ta' ? 'அனைத்தும் சரிபார்க்கப்பட்டது • சேமிக்கவும்' : 'Completed • Save All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Reset to Defaults' : 'இயல்பு நிலைக்கு மீட்டமைக்க'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Export Backup' : 'காப்புப்பிரதி எடுக்க'}</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Import Config' : 'இறக்குமதி செய்ய'}</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'ரத்து செய்க'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'en' ? 'Save & Publish Live' : 'சேமித்து வெளியிடவும்'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
