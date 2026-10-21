'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { PhoneFrame } from '../../components/shell/PhoneFrame';
import { DelegateBottomNavRouted } from '../../components/delegate/DelegateBottomNavRouted';
import { cleanupLingeringOverlays } from '../../lib/overlayCleanup';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

const PersonDetailModal = dynamic(
  () => import('../../components/modals/PersonDetailModal').then((mod) => mod.PersonDetailModal),
  { ssr: false }
);
const ContactPrivacyModal = dynamic(
  () => import('../../components/modals/ContactPrivacyModal').then((mod) => mod.ContactPrivacyModal),
  { ssr: false }
);
const MyQRCodeModal = dynamic(
  () => import('../../components/modals/MyQRCodeModal').then((mod) => mod.MyQRCodeModal),
  { ssr: false }
);
const AccessScreen = dynamic(
  () => import('../../components/auth/AccessScreen').then((mod) => mod.AccessScreen),
  { ssr: false }
);

export default function DelegateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    hasAccessConfirmed,
    isSessionLoading,
    setHasAccessConfirmed,
    selectedPersonId,
    setSelectedPersonId,
    toast,
  } = useStore();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && role !== 'delegate') {
      router.push('/');
    }
  }, [role, router, isSessionLoading]);

  // Clean up modals and eradicate lingering Google Identity Services (GIS) One-Tap / FedCM overlays on route change
  useEffect(() => {
    setSelectedPersonId(null);
    setIsPrivacyModalOpen(false);
    setIsQRModalOpen(false);
    cleanupLingeringOverlays();

    // Safety timeout to catch any delayed GIS DOM injections
    const timer = setTimeout(() => {
      cleanupLingeringOverlays();
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, setSelectedPersonId]);

  if (isSessionLoading) {
    return (
      <div className="bg-[#F6F4F0] min-h-[100dvh] flex flex-col font-sans items-center justify-center">
        <PhoneFrame>
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-8 h-8 border-2 border-[#181818] border-t-transparent rounded-full animate-spin" />
            <p className="text-[12px] font-semibold text-[#6B6B6B] tracking-wide uppercase">
              Verifying Session...
            </p>
          </div>
        </PhoneFrame>
      </div>
    );
  }

  if (!hasAccessConfirmed) {
    return (
      <div className="bg-[#F6F4F0] min-h-[100dvh] flex flex-col font-sans">
        <PhoneFrame>
          <AccessScreen
            onSuccess={() => {
              cleanupLingeringOverlays();
              setHasAccessConfirmed(true);
            }}
          />
        </PhoneFrame>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F4F0] min-h-[100dvh] flex flex-col font-sans">
      {/* Modals */}
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

      <PhoneFrame>
        {/* Mobile Toast */}
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

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
            {children}
          </div>
          <DelegateBottomNavRouted />
        </div>
      </PhoneFrame>
    </div>
  );
}
