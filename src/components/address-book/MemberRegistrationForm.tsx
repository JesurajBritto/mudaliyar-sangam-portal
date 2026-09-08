import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Building2,
  Users,
  AlertTriangle
} from 'lucide-react';
import {
  Language,
  MemberAddressEntry,
  AddressPrivacyLevel
} from '../../types';
import { checkDuplicateMember } from '../../data/addressBookData';

interface MemberRegistrationFormProps {
  language: Language;
  existingMembers: MemberAddressEntry[];
  onRegisterMember: (newEntry: MemberAddressEntry) => void;
  onCancel: () => void;
}

export const MemberRegistrationForm: React.FC<MemberRegistrationFormProps> = ({
  language,
  existingMembers,
  onRegisterMember,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameTa: '',
    age: '' as number | '',
    gender: 'male' as 'male' | 'female' | 'other',
    occupation: '',
    bloodGroup: 'O+ve',
    branch: 'Chennai Central Branch',
    phone: '',
    email: '',
    doorNumber: '',
    streetName: '',
    areaLocality: '',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    privacyLevel: 'request_only' as AddressPrivacyLevel,
  });

  // Real-time Duplicate Check
  const duplicateResult = useMemo(() => {
    if (!formData.fullName && !formData.phone && !formData.email) {
      return { isDuplicate: false };
    }
    return checkDuplicateMember(
      {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        doorNumber: formData.doorNumber,
        streetName: formData.streetName,
        city: formData.city,
        pincode: formData.pincode,
      },
      existingMembers
    );
  }, [
    formData.fullName,
    formData.phone,
    formData.email,
    formData.doorNumber,
    formData.streetName,
    formData.city,
    formData.pincode,
    existingMembers,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    const districtPrefix = (formData.district || 'CHN').slice(0, 3).toUpperCase();
    const newEntry: MemberAddressEntry = {
      id: `mem-${Date.now()}`,
      fullName: formData.fullName,
      fullNameTa: formData.fullNameTa || formData.fullName,
      age: formData.age ? Number(formData.age) : 35,
      gender: formData.gender,
      membershipCode: `MUD-${districtPrefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      occupation: formData.occupation || 'Professional / Self-Employed',
      bloodGroup: formData.bloodGroup,
      branch: formData.branch || `${formData.district} Branch`,
      phone: formData.phone,
      email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      doorNumber: formData.doorNumber || '10',
      streetName: formData.streetName || 'Main Road',
      areaLocality: formData.areaLocality || 'Town Center',
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      familyMembers: [],
      privacyLevel: formData.privacyLevel,
      isUnlockedForViewer: formData.privacyLevel === 'public_to_members',
      requestStatus: 'none',
    };

    onRegisterMember(newEntry);
  };

  const branches = [
    'Chennai Central Branch',
    'Kanchipuram North Branch',
    'Vellore Fort Branch',
    'Kongu Coimbatore Branch',
    'Madurai Meenakshi Branch',
    'Tiruvannamalai Hill Branch',
    'Chidambaram Port Branch',
    'Salem Textile Branch',
    'Tiruchirappalli Rockfort Branch'
  ];

  const districts = [
    'Chennai',
    'Kanchipuram',
    'Vellore',
    'Coimbatore',
    'Madurai',
    'Tiruvannamalai',
    'Cuddalore',
    'Salem',
    'Tiruchirappalli',
    'Tiruvallur',
    'Ranipet',
    'Chengalpattu'
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
            <UserPlus className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {language === 'en'
                ? 'Member Registration & Address Book Entry'
                : 'புதிய அங்கத்தினர் பதிவு & முகவரி புத்தகம்'}
            </h3>
            <p className="text-xs text-zinc-500">
              {language === 'en'
                ? 'Register member with Age, Profession, Blood Group, Mobile, Email, and City address.'
                : 'வயது, தொழில், இரத்த வகை, கைபேசி, மின்னஞ்சல் மற்றும் நகர முகவரி விவரங்களுடன் பதிவு செய்யவும்.'}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Duplicate Detection Notice Banner */}
      {duplicateResult.isDuplicate && duplicateResult.matchedMember && (
        <div
          id="duplicate-member-alert"
          className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-sm text-rose-700 dark:text-rose-300">
              {language === 'en' ? '⚠️ Member Already Registered!' : '⚠️ உறுப்பினர் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளார்!'}
            </p>
            <p className="leading-relaxed">
              {language === 'en' ? duplicateResult.reason : duplicateResult.reasonTa}
            </p>
            <div className="mt-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800 text-[11px] space-y-0.5">
              <span className="font-bold text-zinc-900 dark:text-white block">
                {duplicateResult.matchedMember.fullName} ({duplicateResult.matchedMember.membershipCode})
              </span>
              <span className="text-zinc-500 block">
                Mobile: {duplicateResult.matchedMember.phone} • Branch: {duplicateResult.matchedMember.branch} • {duplicateResult.matchedMember.city}
              </span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Primary Member Personal & Contact Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            {language === 'en' ? '1. Primary Member Information' : '1. முதன்மை உறுப்பினர் விவரங்கள்'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Full Name (English) *' : 'முழு பெயர் (ஆங்கிலம்) *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. S. Arulmozhi Mudaliyar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Full Name (Tamil)' : 'முழு பெயர் (தமிழ்)'}
              </label>
              <input
                type="text"
                placeholder="எ.கா. செ. அருள்மொழி முதலியார்"
                value={formData.fullNameTa}
                onChange={(e) => setFormData({ ...formData, fullNameTa: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Age *' : 'வயது *'}
              </label>
              <input
                type="number"
                required
                min="18"
                max="120"
                placeholder="e.g. 52"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Gender' : 'பாலினம்'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="male">Male (ஆண்)</option>
                <option value="female">Female (பெண்)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Blood Group' : 'இரத்த வகை'}
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
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
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Sangam Branch *' : 'சங்க கிளை *'}
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Profession / Occupation *' : 'தொழில் / பதவி *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Silk Merchant / Cardiologist / Advocate"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Mobile Number (Primary) *' : 'கைபேசி எண் *'}
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98401 23456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {language === 'en' ? 'Email ID Address' : 'மின்னஞ்சல் முகவரி'}
              </label>
              <input
                type="email"
                placeholder="member@sangam.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Physical Address Section */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            {language === 'en' ? '2. Physical Address Details' : '2. வசிக்கும் முகவரி விவரங்கள்'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'Door / Flat No.' : 'வீடு / கதவு எண்'}
              </label>
              <input
                type="text"
                placeholder="e.g. Door No. 12/4"
                value={formData.doorNumber}
                onChange={(e) => setFormData({ ...formData, doorNumber: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'Street Name' : 'தெரு பெயர்'}
              </label>
              <input
                type="text"
                placeholder="e.g. 2nd Avenue, Shanthi Colony"
                value={formData.streetName}
                onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'Area / Locality' : 'பகுதி'}
              </label>
              <input
                type="text"
                placeholder="e.g. Anna Nagar West"
                value={formData.areaLocality}
                onChange={(e) => setFormData({ ...formData, areaLocality: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'City / Town' : 'நகரம்'}
              </label>
              <input
                type="text"
                placeholder="e.g. Chennai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'District' : 'மாவட்டம்'}
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                {language === 'en' ? 'Pincode' : 'அஞ்சல் குறியீடு'}
              </label>
              <input
                type="text"
                placeholder="600040"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Family Tree Hub Lineage Notice */}
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
              {language === 'en'
                ? '3. Family Tree & Lineage Management'
                : '3. குடும்ப மர வம்சாவளி மேலாண்மை'}
            </h4>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {language === 'en'
              ? 'Family details (Spouse, Children, Parents, In-laws) and multi-generation tree lineage are managed under the dedicated "Family Tree" hub after registration.'
              : 'குடும்ப உறுப்பினர்கள் (மனைவி, பிள்ளைகள், பெற்றோர்) மற்றும் தலைமுறை வம்சாவளி விவரங்கள் "Family Tree" பிரிவில் முழுமையாக நிர்வகிக்கப்படும்.'}
          </p>
        </div>

        {/* 4. Privacy Policy Setting */}
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 space-y-2">
          <label className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
            {language === 'en' ? 'Address & Mobile Privacy Choice (DPDP 2023):' : 'முகவரி & தொடர்பு பாதுகாப்பு நிலை:'}
          </label>
          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacyLevel"
                value="request_only"
                checked={formData.privacyLevel === 'request_only'}
                onChange={() => setFormData({ ...formData, privacyLevel: 'request_only' })}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-zinc-900 dark:text-white block">
                  {language === 'en'
                    ? 'Partially Masked (Default) — Other members must send request to unmask'
                    : 'இயல்பாக மறைக்கப்படுதல் — மற்ற உறுப்பினர்கள் கோரிக்கை அனுப்ப வேண்டும்'}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                  {language === 'en'
                    ? 'Door number, street name, and phone digits remain protected until you click Approve.'
                    : 'கதவு எண், தெரு மற்றும் தொலைபேசி எண்கள் பாதுகாப்பாக மறைக்கப்படும்.'}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacyLevel"
                value="public_to_members"
                checked={formData.privacyLevel === 'public_to_members'}
                onChange={() => setFormData({ ...formData, privacyLevel: 'public_to_members' })}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-zinc-900 dark:text-white block">
                  {language === 'en'
                    ? 'Public to Verified Sangam Members directly'
                    : 'சரிபார்க்கப்பட்ட அனைத்து உறுப்பினர்களுக்கும் நேரடியாக காட்டுக'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            id="btn-submit-registration"
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'en' ? 'Register & Save to Address Book' : 'பதிவு செய்து முகவரி புத்தகத்தில் சேமி'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            {language === 'en' ? 'Cancel' : 'ரத்து'}
          </button>
        </div>
      </form>
    </div>
  );
};
