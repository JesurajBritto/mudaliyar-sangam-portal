export interface PortalTicker {
  isVisible: boolean;
  badgeEn: string;
  badgeTa: string;
  tagEn: string;
  tagTa: string;
  textEn: string;
  textTa: string;
  linkTextEn: string;
  linkTextTa: string;
}

export interface PortalStats {
  registeredFamilies: string;
  registeredFamiliesLabelEn: string;
  registeredFamiliesLabelTa: string;
  districtBranches: string;
  districtBranchesLabelEn: string;
  districtBranchesLabelTa: string;
  scholarshipsAmount: string;
  scholarshipsLabelEn: string;
  scholarshipsLabelTa: string;
  matrimonialAlliances: string;
  matrimonialLabelEn: string;
  matrimonialLabelTa: string;
}

export interface PortalHero {
  regBadgeEn: string;
  regBadgeTa: string;
  titleEn: string;
  titleTa: string;
  taglineEn: string;
  taglineTa: string;
  introEn: string;
  introTa: string;
}

export interface LeadershipDesk {
  id: 'president' | 'secretary';
  badgeEn: string;
  badgeTa: string;
  officerNameEn: string;
  officerNameTa: string;
  designationEn: string;
  designationTa: string;
  initials: string;
  locationEn: string;
  locationTa: string;
  quoteEn: string;
  quoteTa: string;
  themeFocusEn: string;
  themeFocusTa: string;
}

export interface MissionPillar {
  id: string;
  pillarNumber: number;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  iconType: 'graduation' | 'heart' | 'briefcase' | 'medical' | 'tree' | 'building';
  colorTheme: 'amber' | 'rose' | 'blue' | 'emerald' | 'purple';
}

export interface PortalAnnouncement {
  id: string;
  circularNo: string;
  titleEn: string;
  titleTa: string;
  category: 'general' | 'education' | 'event' | 'matrimony';
  date: string;
  isUrgent?: boolean;
  venue?: string;
  summaryEn: string;
  summaryTa: string;
  detailsEn: string;
  detailsTa: string;
}

export interface PortalEvent {
  id: string;
  titleEn: string;
  titleTa: string;
  date: string;
  time: string;
  locationEn: string;
  locationTa: string;
  categoryEn: string;
  categoryTa: string;
  descriptionEn: string;
  descriptionTa: string;
}

export interface PortalContactInfo {
  hqTitleEn: string;
  hqTitleTa: string;
  hqDescriptionEn: string;
  hqDescriptionTa: string;
  addressEn: string;
  addressTa: string;
  phones: string;
  emails: string;
  workingHoursEn: string;
  workingHoursTa: string;
}

export interface DistrictBranchItem {
  id: string;
  districtEn: string;
  districtTa: string;
  branchNameEn: string;
  branchNameTa: string;
  presidentName: string;
  phone: string;
  address: string;
}

export interface PortalBranding {
  logoUrl?: string;
  logoIconPreset: 'gopuram' | 'lion' | 'lotus' | 'lamp' | 'peacock' | 'palmleaf';
  monogram: string;
  sangamNameEn: string;
  sangamNameTa: string;
  subTitleEn: string;
  subTitleTa: string;
  regNumberEn: string;
  regNumberTa: string;
  establishedYear: string;
  primaryColorTheme: 'royal_gold' | 'saffron_amber' | 'temple_maroon' | 'vedic_emerald';
}

export interface CompletePortalData {
  branding: PortalBranding;
  ticker: PortalTicker;
  hero: PortalHero;
  stats: PortalStats;
  leadership: LeadershipDesk[];
  pillars: MissionPillar[];
  announcements: PortalAnnouncement[];
  events: PortalEvent[];
  contact: PortalContactInfo;
  branches: DistrictBranchItem[];
}

