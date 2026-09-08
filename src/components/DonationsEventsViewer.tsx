import React, { useState } from 'react';
import {
  HandHeart,
  TrendingUp,
  TrendingDown,
  Scale,
  Receipt,
  Download,
  Search,
  Filter,
  Calendar,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  CreditCard,
  PlusCircle,
  Eye,
  Printer,
  X,
  ExternalLink,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Shield,
  Lock,
  Edit3,
  Trash2,
  Repeat,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Language, DonationEntry, SangamEventFinance, FinancialLedgerItem, PaymentMode } from '../types';
import { INITIAL_DONATIONS, SANGAM_EVENTS_FINANCE, SANGAM_BANK_DETAILS } from '../data/donationsData';
import { AutoPayMandatesSection } from './AutoPayMandatesSection';
import { ModuleTopNav } from './ModuleTopNav';

interface DonationsEventsViewerProps {
  language: Language;
  searchQuery?: string;
  onBackToHome?: () => void;
}

export const DonationsEventsViewer: React.FC<DonationsEventsViewerProps> = ({
  language,
  searchQuery: externalSearch,
  onBackToHome
}) => {
  // RBAC Role State - Financial edit & excel export restricted to Executive Admin & Super Admin
  const [currentUserRole, setCurrentUserRole] = useState<'super_admin' | 'executive_admin' | 'member'>('super_admin');
  const [activeSubTab, setActiveSubTab] = useState<'events_ledger' | 'donators' | 'autopay' | 'bank_trust'>('events_ledger');
  const [donations, setDonations] = useState<DonationEntry[]>(INITIAL_DONATIONS);
  const [eventsFinance, setEventsFinance] = useState<SangamEventFinance[]>(SANGAM_EVENTS_FINANCE);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Donation for Official 80G Receipt Modal
  const [viewingReceipt, setViewingReceipt] = useState<DonationEntry | null>(null);

  // Voucher Edit & Add Modal State (Admin only)
  const [editingLedgerItem, setEditingLedgerItem] = useState<FinancialLedgerItem | null>(null);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState<boolean>(false);
  const [newVoucher, setNewVoucher] = useState({
    type: 'debit' as 'credit' | 'debit',
    category: 'Hall Rental & Mandapam',
    categoryTa: 'அரங்கம் & மண்டப வாடகை',
    description: '',
    descriptionTa: '',
    amount: 10000,
    vendorOrDonor: '',
    approvedBy: 'Sangam Executive Admin',
    eventId: 'evt-75th-annual-meet'
  });

  // New Donation Modal State
  const [isAddDonationOpen, setIsAddDonationOpen] = useState<boolean>(false);
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    donorNameTa: '',
    memberCode: 'MUD-CHN-2024-0012',
    nativePlaceOor: 'Kanchipuram',
    gotramKulam: 'Agasthiya Gotram',
    phone: '+91 98401 22345',
    amount: 10000,
    eventId: 'evt-75th-annual-meet',
    paymentMode: 'UPI' as PaymentMode,
    purpose: '',
    purposeTa: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const effectiveSearch = (externalSearch || searchTerm).trim().toLowerCase();

  // Financial aggregates
  const totalDonationsSum = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalAllEventsCredit = eventsFinance.reduce((sum, e) => sum + e.totalCredit, 0);
  const totalAllEventsDebit = eventsFinance.reduce((sum, e) => sum + (e.totalDebit ?? e.totalSalavu ?? 0), 0);
  const totalNetBalance = totalAllEventsCredit - totalAllEventsDebit;

  // Selected Event Finance
  const activeEvent = selectedEventId === 'all'
    ? null
    : eventsFinance.find((e) => e.id === selectedEventId);

  // Filtered Ledger Items for selected event or all events
  const displayedLedgerItems = (
    selectedEventId === 'all'
      ? eventsFinance.flatMap((e) =>
          e.items.map((item) => ({ ...item, eventTitle: language === 'en' ? e.title : e.titleTa }))
        )
      : (activeEvent?.items || []).map((item) => ({
          ...item,
          eventTitle: language === 'en' ? activeEvent?.title : activeEvent?.titleTa
        }))
  ).filter((item) => {
    const matchesType = ledgerTypeFilter === 'all' || item.type === ledgerTypeFilter;
    const matchesSearch =
      !effectiveSearch ||
      item.description.toLowerCase().includes(effectiveSearch) ||
      item.descriptionTa.includes(effectiveSearch) ||
      item.category.toLowerCase().includes(effectiveSearch) ||
      item.categoryTa.includes(effectiveSearch) ||
      item.vendorOrDonor.toLowerCase().includes(effectiveSearch) ||
      item.voucherNo.toLowerCase().includes(effectiveSearch);
    return matchesType && matchesSearch;
  });

  // Filtered Donators
  const filteredDonations = donations.filter((d) => {
    const matchesEvent = selectedEventId === 'all' || d.eventId === selectedEventId;
    const matchesSearch =
      !effectiveSearch ||
      d.donorName.toLowerCase().includes(effectiveSearch) ||
      d.donorNameTa.includes(effectiveSearch) ||
      d.memberCode.toLowerCase().includes(effectiveSearch) ||
      d.nativePlaceOor.toLowerCase().includes(effectiveSearch) ||
      d.gotramKulam.toLowerCase().includes(effectiveSearch) ||
      d.receiptNo.toLowerCase().includes(effectiveSearch) ||
      d.phone.includes(effectiveSearch);
    return matchesEvent && matchesSearch;
  });

  // Handle New Donation Submission
  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.amount || Number(newDonation.amount) <= 0) {
      alert('Please enter valid donor name and amount.');
      return;
    }

    const eventObj = eventsFinance.find((ef) => ef.id === newDonation.eventId) || eventsFinance[0];
    const rctNum = `MSD-2026-RCT-00${Math.floor(100 + Math.random() * 900)}`;

    const createdEntry: DonationEntry = {
      id: `don-${Date.now()}`,
      receiptNo: rctNum,
      donorName: newDonation.donorName,
      donorNameTa: newDonation.donorNameTa || newDonation.donorName,
      memberCode: newDonation.memberCode,
      nativePlaceOor: newDonation.nativePlaceOor,
      gotramKulam: newDonation.gotramKulam,
      phone: newDonation.phone,
      amount: Number(newDonation.amount),
      eventId: eventObj.id,
      eventName: eventObj.title,
      eventNameTa: eventObj.titleTa,
      paymentMode: newDonation.paymentMode,
      paymentRef: `TXN-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString().split('T')[0],
      isTaxExempt80G: true,
      purpose: newDonation.purpose || 'Sangam Welfare and Event Patronage Fund',
      purposeTa: newDonation.purposeTa || 'சங்க நல நிதி & மாநாட்டு ஆதரவு பங்களிப்பு'
    };

    setDonations((prev) => [createdEntry, ...prev]);

    // Also update the event credit ledger
    setEventsFinance((prev) =>
      prev.map((ef) => {
        if (ef.id === eventObj.id) {
          const newCreditItem: FinancialLedgerItem = {
            id: `fin-auto-${Date.now()}`,
            type: 'credit',
            category: 'Member Contribution',
            categoryTa: 'உறுப்பினர் நன்கொடை',
            description: `Donation from ${createdEntry.donorName} (${createdEntry.receiptNo})`,
            descriptionTa: `${createdEntry.donorNameTa} வழங்கிய நன்கொடை (${createdEntry.receiptNo})`,
            amount: createdEntry.amount,
            voucherNo: `CR-${Date.now().toString().slice(-5)}`,
            date: createdEntry.date,
            vendorOrDonor: createdEntry.donorName,
            approvedBy: 'State Treasurer'
          };
          return {
            ...ef,
            totalCredit: ef.totalCredit + createdEntry.amount,
            netBalance: ef.netBalance + createdEntry.amount,
            items: [newCreditItem, ...ef.items]
          };
        }
        return ef;
      })
    );

    setIsAddDonationOpen(false);
    setToastMessage(
      language === 'en'
        ? `Thank you! Donation of ₹${createdEntry.amount.toLocaleString('en-IN')} recorded with 80G Receipt #${createdEntry.receiptNo}.`
        : `நன்றி! ₹${createdEntry.amount.toLocaleString('en-IN')} நன்கொடை பதிவு செய்யப்பட்டு 80G ரசீது எண் ${createdEntry.receiptNo} உருவாக்கப்பட்டது.`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  // RBAC Permission Check: Sangam Executive Admin and Super Admin only
  const canEditAndExport = currentUserRole === 'super_admin' || currentUserRole === 'executive_admin';

  // Export Financial Ledger & Donator List to Excel - Restricted to Super Admin & Executive Admin
  const handleExportLedgerExcel = () => {
    if (!canEditAndExport) {
      alert(
        language === 'en'
          ? '🔒 Access Denied: Statutory Excel Financial Ledger export is strictly restricted to Sangam Executive Admin and Super Admin roles only. Members have read-only transparency access.'
          : '🔒 அனுமதி மறுக்கப்பட்டது: வரவு-செலவு கணக்கு எக்செல் கோப்பு பதிவிறக்கம் சங்க நிர்வாக செயல் அலுவலர் (Executive Admin) மற்றும் முதன்மை நிர்வாகிக்கு (Super Admin) மட்டுமே அனுமதிக்கப்பட்டுள்ளது.'
      );
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Event Ledger (Credit vs Debit)
      const ledgerRows = displayedLedgerItems.map((item) => ({
        'Voucher No': item.voucherNo,
        'Date': item.date,
        'Type': item.type === 'credit' ? 'CREDIT' : 'DEBIT',
        'Event': item.eventTitle || 'All Events',
        'Category': item.category,
        'Description': item.description,
        'Party (Donor / Vendor)': item.vendorOrDonor,
        'Approved By': item.approvedBy,
        'Amount (INR)': item.amount
      }));
      const wsLedger = XLSX.utils.json_to_sheet(ledgerRows);
      XLSX.utils.book_append_sheet(wb, wsLedger, 'Event Financial Ledger');

      // Sheet 2: Donators List
      const donorRows = donations.map((d) => ({
        'Receipt No': d.receiptNo,
        'Date': d.date,
        'Donor Name': d.donorName,
        'Member Code': d.memberCode,
        'Native Place (Oor)': d.nativePlaceOor,
        'Gotram / Kulam': d.gotramKulam,
        'Event Donated For': d.eventName,
        'Payment Mode': d.paymentMode,
        'Amount (INR)': d.amount,
        '80G Exemption': d.isTaxExempt80G ? 'Yes (80G Eligible)' : 'No',
        'Purpose': d.purpose
      }));
      const wsDonors = XLSX.utils.json_to_sheet(donorRows);
      XLSX.utils.book_append_sheet(wb, wsDonors, 'Donators Directory');

      const fileName = `Mudaliyar_Sangam_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setToastMessage(
        language === 'en'
          ? `Authorized Excel Export: Financial Ledger & Donator Records exported to "${fileName}".`
          : `வரவு-செலவு மற்றும் நன்கொடையாளர் விவரங்கள் வெற்றிகரமாக எக்செல் கோப்பாக பதிவிறக்கப்பட்டது.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to export Excel file.');
    }
  };

  // Admin delete voucher
  const handleDeleteVoucher = (voucherId: string) => {
    if (!canEditAndExport) {
      alert('Access Denied: Only Sangam Executive Admin and Super Admin can delete vouchers.');
      return;
    }
    if (!confirm('Are you sure you want to delete this financial voucher? This action will be audited.')) {
      return;
    }

    setEventsFinance((prev) =>
      prev.map((ev) => {
        const itemToDelete = ev.items.find((i) => i.id === voucherId);
        if (!itemToDelete) return ev;
        const remaining = ev.items.filter((i) => i.id !== voucherId);
        const diffCredit = itemToDelete.type === 'credit' ? itemToDelete.amount : 0;
        const diffDebit = itemToDelete.type === 'debit' ? itemToDelete.amount : 0;
        const newCredit = ev.totalCredit - diffCredit;
        const currentDebit = ev.totalDebit ?? ev.totalSalavu ?? 0;
        const newDebit = currentDebit - diffDebit;
        return {
          ...ev,
          items: remaining,
          totalCredit: newCredit,
          totalDebit: newDebit,
          totalSalavu: newDebit,
          netBalance: newCredit - newDebit
        };
      })
    );

    setToastMessage('Voucher deleted and financial ledger recalculated.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Admin save edited voucher
  const handleSaveVoucherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLedgerItem || !canEditAndExport) return;

    setEventsFinance((prev) =>
      prev.map((ev) => {
        const hasItem = ev.items.some((i) => i.id === editingLedgerItem.id);
        if (!hasItem) return ev;

        const updatedItems = ev.items.map((i) =>
          i.id === editingLedgerItem.id ? editingLedgerItem : i
        );
        const newCredit = updatedItems
          .filter((i) => i.type === 'credit')
          .reduce((sum, i) => sum + i.amount, 0);
        const newDebit = updatedItems
          .filter((i) => i.type === 'debit')
          .reduce((sum, i) => sum + i.amount, 0);

        return {
          ...ev,
          items: updatedItems,
          totalCredit: newCredit,
          totalDebit: newDebit,
          totalSalavu: newDebit,
          netBalance: newCredit - newDebit
        };
      })
    );

    setEditingLedgerItem(null);
    setToastMessage('Voucher successfully updated in audited ledger.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Admin create new Credit/Debit voucher
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditAndExport) {
      alert('Access Denied: Only Sangam Executive Admin and Super Admin can record financial vouchers.');
      return;
    }

    const createdVoucher: FinancialLedgerItem = {
      id: `vch-${Date.now().toString().slice(-4)}`,
      voucherNo: `MSD-2026-VCH-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: newVoucher.type,
      category: newVoucher.category,
      categoryTa: newVoucher.categoryTa || newVoucher.category,
      description: newVoucher.description,
      descriptionTa: newVoucher.descriptionTa || newVoucher.description,
      amount: Number(newVoucher.amount),
      vendorOrDonor: newVoucher.vendorOrDonor,
      approvedBy: `${currentUserRole === 'super_admin' ? 'Super Admin' : 'Sangam Executive Admin'}`
    };

    setEventsFinance((prev) =>
      prev.map((ev) => {
        if (ev.id === newVoucher.eventId) {
          const updatedItems = [createdVoucher, ...ev.items];
          const newCredit = updatedItems.filter((i) => i.type === 'credit').reduce((s, i) => s + i.amount, 0);
          const newDebit = updatedItems.filter((i) => i.type === 'debit').reduce((s, i) => s + i.amount, 0);
          return {
            ...ev,
            items: updatedItems,
            totalCredit: newCredit,
            totalDebit: newDebit,
            totalSalavu: newDebit,
            netBalance: newCredit - newDebit
          };
        }
        return ev;
      })
    );

    setIsAddVoucherOpen(false);
    setToastMessage(`Voucher #${createdVoucher.voucherNo} recorded successfully.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Accounts, Donations & Event Ledger"
        moduleNameTa="நிதி கணக்குகள், நன்கொடை & நிகழ்வு வரவு-செலவு"
        badgeEn="Statutory Audited Transparency"
        badgeTa="தணிக்கை செய்யப்பட்ட கணக்கு"
        subtitleEn="Statutory financial transparency with itemized Credit & Debit vouchers and 80G receipts."
        subtitleTa="சங்கத்தின் முழுமையான நிதி வெளிப்படைத்தன்மை, வரவு-செலவு வவுச்சர்கள் மற்றும் 80G ரசீதுகள்."
        themeColor="teal"
        icon={HandHeart}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Card (Teal / Deep Cyan Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/50 border border-teal-200/90 shadow-[0_4px_24px_rgba(13,148,136,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
                <HandHeart className="w-5 h-5 text-white" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Donations & Event Financial Accounts'
                  : 'நன்கொடை & நிகழ்வு வரவு-செலவு கணக்கு'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {language === 'en'
                ? 'Complete statutory financial transparency. Members can inspect donor lists, 80G tax receipts, and itemized Credit and Debit vouchers for each Sangam convention, scholarship fest, and temple renovation.'
                : 'சங்கத்தின் முழுமையான வெளிப்படைத்தன்மை. ஒவ்வொரு மாநாடு மற்றும் அறப்பணிகளுக்கான நன்கொடையாளர் பட்டியல், 80G ரசீதுகள் மற்றும் நிகழ்வு வாரியாக வரவு-செலவு (Credit/Debit) வவுச்சர் கணக்குகள்.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <button
              type="button"
              id="btn-add-donation"
              onClick={() => setIsAddDonationOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Record Donation' : 'நன்கொடை பதிவு'}</span>
            </button>

            <button
              type="button"
              id="btn-export-finance-excel"
              onClick={handleExportLedgerExcel}
              className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap cursor-pointer ${
                canEditAndExport
                  ? 'bg-stone-800 hover:bg-stone-900'
                  : 'bg-stone-400 opacity-80'
              }`}
              title={
                canEditAndExport
                  ? 'Export Official Financial Ledger'
                  : 'Restricted to Sangam Executive Admin and Super Admin'
              }
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Export Ledger (XLS)' : 'கணக்கு ஏற்றுமதி'}</span>
            </button>
          </div>
        </div>

        {/* RBAC Role Security Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-600 dark:text-zinc-400 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Current Security Role:</span>
            </span>
            <div className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setCurrentUserRole('super_admin')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentUserRole === 'super_admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setCurrentUserRole('executive_admin')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentUserRole === 'executive_admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Sangam Executive Admin
              </button>
              <button
                type="button"
                onClick={() => setCurrentUserRole('member')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentUserRole === 'member'
                    ? 'bg-zinc-700 text-white shadow-xs'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Sangam Member
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {canEditAndExport ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Credit/Debit Edit & Excel Export Authorized</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Financial Edits & Excel Export Restricted (Audit Mode)</span>
              </span>
            )}
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
              <span>{language === 'en' ? 'Total Collections' : 'மொத்த வரவு'}</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
              ₹{totalAllEventsCredit.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {language === 'en' ? 'Across all Sangam initiatives' : 'நான்கு பெருவிழாக்கள் & நிதி'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-semibold mb-1">
              <span>{language === 'en' ? 'Total Debit / Expenses' : 'மொத்த பற்று / செலவு'}</span>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-rose-950 dark:text-rose-100">
              ₹{totalAllEventsDebit.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-rose-700 dark:text-rose-400">
              {language === 'en' ? 'Verified itemized vouchers' : 'தணிக்கை செய்யப்பட்ட ரசீதுகள்'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
            <div className="flex items-center justify-between text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">
              <span>{language === 'en' ? 'Net Sangam Reserve' : 'நிகர சங்க இருப்பு நிதி'}</span>
              <Scale className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-purple-950 dark:text-purple-100">
              +₹{totalNetBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              {language === 'en' ? 'Transferred to Sangam Corpus' : 'சங்க பொது நல நிதிக்கு மாற்றம்'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
              <span>{language === 'en' ? 'Audited 80G Receipts' : '80G வரிவிலக்கு ரசீதுகள்'}</span>
              <Receipt className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-950 dark:text-amber-100">
              {donations.length} {language === 'en' ? 'Patrons' : 'புரவலர்கள்'}
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              {language === 'en' ? '100% Tax Deductible' : 'வருமான வரி பிரிவு 80G கீழ் விலக்கு'}
            </span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            id="subtab-events-ledger"
            onClick={() => setActiveSubTab('events_ledger')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'events_ledger'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Event-wise Credit & Debit' : 'நிகழ்வு வரவு-செலவு'}</span>
          </button>

          <button
            type="button"
            id="subtab-donators-list"
            onClick={() => setActiveSubTab('donators')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'donators'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <HandHeart className="w-3.5 h-3.5" />
            <span>
              {language === 'en' ? 'Donator Directory & 80G Receipts' : 'நன்கொடையாளர் பட்டியல்'} ({donations.length})
            </span>
          </button>

          <button
            type="button"
            id="subtab-autopay"
            onClick={() => setActiveSubTab('autopay')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'autopay'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>
              {language === 'en' ? 'Monthly Auto-Pay (Min ₹100)' : 'மாதாந்திர தானியங்கி சந்தா (Min ₹100)'}
            </span>
          </button>

          <button
            type="button"
            id="subtab-bank-trust"
            onClick={() => setActiveSubTab('bank_trust')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'bank_trust'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Bank Account & Trust Info' : 'வங்கி கணக்கு & விதிகள்'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EVENT-WISE FINANCIAL LEDGER (CREDIT & SALAVU) */}
      {activeSubTab === 'events_ledger' && (
        <div className="space-y-6">
          {/* Event Selector and Filters */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Event Dropdown */}
              <div className="flex-1">
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                  {language === 'en' ? 'Select Sangam Event:' : 'சங்க நிகழ்வைத் தேர்வு செய்க:'}
                </label>
                <select
                  id="event-select-dropdown"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="all">
                    {language === 'en' ? '📁 All Sangam Events Combined' : 'அனைத்து நிகழ்வுகளும்'}
                  </option>
                  {eventsFinance.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {language === 'en' ? ev.title : ev.titleTa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter (Credit / Debit / All) */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                  {language === 'en' ? 'Voucher Type:' : 'வவுச்சர் வகை:'}
                </label>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setLedgerTypeFilter('all')}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
                      ledgerTypeFilter === 'all'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 font-semibold hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {language === 'en' ? 'All' : 'அனைத்தும்'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLedgerTypeFilter('credit')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      ledgerTypeFilter === 'credit'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Credit' : 'வரவு'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLedgerTypeFilter('debit')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      ledgerTypeFilter === 'debit'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Debit' : 'பற்று / செலவு'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Keyword Search */}
            <div className="relative pt-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                placeholder={
                  language === 'en'
                    ? 'Filter items by description, category (Hall rent, Annadhanam, Gold medals...), voucher #...'
                    : 'விவரம், மண்டப வாடகை, அன்னதானம், பதக்கங்கள், வவுச்சர் எண் மூலம் வடிகட்டுக...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* If Single Event is Selected, Display Event Header Card with Credit vs Debit Meter */}
          {activeEvent && (
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? activeEvent.title : activeEvent.titleTa}
                  </h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeEvent.date}</span>
                    <span>•</span>
                    <span>{language === 'en' ? activeEvent.venue : activeEvent.venueTa}</span>
                  </p>
                </div>
                <div className="text-xs text-right text-zinc-500">
                  <span className="block font-medium text-zinc-700 dark:text-zinc-300">
                    {activeEvent.treasurerName}
                  </span>
                  <span className="text-[11px] text-zinc-400">{activeEvent.auditedBy}</span>
                </div>
              </div>

              {/* Event Credit / Debit / Net Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">
                    {language === 'en' ? 'Total Income / Credit:' : 'மொத்த வரவு:'}
                  </span>
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                    ₹{activeEvent.totalCredit.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                  <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 block">
                    {language === 'en' ? 'Total Debit / Expenses:' : 'மொத்த பற்று / செலவு:'}
                  </span>
                  <span className="text-lg font-bold text-rose-900 dark:text-rose-100">
                    ₹{(activeEvent.totalDebit ?? activeEvent.totalSalavu ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
                  <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300 block">
                    {language === 'en' ? 'Net Balance / Surplus:' : 'நிகர உபரி இருப்பு:'}
                  </span>
                  <span className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    +₹{activeEvent.netBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                  <span>
                    {language === 'en' ? 'Debit utilization of total credit:' : 'பற்று / செலவு விகிதம்:'}{' '}
                    <strong>{(((activeEvent.totalDebit ?? activeEvent.totalSalavu ?? 0) / activeEvent.totalCredit) * 100).toFixed(1)}%</strong>
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {language === 'en' ? 'Surplus Saved:' : 'சேமிக்கப்பட்ட இருப்பு:'}{' '}
                    {((activeEvent.netBalance / activeEvent.totalCredit) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${(((activeEvent.totalDebit ?? activeEvent.totalSalavu ?? 0) / activeEvent.totalCredit) * 100)}%` }}
                    title="Debit / Expenses"
                  />
                  <div
                    className="bg-purple-600 h-full"
                    style={{ width: `${((activeEvent.netBalance / activeEvent.totalCredit) * 100)}%` }}
                    title="Surplus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Itemized Table of Incomes & Expenses (Credits & Debits) */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'en'
                    ? `Itemized Financial Ledger (${displayedLedgerItems.length} Entries)`
                    : `விரிவான வரவு-செலவு கணக்கு பட்டியல் (${displayedLedgerItems.length} பதிவுகள்)`}
                </span>
              </h4>

              <div className="flex items-center gap-2">
                {canEditAndExport ? (
                  <button
                    type="button"
                    id="btn-add-voucher"
                    onClick={() => setIsAddVoucherOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Add Voucher (Admin)' : 'வவுச்சர் பதிவு'}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Member Audit View Only</span>
                  </span>
                )}
                <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                  Statutory Audit Compliance (CA Certified)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                    <th className="py-3 px-4 font-semibold">Voucher / Date</th>
                    <th className="py-3 px-4 font-semibold">Type (Credit / Debit)</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Description / Purpose</th>
                    <th className="py-3 px-4 font-semibold">Vendor / Donor Party</th>
                    <th className="py-3 px-4 font-semibold">Approved By</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount (₹)</th>
                    <th className="py-3 px-4 font-semibold text-center">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {displayedLedgerItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-zinc-100 block">
                          {item.voucherNo}
                        </span>
                        <span className="text-[11px] text-zinc-400">{item.date}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.type === 'credit' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>{language === 'en' ? 'Credit' : 'வரவு'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>{language === 'en' ? 'Debit' : 'பற்று / செலவு'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-medium whitespace-nowrap">
                        {language === 'en' ? item.category : item.categoryTa}
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                          {language === 'en' ? item.description : item.descriptionTa}
                        </p>
                        {selectedEventId === 'all' && item.eventTitle && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                            📌 {item.eventTitle}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                        {item.vendorOrDonor}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-zinc-500 whitespace-nowrap">
                        {item.approvedBy}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold">
                        <span
                          className={
                            item.type === 'credit'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }
                        >
                          {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {canEditAndExport ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingLedgerItem(item)}
                              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                              title="Edit Voucher (Admin)"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVoucher(item.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
                              title="Delete Voucher (Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                            <Lock className="w-3 h-3 text-zinc-400" />
                            <span>Read-only</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {displayedLedgerItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        {language === 'en'
                          ? 'No ledger vouchers found matching your filter criteria.'
                          : 'தேடலுக்குரிய வரவு-செலவு பதிவுகள் எதுவும் கிடைக்கவில்லை.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DONATORS DIRECTORY & 80G RECEIPTS */}
      {activeSubTab === 'donators' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="donor-search-input"
                type="text"
                placeholder={
                  language === 'en'
                    ? 'Search Donors by Name, Member ID, Sontha Oor, Kulam/Gotram, Receipt #...'
                    : 'நன்கொடையாளர் பெயர், உறுப்பினர் எண், சொந்த ஊர், குலம், ரசீது எண் மூலம் தேடுக...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                id="donor-event-filter"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="all">{language === 'en' ? 'All Events & Endowments' : 'அனைத்து நிகழ்வுகளும்'}</option>
                {eventsFinance.map((ef) => (
                  <option key={ef.id} value={ef.id}>
                    {language === 'en' ? ef.title : ef.titleTa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Donator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDonations.map((donor) => (
              <div
                key={donor.id}
                id={`donor-card-${donor.id}`}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {language === 'en' ? donor.donorName : donor.donorNameTa}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {donor.nativePlaceOor} • {donor.gotramKulam}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      ID: {donor.memberCode}
                    </span>
                  </div>

                  {/* Amount Badge */}
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono block">
                      ₹{donor.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                      {donor.paymentMode}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>
                      {language === 'en' ? 'Event / Cause:' : 'நிகழ்வு:'}{' '}
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {language === 'en' ? donor.eventName : donor.eventNameTa}
                      </strong>
                    </span>
                    <span className="font-mono">{donor.date}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 italic">
                    "{language === 'en' ? donor.purpose : donor.purposeTa}"
                  </p>
                </div>

                {/* Receipt and Tax Info */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <Receipt className="w-3.5 h-3.5 text-amber-600" />
                    <span>{donor.receiptNo}</span>
                    {donor.isTaxExempt80G && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        80G Verified
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewingReceipt(donor)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-emerald-200 dark:border-emerald-800"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'View 80G Receipt' : '80G ரசீது பார்க்க'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDonations.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500">
              {language === 'en' ? 'No donors found matching your search.' : 'தேடலுக்குரிய நன்கொடையாளர்கள் இல்லை.'}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: BANK ACCOUNT & TRUST GOVERNANCE */}
      {activeSubTab === 'bank_trust' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct Bank Donation Transfer Details */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
                  <Building2 className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? 'Official Sangam Bank Account Details' : 'சங்க அதிகாரப்பூர்வ வங்கி விவரங்கள்'}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 block">
                    {language === 'en' ? 'Account Beneficiary Name' : 'கணக்கின் பெயர்'}
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    {language === 'en' ? SANGAM_BANK_DETAILS.accountName : SANGAM_BANK_DETAILS.accountNameTa}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 block">Bank Name</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{SANGAM_BANK_DETAILS.bankName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 block">Branch</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{SANGAM_BANK_DETAILS.branch}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 block">Account Number</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {SANGAM_BANK_DETAILS.accountNumber}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 block">IFSC Code</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {SANGAM_BANK_DETAILS.ifscCode}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">
                      Direct UPI / GPay / PhonePe VPA
                    </span>
                    <span className="font-mono font-bold text-emerald-950 dark:text-emerald-100 text-sm">
                      {SANGAM_BANK_DETAILS.upiId}
                    </span>
                  </div>
                  <QrCode className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
            </div>

            {/* Income Tax Section 80G Exemption & Transparency */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'en'
                    ? 'Income Tax 80G Statutory Exemption & Audit Seal'
                    : 'வருமான வரி பிரிவு 80G வரிவிலக்கு சான்றிதழ்'}
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold block">
                    80G Order Number:
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {SANGAM_BANK_DETAILS.section80GRegNo}
                  </span>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                    {SANGAM_BANK_DETAILS.validity}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 font-medium block">
                    Trust Permanent Account Number (PAN):
                  </span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {SANGAM_BANK_DETAILS.panNumber}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs">
                  <h4 className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'en' ? 'Chartered Accountant Audit Statement' : 'ஆடிட்டர் தணிக்கை அறிக்கை'}</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    "We hereby certify that all financial receipts, donor contributions, and event debits & expenses (Credit/Debit) for Mudaliyar Sangam Central Trust have been audited in accordance with ICAI standards and Tamil Nadu Societies Registration Act."
                  </p>
                  <span className="block mt-2 font-mono text-[10px] text-emerald-800 dark:text-emerald-400">
                    — M/s. R. Ramanathan & Co., Chartered Accountants (FRN: 004128S)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: MONTHLY AUTO-PAY MANDATES (MINIMUM ₹100 LIKE ECS / NACH) */}
      {activeSubTab === 'autopay' && (
        <AutoPayMandatesSection language={language} />
      )}

      {/* OFFICIAL 80G TAX EXEMPTION RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Header with Sangam Name and 80G Seal */}
            <div className="border-b-2 border-emerald-700 pb-4 text-center relative">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block p-2 rounded-xl bg-emerald-700 text-white mb-2 shadow-xs">
                <HandHeart className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-900 tracking-tight">
                MUDALIYAR SANGAM CENTRAL TRUST & WELFARE ENDOWMENT
              </h2>
              <p className="text-xs text-zinc-600 font-medium">
                முதலியார் சங்க மத்திய அறக்கட்டளை & சமுதாய நல நிதி • Reg. No: 189/1951
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Central Office: 42, G.N. Chetty Road, T. Nagar, Chennai - 600017 | Tel: +91 44 2815 4420
              </p>

              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                DONATION RECEIPT UNDER SECTION 80G OF INCOME TAX ACT, 1961
              </div>
            </div>

            {/* Receipt Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 block text-[11px]">Official Receipt No:</span>
                <span className="font-mono font-bold text-zinc-900 text-sm">{viewingReceipt.receiptNo}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-right">
                <span className="text-zinc-500 block text-[11px]">Date of Receipt:</span>
                <span className="font-mono font-bold text-zinc-900 text-sm">{viewingReceipt.date}</span>
              </div>
            </div>

            {/* Donor Particulars */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Received with thanks from:</span>
                <span className="font-bold text-zinc-900 text-sm">{viewingReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Sangam Membership Code:</span>
                <span className="font-mono font-semibold">{viewingReceipt.memberCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Native Place (Sontha Oor) & Gotram:</span>
                <span>
                  {viewingReceipt.nativePlaceOor} • {viewingReceipt.gotramKulam}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Event / Purpose of Donation:</span>
                <span className="font-semibold text-emerald-800">{viewingReceipt.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Mode & Ref:</span>
                <span className="font-mono font-medium">
                  {viewingReceipt.paymentMode} ({viewingReceipt.paymentRef || 'Verified'})
                </span>
              </div>
            </div>

            {/* Amount in Digits & Words */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold block">Donation Amount Received:</span>
                <span className="text-2xl font-black text-emerald-950 font-mono">
                  ₹{viewingReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-800 uppercase px-3 py-1 bg-white rounded-lg border border-emerald-200">
                INR {viewingReceipt.amount.toLocaleString('en-IN')} Only
              </span>
            </div>

            {/* Statutory Tax Exemption Declaration */}
            <div className="text-[11px] text-zinc-500 space-y-1 border-t border-zinc-200 pt-3">
              <p>
                <strong>80G Registration:</strong> {SANGAM_BANK_DETAILS.section80GRegNo} | Trust PAN:{' '}
                {SANGAM_BANK_DETAILS.panNumber}
              </p>
              <p>
                Donations to Mudaliyar Sangam Central Trust are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961.
              </p>
            </div>

            {/* Signatures and Stamp */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
              <div className="text-center">
                <div className="w-20 h-8 mx-auto border-b border-zinc-400 mb-1" />
                <span className="text-[11px] text-zinc-600 font-medium">Internal Auditor</span>
              </div>

              <div className="text-center">
                <div className="px-3 py-1 rounded-full border-2 border-dashed border-emerald-600 text-emerald-700 text-[10px] font-bold uppercase mb-1">
                  OFFICIAL TRUST SEAL
                </div>
                <span className="text-[11px] text-zinc-600 font-medium">Authorized Signatory</span>
              </div>

              <div className="text-center">
                <div className="w-24 h-8 mx-auto border-b border-zinc-400 mb-1" />
                <span className="text-[11px] text-zinc-900 font-bold block">Er. C. Shanmugasundaram</span>
                <span className="text-[10px] text-zinc-500">State Treasurer</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD NEW DONATION MODAL */}
      {isAddDonationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {language === 'en' ? 'Record New Member Donation' : 'புதிய நன்கொடை பதிவு செய்க'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDonationOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {language === 'en' ? 'Donor Full Name *' : 'நன்கொடையாளர் பெயர் *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. S. Murugesan Mudaliyar"
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Native Place (Sontha Oor)' : 'சொந்த ஊர்'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kanchipuram"
                    value={newDonation.nativePlaceOor}
                    onChange={(e) => setNewDonation({ ...newDonation, nativePlaceOor: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Gotram / Kulam' : 'கோத்திரம் / குலம்'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Agasthiya Gotram"
                    value={newDonation.gotramKulam}
                    onChange={(e) => setNewDonation({ ...newDonation, gotramKulam: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Donation Amount (₹) *' : 'நன்கொடைத் தொகை (₹) *'}
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono font-bold text-emerald-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {language === 'en' ? 'Payment Mode' : 'பணம் செலுத்திய முறை'}
                  </label>
                  <select
                    value={newDonation.paymentMode}
                    onChange={(e) => setNewDonation({ ...newDonation, paymentMode: e.target.value as PaymentMode })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="UPI">UPI (GPay / PhonePe)</option>
                    <option value="NEFT_RTGS">NEFT / RTGS Bank Transfer</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Cash">Direct Cash (Office Counter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {language === 'en' ? 'Contributed For Event / Cause *' : 'நன்கொடை வழங்கப்படும் நிகழ்வு *'}
                </label>
                <select
                  value={newDonation.eventId}
                  onChange={(e) => setNewDonation({ ...newDonation, eventId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                >
                  {eventsFinance.map((ef) => (
                    <option key={ef.id} value={ef.id}>
                      {language === 'en' ? ef.title : ef.titleTa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {language === 'en' ? 'Purpose Note (Optional)' : 'குறிப்பு / பயன்பாடு'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annadhanam sponsorship, Gold medal sponsorship..."
                  value={newDonation.purpose}
                  onChange={(e) => setNewDonation({ ...newDonation, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddDonationOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
                >
                  {language === 'en' ? 'Submit & Issue 80G Receipt' : 'பதிவு செய்து ரசீது வழங்குக'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD NEW CREDIT / DEBIT VOUCHER MODAL (Executive Admin & Super Admin Only) */}
      {isAddVoucherOpen && canEditAndExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'en' ? 'Record Credit / Debit Voucher (Audited)' : 'வரவு-செலவு வவுச்சர் பதிவு'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddVoucherOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Voucher Type</label>
                  <select
                    value={newVoucher.type}
                    onChange={(e) => setNewVoucher({ ...newVoucher, type: e.target.value as 'credit' | 'debit' })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                  >
                    <option value="debit">DEBIT</option>
                    <option value="credit">CREDIT</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newVoucher.amount}
                    onChange={(e) => setNewVoucher({ ...newVoucher, amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Associated Sangam Event</label>
                <select
                  value={newVoucher.eventId}
                  onChange={(e) => setNewVoucher({ ...newVoucher, eventId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                >
                  {eventsFinance.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {language === 'en' ? ev.title : ev.titleTa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Category (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stage Decoration"
                    value={newVoucher.category}
                    onChange={(e) => setNewVoucher({ ...newVoucher, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Category (Tamil)</label>
                  <input
                    type="text"
                    placeholder="எ.கா. மேடை அலங்காரம்"
                    value={newVoucher.categoryTa}
                    onChange={(e) => setNewVoucher({ ...newVoucher, categoryTa: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Voucher Description / Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={newVoucher.description}
                  onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                  placeholder="Detailed description for audit trail..."
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Vendor / Donor Party Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Balaji Audio & Video or Donor Name"
                  value={newVoucher.vendorOrDonor}
                  onChange={(e) => setNewVoucher({ ...newVoucher, vendorOrDonor: e.target.value })}
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>Audited By Authorized Officer:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {currentUserRole === 'super_admin' ? 'Super Admin' : 'Sangam Executive Admin'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer"
                >
                  Confirm & Commit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CREDIT / DEBIT VOUCHER MODAL (Executive Admin & Super Admin Only) */}
      {editingLedgerItem && canEditAndExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Voucher #{editingLedgerItem.voucherNo}</span>
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Authorized Admin Modification (Will recalculate surplus)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingLedgerItem(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucherEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Voucher Type</label>
                  <select
                    value={editingLedgerItem.type}
                    onChange={(e) =>
                      setEditingLedgerItem({
                        ...editingLedgerItem,
                        type: e.target.value as 'credit' | 'debit'
                      })
                    }
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                  >
                    <option value="debit">DEBIT</option>
                    <option value="credit">CREDIT</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingLedgerItem.amount}
                    onChange={(e) =>
                      setEditingLedgerItem({
                        ...editingLedgerItem,
                        amount: Number(e.target.value)
                      })
                    }
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Category (English)</label>
                  <input
                    type="text"
                    required
                    value={editingLedgerItem.category}
                    onChange={(e) =>
                      setEditingLedgerItem({
                        ...editingLedgerItem,
                        category: e.target.value
                      })
                    }
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Category (Tamil)</label>
                  <input
                    type="text"
                    value={editingLedgerItem.categoryTa || ''}
                    onChange={(e) =>
                      setEditingLedgerItem({
                        ...editingLedgerItem,
                        categoryTa: e.target.value
                      })
                    }
                    className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Description / Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={editingLedgerItem.description}
                  onChange={(e) =>
                    setEditingLedgerItem({
                      ...editingLedgerItem,
                      description: e.target.value
                    })
                  }
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Vendor / Donor Party</label>
                <input
                  type="text"
                  required
                  value={editingLedgerItem.vendorOrDonor}
                  onChange={(e) =>
                    setEditingLedgerItem({
                      ...editingLedgerItem,
                      vendorOrDonor: e.target.value
                    })
                  }
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Approved By (Audit Record)</label>
                <input
                  type="text"
                  required
                  value={editingLedgerItem.approvedBy}
                  onChange={(e) =>
                    setEditingLedgerItem({
                      ...editingLedgerItem,
                      approvedBy: e.target.value
                    })
                  }
                  className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingLedgerItem(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Voucher Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
