export type TabType =
  | 'home'
  | 'admin-management'
  | 'address-book'
  | 'association-members'
  | 'digital-id'
  | 'family-tree'
  | 'matrimonial'
  | 'youth-career'
  | 'business-ads'
  | 'donations'
  | 'checklist'
  | 'schema'
  | 'api'
  | 'rbac'
  | 'architecture';

export type Language = 'en' | 'ta';

export type UserRole = 'guest' | 'member' | 'branch_admin' | 'super_admin';

export interface AuthUser {
  id: string;
  fullName: string;
  fullNameTa?: string;
  phone: string;
  email?: string;
  membershipCode: string;
  role: UserRole;
  position?: string;
  positionTa?: string;
  branch: string;
  district: string;
  city?: string;
  doorNumber?: string;
  streetName?: string;
  areaLocality?: string;
  state?: string;
  pincode?: string;
  age?: number | string;
  gender?: 'male' | 'female' | 'other';
  privacyLevel?: AddressPrivacyLevel;
  nativePlace?: string;
  kulamGotram?: string;
  occupation?: string;
  bloodGroup?: string;
  joinedDate?: string;
  isVerified?: boolean;
}

export type AddressPrivacyLevel = 'public_to_members' | 'request_only';

export type FamilyRelationship =
  | 'Wife'
  | 'Husband'
  | 'Son'
  | 'Daughter'
  | 'Father'
  | 'Mother'
  | 'Brother'
  | 'Sister'
  | 'Spouse'
  | 'Other';

export interface FamilyMemberDetail {
  id: string;
  fullName: string;
  fullNameTa?: string;
  relationship: FamilyRelationship;
  age: number | string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  profession?: string;
  bloodGroup?: string;
  existingMemberId?: string; // If already a registered member in the address book
  membershipCode?: string;
  notes?: string;
}

export interface MemberAddressEntry {
  id: string;
  fullName: string;
  fullNameTa: string;
  age?: number | string;
  gender?: 'male' | 'female' | 'other';
  membershipCode: string;
  occupation: string; // Profession
  bloodGroup: string;
  branch: string; // Sangam Branch (e.g. Chennai Central, Kanchipuram North, etc.)
  // Contact & Address Details
  phone: string;
  email: string;
  doorNumber: string;
  streetName: string;
  areaLocality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  // Family Members linked to this head of household
  familyMembers?: FamilyMemberDetail[];
  // Privacy configuration
  privacyLevel: AddressPrivacyLevel;
  // Access state for current viewing user
  isUnlockedForViewer?: boolean;
  requestStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  // Backward compatibility optional fields
  subSect?: string;
  gotramKulam?: string;
  kulaDeivam?: string;
  nativePlaceOor?: string;
  nativeDistrict?: string;
}

export interface AddressAccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterNativePlace: string;
  targetMemberId: string;
  targetMemberName: string;
  requestReason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

// Business Advertisement & News Feed Types
export type AdCategory =
  | 'textiles_silks'
  | 'professional_services'
  | 'healthcare_medical'
  | 'catering_events'
  | 'real_estate_construction'
  | 'education_academy'
  | 'manufacturing_trade'
  | 'jewelry_lifestyle'
  | 'other';

export type AdStatus = 'pending_review' | 'approved' | 'rejected';

export type AdPlacement = 'feed_and_main' | 'news_feed_only' | 'featured_banner';

export type BusinessSubscriptionTier = 'none' | 'silver' | 'gold' | 'platinum';

export interface BusinessSubscription {
  hasActiveSubscription: boolean;
  tier: BusinessSubscriptionTier;
  planName: string;
  planNameTa: string;
  validUntil: string;
  maxImagesAllowed: number;
}

export interface BusinessAdvertisement {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  businessName: string;
  businessNameTa: string;
  category: AdCategory;
  adTitle: string;
  adTitleTa: string;
  description: string;
  descriptionTa: string;
  imageUrl: string; // primary cover image
  images: string[]; // up to 5 slide images
  phone: string;
  whatsapp?: string;
  email?: string;
  websiteUrl?: string;
  city: string;
  district: string;
  specialOffer?: string;
  specialOfferTa?: string;
  placement: AdPlacement;
  status: AdStatus;
  rejectionReason?: string;
  adminReviewerName?: string;
  viewsCount: number;
  clicksCount: number;
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  approvedAt?: string;
}

// Donation & Event Financial Ledger Types
export type PaymentMode = 'UPI' | 'NEFT_RTGS' | 'Cheque' | 'Cash';

export interface DonationEntry {
  id: string;
  receiptNo: string;
  donorName: string;
  donorNameTa: string;
  memberCode: string;
  nativePlaceOor: string;
  gotramKulam: string;
  phone: string;
  amount: number;
  eventId: string;
  eventName: string;
  eventNameTa: string;
  paymentMode: PaymentMode;
  paymentRef?: string;
  date: string;
  panNumber?: string;
  isTaxExempt80G: boolean;
  purpose: string;
  purposeTa: string;
}

