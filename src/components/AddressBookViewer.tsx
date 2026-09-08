import React, { useState, useMemo } from 'react';
import {
  BookUser,
  Users,
  Search,
  Lock,
  Unlock,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  UserCheck,
  Building2,
  Sparkles,
  Filter,
  Info,
  UserPlus,
  FileSpreadsheet,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  GitBranch,
  X
} from 'lucide-react';
import {
  Language,
  MemberAddressEntry,
  AddressAccessRequest,
  AddressPrivacyLevel,
  FamilyMemberDetail
} from '../types';
import {
  INITIAL_ADDRESS_BOOK,
  INITIAL_ACCESS_REQUESTS,
  matchPhoneSearch,
  exportAddressBookToExcel,
  getAddressBookAnalytics,
  loadAddressBook,
  saveAddressBook
} from '../data/addressBookData';
import { AddressBookAnalyticsCards } from './address-book/AddressBookAnalyticsCards';
import { MemberCard } from './address-book/MemberCard';
import { FamilyMemberModal } from './address-book/FamilyMemberModal';
import { MemberRegistrationForm } from './address-book/MemberRegistrationForm';
import { ModuleTopNav } from './ModuleTopNav';

interface AddressBookViewerProps {
  language: Language;
  searchQuery?: string;
  onBackToHome?: () => void;
}

