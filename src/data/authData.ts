import { AuthUser, UserRole, AddressPrivacyLevel } from '../types';
import { addMemberToAddressBook } from './addressBookData';

export const DEMO_ACCOUNTS: AuthUser[] = [
  {
    id: 'user-super-admin',
    fullName: 'Thiru. Shanmuga Mudaliyar',
    fullNameTa: 'திரு. சண்முக முதலியார்',
    phone: '9840012345',
    email: 'president@mudaliyarsangam.org',
    membershipCode: 'MS-ADM-001',
    role: 'super_admin',
    position: 'State President',
    positionTa: 'மாநிலத் தலைவர்',
    branch: 'Chennai Central (State HQ)',
    district: 'Chennai',
    city: 'Chennai',
    doorNumber: 'No. 42',
    streetName: 'Mudaliyar Sangam Salai, T. Nagar',
    areaLocality: 'T. Nagar',
    pincode: '600017',
    nativePlace: 'Kanchipuram',
    kulamGotram: 'Siva Gothram / Sengunthar',
    occupation: 'Industrialist & State President',
    bloodGroup: 'O+',
    joinedDate: '1998-04-14',
    isVerified: true
  },
  {
    id: 'user-zonal-admin-1',
    fullName: 'Thiru. R. Venkatesan Mudaliyar',
    fullNameTa: 'திரு. ஆர். வெங்கடேசன் முதலியார்',
    phone: '9841122334',
    email: 'zonal.north@mudaliyarsangam.org',
    membershipCode: 'MS-ZON-101',
    role: 'super_admin',
    position: 'Zonal Secretary (North Zone)',
    positionTa: 'மண்டலச் செயலாளர் (வடக்கு மண்டலம்)',
    branch: 'Vellore North Branch',
    district: 'Vellore',
    city: 'Vellore',
    doorNumber: 'No. 88',
    streetName: 'Gandhi Road',
    areaLocality: 'Sathuvachari',
    pincode: '632009',
    nativePlace: 'Arcot',
    kulamGotram: 'Vishnu Gothram',
    occupation: 'Senior Advocate & Zonal Secretary',
    bloodGroup: 'B+',
    joinedDate: '2004-03-10',
    isVerified: true
  },
  {
    id: 'user-branch-admin',
    fullName: 'Thiru. K. Balasubramanian',
    fullNameTa: 'திரு. கே. பாலசுப்பிரமணியன்',
    phone: '9444056789',
    email: 'secretary.cbe@mudaliyarsangam.org',
    membershipCode: 'MS-BR-104',
    role: 'branch_admin',
    position: 'District Secretary',
    positionTa: 'மாவட்டச் செயலாளர்',
    branch: 'Coimbatore South Branch',
    district: 'Coimbatore',
    city: 'Coimbatore',
    doorNumber: 'No. 15/4',
    streetName: 'Avinashi Road',
    areaLocality: 'Peelamedu',
    pincode: '641004',
    nativePlace: 'Pollachi',
    kulamGotram: 'Vishnu Gothram',
    occupation: 'Textile Merchant & Secretary',
    bloodGroup: 'B+',
    joinedDate: '2005-08-20',
    isVerified: true
  },
  {
    id: 'user-branch-admin-2',
    fullName: 'Thirumathi Meenakshi Sundaram',
    fullNameTa: 'திருமதி மீனாட்சி சுந்தரம்',
    phone: '9443219876',
    email: 'women.wing@mudaliyarsangam.org',
    membershipCode: 'MS-BR-205',
    role: 'branch_admin',
    position: 'Women Wing Coordinator',
    positionTa: 'மகளிரணி அமைப்பாளர்',
    branch: 'Madurai Central Branch',
    district: 'Madurai',
    city: 'Madurai',
    doorNumber: 'No. 27',
    streetName: 'West Masi Street',
    areaLocality: 'Meenakshi Amman Kovil Area',
    pincode: '625001',
    nativePlace: 'Madurai',
    kulamGotram: 'Agasthya Gothram',
    occupation: 'Educationist & Social Worker',
    bloodGroup: 'O+',
    joinedDate: '2010-06-15',
    isVerified: true
  },
  {
    id: 'user-member-youth',
    fullName: 'Thiru. Karthikeyan Mudaliyar',
    fullNameTa: 'திரு. கார்த்திகேயன் முதலியார்',
    phone: '9840998877',
    email: 'youth.trichy@mudaliyarsangam.org',
    membershipCode: 'MS-YTH-302',
    role: 'member',
    position: 'Youth Wing Leader',
    positionTa: 'இளைஞரணி தலைவர்',
    branch: 'Tiruchirappalli Town Branch',
    district: 'Tiruchirappalli',
    city: 'Tiruchirappalli',
    doorNumber: 'No. 104',
    streetName: 'Thillai Nagar Main Road',
    areaLocality: 'Thillai Nagar',
    pincode: '620018',
    nativePlace: 'Srirangam',
    kulamGotram: 'Siva Gothram',
    occupation: 'IT Entrepreneur',
    bloodGroup: 'AB+',
    joinedDate: '2021-02-12',
    isVerified: true
  },
  {
    id: 'user-member-1',
    fullName: 'Dr. Arunkumar Mudaliyar',
    fullNameTa: 'மருத்துவர் அருண்குமார் முதலியார்',
    phone: '9884011223',
    email: 'arunkumar.m@gmail.com',
    membershipCode: 'MS-2024-8842',
    role: 'member',
    position: 'Executive Committee Member',
    positionTa: 'செயற்குழு உறுப்பினர்',
    branch: 'Salem Central Branch',
    district: 'Salem',
    city: 'Salem',
    doorNumber: 'No. 76',
    streetName: 'Five Roads Junction',
    areaLocality: 'Fairlands',
    pincode: '636016',
    nativePlace: 'Omalur',
    kulamGotram: 'Agasthya Gothram',
    occupation: 'Consultant Cardiologist',
    bloodGroup: 'A+',
    joinedDate: '2024-01-15',
    isVerified: true
  },
  {
    id: 'user-member-2',
    fullName: 'Thiru. S. Rajendran Mudaliyar',
    fullNameTa: 'திரு. எஸ். ராஜேந்திரன் முதலியார்',
    phone: '9790123456',
    email: 'rajendran.kanchi@gmail.com',
    membershipCode: 'MS-2024-9104',
    role: 'member',
    position: 'General Member',
    positionTa: 'பொது உறுப்பினர்',
    branch: 'Kanchipuram Silk City Branch',
    district: 'Kanchipuram',
    city: 'Kanchipuram',
    doorNumber: 'No. 54',
    streetName: 'Gandhi Road, Silk Weaver Colony',
    areaLocality: 'Weavers Colony',
    pincode: '631501',
    nativePlace: 'Kanchipuram',
    kulamGotram: 'Sengunthar Gotram',
    occupation: 'Silk Handloom Master Manufacturer',
    bloodGroup: 'O+',
    joinedDate: '2023-11-10',
    isVerified: true
  },
  {
    id: 'user-member-3',
    fullName: 'Thiru. P. Senthil Nathan',
    fullNameTa: 'திரு. பி. செந்தில் நாதன்',
    phone: '9442156789',
    email: 'senthil.erod@gmail.com',
    membershipCode: 'MS-2024-4512',
    role: 'member',
    position: 'Treasurer (Erode District)',
    positionTa: 'மாவட்டப் பொருளாளர்',
    branch: 'Erode City Branch',
    district: 'Erode',
    city: 'Erode',
    doorNumber: 'No. 32',
    streetName: 'Perundurai Road',
    areaLocality: 'Collectorate Junction',
    pincode: '638011',
    nativePlace: 'Bhavani',
    kulamGotram: 'Vishnu Gothram',
    occupation: 'Chartered Accountant',
    bloodGroup: 'B+',
    joinedDate: '2022-09-05',
    isVerified: true
  },
  {
    id: 'user-member-4',
    fullName: 'Dr. V. Jayanthi Mudaliyar',
    fullNameTa: 'மருத்துவர் வி. ஜெயந்தி முதலியார்',
    phone: '9443890123',
    email: 'jayanthi.m@tvc.org',
    membershipCode: 'MS-2025-1029',
    role: 'member',
    position: 'Matrimony Wing Coordinator',
    positionTa: 'திருமண பிரிவு ஒருங்கிணைப்பாளர்',
    branch: 'Tirunelveli South Branch',
    district: 'Tirunelveli',
    city: 'Tirunelveli',
    doorNumber: 'No. 19',
    streetName: 'High Ground Road',
    areaLocality: 'Palayamkottai',
    pincode: '627002',
    nativePlace: 'Ambasamudram',
    kulamGotram: 'Siva Gothram',
    occupation: 'Professor of Tamil Literature',
    bloodGroup: 'O+',
    joinedDate: '2025-01-20',
    isVerified: true
  },
  {
    id: 'user-member-5',
    fullName: 'Thiru. M. Sridhar Mudaliyar',
    fullNameTa: 'திரு. எம். ஸ்ரீதர் முதலியார்',
    phone: '9840567890',
    email: 'sridhar.thanjavur@gmail.com',
    membershipCode: 'MS-2025-7834',
    role: 'member',
    position: 'Legal Advisor',
    positionTa: 'சட்ட ஆலோசகர்',
    branch: 'Thanjavur Heritage Branch',
    district: 'Thanjavur',
    city: 'Thanjavur',
    doorNumber: 'No. 61',
    streetName: 'Court Road',
    areaLocality: 'Old Bus Stand Area',
    pincode: '613001',
    nativePlace: 'Kumbakonam',
    kulamGotram: 'Agasthya Gothram',
    occupation: 'Senior Advocate',
    bloodGroup: 'A+',
    joinedDate: '2025-04-18',
    isVerified: true
  }
];

