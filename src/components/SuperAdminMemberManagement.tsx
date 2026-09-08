import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Crown,
  UserCheck,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Building,
  Award,
  Download,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Phone,
  Mail,
  X,
  Save,
  Check,
  Building2,
  Calendar,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { AuthUser, UserRole, Language } from '../types';
import {
  loadAllRegisteredUsers,
  saveAllRegisteredUsers,
  updateUserRoleAndPosition,
  deleteRegisteredUser,
  addNewUserByAdmin,
  calculateDemographics,
  STANDARD_POSITIONS
} from '../data/authData';
import { TN_DISTRICTS } from '../data/districts';

interface SuperAdminMemberManagementProps {
  language: Language;
  currentUser: AuthUser | null;
  onUserUpdated?: () => void;
}

export const SuperAdminMemberManagement: React.FC<SuperAdminMemberManagementProps> = ({
  language,
  currentUser,
  onUserUpdated
}) => {
  const [users, setUsers] = useState<AuthUser[]>(loadAllRegisteredUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [activeDemographicTab, setActiveDemographicTab] = useState<'district' | 'city' | 'branch'>('district');
  const [demographicSearch, setDemographicSearch] = useState('');

  // Editing Modal / Drawer State
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('member');
  const [editPosition, setEditPosition] = useState<string>('General Member');
  const [editPositionTa, setEditPositionTa] = useState<string>('பொது உறுப்பினர்');
  const [editBranch, setEditBranch] = useState<string>('');
  const [editDistrict, setEditDistrict] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    fullName: '',
    fullNameTa: '',
    phone: '',
    email: '',
    district: 'Chennai',
    city: 'Chennai',
    branch: 'Chennai Central (State HQ)',
    role: 'member' as UserRole,
    position: 'General Member',
    positionTa: 'பொது உறுப்பினர்',
    doorNumber: '',
    streetName: '',
    areaLocality: '',
    pincode: '',
    occupation: ''
  });

  const demographics = useMemo(() => calculateDemographics(users), [users]);

  // Refresh user list from storage
  const reloadUsers = () => {
    const loaded = loadAllRegisteredUsers();
    setUsers(loaded);
  };

  // Filtered member list for management table
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        (u.fullNameTa && u.fullNameTa.toLowerCase().includes(q)) ||
        u.phone.includes(q) ||
        u.membershipCode.toLowerCase().includes(q) ||
        (u.district && u.district.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        (u.position && u.position.toLowerCase().includes(q)) ||
        (u.branch && u.branch.toLowerCase().includes(q));

      const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
      const matchesDistrict = selectedDistrictFilter === 'all' || u.district === selectedDistrictFilter;

      return matchesQuery && matchesRole && matchesDistrict;
    });
  }, [users, searchQuery, selectedRoleFilter, selectedDistrictFilter]);

  // Open Edit Modal for a user
  const handleOpenEdit = (user: AuthUser) => {
    setEditingUser(user);
    setEditRole(user.role || 'member');
    setEditPosition(user.position || 'General Member');
    setEditPositionTa(user.positionTa || 'பொது உறுப்பினர்');
    setEditBranch(user.branch || '');
    setEditDistrict(user.district || 'Chennai');
  };

  // Save Role and Position Updates
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedList = updateUserRoleAndPosition(
      editingUser.id,
      editRole,
      editPosition,
      editPositionTa,
      editBranch
    );

    setUsers(updatedList);
    setSaveSuccessMsg(
      language === 'ta'
        ? `${editingUser.fullName} அவர்களின் பொறுப்பு & நிலை மாற்றப்பட்டது!`
        : `Role & Position updated for ${editingUser.fullName}!`
    );
    setEditingUser(null);
    onUserUpdated?.();

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // Handle Preset Position Selection
  const handleSelectPresetPosition = (posId: string) => {
    const preset = STANDARD_POSITIONS.find((p) => p.id === posId || p.nameEn === posId);
    if (preset) {
      setEditPosition(preset.nameEn);
      setEditPositionTa(preset.nameTa);
    }
  };

  // Handle Delete Member
  const handleDelete = (userId: string, userName: string) => {
    if (
      window.confirm(
        language === 'ta'
          ? `${userName} என்ற உறுப்பினரை நீக்க உறுதிப்படுத்துகிறீர்களா?`
          : `Are you sure you want to remove member ${userName}?`
      )
    ) {
      const updated = deleteRegisteredUser(userId);
      setUsers(updated);
      onUserUpdated?.();
    }
  };

  // Handle Add Member Submit
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.fullName || !newMemberForm.phone) {
      alert(language === 'ta' ? 'பெயர் மற்றும் மொபைல் எண் அவசியம்!' : 'Name and Phone number are required!');
      return;
    }

    const created = addNewUserByAdmin(newMemberForm);
    setUsers(loadAllRegisteredUsers());
    setIsAddModalOpen(false);
    setNewMemberForm({
      fullName: '',
      fullNameTa: '',
      phone: '',
      email: '',
      district: 'Chennai',
      city: 'Chennai',
      branch: 'Chennai Central (State HQ)',
      role: 'member',
      position: 'General Member',
      positionTa: 'பொது உறுப்பினர்',
      doorNumber: '',
      streetName: '',
      areaLocality: '',
      pincode: '',
      occupation: ''
    });
    setSaveSuccessMsg(
      language === 'ta'
        ? `புதிய உறுப்பினர் ${created.fullName} சேர்க்கப்பட்டார்!`
        : `New member ${created.fullName} added successfully!`
    );
    onUserUpdated?.();
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Export Registered Members to CSV
  const handleExportCsv = () => {
    const headers = [
      'Membership Code',
      'Full Name (EN)',
      'Full Name (TA)',
      'Phone',
      'Email',
      'Role',
      'Assigned Position',
      'District',
      'City',
      'Branch',
      'Joined Date'
    ];

    const rows = users.map((u) => [
      `"${u.membershipCode}"`,
      `"${u.fullName}"`,
      `"${u.fullNameTa || ''}"`,
      `"${u.phone}"`,
      `"${u.email || ''}"`,
      `"${u.role}"`,
      `"${u.position || 'General Member'}"`,
      `"${u.district || ''}"`,
      `"${u.city || ''}"`,
      `"${u.branch || ''}"`,
      `"${u.joinedDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sangam_registered_members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtered Demographics
  const filteredDistrictDemographics = demographics.districtCounts.filter((d) =>
    d.district.toLowerCase().includes(demographicSearch.toLowerCase())
  );

  const filteredCityDemographics = demographics.cityCounts.filter(
    (c) =>
      c.city.toLowerCase().includes(demographicSearch.toLowerCase()) ||
      c.district.toLowerCase().includes(demographicSearch.toLowerCase())
  );

  const filteredBranchDemographics = demographics.branchCounts.filter(
    (b) =>
      b.branch.toLowerCase().includes(demographicSearch.toLowerCase()) ||
      b.district.toLowerCase().includes(demographicSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold">{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Crown className="w-3.5 h-3.5" />
              {language === 'ta' ? 'சூப்பர் அட்மின் நிர்வாக மேலாண்மை' : 'SuperAdmin User & Position Management'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              {users.length} {language === 'ta' ? 'பதிவு செய்யப்பட்ட உறுப்பினர்கள்' : 'Registered Members'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {language === 'ta' ? 'உறுப்பினர் நிலைகள், பதவிகள் & மாவட்ட புள்ளிவிவரங்கள்' : 'User Roles, Official Positions & Demographics'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
            {language === 'ta'
              ? 'உறுப்பினர்களுக்கு மண்டலச் செயலாளர், மாவட்டச் செயலாளர் போன்ற பொறுப்புகளை வழங்கவும் மற்றும் புள்ளிவிவரங்களை கண்காணிக்கவும்.'
              : 'Assign administrative roles (Super Admin / Branch Admin), assign official posts (Zonal Secretary, etc.), and view demographic counts.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={reloadUsers}
            className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Reload from storage"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ta' ? 'புதுப்பிக்க' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ta' ? 'எக்செல் ஏற்றுமதி (CSV)' : 'Export CSV'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'ta' ? '+ புதிய உறுப்பினர் சேர்க்க' : '+ Add Member'}</span>
          </button>
        </div>
      </div>

      {/* 1. DEMOGRAPHIC SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {language === 'ta' ? 'மொத்த உறுப்பினர்கள்' : 'Total Members'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {demographics.totalMembers}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {demographics.districtCounts.length} {language === 'ta' ? 'மாவட்டங்களில் பரவல்' : 'districts represented'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {language === 'ta' ? 'மாநில / மண்டல நிர்வாகிகள்' : 'Super Admins'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {demographics.totalSuperAdmins}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {language === 'ta' ? 'முழு நிர்வாக உரிமை' : 'Full access level'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {language === 'ta' ? 'மாவட்ட / கிளை நிர்வாகிகள்' : 'Branch Admins'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {demographics.totalBranchAdmins}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {language === 'ta' ? 'மாவட்ட மேற்பார்வையாளர்கள்' : 'District coordinators'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {language === 'ta' ? 'பதவி வகிக்கும் பொறுப்பாளர்கள்' : 'Position Holders'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {demographics.totalPositionHolders}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {language === 'ta' ? 'மண்டல / மாவட்ட பொறுப்புகள்' : 'Assigned official roles'}
          </p>
        </div>
      </div>

      {/* 2. DEMOGRAPHICS BREAKDOWN SECTION (DISTRICT / CITY / BRANCH) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {language === 'ta' ? 'மாவட்ட, நகர & கிளை வாரியான புள்ளிவிவரங்கள்' : 'Demographics & Geographic Breakdown'}
            </h3>
          </div>

          {/* Demographic view tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setActiveDemographicTab('district')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDemographicTab === 'district'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'மாவட்டம் வாரியாக' : 'District-Wise'} ({demographics.districtCounts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveDemographicTab('city')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDemographicTab === 'city'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'நகரம் வாரியாக' : 'City-Wise'} ({demographics.cityCounts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveDemographicTab('branch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDemographicTab === 'branch'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'கிளை வாரியாக' : 'Branch-Wise'} ({demographics.branchCounts.length})
            </button>
          </div>
        </div>

        {/* Demographic Search Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={
                language === 'ta'
                  ? 'புள்ளிவிவரங்களில் தேட (மாவட்டம்/நகரம்/கிளை)...'
                  : 'Search demographics by name...'
              }
              value={demographicSearch}
              onChange={(e) => setDemographicSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>
          {demographicSearch && (
            <button
              type="button"
              onClick={() => setDemographicSearch('')}
              className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Demographic Tab View: District */}
        {activeDemographicTab === 'district' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredDistrictDemographics.map((item) => (
              <div
                key={item.district}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700/80 flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
                    {item.district}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                    {item.percentage}%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-amber-700 dark:text-amber-400">
                    {item.count}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    {language === 'ta' ? 'உறுப்பினர்கள்' : 'members'}
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-stone-200 dark:bg-zinc-700 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.max(item.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demographic Tab View: City */}
        {activeDemographicTab === 'city' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredCityDemographics.map((item) => (
              <div
                key={`${item.city}-${item.district}`}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-white">{item.city}</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-600" />
                    {item.district}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {item.count}
                  </span>
                  <p className="text-[9px] text-stone-400 uppercase font-bold">
                    {language === 'ta' ? 'நபர்கள்' : 'members'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demographic Tab View: Branch */}
        {activeDemographicTab === 'branch' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredBranchDemographics.map((item) => (
              <div
                key={`${item.branch}-${item.district}`}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="line-clamp-1">{item.branch}</span>
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 pl-5">
                    {item.district}
                  </p>
                </div>
                <div className="text-right shrink-0 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-zinc-700">
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {item.count}
                  </span>
                  <p className="text-[9px] text-stone-400 uppercase font-bold">Members</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. REGISTERED MEMBER MANAGEMENT TABLE & ACTIONS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              {language === 'ta' ? 'பதிவு செய்யப்பட்ட உறுப்பினர்கள் பட்டியல்' : 'Registered Member Roster & Role Actions'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {language === 'ta'
                ? 'உறுப்பினரின் நிலை (Role) மற்றும் பதவி பொறுப்புகளை (Position) உடனுக்குடன் மாற்றவும்.'
                : 'Click "Edit Role & Position" on any member to update roles, assign executive posts, or change branches.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={
                  language === 'ta'
                    ? 'பெயர், எண், பதவி, மாவட்டம் தேடுக...'
                    : 'Search by name, ID, phone, position...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-bold focus:outline-hidden"
            >
              <option value="all">{language === 'ta' ? 'அனைத்து நிலைகள் (All Roles)' : 'All Roles'}</option>
              <option value="super_admin">👑 Super Admin</option>
              <option value="branch_admin">🛡️ Branch Admin</option>
              <option value="member">👤 Sangam Member</option>
            </select>

            {/* District Filter */}
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-bold focus:outline-hidden max-w-[150px]"
            >
              <option value="all">{language === 'ta' ? 'அனைத்து மாவட்டங்கள்' : 'All Districts'}</option>
              {TN_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-zinc-800/80 text-stone-600 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-zinc-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">
                  {language === 'ta' ? 'உறுப்பினர் பெயர் & எண்' : 'Member & ID'}
                </th>
                <th className="p-3.5">
                  {language === 'ta' ? 'தொடர்பு எண் & மின்னஞ்சல்' : 'Contact'}
                </th>
                <th className="p-3.5">
                  {language === 'ta' ? 'நிர்வாக நிலை (Role)' : 'Role'}
                </th>
                <th className="p-3.5">
                  {language === 'ta' ? 'சங்கப் பொறுப்பு (Position)' : 'Assigned Position'}
                </th>
                <th className="p-3.5">
                  {language === 'ta' ? 'மாவட்டம் & கிளை' : 'District & Branch'}
                </th>
                <th className="p-3.5 text-right">
                  {language === 'ta' ? 'நடவடிக்கைகள்' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    {language === 'ta' ? 'உறுப்பினர்கள் எவரும் காணப்படவில்லை.' : 'No members found matching the search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id || currentUser?.membershipCode === user.membershipCode;

                  return (
                    <tr
                      key={user.id || user.membershipCode}
                      className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-stone-900 dark:text-white">
                                {user.fullName}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px]">
                                  You
                                </span>
                              )}
                            </div>
                            {user.fullNameTa && (
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                {user.fullNameTa}
                              </p>
                            )}
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md bg-stone-100 dark:bg-zinc-800 text-[10px] font-mono text-stone-600 dark:text-stone-300">
                              {user.membershipCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-amber-600" />
                            {user.phone}
                          </p>
                          {user.email && (
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-400" />
                              <span className="truncate max-w-[150px]">{user.email}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="p-3.5">
                        {user.role === 'super_admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                            <Crown className="w-3 h-3" />
                            Super Admin
                          </span>
                        ) : user.role === 'branch_admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                            <ShieldCheck className="w-3 h-3" />
                            Branch Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-zinc-700">
                            <UserCheck className="w-3 h-3 text-stone-400" />
                            Sangam Member
                          </span>
                        )}
                      </td>

                      {/* Position */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <div>
                            <p className="font-bold text-amber-900 dark:text-amber-300">
                              {user.position || 'General Member'}
                            </p>
                            {user.positionTa && user.positionTa !== user.position && (
                              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                                {user.positionTa}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* District & Branch */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            {user.district || 'Tamil Nadu'}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[160px]">
                            {user.branch || `${user.district} Branch`}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-700 flex items-center gap-1 transition-all cursor-pointer"
                            title="Edit Role & Position"
                          >
                            <Edit className="w-3 h-3" />
                            <span>{language === 'ta' ? 'பொறுப்பு மாற்றம்' : 'Edit Role'}</span>
                          </button>

                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleDelete(user.id, user.fullName)}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: EDIT USER ROLE & POSITION */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {language === 'ta' ? 'உறுப்பினர் பொறுப்பு & நிலை நிர்ணயம்' : 'Update Role & Position'}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {editingUser.fullName} ({editingUser.membershipCode})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              {/* Member Summary Header */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-900 dark:text-white">{editingUser.fullName}</p>
                  <p className="text-stone-500 dark:text-stone-400">{editingUser.phone}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-stone-600 dark:text-stone-300">
                    {editingUser.district}
                  </span>
                </div>
              </div>

              {/* 1. ROLE SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  {language === 'ta' ? 'அதிகார நிலை (Access Level / Role)' : 'System Access Role'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole('super_admin')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      editRole === 'super_admin'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950 dark:text-rose-200 font-bold ring-2 ring-rose-400'
                        : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <Crown className="w-4 h-4 mx-auto mb-1 text-rose-600" />
                    <span className="text-[11px] font-bold block">Super Admin</span>
                    <span className="text-[9px] text-stone-500 dark:text-stone-400 block">Full State Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRole('branch_admin')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      editRole === 'branch_admin'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-400'
                        : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] font-bold block">Branch Admin</span>
                    <span className="text-[9px] text-stone-500 dark:text-stone-400 block">District Level</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRole('member')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      editRole === 'member'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold ring-2 ring-amber-400'
                        : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[11px] font-bold block">Sangam Member</span>
                    <span className="text-[9px] text-stone-500 dark:text-stone-400 block">Standard User</span>
                  </button>
                </div>
              </div>

              {/* 2. POSITION QUICK PRESETS */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  {language === 'ta' ? 'பதவி பொறுப்புகள் (Preset Positions)' : 'Select Official Position (e.g. Zonal Secretary)'}
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700">
                  {STANDARD_POSITIONS.map((p) => {
                    const isSelected = editPosition === p.nameEn;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPresetPosition(p.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white dark:bg-zinc-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-zinc-600 hover:border-amber-400'
                        }`}
                      >
                        {language === 'ta' ? p.nameTa : p.nameEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. CUSTOM POSITION TITLE (EN & TA) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'பதவி பெயர் (English)' : 'Position Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    placeholder="e.g. Zonal Secretary"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'பதவி பெயர் (தமிழ்)' : 'Position Name (Tamil)'}
                  </label>
                  <input
                    type="text"
                    value={editPositionTa}
                    onChange={(e) => setEditPositionTa(e.target.value)}
                    placeholder="எ.கா. மண்டலச் செயலாளர்"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* 4. BRANCH & DISTRICT ASSIGNMENT */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'மாவட்டம்' : 'District'}
                  </label>
                  <select
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'கிளை பெயர்' : 'Branch Name'}
                  </label>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    placeholder="e.g. Coimbatore South Branch"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'ta' ? 'மாற்றங்களை சேமி' : 'Save Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD NEW MEMBER BY ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden my-6">
            <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {language === 'ta' ? 'புதிய உறுப்பினர் / பொறுப்பாளர் சேர்க்கை' : 'Add New Member / Official'}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {language === 'ta' ? 'அட்மினால் நேரடியாக பதிவு செய்யப்படும் விவரம்' : 'Direct administrative registration'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'முழுப் பெயர் (English) *' : 'Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.fullName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, fullName: e.target.value })}
                    placeholder="Thiru. Name Mudaliyar"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'முழுப் பெயர் (தமிழ்)' : 'Full Name (Tamil)'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.fullNameTa}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, fullNameTa: e.target.value })}
                    placeholder="திரு. பெயர் முதலியார்"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'மொபைல் எண் *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    placeholder="9840012345"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    placeholder="member@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'நிர்வாக நிலை (Role)' : 'Role'}
                  </label>
                  <select
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  >
                    <option value="member">👤 Sangam Member</option>
                    <option value="branch_admin">🛡️ Branch Admin</option>
                    <option value="super_admin">👑 Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'சங்கப் பொறுப்பு (Position)' : 'Position'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.position}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, position: e.target.value })}
                    placeholder="e.g. Zonal Secretary / General Member"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'மாவட்டம்' : 'District'}
                  </label>
                  <select
                    value={newMemberForm.district}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        district: e.target.value,
                        branch: `${e.target.value} Central Branch`
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'நகரம் / ஊர்' : 'City / Town'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.city}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, city: e.target.value })}
                    placeholder="e.g. Chennai"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'கதவு எண்' : 'Door No.'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.doorNumber}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, doorNumber: e.target.value })}
                    placeholder="No. 12"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'தெரு / பகுதி' : 'Street / Area'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.streetName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, streetName: e.target.value })}
                    placeholder="Gandhi Road"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {language === 'ta' ? 'பின்கோடு' : 'Pincode'}
                  </label>
                  <input
                    type="text"
                    value={newMemberForm.pincode}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, pincode: e.target.value })}
                    placeholder="600001"
                    maxLength={6}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'ta' ? 'உறுப்பினரைச் சேர்க்க' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
