import { DonationEntry, SangamEventFinance } from '../types';

export const INITIAL_DONATIONS: DonationEntry[] = [
  {
    id: 'don-1001',
    receiptNo: 'MSD-2026-RCT-0089',
    donorName: 'R. Natarajan Mudaliyar (Sri Varadaraja Silks)',
    donorNameTa: 'திரு. ஆர். நடராஜன் முதலியார் (ஸ்ரீ வரதராஜ பட்டு மாளிகை)',
    memberCode: 'MUD-KCH-2024-0129',
    nativePlaceOor: 'Kanchipuram',
    gotramKulam: 'Agasthiya Gotram',
    phone: '+91 98401 22345',
    amount: 150000,
    eventId: 'evt-75th-annual-meet',
    eventName: '75th Annual Platinum Jubilee Sangam Convention 2026',
    eventNameTa: '75-ஆம் ஆண்டு பவள விழா & உலக முதலியார் மாநாடு 2026',
    paymentMode: 'NEFT_RTGS',
    paymentRef: 'IOBA20260814981123',
    date: '2026-08-14',
    panNumber: 'AAEPN1294M',
    isTaxExempt80G: true,
    purpose: 'Grand Patron & Platinum Sponsor for 75th Convention Annadhanam',
    purposeTa: '75-ஆம் ஆண்டு பவள விழா மாநாட்டு அறுசுவை அன்னதான பெருவிழா புரவலர் நன்கொடை'
  },
  {
    id: 'don-1002',
    receiptNo: 'MSD-2026-RCT-0090',
    donorName: 'Dr. K. Meenakshi Sundaram Mudaliyar',
    donorNameTa: 'டாக்டர் கே. மீனாட்சி சுந்தரம் முதலியார் (இதய நல மருத்துவர்)',
    memberCode: 'MUD-CHN-2025-0452',
    nativePlaceOor: 'Poonamallee / Chennai',
    gotramKulam: 'Vashistha Gotram',
    phone: '+91 94440 98124',
    amount: 100000,
    eventId: 'evt-scholarship-fest',
    eventName: 'Higher Education Scholarship & Gold Medal Fest 2026',
    eventNameTa: 'உயர் கல்வி உதவித்தொகை & தங்கப் பதக்கம் வழங்கும் விழா 2026',
    paymentMode: 'UPI',
    paymentRef: 'UPI/260818293012/GPay',
    date: '2026-08-18',
    panNumber: 'ABIPM3491D',
    isTaxExempt80G: true,
    purpose: 'Medical & Engineering College Tuition Aid for 4 deserving community students',
    purposeTa: 'முதலியார் சமுதாய 4 ஏழை மருத்துவ & பொறியியல் மாணவர்களுக்கான கல்வி உதவித்தொகை'
  },
  {
    id: 'don-1003',
    receiptNo: 'MSD-2026-RCT-0091',
    donorName: 'P. Muruganandam Mudaliyar (Pattiswarar Foundries)',
    donorNameTa: 'திரு. பி. முருகானந்தம் முதலியார் (பட்டிஸ்வரர் பவுண்டரி)',
    memberCode: 'MUD-CBE-2025-1102',
    nativePlaceOor: 'Coimbatore',
    gotramKulam: 'Viswamitra Gotram',
    phone: '+91 98940 77123',
    amount: 75000,
    eventId: 'evt-75th-annual-meet',
    eventName: '75th Annual Platinum Jubilee Sangam Convention 2026',
    eventNameTa: '75-ஆம் ஆண்டு பவள விழா & உலக முதலியார் மாநாடு 2026',
    paymentMode: 'Cheque',
    paymentRef: 'CHQ #441920 / SBI Coimbatore',
    date: '2026-08-20',
    panNumber: 'AFGPM8821K',
    isTaxExempt80G: true,
    purpose: 'Sangam Souvenir publication and digital broadcast live streaming sponsorship',
    purposeTa: 'மாநாட்டு சிறப்பு மலர் அச்சிடுதல் மற்றும் நேரலை ஒளிபரப்பு நிதி'
  },
  {
    id: 'don-1004',
    receiptNo: 'MSD-2026-RCT-0092',
    donorName: 'Smt. Vasantha Ponnuranga Mudaliyar & Family',
    donorNameTa: 'திருமதி. வசந்தா பொன்னுரங்க முதலியார் & குடும்பத்தினர்',
    memberCode: 'MUD-VEL-2024-0331',
    nativePlaceOor: 'Vellore / Katpadi',
    gotramKulam: 'Bharadwaja Gotram',
    phone: '+91 98423 44102',
    amount: 50000,
    eventId: 'evt-temple-renovation',
    eventName: 'Ancestral Kula Deivam Temple Renovation & Kumbhabhishekam',
    eventNameTa: 'குலதெய்வ திருக்கோயில் திருப்பணி & மகா கும்பாபிஷேகம்',
    paymentMode: 'UPI',
    paymentRef: 'UPI/260822019481/PhonePe',
    date: '2026-08-22',
    isTaxExempt80G: true,
    purpose: 'Vimana Gopuram gold leaf kalasam and sanctum sanctorum granite flooring',
    purposeTa: 'விமான கோபுர தங்க கலசம் & கர்ப்பக்கிரக கருங்கல் தளம் பதிக்கும் திருப்பணி'
  },
  {
    id: 'don-1005',
    receiptNo: 'MSD-2026-RCT-0093',
    donorName: 'K. S. Vijayaraghavan Mudaliyar (Salem Handlooms)',
    donorNameTa: 'திரு. கே. எஸ். விஜயராகவன் முதலியார் (சேலம் கைத்தறி நெசவாளர்)',
    memberCode: 'MUD-SLM-2024-0618',
    nativePlaceOor: 'Salem / Ammapettai',
    gotramKulam: 'Kasyapa Gotram',
    phone: '+91 98427 11984',
    amount: 35000,
    eventId: 'evt-scholarship-fest',
    eventName: 'Higher Education Scholarship & Gold Medal Fest 2026',
    eventNameTa: 'உயர் கல்வி உதவித்தொகை & தங்கப் பதக்கம் வழங்கும் விழா 2026',
    paymentMode: 'NEFT_RTGS',
    paymentRef: 'HDFC000189472019',
    date: '2026-08-25',
    panNumber: 'ALMPV7741E',
    isTaxExempt80G: true,
    purpose: 'Gold medals for 10th and 12th standard State Rank Mudaliyar community toppers',
    purposeTa: 'பத்தாம் & பன்னிரண்டாம் வகுப்பு மாநில அளவிலான முதலிடம் பெற்ற மாணவர்களுக்கு தங்கப் பதக்கம்'
  },
  {
    id: 'don-1006',
    receiptNo: 'MSD-2026-RCT-0094',
    donorName: 'A. Thillai Govindasamy Mudaliyar',
    donorNameTa: 'திரு. ஏ. தில்லை கோவிந்தசாமி முதலியார் (சிதம்பரம் நடராஜர் கேட்டரிங்)',
    memberCode: 'MUD-CDL-2024-0941',
    nativePlaceOor: 'Chidambaram',
    gotramKulam: 'Appar Kulam',
    phone: '+91 98418 66230',
    amount: 50000,
    eventId: 'evt-matrimony-youth',
    eventName: 'Mudaliyar Youth Entrepreneurship & Matrimonial Conclave 2026',
    eventNameTa: 'முதலியார் இளைஞர் தொழில்முனைவோர் & சுயம்வரத் திருமண சங்கமம் 2026',
    paymentMode: 'UPI',
    paymentRef: 'UPI/260829881720/Paytm',
    date: '2026-08-29',
    isTaxExempt80G: true,
    purpose: 'Complimentary feast & tea refreshments for 600 participating bride & groom families',
    purposeTa: 'சுயம்வரத்தில் பங்கேற்கும் 600 மணமக்கள் குடும்பங்களுக்கான அறுசுவை உணவு & சிற்றுண்டி அனுசரணை'
  },
  {
    id: 'don-1007',
    receiptNo: 'MSD-2026-RCT-0095',
    donorName: 'S. Karthikeyan Mudaliyar (High Court Advocate)',
    donorNameTa: 'திரு. எஸ். கார்த்திகேயன் முதலியார் (உயர் நீதிமன்ற வழக்கறிஞர்)',
    memberCode: 'MUD-MDU-2026-0314',
    nativePlaceOor: 'Madurai',
    gotramKulam: 'Agasthiya Gotram',
    phone: '+91 94432 11098',
    amount: 25000,
    eventId: 'evt-75th-annual-meet',
    eventName: '75th Annual Platinum Jubilee Sangam Convention 2026',
    eventNameTa: '75-ஆம் ஆண்டு பவள விழா & உலக முதலியார் மாநாடு 2026',
    paymentMode: 'UPI',
    paymentRef: 'UPI/260901239841/GPay',
    date: '2026-09-01',
    panNumber: 'ABYPK6612R',
    isTaxExempt80G: true,
    purpose: 'Legal awareness desk and seminar mementos for sangam youth wing',
    purposeTa: 'இளைஞரணி சட்ட விழிப்புணர்வு கருத்தரங்கு & நினைவுப் பரிசுகள்'
  },
  {
    id: 'don-1008',
    receiptNo: 'MSD-2026-RCT-0096',
    donorName: 'M. Sivasankaran Mudaliyar',
    donorNameTa: 'திரு. எம். சிவசங்கரன் முதலியார் (மாநில ஒருங்கிணைப்பாளர்)',
    memberCode: 'MUD-CHN-2024-0012',
    nativePlaceOor: 'Kanchipuram / Chennai',
    gotramKulam: 'Thilakavathiyar Kulam',
    phone: '+91 98401 99881',
    amount: 50000,
    eventId: 'evt-scholarship-fest',
    eventName: 'Higher Education Scholarship & Gold Medal Fest 2026',
    eventNameTa: 'உயர் கல்வி உதவித்தொகை & தங்கப் பதக்கம் வழங்கும் விழா 2026',
    paymentMode: 'Cash',
    paymentRef: 'CASH-REC-0194',
    date: '2026-09-03',
    isTaxExempt80G: true,
    purpose: 'Digital equipment & laptops endowment fund for rural students',
    purposeTa: 'கிராமப்புற முதலியார் கல்லூரி மாணவர்களுக்கான மடிக்கணினி & மின்னணு கல்வி சாதன நிதி'
  }
];