export const STANDARD_POSITIONS = [
  { id: 'state_president', nameEn: 'State President', nameTa: 'மாநிலத் தலைவர்' },
  { id: 'state_gen_secretary', nameEn: 'State General Secretary', nameTa: 'மாநில பொதுச்செயலாளர்' },
  { id: 'state_treasurer', nameEn: 'State Treasurer', nameTa: 'மாநிலப் பொருளாளர்' },
  { id: 'zonal_secretary', nameEn: 'Zonal Secretary', nameTa: 'மண்டலச் செயலாளர்' },
  { id: 'district_president', nameEn: 'District President', nameTa: 'மாவட்டத் தலைவர்' },
  { id: 'district_secretary', nameEn: 'District Secretary', nameTa: 'மாவட்டச் செயலாளர்' },
  { id: 'district_treasurer', nameEn: 'District Treasurer', nameTa: 'மாவட்டப் பொருளாளர்' },
  { id: 'youth_wing_leader', nameEn: 'Youth Wing Leader', nameTa: 'இளைஞரணித் தலைவர்' },
  { id: 'women_wing_coordinator', nameEn: 'Women Wing Coordinator', nameTa: 'மகளிரணி அமைப்பாளர்' },
  { id: 'matrimony_coordinator', nameEn: 'Matrimony Wing Coordinator', nameTa: 'திருமண பிரிவு ஒருங்கிணைப்பாளர்' },
  { id: 'career_coordinator', nameEn: 'Youth Career & Scholarship Officer', nameTa: 'கல்வி & வேலைவாய்ப்பு பொறுப்பாளர்' },
  { id: 'legal_advisor', nameEn: 'Legal Advisor', nameTa: 'சட்ட ஆலோசகர்' },
  { id: 'ec_member', nameEn: 'Executive Committee Member', nameTa: 'செயற்குழு உறுப்பினர்' },
  { id: 'general_member', nameEn: 'General Member', nameTa: 'பொது உறுப்பினர்' }
];

