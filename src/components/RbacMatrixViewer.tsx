import React from 'react';
import { Language } from '../types';
import { RBAC_ROLES } from '../data/rbacData';
import { ShieldCheck, EyeOff, Lock, FileKey, History, UserCheck, BookUser } from 'lucide-react';

interface RbacMatrixViewerProps {
  language: Language;
}

export const RbacMatrixViewer: React.FC<RbacMatrixViewerProps> = ({ language }) => {
  const getPermissionBadge = (val: string) => {
    if (val === 'No' || val === 'None') {
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium';
    }
    if (val === 'Full Access' || val === 'Manage' || val === 'Manage Tiers & Invoices' || val === 'Full Contact & Horoscope') {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold';
    }
    if (val === 'Moderate' || val === 'District Level' || val === 'Moderate & Pin') {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-medium';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  };

  const securityProtocols = [
    {
      icon: <EyeOff className="w-4 h-4 text-amber-600" />,
      title: 'PII Masking & Tokenization',
      titleTa: 'தனிநபர் தகவல் மறைப்பு (Masking)',
      desc: 'Government ID proofs (Aadhaar, Voter ID) are masked on the client before submission. Only the last 4 digits are stored in plain text. Raw PDFs/images are encrypted at rest with AES-256.',
    },
    {
      icon: <FileKey className="w-4 h-4 text-blue-600" />,
      title: 'Dynamic Photo Watermarking',
      titleTa: 'தானியங்கி புகைப்பட வாட்டர்மார்க்',
      desc: 'All matrimonial photos served to verified viewers are dynamically stamped with a translucent watermark containing the viewer’s Sangam Member ID and access timestamp, rendering unauthorized screenshots traceable.',
    },
    {
      icon: <Lock className="w-4 h-4 text-emerald-600" />,
      title: 'Time-Limited S3 Pre-Signed URLs',
      titleTa: 'வரையறுக்கப்பட்ட நேர கிளவுட் இணைப்புகள்',
      desc: 'Horoscope charts and member identity documents are NEVER served via public URLs. The API generates temporary AWS S3 / Cloud Storage pre-signed URLs valid for exactly 15 minutes.',
    },
    {
      icon: <History className="w-4 h-4 text-purple-600" />,
      title: 'Immutable Administrative Audit Trail',
      titleTa: 'நிர்வாக தணிக்கை பதிவு (Audit Logs)',
      desc: 'Every administrative action—approving a member, rejecting an ID document, accessing a contact number, or issuing a broadcast—is permanently logged with IP address and cryptographic timestamp.',
    },
    {
      icon: <BookUser className="w-4 h-4 text-amber-600" />,
      title: 'Address Book Consent & Bilateral Unmasking (DPDP 2023)',
      titleTa: 'முகவரி புத்தகம் & இருதரப்பு ஒப்புதல் வழிமுறை',
      desc: 'Member door numbers, street addresses, and mobile numbers are stored during registration and partially masked by default. Members have complete autonomy to either enable open access for verified members or mandate a "Request to Unlock" button with member approval.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {language === 'en'
              ? 'Role-Based Access Control (RBAC) & Privacy Matrix'
              : 'பங்கு சார்ந்த அணுகல் கட்டுப்பாடு மற்றும் தனியுரிமை கட்டமைப்பு'}
          </h2>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1 max-w-2xl">
          {language === 'en'
            ? 'Enforces data boundaries across 7 user tiers, protecting sensitive matrimonial data, personal phone numbers, and financial donor records.'
            : '7 அடுக்கு பயனர் அனுமதிகள் மூலம் திருமண வரன் தகவல்கள், தொலைபேசி எண்கள் மற்றும் நிதிப் பதிவுகளை பாதுகாத்தல்.'}
        </p>
      </div>

      {/* RBAC Table Matrix */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            {language === 'en' ? 'Permission Matrix Across App Modules' : 'செயலி தொகுதிகளுக்கான அனுமதி அட்டவணை'}
          </h3>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">7 Roles Defined</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 font-bold">
                <th className="py-3 px-4 font-bold">Role Tier</th>
                <th className="py-3 px-4 font-bold">Member Directory</th>
                <th className="py-3 px-4 font-bold">Matrimonial Hub</th>
                <th className="py-3 px-4 font-bold">Events & Archives</th>
                <th className="py-3 px-4 font-bold">Community Forum</th>
                <th className="py-3 px-4 font-bold">Admin Dashboard</th>
                <th className="py-3 px-4 font-bold">Financials & 80G</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {RBAC_ROLES.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${r.badgeColor}`}>
                      {language === 'en' ? r.name : r.nameTa}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.directory)}`}>
                      {r.permissions.directory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.matrimony)}`}>
                      {r.permissions.matrimony}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.events)}`}>
                      {r.permissions.events}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.forum)}`}>
                      {r.permissions.forum}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.adminDashboard)}`}>
                      {r.permissions.adminDashboard}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded ${getPermissionBadge(r.permissions.financials)}`}>
                      {r.permissions.financials}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Descriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RBAC_ROLES.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {language === 'en' ? r.name : r.nameTa}
              </h4>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              {r.description}
            </p>
          </div>
        ))}
      </div>

      {/* Security & Data Privacy Safeguards */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          {language === 'en'
            ? 'Mandatory Data Privacy Safeguards (DPDP Act 2023 Compliant)'
            : 'கட்டாய தரவு பாதுகாப்பு வழிமுறைகள்'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityProtocols.map((sec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {sec.icon}
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {language === 'en' ? sec.title : sec.titleTa}
                </h4>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
