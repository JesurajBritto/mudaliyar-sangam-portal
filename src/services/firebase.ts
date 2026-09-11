import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuthUser, MemberAddressEntry, UserRole } from '../types';
import { loadAllRegisteredUsers } from '../data/authData';

export const PRIMARY_SUPER_ADMIN_EMAIL = 'jesuraj1994@gmail.com';
const LOCAL_ADMIN_EMAILS_KEY = 'sangam_authorized_admin_emails';

export interface AdminEmailEntry {
  email: string;
  role: 'super_admin' | 'branch_admin';
  position: string;
  positionTa: string;
  grantedBy?: string;
  grantedAt: string;
}

// Convert email to safe Firestore document ID
export function emailToDocId(email: string): string {
  return email.toLowerCase().trim();
}

// Get fallback local authorized emails
export function getLocalAdminEmails(): AdminEmailEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_EMAILS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading local admin emails:', e);
  }
  return [
    {
      email: PRIMARY_SUPER_ADMIN_EMAIL,
      role: 'super_admin',
      position: 'State Super Administrator',
      positionTa: 'மாநில முதன்மை நிர்வாகி',
      grantedBy: 'System Bootstrap',
      grantedAt: '2025-01-01T00:00:00.000Z'
    }
  ];
}

// Save to local cache
export function saveLocalAdminEmails(list: AdminEmailEntry[]): void {
  try {
    localStorage.setItem(LOCAL_ADMIN_EMAILS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving local admin emails:', e);
  }
}

// Fetch authorized admin emails list from Firestore (with local fallback)
export async function fetchAdminEmails(): Promise<AdminEmailEntry[]> {
  const list: AdminEmailEntry[] = [];
  try {
    const snap = await getDocs(collection(db, 'admin_emails'));
    snap.forEach((d) => {
      list.push(d.data() as AdminEmailEntry);
    });
  } catch (err) {
    console.warn('Could not list admin_emails from Firestore, falling back to local cache:', err);
  }

  // Always ensure primary super admin is present
  const hasPrimary = list.some((e) => e.email.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase());
  if (!hasPrimary) {
    list.unshift({
      email: PRIMARY_SUPER_ADMIN_EMAIL,
      role: 'super_admin',
      position: 'State Super Administrator',
      positionTa: 'மாநில முதன்மை நிர்வாகி',
      grantedBy: 'System Bootstrap',
      grantedAt: '2025-01-01T00:00:00.000Z'
    });
  }

  // Merge with local storage entries if any
  const localList = getLocalAdminEmails();
  for (const loc of localList) {
    if (!list.some((item) => item.email.toLowerCase() === loc.email.toLowerCase())) {
      list.push(loc);
    }
  }

  saveLocalAdminEmails(list);
  return list;
}

// Grant an email Super Admin or Branch Admin access
export async function grantAdminEmail(entry: AdminEmailEntry): Promise<void> {
  const cleanEmail = entry.email.toLowerCase().trim();
  const docId = emailToDocId(cleanEmail);
  const normalizedEntry: AdminEmailEntry = {
    ...entry,
    email: cleanEmail
  };

  // 1. Save to Firestore admin_emails
  try {
    await setDoc(doc(db, 'admin_emails', docId), normalizedEntry);
  } catch (err) {
    console.error('Error saving admin_emails in Firestore:', err);
  }

  // 2. Update local storage
  const current = getLocalAdminEmails();
  const filtered = current.filter((e) => e.email.toLowerCase() !== cleanEmail);
  filtered.push(normalizedEntry);
  saveLocalAdminEmails(filtered);
}

// Revoke an email's admin access
export async function revokeAdminEmail(email: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Cannot revoke primary Super Administrator email.');
  }

  const docId = emailToDocId(cleanEmail);

  // 1. Remove from Firestore
  try {
    await deleteDoc(doc(db, 'admin_emails', docId));
  } catch (err) {
    console.error('Error deleting admin_emails in Firestore:', err);
  }

  // 2. Remove from local storage
  const current = getLocalAdminEmails();
  const filtered = current.filter((e) => e.email.toLowerCase() !== cleanEmail);
  saveLocalAdminEmails(filtered);
}

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with custom firestoreDatabaseId and enable long-polling
// to prevent WebChannel connection drops behind reverse proxies and in sandboxed environments
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isOfflineOrUnavailable =
    (error as any)?.code === 'unavailable' ||
    errMsg.includes('unavailable') ||
    errMsg.includes('the client is offline') ||
    errMsg.includes('Could not reach Cloud Firestore backend');

  if (isOfflineOrUnavailable) {
    console.warn(`[Firestore Offline/Unavailable] Operation ${operationType} on ${path}: ${errMsg}. Client is operating in offline mode.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isOffline =
      (error as any)?.code === 'unavailable' ||
      msg.includes('the client is offline') ||
      msg.includes('unavailable') ||
      msg.includes('Could not reach Cloud Firestore backend');
    if (isOffline) {
      console.warn('Firestore backend currently connecting/offline. Client is operating in local/offline mode.');
      return false;
    }
    // Test doc might not exist yet, connection is still valid
    return true;
  }
}

export interface GoogleAuthResult {
  user: AuthUser;
  isNewUser: boolean;
  googleProfile: {
    displayName: string;
    email: string;
    phoneNumber?: string;
    photoURL?: string;
    uid: string;
  };
}

// Synchronize user profile & roles after Firebase Auth (Google or Email/Password)
export async function syncUserAfterAuth(fbUser: FirebaseUser): Promise<GoogleAuthResult> {
  const cleanEmail = (fbUser.email || '').toLowerCase().trim();

  // Check if email has admin privileges:
  // 1. Primary super admin
  const isPrimarySuper = cleanEmail === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase();

  // 2. Fetch admin email record from Firestore / local cache
  let adminRecord: AdminEmailEntry | null = null;
  if (isPrimarySuper) {
    adminRecord = {
      email: cleanEmail,
      role: 'super_admin',
      position: 'State Super Administrator',
      positionTa: 'மாநில முதன்மை நிர்வாகி',
      grantedAt: new Date().toISOString()
    };
  } else {
    try {
      const adminDocSnap = await getDoc(doc(db, 'admin_emails', emailToDocId(cleanEmail)));
      if (adminDocSnap.exists()) {
        adminRecord = adminDocSnap.data() as AdminEmailEntry;
      }
    } catch (e) {
      console.warn('Could not read admin_emails for user, checking local cache:', e);
    }

    if (!adminRecord) {
      const localList = getLocalAdminEmails();
      const found = localList.find((item) => item.email.toLowerCase() === cleanEmail);
      if (found) adminRecord = found;
    }
  }

  const assignedRole: UserRole = adminRecord ? adminRecord.role : 'member';
  const assignedPosition = adminRecord ? adminRecord.position : 'General Member';
  const assignedPositionTa = adminRecord ? adminRecord.positionTa : 'பொது உறுப்பினர்';

  // Check if user already exists in Firestore
  const userDocRef = doc(db, 'users', fbUser.uid);
  let userData: AuthUser;
  let isNewUser = false;

  try {
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const existingData = userSnap.data() as AuthUser;
      // Member is considered registered if they have completed registration or have address details
      const hasCompletedRegistration = Boolean(
        existingData.isRegistrationComplete ||
        existingData.doorNumber ||
        existingData.streetName ||
        existingData.pincode ||
        (existingData.phone && existingData.phone.length >= 10 && existingData.district)
      );

      // If an admin record exists or user role was updated, promote/sync role
      if (adminRecord && existingData.role !== assignedRole) {
        userData = {
          ...existingData,
          role: assignedRole,
          position: assignedPosition,
          positionTa: assignedPositionTa,
          isRegistrationComplete: true
        };
        await setDoc(userDocRef, userData, { merge: true });
        isNewUser = false;
      } else if (adminRecord) {
        userData = {
          ...existingData,
          isRegistrationComplete: true
        };
        isNewUser = false;
      } else {
        userData = existingData;
        // If they already completed member registration details, they are existing
        // If not, they still need to complete registration
        isNewUser = !hasCompletedRegistration;
      }
    } else {
      // User doc does not exist under fbUser.uid in Firestore
      // Check if there is an existing member with this email in registered users
      const localList = loadAllRegisteredUsers();
      const matchedMember = cleanEmail
        ? localList.find((u) => u.email && u.email.toLowerCase().trim() === cleanEmail)
        : null;

      if (matchedMember) {
        // Link existing member record with Firebase UID
        userData = {
          ...matchedMember,
          id: fbUser.uid,
          email: cleanEmail,
          isRegistrationComplete: true
        };
        await setDoc(userDocRef, userData, { merge: true });
        isNewUser = false;
      } else if (adminRecord) {
        // Authorized administrator
        userData = {
          id: fbUser.uid,
          fullName: fbUser.displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'Administrator'),
          email: cleanEmail,
          phone: fbUser.phoneNumber || '',
          membershipCode: `MS-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          role: assignedRole,
          position: assignedPosition,
          positionTa: assignedPositionTa,
          branch: 'Chennai Central',
          district: 'Chennai',
          isVerified: true,
          isRegistrationComplete: true,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        await setDoc(userDocRef, userData);
        isNewUser = false;
      } else {
        // Brand new member who is NOT in our database yet
        isNewUser = true;
        userData = {
          id: fbUser.uid,
          fullName: fbUser.displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'Sangam Member'),
          email: cleanEmail,
          phone: fbUser.phoneNumber || '',
          membershipCode: `MS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'member',
          position: 'General Member',
          positionTa: 'பொது உறுப்பினர்',
          branch: 'Chennai Central',
          district: 'Chennai',
          isVerified: true,
          isRegistrationComplete: false,
          joinedDate: new Date().toISOString().split('T')[0],
        };
      }
    }

    // If user is super_admin, register in /admins/{uid} for firestore.rules
    if (userData.role === 'super_admin') {
      try {
        await setDoc(doc(db, 'admins', fbUser.uid), {
          uid: fbUser.uid,
          email: cleanEmail,
          role: 'super_admin',
          grantedAt: new Date().toISOString()
        }, { merge: true });
      } catch (adminErr) {
        console.warn('Could not write to admins collection:', adminErr);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
    throw err;
  }

  return {
    user: userData,
    isNewUser,
    googleProfile: {
      displayName: fbUser.displayName || '',
      email: cleanEmail,
      phoneNumber: fbUser.phoneNumber || '',
      photoURL: fbUser.photoURL || '',
      uid: fbUser.uid
    }
  };
}

// Google Sign In with Popup
export async function loginWithGoogle(): Promise<GoogleAuthResult> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return await syncUserAfterAuth(credential.user);
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

// Firebase Cloud Email & Password Sign In
export async function loginWithFirebaseEmailPassword(email: string, password: string): Promise<AuthUser> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const result = await syncUserAfterAuth(credential.user);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Email/Password Sign In Error:', error);
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Email/Password sign-in provider is disabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.'
      );
    }
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Access to this account has been temporarily disabled due to many failed login attempts.');
    }
    throw error;
  }
}

// Send Firebase Password Reset Email
export async function sendFirebasePasswordReset(email: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (err: any) {
    console.error('Password reset email error:', err);
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error('Email/Password provider is disabled in Firebase Console.');
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// Cloud Member Sync Functions
export async function syncMemberToCloud(member: MemberAddressEntry): Promise<void> {
  const path = `members/${member.id}`;
  try {
    await setDoc(doc(db, 'members', member.id), member);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchMembersFromCloud(): Promise<MemberAddressEntry[]> {
  const path = 'members';
  try {
    const snap = await getDocs(collection(db, path));
    const members: MemberAddressEntry[] = [];
    snap.forEach((d) => {
      members.push(d.data() as MemberAddressEntry);
    });
    return members;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// Real-time listener for members
export function subscribeMembersFromCloud(
  onUpdate: (members: MemberAddressEntry[]) => void
): () => void {
  const path = 'members';
  const unsubscribe = onSnapshot(
    collection(db, path),
    (snapshot) => {
      const members: MemberAddressEntry[] = [];
      snapshot.forEach((d) => {
        members.push(d.data() as MemberAddressEntry);
      });
      if (members.length > 0) {
        onUpdate(members);
      }
    },
    (error) => {
      const isUnavailable =
        (error as any)?.code === 'unavailable' ||
        error.message?.includes('unavailable') ||
        error.message?.includes('offline') ||
        error.message?.includes('Could not reach Cloud Firestore backend');
      if (isUnavailable) {
        console.warn('Firestore member sync operating in offline fallback mode:', error.message);
        return;
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
  return unsubscribe;
}

// Save or sync registered user directly in Firestore /users/{userId}
export async function saveUserToFirestore(user: AuthUser): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, user, { merge: true });

    // If granted super_admin, also register in /admins/{id} to satisfy firestore.rules
    if (user.role === 'super_admin') {
      try {
        await setDoc(doc(db, 'admins', user.id), {
          uid: user.id,
          email: (user.email || '').toLowerCase().trim(),
          role: 'super_admin',
          grantedAt: new Date().toISOString()
        }, { merge: true });
      } catch (adminErr) {
        console.warn('Could not write to admins collection:', adminErr);
      }
    }
  } catch (err) {
    console.warn('Could not save user to Firestore:', err);
  }
}

// Fetch all registered users from Firestore /users
export async function fetchUsersFromFirestore(): Promise<AuthUser[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: AuthUser[] = [];
    snap.forEach((d) => {
      users.push(d.data() as AuthUser);
    });
    return users;
  } catch (err) {
    console.warn('Could not fetch users from Firestore:', err);
    return [];
  }
}

// Update a user's role and position in Firestore
export async function updateUserRoleInFirestore(
  userId: string,
  newRole: UserRole,
  position?: string,
  positionTa?: string,
  email?: string
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const updates: Partial<AuthUser> = {
      role: newRole,
      ...(position ? { position } : {}),
      ...(positionTa ? { positionTa } : {})
    };
    await setDoc(userDocRef, updates, { merge: true });

    // If promoted to super_admin or branch_admin and email exists, ensure admin_emails has it
    if (email && (newRole === 'super_admin' || newRole === 'branch_admin')) {
      await grantAdminEmail({
        email: email.toLowerCase().trim(),
        role: newRole,
        position: position || (newRole === 'super_admin' ? 'State Administrator' : 'Branch Administrator'),
        positionTa: positionTa || (newRole === 'super_admin' ? 'மாநில நிர்வாகி' : 'கிளை நிர்வாகி'),
        grantedBy: 'Admin Role Editor',
        grantedAt: new Date().toISOString()
      });
    }

    // Update /admins/{userId}
    if (newRole === 'super_admin') {
      await setDoc(doc(db, 'admins', userId), {
        uid: userId,
        email: email ? email.toLowerCase().trim() : '',
        role: 'super_admin',
        grantedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      // If demoted from super_admin, remove from /admins/{userId}
      try {
        await deleteDoc(doc(db, 'admins', userId));
      } catch {
        // ignore if not present
      }
    }
  } catch (err) {
    console.error('Error updating user role in Firestore:', err);
    throw err;
  }
}
