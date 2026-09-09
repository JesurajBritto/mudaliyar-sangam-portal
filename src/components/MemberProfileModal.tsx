import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Phone,
  Droplet,
  Briefcase,
  Building,
  ShieldCheck,
  Edit3,
  Check,
  LogOut,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { AuthUser, Language } from '../types';
import { DigitalMemberSmartCard } from './DigitalMemberSmartCard';
import { updateMemberProfile } from '../data/authData';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  language: Language;
  onUpdateUser: (updatedUser: AuthUser) => void;
  onLogout: () => void;
  onOpenSwitchAccount?: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onUpdateUser,
  onLogout,
  onOpenSwitchAccount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [editFullName, setEditFullName] = useState(currentUser?.fullName || '');
  const [editFullNameTa, setEditFullNameTa] = useState(currentUser?.fullNameTa || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editBloodGroup, setEditBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [editOccupation, setEditOccupation] = useState(currentUser?.occupation || '');
  const [editNativePlace, setEditNativePlace] = useState(currentUser?.nativePlace || '');
  const [editDoorNumber, setEditDoorNumber] = useState(currentUser?.doorNumber || '');
  const [editStreetName, setEditStreetName] = useState(currentUser?.streetName || '');
  const [editAreaLocality, setEditAreaLocality] = useState(currentUser?.areaLocality || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || '');
  const [editPincode, setEditPincode] = useState(currentUser?.pincode || '');

  // Keep state synchronized if user changes
  React.useEffect(() => {
    if (currentUser) {
      setEditFullName(currentUser.fullName);
      setEditFullNameTa(currentUser.fullNameTa || '');
      setEditPhone(currentUser.phone);
      setEditBloodGroup(currentUser.bloodGroup || 'O+');
      setEditOccupation(currentUser.occupation || '');
      setEditNativePlace(currentUser.nativePlace || '');
      setEditDoorNumber(currentUser.doorNumber || '');
      setEditStreetName(currentUser.streetName || '');
      setEditAreaLocality(currentUser.areaLocality || '');
      setEditCity(currentUser.city || '');
      setEditDistrict(currentUser.district || '');
      setEditPincode(currentUser.pincode || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AuthUser = {
      ...currentUser,
      fullName: editFullName.trim() || currentUser.fullName,
      fullNameTa: editFullNameTa.trim() || currentUser.fullNameTa,
      phone: editPhone.trim() || currentUser.phone,
      bloodGroup: editBloodGroup,
      occupation: editOccupation.trim(),
      nativePlace: editNativePlace.trim(),
      doorNumber: editDoorNumber.trim(),
      streetName: editStreetName.trim(),
      areaLocality: editAreaLocality.trim(),
      city: editCity.trim() || currentUser.city,
      district: editDistrict.trim() || currentUser.district,
      pincode: editPincode.trim()
    };

    updateMemberProfile(updated);
    onUpdateUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const fullRegisteredAddress = [
    currentUser.doorNumber,
    currentUser.streetName,
    currentUser.areaLocality,
    currentUser.city,
    currentUser.district,
    currentUser.state || 'Tamil Nadu',
    currentUser.pincode ? `PIN: ${currentUser.pincode}` : ''
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'ta'
                  ? 'உறுப்பினர் சுயவிவரம் & ஸ்மார்ட் அடையாள அட்டை'
                  : 'Member Profile & Digital Smart ID Card'}
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                {currentUser.fullName} • {currentUser.membershipCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ta'
                  ? 'சுயவிவரம் மற்றும் அடையாள அட்டை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
                  : 'Profile and Smart ID Card details updated successfully!'}
              </span>
            </div>
          )}

          {/* Section 1: The Digital Member Smart ID Card */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {language === 'ta' ? 'ஸ்மார்ட் அடையாள அட்டை' : 'Smart ID Card'}
            </h3>
            <DigitalMemberSmartCard user={currentUser} language={language} />
          </div>

          {/* Section 2: Registered Profile & Address Details */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm font-bold text-stone-900">
                  {language === 'ta'
                    ? 'பதிவு செய்யப்பட்ட விவரங்கள் & முகவரி'
                    : 'Registered Details & Address'}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs hover:bg-amber-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>
                  {isEditing
                    ? language === 'ta'
                      ? 'ரத்து செய்'
                      : 'Cancel'
                    : language === 'ta'
                    ? 'விவரங்களை திருத்து'
                    : 'Edit Details'}
                </span>
              </button>
            </div>

            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {language === 'ta' ? 'பெயர் (ஆங்கிலம்)' : 'Full Name (English)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {language === 'ta' ? 'பெயர் (தமிழ்)' : 'Full Name (Tamil)'}
                    </label>
                    <input
                      type="text"
                      value={editFullNameTa}
                      onChange={(e) => setEditFullNameTa(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Phone'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {language === 'ta' ? 'இரத்த வகை' : 'Blood Group'}
                    </label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {language === 'ta' ? 'தொழில் / பணி' : 'Occupation'}
                    </label>
                    <input
                      type="text"
                      value={editOccupation}
                      onChange={(e) => setEditOccupation(e.target.value)}
                      placeholder="Business / Professional"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                    />
                  </div>
                </div>

                {/* Address Inputs */}
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    {language === 'ta' ? 'முழு முகவரி விவரங்கள்' : 'Address Details'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {language === 'ta' ? 'கதவு எண்' : 'Door / Flat Number'}
                      </label>
                      <input
                        type="text"
                        value={editDoorNumber}
                        onChange={(e) => setEditDoorNumber(e.target.value)}
                        placeholder="No. 12/4"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {language === 'ta' ? 'தெரு பெயர்' : 'Street Name'}
                      </label>
                      <input
                        type="text"
                        value={editStreetName}
                        onChange={(e) => setEditStreetName(e.target.value)}
                        placeholder="Gandhi Salai"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {language === 'ta' ? 'நகரம் / ஊர்' : 'City / Town'}
                      </label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {language === 'ta' ? 'மாவட்டம்' : 'District'}
                      </label>
                      <input
                        type="text"
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {language === 'ta' ? 'அஞ்சல் குறியீடு' : 'Pincode'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-200 cursor-pointer"
                  >
                    {language === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'ta' ? 'சேமிக்க' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only Display */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      {language === 'ta' ? 'உறுப்பினர் எண் & நிலை' : 'Member ID & Role'}
                    </span>
                    <p className="font-mono font-bold text-stone-900 mt-0.5">
                      {currentUser.membershipCode}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      {currentUser.role === 'super_admin'
                        ? 'Apex Council Admin'
                        : currentUser.role === 'branch_admin'
                        ? 'Branch Officer'
                        : 'Life Member'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      {language === 'ta' ? 'மொபைல் & இரத்த வகை' : 'Phone & Blood Group'}
                    </span>
                    <p className="font-mono font-bold text-stone-900 mt-0.5">
                      {currentUser.phone}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                      Blood: {currentUser.bloodGroup || 'O+'}
                    </span>
                  </div>
                </div>

                {/* Complete Address Box */}
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {language === 'ta' ? 'முழு பதிவு செய்யப்பட்ட முகவரி' : 'Full Registered Address'}
                  </span>
                  <p className="text-xs font-semibold text-stone-900 leading-relaxed">
                    {fullRegisteredAddress || `${currentUser.district}, Tamil Nadu`}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-600 pt-2 border-t border-stone-100">
                    <span>
                      {language === 'ta' ? 'கிளை:' : 'Branch:'} <strong>{currentUser.branch || `${currentUser.district} Branch`}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {language === 'ta' ? 'தொழில்:' : 'Occupation:'} <strong>{currentUser.occupation || 'Community Member'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions: Switch Account & Logout */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            {onOpenSwitchAccount && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSwitchAccount();
                }}
                className="px-3 py-2 text-xs font-bold text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'ta' ? '🔄 கணக்கு மாற்று' : '🔄 Switch Demo Account'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வெளியேறு' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
