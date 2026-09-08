import React, { useState } from 'react';
import {
  Repeat,
  ShieldCheck,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  IndianRupee,
  Pause,
  Play,
  XCircle,
  HelpCircle,
  FileCheck,
  QrCode
} from 'lucide-react';
import { Language, MonthlyAutoPayMandate } from '../types';
import { INITIAL_AUTOPAY_MANDATES, AUTOPAY_QUICK_PRESETS } from '../data/autoPayData';

interface AutoPayMandatesSectionProps {
  language: Language;
}

export const AutoPayMandatesSection: React.FC<AutoPayMandatesSectionProps> = ({ language }) => {
  const [mandates, setMandates] = useState<MonthlyAutoPayMandate[]>(INITIAL_AUTOPAY_MANDATES);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Mandate Form State
  const [form, setForm] = useState({
    memberName: 'Er. S. Karthikeyan Mudaliyar',
    memberCode: 'MUD-CHN-2024-0012',
    phone: '+91 98401 22345',
    monthlyAmount: 100, // Minimum monthly amount is 100
    cause: 'Youth Education & Career Scholarship Fund',
    paymentMethod: 'UPI AutoPay (Google Pay / PhonePe / Paytm)' as const,
    debitDayOfMonth: 5
  });

  const totalMonthlyRecurring = mandates
    .filter((m) => m.status === 'active')
    .reduce((sum, m) => sum + m.monthlyAmount, 0);

  const handlePresetClick = (amount: number) => {
    setForm({ ...form, monthlyAmount: amount });
  };

  const handleCreateMandate = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.monthlyAmount < 100) {
      alert(
        language === 'en'
          ? 'Minimum monthly recurring amount is ₹100 as per Sangam Auto-Pay bylaws.'
          : 'சங்க விதிகளின்படி குறைந்தபட்ச மாதாந்திர தானியங்கி சந்தா தொகை ₹100 ஆகும்.'
      );
      return;
    }

    const newMandate: MonthlyAutoPayMandate = {
      id: `mandate-${Date.now().toString().slice(-4)}`,
      mandateRef: `UMRN-MUD-${Math.floor(100000000 + Math.random() * 900000000)}`,
      donorName: form.memberName,
      donorNameTa: form.memberName,
      memberCode: form.memberCode,
      phone: form.phone,
      monthlyAmount: Number(form.monthlyAmount),
      cause: 'education_scholarship',
      causeTa: form.cause,
      paymentMethod: 'UPI_AUTOPAY',
      debitDayOfMonth: form.debitDayOfMonth,
      nextDebitDate: `0${form.debitDayOfMonth}-Oct-2026`,
      status: 'active',
      startedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalDebitedSoFar: Number(form.monthlyAmount),
      monthsContributedCount: 1
    };

    setMandates([newMandate, ...mandates]);
    setIsModalOpen(false);
    setToastMessage(
      language === 'en'
        ? `Monthly Auto-Pay mandate of ₹${newMandate.monthlyAmount}/mo activated successfully with NPCI UMRN: ${newMandate.mandateRef}`
        : `மாதாந்திர ₹${newMandate.monthlyAmount} தானியங்கி கட்டணம் வெற்றிகரமாக செயல்படுத்தப்பட்டது!`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleToggleStatus = (id: string) => {
    setMandates((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'active' ? 'paused' : 'active';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleCancelMandate = (id: string) => {
    if (confirm('Are you sure you want to cancel this monthly auto-pay mandate?')) {
      setMandates((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'cancelled' } : m))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Instructions */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-cyan-600/10 border border-emerald-300 dark:border-emerald-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Repeat className="w-5 h-5" />
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                {language === 'en'
                  ? 'Monthly Auto-Pay Recurring Contribution - Min ₹100'
                  : 'மாதாந்திர தானியங்கி சந்தா & நன்கொடை திட்டம் (குறைந்தபட்சம் ₹100)'}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Members can subscribe to automated monthly contributions starting from a minimum of ₹100/month via UPI AutoPay or e-NACH mandate. Supports student scholarships, temple renovation, and senior citizen emergency care.'
                : 'சங்க உறுப்பினர்கள் குறைந்தபட்சம் ₹100 முதல் மாதாந்திர தானியங்கி சந்தா (UPI AutoPay / e-NACH) மூலம் மாணவர் கல்வி நிதி மற்றும் திருக்கோயில் திருப்பணிகளுக்கு பங்களிக்கலாம்.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'en' ? 'Setup Monthly Auto-Pay (Min ₹100)' : 'தானியங்கி சந்தா அமைக்க'}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Active Monthly Mandates</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            {mandates.filter((m) => m.status === 'active').length} Members
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Automated NPCI / UPI Processing
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Monthly Recurring Inflow</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalMonthlyRecurring.toLocaleString('en-IN')}/mo
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Credited on 5th of every month
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Statutory Tax Benefit</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            80G Eligible
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Automated Annual Tax Certificate issued
          </span>
        </div>
      </div>

      {/* Mandates Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Registered Auto-Pay Mandates ({mandates.length})</span>
          </h4>
          <span className="text-[11px] text-zinc-400 font-mono">Min ₹100 per member mandate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-3 px-4 font-semibold">Member / Code</th>
                <th className="py-3 px-4 font-semibold">Monthly Amount</th>
                <th className="py-3 px-4 font-semibold">Dedicated Cause</th>
                <th className="py-3 px-4 font-semibold">Payment Mode & UMRN</th>
                <th className="py-3 px-4 font-semibold">Next Debit</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {mandates.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      {language === 'ta' && item.donorNameTa ? item.donorNameTa : item.donorName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">{item.memberCode}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{item.monthlyAmount.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium block truncate">
                      {language === 'ta' && item.causeTa ? item.causeTa : item.causeTa || item.cause}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 block text-[11px]">
                      {item.paymentMethod.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-400 block">{item.mandateRef}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400 font-medium">
                    {item.nextDebitDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'paused'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                    {item.status !== 'cancelled' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300"
                        >
                          {item.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelMandate(item.id)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-zinc-400 text-[11px]">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Setup Auto-Pay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Setup Monthly Auto-Pay Mandate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMandate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Member Full Name & Code*
                </label>
                <input
                  type="text"
                  required
                  value={form.memberName}
                  onChange={(e) => setForm({ ...form, memberName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold"
                />
              </div>

              {/* Monthly Amount with Minimum 100 Validation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Monthly Auto-Pay Amount (₹)* (Minimum ₹100)
                  </label>
                  <span className="text-emerald-600 font-bold">Min: ₹100 / mo</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={form.monthlyAmount}
                    onChange={(e) => setForm({ ...form, monthlyAmount: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-emerald-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-base"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Quick Presets:</span>
                  {AUTOPAY_QUICK_PRESETS.map((preset) => (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handlePresetClick(preset.amount)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        form.monthlyAmount === preset.amount
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      ₹{preset.amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cause Dropdown */}
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Dedicated Welfare Cause*
                </label>
                <select
                  value={form.cause}
                  onChange={(e) => setForm({ ...form, cause: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                >
                  <option value="Sangam Youth Education & Merit Scholarship">
                    Sangam Youth Education & Merit Scholarship
                  </option>
                  <option value="Temple Renovation & Nithya Annadhanam Trust">
                    Temple Renovation & Nithya Annadhanam
                  </option>
                  <option value="Senior Citizen Medical Support & Old Age Welfare">
                    Senior Citizen Medical Support
                  </option>
                  <option value="General Sangam Welfare Corpus Reserve">
                    General Sangam Welfare Corpus
                  </option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Recurring Mandate Method*
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                >
                  <option value="UPI AutoPay (Google Pay / PhonePe / Paytm)">
                    UPI AutoPay (Google Pay, PhonePe, Paytm, BHIM)
                  </option>
                  <option value="e-NACH NetBanking Mandate">
                    e-NACH NetBanking Mandate (HDFC, SBI, ICICI, Canara, Indian Bank)
                  </option>
                  <option value="Debit Card Standing Instruction">
                    Debit Card Standing Instruction (RuPay / Visa / Mastercard)
                  </option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                ℹ️ <strong>Auto-Debit Guarantee:</strong> Your selected payment mode will be debited ₹{form.monthlyAmount} on the 5th of every month. You can pause or cancel the mandate anytime directly from this dashboard.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Confirm Auto-Pay (₹{form.monthlyAmount}/mo)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
