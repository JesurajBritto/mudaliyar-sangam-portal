import { MemberAddressEntry, AddressAccessRequest, FamilyMemberDetail } from '../types';

export const INITIAL_ADDRESS_BOOK: MemberAddressEntry[] = [
  {
    id: 'mem-101',
    fullName: 'R. Natarajan Mudaliyar',
    fullNameTa: 'இரா. நடராஜன் முதலியார்',
    age: 58,
    gender: 'male',
    membershipCode: 'MUD-KCH-2024-0129',
    occupation: 'Senior Silk Merchant & Hereditary Weaver',
    bloodGroup: 'O+ve',
    branch: 'Kanchipuram North Branch',
    phone: '+91 98401 22345',
    email: 'natarajan.silk@gmail.com',
    doorNumber: '48/B',
    streetName: 'Gandhi Road, Near Varadaraja Temple',
    areaLocality: 'Periya Kanchipuram',
    city: 'Kanchipuram',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    pincode: '631501',
    familyMembers: [
      {
        id: 'fam-101-1',
        fullName: 'N. Vasantha Lakshmi',
        fullNameTa: 'என். வசந்த லட்சுமி',
        relationship: 'Wife',
        age: 52,
        gender: 'female',
        phone: '+91 98401 22346',
        email: 'vasanthi.natarajan@gmail.com',
        profession: 'Homemaker & Handloom Designer',
        bloodGroup: 'B+ve'
      },
      {
        id: 'fam-101-2',
        fullName: 'N. Vigneshwaran Mudaliyar',
        fullNameTa: 'என். விக்னேஸ்வரன் முதலியார்',
        relationship: 'Son',
        age: 27,
        gender: 'male',
        phone: '+91 98401 55678',
        email: 'vignesh.n@gmail.com',
        profession: 'Software Engineer, Zoho',
        bloodGroup: 'O+ve'
      },
      {
        id: 'fam-101-3',
        fullName: 'N. Divyabharathi',
        fullNameTa: 'என். திவ்யபாரதி',
        relationship: 'Daughter',
        age: 23,
        gender: 'female',
        phone: '+91 98401 99876',
        email: 'divya.natarajan@gmail.com',
        profession: 'B.Tech Textile Tech Final Year',
        bloodGroup: 'O+ve'
      }
    ],
    privacyLevel: 'public_to_members',
    isUnlockedForViewer: true,
    requestStatus: 'approved'
  },
  {
    id: 'mem-102',
    fullName: 'Dr. K. Meenakshi Sundaram Mudaliyar',
    fullNameTa: 'டாக்டர் கே. மீனாட்சி சுந்தரம் முதலியார்',
    age: 52,
    gender: 'male',
    membershipCode: 'MUD-CHN-2025-0452',
    occupation: 'Chief Cardiologist, Apollo Hospitals',
    bloodGroup: 'A+ve',
    branch: 'Chennai Central Branch',
    phone: '+91 94440 98124',
    email: 'dr.meenakshi.sundaram@gmail.com',
    doorNumber: 'Plot 142, Door 12',
    streetName: '2nd Avenue, Shanthi Colony',
    areaLocality: 'Anna Nagar West',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    familyMembers: [
      {
        id: 'fam-102-1',
        fullName: 'Dr. S. Gayathri Sundaram',
        fullNameTa: 'டாக்டர் எஸ். காயத்ரி சுந்தரம்',
        relationship: 'Wife',
        age: 48,
        gender: 'female',
        phone: '+91 94440 98125',
        email: 'dr.gayathri.gyn@gmail.com',
        profession: 'Senior Gynecologist, MGM Healthcare',
        bloodGroup: 'A+ve'
      },
      {
        id: 'fam-102-2',
        fullName: 'M. Siddarth Sundaram',
        fullNameTa: 'எம். சித்தார்த் சுந்தரம்',
        relationship: 'Son',
        age: 21,
        gender: 'male',
        phone: '+91 94440 77654',
        email: 'siddarth.sundaram@gmail.com',
        profession: 'MBBS Student, MMC Chennai',
        bloodGroup: 'A+ve'
      }
    ],
    privacyLevel: 'request_only',
    isUnlockedForViewer: false,
    requestStatus: 'none'
  },
  {
    id: 'mem-103',
    fullName: 'V. Shanmuga Sundaram Mudaliyar',
    fullNameTa: 'வெ. சண்முக சுந்தரம் முதலியார்',
    age: 61,
    gender: 'male',
    membershipCode: 'MUD-VEL-2024-0891',
    occupation: 'Managing Director, Royal Handlooms & Exports',
    bloodGroup: 'B+ve',
    branch: 'Vellore Fort Branch',
    phone: '+91 98423 55190',
    email: 'shanmugam.royal@gmail.com',
    doorNumber: '19/3',
    streetName: 'Officers Line, Fort Round Road',
    areaLocality: 'Vellore Cantonment',
    city: 'Vellore',
    district: 'Vellore',
    state: 'Tamil Nadu',
    pincode: '632001',
    familyMembers: [
      {
        id: 'fam-103-1',
        fullName: 'S. Rajeshwari Shanmugam',
        fullNameTa: 'எஸ். ராஜேஸ்வரி சண்முகம்',
        relationship: 'Wife',
        age: 56,
        gender: 'female',
        phone: '+91 98423 55191',
        email: 'rajeshwari.royal@gmail.com',
        profession: 'Handloom Trust Director',
        bloodGroup: 'B+ve'
      },
      {
        id: 'fam-103-2',
        fullName: 'S. Karthik Shanmugam',
        fullNameTa: 'எஸ். கார்த்திக் சண்முகம்',
        relationship: 'Son',
        age: 29,
        gender: 'male',
        phone: '+91 98423 88123',
        email: 'karthik.royaltextiles@gmail.com',
        profession: 'Export Manager & Entrepreneur',
        bloodGroup: 'B+ve'
      },
      {
        id: 'fam-103-3',
        fullName: 'S. Nithya Kalyani',
        fullNameTa: 'எஸ். நித்யா கல்யாணி',
        relationship: 'Daughter',
        age: 25,
        gender: 'female',
        phone: '+91 98423 99456',
        email: 'nithya.s@gmail.com',
        profession: 'Chartered Accountant, KPMG',
        bloodGroup: 'O+ve'
      }
    ],
    privacyLevel: 'request_only',
    isUnlockedForViewer: true,
    requestStatus: 'approved'
  },
  {
    id: 'mem-104',
    fullName: 'P. Muruganandam Mudaliyar',
    fullNameTa: 'பா. முருகானந்தம் முதலியார்',
    age: 49,
    gender: 'male',
    membershipCode: 'MUD-CBE-2025-1102',
    occupation: 'Precision Machinery Works & Foundries',
    bloodGroup: 'O+ve',
    branch: 'Kongu Coimbatore Branch',
    phone: '+91 98940 77123',
    email: 'muruganan.cbe@gmail.com',
    doorNumber: '88-A',
    streetName: 'Avinashi Road, Near PSG Tech',
    areaLocality: 'Peelamedu',
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641004',
    familyMembers: [
      {
        id: 'fam-104-1',
        fullName: 'M. Padmavathi Muruganandam',
        fullNameTa: 'எம். பத்மாவதி முருகானந்தம்',
        relationship: 'Wife',
        age: 44,
        gender: 'female',
        phone: '+91 98940 77124',
        email: 'padmavathi.cbe@gmail.com',
        profession: 'School Teacher (Mathematics)',
        bloodGroup: 'O+ve'
      },
      {
        id: 'fam-104-2',
        fullName: 'M. Aravind Mudaliyar',
        fullNameTa: 'எம். அரவிந்த் முதலியார்',
        relationship: 'Son',
        age: 19,
        gender: 'male',
        phone: '+91 98940 66321',
        email: 'aravind.m@gmail.com',
        profession: 'B.E. Mechanical Engineering, PSG Tech',
        bloodGroup: 'O+ve'
      }
    ],
    privacyLevel: 'public_to_members',
    isUnlockedForViewer: true,
    requestStatus: 'approved'
  },
  {
    id: 'mem-105',
    fullName: 'T. Sivakami Ammal Mudaliyar',
    fullNameTa: 'தி. சிவகாமி அம்மாள் முதலியார்',
    age: 67,
    gender: 'female',
    membershipCode: 'MUD-TVM-2025-0678',
    occupation: 'Retired Headmistress & Educational Trust Trustee',
    bloodGroup: 'AB+ve',
    branch: 'Tiruvannamalai Hill Branch',
    phone: '+91 97890 33412',
    email: 'sivakami.trustee@gmail.com',
    doorNumber: '25/7',
    streetName: 'Mada Veedhi, North Gopuram Street',
    areaLocality: 'Temple Precinct',
    city: 'Tiruvannamalai',
    district: 'Tiruvannamalai',
    state: 'Tamil Nadu',
    pincode: '606601',
    familyMembers: [
      {
        id: 'fam-105-1',
        fullName: 'T. Annamalai Mudaliyar',
        fullNameTa: 'தி. அண்ணாமலை முதலியார்',
        relationship: 'Husband',
        age: 72,
        gender: 'male',
        phone: '+91 97890 33413',
        email: 'annamalai.t@gmail.com',
        profession: 'Retired Government Treasury Officer',
        bloodGroup: 'AB+ve'
      },
      {
        id: 'fam-105-2',
        fullName: 'A. Saravanan Mudaliyar',
        fullNameTa: 'ஏ. சரவணன் முதலியார்',
        relationship: 'Son',
        age: 40,
        gender: 'male',
        phone: '+91 97890 11987',
        email: 'saravanan.a@gmail.com',
        profession: 'Civil Engineer & Contractor',
        bloodGroup: 'B+ve'
      }
    ],
    privacyLevel: 'request_only',
    isUnlockedForViewer: false,
    requestStatus: 'none'
  },
  {
    id: 'mem-106',
    fullName: 'S. Karthikeyan Mudaliyar',
    fullNameTa: 'செ. கார்த்திகேயன் முதலியார்',
    age: 45,
    gender: 'male',
    membershipCode: 'MUD-MDU-2026-0314',
    occupation: 'Advocate & High Court Bar Council Member',
    bloodGroup: 'B+ve',
    branch: 'Madurai Meenakshi Branch',
    phone: '+91 94432 11098',
    email: 'karthikeyan.legal@gmail.com',
    doorNumber: '31',
    streetName: 'West Masi Street, Near Meenakshi Temple',
    areaLocality: 'Madurai Central',
    city: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    pincode: '625001',
    familyMembers: [
      {
        id: 'fam-106-1',
        fullName: 'K. Bhuvaneshwari',
        fullNameTa: 'கே. புவனேஸ்வரி',
        relationship: 'Wife',
        age: 41,
        gender: 'female',
        phone: '+91 94432 11099',
        email: 'bhuvaneshwari.k@gmail.com',
        profession: 'Professor of English, Lady Doak College',
        bloodGroup: 'B+ve'
      },
      {
        id: 'fam-106-2',
        fullName: 'K. Sai Pranav Mudaliyar',
        fullNameTa: 'கே. சாய் பிரணவ் முதலியார்',
        relationship: 'Son',
        age: 14,
        gender: 'male',
        phone: '',
        email: '',
        profession: 'School Student (9th Standard)',
        bloodGroup: 'O+ve'
      },
      {
        id: 'fam-106-3',
        fullName: 'K. Sri Madhumitha',
        fullNameTa: 'கே. ஸ்ரீ மதுமிதா',
        relationship: 'Daughter',
        age: 10,
        gender: 'female',
        phone: '',
        email: '',
        profession: 'School Student (5th Standard)',
        bloodGroup: 'B+ve'
      }
    ],
    privacyLevel: 'request_only',
    isUnlockedForViewer: false,
    requestStatus: 'pending'
  },
  {
    id: 'mem-107',
    fullName: 'A. Thillai Govindasamy Mudaliyar',
    fullNameTa: 'அ. தில்லை கோவிந்தசாமி முதலியார்',
    age: 63,
    gender: 'male',
    membershipCode: 'MUD-CDL-2024-0941',
    occupation: 'Organic Agri Exports & Farm Lands',
    bloodGroup: 'O+ve',
    branch: 'Chidambaram Port Branch',
    phone: '+91 98418 66230',
    email: 'thillai.farms@gmail.com',
    doorNumber: '112',
    streetName: 'East Car Street',
    areaLocality: 'Chidambaram Town',
    city: 'Chidambaram',
    district: 'Cuddalore',
    state: 'Tamil Nadu',
    pincode: '608001',
    familyMembers: [
      {
        id: 'fam-107-1',
        fullName: 'T. Sundari Ammal',
        fullNameTa: 'டி. சுந்தரி அம்மாள்',
        relationship: 'Wife',
        age: 58,
        gender: 'female',
        phone: '+91 98418 66231',
        email: 'sundari.farms@gmail.com',
        profession: 'Farm Management & Trustee',
        bloodGroup: 'O+ve'
      }
    ],
    privacyLevel: 'public_to_members',
    isUnlockedForViewer: true,
    requestStatus: 'approved'
  }
];

