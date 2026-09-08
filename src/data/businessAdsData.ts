import { BusinessAdvertisement, AdCategory } from '../types';

export const INITIAL_BUSINESS_ADS: BusinessAdvertisement[] = [
  {
    id: 'ad-301',
    memberId: 'mem-101',
    memberName: 'R. Natarajan Mudaliyar',
    memberCode: 'MUD-KCH-2024-0129',
    businessName: 'Kanchi Sri Varadaraja Silk House & Master Weavers',
    businessNameTa: 'காஞ்சி ஸ்ரீ வரதராஜ பட்டு மாளிகை & நெசவாளர் பேரவை',
    category: 'textiles_silks',
    adTitle: 'Authentic Pure Mulberry Silk & Zari Bridal Sarees Direct From Kanchipuram Looms',
    adTitleTa: 'காஞ்சிபுரம் தறிகளிலிருந்து நேரடியாகத் தரப்படும் தூய பட்டு & ஜரிகை திருமணப் புடவைகள்',
    description: 'Generations of master craftsmanship in pure silk weaving with Silk Mark certification. Specializing in traditional Korvai borders, Temple designs, and customized muhurtham sarees with hand-woven auspicious motifs. Direct weaver prices without middlemen.',
    descriptionTa: 'தலைமுறை தலைமுறையாக தொடரும் தூய பட்டு நெசவுக் கலை. சில்க் மார்க் சான்றிதழ் பெற்ற பாரம்பரிய கோர்வை பார்டர், கோயில் டிசைன்கள் மற்றும் சுப முகூர்த்தப் புடவைகள்.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 98401 22345',
    whatsapp: '+919840122345',
    email: 'natarajan.silk@gmail.com',
    websiteUrl: 'https://kanchisilks.example.com',
    city: 'Kanchipuram',
    district: 'Kanchipuram',
    specialOffer: 'Special 15% discount for all Mudaliyar Sangam registered members with member ID',
    specialOfferTa: 'சங்க உறுப்பினர்களுக்கு உறுப்பினர் அட்டை சமர்ப்பித்தால் 15% சிறப்புத் தள்ளுபடி',
    placement: 'feed_and_main',
    status: 'approved',
    adminReviewerName: 'M. Sivasankaran (Super Admin)',
    viewsCount: 1420,
    clicksCount: 238,
    createdAt: '2026-08-28T10:00:00Z',
    approvedAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'ad-302',
    memberId: 'mem-102',
    memberName: 'Dr. K. Meenakshi Sundaram Mudaliyar',
    memberCode: 'MUD-CHN-2025-0452',
    businessName: 'Sundaram Heart Care Clinic & Preventive Health Center',
    businessNameTa: 'சுந்தரம் இதய நல மையம் & முழு உடல் பரிசோதனை நிலையம்',
    category: 'healthcare_medical',
    adTitle: 'Comprehensive Cardiac Health Checkup & Family Preventive Screening',
    adTitleTa: 'விரிவான இதயப் பரிசோதனை & குடும்ப நல்வாழ்வு மருத்துவ ஆலோசனை',
    description: 'Senior Consultant Interventional Cardiologist offering holistic cardiac consultations, 2D Echo, TMT, Holter monitoring, and diabetic cardiac risk assessment. State-of-the-art facility in Anna Nagar West.',
    descriptionTa: 'மூத்த இதய சிகிச்சை நிபுணர் வழங்கும் இதயப் பரிசோதனைகள், எக்கோ, டி.எம்.டி மற்றும் சர்க்கரை நோய் இதய பாதுகாப்பு வழிகாட்டல்.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 94440 98124',
    whatsapp: '+919444098124',
    email: 'dr.meenakshi.sundaram@gmail.com',
    websiteUrl: 'https://sundaramheartcare.example.com',
    city: 'Chennai',
    district: 'Chennai',
    specialOffer: 'Free Annual ECG & 25% concession on Cardiac Echo for Sangam Senior Citizens (60+)',
    specialOfferTa: 'சங்க மூத்த குடிமக்களுக்கு (60+) இலவச இசிஜி மற்றும் எக்கோ பரிசோதனையில் 25% சலுகை',
    placement: 'feed_and_main',
    status: 'approved',
    adminReviewerName: 'M. Sivasankaran (Super Admin)',
    viewsCount: 980,
    clicksCount: 142,
    createdAt: '2026-08-30T09:15:00Z',
    approvedAt: '2026-08-30T11:45:00Z'
  },
  {
    id: 'ad-303',
    memberId: 'mem-103',
    memberName: 'V. Shanmuga Sundaram Mudaliyar',
    memberCode: 'MUD-VEL-2024-0891',
    businessName: 'Royal Handlooms & Natural Linen Exports',
    businessNameTa: 'ராயல் கைத்தறி & ஏற்றுமதி ஜவுளி நிறுவனம்',
    category: 'textiles_silks',
    adTitle: 'Export-Quality Pure Cotton Dhotis, Angavastrams & Handloom Home Furnishings',
    adTitleTa: 'ஏற்றுமதி தரத்திலான தூய பருத்தி வேஷ்டி, அங்கவஸ்திரம் மற்றும் கைத்தறி ஆடைகள்',
    description: 'Eco-friendly natural fibers and hand-spun khadi/linen fabrics woven by master artisans in Vellore & Gudiyatham. Bulk orders for temple festivals, sangam conferences, and family functions with customized borders.',
    descriptionTa: 'வேலூர் மற்றும் குடியாத்தம் நெசவாளர்களால் நெய்யப்படும் உயர்தர பருத்தி வேஷ்டிகள், பட்டு சால்வைகள் மற்றும் வீட்டு உபயோக ஜவுளிகள்.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 98423 55190',
    whatsapp: '+919842355190',
    email: 'shanmugam.royal@gmail.com',
    city: 'Vellore',
    district: 'Vellore',
    specialOffer: 'Bulk discount of 20% on wedding dhoti/angavastram gift sets for members',
    specialOfferTa: 'திருமணப் பரிசுகளுக்கான வேஷ்டி-சால்வை தொகுப்புகளுக்கு 20% மொத்த தள்ளுபடி',
    placement: 'feed_and_main',
    status: 'approved',
    adminReviewerName: 'District Admin (Vellore)',
    viewsCount: 740,
    clicksCount: 89,
    createdAt: '2026-09-01T12:00:00Z',
    approvedAt: '2026-09-01T15:20:00Z'
  },
  {
    id: 'ad-304',
    memberId: 'mem-104',
    memberName: 'P. Muruganandam Mudaliyar',
    memberCode: 'MUD-CBE-2025-1102',
    businessName: 'Pattiswarar Foundries & High-Precision CNC Machining',
    businessNameTa: 'பட்டிஸ்வரர் பவுண்டரி & துல்லிய பொறியியல் இயந்திர பாகங்கள்',
    category: 'manufacturing_trade',
    adTitle: 'High Grade Grey Iron & Ductile SG Castings for Pumps, Automotive & Textile Mills',
    adTitleTa: 'பம்ப், மோட்டார் மற்றும் ஜவுளி இயந்திரங்களுக்கான வார்ப்பு மற்றும் CNC உதிரிபாகங்கள்',
    description: 'ISO 9001 certified modern foundry in Peelamedu, Coimbatore with 350 tons monthly casting capacity. Offering precision machining, pattern development, and rapid prototyping for entrepreneurs and manufacturers.',
    descriptionTa: 'கோயம்புத்தூர் பீளமேட்டில் அமைந்துள்ள ஐஎஸ்ஓ சான்றிதழ் பெற்ற அதிநவீன வார்ப்பகம். பம்ப் மற்றும் வாகனத் துறைகளுக்கான பாகங்கள்.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 98940 77123',
    whatsapp: '+919894077123',
    email: 'muruganan.cbe@gmail.com',
    city: 'Coimbatore',
    district: 'Coimbatore',
    specialOffer: 'Priority tooling schedule and zero pattern inspection fee for community businesses',
    specialOfferTa: 'சமுதாய தொழில்முனைவோருக்கு கட்டணமில்லா பரிசோதனை மற்றும் முன்னுரிமை உற்பத்தி',
    placement: 'news_feed_only',
    status: 'approved',
    adminReviewerName: 'M. Sivasankaran (Super Admin)',
    viewsCount: 520,
    clicksCount: 64,
    createdAt: '2026-09-02T16:00:00Z',
    approvedAt: '2026-09-02T18:30:00Z'
  },
  // PENDING REVIEW ADS (Ready for Admin Verification & Approval Demo)
  {
    id: 'ad-305',
    memberId: 'mem-106',
    memberName: 'S. Karthikeyan Mudaliyar',
    memberCode: 'MUD-MDU-2026-0314',
    businessName: 'Karthikeyan & Associates - High Court & Corporate Law Chambers',
    businessNameTa: 'கார்த்திகேயன் & அசோசியேட்ஸ் - உயர் நீதிமன்ற சட்ட ஆலோசகர்கள்',
    category: 'professional_services',
    adTitle: 'Expert Legal Advisory in Property Title Verification, Ancestral Will & Civil Litigation',
    adTitleTa: 'சொத்து பத்திர சரிபார்ப்பு, பாகப்பிரிவினை மற்றும் உயர் நீதிமன்ற சட்ட ஆலோசனைகள்',
    description: '22+ years practicing in Madras High Court (Madurai Bench) and District Courts. Specialized in family partition deeds, ancestral land dispute resolution, temple trust administration, and corporate contract drafting.',
    descriptionTa: 'சென்னை உயர் நீதிமன்ற மதுரை கிளையில் 22 ஆண்டுகால அனுபவம். பூர்வீக சொத்து தகராறுகள் மற்றும் அறக்கட்டளை சட்ட ஆலோசனைகள்.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 94432 11098',
    whatsapp: '+919443211098',
    email: 'karthikeyan.legal@gmail.com',
    websiteUrl: 'https://karthikeyanlegal.example.com',
    city: 'Madurai',
    district: 'Madurai',
    specialOffer: 'Free first 30-min legal consultation for Sangam members on family ancestral land matters',
    specialOfferTa: 'சங்க உறுப்பினர்களுக்கு பூர்வீக சொத்து விவகாரங்களில் முதல் 30 நிமிட ஆலோசனை முற்றிலும் இலவசம்',
    placement: 'feed_and_main',
    status: 'pending_review',
    viewsCount: 0,
    clicksCount: 0,
    createdAt: '2026-09-07T10:30:00Z'
  },
  {
    id: 'ad-306',
    memberId: 'mem-107',
    memberName: 'A. Thillai Govindasamy Mudaliyar',
    memberCode: 'MUD-CDL-2024-0941',
    businessName: 'Chidambaram Sri Nataraja Traditional Pure Vegetarian Catering & Event Planners',
    businessNameTa: 'சிதம்பரம் ஸ்ரீ நடராஜர் பாரம்பரிய சைவ சமையல் & திருமண மேலாண்மை',
    category: 'catering_events',
    adTitle: 'Authentic Traditional Saiva Mudaliyar Wedding Feasts & Grand Event Management',
    adTitleTa: 'பாரம்பரிய சைவ முதலியார் திருமண விருந்து & கல்யாண மண்டப ஏற்பாடுகள்',
    description: 'Renowned for sumptuous wedding banquets, authentic traditional sweets (Thiruvaiyaru Ashoka, Akkaravadisal, Badam Halwa), live hot tiffin counters, and end-to-end muhurtham arrangements across Tamil Nadu and Bengaluru.',
    descriptionTa: 'நிகரற்ற சுவையில் பாரம்பரிய சைவ திருமண விருந்துகள், மணமகன்-மணமகள் சீர் தட்டுகள் மற்றும் மண்டப அலங்காரங்கள்.',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
    ],
    phone: '+91 98418 66230',
    whatsapp: '+919841866230',
    email: 'thillai.farms@gmail.com',
    city: 'Chidambaram',
    district: 'Cuddalore',
    specialOffer: 'Complimentary welcome mocktail counter and special traditional dessert for Sangam bookings',
    specialOfferTa: 'சங்க உறுப்பினர்கள் முன்பதிவு செய்தால் இலவச வரவேற்பு பானம் மற்றும் பாரம்பரிய இனிப்பு',
    placement: 'feed_and_main',
    status: 'pending_review',
    viewsCount: 0,
    clicksCount: 0,
    createdAt: '2026-09-07T12:45:00Z'
  }
];

