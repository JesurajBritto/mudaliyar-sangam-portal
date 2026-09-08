import React, { useState } from 'react';
import { ChecklistItem, Language } from '../types';
import { CHECKLIST_ITEMS } from '../data/checklistData';
import { CheckCircle2, AlertTriangle, Lightbulb, Copy, Check, Filter } from 'lucide-react';

interface PreChecklistProps {
  language: Language;
  searchQuery: string;
}

export const PreChecklist: React.FC<PreChecklistProps> = ({ language, searchQuery }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', labelEn: 'All Domains', labelTa: 'அனைத்தும்' },
    { id: 'demographics', labelEn: 'Demographics & Personas', labelTa: 'இலக்கு பயனர்கள்' },
    { id: 'features', labelEn: 'Core Features & MVP', labelTa: 'முக்கிய அம்சங்கள்' },
    { id: 'techstack', labelEn: 'Tech Stack (Web/Mobile/DB)', labelTa: 'தொழில்நுட்ப தேர்வு' },
    { id: 'security', labelEn: 'Security & DPDP 2023', labelTa: 'பாதுகாப்பு & DPDP' },
    { id: 'hosting', labelEn: 'Hosting & CI/CD', labelTa: 'ஹோஸ்டிங் & CI/CD' },
    { id: 'git', labelEn: 'Git & Version Control', labelTa: 'கிட் & குறியீடு நெறிமுறை' },
    { id: 'scalability', labelEn: 'Scalability & Caching', labelTa: 'அளவிடுதல் & வேகம்' },
    { id: 'uiux', labelEn: 'Mobile-First UI/UX', labelTa: 'மொபைல் வடிவமைப்பு' },
    { id: 'comms', labelEn: 'Team Protocols', labelTa: 'குழு தொடர்பு நெறிமுறை' },
    { id: 'legal', labelEn: 'Legal & Trust Deed', labelTa: 'சட்டவிதிகள் & அறக்கட்டளை' },
    { id: 'community', labelEn: 'Lineage & Taxonomy', labelTa: 'குலம் & சமூக நிர்வாகம்' },
    { id: 'matrimonial', labelEn: 'Matrimonial Privacy', labelTa: 'திருமண பாதுகாப்பு' },
    { id: 'payments', labelEn: 'Payments & 80G', labelTa: 'கட்டணம் & 80G' },
    { id: 'multilingual', labelEn: 'Tamil Localization', labelTa: 'தமிழ் மொழிமாற்றம்' },
  ];

  const filteredItems = CHECKLIST_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.titleTa.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.descriptionTa.toLowerCase().includes(query) ||
      item.deliverables.some((d) => d.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Calculate total deliverable checkboxes
  const allDeliverableKeys = CHECKLIST_ITEMS.flatMap((item, idx) =>
    item.deliverables.map((_, dIdx) => `${item.id}-${dIdx}`)
  );
  const completedCount = allDeliverableKeys.filter((k) => completedItems[k]).length;
  const progressPercent = Math.round((completedCount / (allDeliverableKeys.length || 1)) * 100);

  const toggleDeliverable = (key: string) => {
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyChecklistSummary = () => {
    const text = CHECKLIST_ITEMS.map((item, idx) => {
      const delivs = item.deliverables.map((d, dIdx) => {
        const isDone = completedItems[`${item.id}-${dIdx}`] ? '[x]' : '[ ]';
        return `   ${isDone} ${d}`;
      }).join('\n');
      return `${idx + 1}. [${item.importance.toUpperCase()}] ${item.title}\n${delivs}\n   Tip: ${item.tips}\n`;
    }).join('\n');

    navigator.clipboard.writeText(`MUDALIYAR SANGAM APP - PRE-DEVELOPMENT AUDIT CHECKLIST\nProgress: ${progressPercent}%\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Readiness Overview Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {language === 'en'
                  ? 'Pre-Development Readiness Audit Checklist'
                  : 'செயலி உருவாக்குவதற்கு முந்தைய தணிக்கைப் பட்டியல்'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                {progressPercent}% {language === 'en' ? 'Complete' : 'நிறைவு'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Mandatory legal, community taxonomy, matrimonial data privacy, SMS DLT registration, and payment gateway pre-requisites before writing application code.'
                : 'செயலியை உருவாக்கும் முன் முடிக்க வேண்டிய சட்ட, சமூகம், திருமண பாதுகாப்பு மற்றும் தொழில்நுட்ப தேவைகள்.'}
            </p>
          </div>

          <button
            id="copy-checklist-btn"
            type="button"
            onClick={copyChecklistSummary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-xs shrink-0 self-start sm:self-center"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (language === 'en' ? 'Copied' : 'நகலெடுக்கப்பட்டது') : (language === 'en' ? 'Copy Audit Report' : 'அறிக்கையை நகலெடு')}</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">
            <span>
              {completedCount} of {allDeliverableKeys.length} {language === 'en' ? 'statutory milestones verified' : 'மைல்கற்கள் சரிபார்க்கப்பட்டன'}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`cat-filter-${cat.id}`}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {language === 'en' ? cat.labelEn : cat.labelTa}
          </button>
        ))}
      </div>

      {/* Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const importanceBadge =
            item.importance === 'Critical'
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${importanceBadge}`}>
                    {item.importance}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {language === 'en' ? item.title : item.titleTa}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {language === 'en' ? item.description : item.descriptionTa}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-3.5 space-y-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {language === 'en' ? 'Required Pre-check Action Items:' : 'தேவையான சரிபார்ப்பு நடவடிக்கைகள்:'}
                  </div>
                  {item.deliverables.map((deliv, idx) => {
                    const key = `${item.id}-${idx}`;
                    const isChecked = !!completedItems[key];
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDeliverable(key)}
                          className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-zinc-300 dark:border-zinc-700"
                        />
                        <span className={`leading-snug transition-all ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}>
                          {deliv}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tips Callout */}
              <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400">
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span><strong className="font-semibold">{language === 'en' ? 'Architectural Recommendation:' : 'கட்டமைப்பு ஆலோசனை:'}</strong> {item.tips}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
