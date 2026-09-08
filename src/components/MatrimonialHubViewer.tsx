import React, { useState } from 'react';
import {
  Heart,
  Crown,
  Lock,
  Unlock,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Search,
  PlusCircle,
  ShieldCheck,
  Printer,
  Bookmark,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Language, MatrimonialProfile } from '../types';
import {
  INITIAL_MATRIMONIAL_PROFILES,
  MATRIMONIAL_SUBSCRIPTION_PLANS
} from '../data/matrimonialData';
import { ModuleTopNav } from './ModuleTopNav';

interface MatrimonialHubViewerProps {
  language: Language;
  searchQuery?: string;
  onBackToHome?: () => void;
}

type MatrimonialSubTab = 'browse' | 'shortlist' | 'plans';

export const MatrimonialHubViewer: React.FC<MatrimonialHubViewerProps> = ({
  language,
  searchQuery: externalSearch = '',
  onBackToHome
}) => {
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(INITIAL_MATRIMONIAL_PROFILES);
  const [activeSubTab, setActiveSubTab] = useState<MatrimonialSubTab>('browse');
  const [activeGender, setActiveGender] = useState<'all' | 'bride' | 'groom'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['mat-001']);

  // Gold Membership State: Only Gold Members can see full details; free users see masked data
  const [hasPremiumSubscription, setHasPremiumSubscription] = useState<boolean>(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [isRegisterProfileOpen, setIsRegisterProfileOpen] = useState<boolean>(false);

  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);

  // New Profile Form State (Gotram, Star, Raasi, Dosham, Sub-sect removed)
  const [regForm, setRegForm] = useState({
    fullName: '',
    fullNameTa: '',
    gender: 'bride' as 'bride' | 'groom',
    dateOfBirth: '1998-05-12',
    age: 26,
    height: "5' 6\"",
    education: '',
    profession: '',
    annualIncome: '',
    currentLocation: 'Chennai',
    nativePlace: 'Kanchipuram',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    contactPerson: '',
    contactPhone: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const effectiveSearch = (externalSearch || searchTerm).trim().toLowerCase();

  // Helper for masking names when not a Gold Member
  const getMaskedName = (fullName: string, isGold: boolean): string => {
    if (isGold) return fullName;
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 3) + '••••••••';
    }
    return `${parts[0]} ${parts[1].slice(0, 1)}•••••• (Gold Only)`;
  };

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (shortlistedIds.includes(id)) {
      setShortlistedIds(shortlistedIds.filter((item) => item !== id));
      setToastMessage(
        language === 'en'
          ? 'Profile removed from your shortlist.'
          : 'வரன் விருப்பப் பட்டியலில் இருந்து நீக்கப்பட்டது.'
      );
    } else {
      setShortlistedIds([...shortlistedIds, id]);
      setToastMessage(
        language === 'en'
          ? 'Profile saved to your shortlist! Access anytime from Shortlist tab.'
          : 'வரன் விருப்பப் பட்டியலில் சேர்க்கப்பட்டது!'
      );
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenProfileDetails = (profile: MatrimonialProfile) => {
    if (hasPremiumSubscription) {
      setSelectedProfile(profile);
    } else {
      // In accordance with: "only gold membership able to see full details other only masked data"
      setIsSubscribeModalOpen(true);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesGender = activeGender === 'all' || p.gender === activeGender;
    const matchesLocation =
      selectedLocation === 'all' ||
      p.currentLocation.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      p.nativePlace.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesProfession =
      selectedProfession === 'all' ||
      p.profession.toLowerCase().includes(selectedProfession.toLowerCase()) ||
      p.education.toLowerCase().includes(selectedProfession.toLowerCase());

    const matchesQuery =
      !effectiveSearch ||
      p.fullName.toLowerCase().includes(effectiveSearch) ||
      p.education.toLowerCase().includes(effectiveSearch) ||
      p.profession.toLowerCase().includes(effectiveSearch) ||
      p.nativePlace.toLowerCase().includes(effectiveSearch) ||
      p.currentLocation.toLowerCase().includes(effectiveSearch);

    return matchesGender && matchesLocation && matchesProfession && matchesQuery;
  });

  const shortlistedProfiles = profiles.filter((p) => shortlistedIds.includes(p.id));

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.education || !regForm.contactPhone) {
      alert('Please fill in required fields: Full Name, Education, and Contact Phone.');
      return;
    }

    const newEntry: MatrimonialProfile = {
      id: `mat-${Date.now().toString().slice(-4)}`,
      registrationNo: `MUD-MAT-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: regForm.fullName,
      fullNameTa: regForm.fullNameTa || regForm.fullName,
      gender: regForm.gender,
      dateOfBirth: regForm.dateOfBirth,
      age: Number(regForm.age) || 26,
      height: regForm.height || "5' 6\"",
      subSect: 'Mudaliyar',
      gotramKulam: 'Registered',
      kulaDeivam: 'Temple Registered',
      raasi: 'Registered',
      nakshatram: 'Registered',
      dosham: 'Verified',
      education: regForm.education,
      profession: regForm.profession || 'Professional',
      annualIncome: regForm.annualIncome || '₹12,00,000 P.A.',
      currentLocation: regForm.currentLocation,
      nativePlace: regForm.nativePlace,
      fatherName: regForm.fatherName || 'Respected Member',
      fatherOccupation: regForm.fatherOccupation || 'Business / Service',
      motherName: regForm.motherName || 'Homemaker',
      motherOccupation: regForm.motherOccupation || 'Homemaker',
      familyStatus: 'Upper Middle Class',
      verifiedSangamMember: true,
      photoUrl:
        regForm.gender === 'bride'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      photos: [],
      contactPerson: regForm.contactPerson || 'Parent / Guardian',
      contactPhone: regForm.contactPhone,
      whatsappNumber: regForm.contactPhone.replace(/\D/g, ''),
      raasiChartSummary: [],
      navamsamChartSummary: [],
      isFeatured: false
    };

    setProfiles((prev) => [newEntry, ...prev]);
    setIsRegisterProfileOpen(false);
    setToastMessage(
      language === 'en'
        ? 'Matrimonial profile registered successfully with Sangam Registry!'
        : 'வரன் பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!'
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePrintBiodata = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Matrimonial Matchmaking Hub"
        moduleNameTa="திருமண தகவல் மையம் & வரன் தேடல்"
        badgeEn="Verified Alliance Registry"
        badgeTa="சரிபார்க்கப்பட்ட வரன் பதிவு"
        subtitleEn="Trust-verified alliance matchmaking and matrimonial profiles for community families worldwide."
        subtitleTa="உலகெங்கிலும் உள்ள முதலியார் குடும்பங்களுக்கான நம்பகமான திருமண வரன் தகவல் மையம்."
        themeColor="rose"
        icon={Heart}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Section (Elegant Rose / Burgundy Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/40 border border-rose-200/80 shadow-[0_4px_24px_rgba(244,63,94,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight flex items-center gap-2">
                  <span>{language === 'en' ? 'Matrimonial Matchmaking Hub' : 'திருமண தகவல் மையம்'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    {language === 'en' ? 'Verified Registry' : 'சரிபார்க்கப்பட்டது'}
                  </span>
                </h2>
                <span className="text-xs text-rose-700 font-bold block">
                  {language === 'en'
                    ? 'Trust-verified alliance matchmaking for community families worldwide'
                    : 'உலகளாவிய முதலியார் குடும்பங்களுக்கான நம்பகமான திருமண பொருத்தம்'}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
              {language === 'en'
                ? 'Only Gold Members can access full unmasked profile details, verified family background, and direct parental phone numbers. Free users can browse masked overview summaries.'
                : 'தங்க சந்தா உறுப்பினர்கள் மட்டுமே முழுமையான அசல் விவரங்கள் மற்றும் பெற்றோரின் தொலைபேசி எண்களைப் பார்க்க முடியும். மற்றவர்களுக்கு விவரங்கள் மறைக்கப்படும்.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => setIsRegisterProfileOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Bride / Groom</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubscribeModalOpen(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                hasPremiumSubscription
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>
                {hasPremiumSubscription ? 'Gold Membership Active' : 'Upgrade to Gold (₹999)'}
              </span>
            </button>
          </div>
        </div>

        {/* Viewing Mode Simulator Pill */}
        <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Viewing Mode:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 ${
                  hasPremiumSubscription
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300'
                }`}
              >
                {hasPremiumSubscription ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gold Member: FULL DETAILS UNMASKED</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Free Viewer: MASKED DATA ONLY</span>
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setHasPremiumSubscription(!hasPremiumSubscription)}
              className="text-xs text-rose-700 dark:text-rose-400 font-bold underline hover:text-rose-800 cursor-pointer"
            >
              {hasPremiumSubscription
                ? 'Switch to Free Masked View'
                : 'Simulate Gold Member (Reveal Full Details)'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{profiles.filter((p) => p.gender === 'bride').length} Brides</span>
            <span>•</span>
            <span>{profiles.filter((p) => p.gender === 'groom').length} Grooms</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'browse'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 text-rose-600" />
          <span>Browse Alliances</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
            {filteredProfiles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shortlist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'shortlist'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/40" />
          <span>My Shortlist</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            {shortlistedProfiles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'plans'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-600" />
          <span>Gold Membership Plans</span>
        </button>
      </div>

      {/* SUB-VIEW 1: BROWSE ALLIANCES */}
      {activeSubTab === 'browse' && (
        <div className="space-y-4">
          {/* Filters Bar: Sub-sect, Gotram, Star/Raasi, Dosham removed */}
          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Gender Radio Pill */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveGender('all')}
                  className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                    activeGender === 'all'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  All Profiles
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender('bride')}
                  className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeGender === 'bride'
                      ? 'bg-rose-600 text-white shadow-xs font-bold'
                      : 'text-rose-700 dark:text-rose-400 hover:text-rose-800'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Brides</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender('groom')}
                  className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeGender === 'groom'
                      ? 'bg-purple-600 text-white shadow-xs font-bold'
                      : 'text-purple-700 dark:text-purple-400 hover:text-purple-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Grooms</span>
                </button>
              </div>

              {/* Text Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by education, profession, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-medium"
                />
              </div>
            </div>

            {/* Location & Profession Category Filters */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Location:
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-medium"
                >
                  <option value="all">All Locations</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Bengaluru">Bengaluru / Hybrid / Abroad</option>
                  <option value="Kanchipuram">Kanchipuram / Vellore</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Profession & Education Sector:
                </label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-medium"
                >
                  <option value="all">All Professions</option>
                  <option value="Doctor">Medical & Healthcare (Doctor / MD / Surgeon)</option>
                  <option value="Engineer">IT & Software Engineering (Tech Lead / AI)</option>
                  <option value="Manager">Management & Corporate (MBA / Product Manager)</option>
                  <option value="Civil Service">Civil Services & Government Officers</option>
                  <option value="Architect">Architecture & Design</option>
                </select>
              </div>
            </div>
          </div>

          {/* Masking Status Banner for Free Users */}
          {!hasPremiumSubscription && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-xs flex items-center justify-between gap-3 text-amber-950 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Free Viewer Notice:</strong> Profile names, photos, incomes, and parent phone numbers are currently masked. Only Gold Members can see full unmasked details.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
              >
                Unlock Gold (₹999)
              </button>
            </div>
          )}

          {/* Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                No Matching Alliances Found
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Try resetting location or profession filters to view all profiles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedLocation('all');
                  setSelectedProfession('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProfiles.map((profile) => {
                const isShortlisted = shortlistedIds.includes(profile.id);
                const displayName = getMaskedName(profile.fullName, hasPremiumSubscription);

                return (
                  <div
                    key={profile.id}
                    className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Profile Top Row */}
                      <div className="flex items-start gap-4">
                        {/* Profile Photo - Masked/Blurred for Free Users */}
                        <div className="relative shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 border-rose-300 dark:border-rose-800 shadow-xs bg-zinc-100 dark:bg-zinc-800">
                          <img
                            src={profile.photoUrl}
                            alt={profile.fullName}
                            className={`w-full h-full object-cover transition-all ${
                              hasPremiumSubscription
                                ? 'blur-none'
                                : 'blur-md scale-110 select-none pointer-events-none'
                            }`}
                            referrerPolicy="no-referrer"
                          />

                          {!hasPremiumSubscription && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-1">
                              <Lock className="w-4 h-4 text-amber-300 mb-0.5" />
                              <span className="text-[8px] font-bold uppercase leading-tight text-amber-200">
                                Photo Masked
                              </span>
                            </div>
                          )}

                          <span
                            className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-xs ${
                              profile.gender === 'bride' ? 'bg-rose-600' : 'bg-purple-600'
                            }`}
                          >
                            {profile.gender === 'bride' ? 'Bride' : 'Groom'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                              {hasPremiumSubscription
                                ? profile.registrationNo
                                : 'MUD-MAT-•••• (Masked)'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {profile.verifiedSangamMember && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified</span>
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => toggleShortlist(profile.id, e)}
                                title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isShortlisted
                                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-600'
                                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500'
                                }`}
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`}
                                />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 leading-snug truncate">
                            {displayName}
                          </h3>

                          <p className="text-xs text-rose-700 dark:text-rose-400 font-bold mt-0.5 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{profile.education}</span>
                          </p>

                          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold mt-0.5 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                            <span className="truncate">{profile.profession}</span>
                          </p>
                        </div>
                      </div>

                      {/* Vital Information Grid (Sub-sect, Gotram, Star, Dosham removed) */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">
                            Age & Height
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {profile.age} Yrs • {profile.height}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">
                            Annual Income
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {hasPremiumSubscription ? profile.annualIncome : '•••••••• (Gold Only)'}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">
                            Current Location
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                            {hasPremiumSubscription
                              ? profile.currentLocation
                              : 'Tamil Nadu (City Masked)'}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">
                            Native Town
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                            {hasPremiumSubscription
                              ? profile.nativePlace
                              : '•••••••• (Gold Only)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Gold Membership Gated Controls */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      {hasPremiumSubscription ? (
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              PARENT CONTACT (UNMASKED):
                            </span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">
                              {profile.contactPerson}: {profile.contactPhone}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${profile.whatsappNumber}?text=Vanakkam,%20we%20found%20your%20matrimonial%20profile%20${profile.registrationNo}%20(${profile.fullName})%20on%20Mudaliyar%20Sangam%20Platform.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1 text-xs font-bold"
                              title="WhatsApp Guardian"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleOpenProfileDetails(profile)}
                              className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
                            >
                              Full Details
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-2.5 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                            <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                              <span className="font-bold text-zinc-900 dark:text-white block">
                                Full Biodata & Parent Phone Masked
                              </span>
                              <span>Only Gold Membership reveals full details</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsSubscribeModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
                          >
                            Unlock Full Details (₹999)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: MY SHORTLIST */}
      {activeSubTab === 'shortlist' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-xs">
                <Bookmark className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  My Shortlisted Prospective Alliances
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Save prospective profiles here to discuss with family elders or review contacts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('browse')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold cursor-pointer"
            >
              Browse More
            </button>
          </div>

          {shortlistedProfiles.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
              <Heart className="w-8 h-8 text-zinc-300 mx-auto" />
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                No Profiles in Your Shortlist
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Click the heart icon on any bride or groom card to bookmark them for later review.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('browse')}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Browse Alliances
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortlistedProfiles.map((p) => {
                const displayName = getMaskedName(p.fullName, hasPremiumSubscription);

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/60 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden border border-rose-200 shrink-0">
                        <img
                          src={p.photoUrl}
                          alt={p.fullName}
                          className={`w-full h-full object-cover ${
                            hasPremiumSubscription ? 'blur-none' : 'blur-md'
                          }`}
                        />
                        {!hasPremiumSubscription && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {hasPremiumSubscription ? p.registrationNo : 'MUD-MAT-••••'}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                          {displayName}
                        </h4>
                        <p className="text-[11px] text-zinc-500">{p.education}</p>
                        <span className="text-[10px] text-zinc-600 font-semibold">{p.profession}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenProfileDetails(p)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                      >
                        {hasPremiumSubscription ? 'View Full' : 'Unlock Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(p.id)}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: SUBSCRIPTION PLANS & MEMBERSHIP TIERS */}
      {activeSubTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
              Matrimonial Matchmaking Hub Membership Plans
            </h3>
            <p className="text-xs text-zinc-500">
              Only Gold Membership unlocks full unmasked profile details, clear photos, verified family background, and direct parental phone numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {MATRIMONIAL_SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-amber-500/10 to-white dark:to-zinc-900 border-amber-300 dark:border-amber-700'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {plan.name}
                    </h4>
                    {plan.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase tracking-wider">
                        Full Access Pass
                      </span>
                    )}
                  </div>

                  <div className="font-black text-2xl text-zinc-900 dark:text-white">
                    ₹{plan.price}{' '}
                    <span className="text-xs font-normal text-zinc-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (plan.price > 0) {
                        setHasPremiumSubscription(true);
                        setToastMessage('Gold Matrimonial Membership activated! All details unmasked.');
                        setTimeout(() => setToastMessage(null), 5000);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                      plan.price > 0
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {plan.price > 0
                      ? hasPremiumSubscription
                        ? 'Gold Membership Active'
                        : 'Activate Gold Membership (₹999)'
                      : 'Free Masked Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL UNMASKED BIODATA MODAL (ACCESSIBLE ONLY TO GOLD MEMBERS) */}
      {selectedProfile && hasPremiumSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header with Unmasked Photo & Name */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProfile.photoUrl}
                  alt={selectedProfile.fullName}
                  className="w-16 h-20 rounded-2xl object-cover border-2 border-rose-300 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">
                      {selectedProfile.registrationNo}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Gold Member View
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                    {selectedProfile.fullName}
                  </h3>
                  <p className="text-xs text-rose-700 font-semibold">
                    {selectedProfile.profession} • {selectedProfile.education}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintBiodata}
                  title="Print Biodata"
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Candidate Overview Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">Age & DOB:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedProfile.age} Yrs ({selectedProfile.dateOfBirth})
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">Height:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedProfile.height}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">Annual Income:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedProfile.annualIncome}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block">Current Location:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedProfile.currentLocation}
                </span>
              </div>
            </div>

            {/* Verified Family Background */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
              <span className="font-bold text-zinc-900 dark:text-white block text-xs">
                Verified Family Background:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300">
                <p>
                  <strong>Father:</strong> {selectedProfile.fatherName} (
                  {selectedProfile.fatherOccupation})
                </p>
                <p>
                  <strong>Mother:</strong> {selectedProfile.motherName} (
                  {selectedProfile.motherOccupation})
                </p>
                <p>
                  <strong>Native Town:</strong> {selectedProfile.nativePlace}
                </p>
                <p>
                  <strong>Family Status:</strong> {selectedProfile.familyStatus}
                </p>
              </div>
            </div>

            {/* Direct Unmasked Contact Footer */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block">
                  VERIFIED PARENT CONTACT:
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {selectedProfile.contactPerson}: {selectedProfile.contactPhone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedProfile.contactPhone}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Parent</span>
                </a>
                <a
                  href={`https://wa.me/${selectedProfile.whatsappNumber}?text=Vanakkam,%20we%20found%20your%20matrimonial%20profile%20${selectedProfile.registrationNo}%20(${selectedProfile.fullName})%20on%20Mudaliyar%20Sangam%20Platform.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION UPGRADE MODAL */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Gold Matrimonial Membership
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubscribeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800">
              <span className="text-2xl font-black text-amber-900 dark:text-amber-200 block">
                ₹999 <span className="text-xs font-normal text-zinc-500">/ 1 Year Access</span>
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold block mt-1">
                Unlock 100% Full Unmasked Profile Details & Direct Parent Phone Numbers
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unmask full candidate names and clear photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified parent & guardian mobile numbers with direct call access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct WhatsApp alliance initiation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete verified family background & parents' occupations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full biodata printable view</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubscribeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasPremiumSubscription(true);
                  setIsSubscribeModalOpen(false);
                  setToastMessage(
                    'Congratulations! Gold Membership activated. All profiles are now fully unmasked!'
                  );
                  setTimeout(() => setToastMessage(null), 5000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Activate Gold Membership (₹999)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER BRIDE / GROOM PROFILE MODAL (WITHOUT GOTRAM, STAR, DOSHAM, SUBSECT) */}
      {isRegisterProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Register New Matrimonial Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRegisterProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Gender*
                  </label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="bride">Bride</option>
                    <option value="groom">Groom</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Keerthana Soundararajan"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Age & Date of Birth*
                  </label>
                  <input
                    type="date"
                    required
                    value={regForm.dateOfBirth}
                    onChange={(e) => setRegForm({ ...regForm, dateOfBirth: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5' 6&quot;"
                    value={regForm.height}
                    onChange={(e) => setRegForm({ ...regForm, height: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Education Qualification*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MD / B.Tech (IIT)"
                    value={regForm.education}
                    onChange={(e) => setRegForm({ ...regForm, education: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Profession*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Resident Physician"
                    value={regForm.profession}
                    onChange={(e) => setRegForm({ ...regForm, profession: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Annual Income
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18,00,000 P.A."
                    value={regForm.annualIncome}
                    onChange={(e) => setRegForm({ ...regForm, annualIncome: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Current Location*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai, Tamil Nadu"
                    value={regForm.currentLocation}
                    onChange={(e) => setRegForm({ ...regForm, currentLocation: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Native Town*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kanchipuram"
                    value={regForm.nativePlace}
                    onChange={(e) => setRegForm({ ...regForm, nativePlace: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Father Name & Occupation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. V. Soundararajan (Chartered Accountant)"
                    value={regForm.fatherName}
                    onChange={(e) => setRegForm({ ...regForm, fatherName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Mother Name & Occupation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Revathi (Homemaker)"
                    value={regForm.motherName}
                    onChange={(e) => setRegForm({ ...regForm, motherName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Parent / Guardian Mobile Phone*
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98403 44556"
                    value={regForm.contactPhone}
                    onChange={(e) => setRegForm({ ...regForm, contactPhone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Submit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
