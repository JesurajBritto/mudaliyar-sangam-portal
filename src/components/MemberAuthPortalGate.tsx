import React, { useState, useEffect } from 'react';
import {
  Landmark,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  QrCode,
  KeyRound,
  UserCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  IdCard,
  Building2,
  Clock,
  Shield,
  Copy,
  Check,
  Users,
  Award,
  BookUser,
  Heart,
  CreditCard,
  Lock,
  ArrowRight,
  Home,
  Navigation,
  Globe2,
  Calendar,
  Eye,
  EyeOff,
  Megaphone,
  GraduationCap
} from 'lucide-react';
import { AuthUser, Language, AddressPrivacyLevel } from '../types';
import { registerNewMember, saveCurrentUser, authenticateUser } from '../data/authData';
import { CompletePortalData, loadPortalContent } from '../data/portalContentData';
import { loginWithGoogle, loginWithFirebaseEmailPassword, saveUserToFirestore } from '../services/firebase';
import { SangamLogo } from './SangamLogo';
import { RegistrationReviewModal, RegistrationReviewData } from './RegistrationReviewModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface MemberAuthPortalGateProps {
  language: Language;
  onLoginSuccess: (user: AuthUser) => void;
  initialTab?: 'login' | 'register';
  portalData?: CompletePortalData;
}

