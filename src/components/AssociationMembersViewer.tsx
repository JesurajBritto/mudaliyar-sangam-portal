import React, { useState } from 'react';
import {
  Users2,
  Calendar,
  Award,
  Phone,
  Mail,
  Building,
  MapPin,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  UserPlus,
  Sparkles,
  X,
  Plus
} from 'lucide-react';
import { Language, AssociationMember } from '../types';
import {
  INITIAL_ASSOCIATION_MEMBERS,
  ASSOCIATION_TERMS,
  OFFICIAL_POSITIONS
} from '../data/associationMembersData';
import { ModuleTopNav } from './ModuleTopNav';

interface AssociationMembersViewerProps {
  language: Language;
  searchQuery?: string;
  onBackToHome?: () => void;
}

export const AssociationMembersViewer: React.FC<AssociationMembersViewerProps> = ({
  language,
  searchQuery: externalSearch = '',
  onBackToHome
}) => {
  const [members, setMembers] = useState<AssociationMember[]>(INITIAL_ASSOCIATION_MEMBERS);
  const [selectedTerm, setSelectedTerm] = useState<string>('2024-2026');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<AssociationMember | null>(null);
  
  // Super Admin Controls
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Member Form State
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    nameTa: '',
    positionId: 'state_president',
    termYears: '2024 - 2026',
    nativePlace: '',
    nativeDistrict: 'Chennai',
    phone: '',
    email: '',
    occupation: '',
    membershipId: '',
    achievements: '',
    achievementsTa: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  });

  const effectiveSearch = (externalSearch || searchTerm).trim().toLowerCase();

  // Filter members by Term and Search query (All wing filters removed as requested)
  const filteredMembers = members.filter((member) => {
    const matchesTerm =
      selectedTerm === 'all' ||
      member.termYears.includes(selectedTerm) ||
      (selectedTerm === 'historic' && member.termYears === 'historic');

    const matchesQuery =
      !effectiveSearch ||
      member.name.toLowerCase().includes(effectiveSearch) ||
      member.nameTa.includes(effectiveSearch) ||
      member.position.toLowerCase().includes(effectiveSearch) ||
      member.positionTa.includes(effectiveSearch) ||
      member.nativePlace.toLowerCase().includes(effectiveSearch) ||
      member.nativeDistrict.toLowerCase().includes(effectiveSearch) ||
      member.occupation.toLowerCase().includes(effectiveSearch) ||
      member.phone.includes(effectiveSearch) ||
      member.email.toLowerCase().includes(effectiveSearch);

    return matchesTerm && matchesQuery;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.phone) return;

    const matchedPos = OFFICIAL_POSITIONS.find((p) => p.id === newMemberForm.positionId) || OFFICIAL_POSITIONS[0];

    const newEntry: AssociationMember = {
      id: `assoc-${Date.now()}`,
      name: newMemberForm.name,
      nameTa: newMemberForm.nameTa || newMemberForm.name,
      position: matchedPos.en,
      positionTa: matchedPos.ta,
      termYears: newMemberForm.termYears,
      wing: 'apex_council',
      nativePlace: newMemberForm.nativePlace || 'Tamil Nadu',
      nativeDistrict: newMemberForm.nativeDistrict || 'Chennai',
      phone: newMemberForm.phone,
      email: newMemberForm.email || `${newMemberForm.name.toLowerCase().replace(/\s+/g, '')}@mudaliyarsangam.org`,
      occupation: newMemberForm.occupation || 'Professional / Business Leader',
      membershipId: newMemberForm.membershipId || `MUD-OFF-2026-${Math.floor(100 + Math.random() * 900)}`,
      photoUrl: newMemberForm.photoUrl,
      achievements: newMemberForm.achievements
        ? newMemberForm.achievements.split('\n').filter(Boolean)
        : ['Appointed as Office Bearer for Sangam governance & development'],
      achievementsTa: newMemberForm.achievementsTa
        ? newMemberForm.achievementsTa.split('\n').filter(Boolean)
        : ['சங்க வளர்ச்சி மற்றும் பணிகளுக்காக நியமிக்கப்பட்ட நிர்வாகி'],
      isCurrentOfficeBearer: newMemberForm.termYears.includes('2024')
    };

    setMembers([newEntry, ...members]);
    setIsAddModalOpen(false);
    setNewMemberForm({
      name: '',
      nameTa: '',
      positionId: 'state_president',
      termYears: '2024 - 2026',
      nativePlace: '',
      nativeDistrict: 'Chennai',
      phone: '',
      email: '',
      occupation: '',
      membershipId: '',
      achievements: '',
      achievementsTa: '',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    });

    setToastMessage(
      language === 'en'
        ? `New office bearer "${newEntry.name}" (${newEntry.position}) added successfully by Super Admin!`
        : `புதிய நிர்வாகி "${newEntry.nameTa}" (${newEntry.positionTa}) வெற்றிகரமாக சேர்க்கப்பட்டார்!`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Sangam Officers & Governing Council"
        moduleNameTa="சங்க நிர்வாகிகள் & செயற்குழு பட்டியல்"
        badgeEn="Apex Institutional Directory"
        badgeTa="தலைமை நிர்வாக அடைவு"
        subtitleEn="Tenure-wise roster of the Apex Executive Council, State Secretaries, and Zonal Office Bearers."
        subtitleTa="சங்கத்தின் தலைமை நிர்வாகிகள், மண்டலச் செயலாளர்கள் மற்றும் செயற்குழு உறுப்பினர்களின் அதிகாரப்பூர்வ பட்டியல்."
        themeColor="blue"
        icon={Award}
        onBackToHome={onBackToHome}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 text-xs rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Module-Specific Hero Card (Deep Blue / Royal Blue Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/50 border border-blue-200/90 shadow-[0_4px_24px_rgba(29,78,216,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <Users2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Association Office Bearers & Governing Council'
                  : 'முதலியார் சங்க நிர்வாகிகள் & செயற்குழு பட்டியல்'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                {selectedTerm === 'all' ? 'All Tenures' : `Tenure: ${selectedTerm}`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
              {language === 'en'
                ? 'Official tenure-wise archive of Apex Executive Council, Zonal Secretaries, Youth Wing, Women\'s Wing, and Senior Advisors.'
                : 'சங்கத்தின் தலைமை நிர்வாகிகள், மண்டலச் செயலாளர்கள், இளைஞர் அணி, மகளிர் அணி மற்றும் மூத்த ஆலோசகர்களின் அதிகாரப்பூர்வ பட்டியல்.'}
            </p>
          </div>

          {/* Action / Mode Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center bg-white dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <button
                type="button"
                onClick={() => setIsSuperAdmin(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !isSuperAdmin
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {language === 'en' ? 'Member View' : 'உறுப்பினர் பார்வை'}
              </button>
              <button
                type="button"
                onClick={() => setIsSuperAdmin(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isSuperAdmin
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'en' ? 'Super Admin' : 'சூப்பர் அட்மின்'}</span>
              </button>
            </div>

            {/* Super Admin Add Member Button */}
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>{language === 'en' ? 'Add Office Bearer' : 'நிர்வாகியைச் சேர்க்க'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tenure / Year Selection Bar with Current Year display & Previous Year Dropdown */}
        <div className="mt-6 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'en' ? 'Tenure / Council Year:' : 'பதவிக் காலம் / ஆண்டுக் குழு:'}</span>
            </span>

            {/* Dropdown Select Option for Current & Previous Years */}
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 border-2 border-amber-500/40 dark:border-amber-600 text-zinc-900 dark:text-white shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              {ASSOCIATION_TERMS.map((term) => (
                <option key={term.id} value={term.id}>
                  {language === 'en' ? term.labelEn : term.labelTa}
                </option>
              ))}
            </select>

            {selectedTerm === '2024-2026' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === 'en' ? 'Current Active Council' : 'தற்போதைய நிர்வாகம்'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {filteredMembers.length} {language === 'en' ? 'Office Bearers' : 'நிர்வாகிகள்'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Input Bar (No Wing Filters - Displaying All Officers Directly) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            {language === 'en'
              ? 'Displaying all office bearers with complete contact details and official portfolios.'
              : 'அனைத்து நிர்வாகிகள் மற்றும் அவர்களின் நேரடி தொடர்பு விவரங்கள் முழுமையாக கீழே பட்டியலிடப்பட்டுள்ளன.'}
          </span>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={
              language === 'en'
                ? 'Search by name, position, phone, district...'
                : 'பெயர், பதவி, தொலைபேசி, மாவட்டம் மூலம் தேடுக...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Members Grid - Directly Showing All Officer Details and Contact Details */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
          <Users2 className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {language === 'en' ? 'No association office bearers found' : 'நிர்வாகிகள் எவரும் கிடைக்கவில்லை'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {language === 'en' ? 'Try adjusting your tenure selection or search query.' : 'ஆண்டுக் குழு அல்லது தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Photo, Position & Tenure Badge */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                        {member.termYears}
                      </span>
                      {member.isCurrentOfficeBearer && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                      {language === 'en' ? member.name : member.nameTa}
                    </h3>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300/40 dark:border-amber-700/50">
                        {language === 'en' ? member.position : member.positionTa}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details & Contact Section - Directly Displayed */}
                <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium py-2.5 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <a
                      href={`tel:${member.phone}`}
                      className="font-mono font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
                    >
                      {member.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 truncate block transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">
                      {member.nativePlace}, {member.nativeDistrict}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{member.occupation}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>ID: {member.membershipId}</span>
                  </div>
                </div>

                {/* Achievements List */}
                <div className="mt-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
                    {language === 'en' ? 'Key Initiatives / Contributions:' : 'பதவிக் கால சாதனைகள் / பொறுப்புகள்:'}
                  </span>
                  <ul className="space-y-1 text-[11px] text-zinc-800 dark:text-zinc-200 font-medium">
                    {(language === 'en' ? member.achievements : member.achievementsTa).slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'en' ? 'Call' : 'அழைக்க'}</span>
                </a>

                <a
                  href={`mailto:${member.email}?subject=Sangam Inquiry - Mudaliyar Sangam`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{language === 'en' ? 'Email' : 'மின்னஞ்சல்'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ml-auto"
                >
                  <span>{language === 'en' ? 'Profile' : 'விவரம்'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Super Admin Add Office Bearer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Super Admin: Add Office Bearer' : 'சூப்பர் அட்மின்: புதிய நிர்வாகியைச் சேர்க்க'}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {language === 'en'
                      ? 'Add office bearer to Governing Council & Association Directory'
                      : 'செயற்குழு மற்றும் சங்க நிர்வாகிகள் பட்டியலில் சேர்க்கவும்'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Full Name' : 'முழுப் பெயர்'} *
                  </label>
                  <input
                    required
                    type="text"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    placeholder="e.g. Dr. K. Soundararajan Mudaliyar"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Full Name in Tamil' : 'தமிழ் முழுப் பெயர்'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.nameTa}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nameTa: e.target.value })}
                    placeholder="எ.கா. டாக்டர் கே. சௌந்தரராஜன் முதலியார்"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Exact Position Dropdown List as requested */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Office Position / Designation' : 'நிர்வாகப் பதவி'} *
                  </label>
                  <select
                    value={newMemberForm.positionId}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, positionId: e.target.value })}
                    className="w-full p-2 rounded-xl border-2 border-indigo-500/40 dark:border-indigo-600 bg-indigo-50/20 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold cursor-pointer"
                  >
                    {OFFICIAL_POSITIONS.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {language === 'en' ? pos.en : `${pos.ta} (${pos.en})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Tenure / Council Period' : 'பதவிக் காலம்'} *
                  </label>
                  <select
                    value={newMemberForm.termYears}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, termYears: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="2024 - 2026">2024 - 2026 (Current)</option>
                    <option value="2022 - 2024">2022 - 2024 (Previous)</option>
                    <option value="2020 - 2022">2020 - 2022 (Previous)</option>
                    <option value="historic">1951 - 2018 (Historic Founding)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Official Phone Number' : 'அதிகாரப்பூர்வ தொலைபேசி எண்'} *
                  </label>
                  <input
                    required
                    type="text"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    placeholder="+91 98400 12345"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Official Email Address' : 'மின்னஞ்சல் முகவரி'}
                  </label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    placeholder="officer@mudaliyarsangam.org"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'Native Town / Place' : 'சொந்த ஊர்'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.nativePlace}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nativePlace: e.target.value })}
                    placeholder="e.g. Kanchipuram / Maduranthakam"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    {language === 'en' ? 'District' : 'மாவட்டம்'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.nativeDistrict}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nativeDistrict: e.target.value })}
                    placeholder="e.g. Kanchipuram / Chennai / Coimbatore"
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                  {language === 'en' ? 'Occupation / Business / Enterprise' : 'தொழில் / பணி விவரம்'}
                </label>
                <input
                  type="text"
                  value={newMemberForm.occupation}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, occupation: e.target.value })}
                  placeholder="e.g. Industrialist & Founder, Sri Shanmuga Silks"
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                  {language === 'en' ? 'Key Contributions / Milestones (One per line)' : 'பதவிக் கால சாதனைகள் / பொறுப்புகள்'}
                </label>
                <textarea
                  value={newMemberForm.achievements}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, achievements: e.target.value })}
                  rows={2}
                  placeholder="e.g. Spearheaded ₹2 Crore Sangam Endowment Fund"
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'ரத்து செய்க'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Save & Publish Officer' : 'நிர்வாகியைப் பதிவு செய்க'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.photoUrl}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? selectedMember.name : selectedMember.nameTa}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {language === 'en' ? selectedMember.position : selectedMember.positionTa}
                  </p>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium block mt-0.5">
                    Term: {selectedMember.termYears} • ID: {selectedMember.membershipId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold block">
                    {language === 'en' ? 'Native Place' : 'சொந்த ஊர்'}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedMember.nativePlace}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold block">
                    {language === 'en' ? 'District' : 'மாவட்டம்'}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedMember.nativeDistrict}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold block">
                    {language === 'en' ? 'Official Phone' : 'அதிகாரப்பூர்வ தொலைபேசி'}
                  </span>
                  <a href={`tel:${selectedMember.phone}`} className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                    {selectedMember.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold block">
                    {language === 'en' ? 'Official Email' : 'அதிகாரப்பூர்வ மின்னஞ்சல்'}
                  </span>
                  <a href={`mailto:${selectedMember.email}`} className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 truncate block">
                    {selectedMember.email}
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'Key Initiatives & Contributions During Office:' : 'பதவிக் கால சாதனைகள் & தலைமைப் பணிகள்:'}</span>
                </h4>
                <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200">
                  {(language === 'en' ? selectedMember.achievements : selectedMember.achievementsTa).map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <a
                href={`tel:${selectedMember.phone}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Call Office' : 'அழைக்க'}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold cursor-pointer"
              >
                {language === 'en' ? 'Close' : 'மூடுக'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
