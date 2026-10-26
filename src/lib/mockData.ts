import { GENERATED_ATTENDEES, GENERATED_EXHIBITORS, GENERATED_PRODUCTS } from "./generatedData";
import { sortExhibitors } from "./exhibitorSort";
import {
  EventMetadata,
  Person,
  Product,
  Session,
  Question,
    ExhibitorStats,
  Lead,
  Connection,
  InterestedVisitor,
  PrivacyConsent,
} from '../types';

/**
 * REAL PUBLIC EVENT SEED DATA
 * ===========================
 * Event: Bengaluru Tech Summit 2026
 *
 * Primary public sources:
 * - https://www.bengalurutechsummit.com/
 * - https://www.bengalurutechsummit.com/speakers.php
 * - https://www.bengalurutechsummit.com/programme_at_a_glance_2026.php
 * - https://www.bengalurutechsummit.com/exhibitor-list.php
 *
 * Important:
 * - Public speaker names, titles, companies and speaker photographs are taken
 *   from the official BTS 2026 website.
 * - Public schedule titles/times are taken from the official programme.
 * - The public site does NOT expose individual attendee registration IDs,
 *   check-in times, booth scans, leads, connection history, or
 *   per-product app analytics. Those fields are intentionally empty/zero
 *   instead of inventing values.
 * - Speaker photographs are hotlinked from the official BTS image directory.
 * - The current-user record is only a UI seed. Replace it with the
 *   authenticated user after login.
 */

export const INITIAL_EVENT: EventMetadata = {
  id: 'MPSS26',
  name: 'Madhya Pradesh Semiconductor Summit 2026',
  dates: '23–24 Oct 2026',
  city: 'Indore',
  venue: 'Brilliant Convention Centre',
  status: 'UPCOMING',
  totalRegistered: 4,
  totalCheckedIn: 1120,
  totalExhibitors: 51,
  totalSpeakers: 65,
  totalScans: 6212,
  totalConnections: 3281,
};

const PRIVATE_CONTACT_DEFAULT: PrivacyConsent = {
  preset: 'Connections Only',
  shareEmail: true,
  sharePhone: true,
  shareLinkedIn: true,
  shareTwitter: false,
};

// Current signed-in delegate profile
export const CURRENT_USER: Person = {
  id: 'att-hari-gupta',
  name: 'Hari Gupta',
  designation: '',
  company: '',
  role: 'delegate',
  bio: '',
  interests: [],
  skills: [],
  email: '',
  mobile: '',
  linkedin: '',
  twitter: '',
  avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
  privacy: { ...PRIVATE_CONTACT_DEFAULT },
  checkedIn: true,
  checkInTime: '08:30 AM',
  registrationId: '#5023',
  ticketType: '',
};

export const INITIAL_ATTENDEES: Person[] = [
  {
    id: 'att-sanjeev-keskar',
    name: 'Sanjeev Keskar',
    company: 'Arvind Consultancy',
    designation: 'CEO',
    role: 'delegate',
    ticketType: 'Full Access Delegate Pass',
    checkedIn: true,
    checkInTime: '08:30 AM',
    registrationId: '#REG-MPSS26-1078',
    email: 'sanjeev.keskar@arvindconsultancy.com',
    mobile: '+91 98450 21078',
    linkedin: 'https://www.linkedin.com/in/sanjeevkeskar/',
    twitter: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'CEO at Arvind Consultancy. Veteran semiconductor industry leader and featured summit participant.',
    interests: ['Semiconductors', 'VLSI Design', 'Business Strategy'],
    skills: ['Executive Leadership', 'Ecosystem Building', 'Consulting'],
    privacy: { ...PRIVATE_CONTACT_DEFAULT },
  },
  {
    id: 'att-hari-gupta-7046',
    name: 'Hari Gupta',
    company: 'GetMyEvent',
    designation: 'Co-Founder',
    role: 'delegate',
    ticketType: 'Full Access Delegate Pass',
    checkedIn: true,
    checkInTime: '08:30 AM',
    registrationId: '#REG-MPSS26-7046',
    email: 'harigupta@getmyevent.in',
    mobile: '+91 70891 57046',
    linkedin: 'https://www.linkedin.com/in/harigupta/',
    twitter: '',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
    bio: 'Co-Founder building next-gen event technology and delegate experience platforms.',
    interests: ['Event Tech', 'Networking', 'Startups'],
    skills: ['Platform Engineering', 'Growth', 'Operations'],
    privacy: { ...PRIVATE_CONTACT_DEFAULT },
  },
  {
    id: 'att-pratosh-bansal',
    name: 'Dr. Pratosh Bansal',
    company: 'IET DAVV',
    designation: 'Director',
    role: 'delegate',
    ticketType: 'Director',
    checkedIn: true,
    checkInTime: '08:30 AM',
    registrationId: '#REG-MPSS26-3512',
    email: 'pbansal@ietdavv.edu.in',
    mobile: '+91 99816 43512',
    linkedin: 'https://www.linkedin.com/in/pratosh-bansal/',
    twitter: '',
    avatar: '/images/mentors/pratosh-bansal.jpg',
    bio: 'Director at Institute of Engineering & Technology, Devi Ahilya Vishwavidyalaya (IET-DAVV), Indore. Driving institutional research and industry partnerships.',
    interests: ['Academic Research', 'Engineering Innovation', 'Semiconductor Education'],
    skills: ['Institutional Leadership', 'Research Mentorship', 'Curriculum Innovation'],
    privacy: { ...PRIVATE_CONTACT_DEFAULT },
  },
  {
    id: 'att-hari-gupta',
    name: 'Hari Gupta',
    company: 'EventSphere',
    designation: 'CEO & Founder',
    role: 'delegate',
    ticketType: 'Full Access Delegate Pass',
    checkedIn: true,
    checkInTime: '08:30 AM',
    registrationId: '#REG-MPSS26-5023',
    email: 'hari@eventsphere.com',
    mobile: '+91 98765 43210',
    linkedin: 'https://www.linkedin.com/in/harigupta/',
    twitter: '',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
    bio: 'Founder & CEO building next-gen event engagement platforms.',
    interests: ['Event Tech', 'Semiconductors', 'AI'],
    skills: ['Leadership', 'Product Strategy', 'Platform Architecture'],
    privacy: { ...PRIVATE_CONTACT_DEFAULT },
  },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-req-1',
    personId: 'speaker-jaswinder-ahuja',
    personName: 'Jaswinder Ahuja',
    designation: 'Advisor',
    company: 'India Semiconductor Mission',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'pending',
    type: 'received',
    source: 'direct',
    connectedAt: '2 hours ago',
  },
  {
    id: 'conn-req-2',
    personId: 'speaker-santosh-kumar',
    personName: 'Santosh Kumar',
    designation: 'CEO',
    company: 'Paras Semiconductors',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    status: 'pending',
    type: 'received',
    source: 'direct',
    connectedAt: '1 day ago',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  ...GENERATED_PRODUCTS,
];

