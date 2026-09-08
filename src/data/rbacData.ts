import { RbacRole } from '../types';

export const RBAC_ROLES: RbacRole[] = [
  {
    id: 'guest',
    name: 'Public / Guest Visitor',
    nameTa: 'பொது பார்வையாளர்',
    badgeColor: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300',
    description: 'Unregistered or logged-out users visiting the Sangam website or mobile app landing screen.',
    permissions: {
      directory: 'None',
      matrimony: 'None',
      events: 'Public Only',
      forum: 'Read Only',
      adminDashboard: 'No',
      financials: 'No'
    }
  },
  {
    id: 'pending_member',
    name: 'Pending Verification Member',
    nameTa: 'சரிபார்ப்பு நிலுவையிலுள்ள உறுப்பினர்',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
    description: 'Registered via phone OTP, currently waiting for Area Coordinator to inspect ID proof and confirm lineage.',
    permissions: {
      directory: 'Limited',
      matrimony: 'View Profiles',
      events: 'Register & View',
      forum: 'Read Only',
      adminDashboard: 'No',
      financials: 'View Own Receipts'
    }
  },
  {
    id: 'verified_member',
    name: 'Verified Sangam Member',
    nameTa: 'அங்கீகரிக்கப்பட்ட உறுப்பினர்',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
    description: 'Fully verified community member with official Membership Code. Has access to directory, blood donor pool, and events.',
    permissions: {
      directory: 'Full Read',
      matrimony: 'View Profiles',
      events: 'Register & View',
      forum: 'Post & Reply',
      adminDashboard: 'No',
      financials: 'View Own Receipts'
    }
  },
  {
    id: 'premium_matrimony',
    name: 'Matrimonial Premium Subscriber',
    nameTa: 'திருமண பிரீமியம் சந்தாதாரர்',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300',
    description: 'Verified member who activated active recurring subscription for unrestricted matrimonial contact exchanges and horoscope matchings.',
    permissions: {
      directory: 'Full Read',
      matrimony: 'Full Contact & Horoscope',
      events: 'Register & View',
      forum: 'Post & Reply',
      adminDashboard: 'No',
      financials: 'View Own Receipts'
    }
  },
  {
    id: 'area_moderator',
    name: 'District / Taluk Coordinator',
    nameTa: 'மாவட்ட / வட்ட ஒருங்கிணைப்பாளர்',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
    description: 'Elected or designated district representative tasked with verifying local member ID documents, vetting forum posts, and moderating local branch feeds.',
    permissions: {
      directory: 'Manage',
      matrimony: 'Moderate',
      events: 'Manage & Archive',
      forum: 'Moderate & Pin',
      adminDashboard: 'District Level',
      financials: 'View Own Receipts'
    }
  },
  {
    id: 'sangam_admin',
    name: 'Sangam Executive Admin',
    nameTa: 'சங்க நிர்வாக அதிகாரி',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300',
    description: 'Executive committee member handling statewide announcements, payment tier audits, event archiving, and official circulars.',
    permissions: {
      directory: 'Manage',
      matrimony: 'Moderate',
      events: 'Manage & Archive',
      forum: 'Moderate & Pin',
      adminDashboard: 'Full Access',
      financials: 'Manage Tiers & Invoices'
    }
  },
  {
    id: 'super_admin',
    name: 'Board of Trustees / Super Admin',
    nameTa: 'அறங்காவலர் குழு / முதன்மை நிர்வாகி',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
    description: 'Full statutory control. Manages database encryption keys, system-wide audit logs, role promotions, and financial ledger exports.',
    permissions: {
      directory: 'Manage',
      matrimony: 'Moderate',
      events: 'Manage & Archive',
      forum: 'Moderate & Pin',
      adminDashboard: 'Full Access',
      financials: 'Manage Tiers & Invoices'
    }
  }
];