export const AddressBookViewer: React.FC<AddressBookViewerProps> = ({
  language,
  searchQuery: externalSearchQuery = '',
  onBackToHome,
}) => {
  const [addressList, setAddressList] = useState<MemberAddressEntry[]>(loadAddressBook);
  const [accessRequests, setAccessRequests] = useState<AddressAccessRequest[]>(INITIAL_ACCESS_REQUESTS);
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'analytics' | 'requests' | 'register'>('directory');

  // Super Admin Role & Excel Export State
  const [activeRole, setActiveRole] = useState<'member' | 'super_admin'>('member');
  const [exportingExcel, setExportingExcel] = useState<boolean>(false);
  const [exportSuccessNotice, setExportSuccessNotice] = useState<string | null>(null);

  // Search & Filter States
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPrivacyFilter, setSelectedPrivacyFilter] = useState<string>('all');

  // Current user's own privacy setting toggle
  const [currentUserPrivacy, setCurrentUserPrivacy] = useState<AddressPrivacyLevel>('request_only');

  // Request Access Modal State
  const [requestingTarget, setRequestingTarget] = useState<MemberAddressEntry | null>(null);
  const [requestReason, setRequestReason] = useState<string>(
    'Wedding invitation dispatch and community coordination'
  );
  const [requestSuccessNotice, setRequestSuccessNotice] = useState<string | null>(null);

  // Family Management Modal State
  const [familyModalTarget, setFamilyModalTarget] = useState<MemberAddressEntry | null>(null);
  const [familySyncNotice, setFamilySyncNotice] = useState<string | null>(null);

  // Registration Notice
  const [registerSuccessNotice, setRegisterSuccessNotice] = useState<string | null>(null);

  // Calculate live analytics
  const analytics = useMemo(() => getAddressBookAnalytics(addressList), [addressList]);

  const effectiveSearch = (externalSearchQuery || localSearch).trim().toLowerCase();

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return addressList.filter((m) => {
      const matchesPhone = matchPhoneSearch(m.phone, effectiveSearch);
      const matchesSearch =
        !effectiveSearch ||
        m.fullName.toLowerCase().includes(effectiveSearch) ||
        m.fullNameTa?.includes(effectiveSearch) ||
        m.city.toLowerCase().includes(effectiveSearch) ||
        m.district.toLowerCase().includes(effectiveSearch) ||
        (m.branch && m.branch.toLowerCase().includes(effectiveSearch)) ||
        (m.occupation && m.occupation.toLowerCase().includes(effectiveSearch)) ||
        (m.bloodGroup && m.bloodGroup.toLowerCase().includes(effectiveSearch)) ||
        (m.email && m.email.toLowerCase().includes(effectiveSearch)) ||
        m.membershipCode.toLowerCase().includes(effectiveSearch) ||
        // Also match family member names
        m.familyMembers?.some((f) => f.fullName.toLowerCase().includes(effectiveSearch)) ||
        matchesPhone;

      const matchesDistrict =
        selectedDistrict === 'all' || m.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchesBranch =
        selectedBranch === 'all' || (m.branch && m.branch.toLowerCase() === selectedBranch.toLowerCase());

      const matchesCity =
        selectedCity === 'all' || m.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesPrivacy =
        selectedPrivacyFilter === 'all' ||
        (selectedPrivacyFilter === 'public' && m.privacyLevel === 'public_to_members') ||
        (selectedPrivacyFilter === 'unlocked' &&
          (m.privacyLevel === 'public_to_members' || m.isUnlockedForViewer)) ||
        (selectedPrivacyFilter === 'masked' &&
          m.privacyLevel === 'request_only' &&
          !m.isUnlockedForViewer);

      return matchesSearch && matchesDistrict && matchesBranch && matchesCity && matchesPrivacy;
    });
  }, [
    addressList,
    effectiveSearch,
    selectedDistrict,
    selectedBranch,
    selectedCity,
    selectedPrivacyFilter,
  ]);

  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'pending').length;

  // Handle Excel Export
  const handleExcelExport = async () => {
    try {
      setExportingExcel(true);
      const res = await exportAddressBookToExcel(addressList);
      setExportSuccessNotice(
        language === 'en'
          ? `Full Member & Family Address Database exported to Excel (${res.count} records in "${res.filename}").`
          : `முழு முகவரி தரவுத்தளம் வெற்றிகரமாக எக்செல் (.xlsx) கோப்பாக பதிவிறக்கப்பட்டது (${res.count} பதிவுகள்).`
      );
      setTimeout(() => setExportSuccessNotice(null), 6000);
    } catch (err) {
      console.error(err);
      alert('Failed to generate Excel export.');
    } finally {
      setExportingExcel(false);
    }
  };

  // Handle request submission
  const handleSendRequest = () => {
    if (!requestingTarget) return;

    setAddressList((prev) =>
      prev.map((item) =>
        item.id === requestingTarget.id ? { ...item, requestStatus: 'pending' } : item
      )
    );

    const newReq: AddressAccessRequest = {
      id: `req-${Date.now()}`,
      requesterId: 'mem-current-user',
      requesterName: 'M. Sivasankaran Mudaliyar (You)',
      requesterPhone: '+91 98765 43210',
      requesterNativePlace: 'Kanchipuram',
      targetMemberId: requestingTarget.id,
      targetMemberName: requestingTarget.fullName,
      requestReason: requestReason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAccessRequests((prev) => [newReq, ...prev]);
    setRequestSuccessNotice(
      language === 'en'
        ? `Request sent to ${requestingTarget.fullName}. Contact details will unmask upon approval.`
        : `${requestingTarget.fullName} அவர்களுக்கு கோரிக்கை அனுப்பப்பட்டது. ஒப்புதல் அளித்தவுடன் முகவரி காண்பிக்கப்படும்.`
    );
    setRequestingTarget(null);

    setTimeout(() => {
      setRequestSuccessNotice(null);
    }, 4500);
  };

  // Handle approving an incoming request
  const handleApproveRequest = (requestId: string) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'approved', approvedAt: new Date().toISOString() }
          : req
      )
    );
  };

  // Handle rejecting an incoming request
  const handleRejectRequest = (requestId: string) => {
    setAccessRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'rejected' } : req))
    );
  };

  // Handle registering a new member
  const handleRegisterMember = (newEntry: MemberAddressEntry) => {
    setAddressList((prev) => {
      const updated = [newEntry, ...prev];
      saveAddressBook(updated);
      return updated;
    });
    setRegisterSuccessNotice(
      language === 'en'
        ? `Member "${newEntry.fullName}" registered successfully and saved into the Address Book!`
        : `உறுப்பினர் "${newEntry.fullName}" முகவரி புத்தகத்தில் வெற்றிகரமாக சேர்க்கப்பட்டார்!`
    );
    setActiveSubTab('directory');
    setTimeout(() => {
      setRegisterSuccessNotice(null);
    }, 5000);
  };

  // Handle saving family details for a member
  const handleSaveFamily = (updatedMemberId: string, updatedFamily: FamilyMemberDetail[]) => {
    setAddressList((prev) => {
      const updated = prev.map((m) => (m.id === updatedMemberId ? { ...m, familyMembers: updatedFamily } : m));
      saveAddressBook(updated);
      return updated;
    });
    setFamilySyncNotice(
      language === 'en'
        ? 'Family details saved and synchronized with Member record and Family Tree!'
        : 'குடும்ப விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டு குடும்ப மரத்தில் இணைக்கப்பட்டது!'
    );
    setTimeout(() => setFamilySyncNotice(null), 5000);
  };

  const districtsList = [
    'all',
    'Chennai',
    'Kanchipuram',
    'Vellore',
    'Coimbatore',
    'Tiruvannamalai',
    'Madurai',
    'Cuddalore',
    'Salem',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Address Book & Census Directory"
        moduleNameTa="முகவரி புத்தகம் & மக்கள் தொகை கணக்கெடுப்பு"
        badgeEn="Verified Community Database"
        badgeTa="சரிபார்க்கப்பட்ட சமூக அடைவு"
        subtitleEn="Census database of verified Mudaliyar families, native towns, blood donors, and professional networks."
        subtitleTa="சரிபார்க்கப்பட்ட முதலியார் குடும்பங்கள், பூர்வீகம், இரத்த தானம் மற்றும் தொழில்சார் வழிகாட்டல் அடைவு."
        themeColor="amber"
        icon={BookUser}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Section (Premium Amber/Gold Theme) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#faf6ed] via-white to-[#f5eedc] border border-[#e8dcbb] shadow-[0_4px_24px_rgba(184,134,11,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8860b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2.5 rounded-2xl bg-[#b8860b] text-white shadow-xs">
                <BookUser className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Members Address Book & Directory'
                  : 'அங்கத்தினர் முகவரி புத்தகம் & அடைவு'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] text-xs font-bold shadow-2xs">
                <Users className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                <span>
                  {language === 'en'
                    ? `Total Community Strength: ${analytics.totalCombinedPopulation} (${analytics.totalPrimaryMembers} Heads + ${analytics.totalFamilyMembers} Family)`
                    : `மொத்த சமூக பலம்: ${analytics.totalCombinedPopulation} (${analytics.totalPrimaryMembers} தலைவர்கள் + ${analytics.totalFamilyMembers} குடும்பத்தினர்)`}
                </span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {language === 'en'
                ? 'Search members and view verified details including Age, Profession, Blood Group, Mobile, Email, and Family Members (Wife, Son, Daughter). Filter by District, City, or Branch.'
                : 'உறுப்பினர்களின் வயது, தொழில், இரத்த வகை, கைபேசி எண், மின்னஞ்சல் மற்றும் குடும்ப உறுப்பினர்கள் (மனைவி, மகன், மகள்) விவரங்களை காண்க. மாவட்டம், நகரம் அல்லது கிளை வாரியாக வடிகட்டலாம்.'}
            </p>
          </div>

          {/* Current User's Own Privacy Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                  {language === 'en' ? 'My Address Privacy Setting' : 'எனது முகவரி பாதுகாப்பு நிலை'}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {currentUserPrivacy === 'public_to_members'
                    ? language === 'en'
                      ? 'Public to Verified Members'
                      : 'சரிபார்க்கப்பட்ட அனைவருக்கும் தெரியும்'
                    : language === 'en'
                    ? 'Approval Required (Masked)'
                    : 'கோரிக்கைக்குப் பின்னரே அனுமதி'}
                </span>
              </div>
            </div>

            <button
              id="btn-toggle-my-privacy"
              type="button"
              onClick={() =>
                setCurrentUserPrivacy((prev) =>
                  prev === 'public_to_members' ? 'request_only' : 'public_to_members'
                )
              }
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
                currentUserPrivacy === 'public_to_members'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {currentUserPrivacy === 'public_to_members' ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Switch to Masked' : 'மறைக்க மாற்றுக'}
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Switch to Public' : 'அனைவருக்கும் காண்பி'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Notices */}
        {exportSuccessNotice && (
          <div className="mt-4 p-3.5 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{exportSuccessNotice}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
              Excel (.xlsx) Ready
            </span>
          </div>
        )}
        {requestSuccessNotice && (
          <div className="mt-4 p-3 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{requestSuccessNotice}</span>
          </div>
        )}
        {familySyncNotice && (
          <div className="mt-4 p-3 text-xs rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-purple-600" />
            <span>{familySyncNotice}</span>
          </div>
        )}
        {registerSuccessNotice && (
          <div className="mt-4 p-3 text-xs rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{registerSuccessNotice}</span>
          </div>
        )}

        {/* Super Admin Perspective & Excel Export Control Bar */}
        <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/5 border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              {language === 'en' ? 'Viewer Role Mode:' : 'பயனர் பார்வை நிலை:'}
            </span>
            <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-300 dark:border-zinc-700">
              <button
                type="button"
                id="role-btn-member"
                onClick={() => setActiveRole('member')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeRole === 'member'
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
                }`}
              >
                {language === 'en' ? 'Verified Member' : 'சரிபார்க்கப்பட்ட உறுப்பினர்'}
              </button>
              <button
                type="button"
                id="role-btn-superadmin"
                onClick={() => setActiveRole('super_admin')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeRole === 'super_admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                {language === 'en' ? 'Super Admin' : 'சூப்பர் அட்மின்'}
              </button>
            </div>

            {activeRole === 'super_admin' && (
              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                {language === 'en'
                  ? '• Full unmasked database view & census access'
                  : '• முழு முகவரி விவரங்கள் பார்வை அனுமதி'}
              </span>
            )}
          </div>

          {/* Super Admin Excel Export Button */}
          {activeRole === 'super_admin' ? (
            <button
              type="button"
              id="btn-export-excel-db"
              onClick={handleExcelExport}
              disabled={exportingExcel}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-xs transition-all whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>
                {exportingExcel
                  ? language === 'en'
                    ? 'Generating Excel Workbook...'
                    : 'எக்செல் உருவாக்கப்படுகிறது...'
                  : language === 'en'
                  ? `Export All Members & Families to Excel (.xlsx)`
                  : `முழு முகவரி தரவுத்தளம் (Excel .xlsx) பதிவிறக்கு`}
              </span>
            </button>
          ) : (
            <span className="text-[11px] text-zinc-500 italic">
              {language === 'en'
                ? 'Switch to Super Admin to export directory with family details'
                : 'குடும்ப விவரங்களுடன் எக்செல் தரவிறக்க சூப்பர் அட்மின் நிலைக்கு மாறவும்'}
            </span>
          )}
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            id="subtab-directory"
            onClick={() => setActiveSubTab('directory')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'directory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
            }`}
          >
            <BookUser className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Search Address Book' : 'முகவரி புத்தகத்தில் தேடுக'}</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
              {filteredMembers.length}
            </span>
          </button>

          <button
            type="button"
            id="subtab-analytics"
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'District, City & Branch Counts' : 'மாவட்ட, நகர & கிளை கணக்கெடுப்பு'}</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-100 font-bold">
              {analytics.totalCombinedPopulation}
            </span>
          </button>

          <button
            type="button"
            id="subtab-requests"
            onClick={() => setActiveSubTab('requests')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'requests'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Incoming Access Requests' : 'அனுமதி கோரிக்கைகள்'}</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                {pendingRequestsCount} new
              </span>
            )}
          </button>

          <button
            type="button"
            id="subtab-register"
            onClick={() => setActiveSubTab('register')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'register'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '+ Register Member Demo' : '+ புதிய உறுப்பினர் பதிவு'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DIRECTORY SEARCH & LIST */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Quick Stats Ribbon */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                {language === 'en' ? 'Community Census:' : 'சமூக கணக்கெடுப்பு:'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-zinc-800 text-amber-900 dark:text-amber-200 font-semibold border border-amber-200 dark:border-zinc-700">
                {analytics.totalPrimaryMembers} {language === 'en' ? 'Primary Heads' : 'தலைவர்கள்'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-semibold border border-purple-200 dark:border-purple-800">
                +{analytics.totalFamilyMembers} {language === 'en' ? 'Family Members' : 'குடும்பத்தினர்'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800">
                = {analytics.totalCombinedPopulation} {language === 'en' ? 'Total Strength' : 'மொத்த உறுப்பினர்கள்'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('analytics')}
              className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'View District & Branch Analytics →' : 'மாவட்ட & கிளை விவரங்கள் →'}</span>
            </button>
          </div>

          {/* Filter and Search Controls */}
          <div className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="address-search-input"
                  type="text"
                  placeholder={
                    language === 'en'
                      ? 'Search by Name, Mobile Number, Profession, Blood Group, Branch, City, District...'
                      : 'பெயர், கைபேசி எண், தொழில், இரத்த வகை, கிளை, நகரம் மூலம் தேடுக...'
                  }
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium"
                />
              </div>

              {/* District Filter */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Filter className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <select
                  id="address-district-filter"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="text-xs py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">{language === 'en' ? 'All Districts' : 'அனைத்து மாவட்டங்கள்'}</option>
                  {districtsList
                    .filter((d) => d !== 'all')
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>

                {/* Privacy Filter */}
                <select
                  id="address-privacy-filter"
                  value={selectedPrivacyFilter}
                  onChange={(e) => setSelectedPrivacyFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">{language === 'en' ? 'All Privacy Tiers' : 'அனைத்து நிலைகளும்'}</option>
                  <option value="unlocked">{language === 'en' ? 'Unlocked / Viewable' : 'பார்க்கக்கூடியவை'}</option>
                  <option value="masked">{language === 'en' ? 'Masked (Request Required)' : 'மறைக்கப்பட்டவை'}</option>
                  <option value="public">{language === 'en' ? 'Publicly Shared' : 'பொதுவானவை'}</option>
                </select>
              </div>
            </div>

            {/* Quick Mobile Number Search Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-amber-600" />
                {language === 'en' ? 'Quick Mobile Search:' : 'கைபேசி எண் மூலம் தேடுக:'}
              </span>
              {['98401', '94440', '98423', '98940', '98418', '97890', '94432'].map((phoneSample) => (
                <button
                  key={phoneSample}
                  type="button"
                  onClick={() => setLocalSearch(phoneSample)}
                  className={`px-2 py-0.5 rounded-md border font-mono text-[11px] transition-all flex items-center gap-1 ${
                    localSearch === phoneSample
                      ? 'bg-amber-600 text-white border-amber-600 font-bold'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {phoneSample}
                </button>
              ))}
              {(localSearch || selectedDistrict !== 'all' || selectedBranch !== 'all' || selectedCity !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSelectedDistrict('all');
                    setSelectedBranch('all');
                    setSelectedCity('all');
                  }}
                  className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold underline ml-1"
                >
                  {language === 'en' ? 'Reset All Filters' : 'அனைத்து வடிகட்டிகளையும் நீக்கு'}
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(selectedDistrict !== 'all' || selectedBranch !== 'all' || selectedCity !== 'all') && (
            <div className="flex items-center gap-2 flex-wrap text-xs p-2 rounded-lg bg-amber-50 dark:bg-zinc-850 border border-amber-200 dark:border-zinc-700">
              <span className="font-bold text-amber-900 dark:text-amber-200">{language === 'en' ? 'Filtered by:' : 'வடிகட்டப்பட்டுள்ளது:'}</span>
              {selectedDistrict !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 font-semibold">
                  District: {selectedDistrict}
                  <button onClick={() => setSelectedDistrict('all')} className="text-zinc-400 hover:text-rose-600">×</button>
                </span>
              )}
              {selectedBranch !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 font-semibold">
                  Branch: {selectedBranch}
                  <button onClick={() => setSelectedBranch('all')} className="text-zinc-400 hover:text-rose-600">×</button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 font-semibold">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity('all')} className="text-zinc-400 hover:text-rose-600">×</button>
                </span>
              )}
            </div>
          )}

          {/* Members List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((member) => {
              const matchesMobile = Boolean(
                effectiveSearch && matchPhoneSearch(member.phone, effectiveSearch)
              );

              return (
                <MemberCard
                  key={member.id}
                  language={language}
                  member={member}
                  activeRole={activeRole}
                  matchesMobileSearch={matchesMobile}
                  effectiveSearch={effectiveSearch}
                  onRequestAccess={(target) => setRequestingTarget(target)}
                  onOpenFamilyModal={(target) => setFamilyModalTarget(target)}
                />
              );
            })}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <BookUser className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {language === 'en'
                  ? 'No members found matching your search.'
                  : 'தேடலுக்குரிய உறுப்பினர்கள் கிடைக்கவில்லை.'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {language === 'en'
                  ? 'Try searching by a different name, mobile number, profession, or reset filters.'
                  : 'வேறு பெயர், கைபேசி எண் அல்லது மாவட்டத்தை தட்டச்சு செய்து முயலவும்.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: SANGAM DEMOGRAPHICS & COUNTS ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <AddressBookAnalyticsCards
          language={language}
          analytics={analytics}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(d) => {
            setSelectedDistrict(d);
            setActiveSubTab('directory');
          }}
          selectedBranch={selectedBranch}
          onSelectBranch={(b) => {
            setSelectedBranch(b);
            setActiveSubTab('directory');
          }}
          selectedCity={selectedCity}
          onSelectCity={(c) => {
            setSelectedCity(c);
            setActiveSubTab('directory');
          }}
        />
      )}

      {/* SUB-VIEW 3: INCOMING ACCESS REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {language === 'en'
                  ? 'DPDP 2023 Consent-Based Address Access Control'
                  : 'DPDP 2023 சம்மத அடிப்படையிலான முகவரி பாதுகாப்பு'}
              </p>
              <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                {language === 'en'
                  ? 'These members have requested to view your door number, physical street address, and phone number. Approving unmasks your contact info for them.'
                  : 'இந்த உறுப்பினர்கள் உங்களது வீடு எண், தெரு முகவரி மற்றும் தொலைபேசி எண்ணைப் பார்க்க அனுமதி கோரியுள்ளனர். ஒப்புதல் அளித்தால் மட்டுமே அவர்களுக்கு விவரங்கள் திறக்கப்படும்.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {accessRequests.map((req) => (
              <div
                key={req.id}
                id={`request-item-${req.id}`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                      {req.requesterName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {req.requesterNativePlace}
                    </span>
                    {req.status === 'pending' && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {language === 'en' ? 'Pending' : 'நிலுவையில்'}
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {language === 'en' ? 'Approved' : 'அனுமதிக்கப்பட்டது'}
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                        {language === 'en' ? 'Declined' : 'நிராகரிக்கப்பட்டது'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      {language === 'en' ? 'Reason:' : 'காரணம்:'}
                    </strong>{' '}
                    {req.requestReason}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {language === 'en' ? 'Requested on:' : 'கோரப்பட்ட நாள்:'}{' '}
                    {new Date(req.createdAt).toLocaleDateString()} • Phone: {req.requesterPhone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        id={`btn-approve-req-${req.id}`}
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Approve Access' : 'அனுமதிக்க'}</span>
                      </button>
                      <button
                        type="button"
                        id={`btn-reject-req-${req.id}`}
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Decline' : 'நிராகரி'}</span>
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {language === 'en' ? 'Access Granted' : 'அனுமதி வழங்கப்பட்டது'}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 font-medium">
                      {language === 'en' ? 'Declined' : 'நிராகரிக்கப்பட்டது'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: REGISTER NEW MEMBER DEMO */}
      {activeSubTab === 'register' && (
        <MemberRegistrationForm
          language={language}
          existingMembers={addressList}
          onRegisterMember={handleRegisterMember}
          onCancel={() => setActiveSubTab('directory')}
        />
      )}

      {/* MODAL 1: Manage / Add Family Member */}
      {familyModalTarget && (
        <FamilyMemberModal
          language={language}
          targetMember={familyModalTarget}
          allMembers={addressList}
          isOpen={Boolean(familyModalTarget)}
          onClose={() => setFamilyModalTarget(null)}
          onSaveFamily={handleSaveFamily}
        />
      )}

      {/* MODAL 2: Request Access to Member Details */}
      {requestingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en'
                    ? 'Request Contact & Address Details'
                    : 'முகவரி மற்றும் தொலைபேசி அனுமதி கோரிக்கை'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRequestingTarget(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-zinc-600 dark:text-zinc-400">
                {language === 'en'
                  ? 'You are requesting access to view the door number, street, phone, and email of:'
                  : 'கீழ்கண்ட உறுப்பினரின் முழு முகவரி மற்றும் தொலைபேசியை கோருகிறீர்கள்:'}
              </p>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                  {requestingTarget.fullName} ({requestingTarget.fullNameTa})
                </span>
                <span className="text-[11px] text-zinc-500">
                  {requestingTarget.membershipCode} • {requestingTarget.branch || requestingTarget.city}
                </span>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {language === 'en'
                    ? 'Purpose / Reason for Request:'
                    : 'கோரிக்கைக்கான நோக்கம் / காரணம்:'}
                </label>
                <textarea
                  rows={3}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. Dispatching wedding invitation, lineage coordination..."
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                {language === 'en'
                  ? 'Once approved by the member, their unmasked address and phone number will immediately unlock.'
                  : 'உறுப்பினர் ஒப்புதல் அளித்தவுடன் முகவரி மற்றும் தொலைபேசி தானாகவே காண்பிக்கப்படும்.'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRequestingTarget(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                {language === 'en' ? 'Cancel' : 'ரத்து'}
              </button>
              <button
                type="button"
                id="btn-confirm-send-request"
                onClick={handleSendRequest}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Send Request' : 'கோரிக்கையை அனுப்பு'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
