import { MonthlyAutoPayMandate } from '../types';

export const INITIAL_AUTOPAY_MANDATES: MonthlyAutoPayMandate[] = [
  {
    id: 'mandate-001',
    mandateRef: 'UMRN-MUD-2024-UPI-0182',
    donorName: 'Er. S. Karthikeyan Mudaliyar',
    donorNameTa: 'பொறியாளர் எஸ். கார்த்திகேயன்',
    memberCode: 'MUD-CHN-2024-0012',
    phone: '+91 98401 22345',
    monthlyAmount: 500, // min 100
    cause: 'education_scholarship',
    causeTa: 'ஏழை மாணவர் உயர்கல்வி உதவித்தொகை நிதி',
    paymentMethod: 'UPI_AUTOPAY',
    debitDayOfMonth: 5,
    nextDebitDate: '05-Oct-2026',
    status: 'active',
    startedAt: '05-May-2024',
    totalDebitedSoFar: 8500,
    monthsContributedCount: 17
  },
  {
    id: 'mandate-002',
    mandateRef: 'UMRN-MUD-2024-ENACH-0419',
    donorName: 'Thiru. K. Shanmugasundaram Mudaliyar',
    donorNameTa: 'திரு. கே. சண்முகசுந்தரம்',
    memberCode: 'MUD-CBE-2023-0481',
    phone: '+91 94433 88123',
    monthlyAmount: 1000,
    cause: 'temple_annadhanam',
    causeTa: 'சங்க ஆலய நித்திய அன்னதான நிதி',
    paymentMethod: 'ENACH_NETBANKING',
    debitDayOfMonth: 1,
    nextDebitDate: '01-Oct-2026',
    status: 'active',
    startedAt: '01-Jan-2024',
    totalDebitedSoFar: 21000,
    monthsContributedCount: 21
  },
  {
    id: 'mandate-003',
    mandateRef: 'UMRN-MUD-2025-UPI-0912',
    donorName: 'Dr. Keerthana Soundararajan',
    donorNameTa: 'மருத்துவர் கீர்த்தனா',
    memberCode: 'MUD-CHN-2024-0310',
    phone: '+91 98403 44556',
    monthlyAmount: 100, // Minimum allowed
    cause: 'general_sangam_corpus',
    causeTa: 'சங்க பொது நல நிதி (General Corpus)',
    paymentMethod: 'UPI_AUTOPAY',
    debitDayOfMonth: 10,
    nextDebitDate: '10-Oct-2026',
    status: 'active',
    startedAt: '10-Feb-2025',
    totalDebitedSoFar: 1900,
    monthsContributedCount: 19
  },
  {
    id: 'mandate-004',
    mandateRef: 'UMRN-MUD-2024-CARD-0105',
    donorName: 'Thiru. V. Gokulnath Mudaliyar',
    donorNameTa: 'திரு. வி. கோகுல்நாத்',
    memberCode: 'MUD-VLR-2024-0089',
    phone: '+91 98411 99002',
    monthlyAmount: 250,
    cause: 'senior_medical_care',
    causeTa: 'முதியோர் மருத்துவ உதவி நிதி',
    paymentMethod: 'DEBIT_CARD_MANDATE',
    debitDayOfMonth: 15,
    nextDebitDate: '15-Oct-2026',
    status: 'paused',
    startedAt: '15-Mar-2024',
    totalDebitedSoFar: 3750,
    monthsContributedCount: 15
  }
];

export const AUTOPAY_QUICK_PRESETS = [
  { amount: 100, label: '₹100 / mo', desc: 'Minimum monthly patron' },
  { amount: 250, label: '₹250 / mo', desc: 'Student textbook sponsor' },
  { amount: 500, label: '₹500 / mo', desc: 'Scholarship contributor' },
  { amount: 1000, label: '₹1,000 / mo', desc: 'Gold patron mandate' },
  { amount: 2500, label: '₹2,500 / mo', desc: 'Trustee regular patron' }
];
