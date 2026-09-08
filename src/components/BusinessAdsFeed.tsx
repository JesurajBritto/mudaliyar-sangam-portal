import React, { useState } from 'react';
import {
  Megaphone,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  ExternalLink,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  MapPin,
  Tag,
  Eye,
  MousePointerClick,
  Filter,
  Search,
  Sparkles,
  Smartphone,
  Globe,
  Share2,
  Heart,
  AlertTriangle,
  UserCheck,
  Image as ImageIcon,
  Crown,
  Lock,
  RefreshCw,
  X,
  Trash2,
  Archive
} from 'lucide-react';
import {
  Language,
  BusinessAdvertisement,
  AdCategory,
  AdStatus,
  AdPlacement,
  BusinessSubscription
} from '../types';
import { INITIAL_BUSINESS_ADS, AD_CATEGORIES, PRESET_BANNER_IMAGES } from '../data/businessAdsData';
import { AdImageCarousel } from './AdImageCarousel';
import { ModuleTopNav } from './ModuleTopNav';

interface BusinessAdsFeedProps {
  language: Language;
  onBackToHome?: () => void;
}

export const BusinessAdsFeed: React.FC<BusinessAdsFeedProps> = ({ language, onBackToHome }) => {
  const [ads, setAds] = useState<BusinessAdvertisement[]>(INITIAL_BUSINESS_ADS);
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'upload' | 'archived' | 'admin_moderation'>('feed');
  const [feedLayout, setFeedLayout] = useState<'portal' | 'mobile_feed'>('portal');
  
  // Member Business Subscription State
  const [memberSubscription, setMemberSubscription] = useState<BusinessSubscription>({
    hasActiveSubscription: true,
    tier: 'gold',
    planName: 'Gold Business Patron',
    planNameTa: 'தங்க வணிக புரவலர்',
    validUntil: '31-Mar-2027',
    maxImagesAllowed: 5
  });

  // Search & Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Member Upload Form State (supports up to 5 rotating slide images)
  const [uploadForm, setUploadForm] = useState({
    businessName: '',
    businessNameTa: '',
    memberName: 'M. Sivasankaran Mudaliyar',
    memberCode: 'MUD-CHN-2024-0012',
    category: 'textiles_silks' as AdCategory,
    adTitle: '',
    adTitleTa: '',
    description: '',
    descriptionTa: '',
    imageUrl: PRESET_BANNER_IMAGES[0].url,
    images: [
      PRESET_BANNER_IMAGES[0].url,
      PRESET_BANNER_IMAGES[2].url,
      PRESET_BANNER_IMAGES[3].url
    ],
    newImageUrlInput: '',
    phone: '+91 98401 22345',
    whatsapp: '+919840122345',
    websiteUrl: '',
    city: 'Chennai',
    district: 'Chennai',
    specialOffer: '',
    specialOfferTa: '',
    placement: 'feed_and_main' as AdPlacement
  });
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Admin Review Modal/State
  const [rejectingAdId, setRejectingAdId] = useState<string | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState<string>('Please update contact details and business registration certificate.');
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);

  // Likes tracker for interactive mobile feed
  const [likedAds, setLikedAds] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedAds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter approved ads for the main public news feed (Must NOT be archived due to ended subscription)
  const approvedAds = ads.filter((ad) => {
    const isApproved = ad.status === 'approved' && !ad.isArchived;
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      ad.businessName.toLowerCase().includes(query) ||
      ad.businessNameTa.includes(query) ||
      ad.adTitle.toLowerCase().includes(query) ||
      ad.city.toLowerCase().includes(query) ||
      ad.district.toLowerCase().includes(query) ||
      ad.phone.includes(query);

    return isApproved && matchesCategory && matchesSearch;
  });

  // Archived Ads (Subscription ended, hidden from feed until member purchases subscription)
  const archivedAds = ads.filter((ad) => ad.isArchived);

  // Handle subscription expiration simulation
  const handleExpireSubscription = () => {
    setMemberSubscription((prev) => ({ ...prev, hasActiveSubscription: false }));
    // Archive member's ads
    setAds((prev) =>
      prev.map((ad, idx) =>
        idx === 0 || ad.memberCode === uploadForm.memberCode
          ? { ...ad, isArchived: true, archivedAt: new Date().toISOString() }
          : ad
      )
    );
    setModerationNotice(
      language === 'en'
        ? '⚠️ Subscription Ended: Member ads have been ARCHIVED and hidden from website & app feed. Purchase a plan to reactivate.'
        : '⚠️ வணிக சந்தா முடிவடைந்தது: விளம்பரங்கள் ஆவணப்படுத்தப்பட்டு இணையதளத்தில் இருந்து மறைக்கப்பட்டுள்ளன. சந்தா பெற்று மீண்டும் காட்டலாம்.'
    );
    setTimeout(() => setModerationNotice(null), 6000);
  };

  // Handle purchasing subscription to reactivate all archived ads
  const handlePurchaseSubscription = () => {
    setMemberSubscription({
      hasActiveSubscription: true,
      tier: 'gold',
      planName: 'Gold Business Patron',
      planNameTa: 'தங்க வணிக புரவலர்',
      validUntil: '31-Mar-2027',
      maxImagesAllowed: 5
    });
    // Unarchive ads
    setAds((prev) =>
      prev.map((ad) =>
        ad.isArchived ? { ...ad, isArchived: false, archivedAt: undefined } : ad
      )
    );
    setModerationNotice(
      language === 'en'
        ? '🎉 Business Subscription Purchased! Your advertisements are now unarchived and live on the website and app feed!'
        : '🎉 வணிக சந்தா வாங்கப்பட்டது! உங்கள் விளம்பரங்கள் மீண்டும் இணையதளம் மற்றும் ஆப்பில் நேரலையாகக் காட்டப்படுகின்றன!'
    );
    setTimeout(() => setModerationNotice(null), 6000);
  };

  // Pending ads for admin moderation queue
  const pendingAds = ads.filter((ad) => ad.status === 'pending_review');
  const rejectedAds = ads.filter((ad) => ad.status === 'rejected');

  // Handle new ad submission by member
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check Business Subscription
    if (!memberSubscription.hasActiveSubscription) {
      alert(
        language === 'en'
          ? 'Only active business subscription members can upload advertisements. Please activate a plan first.'
          : 'செயலில் உள்ள வணிக சந்தா உறுப்பினர்கள் மட்டுமே விளம்பரங்களை பதிவேற்ற முடியும்.'
      );
      return;
    }

    if (!uploadForm.businessName || !uploadForm.adTitle || !uploadForm.phone) {
      alert('Please fill in required fields: Business Name, Ad Title, and Mobile Phone.');
      return;
    }

    const finalImages = uploadForm.images.length > 0
      ? uploadForm.images
      : [uploadForm.imageUrl || PRESET_BANNER_IMAGES[0].url];

    const newAd: BusinessAdvertisement = {
      id: `ad-${Date.now().toString().slice(-4)}`,
      memberId: 'mem-current-user',
      memberName: uploadForm.memberName,
      memberCode: uploadForm.memberCode,
      businessName: uploadForm.businessName,
      businessNameTa: uploadForm.businessNameTa || uploadForm.businessName,
      category: uploadForm.category,
      adTitle: uploadForm.adTitle,
      adTitleTa: uploadForm.adTitleTa || uploadForm.adTitle,
      description: uploadForm.description,
      descriptionTa: uploadForm.descriptionTa || uploadForm.description,
      imageUrl: finalImages[0],
      images: finalImages,
      phone: uploadForm.phone,
      whatsapp: uploadForm.whatsapp || uploadForm.phone.replace(/\D/g, ''),
      websiteUrl: uploadForm.websiteUrl,
      city: uploadForm.city,
      district: uploadForm.district,
      specialOffer: uploadForm.specialOffer,
      specialOfferTa: uploadForm.specialOfferTa,
      placement: uploadForm.placement,
      status: 'pending_review',
      viewsCount: 0,
      clicksCount: 0,
      createdAt: new Date().toISOString()
    };

    setAds((prev) => [newAd, ...prev]);
    setUploadSuccessNotice(
      language === 'en'
        ? `Advertisement for "${newAd.businessName}" submitted successfully! It has entered the Admin Verification Queue and will appear on the Website & App News Feed upon admin approval.`
        : `"${newAd.businessName}" விளம்பரம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! நிர்வாகி சரிபார்த்து ஒப்புதல் அளித்தவுடன் வலைத்தளம் மற்றும் மொபைல் ஆப் செய்தி ஓடையில் தோன்றும்.`
    );

    // Reset some form inputs
    setUploadForm((prev) => ({
      ...prev,
      businessName: '',
      businessNameTa: '',
      adTitle: '',
      adTitleTa: '',
      description: '',
      descriptionTa: '',
      specialOffer: '',
      specialOfferTa: ''
    }));

    setTimeout(() => setUploadSuccessNotice(null), 7000);
    setActiveSubTab('admin_moderation'); // Jump to admin moderation so user can verify & approve right away
  };

  // Admin approves an ad
  const handleApproveAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? {
              ...ad,
              status: 'approved',
              approvedAt: new Date().toISOString(),
              adminReviewerName: 'M. Sivasankaran (Super Admin)'
            }
          : ad
      )
    );

    const approvedItem = ads.find((a) => a.id === adId);
    setModerationNotice(
      language === 'en'
        ? `Ad "${approvedItem?.businessName || adId}" has been APPROVED and is now live on the Website Main Page and Mobile App News Feed!`
        : `விளம்பரம் "${approvedItem?.businessName || adId}" நிர்வாகியால் அங்கீகரிக்கப்பட்டு நேரலை செய்யப்பட்டது!`
    );
    setTimeout(() => setModerationNotice(null), 5000);
  };

  // Admin rejects an ad
  const handleRejectAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? {
              ...ad,
              status: 'rejected',
              rejectionReason: rejectionRemark,
              adminReviewerName: 'M. Sivasankaran (Super Admin)'
            }
          : ad
      )
    );
    setRejectingAdId(null);
    setModerationNotice(
      language === 'en'
        ? `Ad rejected with feedback for member revision.`
        : `விளம்பரம் நிராகரிக்கப்பட்டு மாற்றுக் கருத்துக்கள் அனுப்பப்பட்டன.`
    );
    setTimeout(() => setModerationNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Business Directory & Classifieds"
        moduleNameTa="சமுதாய வணிக விளம்பரங்கள் & செய்தி ஓடை"
        badgeEn="Verified Merchant Marketplace"
        badgeTa="சரிபார்க்கப்பட்ட வணிக மையம்"
        subtitleEn="Empowering community entrepreneurs, doctors, silk master weavers, and member-run enterprises."
        subtitleTa="முதலியார் சமுதாய தொழில்முனைவோர், மருத்துவர்கள், பட்டு நெசவாளர்கள் மற்றும் வணிகர்களுக்கான மையம்."
        themeColor="orange"
        icon={Megaphone}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Card (Warm Orange / Coral Marketplace Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50/90 via-white to-amber-50/50 border border-orange-200/90 shadow-[0_4px_24px_rgba(234,88,12,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                <Megaphone className="w-5 h-5 text-white" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Community Business Advertisements & Verified News Feed'
                  : 'சமுதாய வணிக விளம்பரங்கள் & செய்தி ஓடை'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {language === 'en'
                ? 'Empowering Mudaliyar entrepreneurs, doctors, master silk weavers, lawyers, and businesses. Members can upload promotional advertisements which are verified by Sangam Admins before being published to the website main page and mobile app news feed.'
                : 'முதலியார் சமுதாய தொழில்முனைவோர், மருத்துவர்கள், பட்டு நெசவாளர்கள் மற்றும் வணிகர்கள் விளம்பரம் செய்யலாம். நிர்வாகி சரிபார்த்து ஒப்புதல் அளித்த பிறகே இணையதளம் மற்றும் மொபைல் ஆப்பில் தோன்றும்.'}
            </p>
          </div>

          {/* Verification Badge Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 text-center shadow-2xs">
              <span className="block text-xl font-black text-orange-700 font-display">
                {ads.filter((a) => a.status === 'approved').length}
              </span>
              <span className="text-xs text-stone-600 font-bold">
                {language === 'en' ? 'Live Listings' : 'நேரலை விளம்பரங்கள்'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-center shadow-2xs">
              <span className="block text-xl font-black text-amber-700 font-display">
                {pendingAds.length}
              </span>
              <span className="text-xs text-stone-600 font-bold">
                {language === 'en' ? 'Pending Review' : 'சரிபார்ப்புக்கு உள்ளது'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {uploadSuccessNotice && (
          <div className="mt-4 p-3.5 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{uploadSuccessNotice}</span>
          </div>
        )}

        {moderationNotice && (
          <div className="mt-4 p-3.5 text-xs rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-purple-600" />
            <span>{moderationNotice}</span>
          </div>
        )}

        {/* Member Subscription Status & Expiration Simulator */}
        <div className={`mt-4 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          memberSubscription.hasActiveSubscription
            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20'
            : 'border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/30'
        }`}>
          <div className="flex items-center gap-2">
            <Crown className={`w-4 h-4 ${memberSubscription.hasActiveSubscription ? 'text-amber-600' : 'text-rose-500'}`} />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {language === 'en' ? 'Member Business Subscription:' : 'உங்கள் வணிக சந்தா நிலை:'}
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                memberSubscription.hasActiveSubscription
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
              }`}>
                {memberSubscription.hasActiveSubscription
                  ? `${language === 'en' ? memberSubscription.planName : memberSubscription.planNameTa} (Active till ${memberSubscription.validUntil})`
                  : (language === 'en' ? 'Subscription Ended / Inactive - Ads Archived' : 'சந்தா முடிவடைந்தது - விளம்பரங்கள் மறைக்கப்பட்டுள்ளன')
                }
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {memberSubscription.hasActiveSubscription ? (
              <button
                type="button"
                id="btn-simulate-expire-sub"
                onClick={handleExpireSubscription}
                className="px-2.5 py-1 text-[11px] rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 font-medium cursor-pointer"
                title="Simulate subscription ending: marks member ads as archived and hides them from the public feed"
              >
                {language === 'en' ? '⚡ Simulate Subscription End' : '⚡ சந்தா முடிவை சோதிக்க'}
              </button>
            ) : (
              <button
                type="button"
                id="btn-purchase-sub-top"
                onClick={handlePurchaseSubscription}
                className="px-3.5 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Purchase Subscription & Show Ads in Website/App' : 'சந்தா பெற்று விளம்பரங்களை நேரலை செய்க'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="subtab-ads-feed"
              onClick={() => setActiveSubTab('feed')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubTab === 'feed'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Website & App News Feed' : 'செய்தி ஓடை & இணையதளம்'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {approvedAds.length}
              </span>
            </button>

            <button
              type="button"
              id="subtab-ads-upload"
              onClick={() => setActiveSubTab('upload')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubTab === 'upload'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Upload Business Advertisement' : 'விளம்பரம் பதிவேற்றுக'}</span>
              {!memberSubscription.hasActiveSubscription && (
                <Lock className="w-3 h-3 text-amber-500 ml-1" />
              )}
            </button>

            <button
              type="button"
              id="subtab-ads-archived"
              onClick={() => setActiveSubTab('archived')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubTab === 'archived'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-zinc-400" />
              <span>{language === 'en' ? 'Archived (Expired) Ads' : 'காலாவதியான விளம்பரங்கள்'}</span>
              {archivedAds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-600 font-bold text-[10px]">
                  {archivedAds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="subtab-ads-moderation"
              onClick={() => setActiveSubTab('admin_moderation')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubTab === 'admin_moderation'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'Admin Verification Desk' : 'நிர்வாகி சரிபார்ப்பு மையம்'}</span>
              {pendingAds.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[11px] rounded-full bg-rose-600 text-white font-bold animate-pulse">
                  {pendingAds.length} {language === 'en' ? 'Review' : 'ஆய்வு'}
                </span>
              )}
            </button>
          </div>

          {/* Layout Switcher (when viewing feed) */}
          {activeSubTab === 'feed' && (
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs">
              <button
                type="button"
                onClick={() => setFeedLayout('portal')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  feedLayout === 'portal'
                    ? 'bg-white dark:bg-zinc-700 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {language === 'en' ? 'Main Website Grid' : 'வலைத்தள கட்டமைப்பு'}
              </button>
              <button
                type="button"
                onClick={() => setFeedLayout('mobile_feed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  feedLayout === 'mobile_feed'
                    ? 'bg-white dark:bg-zinc-700 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                {language === 'en' ? 'Mobile App Feed' : 'மொபைல் ஆப் ஓடை'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUB-VIEW 1: NEWS FEED & MAIN WEBSITE ADS */}
      {activeSubTab === 'feed' && (
        <div className="space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                id="search-ads-input"
                placeholder={
                  language === 'en'
                    ? 'Search verified businesses by name, category, city, phone (e.g. 98401)...'
                    : 'வணிகப் பெயர், தொழில் வகை, நகரம் அல்லது எண் மூலம் தேடுக...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                id="filter-ads-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="all">{language === 'en' ? 'All Business Categories' : 'அனைத்து வணிக வகைகள்'}</option>
                {AD_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'en' ? cat.labelEn : cat.labelTa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Notice about Admin Verification */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              {language === 'en'
                ? 'Every advertisement displayed below has undergone strict administrative verification for Sangam membership, cultural relevance, and authentic business credentials.'
                : 'கீழே காண்பிக்கப்படும் அனைத்து விளம்பரங்களும் சமுதாய அங்கீகாரம் மற்றும் நிர்வாக சரிபார்ப்புக்குப் பின்னரே வெளியிடப்பட்டுள்ளன.'}
            </span>
          </div>

          {/* MAIN WEBSITE PORTAL VIEW */}
          {feedLayout === 'portal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {approvedAds.map((ad) => {
                const categoryObj = AD_CATEGORIES.find((c) => c.id === ad.category);
                return (
                  <div
                    key={ad.id}
                    id={`ad-card-${ad.id}`}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner Carousel (5 images auto-slide and loop) */}
                      <div className="relative h-52 w-full bg-zinc-950 overflow-hidden">
                        <AdImageCarousel
                          images={ad.images && ad.images.length > 0 ? ad.images : [ad.imageUrl]}
                          title={ad.businessName}
                          aspectRatioClass="h-52"
                        />
                        
                        {/* Badges on image */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-20 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {language === 'en' ? 'Admin Verified ✓' : 'நிர்வாகி சரிபார்க்கப்பட்டது ✓'}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                            {language === 'en' ? categoryObj?.labelEn : categoryObj?.labelTa}
                          </span>
                        </div>

                        {/* Location Tag */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-20 pointer-events-none">
                          <span className="flex items-center gap-1 font-medium drop-shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {ad.city}, {ad.district}
                          </span>
                          <span className="text-[11px] font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            {ad.memberCode}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                            {ad.businessName}
                          </h3>
                          <p className="text-xs text-purple-700 dark:text-purple-400 font-semibold mt-0.5">
                            {ad.businessNameTa}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-100 dark:border-zinc-750">
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {ad.adTitle}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-3">
                            {language === 'en' ? ad.description : ad.descriptionTa}
                          </p>
                        </div>

                        {/* Special Sangam Community Offer */}
                        {ad.specialOffer && (
                          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 dark:border-amber-700/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                            <Tag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">{language === 'en' ? 'Community Privilege / Discount:' : 'சங்க உறுப்பினர்களுக்கான சலுகை:'}</span>
                              <span className="text-[11px]">{language === 'en' ? ad.specialOffer : ad.specialOfferTa || ad.specialOffer}</span>
                            </div>
                          </div>
                        )}

                        {/* Submitting Member Credit */}
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                          <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {language === 'en' ? 'Proprietor / Member:' : 'உரிமையாளர் / உறுப்பினர்:'}{' '}
                            <strong className="text-zinc-700 dark:text-zinc-300">{ad.memberName}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Call to Actions */}
                    <div className="p-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${ad.phone.replace(/\s+/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{language === 'en' ? 'Call' : 'அழைக்க'}</span>
                        </a>

                        {ad.whatsapp && (
                          <a
                            href={`https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20saw%20your%20business%20listing%20on%20Mudaliyar%20Sangam%20Platform`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        {ad.websiteUrl && (
                          <a
                            href={ad.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                            title="Visit Website"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> {ad.viewsCount}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MousePointerClick className="w-3 h-3" /> {ad.clicksCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MOBILE APP FEED VIEW (Simulated Social News Feed for Mobile App Experience) */}
          {feedLayout === 'mobile_feed' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center text-xs text-amber-900 dark:text-amber-200">
                📱 {language === 'en' ? 'Mobile App Social Feed Preview — Live synchronization with Android/iOS Community App' : 'மொபைல் ஆப் செய்தி ஓடை மாதிரி — ஆப் திரையில் இவ்வாறு தெரியும்'}
              </div>

              {approvedAds.map((ad) => {
                const categoryObj = AD_CATEGORIES.find((c) => c.id === ad.category);
                const isLiked = likedAds[ad.id];
                return (
                  <div
                    key={ad.id}
                    id={`mobile-feed-item-${ad.id}`}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
                  >
                    {/* Feed Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {ad.businessName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {ad.businessName}
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          </div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                            {ad.memberName} • {ad.city}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {language === 'en' ? categoryObj?.labelEn : categoryObj?.labelTa}
                      </span>
                    </div>

                    {/* Media Post Carousel (5 images auto-slide and loop) */}
                    <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden">
                      <AdImageCarousel
                        images={ad.images && ad.images.length > 0 ? ad.images : [ad.imageUrl]}
                        title={ad.businessName}
                        aspectRatioClass="aspect-video"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleLike(ad.id)}
                            className={`flex items-center gap-1 text-xs font-medium ${
                              isLiked ? 'text-rose-600' : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                            <span>{isLiked ? (ad.clicksCount || 0) + 1 : ad.clicksCount || 0}</span>
                          </button>
                          <a
                            href={`https://wa.me/?text=Check out ${encodeURIComponent(ad.businessName)} on Mudaliyar Sangam`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Direct Contact Button */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${ad.phone.replace(/\s+/g, '')}`}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-700 text-white flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {ad.phone}
                          </a>
                        </div>
                      </div>

                      {/* Caption */}
                      <div>
                        <p className="text-xs text-zinc-900 dark:text-zinc-100">
                          <strong className="font-bold mr-1.5">{ad.adTitle}</strong>
                          {language === 'en' ? ad.description : ad.descriptionTa}
                        </p>
                      </div>

                      {/* Sangam Discount Box */}
                      {ad.specialOffer && (
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
                          ✨ <strong>{language === 'en' ? 'Member Offer:' : 'உறுப்பினர் சலுகை:'}</strong> {ad.specialOffer}
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

      {/* SUB-VIEW 2: MEMBER ADVERTISEMENT UPLOAD PORTAL */}
      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          {/* Active Subscription Status Banner & Testing Switcher */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-amber-900/10 to-transparent border border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className={`p-2 rounded-xl text-white ${memberSubscription.hasActiveSubscription ? 'bg-amber-600' : 'bg-zinc-500'}`}>
                {memberSubscription.hasActiveSubscription ? <Crown className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    {memberSubscription.hasActiveSubscription
                      ? (language === 'en' ? 'Active Business Member Subscription' : 'செயலில் உள்ள வணிக சந்தா')
                      : (language === 'en' ? 'No Active Business Subscription' : 'வணிக சந்தா செயலில் இல்லை')}
                  </h4>
                  {memberSubscription.hasActiveSubscription && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      {memberSubscription.planName}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {memberSubscription.hasActiveSubscription
                    ? (language === 'en'
                        ? `Valid until ${memberSubscription.validUntil} • Multi-Image Carousel: Up to 5 auto-sliding & looping images enabled`
                        : `${memberSubscription.validUntil} வரை செல்லுபடியாகும் • 5 படங்கள் கொண்ட தானியங்கி சுழல் பதாகை வசதி`)
                    : (language === 'en'
                        ? 'Business ad creation is restricted to verified subscribed members only.'
                        : 'வணிக விளம்பரம் சமர்ப்பிக்க வணிக சந்தா பெற்றிருக்க வேண்டும்.')}
                </p>
              </div>
            </div>

            {/* Test Toggle Button */}
            <button
              type="button"
              onClick={() =>
                setMemberSubscription((prev) => ({
                  ...prev,
                  hasActiveSubscription: !prev.hasActiveSubscription
                }))
              }
              className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
              <span>
                {memberSubscription.hasActiveSubscription
                  ? (language === 'en' ? 'Test Unsubscribed View' : 'சந்தா இல்லா தோற்றம் காண்க')
                  : (language === 'en' ? 'Activate Subscription (Test Mode)' : 'சந்தாவை செயல்படுத்து')}
              </span>
            </button>
          </div>

          {/* If member does NOT have active subscription, show the gated paywall */}
          {!memberSubscription.hasActiveSubscription ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-6 sm:p-8 text-center space-y-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-amber-600 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white">
                  {language === 'en'
                    ? 'Business Ads & Feed Only For Subscribed Members'
                    : 'வணிக விளம்பரங்கள் & செய்தி ஓடை சந்தா பெற்ற உறுப்பினர்களுக்கு மட்டுமே'}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {language === 'en'
                    ? 'To maintain authenticity, premium quality, and protect our community from spam, only registered business subscription members can post advertisements with 5 auto-sliding looping images, priority feed ranking, and direct member outreach.'
                    : 'சங்கத்தின் தரம் மற்றும் அங்கீகாரத்தைப் பேண, வணிக சந்தா பெற்ற உறுப்பினர்கள் மட்டுமே 5 புகைப்படங்கள் தானாக சுழலும் விளம்பரங்களை பதிவேற்ற இயலும்.'}
                </p>
              </div>

              {/* 3 Business Subscription Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 space-y-2">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Silver Business</span>
                  <div className="text-lg font-black text-zinc-900 dark:text-white">₹3,000 <span className="text-xs font-normal text-zinc-500">/ year</span></div>
                  <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <li>✓ Mobile App News Feed placement</li>
                    <li>✓ 2 Rotating banner images</li>
                    <li>✓ Admin Verification Badge</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 space-y-2 relative">
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold">
                    RECOMMENDED
                  </div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    Gold Business Patron
                  </span>
                  <div className="text-lg font-black text-amber-950 dark:text-amber-100">₹6,000 <span className="text-xs font-normal text-zinc-500">/ year</span></div>
                  <ul className="text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1 pt-2 border-t border-amber-200 dark:border-amber-800">
                    <li>✓ <strong>5 Images Auto-Slide & Loop Carousel</strong></li>
                    <li>✓ Website Main Page + Mobile News Feed</li>
                    <li>✓ Priority ranking in business searches</li>
                    <li>✓ Sangam member privilege discount badge</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 space-y-2">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">Platinum Corporate</span>
                  <div className="text-lg font-black text-purple-950 dark:text-purple-100">₹12,000 <span className="text-xs font-normal text-zinc-500">/ year</span></div>
                  <ul className="text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1 pt-2 border-t border-purple-200 dark:border-purple-800">
                    <li>✓ 5 Images Auto-Slide & Loop Carousel</li>
                    <li>✓ Top Header Hero Showcase banner</li>
                    <li>✓ Annual Conference Souvenir 1-page ad</li>
                    <li>✓ Direct WhatsApp lead inquiries</li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id="btn-subscribe-gold"
                  onClick={() =>
                    setMemberSubscription({
                      hasActiveSubscription: true,
                      tier: 'gold',
                      planName: 'Gold Business Patron',
                      planNameTa: 'தங்க வணிக புரவலர்',
                      validUntil: '31-Mar-2027',
                      maxImagesAllowed: 5
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all inline-flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {language === 'en'
                      ? 'Activate Gold Subscription & Enable 5-Image Carousel Upload'
                      : 'தங்க வணிக சந்தாவை செயல்படுத்தி 5 புகைப்பட சுழல் விளம்பரம் பதிவேற்றுக'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                    <PlusCircle className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {language === 'en'
                      ? 'Submit Business or Classified Advertisement'
                      : 'வணிக அல்லது தகவல் விளம்பரம் பதிவேற்றுக'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {language === 'en'
                    ? 'All advertisements submitted by verified members are automatically routed to the Sangam Admin Verification Desk. Once verified and approved, it will go live across the website main page and mobile app news feed.'
                    : 'உறுப்பினர்கள் பதிவேற்றும் விளம்பரங்கள் நிர்வாகி சரிபார்ப்புக்குப் பின்னரே இணையதளம் மற்றும் ஆப்பில் தோன்றும்.'}
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Submitter Credentials (Auto-detected from member session) */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Submitting Member Name' : 'உறுப்பினர் பெயர்'}</label>
                    <input
                      type="text"
                      value={uploadForm.memberName}
                      onChange={(e) => setUploadForm({ ...uploadForm, memberName: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Sangam Membership ID' : 'சங்க உறுப்பினர் எண்'}</label>
                    <input
                      type="text"
                      value={uploadForm.memberCode}
                      onChange={(e) => setUploadForm({ ...uploadForm, memberCode: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Business Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {language === 'en' ? 'Business / Trade Name (English) *' : 'வணிக நிறுவனப் பெயர் *'}
                    </label>
                    <input
                      type="text"
                      id="ad-biz-name"
                      placeholder="e.g. Kanchi Sri Varadaraja Silk House"
                      value={uploadForm.businessName}
                      onChange={(e) => setUploadForm({ ...uploadForm, businessName: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {language === 'en' ? 'Business Name in Tamil' : 'வணிகப் பெயர்'}
                    </label>
                    <input
                      type="text"
                      id="ad-biz-name-ta"
                      placeholder="எ.கா. காஞ்சி ஸ்ரீ வரதராஜ பட்டு மாளிகை"
                      value={uploadForm.businessNameTa}
                      onChange={(e) => setUploadForm({ ...uploadForm, businessNameTa: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Category & Placement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {language === 'en' ? 'Business Category *' : 'வணிக வகை *'}
                    </label>
                    <select
                      id="ad-biz-category"
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as AdCategory })}
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      {AD_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {language === 'en' ? cat.labelEn : cat.labelTa}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {language === 'en' ? 'Feed Placement Target' : 'விளம்பரம் வெளியிட வேண்டிய இடம்'}
                    </label>
                    <select
                      id="ad-biz-placement"
                      value={uploadForm.placement}
                      onChange={(e) => setUploadForm({ ...uploadForm, placement: e.target.value as AdPlacement })}
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      <option value="feed_and_main">
                        {language === 'en' ? 'Website Main Page + Mobile App News Feed' : 'இணையதள முதன்மைப் பக்கம் + மொபைல் ஆப் ஓடை'}
                      </option>
                      <option value="news_feed_only">
                        {language === 'en' ? 'Mobile App News Feed Only' : 'மொபைல் ஆப் செய்தி ஓடை மட்டும்'}
                      </option>
                      <option value="featured_banner">
                        {language === 'en' ? 'Featured Header Hero Showcase' : 'சிறப்பு பதாகை காட்சி'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Ad Headline & Descriptions */}
                <div>
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Campaign Headline / Ad Title *' : 'விளம்பர தலைப்பு / சிறப்பம்சம் *'}
                  </label>
                  <input
                    type="text"
                    id="ad-biz-title"
                    placeholder="e.g. Pure Mulberry Silk Bridal Sarees Direct From Kanchipuram Looms"
                    value={uploadForm.adTitle}
                    onChange={(e) => setUploadForm({ ...uploadForm, adTitle: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Promotional Details & Offer Description' : 'முழு விவரங்கள் & சலுகைகள்'}
                  </label>
                  <textarea
                    id="ad-biz-desc"
                    rows={3}
                    placeholder="Describe your services, products, heritage, special orders, and quality guarantees..."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Community Privilege / Special Discount */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700">
                  <label className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">
                    🎁 {language === 'en' ? 'Exclusive Privilege / Discount for Sangam Members' : 'சங்க அங்கத்தினர்களுக்கான பிரத்யேக சலுகை / தள்ளுபடி'}
                  </label>
                  <input
                    type="text"
                    id="ad-biz-offer"
                    placeholder="e.g. 15% special discount on presenting Sangam Membership card or free first consultation"
                    value={uploadForm.specialOffer}
                    onChange={(e) => setUploadForm({ ...uploadForm, specialOffer: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-amber-200 dark:border-amber-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* 5-Image Carousel Builder (Auto slide & loop in feed) */}
                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>
                        {language === 'en'
                          ? 'Ad Image Carousel Gallery'
                          : 'விளம்பர புகைப்படங்கள்'}
                      </span>
                    </label>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold">
                      {uploadForm.images.length} / 5 {language === 'en' ? 'Images Added' : 'படங்கள் சேர்க்கப்பட்டது'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {language === 'en'
                      ? 'Images will automatically slide every 3.5 seconds and loop continuously on the website main page and mobile app news feed.'
                      : 'இந்த புகைப்படங்கள் வலைத்தளம் மற்றும் மொபைல் ஆப்பில் 3.5 வினாடிக்கு ஒருமுறை தானாக சுழன்று தொடர்ச்சியாகக் காட்சிப்படுத்தப்படும்.'}
                  </p>

                  {/* Thumbnail Gallery of current slide images */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                    {uploadForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border-2 border-purple-400 dark:border-purple-600 bg-zinc-900 aspect-video group"
                      >
                        <img src={imgUrl} alt={`Slide ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px] font-bold">
                          Slide {idx + 1}
                        </span>
                        {uploadForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setUploadForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx)
                              }))
                            }
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                            title="Remove slide"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Preset Banner Quick Add Buttons */}
                  {uploadForm.images.length < 5 && (
                    <div className="space-y-2 pt-2 border-t border-purple-200/60 dark:border-purple-800/60">
                      <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block">
                        {language === 'en' ? 'Click to add high-res preset samples to your carousel:' : 'மாதிரி புகைப்படங்களைச் சேர்க்க கிளிக் செய்க:'}
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_BANNER_IMAGES.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              if (uploadForm.images.length < 5 && !uploadForm.images.includes(preset.url)) {
                                setUploadForm((prev) => ({
                                  ...prev,
                                  images: [...prev.images, preset.url]
                                }));
                              }
                            }}
                            disabled={uploadForm.images.includes(preset.url)}
                            className={`p-1 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition-all ${
                              uploadForm.images.includes(preset.url)
                                ? 'opacity-40 border-zinc-300 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-500 bg-white dark:bg-zinc-800'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                            <span className="truncate">{preset.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Image URL Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Or paste external image URL (https://...)"
                          value={uploadForm.newImageUrlInput}
                          onChange={(e) => setUploadForm({ ...uploadForm, newImageUrlInput: e.target.value })}
                          className="flex-1 p-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (uploadForm.newImageUrlInput && uploadForm.images.length < 5) {
                              setUploadForm((prev) => ({
                                ...prev,
                                images: [...prev.images, prev.newImageUrlInput],
                                newImageUrlInput: ''
                              }));
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold"
                        >
                          + Add Slide
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {language === 'en' ? 'Primary Mobile Phone *' : 'கைபேசி எண் *'}
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98401 22345"
                      value={uploadForm.phone}
                      onChange={(e) => setUploadForm({ ...uploadForm, phone: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>

              <div>
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                  {language === 'en' ? 'WhatsApp Number' : 'வாட்ஸ்அப் எண்'}
                </label>
                <input
                  type="text"
                  placeholder="+91 98401 22345"
                  value={uploadForm.whatsapp}
                  onChange={(e) => setUploadForm({ ...uploadForm, whatsapp: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                  {language === 'en' ? 'City / Town' : 'நகரம்'}
                </label>
                <input
                  type="text"
                  placeholder="Kanchipuram, Chennai..."
                  value={uploadForm.city}
                  onChange={(e) => setUploadForm({ ...uploadForm, city: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            {/* Verification Guarantee Check */}
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{language === 'en' ? 'Mandatory Content Verification Policy' : 'நிர்வாக சரிபார்ப்புக் கொள்கை'}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'In compliance with Sangam community guidelines, all uploaded promotional material is reviewed by an authorized Admin before being broadcast to the news feed. Offensive, deceptive, or unauthorized commercial solicitations are strictly prohibited.'
                  : 'சங்க நெறிமுறைகளின்படி சமர்ப்பிக்கப்பட்ட விளம்பரம் நிர்வாகியால் சரிபார்க்கப்பட்ட பிறகே அனைவருக்கும் காட்சிப்படுத்தப்படும்.'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                id="btn-submit-business-ad"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Submit Advertisement for Admin Approval' : 'நிர்வாக ஒப்புதலுக்கு சமர்ப்பிக்க'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )}

  {/* SUB-VIEW: ARCHIVED (SUBSCRIPTION EXPIRED) ADS */}
  {activeSubTab === 'archived' && (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-zinc-800 text-white shadow-xs">
            <Archive className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              {language === 'en'
                ? 'Archived Advertisements (Subscription Expired)'
                : 'காலாவதியான & ஆவணப்படுத்தப்பட்ட விளம்பரங்கள்'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {language === 'en'
                ? 'If a member subscription ends, all their advertisements are archived and hidden from the website & mobile app. Once renewed, they immediately show live again.'
                : 'சந்தா முடிவடைந்ததும் விளம்பரங்கள் மறைக்கப்பட்டு ஆவணப்படுத்தப்படும். சந்தா புதுப்பித்ததும் மீண்டும் நேரலையாகக் காட்டப்படும்.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePurchaseSubscription}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Crown className="w-4 h-4" />
          <span>{language === 'en' ? 'Purchase Subscription & Unarchive All' : 'சந்தா பெற்று விளம்பரங்களை நேரலை செய்க'}</span>
        </button>
      </div>

      {archivedAds.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Archive className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {language === 'en' ? 'No Archived Advertisements' : 'ஆவணப்படுத்தப்பட்ட விளம்பரங்கள் ஏதுமில்லை'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {language === 'en'
              ? 'All member subscriptions are currently active and their business advertisements are live in the website and app feed. You can click "Simulate Subscription End" above to test the archiving behavior.'
              : 'அனைத்து வணிக சந்தாக்களும் செயலில் உள்ளன. சோதனை செய்ய மேலே உள்ள "Simulate Subscription End" பொத்தானைப் பயன்படுத்தலாம்.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archivedAds.map((ad) => (
            <div
              key={ad.id}
              className="p-4 rounded-2xl border border-rose-200 dark:border-rose-950 bg-white dark:bg-zinc-900 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{ad.businessName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      ARCHIVED (HIDDEN)
                    </span>
                  </div>
                  <span className="text-xs text-purple-700 dark:text-purple-400 block">{ad.businessNameTa}</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Member: {ad.memberName} ({ad.memberCode})
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {ad.description}
              </p>

              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-800 dark:text-rose-300 flex items-center justify-between">
                <span>Status: Subscription Expired (Hidden from Website/App)</span>
                <span className="font-mono text-[10px]">{ad.archivedAt ? new Date(ad.archivedAt).toLocaleDateString() : 'Expired'}</span>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handlePurchaseSubscription}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Renew Subscription & Restore to Feed' : 'சந்தா புதுப்பித்து விளம்பரத்தை நேரலை செய்க'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

      {/* SUB-VIEW 3: ADMIN VERIFICATION & MODERATION DESK */}
      {activeSubTab === 'admin_moderation' && (
        <div className="space-y-6">
          {/* Admin Verification Header */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? 'Admin Content Verification & News Feed Moderation' : 'நிர்வாகி விளம்பர சரிபார்ப்பு & செய்தி ஓடை அங்கீகாரம்'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'en'
                    ? 'Review member uploaded advertisements. Once verified, click "Approve" to publish them to the website main page and app news feed.'
                    : 'உறுப்பினர்கள் அனுப்பிய விளம்பரங்களை ஆய்வு செய்து, சரிபார்த்து வலைத்தளத்தில் வெளியிடவும்.'}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 self-start sm:self-auto">
              {pendingAds.length} {language === 'en' ? 'Items Pending Review' : 'விளம்பரங்கள் ஆய்வுக்கு உள்ளன'}
            </span>
          </div>

          {/* Pending Ads Queue */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {language === 'en' ? 'Pending Review Queue' : 'அனுமதிக்கு காத்திருப்பவை'}
            </h4>

            {pendingAds.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-300 dark:border-zinc-700 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {language === 'en'
                    ? 'All member business advertisements have been verified and approved!'
                    : 'அனைத்து விளம்பரங்களும் சரிபார்க்கப்பட்டு வெளியிடப்பட்டுவிட்டன!'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('upload')}
                  className="text-xs text-purple-700 dark:text-purple-400 underline font-semibold"
                >
                  {language === 'en' ? 'Upload another advertisement to test approval workflow' : 'மற்றொரு விளம்பரம் பதிவேற்றி சோதிக்கவும்'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAds.map((ad) => {
                  const categoryObj = AD_CATEGORIES.find((c) => c.id === ad.category);
                  return (
                    <div
                      key={ad.id}
                      id={`pending-ad-${ad.id}`}
                      className="rounded-2xl border-2 border-amber-300 dark:border-amber-800/80 bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-4"
                    >
                      {/* Top Header of Pending Ad */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {ad.businessName}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {language === 'en' ? 'Pending Admin Approval' : 'ஒப்புதலுக்கு காத்திருக்கிறது'}
                              </span>
                            </div>
                            <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
                              {ad.businessNameTa}
                            </p>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                              {language === 'en' ? 'Uploaded by Member:' : 'பதிவேற்றிய உறுப்பினர்:'}{' '}
                              <strong>{ad.memberName}</strong> ({ad.memberCode}) • {ad.city}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium self-start">
                          {language === 'en' ? categoryObj?.labelEn : categoryObj?.labelTa}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div>
                            <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Headline / Title' : 'விளம்பர தலைப்பு'}:</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{ad.adTitle}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Description' : 'விளக்க உரை'}:</span>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{ad.description}</p>
                          </div>
                        </div>

                        <div className="space-y-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">{language === 'en' ? 'Contact Phone:' : 'கைபேசி எண்:'}</span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">{ad.phone}</span>
                          </div>
                          {ad.specialOffer && (
                            <div>
                              <span className="text-zinc-500 block mb-0.5">{language === 'en' ? 'Member Discount:' : 'சங்க சலுகை:'}</span>
                              <span className="font-semibold text-amber-700 dark:text-amber-300">{ad.specialOffer}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">{language === 'en' ? 'Target Destination:' : 'வெளியிடும் இடம்:'}</span>
                            <span className="text-purple-700 dark:text-purple-300 font-semibold">{ad.placement}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Decision Actions */}
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Member verification ID confirmed in database' : 'உறுப்பினர் தகுதி தரவுத்தளத்தில் சரிபார்க்கப்பட்டது'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Reject Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (rejectingAdId === ad.id) {
                                handleRejectAd(ad.id);
                              } else {
                                setRejectingAdId(ad.id);
                              }
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                          >
                            <XCircle className="w-3.5 h-3.5 inline mr-1" />
                            {rejectingAdId === ad.id
                              ? (language === 'en' ? 'Confirm Reject' : 'நிராகரிப்பை உறுதிசெய்')
                              : (language === 'en' ? 'Reject / Revise' : 'நிராகரி / திருத்து')}
                          </button>

                          {/* Approve Button */}
                          <button
                            type="button"
                            id={`btn-approve-ad-${ad.id}`}
                            onClick={() => handleApproveAd(ad.id)}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Approve & Publish to News Feed' : 'ஒப்புதல் அளித்து வெளியிடவும்'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Rejection reason prompt if open */}
                      {rejectingAdId === ad.id && (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-xs space-y-2">
                          <label className="font-semibold text-rose-900 dark:text-rose-200 block">
                            {language === 'en' ? 'Specify Feedback / Reason for Submitting Member:' : 'உறுப்பினருக்கு அனுப்ப வேண்டிய திருத்தக் கருத்துக்கள்:'}
                          </label>
                          <input
                            type="text"
                            value={rejectionRemark}
                            onChange={(e) => setRejectionRemark(e.target.value)}
                            className="w-full p-2 rounded border border-rose-300 dark:border-rose-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Approved Ads in this session */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {language === 'en' ? 'Active Approved Ads in News Feed' : 'செயல்பாட்டில் உள்ள அங்கீகரிக்கப்பட்ட விளம்பரங்கள்'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ads.filter((a) => a.status === 'approved').map((ad) => (
                <div key={ad.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="font-semibold text-zinc-900 dark:text-white block truncate">{ad.businessName}</span>
                    <span className="text-[11px] text-zinc-500">{ad.city} • {ad.phone}</span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Live ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