export const INITIAL_PORTAL_DATA: CompletePortalData = {
  branding: {
    logoUrl: '',
    logoIconPreset: 'gopuram',
    monogram: 'MS',
    sangamNameEn: 'Tamil Nadu Mudaliyar Sangam',
    sangamNameTa: 'தமிழ்நாடு முதலியார் சங்கம்',
    subTitleEn: 'Statewide Association Management, Census Directory & Member Ecosystem',
    subTitleTa: 'மாநில அளவிலான சங்கம், முகவரி புத்தகம் & உறுப்பினர் கட்டமைப்பு',
    regNumberEn: 'Reg. No: 124/1988 (Govt. of Tamil Nadu)',
    regNumberTa: 'பதிவு எண்: 124/1988 (தமிழ்நாடு அரசு பதிவு)',
    establishedYear: '1988',
    primaryColorTheme: 'royal_gold'
  },
  ticker: {
    isVisible: true,
    badgeEn: 'Live Announcement',
    badgeTa: 'முக்கிய அறிவிப்பு',
    tagEn: '[38th AGM & State Conference]',
    tagTa: '[38-வது பொதுக்குழு & மாநில மாநாடு]',
    textEn: 'Scheduled on Oct 18, 2026 at Chennai. Higher Education Scholarship applications now active.',
    textTa: '18 அக்டோபர் 2026 அன்று சென்னையில் நடைபெறுகிறது. உயர்கல்வி உதவித்தொகை விண்ணப்பங்கள் வரவேற்கப்படுகின்றன.',
    linkTextEn: 'View Circular',
    linkTextTa: 'அறிவிப்பைப் பார்க்க'
  },
  hero: {
    regBadgeEn: 'Govt. Registered Community Association • Reg. No: 124/1988',
    regBadgeTa: 'அரசு பதிவு பெற்ற சங்கம் • பதிவு எண்: 124/1988',
    titleEn: 'Tamil Nadu Mudaliyar Sangam Digital Portal',
    titleTa: 'தமிழ்நாடு முதலியார் சங்கம் அதிகாரப்பூர்வ தளம்',
    taglineEn: 'Preserving Heritage • Empowering Youth • Uniting Families • Supporting Community Progress',
    taglineTa: 'பாரம்பரிய பாதுகாப்பு • இளைஞர் முன்னேற்றம் • குடும்பங்கள் இணைப்பு • சமுதாய ஒற்றுமை',
    introEn: 'Welcome to the official central portal connecting Mudaliyar community families, registered branches, education welfare trusts, and matrimonial networks across Tamil Nadu and globally.',
    introTa: 'தமிழ்நாடு மற்றும் உலகெங்கும் வாழும் முதலியார் சமுதாயக் குடும்பங்களை ஒருங்கிணைத்து, கல்வி உதவி, வேலைவாய்ப்பு, திருமண தகவல் மையம் மற்றும் முகவரி புத்தகத்தை எளிதாகப் பயன்படுத்த உருவாக்கப்பட்ட அதிகாரப்பூர்வ இணையதளம்.'
  },
  stats: {
    registeredFamilies: '1,280+',
    registeredFamiliesLabelEn: 'Registered Families',
    registeredFamiliesLabelTa: 'பதிவு பெற்ற குடும்பங்கள்',
    districtBranches: '48',
    districtBranchesLabelEn: 'District Branches',
    districtBranchesLabelTa: 'மாவட்ட & நகரக் கிளைகள்',
    scholarshipsAmount: '₹38.5 L',
    scholarshipsLabelEn: 'Scholarships Given',
    scholarshipsLabelTa: 'கல்வி & நலத்திட்ட உதவி',
    matrimonialAlliances: '420+',
    matrimonialLabelEn: 'Matrimonial Alliances',
    matrimonialLabelTa: 'நிறைவேறிய திருமணங்கள்'
  },
  leadership: [
    {
      id: 'president',
      badgeEn: 'President Desk',
      badgeTa: 'தலைவர் வாழ்த்துரை',
      officerNameEn: 'Thiru. K. Muthukumarasamy Mudaliyar',
      officerNameTa: 'திரு. K. முத்துக்குமாரசாமி முதலியார்',
      designationEn: 'State President, Tamil Nadu Mudaliyar Sangam',
      designationTa: 'மாநிலத் தலைவர், தமிழ்நாடு முதலியார் சங்கம்',
      initials: 'KM',
      locationEn: 'Chennai Headquarters',
      locationTa: 'சென்னை தலைமையகம்',
      quoteEn: '"Our mission has always been to build a self-reliant, educated, and mutually supportive community. Through this digital platform, we bring every family closer, ensuring that no deserving student drops out of college and every member enjoys dignified welfare support."',
      quoteTa: '"நமது சங்கத்தின் தலையாய நோக்கம் கல்வி வளர்ச்சி, பரஸ்பர உதவி மற்றும் இளைஞர் மேம்பாடாகும். இந்த நவீன டிஜிட்டல் தளம் மூலம் நமது சமுதாயத்தின் ஒவ்வொரு குடும்பமும் நேரடியாக இணைந்து பயனடைவதே நமது சங்கத்தின் பெருமை."',
      themeFocusEn: 'Empowering our next generation',
      themeFocusTa: 'அடுத்த தலைமுறைக்கான கல்வி & வழிகாட்டல்'
    },
    {
      id: 'secretary',
      badgeEn: 'General Secretary Desk',
      badgeTa: 'பொதுச்செயலாளர் உரை',
      officerNameEn: 'Dr. N. Senthilvel Mudaliyar, Ph.D.',
      officerNameTa: 'டாக்டர். N. செந்தில்வேல் முதலியார், Ph.D.',
      designationEn: 'State General Secretary',
      designationTa: 'மாநிலப் பொதுச்செயலாளர்',
      initials: 'NS',
      locationEn: 'Kanchipuram Division',
      locationTa: 'காஞ்சிபுரம் கோட்டம்',
      quoteEn: '"With 48 active branches across Tamil Nadu, transparency and digital governance are our core priorities. The online address book, verified matrimonial portal, and instant circular broadcasts bring total clarity to our members."',
      quoteTa: '"சங்கத்தின் வரவு செலவு கணக்குகள் மற்றும் நலத்திட்டங்கள் அனைத்தும் வெளிப்படைத்தன்மையுடன் உறுப்பினர்களுக்கு சென்று சேர வேண்டும். இந்த இணையதளத்தின் மூலம் அனைத்து அறிவிப்புகளையும், குடும்ப விவரங்களையும் உடனுக்குடன் அறியலாம்."',
      themeFocusEn: 'Digital Governance & Transparency',
      themeFocusTa: 'வெளிப்படையான சமுதாய சேவை'
    }
  ],
  pillars: [
    {
      id: 'pil-1',
      pillarNumber: 1,
      titleEn: '1. Higher Education Scholarships',
      titleTa: '1. உயர்கல்வி உதவித்தொகை & வழிகாட்டல்',
      descriptionEn: 'Providing annual grants for economically deserving students entering Engineering, Medical, Arts, and Competitive Exams.',
      descriptionTa: 'பொருளாதாரத்தில் பின்தங்கிய மாணவ-மாணவியருக்கு உயர்கல்வி பயில ஆண்டிற்கு ₹25,000 வரை நிதி உதவி மற்றும் போட்டித்தேர்வு பயிற்சி.',
      iconType: 'graduation',
      colorTheme: 'amber'
    },
    {
      id: 'pil-2',
      pillarNumber: 2,
      titleEn: '2. Trusted Matrimonial Service',
      titleTa: '2. நம்பகமான திருமண தகவல் மையம்',
      descriptionEn: 'Strictly verified community bride & groom profiles with astrological details, family background checks, and privacy protections.',
      descriptionTa: 'சரிபார்க்கப்பட்ட ஜாதகங்கள், குடும்ப பின்னணி மற்றும் பாதுகாப்பான தனியுரிமையுடன் கூடிய வரன் தேடல் வசதி.',
      iconType: 'heart',
      colorTheme: 'rose'
    },
    {
      id: 'pil-3',
      pillarNumber: 3,
      titleEn: '3. Youth Career & Placement Cell',
      titleTa: '3. இளைஞர் வேலைவாய்ப்பு & திறன் மேம்பாடு',
      descriptionEn: 'Job fairs, mentorship networks, and mock interviews connecting job seekers with community entrepreneurs and corporate leaders.',
      descriptionTa: 'சமூக தொழில் நிறுவனங்கள் மற்றும் முன்னணி நிறுவனங்களுடன் இணைந்து இளைஞர்களுக்கு நேர்முகத்தேர்வு & வேலைவாய்ப்பு அமைத்து தருதல்.',
      iconType: 'briefcase',
      colorTheme: 'blue'
    },
    {
      id: 'pil-4',
      pillarNumber: 4,
      titleEn: '4. Senior Care & Medical Aid',
      titleTa: '4. மருத்துவ உதவி & முதியோர் நலன்',
      descriptionEn: 'Emergency medical relief fund for critical illnesses, free health camps, and blood donor network coordination.',
      descriptionTa: 'மருத்துவ அவசர கால நிதி உதவி, இலவச மருத்துவ முகாம்கள் மற்றும் இரத்த தான உதவிக்குழுக்கள் ஒருங்கிணைப்பு.',
      iconType: 'medical',
      colorTheme: 'emerald'
    },
    {
      id: 'pil-5',
      pillarNumber: 5,
      titleEn: '5. Heritage & Family Lineage',
      titleTa: '5. பாரம்பரியம் & வம்சாவளி மரம்',
      descriptionEn: 'Preserving historic contributions, heritage sites, temple trusts, and family genealogical lineage records for future generations.',
      descriptionTa: 'சமூக முன்னோடிகளின் வரலாறு, திருக்கோயில் திருப்பணிகள் மற்றும் தலைமுறைகளை இணைக்கும் குடும்ப வம்சாவளி மரம் தயாரித்தல்.',
      iconType: 'tree',
      colorTheme: 'purple'
    },
    {
      id: 'pil-6',
      pillarNumber: 6,
      titleEn: '6. Business Network & Trade Directory',
      titleTa: '6. தொழில்முனைவோர் வணிக கூட்டமைப்பு',
      descriptionEn: 'Encouraging mutual business patronage, trade exhibitions, startup guidance, and verified merchant advertisements.',
      descriptionTa: 'உறுப்பினர்களிடையே பரஸ்பர வணிக ஆதரவு, வர்த்தக கண்காட்சி மற்றும் புதிய தொழில் தொடங்க வழிகாட்டுதல்.',
      iconType: 'building',
      colorTheme: 'amber'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      circularNo: 'MS/CIR/2026/08',
      titleEn: '38th Annual General Body Meeting (AGM) & State Conference Announced',
      titleTa: '38-வது ஆண்டு பொதுக்குழு கூட்டம் மற்றும் மாநில மாநாடு அறிவிப்பு',
      category: 'event',
      date: '2026-10-18',
      isUrgent: true,
      venue: 'Valluvar Kottam Convention Center, Nungambakkam, Chennai',
      summaryEn: 'All registered life members and branch coordinators are cordially invited to the 38th AGM.',
      summaryTa: 'அனைத்து ஆயுள் உறுப்பினர்கள் மற்றும் கிளை பொறுப்பாளர்கள் 38-வது பொதுக்குழு கூட்டத்தில் கலந்துகொள்ள அழைக்கப்படுகிறார்கள்.',
      detailsEn: 'The 38th Annual General Body Meeting of Tamil Nadu Mudaliyar Sangam will convene on Sunday, October 18, 2026. Agenda includes adoption of annual audit reports, election of new executive office bearers, welfare scheme grants disbursement, and youth achievement awards.',
      detailsTa: 'தமிழ்நாடு முதலியார் சங்கத்தின் 38-வது ஆண்டு பொதுக்குழு கூட்டம் 18 அக்டோபர் 2026 ஞாயிற்றுக்கிழமை அன்று நடைபெறுகிறது. ஆண்டறிக்கை சமர்ப்பித்தல், தணிக்கை கணக்கு ஒப்புதல், புதிய நிர்வாகிகள் தேர்வு, சமூக நலத்திட்ட நிதி ஒதுக்கீடு மற்றும் சாதனை மாணவ-மாணவியர் கௌரவிப்பு உள்ளிட்ட முக்கிய நிகழ்வுகள் நடைபெறும்.'
    },
    {
      id: 'ann-2',
      circularNo: 'MS/EDU/2026/04',
      titleEn: 'Higher Education Scholarship Scheme 2026-27: Application Window Open',
      titleTa: 'உயர்கல்வி உதவித்தொகை திட்டம் 2026-27: விண்ணப்பங்கள் வரவேற்பு',
      category: 'education',
      date: '2026-09-01',
      summaryEn: 'Financial assistance of up to ₹25,000 for economically deserving students pursuing Engineering, Medical & Arts.',
      summaryTa: 'பொறியியல், மருத்துவம் மற்றும் கலை அறிவியல் பயிலும் பொருளாதாரத்தில் பின்தங்கிய மாணவ-மாணவியருக்கு ₹25,000 வரை கல்வி உதவி.',
      detailsEn: 'The Sangam Education Trust announces the opening of scholarship applications for academic year 2026-27. Eligible students with family annual income below ₹2.5 Lakhs and minimum 80% marks in previous examinations can apply with necessary marksheets and income certificates.',
      detailsTa: 'சங்க கல்வி அறக்கட்டளை சார்பாக 2026-27 கல்வி ஆண்டிற்கான உதவித்தொகை விண்ணப்பங்கள் வரவேற்கப்படுகின்றன. குடும்ப ஆண்டு வருமானம் ₹2.5 லட்சத்திற்குள் உள்ள, மற்றும் 80% மதிப்பெண்களுக்கு மேல் பெற்றுள்ள கல்லூரி மாணவ-மாணவியர் தங்கள் சான்றிதழ்களுடன் விண்ணப்பிக்கலாம்.'
    },
    {
      id: 'ann-3',
      circularNo: 'MS/MAT/2026/02',
      titleEn: 'Grand Matrimonial Swayamvaram & Profile Exchange Meet in Kanchipuram',
      titleTa: 'காஞ்சிபுரத்தில் மாபெரும் வரன் பார்க்கும் சுயம்வரம் & திருமண தகவல் பரிமாற்ற நிகழ்வு',
      category: 'matrimony',
      date: '2026-11-08',
      venue: 'Sri Kachabeswarar Kalyana Mandapam, Kanchipuram',
      summaryEn: 'Direct meet for prospective brides, grooms, and their families with over 500 verified horoscope profiles.',
      summaryTa: '500-க்கும் மேற்பட்ட சரிபார்க்கப்பட்ட ஜாதகங்களுடன் மணமக்கள் மற்றும் பெற்றோர்கள் நேரில் சந்திக்கும் சங்கம நிகழ்வு.',
      detailsEn: 'A special one-day state matrimonial meet featuring direct interactions between families, digital horoscope matching assistance by expert astrologers, and confidential family consultations. Pre-registration via our portal is mandatory.',
      detailsTa: 'மணமக்கள் குடும்பங்கள் நேரில் சந்தித்துப் பேசவும், அனுபவமிக்க ஜோதிடர்கள் மூலம் உடனடி ஜாதகப் பொருத்தம் பார்க்கவும் ஏற்பாடு செய்யப்பட்டுள்ளது. நமது தளத்தின் மூலம் முன்பதிவு செய்வது கட்டாயமாகும்.'
    },
    {
      id: 'ann-4',
      circularNo: 'MS/GEN/2026/11',
      titleEn: 'Digital Community Census & Address Book Update Campaign',
      titleTa: 'டிஜிட்டல் சமுதாய மக்கள் கணக்கெடுப்பு மற்றும் முகவரி புத்தகம் புதுப்பிக்கும் இயக்கம்',
      category: 'general',
      date: '2026-08-20',
      summaryEn: 'All members are requested to update their family details, blood group, and contact numbers in the address book.',
      summaryTa: 'அனைத்து உறுப்பினர்களும் தங்கள் குடும்ப உறுப்பினர்கள், இரத்த வகை மற்றும் தொடர்பு எண்களை முகவரி புத்தகத்தில் சேர்க்குமாறு கேட்டுக்கொள்கிறோம்.',
      detailsEn: 'To facilitate effective community emergency blood donor response and modern digital services, we have launched the Digital Address Book module. Each family head can link family members with individual privacy controls.',
      detailsTa: 'அவசர கால இரத்த தான உதவி மற்றும் சமுதாய தகவல் பரிமாற்றத்தை எளிதாக்க டிஜிட்டல் முகவரி புத்தகம் தொடங்கப்பட்டுள்ளது. குடும்ப தலைவர்கள் தங்கள் குடும்ப உறுப்பினர்களை சுலபமாக இணைத்து தனியுரிமையை நிர்வகிக்கலாம்.'
    }
  ],
  events: [
    {
      id: 'evt-1',
      titleEn: 'Mega State Mudaliyar Conference & Cultural Conclave 2026',
      titleTa: 'மாபெரும் மாநில முதலியார் மாநாடு & பண்பாட்டு திருவிழா 2026',
      date: 'October 18, 2026',
      time: '09:00 AM - 05:30 PM',
      locationEn: 'Valluvar Kottam Main Auditorium, Chennai',
      locationTa: 'வள்ளுவர் கோட்டம் பிரதான அரங்கம், சென்னை',
      categoryEn: 'Annual State Convention',
      categoryTa: 'ஆண்டு மாநில மாநாடு',
      descriptionEn: 'Grand assembly of community leaders, entrepreneurs, scholars, and youth. Includes exhibition of traditional arts, social awards presentation, and business networking.',
      descriptionTa: 'சமூக தலைவர்கள், தொழில்முனைவோர், பேராசிரியர்கள் மற்றும் இளைஞர்கள் பங்கேற்கும் பிரம்மாண்ட சங்கமம். பாரம்பரிய கலை நிகழ்வுகள், விருதுகள் மற்றும் வணிக நெட்வொர்க் நடைபெறும்.'
    },
    {
      id: 'evt-2',
      titleEn: 'Youth Career Guidance & Civil Services (TNPSC / UPSC) Seminar',
      titleTa: 'இளைஞர் வழிகாட்டல் & அரசுப் பணித் தேர்வு (TNPSC / UPSC) சிறப்பு கருத்தரங்கம்',
      date: 'November 22, 2026',
      time: '10:00 AM - 01:30 PM',
      locationEn: 'Mudaliyar Sangam Hall, Gandhi Road, Vellore',
      locationTa: 'முதலியார் சங்க அரங்கம், காந்தி சாலை, வேலூர்',
      categoryEn: 'Education & Career',
      categoryTa: 'கல்வி & வேலைவாய்ப்பு',
      descriptionEn: 'Interactive coaching workshop led by serving IAS/IPS officers and industry leaders guiding 10th, 12th, and college graduates on high-growth career tracks.',
      descriptionTa: 'அரசு உயர் அதிகாரிகள் மற்றும் தொழில் துறை வல்லுநர்கள் கலந்துகொண்டு மாணவர்களுக்கு உயர்கல்வி மற்றும் போட்டித் தேர்வுகளுக்கு நேரில் வழிகாட்டுகின்றனர்.'
    },
    {
      id: 'evt-3',
      titleEn: 'Free Community Health & Emergency Blood Donation Drive',
      titleTa: 'இலவச முழு உடல் மருத்துவ முகாம் மற்றும் அவசர இரத்த தான முகாம்',
      date: 'December 13, 2026',
      time: '08:30 AM - 02:00 PM',
      locationEn: 'Community Welfare Center, Coimbatore Town Branch',
      locationTa: 'சமூக நல மையம், கோயம்புத்தூர் நகரக் கிளை',
      categoryEn: 'Health & Social Service',
      categoryTa: 'சமூக நலம் & மருத்துவம்',
      descriptionEn: 'Comprehensive eye screening, cardiology check-up, diabetes screening, and creation of a verified regional Blood Donors directory.',
      descriptionTa: 'முழு கண் பரிசோதனை, இதய பரிசோதனை, இலவச மருந்து மாத்திரைகள் மற்றும் அவசர கால இரத்த தான பதிவு முகாம் நடைபெறும்.'
    }
  ],
  contact: {
    hqTitleEn: 'Tamil Nadu Mudaliyar Sangam Central Secretariat',
    hqTitleTa: 'தமிழ்நாடு முதலியார் சங்க தலைமை அலுவலகம்',
    hqDescriptionEn: 'Feel free to reach out to our administration office for member registrations, circular clarifications, marriage hall bookings, and scholarship inquiries.',
    hqDescriptionTa: 'உறுப்பினர் பதிவு, சுற்றறிக்கைகள், திருமண மண்டப முன்பதிவு மற்றும் கல்வி உதவித்தொகை குறித்த சந்தேகங்களுக்கு தலைமை அலுவலகத்தைத் தொடர்பு கொள்ளலாம்.',
    addressEn: 'No. 45, Sengunthar Thirumana Maligai Road, Egmore, Chennai, Tamil Nadu 600008',
    addressTa: 'எண். 45, செங்குந்தர் திருமண மாளிகை சாலை, எழும்பூர், சென்னை, தமிழ்நாடு 600008',
    phones: '+91 44 2819 4500 / +91 94441 23456',
    emails: 'contact@mudaliyarsangam.org / welfare@mudaliyarsangam.org',
    workingHoursEn: 'Monday - Saturday: 09:30 AM to 06:00 PM',
    workingHoursTa: 'திங்கள் - சனி: காலை 09:30 முதல் மாலை 06:00 வரை'
  },
  branches: [
    {
      id: 'br-1',
      districtEn: 'Chennai Central',
      districtTa: 'சென்னை மத்தி',
      branchNameEn: 'Egmore Headquarters Branch',
      branchNameTa: 'எழும்பூர் தலைமை அலுவலகக் கிளை',
      presidentName: 'Thiru. S. Arumuga Mudaliyar',
      phone: '+91 94441 12345',
      address: '45, Sengunthar Salai, Egmore, Chennai 600008'
    },
    {
      id: 'br-2',
      districtEn: 'Kanchipuram',
      districtTa: 'காஞ்சிபுரம்',
      branchNameEn: 'Silk City Main Branch',
      branchNameTa: 'பட்டு நகரம் பிரதான கிளை',
      presidentName: 'Thiru. T. Devaraja Mudaliyar',
      phone: '+91 98401 54321',
      address: '12, Gandhi Road, Kanchipuram 631501'
    },
    {
      id: 'br-3',
      districtEn: 'Vellore',
      districtTa: 'வேலூர்',
      branchNameEn: 'Fort City Branch',
      branchNameTa: 'கோட்டை மாநகரக் கிளை',
      presidentName: 'Thiru. R. Shanmuga Mudaliyar',
      phone: '+91 94432 98765',
      address: '88, Anna Salai, Vellore 632001'
    },
    {
      id: 'br-4',
      districtEn: 'Coimbatore',
      districtTa: 'கோயம்புத்தூர்',
      branchNameEn: 'Kongu Regional Branch',
      branchNameTa: 'கொங்கு மண்டலக் கிளை',
      presidentName: 'Thiru. K. Velusamy Mudaliyar',
      phone: '+91 98940 11223',
      address: '56, Cross Cut Road, Gandhipuram, Coimbatore 641012'
    },
    {
      id: 'br-5',
      districtEn: 'Madurai',
      districtTa: 'மதுரை',
      branchNameEn: 'Temple City Branch',
      branchNameTa: 'கோயில் மாநகரக் கிளை',
      presidentName: 'Thiru. M. Sundaravel Mudaliyar',
      phone: '+91 97890 33445',
      address: '24, West Tower Street, Madurai 625001'
    },
    {
      id: 'br-6',
      districtEn: 'Salem',
      districtTa: 'சேலம்',
      branchNameEn: 'Mango City Branch',
      branchNameTa: 'மாம்பழ மாநகரக் கிளை',
      presidentName: 'Thiru. P. Nataraja Mudaliyar',
      phone: '+91 94421 66778',
      address: '101, Cherry Road, Salem 636007'
    }
  ]
};

const STORAGE_KEY = 'sangam_portal_content_v1';

export function loadPortalContent(): CompletePortalData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge in case schema added new fields
      return {
        ...INITIAL_PORTAL_DATA,
        ...parsed,
        branding: { ...INITIAL_PORTAL_DATA.branding, ...(parsed.branding || {}) },
        ticker: { ...INITIAL_PORTAL_DATA.ticker, ...(parsed.ticker || {}) },
        hero: { ...INITIAL_PORTAL_DATA.hero, ...(parsed.hero || {}) },
        stats: { ...INITIAL_PORTAL_DATA.stats, ...(parsed.stats || {}) },
        contact: { ...INITIAL_PORTAL_DATA.contact, ...(parsed.contact || {}) }
      };
    }
  } catch (err) {
    console.error('Error reading portal content from localStorage', err);
  }
  return INITIAL_PORTAL_DATA;
}

export function savePortalContent(data: CompletePortalData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing portal content to localStorage', err);
  }
}

export function resetPortalContentToDefault(): CompletePortalData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing portal content', err);
  }
  return INITIAL_PORTAL_DATA;
}
