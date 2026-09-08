import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Smartphone,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  IdCard,
  KeyRound,
  Copy,
  Check,
  Home,
  Lock
} from 'lucide-react';
import { AuthUser, Language, AddressPrivacyLevel } from '../types';
import { DEMO_ACCOUNTS, registerNewMember, saveCurrentUser } from '../data/authData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialMode?: 'login' | 'register' | 'mobile';
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  initialMode = 'login',
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'mobile'>(initialMode);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regFullNameTa, setRegFullNameTa] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAge, setRegAge] = useState<number | string>('');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');

  // Address fields (Required)
  const [regDoorNumber, setRegDoorNumber] = useState('');
  const [regStreetName, setRegStreetName] = useState('');
  const [regAreaLocality, setRegAreaLocality] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regDistrict, setRegDistrict] = useState('Chennai');
  const [regPincode, setRegPincode] = useState('');
  const [regState, setRegState] = useState('Tamil Nadu');

  // Sangam & Professional fields
  const [regBranch, setRegBranch] = useState('Chennai Central Branch');
  const [regOccupation, setRegOccupation] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regPrivacyLevel, setRegPrivacyLevel] = useState<AddressPrivacyLevel>('public_to_members');
  const [regSuccessUser, setRegSuccessUser] = useState<AuthUser | null>(null);

  if (!isOpen) return null;

  const currentWebUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentWebUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleQuickDemoLogin = (account: AuthUser) => {
    saveCurrentUser(account);
    onLoginSuccess(account);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      setLoginError(language === 'ta' ? 'மொபைல் எண் அல்லது உறுப்பினர் எண்ணை உள்ளிடவும்' : 'Please enter Phone or Member ID');
      return;
    }

    const existing = DEMO_ACCOUNTS.find(
      (a) => a.phone === loginPhone.trim() || a.membershipCode.toLowerCase() === loginPhone.trim().toLowerCase()
    );

    if (existing) {
      saveCurrentUser(existing);
      onLoginSuccess(existing);
      onClose();
    } else {
      const genericMember: AuthUser = {
        id: `user-${Date.now()}`,
        fullName: 'Member User',
        fullNameTa: 'சங்க உறுப்பினர்',
        phone: loginPhone.trim(),
        email: 'member@mudaliyarsangam.org',
        membershipCode: `MS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'member',
        branch: 'District Branch',
        district: 'Tamil Nadu',
        city: 'Chennai',
        isVerified: true
      };
      saveCurrentUser(genericMember);
      onLoginSuccess(genericMember);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim()) {
      alert(language === 'ta' ? 'பெயர் மற்றும் மொபைல் எண் அவசியம்' : 'Name and Mobile Number are required');
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

    const newUser = registerNewMember({
      fullName: regFullName,
      fullNameTa: regFullNameTa || regFullName,
      phone: regPhone,
      email: regEmail,
      age: regAge ? Number(regAge) : 35,
      gender: regGender,
      doorNumber: regDoorNumber,
      streetName: regStreetName,
      areaLocality: regAreaLocality || regCity,
      city: regCity,
      district: regDistrict,
      state: regState,
      pincode: regPincode,
      branch: regBranch || `${regDistrict} Branch`,
      occupation: regOccupation || 'Community Member',
      bloodGroup: regBloodGroup,
      privacyLevel: regPrivacyLevel
    });

    setRegSuccessUser(newUser);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center">
              <IdCard className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'ta' ? 'முதலியார் சங்கம் உறுப்பினர் & நிர்வாகி லாகின்' : 'Mudaliyar Sangam Member & Admin Portal'}
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                {language === 'ta' ? 'அனைத்து விவரங்களையும் காண பதிவு செய்யவும் / உள்நுழையவும்' : 'Sign in or register with address details for full access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pill Selector */}
        <div className="flex p-2 bg-stone-100 border-b border-stone-200 shrink-0">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'உள்நுழைவு' : 'Sign In'}</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'புதிய பதிவு' : 'New Registration'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'mobile'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மொபைல் (QR)' : 'Mobile Access'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Demo Account Pills */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {language === 'ta' ? '1-கிளிக் உடனடி டெமோ உள்நுழைவு' : '1-Click Instant Demo Login'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(DEMO_ACCOUNTS[0])}
                    className="p-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-left text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-900 block">👑 Super Admin</span>
                    <span className="text-[10px] text-amber-800">State President</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(DEMO_ACCOUNTS[1])}
                    className="p-2.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-left text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-blue-900 block">🛡️ Branch Admin</span>
                    <span className="text-[10px] text-blue-800">District Secretary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(DEMO_ACCOUNTS[2])}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-emerald-900 block">👤 Sangam Member</span>
                    <span className="text-[10px] text-emerald-800">Cardiologist</span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'மொபைல் எண் அல்லது உறுப்பினர் எண்' : 'Mobile Number or Member Code'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="9840012345 / MS-ADM-001"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'கடவுச்சொல் / OTP' : 'Password / OTP'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <div>
              {regSuccessUser ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">
                    {language === 'ta' ? 'பதிவு & முகவரி சேமிப்பு வெற்றிகரமாக முடிந்தது!' : 'Registration & Address Book Entry Successful!'}
                  </h3>
                  <div className="inline-block px-4 py-2 bg-emerald-700 text-white font-bold text-sm rounded-xl font-mono">
                    {regSuccessUser.membershipCode}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Section 1: Personal */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center">
                        1
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        {language === 'ta' ? 'தனிநபர் விவரங்கள்' : 'Personal Details'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'முழு பெயர் (ஆங்கிலம்) *' : 'Full Name (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. S. Murugesan Mudaliyar"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'பெயர் (தமிழ்)' : 'Name in Tamil'}
                        </label>
                        <input
                          type="text"
                          value={regFullNameTa}
                          onChange={(e) => setRegFullNameTa(e.target.value)}
                          placeholder="எ.கா. சு. முருகேசன் முதலியார்"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'மொபைல் எண் *' : 'Mobile Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@gmail.com"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            {language === 'ta' ? 'வயது' : 'Age'}
                          </label>
                          <input
                            type="number"
                            value={regAge}
                            onChange={(e) => setRegAge(e.target.value)}
                            placeholder="35"
                            className="w-full px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            {language === 'ta' ? 'பாலினம்' : 'Gender'}
                          </label>
                          <select
                            value={regGender}
                            onChange={(e) => setRegGender(e.target.value as any)}
                            className="w-full px-1.5 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Residential Address (Required for Address Book) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center">
                        2
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'ta' ? 'குடியிருப்பு முகவரி (முகவரி புத்தகம்)' : 'Residential Address (Required)'}</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'கதவு எண் *' : 'Door / Flat No. *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regDoorNumber}
                          onChange={(e) => setRegDoorNumber(e.target.value)}
                          placeholder="48/B"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'தெரு பெயர் *' : 'Street Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regStreetName}
                          onChange={(e) => setRegStreetName(e.target.value)}
                          placeholder="Gandhi Road, Near Temple"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'நகரம் / ஊர் *' : 'City / Town *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          placeholder="Kanchipuram"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'மாவட்டம் *' : 'District *'}
                        </label>
                        <select
                          value={regDistrict}
                          onChange={(e) => {
                            setRegDistrict(e.target.value);
                            setRegBranch(`${e.target.value} Central Branch`);
                          }}
                          className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                        >
                          {tamilNaduDistricts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'அஞ்சல் குறியீடு *' : 'Pincode (6 digits) *'}
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={regPincode}
                          onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="631501"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Sangam & Community */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center">
                        3
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        {language === 'ta' ? 'சங்க கிளை & தொழில்' : 'Sangam Branch & Profession'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'தொழில் / பணி' : 'Occupation'}
                        </label>
                        <input
                          type="text"
                          value={regOccupation}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder="Software / Merchant"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'இரத்த வகை' : 'Blood Group'}
                        </label>
                        <select
                          value={regBloodGroup}
                          onChange={(e) => setRegBloodGroup(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
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
                          {language === 'ta' ? 'தனியுரிமை' : 'Privacy'}
                        </label>
                        <select
                          value={regPrivacyLevel}
                          onChange={(e) => setRegPrivacyLevel(e.target.value as AddressPrivacyLevel)}
                          className="w-full px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                        >
                          <option value="public_to_members">Public to Members</option>
                          <option value="request_only">Request-Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{language === 'ta' ? 'பதிவு செய்து முகவரி புத்தகத்தில் சேமிக்க' : 'Register & Save to Address Book'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: MOBILE ACCESS */}
          {activeTab === 'mobile' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-stone-200 shrink-0 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-stone-900" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-stone-900">
                    {language === 'ta' ? 'மொபைலில் திறக்க QR ஸ்கேன் செய்க' : 'Scan to Open on Mobile Device'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {language === 'ta'
                      ? 'உங்கள் மொபைல் கேமராவால் ஸ்கேன் செய்து இணையதளத்தை திறக்கவும்.'
                      : 'Scan with your smartphone camera to access on Android or iOS.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentWebUrl}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