export const INITIAL_ACCESS_REQUESTS: AddressAccessRequest[] = [
  {
    id: 'req-201',
    requesterId: 'usr-901',
    requesterName: 'K. Balasubramanian Mudaliyar',
    requesterPhone: '+91 98402 77819',
    requesterNativePlace: 'Walajapet, Ranipet Dist',
    targetMemberId: 'mem-current-user',
    targetMemberName: 'M. Sivasankaran Mudaliyar (You)',
    requestReason: 'Family wedding invitation dispatch & native village lineage coordination',
    status: 'pending',
    createdAt: '2026-09-06T11:20:00Z'
  },
  {
    id: 'req-202',
    requesterId: 'usr-902',
    requesterName: 'Prof. N. Dhandapani Mudaliyar',
    requesterPhone: '+91 94441 55201',
    requesterNativePlace: 'Kanchipuram',
    targetMemberId: 'mem-current-user',
    targetMemberName: 'M. Sivasankaran Mudaliyar (You)',
    requestReason: 'Inviting for Kanchipuram Mudaliyar Educational Trust executive committee meet',
    status: 'pending',
    createdAt: '2026-09-07T08:45:00Z'
  },
  {
    id: 'req-203',
    requesterId: 'usr-903',
    requesterName: 'M. Rajasekaran Mudaliyar',
    requesterPhone: '+91 98421 99014',
    requesterNativePlace: 'Tiruttani, Tiruvallur Dist',
    targetMemberId: 'mem-current-user',
    targetMemberName: 'M. Sivasankaran Mudaliyar (You)',
    requestReason: 'Kula Deivam temple renovation samprokshanam donation drive',
    status: 'approved',
    createdAt: '2026-09-03T14:10:00Z',
    approvedAt: '2026-09-04T09:30:00Z'
  }
];

