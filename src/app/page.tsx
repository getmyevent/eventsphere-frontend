'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../lib/store';
import dynamic from 'next/dynamic';
import { DemoBar } from '../components/shell/DemoBar';
import { AddToHomeScreenBanner } from '../components/shell/AddToHomeScreenBanner';
import { PhoneFrame } from '../components/shell/PhoneFrame';
import { AccessScreen } from '../components/auth/AccessScreen';

// Core default delegate views
import { DelegateHome } from '../components/delegate/DelegateHome';
import { DelegateBottomNav } from '../components/delegate/DelegateBottomNav';

// Dynamically loaded delegate secondary views (loaded on demand)
const DelegatePeople = dynamic(() => import('../components/delegate/DelegatePeople').then(m => m.DelegatePeople));
const DelegateFocus = dynamic(() => import('../components/delegate/DelegateFocus').then(m => m.DelegateFocus));
const DelegateSchedule = dynamic(() => import('../components/delegate/DelegateSchedule').then(m => m.DelegateSchedule));
const DelegateProfile = dynamic(() => import('../components/delegate/DelegateProfile').then(m => m.DelegateProfile));
const DelegateEditProfile = dynamic(() => import('../components/delegate/DelegateEditProfile').then(m => m.DelegateEditProfile));
const DelegateCompanies = dynamic(() => import('../components/delegate/DelegateCompanies').then(m => m.DelegateCompanies));
const DelegateCompanyDetail = dynamic(() => import('../components/delegate/DelegateCompanyDetail').then(m => m.DelegateCompanyDetail));
const DelegateAIRecommendations = dynamic(() => import('../components/delegate/DelegateAIRecommendations').then(m => m.DelegateAIRecommendations));
const DelegateSpeakers = dynamic(() => import('../components/delegate/DelegateSpeakers').then(m => m.DelegateSpeakers));
const DelegatePolls = dynamic(() => import('../components/delegate/DelegatePolls').then(m => m.DelegatePolls));
const DelegateMap = dynamic(() => import('../components/delegate/DelegateMap').then(m => m.DelegateMap));
const DelegateSponsors = dynamic(() => import('../components/delegate/DelegateSponsors').then(m => m.DelegateSponsors));
const DelegateSupport = dynamic(() => import('../components/delegate/DelegateSupport').then(m => m.DelegateSupport));

// Exhibitor views (dynamically loaded on demand)
const ExhibitorHome = dynamic(() => import('../components/exhibitor/ExhibitorHome').then(m => m.ExhibitorHome), { ssr: false });
const ExhibitorLeads = dynamic(() => import('../components/exhibitor/ExhibitorLeads').then(m => m.ExhibitorLeads), { ssr: false });
const ExhibitorScan = dynamic(() => import('../components/exhibitor/ExhibitorScan').then(m => m.ExhibitorScan), { ssr: false });
const ExhibitorProducts = dynamic(() => import('../components/exhibitor/ExhibitorProducts').then(m => m.ExhibitorProducts), { ssr: false });
const ExhibitorMore = dynamic(() => import('../components/exhibitor/ExhibitorMore').then(m => m.ExhibitorMore), { ssr: false });
const ExhibitorBottomNav = dynamic(() => import('../components/exhibitor/ExhibitorBottomNav').then(m => m.ExhibitorBottomNav), { ssr: false });

// Organizer console (dynamically loaded on demand)
const OrganizerConsole = dynamic(() => import('../components/organizer/OrganizerConsole').then(m => m.OrganizerConsole), { ssr: false });

