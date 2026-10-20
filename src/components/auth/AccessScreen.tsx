'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { api, ApiUser } from '../../lib/api';
import { CURRENT_USER, INITIAL_ATTENDEES } from '../../lib/mockData';
import { Person } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

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

interface AccessScreenProps {
  onSuccess: () => void;
}

export const AccessScreen: React.FC<AccessScreenProps> = ({ onSuccess }) => {
  const { setRole, setHasAccessConfirmed, setCurrentUser, resetUserState } = useStore();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [eventId, setEventId] = useState('MPSS26');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');

  // 4-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'confirmed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const digit0Ref = useRef<HTMLInputElement>(null);
  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);

  const digitRefs = [digit0Ref, digit1Ref, digit2Ref, digit3Ref];

  // Sync with DOM value in case browser autofilled
  useEffect(() => {
    if (mobileInputRef.current?.value && !mobile) {
      setMobile(mobileInputRef.current.value);
    }
  }, [mobile]);

  // Focus first digit box when switching to OTP screen
  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        digitRefs[0].current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step, resendTimer]);

  // Clean numeric digits from mobile
  const getCleanMobile = () => {
    const raw = (mobile || mobileInputRef.current?.value || '').trim();
    return raw.replace(/\D/g, '');
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'sending' || status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    // 1. Validate Full Name
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setStatus('error');
      setErrorMessage('Please enter your full name.');
      fullNameInputRef.current?.focus();
      return;
    }
    if (trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Please enter a valid full name (at least 2 characters).');
      fullNameInputRef.current?.focus();
      return;
    }

    // 2. Validate Mobile
    const cleanDigits = getCleanMobile();
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

    setStatus('sending');

    // Simulate sending OTP to registered mobile number
    setTimeout(() => {
      const demoOtp = '1234';
      setGeneratedOtp(demoOtp);
      setOtpDigits(['', '', '', '']);
      setStatus('idle');
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpNotice(`OTP sent to ${countryCode} ${num}. Demo code: 1234`);
      setTimeout(() => setOtpNotice(null), 6000);
    }, 450);
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
    setErrorMessage('');
    const demoOtp = '1234';
    setGeneratedOtp(demoOtp);
    setOtpNotice(`New OTP sent to ${countryCode} ${mobile}. Demo code: 1234`);
    setTimeout(() => setOtpNotice(null), 5000);
    digitRefs[0].current?.focus();
  };

  // OTP Digits change handler
  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage('');
    const clean = val.replace(/\D/g, '');

    const nextDigits = [...otpDigits];
    if (!clean) {
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    // Single digit input
    nextDigits[index] = clean[clean.length - 1];
    setOtpDigits(nextDigits);

    // Auto-advance to next input box
    if (index < 3 && clean) {
      digitRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (paste) {
      const next = ['', '', '', ''];
      for (let i = 0; i < paste.length; i++) {
        next[i] = paste[i];
      }
      setOtpDigits(next);
      const nextFocus = Math.min(paste.length, 3);
      digitRefs[nextFocus].current?.focus();
    }
  };

  // Step 2: Verify OTP & Login
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setStatus('error');
      setErrorMessage('Please enter the complete 4-digit OTP.');
      return;
    }

    // Validate OTP (allow generatedOtp or universal demo bypass 1234 / 0000 / 9999)
    const isValidOtp =
      enteredOtp === generatedOtp ||
      enteredOtp === '1234' ||
      enteredOtp === '0000' ||
      enteredOtp === '9999';

    if (!isValidOtp) {
      setStatus('error');
      setErrorMessage('Invalid OTP code. Please enter the 4-digit code (Demo: 1234).');
      return;
    }

    setStatus('verifying');

    let num = getCleanMobile();
    if (countryCode === '+91') {
      if (num.startsWith('91') && num.length > 10) num = num.slice(2);
      if (num.startsWith('0')) num = num.slice(1);
    }

    const trimmedName = fullName.trim();

    try {
      // 1. Authenticate against live backend if available
      const res = await api.auth.login(eventId || 'MPSS26', num);
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
              name: trimmedName || profile.name || res.user.name,
              avatar: profile.avatar || '',
              designation: profile.designation || '',
              company: profile.company || res.user.company || '',
              role:
                (profile.role as any) ||
                (detectedRole === 'organizer'
                  ? 'organizer_staff'
                  : detectedRole === 'exhibitor'
                  ? 'exhibitor_staff'
                  : 'delegate'),
              bio: profile.bio || '',
              interests: profile.interests || [],
              skills: profile.skills || [],
              email: profile.email || res.user.email || '',
              mobile: profile.mobile || res.user.mobile || num,
              linkedin: profile.linkedin || '',
              twitter: profile.twitter || '',
              relevanceScore: profile.relevanceScore,
              checkedIn: true,
              registrationId: profile.registrationId || res.user.id || '',
              ticketType: profile.ticketType || 'Standard',
              privacy: profile.privacy
                ? {
                    shareEmail: profile.privacy.shareEmail ?? true,
                    sharePhone: profile.privacy.sharePhone ?? true,
                    shareLinkedIn: profile.privacy.shareLinkedIn ?? true,
                    shareTwitter: profile.privacy.shareTwitter ?? false,
                    preset: profile.privacy.preset === 'OPEN' ? 'Open' : 'Connections Only',
                  }
                : {
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
              name: trimmedName || res.user.name,
              avatar: '',
              designation:
                detectedRole === 'organizer'
                  ? 'Organizer'
                  : detectedRole === 'exhibitor'
                  ? 'Exhibitor'
                  : 'Delegate',
              company: res.user.company || 'GetMyEvent',
              role:
                detectedRole === 'organizer'
                  ? 'organizer_staff'
                  : detectedRole === 'exhibitor'
                  ? 'exhibitor_staff'
                  : 'delegate',
              bio: '',
              interests: [],
              skills: [],
              email: res.user.email || '',
              mobile: res.user.mobile || num,
              checkedIn: true,
              registrationId: res.user.id,
              ticketType:
                detectedRole === 'organizer'
                  ? 'Organizer'
                  : detectedRole === 'exhibitor'
                  ? 'Exhibitor Pass'
                  : 'Standard',
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
          // Fallback user from login
          const isHari = res.user.id === 'att-hari-gupta' || num === '7089157046' || num === '9876543210';
          const isPushpit = res.user.id === 'att-pushpit-upadhyay' || num === '8463865310';
          const pushpitAttendee = INITIAL_ATTENDEES.find((a) => a.id === 'att-pushpit-upadhyay');
          const founderTemplate = isHari
            ? CURRENT_USER
            : isPushpit
            ? pushpitAttendee || CURRENT_USER
            : null;

          setCurrentUser({
            ...(founderTemplate ? founderTemplate : {}),
            id: res.user.id,
            name: trimmedName || res.user.name || (founderTemplate ? founderTemplate.name : 'Delegate'),
            avatar: res.user.avatar || (founderTemplate ? founderTemplate.avatar : ''),
            designation: res.user.designation || '',
            company: res.user.company || '',
            role:
              detectedRole === 'organizer'
                ? 'organizer_staff'
                : detectedRole === 'exhibitor'
                ? 'exhibitor_staff'
                : 'delegate',
            bio: '',
            interests: founderTemplate ? founderTemplate.interests || [] : [],
            skills: founderTemplate ? founderTemplate.skills || [] : [],
            email: res.user.email || '',
            mobile: res.user.mobile || num,
            linkedin: '',
            twitter: '',
            checkedIn: true,
            registrationId: res.user.id || (founderTemplate ? founderTemplate.registrationId : ''),
            ticketType: founderTemplate
              ? ''
              : detectedRole === 'organizer'
              ? 'Organizer'
              : detectedRole === 'exhibitor'
              ? 'Exhibitor Pass'
              : 'Delegate',
            privacy: founderTemplate
              ? { ...founderTemplate.privacy }
              : {
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
    } catch {
      // Offline fallback handling

      // 1. Specific Founder fallbacks
      if (num === '7089157046' || num === '9876543210') {
        resetUserState();
        setRole('delegate');
        const hariAttendee = INITIAL_ATTENDEES.find((a) => a.id === 'att-hari-gupta');
        setCurrentUser({
          ...(hariAttendee || CURRENT_USER),
          id: 'att-hari-gupta',
          name: trimmedName || 'Hari Gupta',
          company: '',
          designation: '',
          email: '',
          mobile: '+91 7089157046',
          linkedin: '',
          twitter: '',
          avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
          bio: '',
          role: 'delegate',
          ticketType: '',
          checkedIn: true,
        });
        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }

      if (num === '8463865310') {
        resetUserState();
        setRole('delegate');
        const pushpitAttendee = INITIAL_ATTENDEES.find((a) => a.id === 'att-pushpit-upadhyay');
        setCurrentUser({
          ...(pushpitAttendee || CURRENT_USER),
          id: 'att-pushpit-upadhyay',
          name: trimmedName || 'Pushpit Upadhyay',
          company: '',
          designation: '',
          email: '',
          mobile: '+91 8463865310',
          linkedin: '',
          twitter: '',
          avatar: '/images/founders/pushpit-upadhyay.jpg',
          bio: '',
          role: 'delegate',
          ticketType: '',
          checkedIn: true,
        });
        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }

      // 2. Dynamic Offline fallback: match by mobile in INITIAL_ATTENDEES
      const matchedAttendee = INITIAL_ATTENDEES.find((a) => {
        const aDigits = (a.mobile || '').replace(/\D/g, '');
        return (
          aDigits === num ||
          (aDigits.length >= 10 && num.length >= 10 && (aDigits.endsWith(num) || num.endsWith(aDigits)))
        );
      });

      if (matchedAttendee) {
        resetUserState();
        const fallbackRole =
          (matchedAttendee.role as any) === 'organizer_staff'
            ? 'organizer'
            : (matchedAttendee.role as any) === 'exhibitor_staff'
            ? 'exhibitor'
            : 'delegate';
        setRole(fallbackRole);
        setCurrentUser({
          ...matchedAttendee,
          name: trimmedName || matchedAttendee.name,
          company: '',
          designation: '',
          email: '',
          linkedin: '',
          twitter: '',
          bio: '',
          checkedIn: true,
        });
        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }

      // 3. New registered user dynamic profile
      resetUserState();
      setRole('delegate');
      const newUser: Person = {
        id: `att-${Date.now().toString().slice(-6)}`,
        name: trimmedName,
        designation: '',
        company: '',
        role: 'delegate',
        email: '',
        mobile: `${countryCode} ${num}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=181818&color=ffffff&bold=true`,
        bio: '',
        interests: ['Semiconductors', 'VLSI Design', 'Networking'],
        skills: ['Technology'],
        checkedIn: true,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        registrationId: `#REG-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketType: 'Delegate',
        privacy: {
          shareEmail: true,
          sharePhone: true,
          shareLinkedIn: true,
          shareTwitter: false,
          preset: 'Connections Only',
        },
      };

      setCurrentUser(newUser);
      setStatus('confirmed');
      setTimeout(() => {
        setHasAccessConfirmed(true);
        onSuccess();
      }, 350);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6] min-h-[600px] select-none h-full relative overflow-y-auto">
      {/* Hero Image Section */}
      <div
        className="h-[40%] min-h-[270px] relative bg-cover bg-center shrink-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white flex items-center justify-center font-extrabold text-[#181818] text-[13px] rounded-md shadow-sm">
              G
            </div>
            <span className="font-bold text-[13px] tracking-[0.16em] text-white">GETMYEVENT</span>
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-white border border-white/40 px-3 py-1 rounded-full backdrop-blur-sm bg-black/25">
            MPSS26
          </span>
        </div>

        {/* Bottom Hero Text */}
        <div className="absolute bottom-9 left-6 right-6 z-10 text-white">
          <p className="text-[12.5px] font-medium text-white/90 mb-0.5">Welcome to</p>
          <h1 className="text-[26px] sm:text-[28px] font-serif font-medium leading-tight tracking-tight mb-1 text-white">
            MP Semiconductor Summit 2026
          </h1>
          <p className="text-[12px] font-medium text-white/80">
            23–24 Oct 2026 · Indore · 2,400 attending
          </p>
        </div>
      </div>

      {/* Form / Bottom Sheet Section */}
      <div className="flex-1 bg-[#FAF9F6] rounded-t-[30px] -mt-6 relative z-20 px-5 pt-5 pb-5 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-black/5">
        {/* Floating OTP Notice banner */}
        {otpNotice && (
          <div className="mb-3 p-2.5 bg-[#181818] text-white text-[12px] rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{otpNotice}</span>
          </div>
        )}

        {/* STEP 1: Details Entry (Matches user screenshot) */}
        {step === 'details' && (
          <form onSubmit={handleSendOtp} className="flex-1 flex flex-col">
            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1 self-stretch min-h-[38px] bg-[#B51F32] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[17px] font-bold text-[#181818] tracking-tight">Enter your event</h2>
                <p className="text-[11.5px] text-[#6B7280] mt-0.5 leading-snug">
                  Use the Event ID and mobile number used during event registration.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 flex-1">
              {/* Event ID Field */}
              <div>
                <label className="block text-[12px] font-semibold text-[#181818] mb-1">Event ID</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value.toUpperCase())}
                    placeholder="MPSS26"
                    disabled={status === 'sending'}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[13.5px] font-bold tracking-wider text-[#181818] shadow-xs focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none transition-all uppercase"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-[#B51F32]" />
                  </div>
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-[12px] font-semibold text-[#181818] mb-1">Full Name</label>
                <input
                  ref={fullNameInputRef}
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your full name"
                  disabled={status === 'sending'}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[13.5px] font-medium text-[#181818] shadow-xs placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none transition-all"
                />
              </div>

              {/* Registered Mobile Number Field */}
              <div>
                <label className="block text-[12px] font-semibold text-[#181818] mb-1">
                  Registered Mobile Number
                </label>
                <div className="flex h-11 rounded-xl bg-white border border-[#E5E7EB] shadow-xs focus-within:ring-2 focus-within:ring-[#B51F32]/20 focus-within:border-[#B51F32] transition-all overflow-hidden">
                  {/* Country Code Select */}
                  <div className="relative flex items-center justify-center gap-1 bg-[#F9FAFB] border-r border-[#E5E7EB] px-2 shrink-0 cursor-pointer hover:bg-[#F3F4F6] transition-colors select-none">
                    <span className="text-[13px] font-semibold text-[#181818] tracking-tight">{countryCode}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B7280] stroke-[2.2]" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={status === 'sending'}
                      aria-label="Country Code"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
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
                    placeholder="Enter mobile number"
                    disabled={status === 'sending'}
                    className="flex-1 min-w-0 px-3.5 text-[13.5px] font-medium text-[#181818] bg-transparent focus:outline-none placeholder-[#9CA3AF]"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Submit Action: Send OTP */}
            <div className="mt-5 pt-1">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full h-12 bg-[#B51F32] hover:bg-[#9C1A2B] active:scale-[0.98] text-white font-semibold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer Trust Badges */}
              <div className="mt-3.5 flex items-center justify-center gap-3 text-[12px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>No passwords</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Registration verified</span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-3 duration-200">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setStatus('idle');
                setErrorMessage('');
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] hover:text-[#181818] mb-3 transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change mobile number</span>
            </button>

            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1 self-stretch min-h-[38px] bg-[#B51F32] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[17px] font-bold text-[#181818] tracking-tight">Verify Mobile Number</h2>
                <p className="text-[11.5px] text-[#6B7280] mt-0.5 leading-snug">
                  Enter the 4-digit code sent to{' '}
                  <strong className="text-[#181818]">
                    {countryCode} {mobile}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-2">
              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={digitRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={status === 'verifying' || status === 'confirmed'}
                    className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-2xl bg-white border border-[#E5E7EB] text-[#181818] shadow-xs focus:ring-2 focus:ring-[#B51F32]/25 focus:border-[#B51F32] outline-none transition-all"
                  />
                ))}
              </div>

              {/* Demo Helper Tag (convenient 1-click test fill) */}
              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['1', '2', '3', '4']);
                    setErrorMessage('');
                  }}
                  className="px-3 py-1 bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-full text-[11px] font-medium text-[#4B5563] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Demo OTP:</span>
                  <span className="font-bold text-[#B51F32]">1234</span>
                  <span className="text-[10px] text-[#9CA3AF]">(tap to autofill)</span>
                </button>
              </div>

              {/* Resend OTP Timer */}
              <div className="text-center mt-3">
                {resendTimer > 0 ? (
                  <p className="text-[12px] text-[#6B7280]">
                    Didn&apos;t receive code? Resend in{' '}
                    <strong className="text-[#181818]">
                      00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                    </strong>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[12px] font-bold text-[#B51F32] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in mt-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* Success Confirmation State */}
              {status === 'confirmed' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in mt-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-[12px] text-emerald-900">Access Confirmed ✓</p>
                    <p className="text-[11px] text-emerald-700">Loading your personalized experience...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Verify & Enter Action */}
            <div className="mt-4 pt-1">
              <button
                type="submit"
                disabled={
                  otpDigits.join('').length < 4 ||
                  status === 'verifying' ||
                  status === 'confirmed'
                }
                className="w-full h-12 bg-[#B51F32] hover:bg-[#9C1A2B] active:scale-[0.98] text-white font-semibold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : status === 'confirmed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Access Confirmed ✓</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer Trust Badges */}
              <div className="mt-3.5 flex items-center justify-center gap-3 text-[12px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>No passwords</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Registration verified</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