export const MemberAuthPortalGate: React.FC<MemberAuthPortalGateProps> = ({
  language,
  onLoginSuccess,
  initialTab = 'login',
  portalData: propPortalData
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [portalData, setPortalData] = useState<CompletePortalData>(
    propPortalData || loadPortalContent()
  );

  useEffect(() => {
    if (propPortalData) {
      setPortalData(propPortalData);
    }
  }, [propPortalData]);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CompletePortalData>;
      if (customEvent.detail) {
        setPortalData(customEvent.detail);
      } else {
        setPortalData(loadPortalContent());
      }
    };
    window.addEventListener('sangam_portal_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('sangam_portal_content_updated', handleUpdate);
    };
  }, []);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [googleNewMemberNotice, setGoogleNewMemberNotice] = useState<{
    email: string;
    name: string;
    uid: string;
  } | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setLoginError('');
      const authResult = await loginWithGoogle();

      if (authResult.isNewUser) {
        // New member not in our database -> redirect to fill new registration form!
        setActiveTab('register');
        if (authResult.googleProfile.displayName) {
          setRegFullName(authResult.googleProfile.displayName);
        }
        if (authResult.googleProfile.email) {
          setRegEmail(authResult.googleProfile.email);
          setRegUsernameChoice('email');
        }
        if (authResult.googleProfile.phoneNumber) {
          setRegPhone(authResult.googleProfile.phoneNumber);
        }
        setGoogleNewMemberNotice({
          email: authResult.googleProfile.email,
          name: authResult.googleProfile.displayName,
          uid: authResult.googleProfile.uid
        });

        // Smoothly scroll down to the registration section
        setTimeout(() => {
          const regElement = document.getElementById('new-member-registration-section');
          if (regElement) {
            regElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }
        }, 150);
        return;
      }

      // Existing member found in database
      saveCurrentUser(authResult.user);
      onLoginSuccess(authResult.user);
    } catch (err: any) {
      console.error('Firebase Google login failed', err);
      setLoginError(
        language === 'ta'
          ? 'Google மூலம் உள்நுழைவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Register form state (Personal, Contact, and Detailed Address)
  const [regFullName, setRegFullName] = useState('');
  const [regFullNameTa, setRegFullNameTa] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAge, setRegAge] = useState<number | string>('');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');

  // Username identifier choice and password for next login
  const [regUsernameChoice, setRegUsernameChoice] = useState<'mobile' | 'email'>('mobile');
  const [regPassword, setRegPassword] = useState('123456');
  const [regConfirmPassword, setRegConfirmPassword] = useState('123456');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Review & Verification Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<RegistrationReviewData | null>(null);

  // Address fields (Required)
  const [regDoorNumber, setRegDoorNumber] = useState('');
  const [regStreetName, setRegStreetName] = useState('');
  const [regAreaLocality, setRegAreaLocality] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regDistrict, setRegDistrict] = useState('Chennai');
  const [regPincode, setRegPincode] = useState('');
  const [regState, setRegState] = useState('Tamil Nadu');

  // Professional & Sangam fields
  const [regBranch, setRegBranch] = useState('Chennai Central Branch');
  const [regOccupation, setRegOccupation] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regPrivacyLevel, setRegPrivacyLevel] = useState<AddressPrivacyLevel>('public_to_members');
  const [regSuccessUser, setRegSuccessUser] = useState<AuthUser | null>(null);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const identifier = loginPhone.trim();
    if (!identifier) {
      setLoginError(
        language === 'ta'
          ? 'தயவுசெய்து மின்னஞ்சல் அல்லது பதிவு செய்யப்பட்ட மொபைல் எண்ணை உள்ளிடவும்'
          : 'Please enter your registered Email or Mobile Number'
      );
      return;
    }

    if (!loginPassword) {
      setLoginError(
        language === 'ta'
          ? 'தயவுசெய்து கடவுச்சொல்லை உள்ளிடவும்'
          : 'Please enter your password'
      );
      return;
    }

    setIsLoggingIn(true);
    try {
      // 1. If identifier looks like an email, attempt Firebase Cloud Email/Password authentication
      if (identifier.includes('@')) {
        try {
          const fbUser = await loginWithFirebaseEmailPassword(identifier, loginPassword);
          saveCurrentUser(fbUser);
          onLoginSuccess(fbUser);
          return;
        } catch (fbErr: any) {
          console.warn('Firebase Email/Password login error:', fbErr.message);
          // If the provider is disabled in Firebase Console, guide user explicitly
          if (fbErr.message && (fbErr.message.includes('Firebase Console') || fbErr.message.includes('operation-not-allowed'))) {
            setLoginError(
              language === 'ta'
                ? 'Firebase கன்சோலில் Email/Password இன்னும் இயக்கப்படவில்லை. Firebase Console > Authentication > Sign-in method சென்று Email/Password-ஐ இயக்கவும்.'
                : fbErr.message
            );
            return;
          }
          // If invalid password/credential, also try local accounts before giving up
        }
      }

      // 2. Fall back to local accounts / registered members
      const authRes = authenticateUser(identifier, loginPassword);
      if (authRes.success && authRes.user) {
        saveCurrentUser(authRes.user);
        onLoginSuccess(authRes.user);
      } else {
        setLoginError(
          authRes.error ||
            (language === 'ta'
              ? 'தவறான மின்னஞ்சல்/மொபைல் எண் அல்லது கடவுச்சொல். தயவுசெய்து மீண்டும் சரிபார்க்கவும்.'
              : 'Invalid Email/Mobile number or password. Please verify your credentials.')
        );
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      alert(language === 'ta' ? 'பெயர் கட்டாயம்' : 'Full Name is required');
      return;
    }
    if (!regPhone.trim()) {
      alert(language === 'ta' ? 'மொபைல் எண் கட்டாயம்' : 'Mobile Number is required');
      return;
    }
    if (!regEmail.trim()) {
      alert(language === 'ta' ? 'மின்னஞ்சல் முகவரி கட்டாயம்' : 'Email Address is required');
      return;
    }
    if (!regDoorNumber.trim() || !regStreetName.trim() || !regCity.trim() || !regPincode.trim()) {
      alert(
        language === 'ta'
          ? 'முகவரி விவரங்கள் (கதவு எண், தெரு பெயர், நகரம், அஞ்சல் குறியீடு) கட்டாயம்'
          : 'Address details (Door No, Street Name, City, Pincode) are required for Address Book storage'
      );
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      alert(
        language === 'ta'
          ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      alert(
        language === 'ta'
          ? 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் சரிபார்க்கவும்.'
          : 'Passwords do not match. Please verify.'
      );
      return;
    }

    const cleanPhone = regPhone.replace(/\D/g, '');
    const chosenUsername = regUsernameChoice === 'email' ? regEmail.trim() : cleanPhone;

    // Prepare Review Data
    const data: RegistrationReviewData = {
      fullName: regFullName.trim(),
      fullNameTa: regFullNameTa.trim() || regFullName.trim(),
      phone: cleanPhone,
      email: regEmail.trim(),
      username: chosenUsername,
      password: regPassword,
      doorNumber: regDoorNumber.trim(),
      streetName: regStreetName.trim(),
      areaLocality: regAreaLocality.trim() || regCity.trim(),
      city: regCity.trim(),
      district: regDistrict,
      state: regState,
      pincode: regPincode.trim(),
      age: regAge ? Number(regAge) : 35,
      gender: regGender,
      branch: regBranch || `${regDistrict} Branch`,
      occupation: regOccupation.trim() || 'Community Member',
      bloodGroup: regBloodGroup,
      privacyLevel: regPrivacyLevel
    };

    setReviewData(data);
    setIsReviewModalOpen(true);
  };

  const handleFinalConfirmRegistration = () => {
    if (!reviewData) return;

    const newUser = registerNewMember({
      id: googleNewMemberNotice?.uid,
      fullName: reviewData.fullName,
      fullNameTa: reviewData.fullNameTa,
      phone: reviewData.phone,
      email: reviewData.email,
      username: reviewData.username,
      password: reviewData.password,
      age: reviewData.age,
      gender: reviewData.gender,
      doorNumber: reviewData.doorNumber,
      streetName: reviewData.streetName,
      areaLocality: reviewData.areaLocality,
      city: reviewData.city,
      district: reviewData.district,
      state: reviewData.state,
      pincode: reviewData.pincode,
      branch: reviewData.branch,
      occupation: reviewData.occupation,
      bloodGroup: reviewData.bloodGroup,
      privacyLevel: reviewData.privacyLevel,
      isRegistrationComplete: true
    });

    setIsReviewModalOpen(false);
    setRegSuccessUser(newUser);

    // Persist new user in Firestore database with completed registration flag
    saveUserToFirestore({
      ...newUser,
      isRegistrationComplete: true
    }).catch((err) =>
      console.warn('Could not sync newly registered member to Firestore:', err)
    );

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1800);
  };

  const tamilNaduDistricts = [
    'Chennai',
    'Kanchipuram',
    'Chengalpattu',
    'Tiruvallur',
    'Vellore',
    'Ranipet',
    'Tirupathur',
    'Tiruvannamalai',
    'Coimbatore',
    'Tiruppur',
    'Erode',
    'Salem',
    'Namakkal',
    'Dharmapuri',
    'Krishnagiri',
    'Madurai',
    'Dindigul',
    'Theni',
    'Virudhunagar',
    'Sivaganga',
    'Ramanathapuram',
    'Tiruchirappalli',
    'Karur',
    'Perambalur',
    'Ariyalur',
    'Thanjavur',
    'Tiruvarur',
    'Nagapattinam',
    'Mayiladuthurai',
    'Pudukkottai',
    'Cuddalore',
    'Villupuram',
    'Kallakurichi',
    'Tirunelveli',
    'Tenkasi',
    'Thoothukudi',
    'Kanniyakumari',
    'Nilgiris'
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO GATEWAY HEADER - SOPHISTICATED IVORY & ANCIENT HERITAGE ACCENT */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-7 sm:p-10">
        {/* Hairline Top Heritage Gold Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7e1927] via-[#b8860b] to-[#7e1927]" />
        
        {/* Subtle background heritage watermark */}
        <div className="absolute inset-0 bg-heritage-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <SangamLogo branding={portalData.branding} size="xl" showBorder={true} className="shadow-[0_4px_16px_rgba(128,21,36,0.15)]" />
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf6ed] text-[#7e5b0b] text-xs font-semibold border border-[#e8dcbb] shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>
                  {language === 'ta'
                    ? (portalData.branding?.regNumberTa || 'அரசு பதிவு பெற்ற சங்கம் • பதிவு எண்: 124/1988')
                    : (portalData.branding?.regNumberEn || 'Govt. Registered Community Association • Reg. No: 124/1988')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-stone-900 font-display">
                {language === 'ta'
                  ? (portalData.branding?.sangamNameTa || 'தமிழ்நாடு முதலியார் சங்கம் மத்திய செயலக போர்ட்டல்')
                  : (portalData.branding?.sangamNameEn || 'Tamil Nadu Mudaliyar Sangam Central Secretariat Portal')}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
                {language === 'ta'
                  ? (portalData.branding?.subTitleTa || 'உறுப்பினர்கள் மற்றும் நிர்வாகிகள் மட்டுமே இந்த போர்ட்டலில் உள்நுழைந்து முகவரி புத்தகம், வணிக விளம்பரங்கள் & தகவல் பதிவுகள், இளைஞர் கல்வி உதவித்தொகை மற்றும் சமுதாயக் கருவிகளை அணுக முடியும்.')
                  : (portalData.branding?.subTitleEn || 'Official secured gateway for verified members & administrators. Register or sign in to access the address book, business ads & feed, youth career & scholarship, and community features.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AUTHENTICATION & REGISTRATION HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login / Registration Form Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#e8e3d8] relative">
          {/* Navigation Pill Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-[#f5f2eb] rounded-2xl mb-8 border border-[#e5dfd2] gap-1.5">
            <button
              id="gate-tab-login"
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#801524] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{language === 'ta' ? 'உள்நுழைவு (Sign In)' : 'Sign In'}</span>
            </button>

            <button
              id="gate-tab-register"
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#801524] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{language === 'ta' ? 'புதிய உறுப்பினர் பதிவு (Register)' : 'New Registration'}</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          <div>
            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <div className="space-y-6">
                {/* Google Sign In */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full py-3 px-4 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-2xl text-xs sm:text-sm transition-all border border-[#d8d0c2] shadow-2xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {isGoogleLoading ? (
                      <div className="w-4 h-4 border-2 border-[#801524] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    )}
                    <span>
                      {isGoogleLoading
                        ? (language === 'ta' ? 'Google உடன் இணைக்கப்படுகிறது...' : 'Connecting to Google...')
                        : (language === 'ta' ? 'Google கணக்கு மூலம் உள்நுழைக' : 'Sign In with Google')}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#e8e3d8] w-full"></div>
                  <span className="bg-white px-3 text-xs text-stone-500 uppercase font-semibold tracking-wider">
                    {language === 'ta' ? 'அல்லது' : 'OR'}
                  </span>
                </div>

                {/* Login Form */}
                <form onSubmit={handleManualLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      {language === 'ta'
                        ? 'மின்னஞ்சல் அல்லது பதிவு செய்யப்பட்ட மொபைல் எண் *'
                        : 'Email Address or Registered Mobile Number *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="e.g. admin@gmail.com / 9840012345"
                        className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 placeholder-stone-400 focus:bg-white focus:ring-2 focus:ring-[#b8860b]/20 focus:border-[#b8860b] focus:outline-none transition-all font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {language === 'ta'
                        ? 'மின்னஞ்சல் அல்லது பதிவு செய்யப்பட்ட மொபைல் எண்ணை உள்ளிடலாம்.'
                        : 'Enter your Email or registered member mobile number.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-800">
                        {language === 'ta' ? 'கடவுச்சொல் (Password) *' : 'Password *'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-[11px] text-[#801524] font-bold cursor-pointer hover:underline"
                      >
                        {language === 'ta' ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#b8860b]/20 focus:border-[#b8860b] focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 bg-[#801524] hover:bg-[#68101c] text-white font-bold rounded-xl text-sm transition-all shadow-[0_2px_10px_rgba(128,21,36,0.18)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoggingIn ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>
                      {isLoggingIn
                        ? language === 'ta'
                          ? 'சரிபார்க்கப்படுகிறது...'
                          : 'Verifying...'
                        : language === 'ta'
                        ? 'உள்நுழைவு (Sign In)'
                        : 'Sign In'}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: REGISTER (WITH REQUIRED ADDRESS DETAILS STORED DIRECTLY IN ADDRESS BOOK) */}
            {activeTab === 'register' && (
              <div id="new-member-registration-section">
                {regSuccessUser ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
                    <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                    <h3 className="text-xl font-bold text-emerald-950 font-display">
                      {language === 'ta' ? 'உறுப்பினர் பதிவு & முகவரி சேமிப்பு வெற்றிகரமாக முடிந்தது!' : 'Registration & Address Book Entry Successful!'}
                    </h3>
                    <p className="text-sm text-emerald-800">
                      {language === 'ta'
                        ? `வணக்கம் ${regSuccessUser.fullName}, உங்கள் உறுப்பினர் அடையாள எண் ஒதுக்கப்பட்டு முகவரி புத்தகத்தில் சேர்க்கப்பட்டுள்ளது:`
                        : `Welcome ${regSuccessUser.fullName}, your Sangam Membership ID is ready & saved in the Address Book:`}
                    </p>
                    <div className="inline-block px-6 py-2.5 bg-emerald-800 text-white font-bold text-lg tracking-wider rounded-2xl shadow-sm font-mono">
                      {regSuccessUser.membershipCode}
                    </div>
                    <p className="text-xs text-stone-500">
                      {language === 'ta' ? 'தளம் தானாகத் திறக்கிறது...' : 'Unlocking portal details...'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    {/* Google Sign-in New Member Notice (Shown when redirected after Google sign-in) */}
                    {googleNewMemberNotice && (
                      <div className="p-4.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/90 rounded-2xl text-amber-950 flex items-start gap-3.5 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-200/80 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-900 shadow-xs">
                          <Sparkles className="w-5 h-5 text-amber-800" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-950 border border-amber-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 inline" />
                              Google Sign-In Verified
                            </span>
                            <span className="text-xs font-semibold text-stone-700 font-mono">
                              {googleNewMemberNotice.email}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-amber-950 font-display">
                            {language === 'ta'
                              ? 'Google உள்நுழைவு முடிந்தது! புதிய உறுப்பினர் பதிவு'
                              : 'Google Sign-In Verified! Complete New Member Registration'}
                          </h4>
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {language === 'ta'
                              ? 'உங்கள் Google கணக்கு வெற்றிகரமாக இணைக்கப்பட்டது. நீங்கள் சங்க தரவுத்தளத்தில் புதிய உறுப்பினர் என்பதால், உங்கள் உறுப்பினர் அடையாள அட்டை மற்றும் முகவரிப் புத்தகத்தில் சேர்க்க கீழ்க்கண்ட படிவத்தைப் பூர்த்தி செய்து பதிவை முடிக்கவும்.'
                              : 'Your Google account is authenticated. Since you are not yet in our member database, please complete your address & contact details below to finalize your official Sangam registration.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Welcome Notice */}
                    <div className="p-4 bg-[#faf6ed] border border-[#e8dcbb] rounded-2xl text-xs text-[#7e5b0b] flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#b8860b] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">
                          {language === 'ta'
                            ? 'நேரடி உறுப்பினர் பதிவு & முகவரிப் புத்தக உள்ளீடு'
                            : 'Official Member Registration & Address Book Census Form'}
                        </p>
                        <p className="text-stone-600">
                          {language === 'ta'
                            ? 'கீழ்க்கண்ட விவரங்களைப் பூர்த்தி செய்து உடனடியாக டிஜிட்டல் அடையாள அட்டை, முகவரி புத்தகம் மற்றும் சமுதாய நன்மைகளைப் பெறுங்கள்.'
                            : 'Fill in your personal & residential address details. Once registered, your entry will be securely persisted to the official Sangam Address Book.'}
                        </p>
                      </div>
                    </div>

                    {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#e8e3d8]">
                        <span className="w-6 h-6 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] font-bold text-xs flex items-center justify-center">
                          1
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          {language === 'ta' ? 'தனிநபர் & தொடர்பு விவரங்கள்' : 'Personal & Contact Information'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'முழு பெயர் (ஆங்கிலத்தில்) *' : 'Full Name (English) *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={regFullName}
                            onChange={(e) => setRegFullName(e.target.value)}
                            placeholder="e.g. S. Murugesan Mudaliyar"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'பெயர் (தமிழில்)' : 'Name in Tamil'}
                          </label>
                          <input
                            type="text"
                            value={regFullNameTa}
                            onChange={(e) => setRegFullNameTa(e.target.value)}
                            placeholder="எ.கா. சு. முருகேசன் முதலியார்"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'மொபைல் எண் *' : 'Mobile Number *'}
                          </label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="tel"
                              required
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              placeholder="9876543210"
                              className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-stone-700">
                              {language === 'ta' ? 'மின்னஞ்சல் (Email) *' : 'Email Address *'}
                            </label>
                            {googleNewMemberNotice && regEmail.toLowerCase() === googleNewMemberNotice.email.toLowerCase() && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                                ✓ Google Verified
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="email"
                              required
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="name@gmail.com"
                              className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              {language === 'ta' ? 'வயது' : 'Age'}
                            </label>
                            <input
                              type="number"
                              min="18"
                              max="110"
                              value={regAge}
                              onChange={(e) => setRegAge(e.target.value)}
                              placeholder="38"
                              className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              {language === 'ta' ? 'பாலினம்' : 'Gender'}
                            </label>
                            <select
                              value={regGender}
                              onChange={(e) => setRegGender(e.target.value as any)}
                              className="w-full px-2 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 font-medium"
                            >
                              <option value="male">{language === 'ta' ? 'ஆண்' : 'Male'}</option>
                              <option value="female">{language === 'ta' ? 'பெண்' : 'Female'}</option>
                              <option value="other">{language === 'ta' ? 'மற்றவை' : 'Other'}</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Username Choice & Password for Next Login */}
                      <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3 mt-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-700" />
                          <h4 className="text-xs font-bold text-amber-950">
                            {language === 'ta'
                              ? 'அடுத்த உள்நுழைவுக்கான பயனர் பெயர் & கடவுச்சொல்'
                              : 'Username & Password for Next Login'}
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta'
                              ? 'உள்நுழைவு பயனர் பெயராக எதைப் பயன்படுத்த விரும்புகிறீர்கள்?'
                              : 'Select Username Identifier for Login:'}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setRegUsernameChoice('mobile')}
                              className={`py-2 px-3 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                regUsernameChoice === 'mobile'
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRegUsernameChoice('email')}
                              className={`py-2 px-3 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                regUsernameChoice === 'email'
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'மின்னஞ்சல் ID' : 'Email ID'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              {language === 'ta'
                                ? 'கடவுச்சொல் அமைக்க (குறைந்தது 6) *'
                                : 'Set Password (Min 6 chars) *'}
                            </label>
                            <div className="relative">
                              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type={showRegPassword ? 'text' : 'password'}
                                required
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="••••••"
                                className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegPassword(!showRegPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                              >
                                {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              {language === 'ta'
                                ? 'கடவுச்சொல்லை உறுதிசெய் *'
                                : 'Confirm Password *'}
                            </label>
                            <div className="relative">
                              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type={showRegPassword ? 'text' : 'password'}
                                required
                                value={regConfirmPassword}
                                onChange={(e) => setRegConfirmPassword(e.target.value)}
                                placeholder="••••••"
                                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: RESIDENTIAL ADDRESS DETAILS (REQUIRED FOR ADDRESS BOOK) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#e8e3d8]">
                        <span className="w-6 h-6 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] font-bold text-xs flex items-center justify-center">
                          2
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-[#b8860b]" />
                          <span>{language === 'ta' ? 'குடியிருப்பு முகவரி விவரங்கள் (Address Book)' : 'Residential Address Details (Required)'}</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'கதவு / பிளாட் எண் *' : 'Door / Flat / Plot No. *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={regDoorNumber}
                            onChange={(e) => setRegDoorNumber(e.target.value)}
                            placeholder={language === 'ta' ? 'எ.கா. 48/B அல்லது கதவு எண் 12' : 'e.g. 48/B or Door No. 12'}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'தெரு பெயர் / சாலை *' : 'Street Name / Main Road *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={regStreetName}
                            onChange={(e) => setRegStreetName(e.target.value)}
                            placeholder={language === 'ta' ? 'எ.கா. காந்தி ரோடு, வரதராஜ பெருமாள் கோவில் அருகில்' : 'e.g. Gandhi Road, Near Temple'}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'பகுதி / இருப்பிடம் (Area / Locality)' : 'Area / Locality / Landmark'}
                          </label>
                          <input
                            type="text"
                            value={regAreaLocality}
                            onChange={(e) => setRegAreaLocality(e.target.value)}
                            placeholder={language === 'ta' ? 'எ.கா. அண்ணா நகர் மேற்கு / பெரிய காஞ்சிபுரம்' : 'e.g. Anna Nagar West / Heritage Zone'}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'நகரம் / கிராமம் (City / Town) *' : 'City / Town / Village *'}
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="text"
                              required
                              value={regCity}
                              onChange={(e) => setRegCity(e.target.value)}
                              placeholder={language === 'ta' ? 'எ.கா. காஞ்சிபுரம் / சென்னை / கோவை' : 'e.g. Kanchipuram / Chennai / Madurai'}
                              className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-medium transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'மாவட்டம் (38 மாவட்டங்கள்) *' : 'District *'}
                          </label>
                          <select
                            value={regDistrict}
                            onChange={(e) => {
                              setRegDistrict(e.target.value);
                              setRegBranch(`${e.target.value} Central Branch`);
                            }}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 font-medium"
                          >
                            {tamilNaduDistricts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'அஞ்சல் குறியீடு (Pincode) *' : 'Pincode (6 Digits) *'}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={regPincode}
                            onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                            placeholder="631501"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 focus:bg-white focus:border-[#b8860b] focus:ring-1.5 focus:ring-[#b8860b]/20 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'மாநிலம்' : 'State'}
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={regState}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e8e3d8] bg-[#f5f2eb] text-stone-700 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: SANGAM & COMMUNITY SETTINGS */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#e8e3d8]">
                        <span className="w-6 h-6 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb] font-bold text-xs flex items-center justify-center">
                          3
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          {language === 'ta' ? 'சங்க கிளை & தொழில் விவரங்கள்' : 'Sangam Branch, Profession & Privacy'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'தொழில் / பணி' : 'Occupation / Profession'}
                          </label>
                          <div className="relative">
                            <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="text"
                              value={regOccupation}
                              onChange={(e) => setRegOccupation(e.target.value)}
                              placeholder={language === 'ta' ? 'எ.கா. சாப்ட்வேர் / வணிகம் / மருத்துவர்' : 'e.g. Software / Merchant / Doctor'}
                              className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'இரத்த வகை' : 'Blood Group'}
                          </label>
                          <select
                            value={regBloodGroup}
                            onChange={(e) => setRegBloodGroup(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 font-medium"
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
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'ta' ? 'முகவரி தனியுரிமை (DPDP)' : 'Address Privacy (DPDP 2023)'}
                          </label>
                          <select
                            value={regPrivacyLevel}
                            onChange={(e) => setRegPrivacyLevel(e.target.value as AddressPrivacyLevel)}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e0d9cc] bg-[#faf8f5] text-stone-900 font-medium"
                          >
                            <option value="public_to_members">
                              {language === 'ta' ? 'உறுப்பினர்களுக்குத் திறந்தது' : 'Public to Verified Members'}
                            </option>
                            <option value="request_only">
                              {language === 'ta' ? 'ஒப்புதல் கோரிக்கை மட்டும்' : 'Request-Only (Masked)'}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#801524] via-[#941c2c] to-[#600f1a] hover:opacity-95 text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>
                        {language === 'ta'
                          ? 'விவரங்களைச் சரிபார்த்து பதிவு செய்ய'
                          : 'Proceed to Review Details & Register'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Portal Feature Preview & Member Privileges */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#801524]" />
                <span>{language === 'ta' ? 'உறுப்பினர் சிறப்பு வசதிகள்' : 'Member Features (Unlocked on Login)'}</span>
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#faf6ed] text-[#7e5b0b] border border-[#e8dcbb]">
                4 Modules
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Feature 1: Address Book */}
              <div className="p-3.5 rounded-2xl border border-[#e8e3d8] bg-[#fdfbf7] hover:border-[#c8a86b]/70 hover:bg-white transition-all flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-xl bg-[#faf6ed] text-[#8c6507] border border-[#e8dcbb] flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                  01
                </div>
                <div>
                  <p className="font-bold text-stone-900 group-hover:text-[#801524] transition-colors">
                    {language === 'ta' ? 'முகவரிப் புத்தகம்' : 'Address Book'}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                    {language === 'ta'
                      ? 'உறுப்பினர்கள் பிற உறுப்பினர்களுடன் நேரடியாகத் தொடர்புகொள்ளலாம்'
                      : 'Members can connect across all other members'}
                  </p>
                </div>
              </div>

              {/* Feature 2: Business Ads & Feed */}
              <div className="p-3.5 rounded-2xl border border-[#e8e3d8] bg-[#fdfbf7] hover:border-[#c8a86b]/70 hover:bg-white transition-all flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-xl bg-[#faf6ed] text-[#8c6507] border border-[#e8dcbb] flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                  02
                </div>
                <div>
                  <p className="font-bold text-stone-900 group-hover:text-[#801524] transition-colors">
                    {language === 'ta' ? 'வணிக விளம்பரங்கள் & தகவல் பதிவுகள்' : 'Business Ads and Feed'}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                    {language === 'ta'
                      ? 'சமுதாய வணிக விளம்பரங்கள், புதிய அறிவிப்புகள் & நேரலை பதிவுகள்'
                      : 'Community business advertisements, official feeds & announcements'}
                  </p>
                </div>
              </div>

              {/* Feature 3: Youth Career & Scholarship */}
              <div className="p-3.5 rounded-2xl border border-[#e8e3d8] bg-[#fdfbf7] hover:border-[#c8a86b]/70 hover:bg-white transition-all flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-xl bg-[#faf6ed] text-[#8c6507] border border-[#e8dcbb] flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                  03
                </div>
                <div>
                  <p className="font-bold text-stone-900 group-hover:text-[#801524] transition-colors">
                    {language === 'ta' ? 'இளைஞர் வழிகாட்டல் & கல்வி உதவித்தொகை' : 'Youth Career & Scholarship'}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                    {language === 'ta'
                      ? 'வேலைவாய்ப்பு வழிகாட்டல், கல்வி உதவித்தொகை & தொழிற்பயிற்சி'
                      : 'Career mentoring, job opportunities & educational scholarship grants'}
                  </p>
                </div>
              </div>

              {/* Feature 4: Matrimonial Match Hub */}
              <div className="p-3.5 rounded-2xl border border-[#e8e3d8] bg-[#fdfbf7] hover:border-[#c8a86b]/70 hover:bg-white transition-all flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-xl bg-[#faf6ed] text-[#8c6507] border border-[#e8dcbb] flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                  04
                </div>
                <div>
                  <p className="font-bold text-stone-900 group-hover:text-[#801524] transition-colors">
                    {language === 'ta' ? 'திருமண தகவல் மையம் (Matrimonial)' : 'Matrimonial Match Hub'}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                    {language === 'ta' ? 'சரிபார்க்கப்பட்ட வரன் & ஜாதக விவரங்கள்' : 'Verified community bride & groom profiles'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. OFFICIAL HEADQUARTERS & CONTACT INFORMATION (REFINED INSTITUTIONAL SECRETARIAT) */}
      <div className="p-7 sm:p-10 rounded-3xl bg-white border border-[#e8e3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
        {/* Subtle top golden accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent opacity-80" />

        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#faf6ed] text-[#7e5b0b] text-xs font-semibold border border-[#e8dcbb] shadow-2xs">
            <Building2 className="w-4 h-4 text-[#b8860b]" />
            <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தலைமை அலுவலகம்' : 'Official Headquarters & Contact'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display">
            {language === 'ta' ? portalData.contact.hqTitleTa : portalData.contact.hqTitleEn}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
            {language === 'ta' ? portalData.contact.hqDescriptionTa : portalData.contact.hqDescriptionEn}
          </p>
        </div>

        {/* Headquarters Detailed Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#faf8f5] border border-[#e8e3d8]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white text-[#801524] flex items-center justify-center shrink-0 border border-[#e8e3d8] shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-900">
                  {language === 'ta' ? 'தலைமைச் செயலக முகவரி' : 'Secretariat Address'}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'ta' ? portalData.contact.addressTa : portalData.contact.addressEn}
                </p>
              </div>
            </div>

            {/* Phones */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white text-[#b8860b] flex items-center justify-center shrink-0 border border-[#e8e3d8] shadow-2xs">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-900">
                  {language === 'ta' ? 'உதவி எண்கள் (Helpline)' : 'Helpline & Office Phones'}
                </p>
                <p className="text-xs text-stone-800 font-mono font-semibold">
                  {portalData.contact.phones}
                </p>
              </div>
            </div>

            {/* Emails */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white text-stone-700 flex items-center justify-center shrink-0 border border-[#e8e3d8] shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-900">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'Official Email'}
                </p>
                <p className="text-xs text-stone-800 font-mono font-medium">
                  {portalData.contact.emails}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white text-stone-700 flex items-center justify-center shrink-0 border border-[#e8e3d8] shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-900">
                  {language === 'ta' ? 'பணி நேரம்' : 'Office Working Hours'}
                </p>
                <p className="text-xs text-stone-600">
                  {language === 'ta' ? portalData.contact.workingHoursTa : portalData.contact.workingHoursEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Details & Email Verification Modal */}
      {isReviewModalOpen && reviewData && (
        <RegistrationReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onEditDetails={() => setIsReviewModalOpen(false)}
          language={language}
          data={reviewData}
          onConfirmSuccess={handleFinalConfirmRegistration}
        />
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          language={language}
          initialIdentifier={loginPhone}
          onSuccessLogin={(user) => {
            setIsForgotPasswordOpen(false);
            onLoginSuccess(user);
          }}
        />
      )}
    </div>
  );
};