// Modals (dynamically loaded on demand)
const ContactPrivacyModal = dynamic(() => import('../components/modals/ContactPrivacyModal').then(m => m.ContactPrivacyModal), { ssr: false });
const PersonDetailModal = dynamic(() => import('../components/modals/PersonDetailModal').then(m => m.PersonDetailModal), { ssr: false });
const MyQRCodeModal = dynamic(() => import('../components/modals/MyQRCodeModal').then(m => m.MyQRCodeModal), { ssr: false });
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function App() {
  const router = useRouter();
  const {
    role,
    hasAccessConfirmed,
    setHasAccessConfirmed,
    setRole,
    activeDelegateTab,
    activeExhibitorTab,
    selectedPersonId,
    toast,
  } = useStore();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (hasAccessConfirmed && role === 'delegate') {
      router.replace('/delegate/home');
    }
  }, [hasAccessConfirmed, role, router]);

  return (
    <div className={`bg-[#F6F4F0] flex flex-col font-sans ${role === 'organizer' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}>


      {/* Modals for Delegate Experience */}
      {isPrivacyModalOpen && (
        <ContactPrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      )}
      {isQRModalOpen && (
        <MyQRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}
      {selectedPersonId && <PersonDetailModal />}

      {/* Floating Feedback Toast Notification for Organizer */}
      {toast && role === 'organizer' && (
        <div className="fixed top-14 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#181818] text-white px-3 py-2.5 rounded-lg shadow-lg border border-[#333333] flex items-center gap-2.5 text-xs max-w-sm">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#2F7D58] flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#B51F32] flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#00A4EF] flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main View Router based on Role */}
      {!hasAccessConfirmed ? (
        <PhoneFrame>
          <AccessScreen onSuccess={() => setHasAccessConfirmed(true)} />
        </PhoneFrame>
      ) : role === 'organizer' ? (
        /* Full-Width Desktop Organizer Console */
        <OrganizerConsole />
      ) : (
        /* Delegate or Exhibitor in Mobile-First Phone Container */
        <PhoneFrame>
          {/* Add-to-Home-Screen PWA Banner (inside mobile frame) */}
          {/* <AddToHomeScreenBanner /> */}

          {/* Mobile Toast Notification */}
          {toast && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-200 w-[90%] max-w-[340px]">
              <div className="bg-[#181818] text-white px-3 py-3 rounded-[14px] shadow-xl border border-[#333333] flex items-center gap-2 text-[12px]">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2F7D58] flex-shrink-0" />
                ) : toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-[#B51F32] flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-[#00A4EF] flex-shrink-0" />
                )}
                <span className="font-semibold truncate">{toast.message}</span>
              </div>
            </div>
          )}
          {role === 'delegate' ? (
              /* Delegate Experience */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
                  {activeDelegateTab === 'home' && <DelegateHome />}
                  {activeDelegateTab === 'people' && <DelegatePeople />}
                  {(activeDelegateTab === 'focus' || activeDelegateTab === 'scan') && <DelegateFocus />}
                  {activeDelegateTab === 'schedule' && <DelegateSchedule />}
                  {activeDelegateTab === 'companies' && <DelegateCompanies />}
                  {activeDelegateTab === 'company_detail' && <DelegateCompanyDetail />}
                  {activeDelegateTab === 'ai_recommendations' && <DelegateAIRecommendations />}
                  {activeDelegateTab === 'speakers' && <DelegateSpeakers />}
                  {activeDelegateTab === 'polls' && <DelegatePolls />}
                  {activeDelegateTab === 'map' && <DelegateMap />}
                  {activeDelegateTab === "sponsors" && <DelegateSponsors />}
                  {activeDelegateTab === 'support' && <DelegateSupport />}
                  {activeDelegateTab === 'profile' && (
                    <DelegateProfile
                      onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
                      onOpenQRModal={() => setIsQRModalOpen(true)}
                    />
                  )}
                  {activeDelegateTab === 'edit_profile' && <DelegateEditProfile />}
                </div>
                <DelegateBottomNav />
              </div>
          ) : (
            /* Exhibitor (Truechip Solutions) Experience */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 flex flex-col overflow-y-auto overscroll-contain no-scrollbar">
                {activeExhibitorTab === 'home' && <ExhibitorHome />}
                {activeExhibitorTab === 'leads' && <ExhibitorLeads />}
                {activeExhibitorTab === 'scan' && <ExhibitorScan />}
                {activeExhibitorTab === 'products' && <ExhibitorProducts />}
                {activeExhibitorTab === 'more' && <ExhibitorMore />}
              </div>
              <ExhibitorBottomNav />
            </div>
          )}
        </PhoneFrame>
      )}
    </div>
  );
}