// Helper to mask phone numbers according to DPDP standards
export function maskPhoneNumber(phone: string): string {
  if (!phone) return 'Not Provided';
  // Standard format: +91 98401 22345 -> +91 98*** **345
  const clean = phone.trim();
  if (clean.length < 10) return clean.replace(/.(?=.{2})/g, '*');
  const start = clean.slice(0, 7);
  const end = clean.slice(-3);
  return `${start}** ***${end}`;
}

// Helper to mask physical street address
export function maskAddress(doorNumber: string, streetName: string, areaLocality: string, city: string, district: string, pincode: string): {
  maskedAddressLine: string;
  publicLocation: string;
} {
  return {
    maskedAddressLine: `Door No: [Protected], [Street Protected], ${areaLocality}`,
    publicLocation: `${city}, ${district} - ${pincode}`
  };
}

// Helper to match phone number search queries (supports full number, partial digits, or unformatted input)
export function matchPhoneSearch(memberPhone: string, query: string): boolean {
  if (!query || !memberPhone) return false;
  
  const trimmed = query.trim();
  const rawDigitsQuery = trimmed.replace(/\D/g, '');
  const rawDigitsPhone = memberPhone.replace(/\D/g, '');

  if (rawDigitsQuery.length >= 3) {
    if (rawDigitsPhone.includes(rawDigitsQuery)) {
      return true;
    }
  }

  return memberPhone.toLowerCase().includes(trimmed.toLowerCase());
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchedMember?: MemberAddressEntry;
  matchType?: 'phone' | 'email' | 'name_address' | 'exact_match';
  reason?: string;
  reasonTa?: string;
}

