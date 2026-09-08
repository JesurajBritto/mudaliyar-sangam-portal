import React, { useState } from 'react';
import {
  Users,
  Lock,
  Unlock,
  Phone,
  Mail,
  Building2,
  Heart,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  Send,
  Clock,
  CheckCircle2,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitBranch,
  Smartphone
} from 'lucide-react';
import { Language, MemberAddressEntry, AddressPrivacyLevel } from '../../types';
import { maskPhoneNumber, maskAddress } from '../../data/addressBookData';

interface MemberCardProps {
  language: Language;
  member: MemberAddressEntry;
  activeRole: 'member' | 'super_admin';
  matchesMobileSearch?: boolean;
  effectiveSearch?: string;
  onRequestAccess: (member: MemberAddressEntry) => void;
  onOpenFamilyModal: (member: MemberAddressEntry) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  language,
  member,
  activeRole,
  matchesMobileSearch = false,
  effectiveSearch = '',
  onRequestAccess,
  onOpenFamilyModal,
}) => {
  const [isFamilyExpanded, setIsFamilyExpanded] = useState<boolean>(true);

  const isFullUnlocked =
    activeRole === 'super_admin' ||
    member.privacyLevel === 'public_to_members' ||
    member.isUnlockedForViewer;

  const masked = maskAddress(
    member.doorNumber,
    member.streetName,
    member.areaLocality,
    member.city,
    member.district,
    member.pincode
  );

  const familyCount = member.familyMembers?.length || 0;

  return (
    <div
      id={`member-card-${member.id}`}
      className={`rounded-2xl p-5 transition-all border ${
        matchesMobileSearch
          ? 'ring-2 ring-emerald-500/80 bg-white dark:bg-zinc-900 border-emerald-400 shadow-md'
          : isFullUnlocked
          ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
          : 'bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80'
      }`}
    >
      {/* Mobile Search Match Highlight Banner */}
      {matchesMobileSearch && (
        <div className="mb-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {language === 'en'
              ? `Matched Mobile: "${effectiveSearch}"`
              : `கைபேசி எண் பொருத்தம்: "${effectiveSearch}"`}
          </span>
          <span className="font-mono text-[11px] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
            {member.phone}
          </span>
        </div>
      )}

      {/* Card Header: Avatar, Name, Age, Branch, Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {member.fullName}
              </h3>
              {member.age && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  {member.age} Yrs
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {member.membershipCode}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              {member.fullNameTa}
            </p>
            {member.branch && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                <GitBranch className="w-3 h-3 text-emerald-600" />
                {member.branch}
              </span>
            )}
          </div>
        </div>

        {/* Privacy & Admin Status Pill */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {activeRole === 'super_admin' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              <ShieldAlert className="w-3 h-3" />
              {language === 'en' ? 'Super Admin' : 'சூப்பர் அட்மின்'}
            </span>
          ) : isFullUnlocked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Unlock className="w-3 h-3" />
              {member.privacyLevel === 'public_to_members'
                ? (language === 'en' ? 'Public' : 'பொதுவானது')
                : (language === 'en' ? 'Approved' : 'அனுமதிக்கப்பட்டது')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              <Lock className="w-3 h-3" />
              {language === 'en' ? 'Masked' : 'மறைக்கப்பட்டது'}
            </span>
          )}
        </div>
      </div>

      {/* Member Key Attributes: Profession, Blood Group, Email, Phone */}
      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Profession' : 'தொழில் / பணி'}:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
            {member.occupation || 'Professional'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Blood Group' : 'இரத்த வகை'}:</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">
            {member.bloodGroup || 'Not Disclosed'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'Email ID' : 'மின்னஞ்சல்'}:</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate block font-mono text-[11px]">
            {member.email || 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">{language === 'en' ? 'District / City' : 'மாவட்டம் / நகரம்'}:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
            {member.city}, {member.district}
          </span>
        </div>
      </div>

      {/* Address & Mobile Number Block (Unmasked vs Masked) */}
      <div className="mt-3.5 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2.5">
        {/* Mobile Number Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400">{language === 'en' ? 'Mobile Phone:' : 'கைபேசி எண்:'}</span>
            <span
              className={`font-mono ${
                isFullUnlocked ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500'
              }`}
            >
              {isFullUnlocked ? member.phone : maskPhoneNumber(member.phone)}
            </span>
          </div>

          {/* Call/WhatsApp Shortcuts if Unlocked */}
          {isFullUnlocked && (
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${member.phone.replace(/\s+/g, '')}`}
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 border border-zinc-200 dark:border-zinc-600 shadow-2xs"
                title="Call Member"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 border border-zinc-200 dark:border-zinc-600 shadow-2xs"
                title="WhatsApp Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Physical Address Row */}
        <div className="text-xs">
          <div className="flex items-start gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block mb-0.5">
                {language === 'en' ? 'Address Details:' : 'முகவரி விவரங்கள்:'}
              </span>
              {isFullUnlocked ? (
                <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                  {member.doorNumber}, {member.streetName}, {member.areaLocality}, {member.city}, {member.district} - {member.pincode}, {member.state}
                </p>
              ) : (
                <div className="space-y-0.5">
                  <p className="font-mono text-zinc-400 dark:text-zinc-500 italic">
                    {masked.maskedAddressLine}
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {masked.publicLocation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Family Details Accordion & Manager */}
      <div className="mt-3.5 p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsFamilyExpanded(!isFamilyExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-200 hover:text-purple-700"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>
              {language === 'en'
                ? `Family Members (${familyCount})`
                : `குடும்ப உறுப்பினர்கள் (${familyCount})`}
            </span>
            {isFamilyExpanded ? <ChevronUp className="w-3 h-3 text-purple-600" /> : <ChevronDown className="w-3 h-3 text-purple-600" />}
          </button>

          <button
            type="button"
            onClick={() => onOpenFamilyModal(member)}
            className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-3 h-3" />
            <span>{language === 'en' ? '+ Add / Manage Family' : '+ குடும்பத்தை நிர்வகிக்க'}</span>
          </button>
        </div>

        {isFamilyExpanded && (
          <div className="space-y-1.5 pt-1">
            {familyCount === 0 ? (
              <p className="text-[11px] text-zinc-500 italic">
                {language === 'en'
                  ? 'No family members listed yet. Tap "+ Add / Manage Family" to add wife, son, daughter.'
                  : 'குடும்ப உறுப்பினர்கள் சேர்க்கப்படவில்லை. சேர்க்க "+ குடும்பத்தை நிர்வகிக்க" தொடவும்.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {member.familyMembers?.map((fam) => (
                  <div
                    key={fam.id}
                    className="p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-purple-100 dark:border-zinc-700 text-[11px] flex items-center justify-between gap-1 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {fam.fullName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          {fam.relationship}
                        </span>
                      </div>
                      <span className="text-zinc-500 block text-[10px]">
                        Age: <strong>{fam.age} Yrs</strong> • {fam.profession || 'N/A'} {fam.bloodGroup ? `• ${fam.bloodGroup}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: Request Access Button */}
      {!isFullUnlocked && (
        <div className="mt-3.5 flex items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>
              {language === 'en'
                ? 'Member permission required to view full contact'
                : 'முழு முகவரி காண உறுப்பினர் ஒப்புதல் தேவை'}
            </span>
          </div>

          {member.requestStatus === 'pending' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              {language === 'en' ? 'Pending Approval' : 'ஒப்புதலுக்கு காத்திருக்கிறது'}
            </span>
          ) : (
            <button
              type="button"
              id={`btn-request-${member.id}`}
              onClick={() => onRequestAccess(member)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <Send className="w-3 h-3" />
              {language === 'en' ? 'Request Full Details' : 'முழு விவரங்களைக் கோருக'}
            </button>
          )}
        </div>
      )}

      {isFullUnlocked && (
        <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>
            {language === 'en'
              ? 'Full contact details available for Sangam member communication'
              : 'சங்கத் தொடர்புக்கு முழு முகவரி அனுமதிக்கப்பட்டுள்ளது'}
          </span>
        </div>
      )}
    </div>
  );
};