export interface DemographicCounts {
  totalMembers: number;
  totalSuperAdmins: number;
  totalBranchAdmins: number;
  totalPositionHolders: number;
  districtCounts: { district: string; count: number; percentage: number }[];
  cityCounts: { city: string; district: string; count: number }[];
  branchCounts: { branch: string; district: string; count: number }[];
  roleCounts: { role: UserRole; label: string; count: number }[];
  genderCounts: { male: number; female: number; other: number };
}

export const calculateDemographics = (users: AuthUser[]): DemographicCounts => {
  const totalMembers = users.length;
  let totalSuperAdmins = 0;
  let totalBranchAdmins = 0;
  let totalPositionHolders = 0;

  const districtMap: Record<string, number> = {};
  const cityMap: Record<string, { count: number; district: string }> = {};
  const branchMap: Record<string, { count: number; district: string }> = {};
  const roleMap: Record<UserRole, number> = {
    super_admin: 0,
    branch_admin: 0,
    member: 0,
    guest: 0
  };
  const genderCounts = { male: 0, female: 0, other: 0 };

  users.forEach((u) => {
    // Role count
    if (u.role) {
      roleMap[u.role] = (roleMap[u.role] || 0) + 1;
    }
    if (u.role === 'super_admin') totalSuperAdmins++;
    if (u.role === 'branch_admin') totalBranchAdmins++;

    // Position holder check (anything other than General Member or undefined)
    if (u.position && u.position !== 'General Member') {
      totalPositionHolders++;
    }

    // District
    const dist = u.district?.trim() || 'Unassigned';
    districtMap[dist] = (districtMap[dist] || 0) + 1;

    // City
    const city = u.city?.trim() || dist;
    if (!cityMap[city]) {
      cityMap[city] = { count: 1, district: dist };
    } else {
      cityMap[city].count += 1;
    }

    // Branch
    const branch = u.branch?.trim() || `${dist} Branch`;
    if (!branchMap[branch]) {
      branchMap[branch] = { count: 1, district: dist };
    } else {
      branchMap[branch].count += 1;
    }

    // Gender
    if (u.gender === 'female') genderCounts.female++;
    else if (u.gender === 'other') genderCounts.other++;
    else genderCounts.male++;
  });

  const districtCounts = Object.entries(districtMap)
    .map(([district, count]) => ({
      district,
      count,
      percentage: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const cityCounts = Object.entries(cityMap)
    .map(([city, data]) => ({
      city,
      district: data.district,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count);

  const branchCounts = Object.entries(branchMap)
    .map(([branch, data]) => ({
      branch,
      district: data.district,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count);

  const roleCounts: { role: UserRole; label: string; count: number }[] = [
    { role: 'super_admin', label: 'Super Admin', count: roleMap.super_admin },
    { role: 'branch_admin', label: 'Branch Admin', count: roleMap.branch_admin },
    { role: 'member', label: 'Sangam Member', count: roleMap.member }
  ];

  return {
    totalMembers,
    totalSuperAdmins,
    totalBranchAdmins,
    totalPositionHolders,
    districtCounts,
    cityCounts,
    branchCounts,
    roleCounts,
    genderCounts
  };
};

export const updateUserRoleAndPosition = (
  userId: string,
  newRole: UserRole,
  newPosition: string,
  newPositionTa?: string,
  assignedBranch?: string
): AuthUser[] => {
  const currentMembers = loadAllRegisteredUsers();
  const updated = currentMembers.map((m) => {
    if (m.id === userId || m.membershipCode === userId) {
      return {
        ...m,
        role: newRole,
        position: newPosition,
        positionTa: newPositionTa || newPosition,
        ...(assignedBranch ? { branch: assignedBranch } : {})
      };
    }
    return m;
  });

  saveAllRegisteredUsers(updated);

  // If current logged-in user modified themselves, update currentUser state
  const currentUser = loadCurrentUser();
  if (currentUser && (currentUser.id === userId || currentUser.membershipCode === userId)) {
    const updatedCurrent = updated.find((u) => u.id === userId || u.membershipCode === userId);
    if (updatedCurrent) {
      saveCurrentUser(updatedCurrent);
    }
  }

  return updated;
};

export const deleteRegisteredUser = (userId: string): AuthUser[] => {
  const currentMembers = loadAllRegisteredUsers();
  const filtered = currentMembers.filter((m) => m.id !== userId && m.membershipCode !== userId);
  saveAllRegisteredUsers(filtered);
  return filtered;
};

export const addNewUserByAdmin = (userData: Partial<AuthUser>): AuthUser => {
  const currentMembers = loadAllRegisteredUsers();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const membershipCode = userData.membershipCode || `MS-2026-${randomSuffix}`;

  const resolvedDistrict = userData.district || 'Chennai';
  const resolvedCity = userData.city || resolvedDistrict;
  const resolvedBranch = userData.branch || `${resolvedDistrict} Central Branch`;

  const newUser: AuthUser = {
    id: `user-admin-created-${Date.now()}`,
    fullName: userData.fullName || 'New Member',
    fullNameTa: userData.fullNameTa || userData.fullName || 'புதிய உறுப்பினர்',
    phone: userData.phone || '9840000000',
    email: userData.email || '',
    membershipCode,
    role: userData.role || 'member',
    position: userData.position || 'General Member',
    positionTa: userData.positionTa || 'பொது உறுப்பினர்',
    branch: resolvedBranch,
    district: resolvedDistrict,
    city: resolvedCity,
    doorNumber: userData.doorNumber || 'No. 1',
    streetName: userData.streetName || 'Main Street',
    areaLocality: userData.areaLocality || resolvedCity,
    state: userData.state || 'Tamil Nadu',
    pincode: userData.pincode || '600001',
    age: userData.age || 35,
    gender: userData.gender || 'male',
    privacyLevel: userData.privacyLevel || 'public_to_members',
    nativePlace: resolvedCity,
    occupation: userData.occupation || 'Community Member',
    bloodGroup: userData.bloodGroup || 'O+',
    joinedDate: new Date().toISOString().split('T')[0],
    isVerified: true
  };

  const updated = [newUser, ...currentMembers];
  saveAllRegisteredUsers(updated);
  return newUser;
};

const LOCAL_STORAGE_AUTH_KEY = 'ms_portal_current_user_v1';
const LOCAL_STORAGE_ALL_MEMBERS_KEY = 'ms_portal_registered_members_v1';

export const loadAllRegisteredUsers = (): AuthUser[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ALL_MEMBERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading registered users:', e);
  }
  return DEMO_ACCOUNTS;
};

export const saveAllRegisteredUsers = (users: AuthUser[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ALL_MEMBERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving registered users:', e);
  }
};

export const loadCurrentUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading current user:', e);
  }
  // Default to Guest / Not Logged In so user sees the Login & Registration flow first
  return null;
};

export const saveCurrentUser = (user: AuthUser | null) => {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  } catch (e) {
    console.error('Error saving current user:', e);
  }
};

export const registerNewMember = (formData: {
  fullName: string;
  fullNameTa?: string;
  phone: string;
  email?: string;
  username?: string;
  password?: string;
  district: string;
  city?: string;
  branch?: string;
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
}): AuthUser => {
  const currentMembers = loadAllRegisteredUsers();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const membershipCode = `MS-2026-${randomSuffix}`;

  const resolvedCity = formData.city?.trim() || formData.district || 'Chennai';
  const resolvedBranch = formData.branch?.trim() || `${formData.district || 'Tamil Nadu'} Central Branch`;
  const resolvedUsername = formData.username?.trim() || formData.email?.trim() || formData.phone.trim();

  const newMember: AuthUser = {
    id: `user-reg-${Date.now()}`,
    fullName: formData.fullName.trim(),
    fullNameTa: formData.fullNameTa?.trim() || formData.fullName.trim(),
    phone: formData.phone.trim(),
    email: formData.email?.trim() || '',
    username: resolvedUsername,
    password: formData.password || '123456',
    membershipCode,
    role: 'member',
    branch: resolvedBranch,
    district: formData.district || 'Tamil Nadu',
    city: resolvedCity,
    doorNumber: formData.doorNumber?.trim() || '',
    streetName: formData.streetName?.trim() || '',
    areaLocality: formData.areaLocality?.trim() || '',
    state: formData.state?.trim() || 'Tamil Nadu',
    pincode: formData.pincode?.trim() || '',
    age: formData.age || 35,
    gender: formData.gender || 'male',
    privacyLevel: formData.privacyLevel || 'public_to_members',
    nativePlace: resolvedCity,
    occupation: formData.occupation?.trim() || 'Community Member',
    bloodGroup: formData.bloodGroup || 'O+',
    joinedDate: new Date().toISOString().split('T')[0],
    isVerified: true
  };

  const updatedList = [newMember, ...currentMembers];
  saveAllRegisteredUsers(updatedList);
  saveCurrentUser(newMember);

  // Automatically sync and add to the Address Book
  addMemberToAddressBook({
    id: newMember.id,
    fullName: newMember.fullName,
    fullNameTa: newMember.fullNameTa || newMember.fullName,
    membershipCode: newMember.membershipCode,
    phone: newMember.phone,
    email: newMember.email || 'member@mudaliyarsangam.org',
    doorNumber: formData.doorNumber?.trim() || 'No. 12',
    streetName: formData.streetName?.trim() || 'Main Road',
    areaLocality: formData.areaLocality?.trim() || resolvedCity,
    city: resolvedCity,
    district: formData.district || 'Chennai',
    state: formData.state?.trim() || 'Tamil Nadu',
    pincode: formData.pincode?.trim() || '600001',
    occupation: formData.occupation?.trim() || 'Community Member',
    bloodGroup: formData.bloodGroup || 'O+ve',
    branch: resolvedBranch,
    age: formData.age || 35,
    gender: formData.gender || 'male',
    privacyLevel: formData.privacyLevel || 'public_to_members'
  });

  return newMember;
};

export const authenticateUser = (
  identifier: string,
  password?: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const cleanId = identifier.trim();
  if (!cleanId) {
    return { success: false, error: 'Identifier (Mobile / Email / Username) is required' };
  }

  const allUsers = loadAllRegisteredUsers();
  const found = allUsers.find((u) => {
    const cleanIdDigits = cleanId.replace(/\D/g, '');
    const userPhoneDigits = u.phone ? u.phone.replace(/\D/g, '') : '';
    const pMatch = (cleanIdDigits.length >= 10 && userPhoneDigits === cleanIdDigits) || (u.phone && u.phone.trim() === cleanId);
    const eMatch = u.email && u.email.trim().toLowerCase() === cleanId.toLowerCase();
    const uMatch = u.username && u.username.trim().toLowerCase() === cleanId.toLowerCase();
    const mMatch = u.membershipCode && u.membershipCode.trim().toLowerCase() === cleanId.toLowerCase();
    return pMatch || eMatch || uMatch || mMatch;
  });

  if (!found) {
    return { success: false, error: 'Account not found with this Mobile / Email / Username' };
  }

  // If user set a specific password, verify it (or allow demo password '123456' for ease)
  if (found.password && password && password !== '123456' && found.password !== password) {
    return { success: false, error: 'Invalid password. Please check and try again.' };
  }

  return { success: true, user: found };
};

export const requestPasswordReset = (
  identifier: string
): { success: boolean; user?: AuthUser; email?: string; resetToken?: string; error?: string } => {
  const cleanId = identifier.trim();
  if (!cleanId) {
    return { success: false, error: 'Please enter registered Email ID or Mobile Number' };
  }

  const cleanDigits = cleanId.replace(/\D/g, '');
  const allUsers = loadAllRegisteredUsers();
  const found = allUsers.find((u) => {
    const userPhoneDigits = u.phone ? u.phone.replace(/\D/g, '') : '';
    const pMatch = (cleanDigits.length >= 10 && userPhoneDigits === cleanDigits) || (u.phone && u.phone.trim() === cleanId);
    const eMatch = u.email && u.email.trim().toLowerCase() === cleanId.toLowerCase();
    const uMatch = u.username && u.username.trim().toLowerCase() === cleanId.toLowerCase();
    const mMatch = u.membershipCode && u.membershipCode.trim().toLowerCase() === cleanId.toLowerCase();
    return pMatch || eMatch || uMatch || mMatch;
  });

  if (!found) {
    return {
      success: false,
      error: 'No registered member account found with this Email ID or Mobile Number. Please check and try again.'
    };
  }

  const targetEmail = found.email?.trim() || `${found.phone}@mudaliyarsangam.org`;
  const resetToken = `rst-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return {
    success: true,
    user: found,
    email: targetEmail,
    resetToken
  };
};

export const updatePasswordForUser = (
  userIdOrPhone: string,
  newPassword: string
): { success: boolean; error?: string; user?: AuthUser } => {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const allUsers = loadAllRegisteredUsers();
  const cleanDigits = userIdOrPhone.replace(/\D/g, '');
  const index = allUsers.findIndex(
    (u) =>
      u.id === userIdOrPhone ||
      u.membershipCode.toLowerCase() === userIdOrPhone.toLowerCase() ||
      (cleanDigits.length >= 10 && u.phone && u.phone.replace(/\D/g, '') === cleanDigits) ||
      (u.email && u.email.toLowerCase() === userIdOrPhone.toLowerCase())
  );

  if (index === -1) {
    return { success: false, error: 'Member account not found' };
  }

  const updated: AuthUser = {
    ...allUsers[index],
    password: newPassword
  };
  allUsers[index] = updated;
  saveAllRegisteredUsers(allUsers);

  // If currently logged in user, keep synchronized
  const current = loadCurrentUser();
  if (current && (current.id === updated.id || current.membershipCode === updated.membershipCode)) {
    saveCurrentUser(updated);
  }

  return { success: true, user: updated };
};

export const updateMemberProfile = (updatedUser: AuthUser): void => {
  saveCurrentUser(updatedUser);
  const allUsers = loadAllRegisteredUsers();
  const index = allUsers.findIndex(
    (u) => u.id === updatedUser.id || u.membershipCode === updatedUser.membershipCode
  );
  if (index >= 0) {
    allUsers[index] = updatedUser;
    saveAllRegisteredUsers(allUsers);
  } else {
    saveAllRegisteredUsers([updatedUser, ...allUsers]);
  }
};