export interface FinancialLedgerItem {
  id: string;
  type: 'credit' | 'debit'; // credit = வரவு, debit = பற்று / செலவு
  category: string;
  categoryTa: string;
  description: string;
  descriptionTa: string;
  amount: number;
  voucherNo: string;
  date: string;
  vendorOrDonor: string;
  approvedBy: string;
}

export interface SangamEventFinance {
  id: string;
  title: string;
  titleTa: string;
  date: string;
  venue: string;
  venueTa: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  totalCredit: number; // மொத்த வரவு
  totalDebit: number;  // மொத்த பற்று / செலவு
  totalSalavu?: number; // backwards compatibility
  netBalance: number;  // மீதி இருப்பு
  treasurerName: string;
  auditedBy: string;
  items: FinancialLedgerItem[];
}

export type ChecklistCategory =
  | 'demographics'
  | 'features'
  | 'techstack'
  | 'security'
  | 'hosting'
  | 'git'
  | 'scalability'
  | 'uiux'
  | 'comms'
  | 'legal'
  | 'community'
  | 'matrimonial'
  | 'payments'
  | 'multilingual';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  importance: 'Critical' | 'High' | 'Medium';
  deliverables: string[];
  tips: string;
}

export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignRef?: string;
  isPII?: boolean;
  description: string;
}

export interface SchemaTable {
  id: string;
  tableName: string;
  module: 'Identity & Auth' | 'Directory & Verification' | 'Matrimony' | 'Events & Archives' | 'Community Feed & Forum' | 'Payments & Subscriptions' | 'System & Audit' | 'Admin & RBAC';
  description: string;
  fields: SchemaField[];
  indexes: string[];
  ddl: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  module: string;
  summary: string;
  summaryTa: string;
  accessRole: string;
  headers: Record<string, string>;
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
  requestBody?: string;
  responseSample: string;
  statusCodes: { code: number; description: string }[];
}

export interface RbacRole {
  id: string;
  name: string;
  nameTa: string;
  badgeColor: string;
  description: string;
  permissions: {
    directory: 'None' | 'Limited' | 'Full Read' | 'Manage';
    matrimony: 'None' | 'View Profiles' | 'Full Contact & Horoscope' | 'Moderate';
    events: 'Public Only' | 'Register & View' | 'Manage & Archive';
    forum: 'Read Only' | 'Post & Reply' | 'Moderate & Pin';
    adminDashboard: 'No' | 'District Level' | 'Full Access';
    financials: 'No' | 'View Own Receipts' | 'Manage Tiers & Invoices';
  };
}

// -------------------------------------------------------------
// 1. Monthly Recurring Auto-Pay Mandate Types (Min ₹100/month)
// -------------------------------------------------------------
export type AutoPayFrequency = 'monthly' | 'quarterly' | 'annually';
export type MandatePaymentMethod = 'UPI_AUTOPAY' | 'ENACH_NETBANKING' | 'DEBIT_CARD_MANDATE';
export type MandateStatus = 'active' | 'paused' | 'cancelled';

export interface MonthlyAutoPayMandate {
  id: string;
  mandateRef: string; // e.g., UMRN-MUD-9024-UPI
  donorName: string;
  donorNameTa: string;
  memberCode: string;
  phone: string;
  monthlyAmount: number; // Minimum 100
  cause: 'general_sangam_corpus' | 'education_scholarship' | 'temple_annadhanam' | 'senior_medical_care';
  causeTa: string;
  paymentMethod: MandatePaymentMethod;
  debitDayOfMonth: number; // e.g., 5th of every month
  nextDebitDate: string;
  status: MandateStatus;
  startedAt: string;
  totalDebitedSoFar: number;
  monthsContributedCount: number;
}

// -------------------------------------------------------------
// 2. Association Member Details (Year-wise, Position, Wing)
// -------------------------------------------------------------
export type CommitteeWing =
  | 'apex_council'
  | 'executive_committee'
  | 'district_convenor'
  | 'youth_wing'
  | 'womens_wing'
  | 'advisory_board';

export interface AssociationMember {
  id: string;
  name: string;
  nameTa: string;
  position: string;
  positionTa: string;
  termYears: string; // e.g. "2024 - 2026", "2022 - 2024", "1951 - 1965"
  wing: CommitteeWing;
  nativePlace: string;
  nativeDistrict: string;
  phone: string;
  email: string;
  occupation: string;
  membershipId: string;
  photoUrl: string;
  achievements: string[];
  achievementsTa: string[];
  isCurrentOfficeBearer: boolean;
}