export const INITIAL_SESSIONS: Session[] = [
  {
    "id": "mpss26-d1-01",
    "title": "Registration and High Tea",
    "track": "Registration & High Tea",
    "day": 1,
    "timeRange": "10:00 – 11:00",
    "room": "Grand Hall Pre-Function Area · Ground Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Event Operations",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Welcome and badge pickup for delegates, VIPs, and speakers with morning high tea.",
    "takeaways": [
      "Badge collection & summit registration",
      "Summit kit & schedule walkthrough",
      "Morning breakfast networking"
    ],
    "status": "upcoming",
    "attendanceCount": 287,
    "isBookmarked": false,
    "questionsCount": 0
  },
  {
    "id": "mpss26-d1-04",
    "title": "Keynote 1: Global Semiconductor Industry & Technology Trends",
    "track": "Keynote",
    "day": 1,
    "timeRange": "11:00 – 11:30",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Satya Gupta",
    "speakerDesignation": "President",
    "speakerCompany": "VLSI Society of India",
    "speakerId": "speaker-satya-gupta",
    "speakerIds": [
      "speaker-satya-gupta"
    ],
    "panelists": [
      {
        "name": "Satya Gupta",
        "role": "Keynote Speaker",
        "designation": "President",
        "company": "VLSI Society of India",
        "speakerId": "speaker-satya-gupta"
      }
    ],
    "description": "Keynote address analyzing global semiconductor megatrends, advanced nodes, packaging disruptions, and strategic opportunities for India.",
    "takeaways": [
      "Global semiconductor megatrends & market forecasts",
      "Leading-edge vs mature node economics",
      "India's strategic opportunity in global semiconductor value chains"
    ],
    "status": "upcoming",
    "attendanceCount": 880,
    "isBookmarked": false,
    "questionsCount": 4
  },
  {
    "id": "mpss26-d1-05",
    "title": "Keynote 2: Journey of India Semiconductor Mission (ISM 1.0 & ISM 2.0)",
    "track": "Keynote",
    "day": 1,
    "timeRange": "11:30 – 12:00",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Nishit Gupta",
    "speakerDesignation": "Director (Design)",
    "speakerCompany": "ISM, MeitY",
    "speakerId": "speaker-nishit-gupta",
    "speakerIds": [
      "speaker-nishit-gupta"
    ],
    "panelists": [
      {
        "name": "Nishit Gupta",
        "role": "Keynote Speaker",
        "designation": "Director (Design)",
        "company": "ISM, MeitY",
        "speakerId": "speaker-nishit-gupta"
      }
    ],
    "description": "Comprehensive review of the India Semiconductor Mission (ISM 1.0) milestones, project approvals, fiscal incentives, and roadmaps towards domestic semiconductor sovereignty.",
    "takeaways": [
      "Status of approved mega-fabs and ATMP units",
      "Design-linked incentive (DLI) ecosystem",
      "Roadmap toward ISM 2.0 policy framework"
    ],
    "status": "upcoming",
    "attendanceCount": 895,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d1-06",
    "title": "Panel 1: Making Madhya Pradesh Advance Packaging and Testing Hub",
    "track": "Panel Discussion",
    "day": 1,
    "timeRange": "12:00 – 13:00",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Ashok Barnwal, IAS (Chair), Charan Gurumoorthy (Moderator) & 4 others",
    "speakerDesignation": "Advanced Packaging & Testing Panel",
    "speakerCompany": "Govt. of MP, Tata Electronics, Paras Semiconductor, RRP Electronics, H-SEMI, N Cube Semicon",
    "speakerId": "speaker-charan-gurumoorthy",
    "speakerIds": [
      "speaker-ashok-barnwal",
      "speaker-charan-gurumoorthy",
      "speaker-santosh-kumar",
      "speaker-apoorva-raut",
      "speaker-binit-k-singh",
      "speaker-sudhir-naik"
    ],
    "panelists": [
      {
        "name": "Ashok Barnwal, IAS",
        "role": "Chair",
        "designation": "Chief Secretary",
        "company": "Govt. of MP",
        "speakerId": "speaker-ashok-barnwal"
      },
      {
        "name": "Charan Gurumoorthy",
        "role": "Moderator",
        "designation": "Senior Vice President",
        "company": "Tata Electronics",
        "speakerId": "speaker-charan-gurumoorthy"
      },
      {
        "name": "Santosh Kumar",
        "role": "Panelist",
        "designation": "Chief Executive Officer",
        "company": "Paras Semiconductor",
        "speakerId": "speaker-santosh-kumar"
      },
      {
        "name": "Apoorva Raut",
        "role": "Panelist",
        "designation": "Chief Technology Officer",
        "company": "RRP Electronics Limited",
        "speakerId": "speaker-apoorva-raut"
      },
      {
        "name": "Binit K Singh",
        "role": "Panelist",
        "designation": "CEO & Managing Director",
        "company": "H-SEMI Products, Singapore",
        "speakerId": "speaker-binit-k-singh"
      },
      {
        "name": "Sudhir Naik",
        "role": "Panelist",
        "designation": "Founder & CEO",
        "company": "N Cube Semicon Pvt. Ltd.",
        "speakerId": "speaker-sudhir-naik"
      }
    ],
    "description": "Strategic panel examining infrastructure requirements, fiscal incentives, and skill capabilities necessary to establish Madhya Pradesh as a premier hub for Advanced Packaging (OSAT/ATMP) and Testing.",
    "takeaways": [
      "OSAT/ATMP manufacturing requirements and cleanroom readiness",
      "Advanced packaging architectures (2.5D/3D chiplets)",
      "State level incentives and logistics infrastructure"
    ],
    "status": "upcoming",
    "attendanceCount": 760,
    "isBookmarked": false,
    "questionsCount": 5
  },
  {
    "id": "mpss26-d1-07",
    "title": "Round Table on AI Infrastructure",
    "track": "Round Table",
    "day": 1,
    "timeRange": "12:00 – 13:00",
    "room": "Jamawar Hall · Ground Floor",
    "speakerName": "Sanjay Dubey, IAS (Chair), Mohit Bansal (Co-Chair) & 21 participants",
    "speakerDesignation": "AI Infrastructure Leadership Round Table",
    "speakerCompany": "Govt. of MP, Marvell, Synopsys, NXP, Ambient Scientific, Cisco, IIT Indore & more",
    "speakerId": "speaker-madhavendra-shaan-bhatnagar",
    "speakerIds": [
      "speaker-madhavendra-shaan-bhatnagar",
      "speaker-swapnil-sapre",
      "speaker-abhishek-lal",
      "speaker-abhishek-saxena",
      "speaker-ashish-lachhwani",
      "speaker-paruchuri-srijith",
      "speaker-pratibha-verma",
      "speaker-manas-bajpai",
      "speaker-ranveer-singh",
      "speaker-shivakumar"
    ],
    "panelists": [
      {
        "name": "Sanjay Dubey, IAS",
        "role": "Chair",
        "designation": "Additional Chief Secretary, Urban Development & Housing Deptt.",
        "company": "Govt. of MP"
      },
      {
        "name": "Mohit Bansal",
        "role": "Co-Chair",
        "designation": "Director - Rack Scale Switch BU",
        "company": "Marvell Technology"
      },
      {
        "name": "Madhavendra Shaan Bhatnagar",
        "role": "Moderator",
        "designation": "Sr. Director",
        "company": "Synopsys",
        "speakerId": "speaker-madhavendra-shaan-bhatnagar"
      },
      {
        "name": "Swapnil Sapre",
        "role": "Panelist",
        "designation": "Vice President",
        "company": "Ambient Scientific",
        "speakerId": "speaker-swapnil-sapre"
      },
      {
        "name": "Abhishek Lal",
        "role": "Panelist",
        "designation": "Director",
        "company": "NXP",
        "speakerId": "speaker-abhishek-lal"
      },
      {
        "name": "Abhishek Saxena",
        "role": "Panelist",
        "designation": "AI/ML Solution Architect",
        "company": "Eastern Enterprise",
        "speakerId": "speaker-abhishek-saxena"
      },
      {
        "name": "Dr. Anima Saxena",
        "role": "Panelist",
        "designation": "Chief operating officer",
        "company": "Anims Tech. Learn"
      },
      {
        "name": "Ashish Lachhwani",
        "role": "Panelist",
        "designation": "Cofounder and Director",
        "company": "Maieutic",
        "speakerId": "speaker-ashish-lachhwani"
      },
      {
        "name": "Paruchuri Srijith.",
        "role": "Panelist",
        "designation": "Managing Director",
        "company": "Spintronics AI",
        "speakerId": "speaker-paruchuri-srijith"
      },
      {
        "name": "Pratibha Verma",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-pratibha-verma"
      },
      {
        "name": "Manas Bajpai",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "MCTE",
        "speakerId": "speaker-manas-bajpai"
      },
      {
        "name": "Pramod Kumar",
        "role": "Panelist",
        "designation": "Defense & Strategic Technologies",
        "company": "India Army"
      },
      {
        "name": "Yatendra Bhargava",
        "role": "Panelist",
        "designation": "Head of Firmware Platform",
        "company": "Craftifai"
      },
      {
        "name": "Gaurav Mahesh Gupta",
        "role": "Panelist",
        "designation": "Founder/Director",
        "company": "Kishkindha International"
      },
      {
        "name": "Ranveer Singh",
        "role": "Panelist",
        "designation": "Assistant Marking Manager",
        "company": "TrueChip Solution",
        "speakerId": "speaker-ranveer-singh"
      },
      {
        "name": "Atul K",
        "role": "Panelist",
        "designation": "Vice President Engineering",
        "company": "Digicomm Semiconductor"
      },
      {
        "name": "Shivakumar",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Maven Silicon",
        "speakerId": "speaker-shivakumar"
      },
      {
        "name": "Jai Gopal Pandey",
        "role": "Panelist",
        "designation": "Scientist F",
        "company": "CSIR CEERI Pilani"
      },
      {
        "name": "Vivian D",
        "role": "Panelist",
        "designation": "Technical Leadership",
        "company": "CDAC Bangalore"
      },
      {
        "name": "Sajid Khan",
        "role": "Panelist",
        "designation": "ASIC/SoC Verification Engineer",
        "company": "Cisco"
      },
      {
        "name": "Saurabh Sharma",
        "role": "Panelist",
        "designation": "FPGA Design Engineer, Mentor at 1 TOPs",
        "company": "eInfochips / VSI"
      },
      {
        "name": "Sankalp Singh",
        "role": "Panelist",
        "designation": "EDA & AI Systems Engineer",
        "company": "Synopsys"
      },
      {
        "name": "Aruna Tiwari",
        "role": "Panelist",
        "designation": "Professor",
        "company": "IIT Indore"
      }
    ],
    "description": "High-level round table addressing compute infrastructure, sovereign AI clusters, high-bandwidth memory (HBM) integration, and hardware accelerators for national AI workloads.",
    "takeaways": [
      "GPU & AI accelerator cluster architectures",
      "Power, cooling & data center infrastructure requirements in MP",
      "Synergies between chip design and AI software stacks"
    ],
    "status": "upcoming",
    "attendanceCount": 420,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d1-03",
    "title": "Lunch",
    "track": "Dining",
    "day": 1,
    "timeRange": "13:00 – 14:00",
    "room": "Nakshatra Lawn · Ground Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Hospitality Team",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Networking luncheon for all summit delegates, speakers, exhibitors, and government officials.",
    "takeaways": [
      "Executive dining & networking",
      "B2B connection opportunities",
      "Informal discussion of morning sessions"
    ],
    "status": "upcoming",
    "attendanceCount": 850,
    "isBookmarked": false,
    "questionsCount": 0
  },
  {
    "id": "mpss26-d1-02",
    "title": "Inauguration & Dignitaries Address",
    "track": "Plenary",
    "day": 1,
    "timeRange": "14:00 – 16:00",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Honorable Dignitaries & Ministers",
    "speakerDesignation": "State Leadership",
    "speakerCompany": "Government of Madhya Pradesh & MeitY",
    "speakerId": "speaker-dr-mohan-yadav",
    "speakerIds": [
      "speaker-dr-mohan-yadav",
      "speaker-ashok-barnwal",
      "speaker-prof-rajeev-dixit"
    ],
    "panelists": [
      {
        "name": "Dr. Mohan Yadav",
        "role": "Chief Guest",
        "designation": "Honorable Chief Minister",
        "company": "Government of Madhya Pradesh",
        "speakerId": "speaker-dr-mohan-yadav"
      },
      {
        "name": "Ashok Barnwal",
        "role": "Dignitary",
        "designation": "Chief Secretary",
        "company": "Govt. of MP",
        "speakerId": "speaker-ashok-barnwal"
      },
      {
        "name": "Prof. Rajeev Dixit",
        "role": "Dignitary",
        "designation": "Leadership & Advisor",
        "company": "Government of Madhya Pradesh",
        "speakerId": "speaker-prof-rajeev-dixit"
      }
    ],
    "description": "Official inauguration ceremony of MP Semiconductor Summit 2026 with ceremonial lamp lighting, inaugural addresses by state and national leadership, policy unveilings, and key industrial MoU signings.",
    "takeaways": [
      "Release of MP Semiconductor Policy 2026",
      "Key industrial MoU announcements",
      "Vision 2030 for state electronics & fab manufacturing"
    ],
    "status": "upcoming",
    "attendanceCount": 940,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d1-09",
    "title": "Panel 2: Building a Robust Fabless Eco-System in Madhya Pradesh",
    "track": "Panel Discussion",
    "day": 1,
    "timeRange": "16:00 – 16:50",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Neeraj Mandloi, IAS (Chair), Satya Gupta (Moderator) & 5 others",
    "speakerDesignation": "Fabless Leadership Panel",
    "speakerCompany": "Govt. of MP, VLSI Society of India, ISM, INDRIS, Netrasemi, IMEC, Seafund",
    "speakerId": "speaker-satya-gupta",
    "speakerIds": [
      "speaker-neeraj-mandloi",
      "speaker-satya-gupta",
      "speaker-jaswinder-ahuja",
      "speaker-sanjay-gupta",
      "speaker-jyothis-indirabhai",
      "speaker-jatinder-singh"
    ],
    "panelists": [
      {
        "name": "Neeraj Mandloi, IAS",
        "role": "Chair",
        "designation": "Additional Chief Secretary, Department of Industrial Policy and Investment Promotion (DIPIP)",
        "company": "Govt. of MP",
        "speakerId": "speaker-neeraj-mandloi"
      },
      {
        "name": "Satya Gupta",
        "role": "Moderator",
        "designation": "President",
        "company": "VLSI Society of India",
        "speakerId": "speaker-satya-gupta"
      },
      {
        "name": "Jaswinder Ahuja",
        "role": "Panelist",
        "designation": "Advisor",
        "company": "India Semiconductor Mission",
        "speakerId": "speaker-jaswinder-ahuja"
      },
      {
        "name": "Sanjay Gupta",
        "role": "Panelist",
        "designation": "Founder & CEO",
        "company": "INDRIS Technologies",
        "speakerId": "speaker-sanjay-gupta"
      },
      {
        "name": "Jyothis Indirabhai",
        "role": "Panelist",
        "designation": "CEO & Co-founder",
        "company": "Netrasemi Private Limited",
        "speakerId": "speaker-jyothis-indirabhai"
      },
      {
        "name": "Jatinder Singh",
        "role": "Panelist",
        "designation": "Senior Business Development Manager",
        "company": "IMEC",
        "speakerId": "speaker-jatinder-singh"
      },
      {
        "name": "Manoj Agarwal",
        "role": "Panelist",
        "designation": "General Partner",
        "company": "Seafund"
      }
    ],
    "description": "Industry leaders discuss venture capital access, EDA tooling, MPW shuttle access, IP creation, and policy levers needed to nurture world-class fabless semiconductor startups in Madhya Pradesh.",
    "takeaways": [
      "EDA tool accessibility & shared prototyping infrastructure",
      "Venture capital funding for early-stage fabless startups",
      "MPW multi-project wafer shuttle access for Indian innovators"
    ],
    "status": "upcoming",
    "attendanceCount": 690,
    "isBookmarked": false,
    "questionsCount": 4
  },
  {
    "id": "mpss26-d1-10",
    "title": "Round Tables with Directors/Vice-Chancellors",
    "track": "Round Table",
    "day": 1,
    "timeRange": "16:00 – 16:50",
    "room": "Jamawar Hall · Ground Floor",
    "speakerName": "Rajiv Dixit (Chair), Rakesh Singhai (Co-Chair) & 24 Academic Leaders",
    "speakerDesignation": "Higher Education Leadership",
    "speakerCompany": "AIGGPA, DAVV, SGSITS, Bhoj, Medicaps, VIT Bhopal, MANIT & more",
    "speakerId": "speaker-rakesh-singhai",
    "speakerIds": [
      "speaker-prof-rajeev-dixit",
      "speaker-rakesh-singhai",
      "speaker-vaibhav-neema",
      "speaker-puneet-mittal",
      "speaker-ranveer-singh",
      "speaker-shivakumar"
    ],
    "panelists": [
      {
        "name": "Rajiv Dixit",
        "role": "Chair",
        "designation": "Vice Chairman",
        "company": "AIGGPA Bhopal",
        "speakerId": "speaker-prof-rajeev-dixit"
      },
      {
        "name": "Rakesh Singhai",
        "role": "Co-Chair",
        "designation": "Vice-Chancellor",
        "company": "DAVV Indore",
        "speakerId": "speaker-rakesh-singhai"
      },
      {
        "name": "Vaibhav Neema",
        "role": "Moderator",
        "designation": "Professor",
        "company": "IET-DAVV Indore",
        "speakerId": "speaker-vaibhav-neema"
      },
      {
        "name": "Ravi Sindal",
        "role": "Panelist",
        "designation": "Dean of Engineering",
        "company": "DAVV Indore"
      },
      {
        "name": "Milind Dandekar",
        "role": "Panelist",
        "designation": "Vice-Chancellor",
        "company": "Bhoj (Open) University, Bhopal"
      },
      {
        "name": "Nitesh Purohit",
        "role": "Panelist",
        "designation": "Director",
        "company": "SGSITS Indore"
      },
      {
        "name": "Sashi Chandra Sharma",
        "role": "Panelist",
        "designation": "Director",
        "company": "Acropolish Indore"
      },
      {
        "name": "Dilip Kumar Patnaik",
        "role": "Panelist",
        "designation": "Vice-Chancellor",
        "company": "Medicaps University"
      },
      {
        "name": "Satish Kumar Modh",
        "role": "Panelist",
        "designation": "Vice-Chancellor",
        "company": "VIT Bhopal"
      },
      {
        "name": "Namit Gupta",
        "role": "Panelist",
        "designation": "Director",
        "company": "SVVV Indore"
      },
      {
        "name": "Dhru Ghai",
        "role": "Panelist",
        "designation": "Pro-Chancellor",
        "company": "Oriental University, Indore"
      },
      {
        "name": "Akhil Bunglowala",
        "role": "Panelist",
        "designation": "Director",
        "company": "Sri Aurobindo Institute, Indore"
      },
      {
        "name": "Lalji",
        "role": "Panelist",
        "designation": "Dean",
        "company": "SAGE University, Indore"
      },
      {
        "name": "Bhawna Jharia",
        "role": "Panelist",
        "designation": "Professor",
        "company": "JEC, Jabalpur"
      },
      {
        "name": "Seema Verma",
        "role": "Panelist",
        "designation": "Professor",
        "company": "NITTTR, Bhopal"
      },
      {
        "name": "Sangeeta Nakhate",
        "role": "Panelist",
        "designation": "Associate Professor",
        "company": "MANIT, Bhopal"
      },
      {
        "name": "Avinash Rai",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "RGPV, Bhopal"
      },
      {
        "name": "Santanu Talukder",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "IISER Bhopal"
      },
      {
        "name": "Mansoori",
        "role": "Panelist",
        "designation": "Professor",
        "company": "UEC Ujjain"
      },
      {
        "name": "Puneet Mittal",
        "role": "Panelist",
        "designation": "Founder and CEO",
        "company": "VLSI EXPERT",
        "speakerId": "speaker-puneet-mittal"
      },
      {
        "name": "Ranveer Singh",
        "role": "Panelist",
        "designation": "Assistant Marketing Manager",
        "company": "Truechip Solution",
        "speakerId": "speaker-ranveer-singh"
      },
      {
        "name": "Atul K",
        "role": "Panelist",
        "designation": "VP Engg.",
        "company": "Digicomm, Indore"
      },
      {
        "name": "Shivakumar",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Maven Silicon",
        "speakerId": "speaker-shivakumar"
      },
      {
        "name": "Rupesh Dubey",
        "role": "Panelist",
        "designation": "HoD",
        "company": "IPS Academy, Indore"
      },
      {
        "name": "BS Yadav",
        "role": "Panelist",
        "designation": "Chancellor",
        "company": "IES University Bhopal"
      },
      {
        "name": "Bithika Gorai",
        "role": "Panelist",
        "designation": "Associate Professor",
        "company": "ICW, University of Delhi"
      }
    ],
    "description": "Deliberations between university leadership, chancellors, and industry experts on aligning academic curricula with 2nm/3nm VLSI design, semiconductor packaging, and cleanroom technician skills.",
    "takeaways": [
      "Modernizing VLSI and microelectronics university curricula",
      "Industry-academia MoU frameworks and faculty training",
      "Statewide cleanroom lab access for engineering colleges"
    ],
    "status": "upcoming",
    "attendanceCount": 460,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d1-11",
    "title": "Panel 3: Semiconductor Manufacturing & Supply Chain",
    "track": "Panel Discussion",
    "day": 1,
    "timeRange": "16:50 – 17:40",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "Manu Shrivastava, IAS (Chair), Kamaljeet Singh (Moderator) & 4 others",
    "speakerDesignation": "Manufacturing & Supply Chain Panel",
    "speakerCompany": "Government of Madhya Pradesh, SCL Mohali, IIT Indore, ISM, Teradyne, RIR Power Semiconductors",
    "speakerId": "speaker-dr-kamaljeet-singh",
    "speakerIds": [
      "speaker-dr-kamaljeet-singh",
      "speaker-mukesh-kumar",
      "speaker-dr-manish-hooda",
      "speaker-alpa-sood"
    ],
    "panelists": [
      {
        "name": "Manu Shrivastava, IAS",
        "role": "Chair",
        "designation": "Additional Chief Secretary, New & Renewable Energy Department",
        "company": "Government of Madhya Pradesh"
      },
      {
        "name": "Kamaljeet Singh",
        "role": "Moderator",
        "designation": "Director General",
        "company": "SCL Mohali",
        "speakerId": "speaker-dr-kamaljeet-singh"
      },
      {
        "name": "Mukesh Kumar",
        "role": "Panelist",
        "designation": "Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-mukesh-kumar"
      },
      {
        "name": "Manish Hooda",
        "role": "Panelist",
        "designation": "Director (Technology)",
        "company": "India Semiconductor Mission",
        "speakerId": "speaker-dr-manish-hooda"
      },
      {
        "name": "Alpa Sood",
        "role": "Panelist",
        "designation": "Country Manager",
        "company": "Teradyne Inc.",
        "speakerId": "speaker-alpa-sood"
      },
      {
        "name": "Ramesh Trasi",
        "role": "Panelist",
        "designation": "CTO",
        "company": "RIR Power Semiconductors"
      }
    ],
    "description": "In-depth exploration of semiconductor manufacturing supply chains, ultrapure gases, chemicals, wafer handling equipment, and the critical infrastructure required for mega-fab resilience.",
    "takeaways": [
      "Specialty gas, chemical, and equipment supply chains",
      "SCL modernization and commercial manufacturing collaboration",
      "State logistics hubs and uninterrupted power/water guarantees"
    ],
    "status": "upcoming",
    "attendanceCount": 720,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d1-12",
    "title": "Round Table with Semiconductor Fabless Product/IP Companies",
    "track": "Round Table",
    "day": 1,
    "timeRange": "16:50 – 17:40",
    "room": "Jamawar Hall · Ground Floor",
    "speakerName": "Anshuman Raj, IAS (Chair), Krishna Thakur (Co-Chair) & 21 IP Leaders",
    "speakerDesignation": "Fabless Product & IP Round Table",
    "speakerCompany": "MPSEDC, Ex-ST/NXP, IIT Indore, eInfochips, SAC-ISRO, Intel, Softude, HCL Tech & more",
    "speakerId": "speaker-krishna-thakur",
    "speakerIds": [
      "speaker-krishna-thakur",
      "speaker-pratibha-verma",
      "speaker-pulkit-dube",
      "speaker-harishankar-gupta",
      "speaker-puneet-mittal",
      "speaker-harshit-tiwari",
      "speaker-shrihar-pandey",
      "speaker-neha-maheshwari",
      "speaker-shivakumar",
      "speaker-avddesh-sharma",
      "speaker-paruchuri-srijith",
      "speaker-nitin-dodia"
    ],
    "panelists": [
      {
        "name": "Anshuman Raj, IAS",
        "role": "Chair",
        "designation": "Managing Director",
        "company": "MPSEDC"
      },
      {
        "name": "Krishna Thakur",
        "role": "Co-Chair",
        "designation": "Semiconductor Leader",
        "company": "Ex-ST,NXP,L&T Semi",
        "speakerId": "speaker-krishna-thakur"
      },
      {
        "name": "Pratibha Verma",
        "role": "Moderator",
        "designation": "Assistant Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-pratibha-verma"
      },
      {
        "name": "Pulkit Dube",
        "role": "Panelist",
        "designation": "Director - PES",
        "company": "eInfochips",
        "speakerId": "speaker-pulkit-dube"
      },
      {
        "name": "Hahrishankar Gupta",
        "role": "Panelist",
        "designation": "Scientist-SG",
        "company": "SAC-ISRO",
        "speakerId": "speaker-harishankar-gupta"
      },
      {
        "name": "Puneet Mittal",
        "role": "Panelist",
        "designation": "CEO and Founder",
        "company": "VLSI Experts",
        "speakerId": "speaker-puneet-mittal"
      },
      {
        "name": "Harshit Tiwari",
        "role": "Panelist",
        "designation": "Managing Director",
        "company": "Nanodroits Technology",
        "speakerId": "speaker-harshit-tiwari"
      },
      {
        "name": "Nitin Gupta",
        "role": "Panelist",
        "designation": "CoFounder",
        "company": "Signitude Pvt Ltd"
      },
      {
        "name": "Ashish Gupta",
        "role": "Panelist",
        "designation": "CoFounder",
        "company": "Signitude Pvt Ltd"
      },
      {
        "name": "Chandramohan Umapathy",
        "role": "Panelist",
        "designation": "Founder and CTO",
        "company": "Bhanashree Semiconductor"
      },
      {
        "name": "Shrihar Pandey",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Sprams Semiconductors",
        "speakerId": "speaker-shrihar-pandey"
      },
      {
        "name": "Neha Maheshwari",
        "role": "Panelist",
        "designation": "Founder & Exe. Director",
        "company": "TULSHREE",
        "speakerId": "speaker-neha-maheshwari"
      },
      {
        "name": "Shivakumar",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Maven Silicon",
        "speakerId": "speaker-shivakumar"
      },
      {
        "name": "Avddesh Sharma",
        "role": "Panelist",
        "designation": "Technical Partner - DV",
        "company": "AndGate Informatics",
        "speakerId": "speaker-avddesh-sharma"
      },
      {
        "name": "Gaurav Mahesh Gupta",
        "role": "Panelist",
        "designation": "Founder/Director",
        "company": "Kishkindha International"
      },
      {
        "name": "Paruchuri Srijith.",
        "role": "Panelist",
        "designation": "Managing Director",
        "company": "Spintronics AI",
        "speakerId": "speaker-paruchuri-srijith"
      },
      {
        "name": "Ramesh Devani",
        "role": "Panelist",
        "designation": "Director",
        "company": "Inaved Semicon Gujarat"
      },
      {
        "name": "Nitin Dodia",
        "role": "Panelist",
        "designation": "Semiconductor Consultant",
        "company": "Smart Fab Systems",
        "speakerId": "speaker-nitin-dodia"
      },
      {
        "name": "M Santosh",
        "role": "Panelist",
        "designation": "Scientist F",
        "company": "CSIR CEERI PIlani"
      },
      {
        "name": "Narendra Dhakad",
        "role": "Panelist",
        "designation": "EDA Tools Hardware Engineer",
        "company": "Intel"
      },
      {
        "name": "Sunil Rawat",
        "role": "Panelist",
        "designation": "Founder & Managing Director",
        "company": "Softude"
      },
      {
        "name": "Gaurav Kaushal",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "ABV-IIITM Gwalior"
      },
      {
        "name": "Syed Imran Ali",
        "role": "Panelist",
        "designation": "Associate Group Manager - Semi",
        "company": "HCL Tech"
      }
    ],
    "description": "Specialized roundtable bringing together indigenous silicon product companies, IP creators, verification leaders, and government stakeholders to accelerate Indian silicon commercialization.",
    "takeaways": [
      "Domestic IP licensing and verification ecosystem",
      "Support mechanisms for prototype silicon tape-outs",
      "Public-private procurement incentives for Indian silicon"
    ],
    "status": "upcoming",
    "attendanceCount": 480,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d1-13",
    "title": "Madhya Pradesh Semiconductor Policy - 2026 : Discussion with Key Stakeholders",
    "track": "Policy Consultation",
    "day": 1,
    "timeRange": "17:40 – 18:40",
    "room": "Grand Hall · Ground Floor",
    "speakerName": "State Leadership & Key Stakeholders",
    "speakerDesignation": "Government of Madhya Pradesh",
    "speakerCompany": "Department of Science and Technology & MPSeDC",
    "speakerId": "speaker-dr-mohan-yadav",
    "speakerIds": [
      "speaker-dr-mohan-yadav",
      "speaker-ashok-barnwal"
    ],
    "panelists": [
      {
        "name": "State Leadership",
        "role": "Chair",
        "designation": "Government of Madhya Pradesh",
        "company": "Department of Science & Technology"
      },
      {
        "name": "Key Industry Stakeholders",
        "role": "Panelist",
        "designation": "Semiconductor Industry Leaders",
        "company": "Industry Delegation"
      }
    ],
    "description": "Exclusive high-level deliberation with industry leaders, investors, and state officials on the implementation, fiscal incentives, land allotment, and customized packages under the Madhya Pradesh Semiconductor Policy 2026.",
    "takeaways": [
      "Incentive structures & customized fiscal packages",
      "Plug-and-play fabless infrastructure & EMC 2.0 readiness",
      "Direct stakeholder inputs for state policy notifications"
    ],
    "status": "upcoming",
    "attendanceCount": 650,
    "isBookmarked": false,
    "questionsCount": 0
  },
    {
    "id": "mpss26-d2-01",
    "title": "Keynote 1: Chips for Strategic Sovereignty",
    "track": "Keynote",
    "day": 2,
    "timeRange": "10:00 – 10:30",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Major Gen (Retd) Shivendera Bhattacharya",
    "speakerDesignation": "Indian Army (Retd)",
    "speakerCompany": "Defense & Strategic Technologies",
    "speakerId": "speaker-major-gen-retd-shivender-bhattacharya",
    "speakerIds": [
      "speaker-major-gen-retd-shivender-bhattacharya"
    ],
    "panelists": [
      {
        "name": "Major Gen (Retd) Shivendera Bhattacharya",
        "role": "Keynote Speaker",
        "designation": "Indian Army (Retd)",
        "company": "Defense & Strategic Technologies",
        "speakerId": "speaker-major-gen-retd-shivender-bhattacharya"
      }
    ],
    "description": "Keynote on the critical imperative of trusted semiconductor foundries, indigenous secure processors, radiation-hardened silicon, and strategic microelectronics autonomy for national security.",
    "takeaways": [
      "Trusted foundry principles for defense systems",
      "Indigenous secure cryptoprocessors & rad-hard silicon",
      "Strategic electronics sovereignty imperatives"
    ],
    "status": "upcoming",
    "attendanceCount": 840,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d2-02",
    "title": "Keynote 2: Photonics IC Design and Technology",
    "track": "Keynote",
    "day": 2,
    "timeRange": "10:30 – 11:00",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Prof. Mukesh Kumar",
    "speakerDesignation": "Professor",
    "speakerCompany": "IIT Indore",
    "speakerId": "speaker-mukesh-kumar",
    "speakerIds": [
      "speaker-mukesh-kumar"
    ],
    "panelists": [
      {
        "name": "Prof. Mukesh Kumar",
        "role": "Keynote Speaker",
        "designation": "Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-mukesh-kumar"
      }
    ],
    "description": "Keynote presentation on integrated photonics, Silicon Photonics (SiPh), optical inter-chip interconnects, optical computing, and cutting-edge PIC research emerging from IIT Indore.",
    "takeaways": [
      "Silicon photonics & co-packaged optics (CPO)",
      "Next-generation high-bandwidth optical interconnects",
      "State of photonics research and fabrication in India"
    ],
    "status": "upcoming",
    "attendanceCount": 810,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d2-03",
    "title": "Panel 1: AI for Chip & Chips for AI",
    "track": "Panel Discussion",
    "day": 2,
    "timeRange": "11:00 – 11:50",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Anshuman Raj, IAS (Chair), Chitra Hariharan (Moderator) & 5 others",
    "speakerDesignation": "AI & Silicon Leadership Panel",
    "speakerCompany": "MPSEDC, Renesas, Intel, Maieutic, Synopsys, VLSI EXPERT, Cadence",
    "speakerId": "speaker-chitra-hariharan",
    "speakerIds": [
      "speaker-chitra-hariharan",
      "speaker-arpan-sircar",
      "speaker-ashish-lachhwani",
      "speaker-swapnil-garge",
      "speaker-puneet-mittal",
      "speaker-channakeshav-ananth"
    ],
    "panelists": [
      {
        "name": "Anshuman Raj, IAS",
        "role": "Chair",
        "designation": "Managing Director",
        "company": "MPSEDC"
      },
      {
        "name": "Chitra Hariharan",
        "role": "Moderator",
        "designation": "Director Govt. Affairs",
        "company": "Renesas",
        "speakerId": "speaker-chitra-hariharan"
      },
      {
        "name": "Arpan Sircar",
        "role": "Panelist",
        "designation": "Senior Principal Engineer",
        "company": "Intel",
        "speakerId": "speaker-arpan-sircar"
      },
      {
        "name": "Ashish Lachhwani",
        "role": "Panelist",
        "designation": "Cofounder and Director",
        "company": "Maieutic",
        "speakerId": "speaker-ashish-lachhwani"
      },
      {
        "name": "Swapnil Garge",
        "role": "Panelist",
        "designation": "Architect",
        "company": "Synopsys",
        "speakerId": "speaker-swapnil-garge"
      },
      {
        "name": "Puneet Mittal",
        "role": "Panelist",
        "designation": "Founder and CEO",
        "company": "VLSI EXPERT",
        "speakerId": "speaker-puneet-mittal"
      },
      {
        "name": "Channakeshav Ananth",
        "role": "Panelist",
        "designation": "Sr. Group Director",
        "company": "Cadence",
        "speakerId": "speaker-channakeshav-ananth"
      }
    ],
    "description": "Dual-focus panel exploring how AI algorithms transform EDA synthesis and place-and-route, while novel silicon architectures are purpose-built to accelerate generative AI workloads.",
    "takeaways": [
      "Generative AI and machine learning inside modern EDA tools",
      "Dedicated AI accelerator silicon vs general GPU compute",
      "Energy efficiency and thermal boundaries in edge AI silicon"
    ],
    "status": "upcoming",
    "attendanceCount": 780,
    "isBookmarked": false,
    "questionsCount": 4
  },
  {
    "id": "mpss26-d2-tea-1",
    "title": "Tea",
    "track": "Tea Break",
    "day": 2,
    "timeRange": "11:50 – 12:20",
    "room": "Jamawar Hall Pre-Function Area · Ground Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Hospitality Team",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Morning tea break and informal networking in the pre-function area.",
    "takeaways": [
      "Morning tea networking",
      "Interchange between delegates, speakers, and exhibitors",
      "Refreshment before breakout tracks"
    ],
    "status": "upcoming",
    "attendanceCount": 620,
    "isBookmarked": false,
    "questionsCount": 0
  },
  {
    "id": "mpss26-d2-04",
    "title": "Panel 2: Making India Electronics Product Nation",
    "track": "Panel Discussion",
    "day": 2,
    "timeRange": "12:20 – 13:10",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Swatantra Kumar Singh, IAS (Chair), Sanjeev Sehgal (Moderator) & 5 others",
    "speakerDesignation": "Electronics Manufacturing & OEM Panel",
    "speakerCompany": "Govt. of M.P., Sparsh CCTV, Genus Power, SwadesIC, SAC-ISRO, HLBS Tech, Workie",
    "speakerId": "speaker-sanjeev-sehgal",
    "speakerIds": [
      "speaker-sanjeev-sehgal",
      "speaker-ranvir-singh-rathore",
      "speaker-chander-pal",
      "speaker-harishankar-gupta",
      "speaker-mitesh-kumar-lokwani",
      "speaker-sawan-laddha"
    ],
    "panelists": [
      {
        "name": "Swatantra Kumar Singh, IAS",
        "role": "Chair",
        "designation": "Secretary, Fishermen Welfare & Fisheries Development Department",
        "company": "Govt. of M.P."
      },
      {
        "name": "Sanjeev Sehgal",
        "role": "Moderator",
        "designation": "Founder and MD",
        "company": "Sparsh CCTV",
        "speakerId": "speaker-sanjeev-sehgal"
      },
      {
        "name": "Ranvir Singh Rathore",
        "role": "Panelist",
        "designation": "Chief Technology Officer",
        "company": "Genus Power and Smart Meter",
        "speakerId": "speaker-ranvir-singh-rathore"
      },
      {
        "name": "Chander Pal",
        "role": "Panelist",
        "designation": "Chief Business Officer",
        "company": "SwadesIC",
        "speakerId": "speaker-chander-pal"
      },
      {
        "name": "Harishankar Gupta",
        "role": "Panelist",
        "designation": "Scientist-SG",
        "company": "SAC-ISRO",
        "speakerId": "speaker-harishankar-gupta"
      },
      {
        "name": "Mitesh Kumar Lokwani",
        "role": "Panelist",
        "designation": "CMD",
        "company": "HLBS Tech Pvt. Ltd",
        "speakerId": "speaker-mitesh-kumar-lokwani"
      },
      {
        "name": "Sawan Laddha",
        "role": "Panelist",
        "designation": "Founder",
        "company": "Workie",
        "speakerId": "speaker-sawan-laddha"
      }
    ],
    "description": "Shifting India from electronics assembly to indigenous product creation. Discussion covers smart metering, surveillance electronics, telecom hardware, and indigenous component integration.",
    "takeaways": [
      "Transitioning from contract manufacturing (EMS) to indigenous ODM",
      "Smart energy, IoT, and defense electronics product lines",
      "Policy mechanisms to support domestic BOM component sourcing"
    ],
    "status": "upcoming",
    "attendanceCount": 740,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d2-05",
    "title": "Round Table on Photonics and Quantum",
    "track": "Round Table",
    "day": 2,
    "timeRange": "12:20 – 13:10",
    "room": "Lilac · 2nd Floor",
    "speakerName": "Anshuman Raj, IAS (Chair), Santosh Kumar Vishvakarma (Co-Chair) & 22 Experts",
    "speakerDesignation": "Photonics & Quantum Round Table",
    "speakerCompany": "MPSEDC, IIT Indore, IIT Roorkee, Pramatra Space, QNu Labs, RRCAT, DRDO & more",
    "speakerId": "speaker-mukesh-kumar",
    "speakerIds": [
      "speaker-mukesh-kumar",
      "speaker-ajay-kumar-kushwaha",
      "speaker-rajesh-kumar",
      "speaker-shailendra-kumar-varshney",
      "speaker-lalit-singh",
      "speaker-ankur-raina",
      "speaker-vinod-parmar",
      "speaker-amit-agrawal",
      "speaker-shashank-gupta",
      "speaker-j-t-andrews",
      "speaker-vishal-chatrath"
    ],
    "panelists": [
      {
        "name": "Anshuman Raj, IAS",
        "role": "Chair",
        "designation": "Managing Director",
        "company": "MPSEDC"
      },
      {
        "name": "Santosh Kumar Vishvakarma",
        "role": "Co-Chair",
        "designation": "Professor",
        "company": "IIT Indore"
      },
      {
        "name": "Mukesh Kumar",
        "role": "Moderator",
        "designation": "Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-mukesh-kumar"
      },
      {
        "name": "Ajay Kumar Kushwaha",
        "role": "Panelist",
        "designation": "Asso. Prof.",
        "company": "IIT Indore",
        "speakerId": "speaker-ajay-kumar-kushwaha"
      },
      {
        "name": "Rajesh Kumar",
        "role": "Panelist",
        "designation": "Professor",
        "company": "IIT Roorkee",
        "speakerId": "speaker-rajesh-kumar"
      },
      {
        "name": "Richa Hukumchand",
        "role": "Panelist",
        "designation": "Founder and CEO",
        "company": "Pramatra Space"
      },
      {
        "name": "Shailendra Kumar Varshney",
        "role": "Panelist",
        "designation": "Professor",
        "company": "IIT Kharagpur",
        "speakerId": "speaker-shailendra-kumar-varshney"
      },
      {
        "name": "Lalit Singh",
        "role": "Panelist",
        "designation": "Asst. Prof.",
        "company": "PDPU",
        "speakerId": "speaker-lalit-singh"
      },
      {
        "name": "Ankur Raina",
        "role": "Panelist",
        "designation": "Asst Prof.",
        "company": "IISER Bhopal",
        "speakerId": "speaker-ankur-raina"
      },
      {
        "name": "Himanshu Srivastava",
        "role": "Panelist",
        "designation": "Scientific Officer-F",
        "company": "RRCAT Indore"
      },
      {
        "name": "Piyush Saxena",
        "role": "Panelist",
        "designation": "Scientist",
        "company": "RRCAT Indore"
      },
      {
        "name": "Vinod Parmar",
        "role": "Panelist",
        "designation": "Scientist",
        "company": "CSIO Chandigarh",
        "speakerId": "speaker-vinod-parmar"
      },
      {
        "name": "Amit Agrawal",
        "role": "Panelist",
        "designation": "Scientist",
        "company": "IRDE-DRDO",
        "speakerId": "speaker-amit-agrawal"
      },
      {
        "name": "Amit Saxena",
        "role": "Panelist",
        "designation": "Scientist",
        "company": "CDAC Pune"
      },
      {
        "name": "Shashank Gupta",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "IIT Indore",
        "speakerId": "speaker-shashank-gupta"
      },
      {
        "name": "Amit Kumar",
        "role": "Panelist",
        "designation": "R&D Lead",
        "company": "QNu Labs"
      },
      {
        "name": "Aditi",
        "role": "Panelist",
        "designation": "Co-founder",
        "company": "Quafluence"
      },
      {
        "name": "J. T. Andrews",
        "role": "Panelist",
        "designation": "Professor",
        "company": "SGSITS",
        "speakerId": "speaker-j-t-andrews"
      },
      {
        "name": "Vishal Chatrath",
        "role": "Panelist",
        "designation": "Co-Founder and CEO",
        "company": "QuantrolOx",
        "speakerId": "speaker-vishal-chatrath"
      },
      {
        "name": "Anurag for Nagendra",
        "role": "Panelist",
        "designation": "Director Corporate Affairs (Founder, CEO and Chairman QpiAI)",
        "company": "QPI"
      },
      {
        "name": "Mayank Joshi",
        "role": "Panelist",
        "designation": "Faculty",
        "company": "MCTE"
      },
      {
        "name": "Nitesh Kashyap",
        "role": "Panelist",
        "designation": "Assistant Professor",
        "company": "NIT Jalandhar"
      },
      {
        "name": "Mr William Dobson",
        "role": "Panelist",
        "designation": "CMD",
        "company": "Intelligence Ltd"
      },
      {
        "name": "Tanmay Gupta, PhD",
        "role": "Panelist",
        "designation": "Founder and Director",
        "company": "Oxbridge Frontier Intelligence"
      }
    ],
    "description": "Specialized roundtable examining quantum key distribution (QKD), photonic integrated circuits, quantum processors, and defense applications.",
    "takeaways": [
      "Quantum computing hardware architectures and cryogenic control",
      "Photonic integrated circuits (PICs) for telecom and data centers",
      "Collaborative research between RRCAT, DRDO, IITs, and industry"
    ],
    "status": "upcoming",
    "attendanceCount": 430,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d2-06",
    "title": "Lunch",
    "track": "Dining",
    "day": 2,
    "timeRange": "13:10 – 14:00",
    "room": "Tulip · 1st Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Hospitality Team",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Networking luncheon for summit delegates, exhibitors, speakers, and dignitaries.",
    "takeaways": [
      "Delegate luncheon & B2B networking",
      "Informal discussion of morning sessions",
      "Exhibitor floor demos"
    ],
    "status": "upcoming",
    "attendanceCount": 820,
    "isBookmarked": false,
    "questionsCount": 0
  },
  {
    "id": "mpss26-d2-07",
    "title": "Keynote 3: Madhya Pradesh: Powering India’s Next $10 Billion AI & Semiconductor Revolution",
    "track": "Keynote",
    "day": 2,
    "timeRange": "14:00 – 14:30",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Narendra Sen",
    "speakerDesignation": "Founder",
    "speakerCompany": "RackBank, Indore",
    "speakerId": "speaker-narendra-sen",
    "speakerIds": [
      "speaker-narendra-sen"
    ],
    "panelists": [
      {
        "name": "Narendra Sen",
        "role": "Keynote Speaker",
        "designation": "Founder",
        "company": "RackBank, Indore",
        "speakerId": "speaker-narendra-sen"
      }
    ],
    "description": "Keynote presentation on green data centers, sovereign GPU cloud infrastructure, gigawatt-scale power availability, and Madhya Pradesh's pivotal role in hosting Asia's fastest AI training clusters.",
    "takeaways": [
      "Green data centers & sovereign AI cloud capacity in MP",
      "Gigawatt-scale clean energy infrastructure advantages",
      "Economic multipliers for tech ecosystems and jobs in Central India"
    ],
    "status": "upcoming",
    "attendanceCount": 860,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d2-kn4",
    "title": "Keynote 4: Industry Academia Collaboration for Talent Development",
    "track": "Keynote",
    "day": 2,
    "timeRange": "14:30 – 15:00",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Anand Kumar",
    "speakerDesignation": "Managing Director",
    "speakerCompany": "STMicroelectronics",
    "speakerId": "speaker-anand-kumar-keynote",
    "speakerIds": [
      "speaker-anand-kumar-keynote"
    ],
    "panelists": [
      {
        "name": "Anand Kumar",
        "role": "Keynote Speaker",
        "designation": "Managing Director",
        "company": "STMicroelectronics",
        "speakerId": "speaker-anand-kumar-keynote"
      }
    ],
    "description": "Keynote address examining successful frameworks for deep industry-academia collaboration, joint research centers of excellence, curriculum modernization, and tapeout-ready talent development for the semiconductor industry.",
    "takeaways": [
      "Industry-aligned semiconductor curriculum and VLSI labs",
      "Joint research programs and co-funded university incubators",
      "Bridging the engineering skill gap for fabs and design houses"
    ],
    "status": "upcoming",
    "attendanceCount": 810,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d2-08",
    "title": "Panel 3: Growth Strategies of GCC and Design Services in Madhya Pradesh",
    "track": "Panel Discussion",
    "day": 2,
    "timeRange": "15:00 – 15:50",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "John Kingsley A.R, IAS (Chair), Nitin Kishor (Moderator) & 5 others",
    "speakerDesignation": "GCC & Design Services Panel",
    "speakerCompany": "Govt. of MP, Truechip Solutions, Quest Global, Mirafra, UST Global, Digicomm, LeadSoc",
    "speakerId": "speaker-john-kingsley",
    "speakerIds": [
      "speaker-john-kingsley",
      "speaker-nitin-kishor",
      "speaker-sumedha-limaye",
      "speaker-alok-kuchlous",
      "speaker-manish-bali",
      "speaker-saurabh-dhingra",
      "speaker-suman-dwivedi"
    ],
    "panelists": [
      {
        "name": "John Kingsley A.R, IAS",
        "role": "Chair",
        "designation": "Secretary, MSME",
        "company": "Govt. of MP",
        "speakerId": "speaker-john-kingsley"
      },
      {
        "name": "Nitin Kishor",
        "role": "Moderator",
        "designation": "CEO",
        "company": "Truechip Solutions",
        "speakerId": "speaker-nitin-kishor"
      },
      {
        "name": "Sumedha Limaye",
        "role": "Panelist",
        "designation": "Vice President",
        "company": "Quest Global",
        "speakerId": "speaker-sumedha-limaye"
      },
      {
        "name": "Alok Kuchlous",
        "role": "Panelist",
        "designation": "Founder & CEO",
        "company": "Mirafra",
        "speakerId": "speaker-alok-kuchlous"
      },
      {
        "name": "Manish Bali",
        "role": "Panelist",
        "designation": "Senior Director & Head",
        "company": "UST Global",
        "speakerId": "speaker-manish-bali"
      },
      {
        "name": "Saurabh Dhingra",
        "role": "Panelist",
        "designation": "Managing Director",
        "company": "Digicomm Semiconductors",
        "speakerId": "speaker-saurabh-dhingra"
      },
      {
        "name": "Suman Dwivedi",
        "role": "Panelist",
        "designation": "Director - Engineering",
        "company": "LeadSoc Technologies",
        "speakerId": "speaker-suman-dwivedi"
      }
    ],
    "description": "Senior executives examine the expansion of Global Capability Centers (GCCs), semiconductor design service centers, talent retention, and engineering infrastructure in tier-2 cities like Indore and Bhopal.",
    "takeaways": [
      "Establishing VLSI & embedded systems GCCs in Madhya Pradesh",
      "Cost arbitrage, quality of life, and talent stickiness in MP",
      "State policy subsidies for engineering center setups"
    ],
    "status": "upcoming",
    "attendanceCount": 750,
    "isBookmarked": false,
    "questionsCount": 4
  },
  {
    "id": "mpss26-d2-10",
    "title": "Tea",
    "track": "Tea Break",
    "day": 2,
    "timeRange": "15:50 – 16:20",
    "room": "Jamawar Hall Pre-Function Area · Ground Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Hospitality Team",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Afternoon tea break and informal delegate networking.",
    "takeaways": [
      "Afternoon tea networking",
      "Delegates and speakers interchange",
      "Exhibition visits"
    ],
    "status": "upcoming",
    "attendanceCount": 680,
    "isBookmarked": false,
    "questionsCount": 0
  },
  {
    "id": "mpss26-d2-09",
    "title": "Round Table with MSME Industries",
    "track": "Round Table",
    "day": 2,
    "timeRange": "16:20 – 17:10",
    "room": "Lilac · 2nd Floor",
    "speakerName": "MPSEDC PS/MD/ED (Chair), Ajay Kumar Kushwaha (Co-Chair) & 30 MSME Leaders",
    "speakerDesignation": "MSME Industrial Leadership",
    "speakerCompany": "HLBS Tech, Scientech, Kailtech, Datatrack, ElectroAds & more",
    "speakerId": "speaker-mitesh-kumar-lokwani",
    "speakerIds": [
      "speaker-ajay-kumar-kushwaha",
      "speaker-mitesh-kumar-lokwani",
      "speaker-ambrish-kela",
      "speaker-rajeev-mittal",
      "speaker-ashish-kolarkar",
      "speaker-sushil-malhotra",
      "speaker-rahul-tiwari",
      "speaker-pratyush-goyal"
    ],
    "panelists": [
      {
        "name": "MPSEDC PS/MD/ED",
        "role": "Chair",
        "designation": "Executive Leadership",
        "company": "MPSEDC, Government of Madhya Pradesh"
      },
      {
        "name": "Ajay Kumar Kushwaha",
        "role": "Co-Chair",
        "designation": "Asso. Professor and HOD",
        "company": "IIT Indore",
        "speakerId": "speaker-ajay-kumar-kushwaha"
      },
      {
        "name": "Mitesh Kumar Lokwani",
        "role": "Moderator",
        "designation": "CMD",
        "company": "HLBS Tech Pvt. Ltd",
        "speakerId": "speaker-mitesh-kumar-lokwani"
      },
      {
        "name": "Ambrish Kela",
        "role": "Panelist",
        "designation": "MD",
        "company": "Scientech Indore",
        "speakerId": "speaker-ambrish-kela"
      },
      {
        "name": "Akash Sethi / Vikash Gokhale",
        "role": "Panelist",
        "designation": "Executive Leadership",
        "company": "Shree Pacetronix"
      },
      {
        "name": "Rajeev Ranjan",
        "role": "Panelist",
        "designation": "Executive",
        "company": "Gatiman Auto Pvt. Ltd."
      },
      {
        "name": "Neeta Goel",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Bioline"
      },
      {
        "name": "Sudhanshu Sharma",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Galaxy Components P. Ltd."
      },
      {
        "name": "Nilesh Jain",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Innovative Clad Solutions P. L."
      },
      {
        "name": "Puneet Gupta",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Kach Motors Pvt. Ltd."
      },
      {
        "name": "Dinesh Mittal",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Mittal Appliances Limited"
      },
      {
        "name": "Devendra Porwal",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "PorwalAuto Components Ltd."
      },
      {
        "name": "Sunil Chordia",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Rajratan Global Wire Ltd."
      },
      {
        "name": "Girdhar Garg",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Shape-N-Size Casting P. Ltd."
      },
      {
        "name": "Rajendra Ekbote",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Swarah Technocran"
      },
      {
        "name": "Ravi Advani",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Richline"
      },
      {
        "name": "Manish Pandey",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Jetwave"
      },
      {
        "name": "Rajiv Mittal",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Dylog ITES Private Limited",
        "speakerId": "speaker-rajeev-mittal"
      },
      {
        "name": "Ajay Singh",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Dronobotics Aviation Developers LLP"
      },
      {
        "name": "Vijay Lokhande",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Linkage Technologies"
      },
      {
        "name": "Rajendra Patel",
        "role": "Panelist",
        "designation": "Cluster Representative",
        "company": "Electronics & Electricals Cluster"
      },
      {
        "name": "Ashish Kolarkar",
        "role": "Panelist",
        "designation": "CEO and Founder",
        "company": "Datatrack",
        "speakerId": "speaker-ashish-kolarkar"
      },
      {
        "name": "Sushil Malhotra",
        "role": "Panelist",
        "designation": "Managing Director",
        "company": "Kailtech Test & Research Centre Pvt Ltd",
        "speakerId": "speaker-sushil-malhotra"
      },
      {
        "name": "Ashish Tiwari",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "PG Tech Pvt Ltd"
      },
      {
        "name": "Rahul Tiwari",
        "role": "Panelist",
        "designation": "Technical Head",
        "company": "ElectroAds",
        "speakerId": "speaker-rahul-tiwari"
      },
      {
        "name": "Siddharth Dev",
        "role": "Panelist",
        "designation": "Director",
        "company": "Technido Industrial Engineering LLP"
      },
      {
        "name": "Vishesh Kasliwal",
        "role": "Panelist",
        "designation": "Director",
        "company": "Narayani Industries"
      },
      {
        "name": "Varun Toshniwal",
        "role": "Panelist",
        "designation": "Engineering Manager",
        "company": "Nivo Controls Pvt Ltd"
      },
      {
        "name": "Vaibhav Jaiswal",
        "role": "Panelist",
        "designation": "Leadership",
        "company": "Circuit Solutions"
      },
      {
        "name": "Pratyush Goyal",
        "role": "Panelist",
        "designation": "Managing Partner",
        "company": "Shubham Electrotech",
        "speakerId": "speaker-pratyush-goyal"
      }
    ],
    "description": "Dynamic roundtable bringing regional MSME manufacturing and electronics enterprises together to explore component vendor integration, testing certifications, and state cluster schemes.",
    "takeaways": [
      "Integrating local MSMEs into Tier-1 semiconductor supply chains",
      "Testing and certification support (Kailtech, Scientech)",
      "State financial and cluster subsidies for precision engineering"
    ],
    "status": "upcoming",
    "attendanceCount": 510,
    "isBookmarked": false,
    "questionsCount": 2
  },
  {
    "id": "mpss26-d2-11",
    "title": "Panel 4: Associations, Societies, Consulting Companies & Public Bodies",
    "track": "Panel Discussion",
    "day": 2,
    "timeRange": "16:20 – 17:10",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Chandramauli Shukla (Chair), Anand Kumar (Moderator) & 6 others",
    "speakerDesignation": "Industry Bodies & Consulting Panel",
    "speakerCompany": "MPIDC, STMicroelectronics, Free Press, E&Y, ISIG India, PWC, ICEA, ELCINA",
    "speakerId": "speaker-anand-kumar-panel",
    "speakerIds": [
      "speaker-anand-kumar-panel",
      "speaker-akshay-k-waghmode",
      "speaker-shalu-agarwal",
      "speaker-amit-rai",
      "speaker-aashish-saurikhia",
      "speaker-sundeep-saxena"
    ],
    "panelists": [
      {
        "name": "Chandramauli Shukla",
        "role": "Chair",
        "designation": "MD, MPIDC",
        "company": "MPIDC"
      },
      {
        "name": "Anand Kumar",
        "role": "Moderator",
        "designation": "Managing Director",
        "company": "STMicroelectronics",
        "speakerId": "speaker-anand-kumar-panel"
      },
      {
        "name": "Atul Gautam",
        "role": "Panelist",
        "designation": "Indore City Chief",
        "company": "Free Press"
      },
      {
        "name": "Akshay K. Waghmode",
        "role": "Panelist",
        "designation": "Sr. Manager, Tax & Incentives",
        "company": "E&Y",
        "speakerId": "speaker-akshay-k-waghmode"
      },
      {
        "name": "Shalu Agarwal",
        "role": "Panelist",
        "designation": "GM, India & Head of Power Semiconductor",
        "company": "ISIG India",
        "speakerId": "speaker-shalu-agarwal"
      },
      {
        "name": "Amit Rai",
        "role": "Panelist",
        "designation": "Director",
        "company": "PWC",
        "speakerId": "speaker-amit-rai"
      },
      {
        "name": "Aashish Saurikhia",
        "role": "Panelist",
        "designation": "Senior Director - Public Policy",
        "company": "ICEA",
        "speakerId": "speaker-aashish-saurikhia"
      },
      {
        "name": "Sundeep Saxena",
        "role": "Panelist",
        "designation": "Secretary & Chief Services Officer",
        "company": "ELCINA",
        "speakerId": "speaker-sundeep-saxena"
      }
    ],
    "description": "Perspectives from leading national industry associations (ICEA, ELCINA, CIMEI, SemiIndia, ISIG) and Big 4 advisors on national policy coordination, state competitiveness, and global investor attraction.",
    "takeaways": [
      "National trade associations' role in shaping policy",
      "State tax, capital expenditure, and power incentive evaluations",
      "Benchmarking Madhya Pradesh against international electronics manufacturing clusters"
    ],
    "status": "upcoming",
    "attendanceCount": 710,
    "isBookmarked": false,
    "questionsCount": 3
  },
  {
    "id": "mpss26-d2-12",
    "title": "Panel 5: Talent Development, R&D and Innovation for Chip Design & Semiconductor Technology",
    "track": "Panel Discussion",
    "day": 2,
    "timeRange": "17:10 – 18:00",
    "room": "Imperial Hall · 1st Floor",
    "speakerName": "Manish Singh, IAS (Chair), M. M. Tripathi (Moderator) & 5 others",
    "speakerDesignation": "Education, R&D & Innovation Panel",
    "speakerCompany": "Govt. of MP, NIELIT MeitY, IIT Kanpur, GlobalFoundries, DUK, 1-TOPS by VSI, Maven Silicon",
    "speakerId": "speaker-prof-m-m-tripathi",
    "speakerIds": [
      "speaker-prof-m-m-tripathi",
      "speaker-yogesh-chauhan",
      "speaker-devesh-diwedi",
      "speaker-alex-p-james",
      "speaker-shivakumar"
    ],
    "panelists": [
      {
        "name": "Manish Singh, IAS",
        "role": "Chair",
        "designation": "Principal Secretary, Technical Education, Skill Development & Employment Deptt & Principal Secretary, Govt. of M.P., Energy Deptt. (Addl. Charge)",
        "company": "Govt. of MP"
      },
      {
        "name": "M. M. Tripathi",
        "role": "Moderator",
        "designation": "Director General",
        "company": "NIELIT, MeitY",
        "speakerId": "speaker-prof-m-m-tripathi"
      },
      {
        "name": "Yogesh Chauhan",
        "role": "Panelist",
        "designation": "Professor",
        "company": "IIT Kanpur",
        "speakerId": "speaker-yogesh-chauhan"
      },
      {
        "name": "Devesh Dwivedi",
        "role": "Panelist",
        "designation": "Director",
        "company": "GlobalFoundries",
        "speakerId": "speaker-devesh-diwedi"
      },
      {
        "name": "Alex P. James",
        "role": "Panelist",
        "designation": "Professor",
        "company": "Digital University Kerala",
        "speakerId": "speaker-alex-p-james"
      },
      {
        "name": "Aparajita Banerjee",
        "role": "Panelist",
        "designation": "Director",
        "company": "1-TOPS by VSI"
      },
      {
        "name": "Shivakumar P R",
        "role": "Panelist",
        "designation": "CEO",
        "company": "Maven Silicon",
        "speakerId": "speaker-shivakumar"
      }
    ],
    "description": "Formulating a 100,000-strong VLSI engineering workforce roadmap through NIELIT, premier IITs, global foundry mentorship, and industry-certified finishing schools.",
    "takeaways": [
      "Building 85,000+ industry-ready semiconductor engineers by 2030",
      "GlobalFoundries and foundry enablement in academic courses",
      "Finishing school models and specialized tape-out bootcamps"
    ],
    "status": "upcoming",
    "attendanceCount": 760,
    "isBookmarked": false,
    "questionsCount": 4
  },
  {
    "id": "mpss26-d2-13",
    "title": "Tea",
    "track": "Tea Break",
    "day": 2,
    "timeRange": "18:00 – 18:30",
    "room": "Jamawar Hall Pre-Function Area · Ground Floor",
    "speakerName": "Organizing Committee",
    "speakerDesignation": "Event Operations",
    "speakerCompany": "MP Semiconductor Summit 2026",
    "speakerId": "",
    "speakerIds": [],
    "panelists": [],
    "description": "Summit closing high tea and valedictory networking session.",
    "takeaways": [
      "Summit concluding remarks & thank you address",
      "Exchange of contacts and partnership follow-ups",
      "Announcement of MPSS 2027 dates"
    ],
    "status": "upcoming",
    "attendanceCount": 650,
    "isBookmarked": false,
    "questionsCount": 0
  }
];

