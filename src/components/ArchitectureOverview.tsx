import React from 'react';
import { Language } from '../types';
import { Smartphone, Server, Database, Cloud, Bell, CreditCard, Shield, Globe } from 'lucide-react';

interface ArchitectureOverviewProps {
  language: Language;
}

export const ArchitectureOverview: React.FC<ArchitectureOverviewProps> = ({ language }) => {
  const architecturalLayers = [
    {
      icon: <Smartphone className="w-5 h-5 text-indigo-600" />,
      name: 'Client Applications Mobile & Desktop',
      nameTa: 'பயனர் இடைமுகம் மொபைல் மற்றும் டெஸ்க்டாப்',
      description: 'Single unified TypeScript codebase supporting Progressive Web App (PWA) with offline caching and native app wrapper (React Native / Capacitor) for Android & iOS distribution.',
      specs: [
        'Responsive Tailwind CSS layout optimized for touch targets >= 44px on mobile',
        'Tamil & English i18n dictionary toggled instantly in user preferences without page reload',
        'System & manual Dark Mode toggle for improved accessibility in low-light environments',
        'Dynamic image watermarking canvas rendering for anti-scraping photo protection'
      ]
    },
    {
      icon: <Server className="w-5 h-5 text-amber-600" />,
      name: 'API Gateway & Application Server',
      nameTa: 'API நுழைவாயில் மற்றும் பயன்பாட்டு சேவையகம்',
      description: 'Node.js / Express or Fastify backend executing business logic, JWT authentication, and fine-grained RBAC authorization middleware.',
      specs: [
        'JWT Bearer tokens with 15-minute access token lifespan & rotating refresh tokens',
        'IP & Phone rate-limiting (express-rate-limit) to thwart credential stuffing and SMS pumping attacks',
        'Strict CORS policy & Helmet security headers (HSTS, CSP, X-Frame-Options)',
        'Webhook signature verifier for Razorpay / Cashfree real-time payment captures'
      ]
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-600" />,
      name: 'Encrypted Cloud Database & Storage',
      nameTa: 'குறியாக்கப்பட்ட கிளவுட் தரவுத்தளம் மற்றும் சேமிப்பகம்',
      description: 'Relational PostgreSQL engine hosted on managed Cloud SQL with AES-256 encryption at rest, Row-Level Security (RLS), and automated daily backups.',
      specs: [
        'Automated daily snapshot backups retained for 30 days with Point-In-Time Recovery (PITR)',
        'Redis cache layer for hot queries: live matrimonial search, top feed announcements, and event lists',
        'Private Object Storage (AWS S3 / Cloud Storage) with signed temporary URLs for sensitive ID documents',
        'Strict database audit logging on all administrative verification and member updates'
      ]
    },
    {
      icon: <Bell className="w-5 h-5 text-rose-600" />,
      name: 'Push Notifications & Indian DLT SMS Pipeline',
      nameTa: 'புஷ் அறிவிப்புகள் மற்றும் DLT SMS கட்டமைப்பு',
      description: 'Dual-channel broadcast system ensuring critical notifications (condolences, AGM notices, event reminders) reach every age group.',
      specs: [
        'Firebase Cloud Messaging (FCM) / Apple APNs for instant real-time app push notifications',
        'TRAI-compliant DLT SMS Gateway (ValueFirst / Gupshup / Jio) for mission-critical OTP logins',
        'Pre-approved DLT message templates in English and Tamil Unicode',
        'Topic-based broadcast queues allowing district-filtered community notices'
      ]
    },
    {
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      name: 'Recurring Subscriptions & 80G Tax Invoicing',
      nameTa: 'தொடர் சந்தா மற்றும் 80G வரிவிலக்கு ரசீதுகள்',
      description: 'Compliant payment flow supporting UPI AutoPay, e-mandates, and automated PDF donation receipt dispatching.',
      specs: [
        'Razorpay Subscriptions / Cashfree recurring e-mandates for annual and matrimonial premium tiers',
        'Serverless PDF generator generating Income Tax Form 10BE / 80G compliant donation receipts',
        'Automated WhatsApp and Email delivery of transaction vouchers to donors and members',
        'Immutable double-entry payment transaction log for annual Sangam auditor review'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {language === 'en'
              ? 'Full-Stack Cloud Architecture & Security Flow'
              : 'முழுமையான கிளவுட் கட்டமைப்பு மற்றும் பாதுகாப்பு ஓட்டம்'}
          </h2>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1 max-w-2xl">
          {language === 'en'
            ? 'Production engineering blueprint ensuring 99.9% uptime, zero data leaks, mobile-first responsiveness, and rapid matrimonial search latency (<100ms).'
            : '99.9% இயக்க நேரம், தரவு கசிவு இல்லாத பாதுகாப்பு மற்றும் மொபைல் வேகத்திற்கான தொழில்முறை கட்டமைப்பு.'}
        </p>
      </div>

      {/* Layer Cards */}
      <div className="space-y-4">
        {architecturalLayers.map((layer, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                {layer.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {language === 'en' ? layer.name : layer.nameTa}
                  </h3>
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
                    LAYER 0{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mb-3 leading-relaxed">
                  {layer.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  {layer.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-zinc-800 dark:text-zinc-200">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Backup & Disaster Recovery Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/50">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            {language === 'en'
              ? 'Backup, Disaster Recovery & High Availability Specification'
              : 'காப்புப் பிரதி, அவசர மீட்பு மற்றும் தொடர் இயக்க விவரக்குறிப்பு'}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-800 dark:text-emerald-200/90 mt-2">
          <div className="p-3 bg-white/80 dark:bg-zinc-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Automated Daily Snapshots</div>
            <div className="text-zinc-700 dark:text-zinc-300">Full database snapshot taken automatically at 02:00 IST daily with 30-day rolling retention.</div>
          </div>
          <div className="p-3 bg-white/80 dark:bg-zinc-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Point-in-Time Recovery (PITR)</div>
            <div className="text-zinc-700 dark:text-zinc-300">WAL log archiving allows restoring the database state to any specific minute within the last 7 days.</div>
          </div>
          <div className="p-3 bg-white/80 dark:bg-zinc-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Cold Storage Geographic Replica</div>
            <div className="text-zinc-700 dark:text-zinc-300">Weekly encrypted database dump replicated to an isolated secondary cloud storage region.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
