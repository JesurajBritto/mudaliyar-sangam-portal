import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import {
  CompletePortalData,
  PortalAnnouncement,
  PortalEvent,
  MissionPillar,
  DistrictBranchItem,
  PortalBranding,
  resetPortalContentToDefault
} from '../data/portalContentData';
import { Language, AuthUser } from '../types';
import { SuperAdminMemberManagement } from './SuperAdminMemberManagement';
import { SangamLogo } from './SangamLogo';

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
  const [formData, setFormData] = useState<CompletePortalData>(JSON.parse(JSON.stringify(portalData)));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editingEvtId, setEditingEvtId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveData(formData);
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
      setFormData(JSON.parse(JSON.stringify(def)));
      onSaveData(def);
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
        setFormData(imported);
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

        {/* Section Navigation Tabs */}
        <div className="border-b border-amber-200 bg-amber-50/50 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'branding_logo', labelEn: '🏛️ Sangam Logo & Branding', labelTa: '🏛️ லோகோ & முகப்பு தலைப்பு', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { id: 'members_roles', labelEn: '👥 Member Roles & Demographics', labelTa: '👥 உறுப்பினர் நிலைகள் & புள்ளிவிவரங்கள்', icon: <Users2 className="w-3.5 h-3.5" /> },
            { id: 'ticker', labelEn: '1. Live Ticker', labelTa: '1. சுற்றறிக்கை டிஜிட்டல் பட்டை', icon: <Bell className="w-3.5 h-3.5" /> },
            { id: 'hero_stats', labelEn: '2. Hero & Stats', labelTa: '2. முகப்பு & புள்ளிவிவரங்கள்', icon: <Landmark className="w-3.5 h-3.5" /> },
            { id: 'announcements', labelEn: '3. Announcements & Press', labelTa: '3. சுற்றறிக்கைகள் & செய்திகள்', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'events', labelEn: '4. Events & Assemblies', labelTa: '4. நிகழ்வுகள் & மாநாடுகள்', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'leadership', labelEn: '5. Leadership Desk', labelTa: '5. தலைவர் & செயலர் உரை', icon: <Users2 className="w-3.5 h-3.5" /> },
            { id: 'pillars', labelEn: '6. Mission Pillars', labelTa: '6. சங்கத்தின் கொள்கைகள்', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'contact', labelEn: '7. Contact & HQ', labelTa: '7. தலைமையகம் & தொடர்பு', icon: <Phone className="w-3.5 h-3.5" /> },
            { id: 'branches', labelEn: '8. District Branches', labelTa: '8. மாவட்டக் கிளைகள்', icon: <Building2 className="w-3.5 h-3.5" /> }
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as AdminSection)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              {sec.icon}
              <span>{language === 'en' ? sec.labelEn : sec.labelTa}</span>
            </button>
          ))}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Primary Sangam Name (Tamil)' : 'சங்கத்தின் முழுப் பெயர் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.sangamNameTa || 'தமிழ்நாடு முதலியார் சங்கம்'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, sangamNameTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Primary Sangam Name (English)' : 'சங்கத்தின் முழுப் பெயர் (ஆங்கிலம்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.sangamNameEn || 'Tamil Nadu Mudaliyar Sangam'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, sangamNameEn: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Header Subtitle / Tagline (Tamil)' : 'முகப்பு துணைத் தலைப்பு வாசகம் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.subTitleTa || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, subTitleTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {language === 'en' ? 'Header Subtitle / Tagline (English)' : 'முகப்பு துணைத் தலைப்பு வாசகம் (ஆங்கிலம்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.branding?.subTitleEn || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, subTitleEn: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Badge Text (English)' : 'பேட்ஜ் தலைப்பு (ஆங்கிலம்)'}
                  </label>
                  <input
                    type="text"
                    value={formData.ticker.badgeEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, badgeEn: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Badge Text (Tamil)' : 'பேட்ஜ் தலைப்பு (தமிழ்)'}
                  </label>
                  <input
                    type="text"
                    value={formData.ticker.badgeTa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, badgeTa: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Category Tag (English)' : 'குறிப்பு தலைப்பு (ஆங்கிலம்)'}
                  </label>
                  <input
                    type="text"
                    value={formData.ticker.tagEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, tagEn: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Category Tag (Tamil)' : 'குறிப்பு தலைப்பு (தமிழ்)'}
                  </label>
                  <input
                    type="text"
                    value={formData.ticker.tagTa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, tagTa: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Ticker Headline Announcement (English)' : 'அறிவிப்பு வரி (ஆங்கிலம்)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ticker.textEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, textEn: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    {language === 'en' ? 'Ticker Headline Announcement (Tamil)' : 'அறிவிப்பு வரி (தமிழ்)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ticker.textTa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticker: { ...formData.ticker, textTa: e.target.value }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Registration Badge (English)' : 'பதிவு எண் குறிப்பு (ஆங்கிலம்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.regBadgeEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, regBadgeEn: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Registration Badge (Tamil)' : 'பதிவு எண் குறிப்பு (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.regBadgeTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, regBadgeTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Portal Main Title (English)' : 'தளத்தின் முதன்மைப் பெயர் (ஆங்கிலம்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleEn: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Portal Main Title (Tamil)' : 'தளத்தின் முதன்மைப் பெயர் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Tagline / Mottos (Tamil)' : 'சங்கத்தின் கொள்கை முழக்கம் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.taglineTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, taglineTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Introduction Text (Tamil)' : 'அறிமுக உரை (தமிழ்)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.hero.introTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, introTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
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
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].circularNo = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
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
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].date = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Title (Tamil) *
                          </label>
                          <input
                            type="text"
                            value={ann.titleTa}
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].titleTa = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Summary Description (Tamil) *
                          </label>
                          <textarea
                            rows={2}
                            value={ann.summaryTa}
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].summaryTa = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Full Circular Details & Instructions (Tamil)
                          </label>
                          <textarea
                            rows={3}
                            value={ann.detailsTa}
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].detailsTa = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Venue / Location (Optional)
                          </label>
                          <input
                            type="text"
                            value={ann.venue || ''}
                            onChange={(e) => {
                              const updated = [...formData.announcements];
                              updated[idx].venue = e.target.value;
                              setFormData({ ...formData, announcements: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ann.isUrgent || false}
                              onChange={(e) => {
                                const updated = [...formData.announcements];
                                updated[idx].isUrgent = e.target.checked;
                                setFormData({ ...formData, announcements: updated });
                              }}
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
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Event Title (Tamil) *
                          </label>
                          <input
                            type="text"
                            value={evt.titleTa}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].titleTa = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            value={evt.date}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].date = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
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
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].time = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Location / Hall (Tamil)
                          </label>
                          <input
                            type="text"
                            value={evt.locationTa}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].locationTa = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            Description (Tamil)
                          </label>
                          <textarea
                            rows={2}
                            value={evt.descriptionTa}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].descriptionTa = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center">
                        {lead.initials}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          {lead.badgeTa}
                        </span>
                        <input
                          type="text"
                          value={lead.officerNameTa}
                          onChange={(e) => {
                            const updated = [...formData.leadership];
                            updated[idx].officerNameTa = e.target.value;
                            setFormData({ ...formData, leadership: updated });
                          }}
                          className="font-bold text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-full mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Designation / பொறுப்பு (தமிழ்)
                      </label>
                      <input
                        type="text"
                        value={lead.designationTa}
                        onChange={(e) => {
                          const updated = [...formData.leadership];
                          updated[idx].designationTa = e.target.value;
                          setFormData({ ...formData, leadership: updated });
                        }}
                        className="text-xs p-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Official Message / உரை (தமிழ்)
                      </label>
                      <textarea
                        rows={4}
                        value={lead.quoteTa}
                        onChange={(e) => {
                          const updated = [...formData.leadership];
                          updated[idx].quoteTa = e.target.value;
                          setFormData({ ...formData, leadership: updated });
                        }}
                        className="text-xs p-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-full leading-relaxed"
                      />
                    </div>
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
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2.5"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Pillar #{pil.pillarNumber} Title (Tamil)
                      </label>
                      <input
                        type="text"
                        value={pil.titleTa}
                        onChange={(e) => {
                          const updated = [...formData.pillars];
                          updated[idx].titleTa = e.target.value;
                          setFormData({ ...formData, pillars: updated });
                        }}
                        className="w-full text-xs font-bold p-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Pillar Description (Tamil)
                      </label>
                      <textarea
                        rows={2}
                        value={pil.descriptionTa}
                        onChange={(e) => {
                          const updated = [...formData.pillars];
                          updated[idx].descriptionTa = e.target.value;
                          setFormData({ ...formData, pillars: updated });
                        }}
                        className="w-full text-xs p-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Headquarters Name (Tamil)' : 'தலைமை அலுவலகப் பெயர் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.contact.hqTitleTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, hqTitleTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Address (Tamil)' : 'முகவரி (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.contact.addressTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, addressTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

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

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      {language === 'en' ? 'Working Hours (Tamil)' : 'பணி நேரம் (தமிழ்)'}
                    </label>
                    <input
                      type="text"
                      value={formData.contact.workingHoursTa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, workingHoursTa: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
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
                        onChange={(e) => {
                          const updated = [...formData.branches];
                          updated[idx].branchNameTa = e.target.value;
                          setFormData({ ...formData, branches: updated });
                        }}
                        className="w-full text-xs font-bold p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />

                      <input
                        type="text"
                        placeholder="Branch President Name"
                        value={br.presidentName}
                        onChange={(e) => {
                          const updated = [...formData.branches];
                          updated[idx].presidentName = e.target.value;
                          setFormData({ ...formData, branches: updated });
                        }}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />

                      <input
                        type="text"
                        placeholder="Contact Phone"
                        value={br.phone}
                        onChange={(e) => {
                          const updated = [...formData.branches];
                          updated[idx].phone = e.target.value;
                          setFormData({ ...formData, branches: updated });
                        }}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      />

                      <input
                        type="text"
                        placeholder="Branch Address"
                        value={br.address}
                        onChange={(e) => {
                          const updated = [...formData.branches];
                          updated[idx].address = e.target.value;
                          setFormData({ ...formData, branches: updated });
                        }}
                        className="w-full text-xs p-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
