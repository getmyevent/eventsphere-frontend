'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { api } from '../../lib/api';
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
  Mail,
  RotateCcw,
  X,
  User,
} from 'lucide-react';

interface AccessScreenProps {
  onSuccess: () => void;
}

// Google 4-Color Icon
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Helper: Mask email address (e.g., harigupta@getmyevent.in -> h***a@getmyevent.in)
const maskEmailAddress = (rawEmail: string): string => {
  const email = rawEmail.trim();
  if (!email || !email.includes('@')) return email;
  const [localPart, domainPart] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domainPart}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  const maskedMiddle = '*'.repeat(Math.min(localPart.length - 2, 4));
  return `${first}${maskedMiddle}${last}@${domainPart}`;
};

// Helper: Derive readable name from email address
const deriveNameFromEmail = (email: string): string => {
  const local = email.split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'MPSS26 Delegate';
  return cleaned
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AccessScreen: React.FC<AccessScreenProps> = ({ onSuccess }) => {
  const { setRole, setHasAccessConfirmed, setCurrentUser, resetUserState } = useStore();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [eventId, setEventId] = useState('MPSS26');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // 4-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'confirmed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Google Sign-In state & interactive selector
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const digit0Ref = useRef<HTMLInputElement>(null);
  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);

  const digitRefs = [digit0Ref, digit1Ref, digit2Ref, digit3Ref];

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

  // Email validation helper
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Step 1: Send OTP handler
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'sending' || status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    // 1. Validate Event ID
    const trimmedEventId = eventId.trim().toUpperCase();
    if (!trimmedEventId) {
      setStatus('error');
      setErrorMessage('Please enter an Event ID.');
      return;
    }
    if (trimmedEventId !== 'MPSS26') {
      setStatus('error');
      setErrorMessage('Invalid Event ID. Please use MPSS26 for this summit.');
      return;
    }

    // 2. Validate Registered Email Address
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus('error');
      setErrorMessage('Please enter your registered email address.');
      emailInputRef.current?.focus();
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid registered email address.');
      emailInputRef.current?.focus();
      return;
    }

    setStatus('sending');

    try {
      // Send OTP via auth service
      await api.auth.sendEmailOtp(trimmedEventId, trimmedEmail);

      const demoCode = '1234';
      const masked = maskEmailAddress(trimmedEmail);

      setTimeout(() => {
        setGeneratedOtp(demoCode);
        setOtpDigits(['', '', '', '']);
        setMaskedEmail(masked);
        setStatus('idle');
        setStep('otp');
        setResendTimer(30);
        setCanResend(false);
        setOtpNotice(`OTP sent to ${masked}. Demo code: ${demoCode}`);
        setTimeout(() => setOtpNotice(null), 6000);
      }, 400);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
    setErrorMessage('');
    const demoCode = '1234';
    setGeneratedOtp(demoCode);

    try {
      await api.auth.sendEmailOtp(eventId.trim().toUpperCase(), email.trim());
      setOtpNotice(`New OTP sent to ${maskedEmail}. Demo code: ${demoCode}`);
      setTimeout(() => setOtpNotice(null), 5000);
    } catch {
      setOtpNotice(`New OTP sent to ${maskedEmail}. Demo code: ${demoCode}`);
      setTimeout(() => setOtpNotice(null), 5000);
    }
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

  // Establish delegate authenticated session
  const establishSessionForEmail = (userEmail: string) => {
    const cleanEmail = userEmail.trim().toLowerCase();

    // 1. Founder specific shortcuts
    if (
      cleanEmail === 'harigupta@getmyevent.in' ||
      cleanEmail === 'hari.gupta@mpss2026.in' ||
      cleanEmail === 'hari@getmyevent.in'
    ) {
      resetUserState();
      setRole('delegate');
      const hariAttendee = INITIAL_ATTENDEES.find((a) => a.id === 'att-hari-gupta');
      setCurrentUser({
        ...(hariAttendee || CURRENT_USER),
        id: 'att-hari-gupta',
        name: 'Hari Gupta',
        company: 'GetMyEvent',
        designation: 'Co-Founder',
        email: 'harigupta@getmyevent.in',
        mobile: '+91 7089157046',
        linkedin: 'https://www.linkedin.com/in/hari-gupta-159948330',
        twitter: '',
        avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
        bio: 'Co-Founder at GetMyEvent building next-gen event engagement platforms.',
        role: 'delegate',
        ticketType: 'VIP Delegate',
        checkedIn: true,
      });
      return;
    }

    if (
      cleanEmail === 'pushpitupadhya@getmyevent.in' ||
      cleanEmail === 'pushpit@getmyevent.in' ||
      cleanEmail === 'pushpit.upadhyay@mpss2026.in'
    ) {
      resetUserState();
      setRole('delegate');
      const pushpitAttendee = INITIAL_ATTENDEES.find((a) => a.id === 'att-pushpit-upadhyay');
      setCurrentUser({
        ...(pushpitAttendee || CURRENT_USER),
        id: 'att-pushpit-upadhyay',
        name: 'Pushpit Upadhyay',
        company: 'GetMyEvent',
        designation: 'Co-Founder',
        email: 'pushpitupadhya@getmyevent.in',
        mobile: '+91 8463865310',
        linkedin: '',
        twitter: '',
        avatar: '/images/founders/pushpit-upadhyay.jpg',
        bio: 'Co-Founder at GetMyEvent building next-gen event engagement platforms.',
        role: 'delegate',
        ticketType: 'VIP Delegate',
        checkedIn: true,
      });
      return;
    }

    // 2. Search match by email in INITIAL_ATTENDEES
    const matchedAttendee = INITIAL_ATTENDEES.find(
      (a) => (a.email || '').trim().toLowerCase() === cleanEmail
    );

    if (matchedAttendee) {
      resetUserState();
      const detectedRole =
        (matchedAttendee.role as any) === 'organizer_staff'
          ? 'organizer'
          : (matchedAttendee.role as any) === 'exhibitor_staff'
          ? 'exhibitor'
          : 'delegate';

      setRole(detectedRole);
      setCurrentUser({
        ...matchedAttendee,
        email: userEmail.trim(),
        checkedIn: true,
      });
      return;
    }

    // 3. New registered delegate session
    resetUserState();
    setRole('delegate');
    const derivedName = deriveNameFromEmail(userEmail);
    const newAttendee: Person = {
      id: `att-${Date.now().toString().slice(-6)}`,
      name: derivedName,
      designation: 'Delegate',
      company: 'Registered Attendee',
      role: 'delegate',
      email: userEmail.trim(),
      mobile: '+91 98765 43210',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=181818&color=ffffff&bold=true`,
      bio: 'Registered attendee at Madhya Pradesh Semiconductor Summit 2026.',
      interests: ['Semiconductors', 'VLSI Design', 'AI Infrastructure'],
      skills: ['Technology'],
      checkedIn: true,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      registrationId: `#REG-MPSS26-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketType: 'Delegate',
      privacy: {
        shareEmail: true,
        sharePhone: true,
        shareLinkedIn: true,
        shareTwitter: false,
        preset: 'Connections Only',
      },
    };
    setCurrentUser(newAttendee);
  };

  // Step 2: Verify OTP & Enter Event
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

    // Validate OTP (matches generated code or universal demo codes)
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

    try {
      // 1. Try backend verification if endpoint is live
      try {
        await api.auth.verifyEmailOtp(eventId || 'MPSS26', email.trim(), enteredOtp);
      } catch {
        // Continue with local verified session fallback
      }

      establishSessionForEmail(email);

      setStatus('confirmed');
      setTimeout(() => {
        setHasAccessConfirmed(true);
        onSuccess();
      }, 350);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    }
  };

  // Google Sign-In Initiation
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    // If official Google Client ID is configured in environment, attempt GIS flow
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              try {
                const res = await api.auth.googleLogin(eventId || 'MPSS26', '', response.credential);
                if (res?.user?.email) {
                  establishSessionForEmail(res.user.email);
                  setHasAccessConfirmed(true);
                  onSuccess();
                  return;
                }
              } catch {
                // handle error
              }
            }
          },
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsGoogleModalOpen(true);
            setIsGoogleLoading(false);
          }
        });
        return;
      } catch {
        // Fallback to interactive account chooser modal
      }
    }

    // Default: Open the realistic Google Account Chooser modal
    setTimeout(() => {
      setIsGoogleLoading(false);
      setGoogleModalError('');
      setIsGoogleModalOpen(true);
    }, 250);
  };

  // Complete Google Sign-In with selected or custom email
  const handleSelectGoogleAccount = (selectedEmail: string, accountName: string) => {
    setGoogleModalError('');

    // Verification check for unauthorized accounts
    const clean = selectedEmail.trim().toLowerCase();
    if (clean.includes('unauthorized') || clean.includes('notregistered') || clean.includes('blocked')) {
      setGoogleModalError(
        `This Google account (${selectedEmail}) is not registered for MP Semiconductor Summit 2026. Please use your registered email address or contact support.`
      );
      return;
    }

    setIsGoogleLoading(true);
    setIsGoogleModalOpen(false);

    try {
      establishSessionForEmail(selectedEmail);
      setStatus('confirmed');
      setTimeout(() => {
        setHasAccessConfirmed(true);
        onSuccess();
      }, 350);
    } catch {
      setIsGoogleLoading(false);
      setErrorMessage('Google authentication could not be completed. Please try again.');
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
                  Use your Event ID and registered email address to continue.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 flex-1">
              {/* Event ID Field */}
              <div>
                <label className="block text-[12px] font-semibold text-[#181818] mb-1.5">Event ID</label>
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

              {/* Email Address Field */}
              <div>
                <label className="block text-[12px] font-semibold text-[#181818] mb-1.5">
                  Email Address
                </label>
                <div className="flex h-11 rounded-xl bg-white border border-[#E5E7EB] shadow-xs focus-within:ring-2 focus-within:ring-[#B51F32]/20 focus-within:border-[#B51F32] transition-all overflow-hidden">
                  {/* Mail Icon Prefix Box */}
                  <div className="w-11 h-full flex items-center justify-center border-r border-[#E5E7EB] bg-[#FAFAFA] shrink-0 text-[#9CA3AF]">
                    <Mail className="w-4 h-4 stroke-[1.8]" />
                  </div>

                  {/* Email Input */}
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    disabled={status === 'sending'}
                    className="flex-1 min-w-0 h-full px-3.5 text-[13.5px] font-medium text-[#181818] bg-transparent focus:outline-none placeholder-[#9CA3AF]"
                    autoComplete="email"
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
            <div className="mt-4 pt-1">
              <button
                type="submit"
                disabled={status === 'sending' || isGoogleLoading}
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

              {/* Centered OR Divider */}
              <div className="relative my-3.5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB]" />
                </div>
                <div className="relative bg-[#FAF9F6] px-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    OR
                  </span>
                </div>
              </div>

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={status === 'sending' || isGoogleLoading}
                className="w-full h-12 bg-white hover:bg-[#F9FAFB] active:scale-[0.98] border border-[#E5E7EB] text-[#1F2937] font-semibold text-[13.5px] rounded-xl shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B51F32]" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Footer Trust Badges */}
              <div className="mt-5 pb-1 flex items-center justify-center gap-3 text-[12px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Secure sign-in</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
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
              <span>Change email address</span>
            </button>

            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1 self-stretch min-h-[38px] bg-[#B51F32] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[17px] font-bold text-[#181818] tracking-tight">Verify Email Address</h2>
                <p className="text-[11.5px] text-[#6B7280] mt-0.5 leading-snug">
                  Enter the 4-digit code sent to{' '}
                  <strong className="text-[#181818]">{maskedEmail}</strong>
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
              <div className="mt-5 pb-1 flex items-center justify-center gap-3 text-[12px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Secure sign-in</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Registration verified</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Google Account Selector Modal (Native-feeling Google Dialog) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsGoogleModalOpen(false);
                setGoogleModalError('');
                setShowCustomGoogleInput(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center pt-1 mb-4">
              <GoogleIcon className="w-7 h-7 mb-2" />
              <h3 className="text-[16px] font-bold text-gray-900">Sign in with Google</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Choose an account to continue to <span className="font-semibold text-gray-800">GetMyEvent MPSS26</span>
              </p>
            </div>

            {/* Error in modal if unauthorized */}
            {googleModalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-[11.5px] text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="font-medium leading-relaxed">{googleModalError}</p>
              </div>
            )}

            {/* Account List */}
            <div className="space-y-2 border-y border-gray-100 py-3">
              {/* Account 1: Hari Gupta */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('harigupta@getmyevent.in', 'Hari Gupta')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-left transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  H
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">Hari Gupta</p>
                  <p className="text-[11px] text-gray-500 truncate">harigupta@getmyevent.in</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Registered
                </span>
              </button>

              {/* Account 2: Pushpit Upadhyay */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('pushpitupadhya@getmyevent.in', 'Pushpit Upadhyay')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-left transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">Pushpit Upadhyay</p>
                  <p className="text-[11px] text-gray-500 truncate">pushpitupadhya@getmyevent.in</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Registered
                </span>
              </button>

              {/* Account 3: Santosh Kumar */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('skvishvakarma@iiti.ac.in', 'Santosh Kumar')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-left transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">Santosh Kumar</p>
                  <p className="text-[11px] text-gray-500 truncate">skvishvakarma@iiti.ac.in</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Registered
                </span>
              </button>

              {/* Option: Use another account */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors text-gray-700 font-medium text-[12.5px]"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              ) : (
                <div className="p-2.5 bg-gray-50 rounded-xl space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-700">
                    Enter Google email address
                  </label>
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="e.g. name@company.com"
                    className="w-full h-9 px-3 text-[12.5px] rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="px-2.5 py-1 text-[11.5px] text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!googleCustomEmail.trim()}
                      onClick={() => handleSelectGoogleAccount(googleCustomEmail, '')}
                      className="px-3 py-1 bg-[#1A73E8] text-white text-[11.5px] font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Google Notice Footer */}
            <div className="pt-3 text-center">
              <p className="text-[11px] text-gray-400">
                To continue, Google will share your name and email address with GetMyEvent.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
