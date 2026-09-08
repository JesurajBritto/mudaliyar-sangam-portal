import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Link,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Heart,
  GitFork,
  X
} from 'lucide-react';
import { Language, MemberAddressEntry, FamilyMemberDetail, FamilyRelationship } from '../../types';

interface FamilyMemberModalProps {
  language: Language;
  targetMember: MemberAddressEntry;
  allMembers: MemberAddressEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSaveFamily: (updatedMemberId: string, updatedFamily: FamilyMemberDetail[]) => void;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  language,
  targetMember,
  allMembers,
  isOpen,
  onClose,
  onSaveFamily,
}) => {
  const [familyList, setFamilyList] = useState<FamilyMemberDetail[]>(
    targetMember.familyMembers ? [...targetMember.familyMembers] : []
  );
  const [mode, setMode] = useState<'new' | 'link'>('new');

  // New Family Member Form
  const [newFam, setNewFam] = useState<{
    fullName: string;
    fullNameTa: string;
    relationship: FamilyRelationship;
    age: number | '';
    gender: 'male' | 'female' | 'other';
    profession: string;
    bloodGroup: string;
    phone: string;
    email: string;
  }>({
    fullName: '',
    fullNameTa: '',
    relationship: 'Wife',
    age: '',
    gender: 'female',
    profession: '',
    bloodGroup: 'O+ve',
    phone: '',
    email: '',
  });

  // Link Existing Member Form
  const [selectedExistingMemberId, setSelectedExistingMemberId] = useState<string>('');
  const [linkRelationship, setLinkRelationship] = useState<FamilyRelationship>('Son');

  if (!isOpen) return null;

  // Handle adding manually entered family member
  const handleAddManualMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFam.fullName || !newFam.age) return;

    const added: FamilyMemberDetail = {
      id: `fam-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: newFam.fullName,
      fullNameTa: newFam.fullNameTa || newFam.fullName,
      relationship: newFam.relationship,
      age: Number(newFam.age),
      gender: newFam.gender,
      profession: newFam.profession || 'Self-Employed / Homemaker',
      bloodGroup: newFam.bloodGroup,
      phone: newFam.phone || targetMember.phone,
      email: newFam.email || targetMember.email,
    };

    const updated = [...familyList, added];
    setFamilyList(updated);

    // Reset Form
    setNewFam({
      fullName: '',
      fullNameTa: '',
      relationship: 'Son',
      age: '',
      gender: 'male',
      profession: '',
      bloodGroup: 'O+ve',
      phone: '',
      email: '',
    });
  };

  // Handle linking existing member from Address Book
  const handleLinkExistingMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExistingMemberId) return;

    const existing = allMembers.find((m) => m.id === selectedExistingMemberId);
    if (!existing) return;

    const linked: FamilyMemberDetail = {
      id: `fam-link-${existing.id}`,
      existingMemberId: existing.id,
      membershipCode: existing.membershipCode,
      fullName: existing.fullName,
      fullNameTa: existing.fullNameTa,
      relationship: linkRelationship,
      age: existing.age || 30,
      gender: existing.gender || 'male',
      profession: existing.occupation,
      bloodGroup: existing.bloodGroup,
      phone: existing.phone,
      email: existing.email,
    };

    const updated = [...familyList, linked];
    setFamilyList(updated);
    setSelectedExistingMemberId('');
  };

  // Remove family member
  const handleRemove = (id: string) => {
    setFamilyList((prev) => prev.filter((item) => item.id !== id));
  };

  // Save changes
  const handleFinalSave = () => {
    onSaveFamily(targetMember.id, familyList);
    onClose();
  };

  const potentialLinkableMembers = allMembers.filter(
    (m) => m.id !== targetMember.id && !familyList.some((f) => f.existingMemberId === m.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {language === 'en'
                  ? `Family Details for ${targetMember.fullName}`
                  : `${targetMember.fullName} அவர்களின் குடும்ப விவரங்கள்`}
              </h3>
              <p className="text-xs text-zinc-500">
                {targetMember.membershipCode} • {targetMember.branch || targetMember.district}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Family Members List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {language === 'en'
                ? `Current Family Members (${familyList.length})`
                : `தற்போதைய குடும்ப உறுப்பினர்கள் (${familyList.length})`}
            </h4>
            <span className="text-[11px] text-zinc-500">
              {language === 'en' ? 'Auto-syncs with Family Tree' : 'குடும்ப மரத்துடன் தானாக இணைகிறது'}
            </span>
          </div>

          {familyList.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-500">
              {language === 'en'
                ? 'No family members added yet. Add wife, son, daughter, or link registered members below.'
                : 'இதுவரை குடும்ப உறுப்பினர்கள் சேர்க்கப்படவில்லை. கீழே மனைவி, மகன், மகள் விவரங்களை சேர்க்கவும்.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {familyList.map((fm) => (
                <div
                  key={fm.id}
                  className="p-3 rounded-xl bg-amber-50/50 dark:bg-zinc-800 border border-amber-200/80 dark:border-zinc-700 flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {fm.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                        {fm.relationship}
                      </span>
                      {fm.existingMemberId && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                          Linked ID
                        </span>
                      )}
                    </div>
                    {fm.fullNameTa && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        {fm.fullNameTa}
                      </p>
                    )}
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2 pt-1">
                      <span>Age: <strong>{fm.age} Yrs</strong></span>
                      <span>•</span>
                      <span>{fm.gender === 'male' ? 'Male' : fm.gender === 'female' ? 'Female' : 'Other'}</span>
                      {fm.bloodGroup && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">{fm.bloodGroup}</span>
                        </>
                      )}
                    </div>
                    {fm.profession && (
                      <p className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                        {fm.profession}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(fm.id)}
                    className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Family Option Mode Toggle */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'new'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '+ Add New Family Member' : '+ புதிய உறுப்பினர் விபரம்'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('link')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'link'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Link Already Registered Member' : 'ஏற்கனவே உள்ளவரை இணைக்க'}</span>
            </button>
          </div>

          {/* Mode 1: Manual Details Form */}
          {mode === 'new' && (
            <form onSubmit={handleAddManualMember} className="space-y-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Full Name *' : 'முழு பெயர் *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. N. Vasantha Lakshmi"
                    value={newFam.fullName}
                    onChange={(e) => setNewFam({ ...newFam, fullName: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Relationship *' : 'உறவுமுறை *'}
                  </label>
                  <select
                    value={newFam.relationship}
                    onChange={(e) => {
                      const rel = e.target.value as FamilyRelationship;
                      let g: 'male' | 'female' | 'other' = 'male';
                      if (['Wife', 'Daughter', 'Mother', 'Sister'].includes(rel)) g = 'female';
                      setNewFam({ ...newFam, relationship: rel, gender: g });
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                  >
                    <option value="Wife">Wife (மனைவி)</option>
                    <option value="Son">Son (மகன்)</option>
                    <option value="Daughter">Daughter (மகள்)</option>
                    <option value="Husband">Husband (கணவர்)</option>
                    <option value="Father">Father (தந்தை)</option>
                    <option value="Mother">Mother (தாய்)</option>
                    <option value="Brother">Brother (சகோதரர்)</option>
                    <option value="Sister">Sister (சகோதரி)</option>
                    <option value="Other">Other Relative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Age *' : 'வயது *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="110"
                    placeholder="e.g. 26"
                    value={newFam.age}
                    onChange={(e) => setNewFam({ ...newFam, age: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Gender' : 'பாலினம்'}
                  </label>
                  <select
                    value={newFam.gender}
                    onChange={(e) => setNewFam({ ...newFam, gender: e.target.value as any })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="female">Female (பெண்)</option>
                    <option value="male">Male (ஆண்)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Blood Group' : 'இரத்த வகை'}
                  </label>
                  <select
                    value={newFam.bloodGroup}
                    onChange={(e) => setNewFam({ ...newFam, bloodGroup: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option>O+ve</option>
                    <option>A+ve</option>
                    <option>B+ve</option>
                    <option>AB+ve</option>
                    <option>O-ve</option>
                    <option>A-ve</option>
                    <option>B-ve</option>
                    <option>AB-ve</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Mobile Phone' : 'கைபேசி'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98401..."
                    value={newFam.phone}
                    onChange={(e) => setNewFam({ ...newFam, phone: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Profession / Occupation' : 'தொழில் / படிப்பு'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, B.Tech Final Year, Homemaker"
                    value={newFam.profession}
                    onChange={(e) => setNewFam({ ...newFam, profession: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Email Address' : 'மின்னஞ்சல்'}
                  </label>
                  <input
                    type="email"
                    placeholder="member@gmail.com"
                    value={newFam.email}
                    onChange={(e) => setNewFam({ ...newFam, email: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Add into Member Family' : 'குடும்ப பட்டியலில் சேர்'}</span>
              </button>
            </form>
          )}

          {/* Mode 2: Link Existing Address Book Member */}
          {mode === 'link' && (
            <form onSubmit={handleLinkExistingMember} className="space-y-3 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1.5 mb-2">
                <GitFork className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Select an existing registered member from the Address Book to link as a family member:'
                    : 'முகவரி புத்தகத்தில் ஏற்கனவே உள்ள உறுப்பினரை குடும்ப உறவாக இணைக்கவும்:'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Select Registered Member *' : 'பதிவு செய்த உறுப்பினரைத் தேர்வுசெய்க *'}
                  </label>
                  <select
                    required
                    value={selectedExistingMemberId}
                    onChange={(e) => setSelectedExistingMemberId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="">-- Choose Member from Directory --</option>
                    {potentialLinkableMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.membershipCode}) - {m.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Relationship to Head of Household *' : 'குடும்பத் தலைவருடனான உறவு *'}
                  </label>
                  <select
                    value={linkRelationship}
                    onChange={(e) => setLinkRelationship(e.target.value as FamilyRelationship)}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                  >
                    <option value="Son">Son (மகன்)</option>
                    <option value="Daughter">Daughter (மகள்)</option>
                    <option value="Wife">Wife (மனைவி)</option>
                    <option value="Husband">Husband (கணவர்)</option>
                    <option value="Father">Father (தந்தை)</option>
                    <option value="Mother">Mother (தாய்)</option>
                    <option value="Brother">Brother (சகோதரர்)</option>
                    <option value="Sister">Sister (சகோதரி)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedExistingMemberId}
                className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Link className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Link Member as Family' : 'உறுப்பினரை குடும்பத்தில் இணை'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'en' ? 'Updates will immediately reflect in the Address Book and Family Tree.' : 'விவரங்கள் முகவரி புத்தகம் மற்றும் குடும்ப மரத்தில் உடனடியாகப் புதுப்பிக்கப்படும்.'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {language === 'en' ? 'Cancel' : 'ரத்து'}
            </button>
            <button
              type="button"
              id="btn-save-family-details"
              onClick={handleFinalSave}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Save & Sync Family' : 'சேமி & குடும்ப மரம் இணை'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