export const INITIAL_QUESTIONS: Question[] = [];

export const INITIAL_EXHIBITORS: ExhibitorStats[] = sortExhibitors([
  ...GENERATED_EXHIBITORS,
]);

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    personId: 'att-101',
    name: "Aarav Sharma", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    company: 'Infosys',
    designation: 'VP Cloud Engineering',
    email: 'aarav.sharma@infosys.com',
    mobile: '+91 98450 11001',
    linkedin: 'linkedin.com/in/aaravsharma',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['PCIe Gen 6 / 7 VIP', 'UCIe Chiplet VIP', 'Enterprise Cloud'],
    notes: 'Evaluating Truechip PCIe Gen 6 / 7 VIP and CXL 3.1 suites for next-gen SoC project.',
    capturedAt: '10:15 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP', 'PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-2',
    personId: 'att-102',
    name: "Geeta Rao", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    company: 'TCS',
    designation: 'Chief Architect',
    email: 'geeta.rao@tcs.com',
    mobile: '+91 98450 11002',
    linkedin: 'linkedin.com/in/geetarao',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['CXL 3.1 VIP', 'Data Analytics'],
    notes: 'Inquired about UCIe chiplet D2D adapter verification compliance suite.',
    capturedAt: '10:28 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['CXL 3.1 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-3',
    personId: 'att-103',
    name: "Atharv Vyas", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d",
    company: 'Wipro',
    designation: 'Director AI & Data',
    email: 'atharv.vyas@wipro.com',
    mobile: '+91 98450 11003',
    linkedin: 'linkedin.com/in/atharvvyas',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['PCIe Gen 6 / 7 VIP', 'Security & Compliance'],
    notes: 'Requested evaluation license for USB4 & USB-PD 3.1 VIP for mobile application processor.',
    capturedAt: '10:45 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-4',
    personId: 'att-104',
    name: "Priya Nair", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026701d",
    company: 'Flipkart',
    designation: 'Principal Engineer',
    email: 'priya.nair@flipkart.com',
    mobile: '+91 98450 11004',
    linkedin: 'linkedin.com/in/priyanair',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['UCIe Chiplet VIP', 'Developer Tools'],
    notes: 'Wants a proof-of-concept trial license for marketplace search backend team.',
    capturedAt: '11:10 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-5',
    personId: 'att-105',
    name: "Rohan Mehta", avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    company: 'Razorpay',
    designation: 'Head of Platform',
    email: 'rohan.mehta@razorpay.com',
    mobile: '+91 98450 11005',
    linkedin: 'linkedin.com/in/rohanmehta',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Cloud Infrastructure', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Exploring fine-tuned models for automated transaction categorization.',
    capturedAt: '11:35 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-6',
    personId: 'att-106',
    name: 'Sneha Patel',
    company: 'Swiggy',
    designation: 'Engineering Manager',
    email: 'sneha.patel@swiggy.com',
    mobile: '+91 98450 11006',
    linkedin: 'linkedin.com/in/snehapatel',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['DevOps', 'UCIe Chiplet VIP'],
    notes: 'Interested in CI/CD pipeline automation and code review integration.',
    capturedAt: '11:50 AM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-7',
    personId: 'att-107',
    name: 'Vikram Reddy',
    company: 'Oracle India',
    designation: 'Senior Director',
    email: 'vikram.reddy@oracle.com',
    mobile: '+91 98450 11007',
    linkedin: 'linkedin.com/in/vikramreddy',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Multi-Cloud', 'CXL 3.1 VIP'],
    notes: 'Discussed Oracle-Azure database interconnect performance metrics.',
    capturedAt: '12:15 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['CXL 3.1 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-8',
    personId: 'att-108',
    name: 'Ananya Deshmukh',
    company: 'Zoho Corporation',
    designation: 'Product Lead',
    email: 'ananya.d@zohocorp.com',
    mobile: '+91 98450 11008',
    linkedin: 'linkedin.com/in/ananyadeshmukh',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['AI Pair Programming', 'Developer Productivity'],
    notes: 'Looking for metrics on developer velocity improvement and adoption rates.',
    capturedAt: '12:40 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-9',
    personId: 'att-109',
    name: 'Kavya Iyer',
    company: 'Freshworks',
    designation: 'VP Technology',
    email: 'kavya.iyer@freshworks.com',
    mobile: '+91 98450 11009',
    linkedin: 'linkedin.com/in/kavyaiyer',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Customer Experience AI', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Interested in Azure GPT-4o fine-tuning for tier-1 support tickets.',
    capturedAt: '01:05 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-10',
    personId: 'att-110',
    name: 'Rahul Kulkarni',
    company: 'Tech Mahindra',
    designation: 'Enterprise Architect',
    email: 'rahul.k@techmahindra.com',
    mobile: '+91 98450 11010',
    linkedin: 'linkedin.com/in/rahulkulkarni',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Cloud Scale', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Requested technical follow-up meeting with solution architect next Tuesday.',
    capturedAt: '01:30 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-11',
    personId: 'att-111',
    name: 'Pooja Malhotra',
    company: 'Accenture',
    designation: 'Managing Director',
    email: 'pooja.malhotra@accenture.com',
    mobile: '+91 98450 11011',
    linkedin: 'linkedin.com/in/poojamalhotra',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Generative AI Practice', 'UCIe Chiplet VIP'],
    notes: 'Looking to partner on enterprise AI adoption frameworks in BFSI sector.',
    capturedAt: '02:00 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP', 'PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-12',
    personId: 'att-112',
    name: 'Deepak Verma',
    company: 'Cognizant',
    designation: 'Lead Data Scientist',
    email: 'deepak.verma@cognizant.com',
    mobile: '+91 98450 11012',
    linkedin: 'linkedin.com/in/deepakverma',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['CXL 3.1 VIP', 'OneLake'],
    notes: 'Interested in OneLake centralized storage governance models.',
    capturedAt: '02:20 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['CXL 3.1 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-13',
    personId: 'att-113',
    name: 'Neha Pillai',
    company: 'HCL Technologies',
    designation: 'Global Delivery Head',
    email: 'neha.pillai@hcl.com',
    mobile: '+91 98450 11013',
    linkedin: 'linkedin.com/in/nehapillai',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Enterprise Modernization', 'UCIe Chiplet VIP'],
    notes: 'Evaluating Copilot for legacy Java code migration project.',
    capturedAt: '02:45 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-14',
    personId: 'att-114',
    name: 'Siddharth Joshi',
    company: 'Capgemini',
    designation: 'Solutions Director',
    email: 'siddharth.j@capgemini.com',
    mobile: '+91 98450 11014',
    linkedin: 'linkedin.com/in/siddharthjoshi',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Automotive Cloud', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Autonomous driving telemetry data pipeline inquiry.',
    capturedAt: '03:10 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-15',
    personId: 'att-115',
    name: 'Saanvi Bansal',
    company: 'Ola Electric',
    designation: 'Head of DevOps',
    email: 'saanvi.bansal@olaelectric.com',
    mobile: '+91 98450 11015',
    linkedin: 'linkedin.com/in/saanvibansal',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['IoT Hub', 'PCIe Gen 6 / 7 VIP'],
    notes: 'High interest in predictive maintenance alerts and AI diagnostics.',
    capturedAt: '03:30 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-16',
    personId: 'att-116',
    name: 'Tarun Bhat',
    company: 'Intel India',
    designation: 'Senior Staff Engineer',
    email: 'tarun.bhat@intel.com',
    mobile: '+91 98450 11016',
    linkedin: 'linkedin.com/in/tarunbhat',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Hardware Optimization', 'AI Inference'],
    notes: 'Hardware acceleration partnerships discussion on Xeon processors.',
    capturedAt: '03:50 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-17',
    personId: 'att-117',
    name: 'Divya Menon',
    company: 'Tata Elxsi',
    designation: 'Principal Consultant',
    email: 'divya.menon@tataelxsi.com',
    mobile: '+91 98450 11017',
    linkedin: 'linkedin.com/in/divyamenon',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Smart Factory', 'CXL 3.1 VIP'],
    notes: 'Industrial IoT analytics dashboard requirements gathered.',
    capturedAt: '04:10 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['CXL 3.1 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-18',
    personId: 'att-118',
    name: 'Kiran Hegde',
    company: 'Mindtree',
    designation: 'Cloud Security Lead',
    email: 'kiran.hegde@mindtree.com',
    mobile: '+91 98450 11018',
    linkedin: 'linkedin.com/in/kiranhegde',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Security & Compliance', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Compliance checklist reviewed for SOC2 and ISO27001.',
    capturedAt: '04:25 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-19',
    personId: 'att-119',
    name: 'Naveen Gowda',
    company: 'Persistent Systems',
    designation: 'Director Cloud Solutions',
    email: 'naveen.gowda@persistent.com',
    mobile: '+91 98450 11019',
    linkedin: 'linkedin.com/in/naveengowda',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Interested',
    interests: ['Cloud Migration', 'UCIe Chiplet VIP'],
    notes: 'Enterprise account review scheduled for Q1.',
    capturedAt: '04:40 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-20',
    personId: 'att-120',
    name: 'Ritu Mukherjee',
    company: 'Coforge',
    designation: 'Enterprise Architect',
    email: 'ritu.m@coforge.com',
    mobile: '+91 98450 11020',
    linkedin: 'linkedin.com/in/ritumukherjee',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Follow-up',
    interests: ['Financial Services', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Sent initial whitepaper and ROI calculator.',
    capturedAt: '05:00 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-21',
    personId: 'att-121',
    name: 'Aditya Shenoy',
    company: 'KPIT Technologies',
    designation: 'Technical Director',
    email: 'aditya.shenoy@kpit.com',
    mobile: '+91 98450 11021',
    linkedin: 'linkedin.com/in/adityashenoy',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Follow-up',
    interests: ['Embedded AI', 'UCIe Chiplet VIP'],
    notes: 'Shared documentation on Copilot CLI and offline capabilities.',
    capturedAt: '05:15 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-22',
    personId: 'att-122',
    name: 'Nisha Kaur',
    company: 'Uber Technologies',
    designation: 'Staff Software Engineer',
    email: 'nisha.kaur@uber.com',
    mobile: '+91 98450 11022',
    linkedin: 'linkedin.com/in/nishakaur',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Follow-up',
    interests: ['Developer Efficiency', 'UCIe Chiplet VIP'],
    notes: 'Introductory email sent with developer benchmarks.',
    capturedAt: '05:30 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['UCIe Chiplet VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-23',
    personId: 'att-123',
    name: 'Amit Trivedi',
    company: 'IBM India',
    designation: 'Senior Technical Staff',
    email: 'amit.trivedi@ibm.com',
    mobile: '+91 98450 11023',
    linkedin: 'linkedin.com/in/amittrivedi',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Follow-up',
    interests: ['Hybrid Cloud', 'CXL 3.1 VIP'],
    notes: 'Met at booth demo station. Shared case studies.',
    capturedAt: '05:45 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['CXL 3.1 VIP'],
    syncStatus: 'synced'
  },
  {
    id: 'lead-24',
    personId: 'att-124',
    name: 'Vijay Rajput',
    company: 'L&T Infotech',
    designation: 'VP Digital Transformation',
    email: 'vijay.rajput@lntinfotech.com',
    mobile: '+91 98450 11024',
    linkedin: 'linkedin.com/in/vijayrajput',
    source: 'Booth Scan (Hall 1 · A-02)',
    status: 'Follow-up',
    interests: ['Large Scale AI', 'PCIe Gen 6 / 7 VIP'],
    notes: 'Follow up required with procurement and licensing team.',
    capturedAt: '06:00 PM, Day 1',
    boothId: 'Hall 1 · A-02',
    productsViewed: ['PCIe Gen 6 / 7 VIP'],
    syncStatus: 'synced'
  }
];