export const SANGAM_EVENTS_FINANCE: SangamEventFinance[] = [
  {
    id: 'evt-75th-annual-meet',
    title: '75th Annual Platinum Jubilee Sangam Convention 2026',
    titleTa: '75-ஆம் ஆண்டு பவள விழா & உலக முதலியார் மாநாடு 2026',
    date: '2026-08-15 to 2026-08-16',
    venue: 'Kamarajar Arangam & AC Convention Centre, T. Nagar, Chennai',
    venueTa: 'காமராஜர் அரங்கம் & ஏசி மாநாட்டு மையம், தி.நகர், சென்னை',
    status: 'completed',
    totalCredit: 2850000, // மொத்த வரவு (28.5 Lakhs)
    totalDebit: 2185400,  // மொத்த பற்று / செலவு (21.85 Lakhs)
    totalSalavu: 2185400, // backward compatibility
    netBalance: 664600,   // மீதி இருப்பு (6.64 Lakhs surplus credited to Sangam Corpus)
    treasurerName: 'Er. C. Shanmugasundaram Mudaliyar (State Treasurer)',
    auditedBy: 'M/s. R. Ramanathan & Co., Chartered Accountants (FRN: 004128S)',
    items: [
      // Credits (வரவு)
      {
        id: 'fin-c1',
        type: 'credit',
        category: 'Patron Donations',
        categoryTa: 'முதன்மைக் புரவலர்கள் நன்கொடை',
        description: 'Chief Patrons & Industrialists Special Platinum Jubilee Donations',
        descriptionTa: 'தொழிலதிபர்கள் மற்றும் சமுதாய முதன்மைப் புரவலர்களின் மாநாட்டு நன்கொடை',
        amount: 1450000,
        voucherNo: 'CR-2026-01',
        date: '2026-08-14',
        vendorOrDonor: 'Kanchi Silk Guild, Coimbatore Foundries & Patrons',
        approvedBy: 'State President & Treasurer'
      },
      {
        id: 'fin-c2',
        type: 'credit',
        category: 'Delegate Registration',
        categoryTa: 'பிரதிநிதிகள் பதிவு கட்டணம்',
        description: 'Family & Delegate Registration passes collected (1,640 registered families)',
        descriptionTa: 'சங்க குடும்பங்கள் & பிரதிநிதிகள் பதிவு கட்டணம் (1,640 குடும்பங்கள்)',
        amount: 820000,
        voucherNo: 'CR-2026-02',
        date: '2026-08-15',
        vendorOrDonor: 'Sangam District Units (Chennai, Kanchi, Vellore, CBE, MDU)',
        approvedBy: 'Registration Committee Chair'
      },
      {
        id: 'fin-c3',
        type: 'credit',
        category: 'Souvenir Advertisements',
        categoryTa: 'மாநாட்டு மலர் விளம்பரங்கள்',
        description: 'Commercial & Member Business Advertisements in 75th Commemorative Souvenir',
        descriptionTa: 'பவள விழா சிறப்பு நினைவு மலரில் வெளியான வணிக விளம்பரக் கட்டணம்',
        amount: 430000,
        voucherNo: 'CR-2026-03',
        date: '2026-08-15',
        vendorOrDonor: '48 Member Commercial Enterprises & Advertisers',
        approvedBy: 'Souvenir Committee Secretary'
      },
      {
        id: 'fin-c4',
        type: 'credit',
        category: 'Exhibition Stalls',
        categoryTa: 'கண்காட்சி & உணவு அரங்குகள் வாடகை',
        description: 'Rental collected from 15 Traditional Handloom, Books & Craft Stalls',
        descriptionTa: 'பாரம்பரிய கைத்தறி, புத்தகங்கள் மற்றும் கலை அரங்குகள் வாடகை',
        amount: 150000,
        voucherNo: 'CR-2026-04',
        date: '2026-08-15',
        vendorOrDonor: 'Exhibitors & Handloom Societies',
        approvedBy: 'Exhibition Manager'
      },
      // Debits (செலவு / பற்று / Debit)
      {
        id: 'fin-s1',
        type: 'debit',
        category: 'Hall & Venue Rent',
        categoryTa: 'அரங்கம் & ஏசி மண்டப வாடகை',
        description: 'Kamarajar Arangam 2-day hire charges including AC, generator backup & parking',
        descriptionTa: 'காமராஜர் அரங்கம் 2 நாள் வாடகை, ஏசி, ஜெனரேட்டர் மற்றும் வாகன நிறுத்தம்',
        amount: 650000,
        voucherNo: 'EXP-2026-01',
        date: '2026-08-14',
        vendorOrDonor: 'Kamarajar Memorial Trust, Chennai',
        approvedBy: 'Treasurer & Auditor'
      },
      {
        id: 'fin-s2',
        type: 'debit',
        category: 'Annadhanam & Catering',
        categoryTa: 'அறுசுவை சைவ உணவு & அன்னதானம்',
        description: 'Traditional 4-course feast (Lunch, Tiffin, Dinner) for 3,500 attendees x 2 days',
        descriptionTa: '3,500 உறுப்பினர்களுக்கு இருவேளை அறுசுவை சைவ உணவு, காலை சிற்றுண்டி & காபி',
        amount: 780000,
        voucherNo: 'EXP-2026-02',
        date: '2026-08-16',
        vendorOrDonor: 'Sri Nataraja Traditional Saiva Catering, Chidambaram',
        approvedBy: 'Food Committee In-charge'
      },
      {
        id: 'fin-s3',
        type: 'debit',
        category: 'Stage, Audio & LED Screen',
        categoryTa: 'மேடை அலங்காரம், எல்இடி திரை & ஒலி அமைப்பு',
        description: 'Mega 40x20 ft Stage backdrop, 3 High-resolution LED screens & live YouTube link',
        descriptionTa: 'பவள விழா மேடை அலங்காரம், 3 எல்இடி திரைகள் மற்றும் நேரலை ஒளிபரப்பு அமைப்பு',
        amount: 275000,
        voucherNo: 'EXP-2026-03',
        date: '2026-08-15',
        vendorOrDonor: 'Sound Craft Pro Audio & Digital Displays, Chennai',
        approvedBy: 'Event Coordinator'
      },
      {
        id: 'fin-s4',
        type: 'debit',
        category: 'Souvenir Printing',
        categoryTa: 'மாநாட்டு மலர் அச்சிடுதல்',
        description: 'Printing 2,500 copies of 280-page Multicolor 75th Jubilee Souvenir Book',
        descriptionTa: '2,500 வண்ண மாநாட்டு மலர் புத்தகங்கள் உயர்தர ஆர்ட் பேப்பரில் அச்சிடுதல்',
        amount: 210000,
        voucherNo: 'EXP-2026-04',
        date: '2026-08-15',
        vendorOrDonor: 'Sivakasi Premier Offset Printers',
        approvedBy: 'Souvenir Editor'
      },
      {
        id: 'fin-s5',
        type: 'debit',
        category: 'Mementos & Gold Medals',
        categoryTa: 'நினைவுப் பரிசுகள் & பொன்னாடை',
        description: 'Silver mementos, shawls and gold medals honoring 75 Mudaliyar community luminaries',
        descriptionTa: '75 சமுதாய மூத்த சான்றோர்கள், தியாகிகள் & சாதனையாளர்களுக்கு வெள்ளி கேடயம், பொன்னாடை',
        amount: 140400,
        voucherNo: 'EXP-2026-05',
        date: '2026-08-16',
        vendorOrDonor: 'Sri Meenakshi Jewel Crafts & Mementos, Madurai',
        approvedBy: 'Honors Committee'
      },
      {
        id: 'fin-s6',
        type: 'debit',
        category: 'Security, Sanitation & Badges',
        categoryTa: 'பாதுகாப்பு, துப்புரவு & அடையாள அட்டை',
        description: 'Delegate badge lanyard printing, sanitization, private security & volunteer caps',
        descriptionTa: 'பிரதிநிதிகள் அடையாள அட்டை, தூய்மைப் பணிகள் மற்றும் பாதுகாப்பு ஏற்பாடுகள்',
        amount: 130000,
        voucherNo: 'EXP-2026-06',
        date: '2026-08-16',
        vendorOrDonor: 'Eagle Eye Security & Allied Services',
        approvedBy: 'General Secretary'
      }
    ]
  },
  {
    id: 'evt-scholarship-fest',
    title: 'Higher Education Scholarship & Gold Medal Fest 2026',
    titleTa: 'உயர் கல்வி உதவித்தொகை & தங்கப் பதக்கம் வழங்கும் விழா 2026',
    date: '2026-07-26',
    venue: 'Valluvar Gurukulam Auditorium, Tambaram, Chennai',
    venueTa: 'வள்ளுவர் குருகுலம் கலையரங்கம், தாம்பரம், சென்னை',
    status: 'completed',
    totalCredit: 1620000, // வரவு (16.2 Lakhs)
    totalDebit: 1492000,  // பற்று / செலவு (14.92 Lakhs)
    totalSalavu: 1492000, // backward compatibility
    netBalance: 128000,   // மீதி இருப்பு (1.28 Lakhs retained for emergency student medical aid)
    treasurerName: 'Er. C. Shanmugasundaram Mudaliyar',
    auditedBy: 'M/s. R. Ramanathan & Co., Chartered Accountants',
    items: [
      // Credit
      {
        id: 'fin-sc-c1',
        type: 'credit',
        category: 'Educational Endowments',
        categoryTa: 'கல்வி அறக்கட்டளை நிதி',
        description: 'Patron donations dedicated specifically for professional student scholarships',
        descriptionTa: 'சமுதாய மாணவர்கள் கல்விக்காக பெறப்பட்ட சிறப்பு நன்கொடைகள்',
        amount: 1250000,
        voucherNo: 'ED-CR-01',
        date: '2026-07-20',
        vendorOrDonor: 'Mudaliyar Global Alumni & Doctors Forum',
        approvedBy: 'Education Trust Board'
      },
      {
        id: 'fin-sc-c2',
        type: 'credit',
        category: 'Diaspora Contributions',
        categoryTa: 'புலம்பெயர் சங்கங்கள் பங்களிப்பு',
        description: 'Direct grant from Singapore & North America Mudaliyar Sangam Chapters',
        descriptionTa: 'சிங்கப்பூர் & அமெரிக்க முதலியார் சங்கங்களின் கல்வி உதவிப் பங்களிப்பு',
        amount: 370000,
        voucherNo: 'ED-CR-02',
        date: '2026-07-22',
        vendorOrDonor: 'Singapore Tamil Sangam Mudaliyar Wing',
        approvedBy: 'International Liaison Committee'
      },
      // Debit
      {
        id: 'fin-sc-s1',
        type: 'debit',
        category: 'Direct Scholarships Disbursed',
        categoryTa: 'நேரடி கல்வி உதவித்தொகை வழங்கல்',
        description: 'Direct bank transfer of college fee for 68 MBBS, BE, Law and Arts students',
        descriptionTa: '68 மருத்துவ, பொறியியல், சட்ட மற்றும் கலைக்கல்லூரி மாணவர்களுக்கு கல்விக் கட்டணம் வழங்கல்',
        amount: 1150000,
        voucherNo: 'SCH-EXP-01',
        date: '2026-07-26',
        vendorOrDonor: 'Beneficiary Students Bank Accounts (Direct Disbursal)',
        approvedBy: 'Scholarship Verification Committee'
      },
      {
        id: 'fin-sc-s2',
        type: 'debit',
        category: 'Gold Medals & Certificates',
        categoryTa: 'தங்கப் பதக்கங்கள் & சான்றிதழ்கள்',
        description: 'Pure Gold & Silver medals for 45 State and District topper students (10th/12th Std)',
        descriptionTa: '10 மற்றும் 12-ஆம் வகுப்பு பொதுத்தேர்வில் முதலிடம் பிடித்த 45 மாணவர்களுக்கு தங்கப் பதக்கம்',
        amount: 165000,
        voucherNo: 'SCH-EXP-02',
        date: '2026-07-26',
        vendorOrDonor: 'Govindasamy & Sons Medallists, Chennai',
        approvedBy: 'Education Secretary'
      },
      {
        id: 'fin-sc-s3',
        type: 'debit',
        category: 'Hall Rent & Refreshments',
        categoryTa: 'அரங்க வாடகை & உணவு ஏற்பாடு',
        description: 'Auditorium rent, student welcome packs and afternoon lunch for 800 people',
        descriptionTa: 'அரங்க வாடகை, மாணவர்களுக்கான புத்தகப் பைகள் & 800 பேருக்கு அறுசுவை உணவு',
        amount: 177000,
        voucherNo: 'SCH-EXP-03',
        date: '2026-07-26',
        vendorOrDonor: 'Valluvar Trust & Sangeetha Catering',
        approvedBy: 'Event Organizer'
      }
    ]
  },
  {
    id: 'evt-temple-renovation',
    title: 'Ancestral Kula Deivam Temple Renovation & Kumbhabhishekam',
    titleTa: 'குலதெய்வ திருக்கோயில் திருப்பணி & மகா கும்பாபிஷேகம்',
    date: '2026-06-12',
    venue: 'Sri Angala Parameswari & Seralan Temple Complex, Melmaruvathur',
    venueTa: 'ஸ்ரீ அங்காள பரமேஸ்வரி & சீராளன் திருக்கோயில் வளாகம், மேல்மருவத்தூர்',
    status: 'completed',
    totalCredit: 1980000, // வரவு (19.8 Lakhs)
    totalDebit: 1845000,  // பற்று / செலவு (18.45 Lakhs)
    totalSalavu: 1845000, // backward compatibility
    netBalance: 135000,   // மீதி இருப்பு (1.35 Lakhs deposited in Temple Nithiya Pooja Fund)
    treasurerName: 'Er. C. Shanmugasundaram Mudaliyar',
    auditedBy: 'Internal Audit Committee & Temple Trustees',
    items: [
      {
        id: 'fin-tr-c1',
        type: 'credit',
        category: 'Kula Deivam Devotee Offerings',
        categoryTa: 'பக்தர்கள் உபய நன்கொடைகள்',
        description: 'Devotee donations collected for Raja Gopuram, Vahanam & Yagasalai',
        descriptionTa: 'ராஜகோபுரம், உற்சவ வாகனங்கள் மற்றும் யாகசாலைக்கான பக்தர்கள் உபயத் தொகை',
        amount: 1980000,
        voucherNo: 'TR-CR-01',
        date: '2026-06-10',
        vendorOrDonor: 'Kula Deivam Family Lineages (பங்காளிகள் பேரவை)',
        approvedBy: 'Thiruppani Committee President'
      },
      {
        id: 'fin-tr-s1',
        type: 'debit',
        category: 'Stapathi & Gopuram Sculptures',
        categoryTa: 'ஸ்தபதி கூலி & கோபுர சிற்ப வேலைகள்',
        description: 'Complete sculptural restoration and traditional natural color painting',
        descriptionTa: 'ராஜகோபுரம் சுதைச் சிற்பங்கள் புனரமைப்பு & வர்ணம் பூசுதல் ஸ்தபதி கூலி',
        amount: 820000,
        voucherNo: 'TR-EXP-01',
        date: '2026-06-11',
        vendorOrDonor: 'Swamimalai Silpa Kala Mandir Stapathi',
        approvedBy: 'Temple Trust Chairman'
      },
      {
        id: 'fin-tr-s2',
        type: 'debit',
        category: 'Yagasalai Pooja & Sivachariyars',
        categoryTa: 'யாகசாலை பூஜை & சிவாச்சாரியார் தட்சணை',
        description: '5-kala Yagasalai pooja draviyangal, holy waters from sacred rivers, homam samithu',
        descriptionTa: '5 கால யாகசாலை பூஜைகள், புண்ணிய தீர்த்தங்கள், நெய், நவதானியங்கள் & சிவாச்சாரியார்கள் தட்சணை',
        amount: 475000,
        voucherNo: 'TR-EXP-02',
        date: '2026-06-12',
        vendorOrDonor: 'Kumbhabhishekam Veda Sivachariyar Peedam',
        approvedBy: 'Pooja Secretary'
      },
      {
        id: 'fin-tr-s3',
        type: 'debit',
        category: 'Maha Annadhanam for Devotees',
        categoryTa: 'பக்தர்களுக்கு மகா அன்னதானம்',
        description: 'Continuous Annadhanam serving 6,000 visiting devotees across Kumbhabhishekam day',
        descriptionTa: 'கும்பாபிஷேக திருநாளில் வருகை தந்த 6,000 பக்தர்களுக்கு நாள் முழுவதும் தொடர் அன்னதானம்',
        amount: 550000,
        voucherNo: 'TR-EXP-03',
        date: '2026-06-12',
        vendorOrDonor: 'Temple Annadhana Mandapam & Provision Vendors',
        approvedBy: 'Annadhanam In-charge'
      }
    ]
  },
  {
    id: 'evt-matrimony-youth',
    title: 'Mudaliyar Youth Entrepreneurship & Matrimonial Conclave 2026',
    titleTa: 'முதலியார் இளைஞர் தொழில்முனைவோர் & சுயம்வரத் திருமண சங்கமம் 2026',
    date: '2026-09-20 (Upcoming)',
    venue: 'Mayor Ramanathan Chettiar Hall, Raja Annamalaipuram, Chennai',
    venueTa: 'மேயர் ராமநாதன் செட்டியார் அரங்கம், ராஜா அண்ணாமலைபுரம், சென்னை',
    status: 'ongoing',
    totalCredit: 890000,  // வரவு
    totalDebit: 675000,   // உத்தேச பற்று / செலவு (Advance & Budgeted)
    totalSalavu: 675000,  // backward compatibility
    netBalance: 215000,   // இருப்பு
    treasurerName: 'Er. C. Shanmugasundaram Mudaliyar',
    auditedBy: 'Interim Accounts Committee',
    items: [
      {
        id: 'fin-my-c1',
        type: 'credit',
        category: 'Matrimonial Registrations',
        categoryTa: 'வரன் பதிவு & சுயவிவர கையேடு',
        description: 'Advance bride/groom registrations and horoscopic dossier inclusion',
        descriptionTa: 'மணமகன், மணமகள் முன்பதிவு மற்றும் ஜாதகக் குறிப்பு கையேடு பதிவு கட்டணம்',
        amount: 540000,
        voucherNo: 'MY-CR-01',
        date: '2026-09-02',
        vendorOrDonor: '540 Registered Mudaliyar Families',
        approvedBy: 'Matrimony Wing Convenor'
      },
      {
        id: 'fin-my-c2',
        type: 'credit',
        category: 'Startup Booth Sponsors',
        categoryTa: 'தொழில்முனைவோர் அரங்கு ஸ்பான்சர்கள்',
        description: 'Corporate and business patrons sponsoring startup pitch stage',
        descriptionTa: 'இளைஞர் புதிய தொழில் தொடங்குவதற்கான வழிகாட்டல் அரங்கு ஸ்பான்சர்ஷிப்',
        amount: 350000,
        voucherNo: 'MY-CR-02',
        date: '2026-09-04',
        vendorOrDonor: 'Mudaliyar Business Chamber',
        approvedBy: 'Youth Wing Secretary'
      },
      {
        id: 'fin-my-s1',
        type: 'debit',
        category: 'Hall Advance Booking',
        categoryTa: 'அரங்க முன்பதிவு கட்டணம்',
        description: 'MRC Centre AC Banquet and meeting rooms advance booking deposit',
        descriptionTa: 'மேயர் ராமநாதன் அரங்கம் ஏசி மண்டபம் மற்றும் கலந்தாய்வு அறைகள் முன்பணம்',
        amount: 320000,
        voucherNo: 'MY-EXP-01',
        date: '2026-08-28',
        vendorOrDonor: 'MRC Centre Administration',
        approvedBy: 'Treasurer'
      },
      {
        id: 'fin-my-s2',
        type: 'debit',
        category: 'Profile Directory Printing',
        categoryTa: 'வரன் சுயவிவர புத்தகம் அச்சிடுதல்',
        description: 'Printing 700 copies of photo profile handbook with Kulam, Gotram & Horoscopes',
        descriptionTa: '700 வண்ண வரன் சுயவிவரக் கையேடுகள் குலம், கோத்திரம், ஜாதகக் கட்டங்களுடன் அச்சிடுதல்',
        amount: 185000,
        voucherNo: 'MY-EXP-02',
        date: '2026-09-03',
        vendorOrDonor: 'Vasantha Printers, Chennai',
        approvedBy: 'Matrimony Committee'
      },
      {
        id: 'fin-my-s3',
        type: 'debit',
        category: 'Food & Tea Catering Advance',
        categoryTa: 'உணவு மற்றும் தேநீர் முன்பணம்',
        description: 'Catering advance for breakfast, buffet lunch and high tea for attendees',
        descriptionTa: 'பங்கேற்கும் குடும்பங்களுக்கான காலை சிற்றுண்டி, மதிய உணவு மற்றும் மாலை தேநீர் முன்பணம்',
        amount: 170000,
        voucherNo: 'MY-EXP-03',
        date: '2026-09-05',
        vendorOrDonor: 'Shri Balaji Catering Services',
        approvedBy: 'Food Committee'
      }
    ]
  }
];

export const SANGAM_BANK_DETAILS = {
  accountName: 'Mudaliyar Sangam Central Trust & Welfare Fund',
  accountNameTa: 'முதலியார் சங்க மத்திய அறக்கட்டளை & சமுதாய நல நிதி',
  bankName: 'Indian Overseas Bank (IOB)',
  branch: 'T. Nagar Branch, Chennai - 600017',
  accountNumber: '018902000041289',
  ifscCode: 'IOBA0000189',
  upiId: 'mudaliyarsangam@iob',
  panNumber: 'AAATM1940F',
  section80GRegNo: 'CIT(E)/CHN/80G/2021-22/A/1042',
  validity: 'Permanent 80G Exemption Certificate (Under Sec 80G(5)(vi) of IT Act, 1961)'
};