export const AD_CATEGORIES: { id: AdCategory; labelEn: string; labelTa: string }[] = [
  { id: 'textiles_silks', labelEn: 'Silks, Handlooms & Textiles', labelTa: 'பட்டு, கைத்தறி & ஜவுளி' },
  { id: 'professional_services', labelEn: 'Legal, CA & Advisory', labelTa: 'சட்டம், ஆடிட்டிங் & ஆலோசனை' },
  { id: 'healthcare_medical', labelEn: 'Hospitals & Medical Care', labelTa: 'மருத்துவமனைகள் & நல்வாழ்வு' },
  { id: 'catering_events', labelEn: 'Catering & Event Planners', labelTa: 'பாரம்பரிய சமையல் & விழாக்கள்' },
  { id: 'real_estate_construction', labelEn: 'Real Estate & Builders', labelTa: 'ரியல் எஸ்டேட் & கட்டடம்' },
  { id: 'education_academy', labelEn: 'Education, Schools & Trusts', labelTa: 'கல்வி, பள்ளிகள் & கல்லூரிகள்' },
  { id: 'manufacturing_trade', labelEn: 'Industry, Foundries & Trade', labelTa: 'தொழிற்சாலை & உற்பத்தி' },
  { id: 'jewelry_lifestyle', labelEn: 'Gold, Jewelry & Lifestyle', labelTa: 'தங்க நகை & வாழ்வியல்' },
  { id: 'other', labelEn: 'General Enterprises & Services', labelTa: 'பொது வணிகம் & சேவைகள்' }
];

export const PRESET_BANNER_IMAGES = [
  {
    label: 'Kanchipuram Silk Looms & Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Modern Medical & Cardiology Clinic',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Handloom Fabrics & Cotton Textiles',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Traditional Wedding Feast & Catering',
    url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Law Chambers & Judicial Practice',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Industrial Engineering & Foundries',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Real Estate & Architectural Construction',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80'
  }
];
