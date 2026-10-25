'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { api } from '../../lib/api';
import { CURRENT_USER, INITIAL_ATTENDEES } from '../../lib/mockData';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, Lock, ChevronDown, Sparkles } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91' },
  { code: '+1' },
  { code: '+44' },
  { code: '+971' },
  { code: '+65' },
  { code: '+886' },
  { code: '+81' },
  { code: '+82' },
  { code: '+49' },
  { code: '+33' },
  { code: '+31' },
  { code: '+61' },
  { code: '+966' },
  { code: '+972' },
  { code: '+86' },
];

const PRESET_NUMBERS = [
  { label: '9845021078', number: '9845021078' },
  { label: '7089157046', number: '7089157046' },
  { label: '9981643512', number: '9981643512' },
  { label: '9876543210', number: '9876543210' },
];

interface AccessScreenProps {
  onSuccess: () => void;
}

export const AccessScreen: React.FC<AccessScreenProps> = ({ onSuccess }) => {
  const { setRole, setHasAccessConfirmed, setCurrentUser, resetUserState } = useStore();

  const [eventId, setEventId] = useState('MPSS26');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'confirmed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync with DOM value in case browser autofilled
  useEffect(() => {
    if (mobileInputRef.current?.value && !mobile) {
      setMobile(mobileInputRef.current.value);
    }
  }, [mobile]);

  const handleVerify = async (e?: React.FormEvent | React.MouseEvent, overrideNumber?: string) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    const targetMobile = overrideNumber || mobile || mobileInputRef.current?.value || '';
    const rawMobile = targetMobile.trim();

    if (!rawMobile) {
      setStatus('error');
      setErrorMessage('Please enter your registered mobile number.');
      mobileInputRef.current?.focus();
      return;
    }

    const cleanDigits = rawMobile.replace(/\D/g, '');

    if (!cleanDigits || /^0+$/.test(cleanDigits)) {
      setStatus('error');
      setErrorMessage('Please enter a valid registered mobile number.');
      mobileInputRef.current?.focus();
      return;
    }

    let num = cleanDigits;
    if (countryCode === '+91') {
      if (num.startsWith('91') && num.length > 10) num = num.slice(2);
      if (num.startsWith('0')) num = num.slice(1);

      if (num.length !== 10) {
        setStatus('error');
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        mobileInputRef.current?.focus();
        return;
      }
    } else {
      if (num.length < 6 || num.length > 15) {
        setStatus('error');
        setErrorMessage('Please enter a valid mobile number.');
        mobileInputRef.current?.focus();
        return;
      }
    }

    const trimmedEventId = (eventId || 'MPSS26').trim().toUpperCase();
    if (!trimmedEventId) {
      setStatus('error');
      setErrorMessage('Please enter an Event ID.');
      return;
    }

    setStatus('verifying');

    try {
      // 1. Authenticate against backend
      const res = await api.auth.login(trimmedEventId, num);
      if (res && res.token && res.user) {
        resetUserState();

        let detectedRole: 'delegate' | 'exhibitor' | 'organizer' = 'delegate';
        if (res.user.role === 'ROLE_ORGANIZER') detectedRole = 'organizer';
        else if (res.user.role === 'ROLE_EXHIBITOR') detectedRole = 'exhibitor';
        else detectedRole = 'delegate';

        setRole(detectedRole);

        try {
          const profile = await api.attendees.getMyProfile();
          if (profile && profile.id) {
            setCurrentUser({
              id: profile.id,
              name: profile.name || res.user.name,
              avatar: profile.avatar || res.user.avatar || '',
              designation: profile.designation || res.user.designation || '',
              company: profile.company || res.user.company || '',
              role: (profile.role as any) || (detectedRole === 'organizer' ? 'organizer_staff' : detectedRole === 'exhibitor' ? 'exhibitor_staff' : 'delegate'),
              bio: profile.bio || '',
              interests: profile.interests || [],
              skills: profile.skills || [],
              email: profile.email || res.user.email || '',
              mobile: profile.mobile || res.user.mobile || num,
              linkedin: profile.linkedin || '',
              twitter: profile.twitter || '',
              relevanceScore: profile.relevanceScore,
              checkedIn: profile.checkedIn ?? true,
              registrationId: profile.registrationId || res.user.id || '',
              ticketType: profile.ticketType || 'Delegate Pass',
              privacy: profile.privacy ? {
                shareEmail: profile.privacy.shareEmail ?? true,
                sharePhone: profile.privacy.sharePhone ?? true,
                shareLinkedIn: profile.privacy.shareLinkedIn ?? true,
                shareTwitter: profile.privacy.shareTwitter ?? false,
                preset: profile.privacy.preset === 'OPEN' ? 'Open' : 'Connections Only',
              } : {
                shareEmail: true,
                sharePhone: true,
                shareLinkedIn: true,
                shareTwitter: false,
                preset: 'Connections Only',
              },
            });
          } else {
            setCurrentUser({
              id: res.user.id,
              name: res.user.name,
              avatar: res.user.avatar || '',
              designation: res.user.designation || (detectedRole === 'organizer' ? 'Organizer' : detectedRole === 'exhibitor' ? 'Exhibitor' : 'Delegate'),
              company: res.user.company || 'EventSphere',
              role: detectedRole === 'organizer' ? 'organizer_staff' : detectedRole === 'exhibitor' ? 'exhibitor_staff' : 'delegate',
              bio: '',
              interests: [],
              skills: [],
              email: res.user.email || '',
              mobile: res.user.mobile || num,
              checkedIn: true,
              registrationId: res.user.id,
              ticketType: detectedRole === 'organizer' ? 'Organizer Pass' : detectedRole === 'exhibitor' ? 'Exhibitor Pass' : 'Delegate Pass',
              privacy: {
                shareEmail: true,
                sharePhone: true,
                shareLinkedIn: true,
                shareTwitter: false,
                preset: 'Connections Only',
              },
            });
          }
        } catch {
          const isHari = res.user.id === 'att-hari-gupta' || num === '9876543210' || num === '7089157046';
          setCurrentUser({
            ...(isHari ? CURRENT_USER : {}),
            id: res.user.id,
            name: res.user.name || (isHari ? CURRENT_USER.name : 'Delegate'),
            avatar: res.user.avatar || (isHari ? CURRENT_USER.avatar : ''),
            designation: res.user.designation || (isHari ? CURRENT_USER.designation : detectedRole === 'organizer' ? 'Organizer' : detectedRole === 'exhibitor' ? 'Exhibitor' : 'Delegate'),
            company: res.user.company || (isHari ? CURRENT_USER.company : 'EventSphere'),
            role: detectedRole === 'organizer' ? 'organizer_staff' : detectedRole === 'exhibitor' ? 'exhibitor_staff' : 'delegate',
            bio: isHari ? CURRENT_USER.bio : '',
            interests: isHari ? CURRENT_USER.interests : [],
            skills: isHari ? CURRENT_USER.skills : [],
            email: res.user.email || (isHari ? CURRENT_USER.email : ''),
            mobile: res.user.mobile || (isHari ? CURRENT_USER.mobile : num),
            checkedIn: true,
            registrationId: res.user.id || (isHari ? CURRENT_USER.registrationId : ''),
            ticketType: detectedRole === 'organizer' ? 'Organizer Pass' : detectedRole === 'exhibitor' ? 'Exhibitor Pass' : 'Delegate Pass',
            privacy: isHari ? { ...CURRENT_USER.privacy } : {
              shareEmail: true,
              sharePhone: true,
              shareLinkedIn: true,
              shareTwitter: false,
              preset: 'Connections Only',
            },
          });
        }

        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }
    } catch (err: any) {
      // Offline / Local Fallback for registered attendees
      const matchedAttendee = INITIAL_ATTENDEES.find((a) => {
        const aDigits = (a.mobile || '').replace(/\D/g, '');
        return aDigits === num || (aDigits.length >= 10 && num.length >= 10 && (aDigits.endsWith(num) || num.endsWith(aDigits)));
      });

      if (matchedAttendee) {
        resetUserState();
        const fallbackRole = (matchedAttendee.role as any) === 'organizer_staff'
          ? 'organizer'
          : (matchedAttendee.role as any) === 'exhibitor_staff'
            ? 'exhibitor'
            : 'delegate';
        setRole(fallbackRole);
        setCurrentUser({
          ...matchedAttendee,
          checkedIn: true,
        });
        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }

      setStatus('error');
      setErrorMessage(err?.message || 'Login failed. Please verify your registered mobile number.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F4F0] min-h-[600px] select-none h-full relative overflow-y-auto">
      {/* Hero Image Section */}
      <div
        className="h-[40%] min-h-[260px] relative bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white flex items-center justify-center font-extrabold text-[#181818] text-[12px] rounded-sm shadow-sm">
              E
            </div>
            <span className="font-bold text-[12px] tracking-[0.15em] text-white">EVENTSPHERE</span>
          </div>
          <span className="text-[11px] font-semibold tracking-widest text-white border border-white/40 px-2 py-0.5 rounded backdrop-blur-sm bg-black/20">
            MPSS26
          </span>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-8 left-5 right-5 z-10 text-white">
          <p className="text-[11.5px] font-medium text-white/90 mb-0.5">Welcome to</p>
          <h1 className="text-[23px] font-serif font-medium leading-tight tracking-tight mb-1">
            MP Semiconductor Summit 2026
          </h1>
          <p className="text-[11.5px] font-medium text-white/80">
            23–24 Oct 2026 · Indore · 2,400+ attending
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[#F6F4F0] rounded-t-[28px] -mt-6 relative z-20 px-4 pt-5 pb-5 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mb-4">
          <div className="border-l-[3px] border-[#B51F32] pl-3">
            <h2 className="text-[15px] font-bold text-[#181818] tracking-tight">Enter your event</h2>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
              Use your Event ID and mobile number registered for the summit.
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={(e) => handleVerify(e)} className="flex-1 flex flex-col">
          <div className="space-y-3">
            {/* Event ID */}
            <div>
              <label className="block text-[11.5px] font-semibold text-[#181818] mb-1">
                Event ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value.toUpperCase())}
                  placeholder="MPSS26"
                  disabled={status === 'verifying' || status === 'confirmed'}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#DEDCD7] text-[13px] font-bold tracking-wider text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#B51F32] focus:border-transparent transition-all shadow-sm"
                />
                <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B51F32]" />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11.5px] font-semibold text-[#181818] mb-1">
                Registered Mobile Number
              </label>
              <div className="flex rounded-lg bg-white border border-[#DEDCD7] focus-within:ring-2 focus-within:ring-[#B51F32] focus-within:border-transparent transition-all shadow-sm overflow-hidden">
                {/* Country Code */}
                <div className="relative flex items-center bg-[#F9F9F8] border-r border-[#DEDCD7] px-2.5 shrink-0 hover:bg-[#F3F2EE] transition-colors cursor-pointer">
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-[#181818] tracking-tight pointer-events-none select-none">
                    <span>{countryCode}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B6B6B]" />
                  </div>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={status === 'verifying' || status === 'confirmed'}
                    aria-label="Country Code"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Input */}
                <input
                  ref={mobileInputRef}
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter 10-digit mobile number"
                  disabled={status === 'verifying' || status === 'confirmed'}
                  className="flex-1 min-w-0 px-3 py-2 text-[13px] font-medium text-[#181818] bg-transparent focus:outline-none placeholder-[#9CA3AF]"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Quick Access Numbers */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-1.5 text-[10.5px] font-semibold text-[#8C827A] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#B51F32]" />
                <span>Authorized Demo Logins</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_NUMBERS.map((p) => (
                  <button
                    key={p.number}
                    type="button"
                    onClick={() => {
                      setMobile(p.number);
                      if (status === 'error') setStatus('idle');
                      handleVerify(undefined, p.number);
                    }}
                    disabled={status === 'verifying' || status === 'confirmed'}
                    className="px-2.5 py-1.5 rounded-md bg-white hover:bg-[#F3EFEA] active:scale-[0.98] border border-[#E2DDD5] text-left text-[11px] font-medium text-[#181818] transition-all flex items-center justify-between shadow-2xs cursor-pointer group"
                  >
                    <span className="font-mono text-[#333333] group-hover:text-[#B51F32] font-semibold">
                      {p.label}
                    </span>
                    <span className="text-[9.5px] text-[#B51F32] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2 animate-in fade-in mt-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Confirmation State */}
          {status === 'confirmed' && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in mt-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-[12px] text-emerald-900">Access confirmed ✓</p>
                <p className="text-[11px] text-emerald-700">Loading your personalized dashboard...</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            {/* Submit Action */}
            <button
              type="submit"
              disabled={status === 'verifying' || status === 'confirmed'}
              className="w-full h-[42px] bg-[#B51F32] hover:bg-[#9C1A2B] active:scale-[0.98] text-white font-semibold text-[13px] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {status === 'verifying' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying registration...</span>
                </>
              ) : status === 'confirmed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Access Confirmed ✓</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer Info */}
            <div className="mt-3 flex items-center justify-center gap-3 text-[11.5px] font-medium text-[#6B6B6B]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#888888]" />
                <span>No passwords needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D58]" />
                <span>Summit Registration Verified</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
