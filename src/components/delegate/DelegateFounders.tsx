'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { ChevronLeft } from 'lucide-react';

export const DelegateFounders: React.FC = () => {
  const router = useRouter();
  const { setSelectedPersonId } = useStore();

  const founders = [
    {
      id: 'att-hari-gupta',
      name: 'Hari Gupta',
      role: 'Co-Founder',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
      linkedin: 'https://www.linkedin.com/in/hari-gupta-159948330',
    },
    {
      id: 'att-pushpit-upadhyay',
      name: 'Pushpit Upadhyay',
      role: 'Co-Founder',
      avatar: '/images/founders/pushpit-upadhyay.jpg',
      linkedin: 'https://www.linkedin.com/in/pushpit-upadhyay/',
    },
  ];

  const mentors = [
    {
      id: 'att-pratosh-bansal',
      name: 'Dr. Pratosh Bansal',
      role: 'Director',
      institution: 'IET DAVV',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/pratosh_bansal.png',
      linkedin: 'https://www.linkedin.com/in/pratosh-bansal/',
    },
    {
      id: 'att-vaibhav-neema',
      name: 'Prof. Vaibhav Neema',
      role: 'Professor',
      institution: 'IET DAVV',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792451701/vaibhav.png',
      linkedin: 'https://www.linkedin.com/in/dr-vaibhav-neema-5981677a/',
    },
    {
      id: 'att-vaibhav-jain',
      name: 'Prof. Vaibhav Jain',
      role: 'Professor',
      institution: 'IET DAVV',
      avatar: '/images/mentors/vaibhav-jain.jpg',
      linkedin: '',
    },
  ];

  const guidanceTeam = [
    {
      id: 'att-akarshan-tyagi',
      name: 'Akarshan Tyagi',
      role: 'AI Engineer',
      company: 'PhysicsWallah',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442853/akarshan_tyagi.png',
      linkedin: 'https://www.linkedin.com/in/akarshantyagi/',
    },
    {
      id: 'att-rochak-gunavdiya',
      name: 'Rochak Gunavdiya',
      role: 'Founder',
      company: 'Lettswap',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/rochak_gunavdiya.png',
      linkedin: 'https://www.linkedin.com/in/rochak-gunavdiya-28461a331/',
    },
    {
      id: 'att-vipul-jaiswal',
      name: 'Vipul Jaiswal',
      role: 'SDE',
      company: 'Mastercard',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442671/vipul_jaiswal.png',
      linkedin: 'https://www.linkedin.com/in/vipul-jaiswal-08636628b/',
    },
    {
      id: 'att-sarthak-bouddh',
      name: 'Sarthak Bouddh',
      role: 'Backend Engineer',
      company: 'Dice',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442671/sarthak_bouddh.png',
      linkedin: 'https://www.linkedin.com/in/sarthak-bouddh-7805771a1/',
    },
    {
      id: 'att-sagar-kature',
      name: 'Sagar Kature',
      role: 'Software Developer',
      company: 'Zaggle',
      avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/sagar_kature.png',
      linkedin: 'https://www.linkedin.com/in/sagar-kature-b25110291/',
    },
  ];

  return (
    <div className="flex-1 min-h-0 h-full bg-[#F8F7F4] select-none flex flex-col overflow-hidden">
      {/* Top Fixed Header */}
      <div className="shrink-0 bg-[#F8F7F4] px-3.5 z-10 border-b border-[#E5E7EB]">
        <div className="pt-4 pb-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.15em] text-[#6B6B6B] font-semibold mb-0.5">
              GETMYEVENT · FOUNDERS
            </p>
            <h1 className="text-[32px] font-sans font-semibold text-[#181818] tracking-tight leading-none">
              About
            </h1>
          </div>
          <button
            onClick={() => router.push('/delegate/home')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#DEDCD7] text-[#181818] font-bold text-[11px] shadow-sm hover:bg-[#FAF9F5] active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            aria-label="Back to Home"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* Scrollable Story Content */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 pb-8 space-y-4">
        {/* Section 01: Hero Narrative Card (The Blue Box) */}
        <div className="bg-gradient-to-br from-[#18181B] via-[#1E293B] to-[#0F172A] text-white p-4 rounded-[20px] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
              GetMyEvent
            </span>
            <span className="text-[9.5px] font-bold text-[#38BDF8] bg-[#0284C7]/20 border border-[#38BDF8]/40 px-2 py-0.5 rounded-full">
              MPSS 2026 Digital Partner
            </span>
          </div>

          <h2 className="text-[18px] font-bold tracking-tight leading-snug mb-2">
            Pioneering the Digital Experience Layer for Modern Summits
          </h2>

          <p className="text-[12px] text-slate-300 leading-relaxed font-normal">
            We started GetMyEvent with a singular mission: to eliminate the friction of massive, multi-day conferences. Traditional summits relied on static paper guides, missed connections, and disorganized networking. We set out to build an instant, mobile-first companion that puts the entire summit in every delegate&apos;s pocket.
          </p>
        </div>

        {/* Section: Meet the Founders */}
        <div className="space-y-2.5 pt-1">
          {/* Header */}
          <div>
            <h3 className="text-[19px] font-bold text-[#111827] tracking-tight leading-tight">
              Meet the Founders
            </h3>
            <p className="text-[12px] text-[#6B7280] font-normal mt-0.5">
              Behind GetMyEvent
            </p>
          </div>

          {/* 2-Column Founder Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {founders.map((founder) => (
              <div
                key={founder.id}
                onClick={() => setSelectedPersonId(founder.id)}
                className="bg-white rounded-[20px] p-2.5 border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex flex-col group select-none"
              >
                {/* Photo Container */}
                <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(founder.name)}&background=181818&color=ffffff&bold=true`;
                    }}
                  />

                  {/* LinkedIn Badge */}
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin.startsWith('http') ? founder.linkedin : `https://${founder.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[5px] bg-white shadow-xs border border-white/80 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
                      title={`View ${founder.name} on LinkedIn`}
                    >
                      <div className="w-[14px] h-[14px] rounded-[2.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[9px] font-bold leading-none font-sans">
                        in
                      </div>
                    </a>
                  )}
                </div>

                {/* Founder Info */}
                <div className="mt-2 text-center px-0.5">
                  <h4 className="text-[13.5px] font-bold text-[#111827] leading-tight truncate">
                    {founder.name}
                  </h4>
                  <p className="text-[11.5px] text-[#6B7280] font-medium mt-0.5">
                    {founder.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Mentors & Guidance */}
        <div className="space-y-3 pt-2">
          {/* Header */}
          <div>
            <h3 className="text-[19px] font-bold text-[#111827] tracking-tight leading-tight">
              Mentors &amp; Guidance
            </h3>
            <p className="text-[12px] text-[#6B7280] font-normal leading-relaxed mt-1">
              We&apos;re grateful to those who have shared their guidance, experience, and connections as we build GetMyEvent.
            </p>
          </div>

          {/* Subheading: Mentors */}
          <div className="pt-0.5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[13.5px] font-bold text-[#111827] tracking-tight">
                Mentors
              </h4>
              <span className="text-[10.5px] font-semibold text-[#B51F32] flex items-center gap-1 select-none">
                <span>Swipe</span>
                <span className="text-[12px]">→</span>
              </span>
            </div>

            {/* Mentors Cards - 2 cards fit in frame, scroll to see others */}
            <div className="flex gap-3 overflow-x-auto pb-2.5 pt-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  onClick={() => setSelectedPersonId(mentor.id)}
                  className="w-[calc((100%-12px)/2)] min-w-[calc((100%-12px)/2)] shrink-0 bg-white rounded-[20px] p-2.5 border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex flex-col group select-none snap-start"
                >
                  {/* Photo Container - identical to cofounders */}
                  <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=181818&color=ffffff&bold=true`;
                      }}
                    />

                    {/* LinkedIn Badge if available */}
                    {mentor.linkedin && (
                      <a
                        href={mentor.linkedin.startsWith('http') ? mentor.linkedin : `https://${mentor.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[5px] bg-white shadow-xs border border-white/80 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
                        title={`View ${mentor.name} on LinkedIn`}
                      >
                        <div className="w-[14px] h-[14px] rounded-[2.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[9px] font-bold leading-none font-sans">
                          in
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Mentor Info - center aligned like cofounders */}
                  <div className="mt-2 text-center px-0.5 flex-1 flex flex-col justify-start">
                    <h5 className="text-[12.5px] font-bold text-[#111827] leading-tight group-hover:text-[#B51F32] transition-colors min-h-[30px] flex items-center justify-center">
                      {mentor.name}
                    </h5>
                    <p className="text-[11.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">
                      {mentor.role}
                    </p>
                    <p className="text-[10.5px] text-[#9CA3AF] font-normal mt-0.5 leading-tight">
                      {mentor.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subheading: Guidance & Support */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[13.5px] font-bold text-[#111827] tracking-tight">
                Guidance &amp; Support
              </h4>
              <span className="text-[10.5px] font-semibold text-[#B51F32] flex items-center gap-1 select-none">
                <span>Swipe</span>
                <span className="text-[12px]">→</span>
              </span>
            </div>

            {/* Guidance & Support Cards - 2 cards fit in frame, scroll to see others */}
            <div className="flex gap-3 overflow-x-auto pb-2.5 pt-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {guidanceTeam.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedPersonId(member.id)}
                  className="w-[calc((100%-12px)/2)] min-w-[calc((100%-12px)/2)] shrink-0 bg-white rounded-[20px] p-2.5 border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex flex-col group select-none snap-start"
                >
                  {/* Photo Container - identical to cofounders */}
                  <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=181818&color=ffffff&bold=true`;
                      }}
                    />

                    {/* LinkedIn Badge if available */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[5px] bg-white shadow-xs border border-white/80 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
                        title={`View ${member.name} on LinkedIn`}
                      >
                        <div className="w-[14px] h-[14px] rounded-[2.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[9px] font-bold leading-none font-sans">
                          in
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Member Info - center aligned like cofounders */}
                  <div className="mt-2 text-center px-0.5 flex-1 flex flex-col justify-start">
                    <h5 className="text-[12.5px] font-bold text-[#111827] leading-tight group-hover:text-[#B51F32] transition-colors min-h-[30px] flex items-center justify-center">
                      {member.name}
                    </h5>
                    <p className="text-[11.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">
                      {member.role}
                    </p>
                    <p className="text-[10.5px] text-[#9CA3AF] font-normal mt-0.5 leading-tight">
                      {member.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: What's Next */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-xs space-y-2.5">
          <h3 className="text-[17px] font-bold text-[#111827] tracking-tight leading-tight">
            Connecting People. Creating Opportunities.
          </h3>

          <p className="text-[12px] text-[#4B5563] leading-relaxed font-normal">
            We&apos;re building a smarter, more connected event experience where delegates can discover attendees, connect in advance, exchange digital business cards through QR scanning, exhibitors can showcase products and manage enquiries, and organizers can manage registrations, attendees, schedules, and exhibitor details in one place.
          </p>

          <p className="text-[12px] font-bold text-[#111827] leading-relaxed pt-1">
            Our goal is to connect the right people and create lasting value before, during, and after every event.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF9F6] border border-[#EBE7DF] rounded-[18px] p-3 text-center space-y-1">
          <p className="text-[10.5px] font-bold text-[#181818] uppercase tracking-wider">
            Powered by IET DAVV
          </p>
          <div className="pt-0.5">
            <a
              href="https://getmyevent.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11.5px] font-bold text-[#B51F32] hover:underline inline-block cursor-pointer"
            >
              getmyevent.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