// Comprehensive duplicate check for address book registration
export function checkDuplicateMember(
  newEntry: {
    fullName: string;
    phone: string;
    email?: string;
    doorNumber?: string;
    streetName?: string;
    city?: string;
    pincode?: string;
  },
  existingList: MemberAddressEntry[],
  ignoreId?: string
): DuplicateCheckResult {
  const normPhone = (newEntry.phone || '').replace(/\D/g, '');
  const normName = (newEntry.fullName || '').trim().toLowerCase();
  const normEmail = (newEntry.email || '').trim().toLowerCase();
  const normDoor = (newEntry.doorNumber || '').trim().toLowerCase();
  const normStreet = (newEntry.streetName || '').trim().toLowerCase();
  const normCity = (newEntry.city || '').trim().toLowerCase();

  for (const m of existingList) {
    if (ignoreId && m.id === ignoreId) continue;

    const existingPhone = (m.phone || '').replace(/\D/g, '');
    const existingName = m.fullName.trim().toLowerCase();
    const existingEmail = (m.email || '').trim().toLowerCase();
    const existingDoor = (m.doorNumber || '').trim().toLowerCase();
    const existingStreet = (m.streetName || '').trim().toLowerCase();
    const existingCity = m.city.trim().toLowerCase();

    // 1. Phone number match (if phone digits provided and >= 10 digits)
    if (normPhone.length >= 10 && existingPhone.endsWith(normPhone.slice(-10))) {
      return {
        isDuplicate: true,
        matchedMember: m,
        matchType: 'phone',
        reason: `A member with this mobile number (${m.phone}) is already registered as "${m.fullName}" (${m.membershipCode}) in ${m.branch || m.district}.`,
        reasonTa: `இந்த கைபேசி எண் (${m.phone}) ஏற்கனவே உறுப்பினர் "${m.fullName}" (${m.membershipCode}, ${m.branch || m.district}) பெயரில் பதிவு செய்யப்பட்டுள்ளது.`
      };
    }

    // 2. Email match (if provided)
    if (normEmail && existingEmail && normEmail === existingEmail) {
      return {
        isDuplicate: true,
        matchedMember: m,
        matchType: 'email',
        reason: `A member with this email address (${m.email}) is already registered as "${m.fullName}" (${m.membershipCode}).`,
        reasonTa: `இந்த மின்னஞ்சல் (${m.email}) ஏற்கனவே உறுப்பினர் "${m.fullName}" (${m.membershipCode}) பெயரில் பதிவு செய்யப்பட்டுள்ளது.`
      };
    }

    // 3. Same Name + Similar Address Match
    if (normName && existingName) {
      const isNameMatch = normName === existingName || existingName.includes(normName) || normName.includes(existingName);
      const isAddressMatch =
        normCity === existingCity &&
        ((normDoor && normDoor === existingDoor) || (normStreet && existingStreet.includes(normStreet)));

      if (isNameMatch && isAddressMatch) {
        return {
          isDuplicate: true,
          matchedMember: m,
          matchType: 'name_address',
          reason: `A member with similar name "${m.fullName}" and matching address in ${m.city} (${m.doorNumber}, ${m.streetName}) is already registered (${m.membershipCode}).`,
          reasonTa: `இதே பெயர் "${m.fullName}" மற்றும் முகவரியில் (${m.city}, ${m.doorNumber}) ஏற்கனவே உறுப்பினர் பதிவு செய்யப்பட்டுள்ளார் (${m.membershipCode}).`
        };
      }
    }
  }

  return { isDuplicate: false };
}

