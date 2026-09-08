import React, { useState, useRef } from 'react';
import {
  GitBranch,
  Users,
  PlusCircle,
  Search,
  CheckCircle2,
  Camera,
  Upload,
  Cake,
  Bell,
  Plus,
  Minus,
  Sparkles,
  Send
} from 'lucide-react';
import { Language, FamilyTreeNode } from '../types';
import { INITIAL_FAMILY_TREE_NODES } from '../data/familyTreeData';
import { ModuleTopNav } from './ModuleTopNav';

interface FamilyTreeViewerProps {
  language: Language;
  onBackToHome?: () => void;
}

export const FamilyTreeViewer: React.FC<FamilyTreeViewerProps> = ({ language, onBackToHome }) => {
  const [nodes, setNodes] = useState<FamilyTreeNode[]>(INITIAL_FAMILY_TREE_NODES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<FamilyTreeNode | null>(null);

  // State for folded/expanded branches: map of parentId or branchId -> boolean (true = expanded, false = folded)
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    root: true,
    'fam-gen1-01': true,
    'fam-gen2-01': true,
    'fam-gen3-01': true,
    'fam-gen4-01': true
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState<boolean>(false);
  const [uploadTargetNode, setUploadTargetNode] = useState<FamilyTreeNode | null>(null);

  // Active sub-view toggle
  const [activeTab, setActiveTab] = useState<'tree' | 'notifications'>('tree');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File input ref for direct photo uploads
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  // Add Member Form State
  const [addForm, setAddForm] = useState({
    fullName: '',
    fullNameTa: '',
    relation: 'Child / Son',
    parentId: 'fam-gen4-01',
    birthYear: '2024',
    birthDate: '2024-05-15',
    isDeceased: false,
    deathDate: '',
    gender: 'male' as 'male' | 'female',
    kulamGotram: 'Agasthiya Gotram',
    nativePlaceOor: 'Kanchipuram',
    kulaDeivamTemple: 'Sri Vaitheeswaran Kovil',
    occupation: 'Student',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bioNotes: ''
  });

  // Toggle Branch Fold/Expand
  const toggleBranch = (branchKey: string) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [branchKey]: !prev[branchKey]
    }));
  };

  // Expand or fold all
  const expandAllBranches = () => {
    setExpandedBranches({
      root: true,
      'fam-gen1-01': true,
      'fam-gen2-01': true,
      'fam-gen3-01': true,
      'fam-gen4-01': true
    });
    setToastMessage('All family tree branches expanded.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const foldAllBranches = () => {
    setExpandedBranches({
      root: true,
      'fam-gen1-01': false,
      'fam-gen2-01': false,
      'fam-gen3-01': false,
      'fam-gen4-01': false
    });
    setToastMessage('All family branches folded cleanly.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Image Upload Handling (supports local file upload with FileReader)
  const handleTriggerUpload = (node: FamilyTreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadTargetNode(node);
    setIsPhotoUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetNode) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setNodes((prev) =>
            prev.map((n) => (n.id === uploadTargetNode.id ? { ...n, photoUrl: dataUrl } : n))
          );
          setIsPhotoUploadModalOpen(false);
          setToastMessage(`Updated photo for ${uploadTargetNode.fullName}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhotoUrl = () => {
    if (customPhotoUrl && uploadTargetNode) {
      setNodes((prev) =>
        prev.map((n) => (n.id === uploadTargetNode.id ? { ...n, photoUrl: customPhotoUrl } : n))
      );
      setCustomPhotoUrl('');
      setIsPhotoUploadModalOpen(false);
      setToastMessage(`Updated photo for ${uploadTargetNode.fullName}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Adding a Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName) return;

    const parent = nodes.find((n) => n.id === addForm.parentId);
    const parentGen = parent ? parent.generation : 4;
    const isChild = addForm.relation.toLowerCase().includes('son') ||
      addForm.relation.toLowerCase().includes('daughter') ||
      addForm.relation.toLowerCase().includes('child');

    const newNode: FamilyTreeNode = {
      id: `fam-node-${Date.now().toString().slice(-5)}`,
      fullName: addForm.fullName,
      fullNameTa: addForm.fullNameTa || addForm.fullName,
      generation: parentGen + 1,
      relation: addForm.relation,
      birthYear: addForm.birthYear || '2024',
      birthDate: addForm.birthDate,
      isDeceased: addForm.isDeceased,
      deathDate: addForm.isDeceased ? addForm.deathDate : undefined,
      gender: addForm.gender,
      kulamGotram: addForm.kulamGotram,
      nativePlaceOor: addForm.nativePlaceOor,
      kulaDeivamTemple: addForm.kulaDeivamTemple,
      occupation: addForm.occupation,
      bioNotes: addForm.bioNotes,
      photoUrl: addForm.photoUrl,
      parentId: addForm.parentId
    };

    // Update parent's childrenIds if applicable
    const updatedNodes = nodes.map((n) => {
      if (n.id === addForm.parentId) {
        return {
          ...n,
          childrenIds: [...(n.childrenIds || []), newNode.id]
        };
      }
      return n;
    });

    setNodes([...updatedNodes, newNode]);
    // Ensure parent's branch is expanded
    setExpandedBranches((prev) => ({ ...prev, [addForm.parentId]: true }));

    setIsAddModalOpen(false);
    setToastMessage(`Added ${addForm.fullName} to the Family Genealogical Tree!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Notification Generator for Birthdays & Death Anniversaries
  const getUpcomingEvents = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12

    const events: {
      type: 'birthday' | 'death_anniversary';
      node: FamilyTreeNode;
      dateFormatted: string;
      title: string;
      daysRemaining: number;
    }[] = [];

    nodes.forEach((n) => {
      // Check Birthday for living members
      if (!n.isDeceased && n.birthDate) {
        const parts = n.birthDate.split('-');
        const month = Number(parts[1] || parts[0]);
        const day = Number(parts[2] || parts[1] || 15);
        const eventMonthDiff = (month - currentMonth + 12) % 12;
        events.push({
          type: 'birthday',
          node: n,
          dateFormatted: `${month}/${day} (Born ${n.birthYear})`,
          title: `Birthday: ${n.fullName}`,
          daysRemaining: eventMonthDiff * 30 + Math.abs(day - today.getDate())
        });
      }

      // Check Death Anniversary
      if (n.isDeceased && n.deathDate) {
        const parts = n.deathDate.split('-');
        const month = Number(parts[1] || parts[0]);
        const day = Number(parts[2] || parts[1] || 15);
        const eventMonthDiff = (month - currentMonth + 12) % 12;
        events.push({
          type: 'death_anniversary',
          node: n,
          dateFormatted: `${month}/${day} Tithi`,
          title: `Memorial Tithi: ${n.fullName}`,
          daysRemaining: eventMonthDiff * 30 + Math.abs(day - today.getDate())
        });
      }
    });

    return events.sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  const upcomingEvents = getUpcomingEvents();

  const handleSendFamilyNotification = () => {
    setToastMessage(
      'Notification sent to all family members via WhatsApp & SMS! Reminders delivered.'
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Search filter
  const query = searchTerm.trim().toLowerCase();
  const searchMatchingIds = query
    ? nodes
        .filter(
          (n) =>
            n.fullName.toLowerCase().includes(query) ||
            n.fullNameTa.toLowerCase().includes(query) ||
            n.relation.toLowerCase().includes(query) ||
            n.nativePlaceOor.toLowerCase().includes(query) ||
            n.kulamGotram.toLowerCase().includes(query)
        )
        .map((n) => n.id)
    : null;

  // Nodes lookups by generation
  const gen1GreatGrandparents = nodes.filter((n) => n.generation === 1);
  const gen2Grandparents = nodes.filter((n) => n.generation === 2);
  const gen3Parents = nodes.filter((n) => n.generation === 3);
  const gen4SelfAndSiblings = nodes.filter((n) => n.generation === 4);
  const gen5Children = nodes.filter((n) => n.generation === 5);

  // Helper renderer for a Member Portrait Node in the tree (styled after reference image)
  const renderMemberCard = (node: FamilyTreeNode, showActions: boolean = true) => {
    const isSearchMatch = searchMatchingIds ? searchMatchingIds.includes(node.id) : true;

    return (
      <div
        key={node.id}
        onClick={() => setSelectedNode(node)}
        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
          isSearchMatch ? 'opacity-100' : 'opacity-35 scale-95'
        }`}
      >
        {/* Avatar Ring with Image & Upload Trigger */}
        <div className="relative">
          <div
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 border-3 shadow-md transition-transform group-hover:scale-105 bg-white dark:bg-zinc-800 ${
              node.generation === 4
                ? 'border-emerald-500 ring-3 ring-emerald-300/50'
                : node.isDeceased
                ? 'border-amber-600/80 dark:border-amber-500/80'
                : 'border-teal-500 dark:border-teal-400'
            }`}
          >
            {node.photoUrl ? (
              <img
                src={node.photoUrl}
                alt={node.fullName}
                className="w-full h-full rounded-full object-cover shadow-inner"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                <Users className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Quick Upload Button on Hover/Mobile */}
          <button
            type="button"
            onClick={(e) => handleTriggerUpload(node, e)}
            title="Upload member image"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-2 border-white dark:border-zinc-900 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Deceased Memorial Garland Badge */}
          {node.isDeceased && (
            <span
              title="Late / அமரர் (Memorial Tithi tracked)"
              className="absolute top-0 right-0 px-1 py-0.5 rounded-full text-[9px] font-black bg-amber-600 text-white shadow-xs"
            >
              Late
            </span>
          )}
        </div>

        {/* Reference Image Style Ribbon Banner under Portrait */}
        <div className="mt-2 text-center max-w-[130px] sm:max-w-[150px]">
          <div className="relative px-2.5 py-1 rounded-lg bg-teal-600 dark:bg-teal-700 text-white shadow-sm border-t border-teal-400">
            <h4 className="text-[11px] font-bold leading-tight truncate">
              {language === 'en' ? node.fullName.replace(/Mudaliyar|CA|Er\.|Dr\./g, '').trim() : node.fullNameTa}
            </h4>
          </div>

          {/* Relation Tag */}
          <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-300 block mt-0.5 truncate">
            {node.relation.split('(')[0]}
          </span>
          <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block">
            {node.birthYear} {node.isDeceased ? '• (Late)' : ''}
          </span>
        </div>

        {/* Quick Add Child/Spouse Action */}
        {showActions && (
          <div className="mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAddForm({
                  ...addForm,
                  parentId: node.id,
                  relation: 'Child'
                });
                setIsAddModalOpen(true);
              }}
              title="Add family details under this member"
              className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-emerald-100 text-zinc-700 hover:text-emerald-800 dark:bg-zinc-800 dark:text-zinc-300 text-[10px] font-bold flex items-center gap-1 border border-zinc-200 dark:border-zinc-700"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for real picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Family Genealogical Tree"
        moduleNameTa="வம்சாவளி குடும்ப மரம்"
        badgeEn="Genealogy & Ancestral Lineage"
        badgeTa="தலைமுறை வரைபடம்"
        subtitleEn="Visual generational lineage, portrait uploads, and ancestral family milestone notifications."
        subtitleTa="குடும்ப தலைமுறை வரைபடம், புகைப்படப் பதிவேற்றம் மற்றும் திதி/பிறந்தநாள் அறிவிப்புகள்."
        themeColor="emerald"
        icon={GitBranch}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Card (Emerald / Forest Green Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 border border-emerald-200/90 shadow-[0_4px_24px_rgba(5,150,105,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight flex items-center gap-2">
                  <span>{language === 'en' ? 'Family Genealogical Tree' : 'வம்சாவளி குடும்ப மரம்'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {language === 'en' ? 'Interactive Tree Model' : 'மர வடிவம்'}
                  </span>
                </h2>
                <span className="text-xs text-emerald-700 font-bold block">
                  {language === 'en'
                    ? 'Visual hierarchical lineage, member portrait uploads, and family milestone notifications'
                    : 'குடும்ப வம்சாவளி மரம், புகைப்பட பதிவேற்றம் & பிறந்தநாள்/நினைவு நாள் அறிவிப்புகள்'}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
              {language === 'en'
                ? 'Expand with (+) or fold with (-) to explore branches. Upload member photos, receive birthday & memorial tithi notifications for all relatives, and track ancestral lineage.'
                : 'குடும்ப உறுப்பினர்களின் புகைப்படங்களை பதிவேற்றலாம். கிளைகளை விரிக்க (+) அல்லது மடக்க (-) பயன்படுத்தவும். பிறந்தநாள்/திதி நினைவூட்டல் அறிவிப்புகள்.'}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Add Family Member' : 'உறுப்பினரைச் சேர்க்க'}</span>
            </button>
          </div>
        </div>

        {/* Tree Control Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-600 font-bold">{language === 'en' ? 'Tree Controls:' : 'மரம் கட்டுப்பாடு:'}</span>
            <button
              type="button"
              onClick={expandAllBranches}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-stone-700 font-bold flex items-center gap-1 hover:bg-emerald-50 cursor-pointer text-xs shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'en' ? 'Expand All (+)' : 'அனைத்தும் விரி (+) '}</span>
            </button>
            <button
              type="button"
              onClick={foldAllBranches}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-stone-700 font-bold flex items-center gap-1 hover:bg-emerald-50 cursor-pointer text-xs shadow-2xs"
            >
              <Minus className="w-3.5 h-3.5 text-stone-600" />
              <span>{language === 'en' ? 'Fold All (-)' : 'அனைத்தும் மடக்கு (-) '}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span>{nodes.length} {language === 'en' ? 'Registered Relatives' : 'பதிவு செய்யப்பட்ட உறவினர்கள்'}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              {upcomingEvents.length} {language === 'en' ? 'Upcoming Milestones' : 'நிகழ்வுகள்'}
            </span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-teal-700 dark:text-teal-300 text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4 text-teal-600" />
            <span>Family Tree Model</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Birthday & Death Day Notifications</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {upcomingEvents.length}
            </span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <input
            type="text"
            placeholder="Search relative by name or native..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
      </div>

      {/* VIEW 1: THE VISUAL TREE MODEL (Matches Reference Image) */}
      {activeTab === 'tree' && (
        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-teal-50/40 via-white to-teal-50/30 dark:from-zinc-900/60 dark:via-zinc-900/90 dark:to-zinc-900/60 border border-teal-200/80 dark:border-teal-900/50 shadow-inner overflow-x-auto min-w-[700px]">
          {/* Decorative Top Title Ribbon (Matches Shutterstock reference layout) */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative px-8 py-2 rounded-full bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 text-white shadow-lg border-2 border-teal-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-black uppercase tracking-widest">
                Family Tree
              </span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-[11px] text-teal-800 dark:text-teal-400 font-bold mt-1">
              Ancestral Lineage & Living Generations
            </span>
          </div>

          {/* LEVEL 1: GREAT-GRANDPARENTS (Ancestral Patriarch & Matriarch) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-8 sm:gap-14 relative pb-4">
              {gen1GreatGrandparents.map((ancestor) => renderMemberCard(ancestor))}

              {/* Horizontal Marriage Connector Line between couple */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-0.5 bg-teal-400 dark:bg-teal-600 -z-0" />
            </div>

            {/* Vertical Connector Line to Next Level with Toggle */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />

              {/* Expand (+) / Fold (-) Toggle Button */}
              <button
                type="button"
                onClick={() => toggleBranch('fam-gen1-01')}
                title={expandedBranches['fam-gen1-01'] ? 'Fold branch (-)' : 'Expand branch (+)'}
                className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-zinc-900 z-10 cursor-pointer transition-transform hover:scale-110"
              >
                {expandedBranches['fam-gen1-01'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>

              <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />
            </div>
          </div>

          {/* LEVEL 2: GRANDPARENTS GENERATION (Rendered if expanded) */}
          {expandedBranches['fam-gen1-01'] ? (
            <div className="flex flex-col items-center animate-in fade-in">
              {/* Horizontal Branch Bar spanning across siblings/couples */}
              <div className="w-3/4 max-w-2xl h-0.5 bg-teal-400 dark:bg-teal-600" />

              <div className="flex items-start justify-around w-full max-w-3xl pt-4 pb-4">
                {/* Grandparents Couple */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                  <div className="flex items-center gap-6 relative">
                    {gen2Grandparents.slice(0, 2).map((gp) => renderMemberCard(gp))}
                    {/* Marriage Line */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-teal-400 -z-0" />
                  </div>
                </div>

                {/* Grand-Uncle Branch */}
                {gen2Grandparents.length > 2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                    {renderMemberCard(gen2Grandparents[2])}
                  </div>
                )}
              </div>

              {/* Vertical Connector Line to Parents Generation with Toggle */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />

                <button
                  type="button"
                  onClick={() => toggleBranch('fam-gen2-01')}
                  title={expandedBranches['fam-gen2-01'] ? 'Fold branch (-)' : 'Expand branch (+)'}
                  className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-zinc-900 z-10 cursor-pointer transition-transform hover:scale-110"
                >
                  {expandedBranches['fam-gen2-01'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>

                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-[11px] text-zinc-400 font-semibold italic">
                Grandparents & subsequent lineage folded. Click (+) to expand.
              </span>
            </div>
          )}

          {/* LEVEL 3: PARENTS GENERATION (Rendered if expanded) */}
          {expandedBranches['fam-gen1-01'] && expandedBranches['fam-gen2-01'] ? (
            <div className="flex flex-col items-center animate-in fade-in">
              {/* Horizontal Branch Bar */}
              <div className="w-4/5 max-w-3xl h-0.5 bg-teal-400 dark:bg-teal-600" />

              <div className="flex items-start justify-around w-full max-w-4xl pt-4 pb-4">
                {/* Parents Couple */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                  <div className="flex items-center gap-6 relative">
                    {gen3Parents.slice(0, 2).map((p) => renderMemberCard(p))}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-teal-400 -z-0" />
                  </div>
                </div>

                {/* Uncle Branch */}
                {gen3Parents.length > 2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                    {renderMemberCard(gen3Parents[2])}
                  </div>
                )}
              </div>

              {/* Vertical Connector to Current Generation with Toggle */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />

                <button
                  type="button"
                  onClick={() => toggleBranch('fam-gen3-01')}
                  title={expandedBranches['fam-gen3-01'] ? 'Fold branch (-)' : 'Expand branch (+)'}
                  className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-zinc-900 z-10 cursor-pointer transition-transform hover:scale-110"
                >
                  {expandedBranches['fam-gen3-01'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>

                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />
              </div>
            </div>
          ) : null}

          {/* LEVEL 4: SELF, SPOUSE, & SIBLINGS (Rendered if expanded) */}
          {expandedBranches['fam-gen1-01'] &&
          expandedBranches['fam-gen2-01'] &&
          expandedBranches['fam-gen3-01'] ? (
            <div className="flex flex-col items-center animate-in fade-in">
              <div className="w-4/5 max-w-3xl h-0.5 bg-teal-400 dark:bg-teal-600" />

              <div className="flex items-start justify-around w-full max-w-4xl pt-4 pb-4">
                {/* Self and Spouse */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                  <div className="flex items-center gap-6 relative">
                    {gen4SelfAndSiblings.slice(0, 2).map((s) => renderMemberCard(s))}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-teal-400 -z-0" />
                  </div>
                </div>

                {/* Sibling */}
                {gen4SelfAndSiblings.length > 2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-teal-400 dark:bg-teal-600 -mt-4 mb-2" />
                    {renderMemberCard(gen4SelfAndSiblings[2])}
                  </div>
                )}
              </div>

              {/* Vertical Connector to Children Generation with Toggle */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />

                <button
                  type="button"
                  onClick={() => toggleBranch('fam-gen4-01')}
                  title={expandedBranches['fam-gen4-01'] ? 'Fold children branch (-)' : 'Expand children branch (+)'}
                  className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-zinc-900 z-10 cursor-pointer transition-transform hover:scale-110"
                >
                  {expandedBranches['fam-gen4-01'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>

                <div className="w-0.5 h-6 bg-teal-400 dark:bg-teal-600" />
              </div>
            </div>
          ) : null}

          {/* LEVEL 5: CHILDREN GENERATION */}
          {expandedBranches['fam-gen1-01'] &&
          expandedBranches['fam-gen2-01'] &&
          expandedBranches['fam-gen3-01'] &&
          expandedBranches['fam-gen4-01'] ? (
            <div className="flex flex-col items-center animate-in fade-in pb-4">
              <div className="w-2/3 max-w-xl h-0.5 bg-teal-400 dark:bg-teal-600" />

              <div className="flex items-center justify-center gap-8 pt-4">
                {/* Existing Children */}
                {gen5Children.map((child) => renderMemberCard(child))}

                {/* "+ Add Child" Slot in the Tree */}
                <div
                  onClick={() => {
                    setAddForm({
                      ...addForm,
                      parentId: 'fam-gen4-01',
                      relation: 'Daughter / Child'
                    });
                    setIsAddModalOpen(true);
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-teal-400 dark:border-teal-600 flex flex-col items-center justify-center bg-teal-50/50 dark:bg-teal-950/30 group-hover:bg-teal-100 transition-all text-teal-700 dark:text-teal-300">
                    <Plus className="w-6 h-6 mb-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-[9px] font-bold">Add Child</span>
                  </div>
                  <span className="text-[10px] font-semibold text-teal-700 mt-1">
                    New Family Entry
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* VIEW 2: BIRTHDAY AND DEATH DAY NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-teal-500/10 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Family Milestone Reminders
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Automated birthday wishes and ancestral memorial tithi notifications for all registered relatives.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendFamilyNotification}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Notify All Family Members</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((evt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-3xl border shadow-xs flex items-center justify-between gap-3 ${
                  evt.type === 'birthday'
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0">
                    <img
                      src={evt.node.photoUrl}
                      alt={evt.node.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      {evt.type === 'birthday' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider flex items-center gap-1">
                          <Cake className="w-2.5 h-2.5" /> Birthday
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1">
                          Remembrance Tithi
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-bold">
                        {evt.daysRemaining === 0 ? 'Today!' : `in ${evt.daysRemaining} days`}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">
                      {evt.node.fullName}
                    </h4>
                    <span className="text-[11px] text-zinc-500 block">
                      {evt.dateFormatted} • {evt.node.relation}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setToastMessage(`Sent greeting notification for ${evt.node.fullName}!`);
                    setTimeout(() => setToastMessage(null), 4000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 cursor-pointer whitespace-nowrap"
                >
                  {evt.type === 'birthday' ? 'Send Wishes' : 'Tribute'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NODE DETAIL MODAL */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-teal-500 shadow-md">
                  {selectedNode.photoUrl ? (
                    <img
                      src={selectedNode.photoUrl}
                      alt={selectedNode.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-700">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-teal-600 block uppercase tracking-wider">
                    {selectedNode.relation}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? selectedNode.fullName : selectedNode.fullNameTa}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Born: {selectedNode.birthYear} {selectedNode.isDeceased && '• Late'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                <p><strong>Gotram & Kulam:</strong> {selectedNode.kulamGotram}</p>
                <p><strong>Kula Deivam:</strong> {selectedNode.kulaDeivamTemple}</p>
                <p><strong>Native Town:</strong> {selectedNode.nativePlaceOor}</p>
                <p><strong>Occupation:</strong> {selectedNode.occupation}</p>
                {selectedNode.birthDate && <p><strong>Birthday:</strong> {selectedNode.birthDate}</p>}
                {selectedNode.deathDate && <p><strong>Remembrance Tithi:</strong> {selectedNode.deathDate}</p>}
              </div>

              {selectedNode.bioNotes && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-200">
                  <span className="font-bold block mb-1">Ancestral & Family Notes:</span>
                  <p className="text-[11px] leading-relaxed">{selectedNode.bioNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={(e) => handleTriggerUpload(selectedNode, e)}
                className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO UPLOAD MODAL */}
      {isPhotoUploadModalOpen && uploadTargetNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Upload Member Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPhotoUploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-teal-500 shadow-md">
                <img
                  src={uploadTargetNode.photoUrl}
                  alt={uploadTargetNode.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  {uploadTargetNode.fullName}
                </h4>
                <p className="text-[11px] text-zinc-500">{uploadTargetNode.relation}</p>
              </div>

              {/* Upload Option 1: File from Computer/Phone */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (Local Upload)</span>
                </button>
              </div>

              {/* Upload Option 2: Image URL */}
              <div className="pt-2 space-y-2 text-left">
                <label className="text-[10px] font-bold text-zinc-400 block">
                  Or Paste Photo Web URL:
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <button
                  type="button"
                  onClick={handleSavePhotoUrl}
                  disabled={!customPhotoUrl}
                  className="w-full py-2 rounded-xl bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
                >
                  Apply Photo URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                <span>Add Member to Family Tree</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Full Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master K. Shanmuga Priyan"
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Relation*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Son / Daughter / Spouse / Sibling"
                    value={addForm.relation}
                    onChange={(e) => setAddForm({ ...addForm, relation: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Parent in Tree*</label>
                  <select
                    value={addForm.parentId}
                    onChange={(e) => setAddForm({ ...addForm, parentId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.fullName} ({n.relation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Birth Date (YYYY-MM-DD)*</label>
                  <input
                    type="date"
                    value={addForm.birthDate}
                    onChange={(e) => setAddForm({ ...addForm, birthDate: e.target.value, birthYear: e.target.value.split('-')[0] })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Gender*</label>
                  <select
                    value={addForm.gender}
                    onChange={(e) => setAddForm({ ...addForm, gender: e.target.value as 'male' | 'female' })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Is Deceased Toggle */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={addForm.isDeceased}
                    onChange={(e) => setAddForm({ ...addForm, isDeceased: e.target.checked })}
                    className="rounded text-teal-600"
                  />
                  <span className="font-semibold">Mark as Deceased</span>
                </label>

                {addForm.isDeceased && (
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Memorial / Death Date:
                    </label>
                    <input
                      type="date"
                      value={addForm.deathDate}
                      onChange={(e) => setAddForm({ ...addForm, deathDate: e.target.value })}
                      className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={addForm.occupation}
                    onChange={(e) => setAddForm({ ...addForm, occupation: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Native Town</label>
                  <input
                    type="text"
                    value={addForm.nativePlaceOor}
                    onChange={(e) => setAddForm({ ...addForm, nativePlaceOor: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
                >
                  Save to Family Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
