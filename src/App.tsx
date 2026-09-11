import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, Language, AuthUser } from './types';
import { Header } from './components/Header';
import { MemberAuthPortalGate } from './components/MemberAuthPortalGate';
import { SangamPortalViewer } from './components/SangamPortalViewer';
import { AddressBookViewer } from './components/AddressBookViewer';
import { AssociationMembersViewer } from './components/AssociationMembersViewer';
import { BusinessAdsFeed } from './components/BusinessAdsFeed';
import { DonationsEventsViewer } from './components/DonationsEventsViewer';
import { MatrimonialHubViewer } from './components/MatrimonialHubViewer';
import { YouthCareerHubViewer } from './components/YouthCareerHubViewer';
import { FamilyTreeViewer } from './components/FamilyTreeViewer';
import { DigitalMemberIdViewer } from './components/DigitalMemberIdViewer';
import { PreChecklist } from './components/PreChecklist';
import { SchemaViewer } from './components/SchemaViewer';
import { ApiDocsViewer } from './components/ApiDocsViewer';
import { RbacMatrixViewer } from './components/RbacMatrixViewer';
import { ArchitectureOverview } from './components/ArchitectureOverview';
import { SuperAdminMemberManagement } from './components/SuperAdminMemberManagement';
import { SuperAdminCmsModal } from './components/SuperAdminCmsModal';
import { AuthModal } from './components/AuthModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { loadCurrentUser, saveCurrentUser } from './data/authData';
import { CompletePortalData, loadPortalContent, savePortalContent, broadcastPortalContentUpdate } from './data/portalContentData';
import { testConnection, subscribeMembersFromCloud, onAuthChange, syncUserAfterAuth } from './services/firebase';
import { loadAddressBook, saveAddressBook } from './data/addressBookData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('ta');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(loadCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Global Portal Data & CMS State
  const [portalData, setPortalData] = useState<CompletePortalData>(loadPortalContent);
  const [isGlobalCmsOpen, setIsGlobalCmsOpen] = useState<boolean>(false);
  const [cmsInitialTab, setCmsInitialTab] = useState<string>('ticker');

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CompletePortalData>;
      if (customEvent.detail) {
        setPortalData(customEvent.detail);
      } else {
        setPortalData(loadPortalContent());
      }
    };
    window.addEventListener('sangam_portal_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('sangam_portal_content_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    // Validate connection to Firestore on boot as mandated
    testConnection().catch((err) => {
      console.warn('Firebase test connection status:', err);
    });

    let unsubscribeMembers: (() => void) | null = null;

    // React Firebase Setup: Listen to auth state and only attach listeners when authenticated
    const unsubscribeAuth = onAuthChange(async (fbUser) => {
      if (fbUser) {
        try {
          const authRes = await syncUserAfterAuth(fbUser);
          setCurrentUser(authRes.user);
          saveCurrentUser(authRes.user);
        } catch (e) {
          console.warn('Auth sync status:', e);
        }

        // Data Fetching: Only attach onSnapshot listeners if auth is ready and user is authenticated
        if (unsubscribeMembers) {
          unsubscribeMembers();
        }
        unsubscribeMembers = subscribeMembersFromCloud((cloudMembers) => {
          if (cloudMembers && cloudMembers.length > 0) {
            const local = loadAddressBook();
            const map = new Map();
            local.forEach((m) => map.set(m.id, m));
            cloudMembers.forEach((m) => map.set(m.id, m));
            saveAddressBook(Array.from(map.values()));
          }
        });
      } else {
        if (unsubscribeMembers) {
          unsubscribeMembers();
          unsubscribeMembers = null;
        }
      }
    });

    return () => {
      if (unsubscribeMembers) {
        unsubscribeMembers();
      }
      unsubscribeAuth();
    };
  }, []);

  const handleSavePortalData = (newData: CompletePortalData) => {
    setPortalData(newData);
    savePortalContent(newData);
    broadcastPortalContentUpdate(newData);
  };

  const handleOpenCms = (tab: string = 'ticker') => {
    setCmsInitialTab(tab);
    setIsGlobalCmsOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCms={handleOpenCms}
        portalData={portalData}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`platform-content-${language}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            {!currentUser ? (
          /* BEFORE LOGIN: Only Show Login & Registration Gateway with Official Headquarters Below */
          <MemberAuthPortalGate
            language={language}
            onLoginSuccess={handleLoginSuccess}
            initialTab={authModalInitialMode}
            portalData={portalData}
          />
        ) : (
          /* AFTER SUCCESSFUL LOGIN / REGISTRATION: Show All Unlocked Details and Tabs */
          <>
            {activeTab === 'home' && (
              <SangamPortalViewer
                language={language}
                onNavigateTab={setActiveTab}
                currentUser={currentUser}
                onOpenAuth={handleOpenAuth}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                portalData={portalData}
                onSaveData={handleSavePortalData}
                onOpenCms={handleOpenCms}
              />
            )}

            {activeTab === 'admin-management' && (
              <SuperAdminMemberManagement
                language={language}
                currentUser={currentUser}
                onUserUpdated={() => {
                  const updatedCurrent = loadCurrentUser();
                  if (updatedCurrent) setCurrentUser(updatedCurrent);
                }}
              />
            )}

            {activeTab === 'address-book' && (
              <AddressBookViewer
                language={language}
                searchQuery={searchQuery}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'association-members' && (
              <AssociationMembersViewer
                language={language}
                searchQuery={searchQuery}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'business-ads' && (
              <BusinessAdsFeed
                language={language}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'donations' && (
              <DonationsEventsViewer
                language={language}
                searchQuery={searchQuery}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'matrimonial' && (
              <MatrimonialHubViewer
                language={language}
                searchQuery={searchQuery}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'youth-career' && (
              <YouthCareerHubViewer
                language={language}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'family-tree' && (
              <FamilyTreeViewer
                language={language}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'digital-id' && (
              <DigitalMemberIdViewer
                language={language}
                onBackToHome={() => setActiveTab('home')}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'checklist' && (
              <PreChecklist language={language} searchQuery={searchQuery} />
            )}

            {activeTab === 'schema' && (
              <SchemaViewer language={language} searchQuery={searchQuery} />
            )}

            {activeTab === 'api' && (
              <ApiDocsViewer language={language} searchQuery={searchQuery} />
            )}

            {activeTab === 'rbac' && (
              <RbacMatrixViewer language={language} />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureOverview language={language} />
            )}
          </>
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Auth Modal for Switch Role / Header Quick Triggers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        initialMode={authModalInitialMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-[#e8e3d8] py-7 mt-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
            <strong className="text-stone-800 font-semibold">Mudaliyar Sangam Digital Platform</strong>
            <span className="text-stone-400">•</span>
            <span>Official Community Portal (Reg. No: 124/1988)</span>
          </div>
          {currentUser && (
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="hover:text-[#801524] transition-colors font-medium text-stone-700 cursor-pointer"
              >
                Official Portal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('address-book')}
                className="hover:text-[#801524] transition-colors font-medium text-stone-700 cursor-pointer"
              >
                Address Book
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('association-members')}
                className="hover:text-[#801524] transition-colors font-medium text-stone-700 cursor-pointer"
              >
                Sangam Officers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matrimonial')}
                className="hover:text-rose-600 transition-colors font-medium text-stone-700 cursor-pointer"
              >
                Matrimonial Hub
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="hover:text-[#801524] transition-colors font-medium text-stone-700 cursor-pointer"
              >
                {language === 'ta' ? 'ஸ்மார்ட் அடையாள அட்டை' : 'Smart ID Card'}
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalInitialMode}
      />

      {/* Member Profile & Digital Smart ID Card Modal */}
      {currentUser && (
        <MemberProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updatedUser) => {
            setCurrentUser(updatedUser);
            saveCurrentUser(updatedUser);
          }}
          language={language}
        />
      )}

      {/* Super Admin Live CMS Modal (Globally Accessible) */}
      <SuperAdminCmsModal
        isOpen={isGlobalCmsOpen}
        onClose={() => setIsGlobalCmsOpen(false)}
        portalData={portalData}
        onSaveData={handleSavePortalData}
        language={language}
        initialTab={cmsInitialTab}
        currentUser={currentUser}
      />
    </div>
  );
}
