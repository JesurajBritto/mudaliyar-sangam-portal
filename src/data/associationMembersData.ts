import { AssociationMember } from '../types';

export const OFFICIAL_POSITIONS = [
  { id: 'state_president', en: 'State President', ta: 'மாநிலத் தலைவர்' },
  { id: 'state_general_secretary', en: 'State General Secretary', ta: 'மாநிலப் பொதுச் செயலாளர்' },
  { id: 'state_treasurer', en: 'State Treasurer', ta: 'மாநிலப் பொருளாளர்' },
  { id: 'vice_president', en: 'Vice President', ta: 'துணைத் தலைவர்' },
  { id: 'joint_secretary', en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
  { id: 'youth_wing_president', en: 'Youth Wing President', ta: 'இளைஞர் அணி தலைவர்' },
  { id: 'youth_wing_secretary', en: 'Youth Wing Secretary', ta: 'இளைஞர் அணி செயலாளர்' },
  { id: 'womens_wing_president', en: "Women's Wing President", ta: 'மகளிர் அணி தலைவர்' },
  { id: 'womens_wing_secretary', en: "Women's Wing Secretary", ta: 'மகளிர் அணி செயலாளர்' },
  { id: 'organization_secretary', en: 'Organization Secretary', ta: 'அமைப்புச் செயலாளர்' },
  { id: 'fundraising_secretary', en: 'Fundraising Secretary', ta: 'நிதி திரட்டும் செயலாளர்' },
  { id: 'honorary_advisor', en: 'Honorary Advisor', ta: 'கௌரவ ஆலோசகர்' },
  { id: 'legal_advisor', en: 'Legal Advisor', ta: 'சட்ட ஆலோசகர்' },
  { id: 'zonal_secretary_west', en: 'Zonal Secretary West', ta: 'மண்டலச் செயலாளர் மேற்கு' },
  { id: 'zonal_secretary_south', en: 'Zonal Secretary South', ta: 'மண்டலச் செயலாளர் தெற்கு' },
  { id: 'zonal_secretary_east', en: 'Zonal Secretary East', ta: 'மண்டலச் செயலாளர் கிழக்கு' },
  { id: 'zonal_secretary_north', en: 'Zonal Secretary North', ta: 'மண்டலச் செயலாளர் வடக்கு' }
];

export const ASSOCIATION_TERMS = [
  { id: '2024-2026', labelEn: '2024 - 2026 Current Term', labelTa: '2024 - 2026 தற்போதைய நிர்வாகம்', isCurrent: true },
  { id: '2022-2024', labelEn: '2022 - 2024 Previous Term', labelTa: '2022 - 2024 முந்தைய நிர்வாகம்', isCurrent: false },
  { id: '2020-2022', labelEn: '2020 - 2022 Previous Term', labelTa: '2020 - 2022 முந்தைய நிர்வாகம்', isCurrent: false },
  { id: 'historic', labelEn: 'Founding Patrons 1951 - 2018', labelTa: 'நிறுவனத் தலைவர்கள் 1951 - 2018', isCurrent: false },
  { id: 'all', labelEn: 'All Tenures & Years', labelTa: 'அனைத்து ஆண்டுக் குழுக்கள்', isCurrent: false }
];

export const INITIAL_ASSOCIATION_MEMBERS: AssociationMember[] = [
  // 2024 - 2026: State Officers
  {
    id: 'assoc-001',
    name: 'Dr. M. Arumuga Mudaliyar, MS, MCh',
    nameTa: 'மருத்துவர் மா. ஆறுமுக முதலியார்',
    position: 'State President',
    positionTa: 'மாநிலத் தலைவர்',
    termYears: '2024 - 2026',
    wing: 'apex_council',
    nativePlace: 'Maduranthakam',
    nativeDistrict: 'Chengalpattu',
    phone: '+91 98401 11223',
    email: 'president@mudaliyarsangam.org',
    occupation: 'Senior Surgical Oncologist & Medical Trustee',
    membershipId: 'MUD-LIFE-001',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Spearheaded the Sangam ₹5 Crore Higher Education Endowment Fund',
      'Unified 28 regional taluk Sangams under one digital registry',
      'Inaugurated the 100-bed Free Community Medical Camp in Kanchipuram'
    ],
    achievementsTa: [
      '₹5 கோடி கல்வி அறக்கட்டளை நிதியை நிறுவி மாணவர்கள் உதவி',
      '28 வட்டார முதலியார் சங்கங்களை ஒருங்கிணைத்து டிஜிட்டல் தளம்',
      'காஞ்சிபுரத்தில் 100 படுக்கைகள் கொண்ட இலவச மருத்துவ முகாம்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-002',
    name: 'Thiru. K. S. Shanmugam Mudaliyar',
    nameTa: 'திரு. கே. எஸ். சண்முகம் முதலியார்',
    position: 'Vice President',
    positionTa: 'துணைத் தலைவர்',
    termYears: '2024 - 2026',
    wing: 'apex_council',
    nativePlace: 'Kanchipuram Silk Town',
    nativeDistrict: 'Kanchipuram',
    phone: '+91 94440 22334',
    email: 'vicepresident@mudaliyarsangam.org',
    occupation: 'Managing Director, Sri Shanmuga Silks & Weaving Mills',
    membershipId: 'MUD-LIFE-004',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Organized the Mega Handloom Heritage Expo 2024',
      'Donated ₹25 Lakhs for Kanchipuram Mudaliyar Marriage Hall solarization'
    ],
    achievementsTa: [
      'பாரம்பரிய கைத்தறி பட்டு மாபெரும் கண்காட்சி 2024',
      'சங்க திருமண மண்டபத்திற்கு ₹25 லட்சம் சூரிய மின்சக்தி கொடை'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-003',
    name: 'Advocate P. R. Deivasigamani Mudaliyar, BA, BL',
    nameTa: 'வழக்கறிஞர் பி. ஆர். தெய்வசிகாமணி முதலியார்',
    position: 'State General Secretary',
    positionTa: 'மாநிலப் பொதுச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'apex_council',
    nativePlace: 'Poonamallee',
    nativeDistrict: 'Tiruvallur',
    phone: '+91 98402 33445',
    email: 'gensecretary@mudaliyarsangam.org',
    occupation: 'Senior Advocate, Madras High Court',
    membershipId: 'MUD-LIFE-008',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Successfully defended Sangam trust lands and protected heritage sites',
      'Formulated the 2026 Digital Governance and Electoral Bye-laws'
    ],
    achievementsTa: [
      'சங்க நிலங்கள் மற்றும் பாரம்பரிய அறக்கட்டளை சொத்துக்களை மீட்டெடுத்தல்',
      '2026 டிஜிட்டல் தேர்தல் மற்றும் சட்ட விதிகளின் வரைவு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-004',
    name: 'CA V. Soundararajan Mudaliyar, FCA, DISA',
    nameTa: 'தணிக்கையாளர் வி. சௌந்தரராஜன் முதலியார்',
    position: 'State Treasurer',
    positionTa: 'மாநிலப் பொருளாளர்',
    termYears: '2024 - 2026',
    wing: 'apex_council',
    nativePlace: 'Vellore Fort Area',
    nativeDistrict: 'Vellore',
    phone: '+91 98403 44556',
    email: 'treasurer@mudaliyarsangam.org',
    occupation: 'Senior Partner, Soundararajan & Associates, Chartered Accountants',
    membershipId: 'MUD-LIFE-015',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Implemented 100% itemized digital Credit/Debit accounting with 80G receipts',
      'Secured zero-audit qualification for the Sangam across 3 financial years'
    ],
    achievementsTa: [
      '100% டிஜிட்டல் வரவு-செலவு கணக்கு மற்றும் 80G ரசீது நடைமுறை',
      'தொடர்ச்சியாக 3 ஆண்டுகள் தணிக்கை பிழையற்ற தூய கணக்கு சமர்ப்பிப்பு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-005',
    name: 'Prof. Tmt. Mangayarkarasi Mudaliyar, PhD',
    nameTa: 'பேராசிரியர் மங்கையர்க்கரசி முதலியார்',
    position: 'Joint Secretary',
    positionTa: 'இணைச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'apex_council',
    nativePlace: 'Ranipet',
    nativeDistrict: 'Ranipet',
    phone: '+91 94441 55667',
    email: 'jointsec@mudaliyarsangam.org',
    occupation: 'Principal (Retd.), Govt. Arts College',
    membershipId: 'MUD-LIFE-022',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Launched Sangam Women Self-Help Entrepreneurship Circle',
      'Administered 450 higher education girl student scholarships'
    ],
    achievementsTa: [
      'மகளிர் சுய உதவி மற்றும் சிறுதொழில் கூட்டமைப்பு துவக்கம்',
      '450 மாணவியர்களுக்கு உயர்கல்வி உதவித்தொகை வழங்கி ஊக்குவிப்பு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-006',
    name: 'Er. S. Karthikeyan Mudaliyar, BTech, MS',
    nameTa: 'பொறியாளர் எஸ். கார்த்திகேயன் முதலியார்',
    position: 'Youth Wing President',
    positionTa: 'இளைஞர் அணி தலைவர்',
    termYears: '2024 - 2026',
    wing: 'youth_wing',
    nativePlace: 'Coimbatore RS Puram',
    nativeDistrict: 'Coimbatore',
    phone: '+91 99401 66778',
    email: 'youth@mudaliyarsangam.org',
    occupation: 'Founder & CEO, Apex Cloud Tech Solutions',
    membershipId: 'MUD-YOUTH-001',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Created the Mudaliyar Tech & Entrepreneur Mentorship Network',
      'Organized 12 youth career guidance workshops across Tamil Nadu colleges'
    ],
    achievementsTa: [
      'இளையோர் தொழில் முனைவோர் மற்றும் மென்பொருள் வழிகாட்டுதல் வலைப்பின்னல்',
      'தமிழ்நாடு முழுவதும் 12 கல்லூரி வேலைவாய்ப்பு பயிற்சி முகாம்கள்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-006b',
    name: 'Thiru. T. Vignesh Kumar Mudaliyar',
    nameTa: 'திரு. டி. விக்னேஷ் குமார் முதலியார்',
    position: 'Youth Wing Secretary',
    positionTa: 'இளைஞர் அணி செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'youth_wing',
    nativePlace: 'Salem',
    nativeDistrict: 'Salem',
    phone: '+91 97890 12345',
    email: 'youthsec@mudaliyarsangam.org',
    occupation: 'Fintech Product Lead & Startup Founder',
    membershipId: 'MUD-YOUTH-002',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Organized State-level Youth Sports Meet & Cricket Tournament',
      'Recruited 2,500 active youth volunteers across 15 districts'
    ],
    achievementsTa: [
      'மாநில அளவிலான இளைஞர் விளையாட்டு மற்றும் கிரிக்கெட் போட்டி',
      '15 மாவட்டங்களில் 2,500 இளம் தொண்டர்கள் சேர்க்கை'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-007',
    name: 'Dr. Nalini Sivasankaran, MBBS, DGO',
    nameTa: 'மருத்துவர் நளினி சிவசங்கரன்',
    position: "Women's Wing President",
    positionTa: 'மகளிர் அணி தலைவர்',
    termYears: '2024 - 2026',
    wing: 'womens_wing',
    nativePlace: 'Mylapore',
    nativeDistrict: 'Chennai',
    phone: '+91 98405 77889',
    email: 'women@mudaliyarsangam.org',
    occupation: 'Senior Consultant Obstetrician & Women Health Activist',
    membershipId: 'MUD-LIFE-031',
    photoUrl: 'https://images.unsplash.com/photo-1594824813589-3221b2d7f8d6?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Conducted free cancer screening for 3,200 women across rural districts',
      'Set up the Matrimonial Verification & Counselling Cell'
    ],
    achievementsTa: [
      'கிராமப்புறங்களில் 3,200 பெண்களுக்கு இலவச மருத்துவ பரிசோதனை',
      'திருமண தகவல் மைய சரிபார்ப்பு மற்றும் குடும்ப ஆலோசனை அரங்கம்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-007b',
    name: 'Tmt. Radhika Jayaveerapandian, MA, MEd',
    nameTa: 'திருமதி. ராதிகா ஜெயவீரபாண்டியன்',
    position: "Women's Wing Secretary",
    positionTa: 'மகளிர் அணி செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'womens_wing',
    nativePlace: 'Madurai',
    nativeDistrict: 'Madurai',
    phone: '+91 94433 88990',
    email: 'womensec@mudaliyarsangam.org',
    occupation: 'Educational Institution Trustee & Social Worker',
    membershipId: 'MUD-LIFE-042',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Coordinated skill training for 600 handloom artisan families',
      'Established Women Legal Aid and Family Guidance desk'
    ],
    achievementsTa: [
      '600 நெசவாளர் குடும்ப பெண்களுக்கு திறன் மேம்பாட்டு பயிற்சி',
      'மகளிர் சட்ட உதவி மற்றும் குடும்ப நல்வாழ்வு மையம் அமைப்பு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-008a',
    name: 'Thiru. C. N. Gopinatha Mudaliyar',
    nameTa: 'திரு. சி. என். கோபிநாத முதலியார்',
    position: 'Organization Secretary',
    positionTa: 'அமைப்புச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'executive_committee',
    nativePlace: 'Erode',
    nativeDistrict: 'Erode',
    phone: '+91 98422 33445',
    email: 'orgsec@mudaliyarsangam.org',
    occupation: 'Industrialist & Cold Storage Solutions',
    membershipId: 'MUD-LIFE-050',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Organized 40 district general body meetings with record turnout',
      'Supervised the compilation of the digital Membership Census'
    ],
    achievementsTa: [
      '40 மாவட்ட பொதுக்குழு கூட்டங்களை வெற்றிகரமாக ஒருங்கிணைப்பு',
      'டிஜிட்டல் உறுப்பினர் கணக்கெடுப்பு பணிகளை மேற்பார்வையிட்டார்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-008b',
    name: 'Thiru. R. Venkatesh Mudaliyar, BCom',
    nameTa: 'திரு. ஆர். வெங்கடேஷ் முதலியார்',
    position: 'Fundraising Secretary',
    positionTa: 'நிதி திரட்டும் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'executive_committee',
    nativePlace: 'Tirupur',
    nativeDistrict: 'Tirupur',
    phone: '+91 98430 44556',
    email: 'fundraising@mudaliyarsangam.org',
    occupation: 'Knitwear Exporter & Sangam Life Patron',
    membershipId: 'MUD-PATRON-05',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Mobilized ₹1.8 Crores for Educational Corpus & Disaster Relief',
      'Enrolled 120 new Life Patron donors across international chapters'
    ],
    achievementsTa: [
      'கல்வி நிதி மற்றும் பேரிடர் நிவாரணத்திற்காக ₹1.8 கோடி நிதி திரட்டினார்',
      'சர்வதேச அளவில் 120 புதிய புரவலர் கொடையாளர்களை இணைத்தார்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-010',
    name: 'Justice (Retd.) K. Govindarajan Mudaliyar',
    nameTa: 'நீதிபதி கே. கோவிந்தராஜன் முதலியார்',
    position: 'Honorary Advisor',
    positionTa: 'கௌரவ ஆலோசகர்',
    termYears: '2024 - 2026',
    wing: 'advisory_board',
    nativePlace: 'Tiruvannamalai',
    nativeDistrict: 'Tiruvannamalai',
    phone: '+91 98400 12345',
    email: 'advisory@mudaliyarsangam.org',
    occupation: 'Former Judge, High Court of Judicature at Madras',
    membershipId: 'MUD-PATRON-01',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Authored the Supreme Court approved Mudaliyar Sangam Public Trust Deed',
      'Arbitrated inter-community disputes with zero litigation'
    ],
    achievementsTa: [
      'உச்ச நீதிமன்றம் அங்கீகரித்த பொது அறக்கட்டளை ஆவணம் வரைவு',
      'சமூக நல வழக்குகளை இணக்கமாக தீர்த்து வைத்தல்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-010b',
    name: 'Senior Counsel M. Balasubramanian Mudaliyar, BA, ML',
    nameTa: 'மூத்த வழக்கறிஞர் எம். பாலசுப்பிரமணியன் முதலியார்',
    position: 'Legal Advisor',
    positionTa: 'சட்ட ஆலோசகர்',
    termYears: '2024 - 2026',
    wing: 'advisory_board',
    nativePlace: 'Tirunelveli',
    nativeDistrict: 'Tirunelveli',
    phone: '+91 94440 98765',
    email: 'legal@mudaliyarsangam.org',
    occupation: 'Senior Advocate & Constitutional Law Consultant',
    membershipId: 'MUD-LIFE-009',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Provided statutory legal compliance for all Sangam properties and 80G renewals',
      'Formulated free legal consultation desk for underprivileged members'
    ],
    achievementsTa: [
      'அனைத்து சங்க சொத்துக்களுக்கும் சட்ட பாதுகாப்பு & 80G வரி விலக்கு புதுப்பித்தல்',
      'ஏழை உறுப்பினர்களுக்கு இலவச சட்ட ஆலோசனை அரங்கம்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-011w',
    name: 'Thiru. K. R. Selvakumar Mudaliyar',
    nameTa: 'திரு. கே. ஆர். செல்வகுமார் முதலியார்',
    position: 'Zonal Secretary West',
    positionTa: 'மேற்கு மண்டலச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'district_convenor',
    nativePlace: 'Coimbatore',
    nativeDistrict: 'Coimbatore',
    phone: '+91 94431 22334',
    email: 'westzone@mudaliyarsangam.org',
    occupation: 'Textile Machinery Manufacturer & Exporter',
    membershipId: 'MUD-ZONE-W1',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Coordinated Western zone: Coimbatore, Tirupur, Erode, Nilgiris & Salem chapters',
      'Inaugurated the Kongu Mudaliyar Skill & Job Assistance Center'
    ],
    achievementsTa: [
      'கோவை, திருப்பூர், ஈரோடு, நீலகிரி மற்றும் சேலம் மாவட்ட ஒருங்கிணைப்பு',
      'கொங்கு மண்டல திறன் மேம்பாடு மற்றும் வேலைவாய்ப்பு மையம் துவக்கம்'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-011s',
    name: 'Thiru. S. Ramanathan Mudaliyar',
    nameTa: 'திரு. எஸ். ராமநாதன் முதலியார்',
    position: 'Zonal Secretary South',
    positionTa: 'தெற்கு மண்டலச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'district_convenor',
    nativePlace: 'Madurai',
    nativeDistrict: 'Madurai',
    phone: '+91 98421 55667',
    email: 'southzone@mudaliyarsangam.org',
    occupation: 'Automobile Dealership & Educational Trustee',
    membershipId: 'MUD-ZONE-S1',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Coordinated Southern zone: Madurai, Dindigul, Tirunelveli, Tuticorin & Kanyakumari',
      'Organized South Tamil Nadu Mudaliyar Sangam Conclave 2025'
    ],
    achievementsTa: [
      'மதுரை, திண்டுக்கல், நெல்லை, தூத்துக்குடி மற்றும் குமரி மாவட்ட ஒருங்கிணைப்பு',
      'தென் தமிழக முதலியார் சங்க மாநாடு 2025 ஒருங்கிணைப்பு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-011e',
    name: 'Thiru. V. Thangavel Mudaliyar',
    nameTa: 'திரு. வி. தங்கவேல் முதலியார்',
    position: 'Zonal Secretary East',
    positionTa: 'கிழக்கு மண்டலச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'district_convenor',
    nativePlace: 'Cuddalore',
    nativeDistrict: 'Cuddalore',
    phone: '+91 94432 77889',
    email: 'eastzone@mudaliyarsangam.org',
    occupation: 'Cashew Processing & Agro Exports',
    membershipId: 'MUD-ZONE-E1',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Coordinated Eastern zone: Cuddalore, Villupuram, Thanjavur, Nagapattinam & Tiruvarur',
      'Established flood relief emergency response team for coastal villages'
    ],
    achievementsTa: [
      'கடலூர், விழுப்புரம், தஞ்சை, நாகை மற்றும் திருவாரூர் மாவட்ட ஒருங்கிணைப்பு',
      'கடலோர கிராமங்களுக்கான பேரிடர் வெள்ள நிவாரண குழு அமைப்பு'
    ],
    isCurrentOfficeBearer: true
  },
  {
    id: 'assoc-011n',
    name: 'Thiru. T. V. Chandrasekara Mudaliyar',
    nameTa: 'திரு. டி. வி. சந்திரசேகர முதலியார்',
    position: 'Zonal Secretary North',
    positionTa: 'வடக்கு மண்டலச் செயலாளர்',
    termYears: '2024 - 2026',
    wing: 'district_convenor',
    nativePlace: 'T. Nagar',
    nativeDistrict: 'Chennai',
    phone: '+91 98410 88990',
    email: 'northzone@mudaliyarsangam.org',
    occupation: 'Real Estate Developer & Logistics Transport',
    membershipId: 'MUD-ZONE-N1',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Coordinated Northern zone: Chennai, Tiruvallur, Kanchipuram, Chengalpattu, Vellore & Ranipet',
      'Enrolled 3,200 new registered families and modernized member services'
    ],
    achievementsTa: [
      'சென்னை, திருவள்ளூர், காஞ்சி, செங்கை, வேலூர் மற்றும் ராணிப்பேட்டை மண்டல ஒருங்கிணைப்பு',
      '3,200 புதிய குடும்பங்களை சங்கத்தில் இணைத்து சேவைகளை டிஜிட்டல் மயமாக்கினார்'
    ],
    isCurrentOfficeBearer: true
  },

  // 2022 - 2024 Term
  {
    id: 'assoc-021',
    name: 'Thiru. N. Loganatha Mudaliyar',
    nameTa: 'திரு. என். லோகநாத முதலியார்',
    position: 'State President',
    positionTa: 'மாநிலத் தலைவர்',
    termYears: '2022 - 2024',
    wing: 'apex_council',
    nativePlace: 'Tiruchirappalli Srirangam',
    nativeDistrict: 'Tiruchirappalli',
    phone: '+91 94443 11224',
    email: 'pastpresident@mudaliyarsangam.org',
    occupation: 'Industrialist & Rice Mill Owner',
    membershipId: 'MUD-LIFE-002',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Constructed the Mudaliyar Sangam Diamond Jubilee Hall in Trichy',
      'Established the ₹1 Crore Senior Citizen Medical Care Corpus'
    ],
    achievementsTa: [
      'திருச்சியில் வைர விழா திருமண மண்டபம் கட்டி அர்ப்பணிப்பு',
      'முதியோர் மருத்துவ உதவிக்காக ₹1 கோடி நிரந்தர வைப்பு நிதி'
    ],
    isCurrentOfficeBearer: false
  },
  {
    id: 'assoc-022',
    name: 'Thiru. M. Sivasankaran Mudaliyar',
    nameTa: 'திரு. எம். சிவசங்கரன் முதலியார்',
    position: 'State General Secretary',
    positionTa: 'மாநிலப் பொதுச் செயலாளர்',
    termYears: '2022 - 2024',
    wing: 'apex_council',
    nativePlace: 'Kanchipuram',
    nativeDistrict: 'Kanchipuram',
    phone: '+91 98402 88776',
    email: 'sec2022@mudaliyarsangam.org',
    occupation: 'Handloom Silk Manufacturer',
    membershipId: 'MUD-LIFE-003',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Organized State-wide Handloom Weavers Subsidy Assistance',
      'Conducted 74th Jubilee Platinum Celebrations'
    ],
    achievementsTa: [
      'மாநில அளவிலான கைத்தறி நெசவாளர் மானிய உதவி ஒருங்கிணைப்பு',
      '74-வது பிளாட்டினம் ஜூபிலி விழா சிறப்பு ஏற்பாடுகள்'
    ],
    isCurrentOfficeBearer: false
  },

  // 2020 - 2022 Term
  {
    id: 'assoc-031',
    name: 'Thiru. A. K. Sundaravel Mudaliyar',
    nameTa: 'திரு. ஏ. கே. சுந்தரவேல் முதலியார்',
    position: 'State President',
    positionTa: 'மாநிலத் தலைவர்',
    termYears: '2020 - 2022',
    wing: 'apex_council',
    nativePlace: 'Tiruvallur',
    nativeDistrict: 'Tiruvallur',
    phone: '+91 94441 99887',
    email: 'president2020@mudaliyarsangam.org',
    occupation: 'Agricultural Exporter & Philanthropist',
    membershipId: 'MUD-LIFE-005',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Disbursed ₹75 Lakhs emergency ration & healthcare kits during lockdown',
      'Initiated the online Sangam member registration drive'
    ],
    achievementsTa: [
      'கொரோனா காலத்தில் ₹75 லட்சம் மதிப்புள்ள நிவாரண உதவிகள் வழங்கி சாதனை',
      'இணையவழி உறுப்பினர் பதிவு திட்டத்தை முதன்முதலில் துவக்கினார்'
    ],
    isCurrentOfficeBearer: false
  },

  // Historic Founding Patrons (1951 - 2018)
  {
    id: 'assoc-041',
    name: 'Rao Bahadur C. Shanmuga Mudaliyar (1895 - 1974)',
    nameTa: 'ராவ் பகதூர் சி. சண்முக முதலியார்',
    position: 'State President',
    positionTa: 'நிறுவன மாநிலத் தலைவர்',
    termYears: 'historic',
    wing: 'apex_council',
    nativePlace: 'Kanchipuram Heritage Town',
    nativeDistrict: 'Kanchipuram',
    phone: 'Historical Archive',
    email: 'archive@mudaliyarsangam.org',
    occupation: 'Philanthropist, Industrialist & Freedom Supporter',
    membershipId: 'MUD-FOUNDER-001',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    achievements: [
      'Officially registered the Mudaliyar Sangam Trust under Societies Act in 1951',
      'Donated the prime 2-acre land in Kanchipuram for Sangam headquarters'
    ],
    achievementsTa: [
      '1951-ல் முதலியார் சங்கத்தை பதிவு செய்து சமூக ஒற்றுமைக்கு வித்திட்டவர்',
      'காஞ்சிபுரத்தில் தலைமைச் செயலகத்திற்கு 2 ஏக்கர் நிலத்தை தானமாக வழங்கியவர்'
    ],
    isCurrentOfficeBearer: false
  }
];