// -------------------------------------------------------------
// 3. Matrimonial Matchmaking Hub
// -------------------------------------------------------------
export type MatrimonialSubscriptionTier = 'free_basic' | 'premium_monthly' | 'premium_annual';

export interface MatrimonialProfile {
  id: string;
  registrationNo: string;
  fullName: string;
  fullNameTa: string;
  gender: 'bride' | 'groom';
  dateOfBirth: string;
  age: number;
  height: string;
  subSect: string;
  gotramKulam: string;
  kulaDeivam: string;
  raasi: string;
  nakshatram: string;
  dosham: string; // e.g. "No Dosham" or "Chevvai Dosham"
  education: string;
  profession: string;
  annualIncome: string;
  currentLocation: string;
  nativePlace: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  familyStatus: 'Upper Middle Class' | 'Middle Class' | 'Affluent';
  verifiedSangamMember: boolean;
  photoUrl: string;
  photos: string[];
  contactPerson: string;
  contactPhone: string; // Hidden in free tier
  whatsappNumber: string; // Hidden in free tier
  raasiChartSummary: string[];
  navamsamChartSummary: string[];
  isFeatured?: boolean;
}

// -------------------------------------------------------------
// 4. Youth Career & Scholarship Cell
// -------------------------------------------------------------
export interface ScholarshipApplication {
  id: string;
  studentName: string;
  studentNameTa: string;
  memberCode: string;
  courseDegree: string;
  collegeUniversity: string;
  yearOfStudy: string;
  academicPercentage: number;
  annualTuitionFee: number;
  requestedGrantAmount?: number;
  parentName: string;
  parentOccupation: string;
  annualFamilyIncome: number;
  nativeDistrict: string;
  applicationDate: string;
  status: 'submitted' | 'under_verification' | 'approved' | 'rejected' | 'disbursed';
  disbursedAmount?: number;
  adminRemarks?: string;
  isChildScholarship?: boolean;
  scholarshipScheme?: string;
  bankAccount?: string;
}

export interface CareerMentor {
  id: string;
  name: string;
  nameTa: string;
  domain: string;
  designation: string;
  organization: string;
  experienceYears: number;
  expertiseTags: string[];
  nativeDistrict: string;
  mentorshipTopics: string[];
  slotsAvailable: number;
  photoUrl: string;
}

export interface JobOpening {
  id: string;
  title: string;
  titleTa: string;
  companyName: string;
  founderMember: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship';
  salaryRange: string;
  experienceRequired: string;
  description: string;
  contactEmail: string;
  postedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// -------------------------------------------------------------
// 5. Family Tree
// -------------------------------------------------------------
export interface FamilyTreeNode {
  id: string;
  fullName: string;
  fullNameTa: string;
  generation: number; // 1 = Great-Grandfather, 2 = Grandfather, 3 = Parents, 4 = Self/Siblings, 5 = Children
  relation: string; // e.g. "Self", "Father", "Paternal Grandfather", "Spouse", "Son"
  birthYear: string;
  birthDate?: string; // Format: YYYY-MM-DD or MM-DD for birthday notifications
  isDeceased: boolean;
  deathDate?: string; // Format: YYYY-MM-DD or MM-DD for remembrance/tithi notifications
  kulamGotram: string;
  nativePlaceOor: string;
  kulaDeivamTemple: string;
  occupation: string;
  photoUrl?: string;
  parentId?: string; // Links to parent node in tree
  spouseId?: string;
  childrenIds?: string[];
  bioNotes?: string;
  gender?: 'male' | 'female';
  isEligibleScholarship?: boolean;
}

export interface ChildScholarshipApplication {
  id: string;
  childId: string;
  childName: string;
  parentName: string;
  standardOrCourse: string;
  schoolOrCollege: string;
  marksPercentage: number;
  scholarshipScheme: string;
  requestedAmount: number;
  appliedDate: string;
  status: 'Pending Verification' | 'Approved by Sangam' | 'Disbursed';
}

// -------------------------------------------------------------
// 6. Digital Member ID Card & Event QR Check-in
// -------------------------------------------------------------
export interface DigitalMemberCard {
  membershipCode: string;
  fullName: string;
  fullNameTa: string;
  memberTier: 'Life Member' | 'Patron Member' | 'Youth Wing Member';
  joinedYear: string;
  validUntil: string;
  nativePlace: string;
  bloodGroup: string;
  phone: string;
  kulaDeivam: string;
  photoUrl: string;
  qrPayload: string;
  verificationHash: string;
}

export interface EventCheckInRecord {
  id: string;
  eventId: string;
  eventName: string;
  memberCode: string;
  memberName: string;
  checkInTime: string;
  verifiedByOfficer: string;
  gateLocation: string;
  foodCouponIssued: boolean;
  delegateKitIssued: boolean;
  status: 'verified' | 'flagged';
}