export const INITIAL_INTERESTED_VISITORS: InterestedVisitor[] = [];

export interface ProfileCompletionCheck {
  key: string;
  label: string;
  completed: boolean;
}

export const getProfileCompletionDetails = (user: Partial<Person> | null | undefined): {
  percentage: number;
  completedCount: number;
  totalCount: number;
  checks: ProfileCompletionCheck[];
} => {
  if (!user) {
    return { percentage: 0, completedCount: 0, totalCount: 0, checks: [] };
  }

  const isPlaceholder = (val?: string, placeholders: string[] = []) => {
    if (!val) return true;
    const lower = val.trim().toLowerCase();
    return !lower || placeholders.includes(lower);
  };

  const checks: ProfileCompletionCheck[] = [
    { key: 'name', label: 'Full Name', completed: Boolean(user.name?.trim()) },
    { key: 'designation', label: 'Designation / Title', completed: Boolean(user.designation?.trim() && !isPlaceholder(user.designation, ['delegate', 'summit attendee', 'attendee', 'participant'])) },
    { key: 'company', label: 'Company / Organization', completed: Boolean(user.company?.trim() && !isPlaceholder(user.company, ['summit attendee', 'mpss 2026', 'mpss26', 'delegate', 'attendee'])) },
    { key: 'email', label: 'Email Address', completed: Boolean(user.email?.trim()) },
    { key: 'mobile', label: 'Mobile Number', completed: Boolean(user.mobile?.trim() && user.mobile !== 'Not listed') },
    { key: 'avatar', label: 'Profile Photo', completed: Boolean(user.avatar?.trim()) },
    { key: 'social', label: 'Social Profile (LinkedIn)', completed: Boolean(user.linkedin?.trim() || user.twitter?.trim()) },
  ];

  const completedCount = checks.filter((c) => c.completed).length;
  const percentage = Math.round((completedCount / checks.length) * 100);

  return { percentage, completedCount, totalCount: checks.length, checks };
};

export const calculateProfileCompletion = (user: Partial<Person> | null | undefined): number => {
  return getProfileCompletionDetails(user).percentage;
};

export const RECOMMENDED_PEOPLE_IDS: string[] = [
  'speaker-dr-mohan-yadav',
  'speaker-ashok-barnwal',
  'speaker-prof-rajeev-dixit',
  'speaker-satya-gupta',
  'speaker-nishit-gupta',
  'speaker-charan-gurumoorthy',
  'speaker-neeraj-mandloi',
  'speaker-jaswinder-ahuja',
  'speaker-dr-kamaljeet-singh',
  'speaker-anshuman-raj',
  'speaker-chitra-hariharan',
  'speaker-sanjeev-sehgal',
  'speaker-nitin-kishor',
  'speaker-narendra-sen',
];