// Statistical Counts and Analytics for Admin and Super Admin
export interface AddressBookAnalytics {
  totalPrimaryMembers: number;
  totalFamilyMembers: number;
  totalCombinedPopulation: number;
  districtCounts: { district: string; count: number; percentage: number }[];
  cityCounts: { city: string; count: number; percentage: number }[];
  branchCounts: { branch: string; count: number; percentage: number }[];
  bloodGroupCounts: { group: string; count: number }[];
}

export function getAddressBookAnalytics(members: MemberAddressEntry[]): AddressBookAnalytics {
  const totalPrimary = members.length;
  let totalFamily = 0;

  const districtMap: Record<string, number> = {};
  const cityMap: Record<string, number> = {};
  const branchMap: Record<string, number> = {};
  const bloodGroupMap: Record<string, number> = {};

  for (const m of members) {
    const famCount = m.familyMembers?.length || 0;
    totalFamily += famCount;

    // District count
    const d = m.district || 'Unassigned District';
    districtMap[d] = (districtMap[d] || 0) + 1 + famCount;

    // City count
    const c = m.city || 'Unassigned City';
    cityMap[c] = (cityMap[c] || 0) + 1 + famCount;

    // Branch count
    const b = m.branch || `${m.district} Regional Branch`;
    branchMap[b] = (branchMap[b] || 0) + 1 + famCount;

    // Blood Group count (primary)
    if (m.bloodGroup) {
      bloodGroupMap[m.bloodGroup] = (bloodGroupMap[m.bloodGroup] || 0) + 1;
    }
    // Blood Group count (family)
    m.familyMembers?.forEach((f) => {
      if (f.bloodGroup) {
        bloodGroupMap[f.bloodGroup] = (bloodGroupMap[f.bloodGroup] || 0) + 1;
      }
    });
  }

  const totalCombined = totalPrimary + totalFamily;

  const districtCounts = Object.entries(districtMap)
    .map(([district, count]) => ({
      district,
      count,
      percentage: totalCombined > 0 ? Math.round((count / totalCombined) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const cityCounts = Object.entries(cityMap)
    .map(([city, count]) => ({
      city,
      count,
      percentage: totalCombined > 0 ? Math.round((count / totalCombined) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const branchCounts = Object.entries(branchMap)
    .map(([branch, count]) => ({
      branch,
      count,
      percentage: totalCombined > 0 ? Math.round((count / totalCombined) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const bloodGroupCounts = Object.entries(bloodGroupMap)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPrimaryMembers: totalPrimary,
    totalFamilyMembers: totalFamily,
    totalCombinedPopulation: totalCombined,
    districtCounts,
    cityCounts,
    branchCounts,
    bloodGroupCounts
  };
}

// Helper for Super Admin to export the full address book into an Excel (.xlsx) workbook
export async function exportAddressBookToExcel(
  members: MemberAddressEntry[],
  filename = 'Mudaliyar_Sangam_Member_Addresses_Full_Database_2026.xlsx'
): Promise<{ success: boolean; count: number; filename: string }> {
  try {
    const XLSX = await import('xlsx');

    const formattedData: Record<string, any>[] = [];

    members.forEach((m, index) => {
      // Primary Member
      formattedData.push({
        'S.No': formattedData.length + 1,
        'Member Type': 'Primary Member (Head)',
        'Membership Code': m.membershipCode,
        'Full Name (English)': m.fullName,
        'Full Name (Tamil)': m.fullNameTa,
        'Relationship': 'Self (Head of Household)',
        'Age': m.age || 'N/A',
        'Gender': m.gender || 'N/A',
        'Branch': m.branch || `${m.district} Branch`,
        'Occupation / Profession': m.occupation,
        'Blood Group': m.bloodGroup,
        'Mobile Phone': m.phone,
        'Email Address': m.email,
        'Door / Flat No.': m.doorNumber,
        'Street Name': m.streetName,
        'Area / Locality': m.areaLocality,
        'City / Town': m.city,
        'District': m.district,
        'State': m.state,
        'Pincode': m.pincode,
        'Total Family Count': (m.familyMembers?.length || 0),
        'Address Privacy Setting': m.privacyLevel === 'public_to_members' ? 'Public to Verified Members' : 'Request-Only (Masked)',
        'Exported By': 'Super Admin (Statutory Audit)',
        'Export Timestamp': new Date().toLocaleString()
      });

      // Family Members
      if (m.familyMembers && m.familyMembers.length > 0) {
        m.familyMembers.forEach((fm, fIdx) => {
          formattedData.push({
            'S.No': formattedData.length + 1,
            'Member Type': `Family Member (${fm.relationship})`,
            'Membership Code': m.membershipCode + `-F${fIdx + 1}`,
            'Full Name (English)': fm.fullName,
            'Full Name (Tamil)': fm.fullNameTa || '',
            'Relationship': fm.relationship,
            'Age': fm.age,
            'Gender': fm.gender,
            'Branch': m.branch || `${m.district} Branch`,
            'Occupation / Profession': fm.profession || 'N/A',
            'Blood Group': fm.bloodGroup || 'N/A',
            'Mobile Phone': fm.phone || m.phone,
            'Email Address': fm.email || m.email,
            'Door / Flat No.': m.doorNumber,
            'Street Name': m.streetName,
            'Area / Locality': m.areaLocality,
            'City / Town': m.city,
            'District': m.district,
            'State': m.state,
            'Pincode': m.pincode,
            'Total Family Count': '-',
            'Address Privacy Setting': m.privacyLevel === 'public_to_members' ? 'Public to Verified Members' : 'Request-Only (Masked)',
            'Exported By': 'Super Admin (Statutory Audit)',
            'Export Timestamp': new Date().toLocaleString()
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set practical column widths
    worksheet['!cols'] = [
      { wch: 6 },   // S.No
      { wch: 22 },  // Member Type
      { wch: 20 },  // Membership Code
      { wch: 30 },  // Full Name En
      { wch: 32 },  // Full Name Ta
      { wch: 18 },  // Relationship
      { wch: 8 },   // Age
      { wch: 10 },  // Gender
      { wch: 26 },  // Branch
      { wch: 32 },  // Occupation / Profession
      { wch: 12 },  // Blood Group
      { wch: 18 },  // Phone
      { wch: 28 },  // Email
      { wch: 16 },  // Door No
      { wch: 32 },  // Street
      { wch: 24 },  // Area
      { wch: 18 },  // City
      { wch: 18 },  // District
      { wch: 14 },  // State
      { wch: 12 },  // PIN
      { wch: 18 },  // Total Family Count
      { wch: 28 },  // Privacy
      { wch: 28 },  // Exported By
      { wch: 24 }   // Timestamp
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Member & Family Directory');
    XLSX.writeFile(workbook, filename);

    return { success: true, count: formattedData.length, filename };
  } catch (err) {
    console.error('Error generating Excel file:', err);
    throw err;
  }
}

const LOCAL_STORAGE_ADDRESS_BOOK_KEY = 'ms_portal_address_book_v1';

export const loadAddressBook = (): MemberAddressEntry[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ADDRESS_BOOK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading address book from storage:', e);
  }
  return INITIAL_ADDRESS_BOOK;
};

export const saveAddressBook = (members: MemberAddressEntry[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ADDRESS_BOOK_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving address book to storage:', e);
  }
};

export const addMemberToAddressBook = (entry: Partial<MemberAddressEntry> & { fullName: string; phone: string }): MemberAddressEntry => {
  const currentList = loadAddressBook();
  const id = entry.id || `mem-reg-${Date.now()}`;
  const membershipCode = entry.membershipCode || `MUD-${(entry.district || 'TN').substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newEntry: MemberAddressEntry = {
    id,
    fullName: entry.fullName.trim(),
    fullNameTa: entry.fullNameTa?.trim() || entry.fullName.trim(),
    age: entry.age || 35,
    gender: entry.gender || 'male',
    membershipCode,
    occupation: entry.occupation?.trim() || 'Community Member',
    bloodGroup: entry.bloodGroup || 'O+ve',
    branch: entry.branch || `${entry.district || 'State'} Branch`,
    phone: entry.phone.trim(),
    email: entry.email?.trim() || 'member@mudaliyarsangam.org',
    doorNumber: entry.doorNumber?.trim() || 'No. 12',
    streetName: entry.streetName?.trim() || 'Main Road',
    areaLocality: entry.areaLocality?.trim() || entry.city?.trim() || 'Central',
    city: entry.city?.trim() || entry.district || 'Chennai',
    district: entry.district || 'Chennai',
    state: entry.state || 'Tamil Nadu',
    pincode: entry.pincode?.trim() || '600001',
    familyMembers: entry.familyMembers || [],
    privacyLevel: entry.privacyLevel || 'public_to_members',
    isUnlockedForViewer: true,
    requestStatus: 'approved'
  };

  const updated = [newEntry, ...currentList.filter(m => m.id !== newEntry.id && m.phone !== newEntry.phone)];
  saveAddressBook(updated);
  return newEntry;
};


