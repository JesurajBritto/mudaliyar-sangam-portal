import { ChecklistItem } from '../types';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 1. Target Audience Demographics
  {
    id: 'demo-1',
    category: 'demographics',
    title: 'Target Audience Demographics & Persona Definition',
    titleTa: 'இலக்கு மக்கள் தொகை மற்றும் பயனர் சுயவிவரங்கள் வரையறை',
    description: 'Segment the community into core user personas with distinct digital literacy levels, primary devices, language preferences, and cultural expectations.',
    descriptionTa: 'சமூக உறுப்பினர்களின் வயது, டிஜிட்டல் அறிவு, மொழித் தேர்வு மற்றும் சாதன பயன்பாட்டின் அடிப்படையில் இலக்கு பயனர்களை வகைப்படுத்துதல்.',
    importance: 'Critical',
    deliverables: [
      'Persona 1: Community Elders & Trustees (Age 55+) - Require large Tamil typography, high-contrast buttons, voice assistance, and simple OTP login',
      'Persona 2: Young Professionals & Matrimonial Seekers (Age 22-35) - Mobile-app-centric, English/Tamil bilingual, privacy-conscious regarding photos/salaries',
      'Persona 3: Global Diaspora (USA, Singapore, Malaysia, UAE, UK) - Need international phone registration (+1, +65, +60, +971) and timezone-aware event schedules',
      'Persona 4: District & Village Coordinators - Need tablet/mobile-optimized dashboards for field verification and member vouching',
      'Persona 5: Women & Family Matrimonial Decision-Makers - Demand strict anti-screenshot protection and mediated contact sharing'
    ],
    tips: 'Conduct usability test sessions with at least 5 community elders (aged 60+) using low-end Android smartphones on 4G networks.'
  },

  // 2. Finalizing Core Feature List
  {
    id: 'feat-1',
    category: 'features',
    title: 'Finalizing Core Feature Scope & MVP Roadmap',
    titleTa: 'அடிப்படை அம்சங்களின் பட்டியல் மற்றும் வெளியீட்டு திட்டமிடல்',
    description: 'Establish the explicit boundary between Phase 1 (MVP Launch), Phase 2 (Growth & Monetization), and Phase 3 (Advanced AI & Lineage Tree).',
    descriptionTa: 'முதல் கட்ட வெளியீடு (MVP), இரண்டாம் கட்டம் மற்றும் எதிர்கால விரிவாக்கங்களுக்கான தெளிவான அம்ச எல்லைகளை உறுதி செய்தல்.',
    importance: 'Critical',
    deliverables: [
      'Phase 1 (MVP): Phone OTP auth, Member profile & lineage verification, Community Directory, Matrimony with horoscope unlock, Events calendar, Emergency Blood Donor search, Bilingual toggle',
      'Phase 2 (Growth): Recurring membership subscriptions, Automated 80G tax receipts, Historical photo/video archive galleries, Community news feed, Discussion forum with moderation',
      'Phase 3 (Expansion): Interactive Kulam/Gotram ancestral lineage tree visualizer, Business networking directory, Youth career mentorship portal',
      'Out-of-Scope Guardrails: Avoid unvetted public user comments, unmoderated chat rooms, or real-time geolocation tracking'
    ],
    tips: 'Lock the Phase 1 feature set in an approved Product Requirements Document (PRD) signed by the Sangam Executive Committee.'
  },

  // 3. Choosing Technology Stack
  {
    id: 'tech-stack-1',
    category: 'techstack',
    title: 'Technology Stack Selection (Frontend, Backend, Database & Mobile)',
    titleTa: 'தொழில்நுட்ப கட்டமைப்பு தேர்வு - வலைத்தளம், செயலி, பின்தளம், தரவுத்தளம்',
    description: 'Select a battle-tested, maintainable, and cost-effective tech stack that delivers high performance across slow 3G/4G networks and long-term community stewardship.',
    descriptionTa: 'நீண்டகால பயன்பாட்டிற்கு உகந்த, பாதுகாப்புமிக்க மற்றும் செலவு குறைந்த தொழில்நுட்பங்களை தேர்வு செய்தல்.',
    importance: 'Critical',
    deliverables: [
      'Web Frontend: Next.js / React 18+ with TypeScript and Tailwind CSS for server-side rendering (SSR) and optimal search indexing',
      'Mobile Application: React Native or Flutter cross-platform architecture targeting Android (min SDK 24) and iOS (iOS 15+)',
      'Backend API: Node.js (NestJS or Express) with TypeScript, Zod schema validation, and OpenAPI / Swagger documentation',
      'Database: PostgreSQL 16 with pgcrypto for encryption, UUID keys, and connection pooling via PgBouncer',
      'Storage & CDN: Cloud Object Storage (Google Cloud Storage / AWS S3) paired with Cloudflare CDN for cached static and watermarked media',
      'Telecom & Notifications: TRAI-registered Indian DLT SMS Gateway (Fast2SMS / Gupshup) + Firebase Cloud Messaging (FCM)'
    ],
    tips: 'Choose TypeScript end-to-end (Node + React + React Native) to allow sharing validation schemas, types, and utility functions across the stack.'
  },

  // 4. Security, Encryption & Data Privacy
  {
    id: 'sec-1',
    category: 'security',
    title: 'Comprehensive Security, Encryption & Privacy Planning (DPDP 2023)',
    titleTa: 'பாதுகாப்பு, என்க்ரிப்ஷன் மற்றும் தரவு தனியுரிமை திட்டமிடல்',
    description: 'Implement defense-in-depth security to protect sensitive personal lineage, masked identity proofs, financial records, and matrimonial information.',
    descriptionTa: 'முழுமையான தரவு பாதுகாப்பு, என்க்ரிப்ஷன் மற்றும் இந்திய டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்ட இணக்கம்.',
    importance: 'Critical',
    deliverables: [
      'Data-in-Transit Encryption: Enforce TLS 1.3 with HSTS headers, secure cookies with SameSite=Strict and HttpOnly flags',
      'Data-at-Rest Encryption: Database volume encryption (AES-256) and field-level encryption for PII using pgcrypto',
      'Masked ID Storage: Uploaded Aadhaar/Voter IDs stored in private cloud buckets accessible only via 15-minute time-limited pre-signed URLs',
      'Granular Role-Based Access Control (RBAC): Principle of Least Privilege across Guest, Member, Coordinator, and Trustee roles',
      'Anti-Scraping Protection: Rate limiting (Cloudflare WAF + Redis token bucket) and dynamic watermarking of matrimonial photos with viewer Sangam ID and timestamp',
      'India DPDP Act 2023 Compliance: Consent logging, Right to Access personal records, Right to Correction, and complete Account Deletion workflow'
    ],
    tips: 'Store database encryption keys in a hardware security module (GCP Cloud KMS or AWS KMS) rather than environment files.'
  },

  // 5. Hosting & Deployment Strategy
  {
    id: 'host-1',
    category: 'hosting',
    title: 'Cloud Hosting, Deployment & CI/CD Strategy',
    titleTa: 'கிளவுட் ஹோஸ்டிங், சர்வர் கட்டமைப்பு மற்றும் தொடர் வெளியீட்டு (CI/CD) உத்தி',
    description: 'Design a resilient, automated deployment architecture with isolated staging and production environments, automated container builds, and zero-downtime releases.',
    descriptionTa: 'தானியங்கி சர்வர் வெளியீட்டு முறை, சோதனைக் களம் (Staging) மற்றும் நேரலை சர்வர் (Production) கட்டமைப்பு.',
    importance: 'High',
    deliverables: [
      'Containerization: Multi-stage Dockerfiles for frontend, backend, and background worker services with non-root runtime users',
      'Cloud Infrastructure: Serverless containers (GCP Cloud Run / AWS ECS Fargate) with auto-scaling (min 1, max 10 instances)',
      'CI/CD Pipeline: GitHub Actions workflow executing automated linting, unit tests, security vulnerability scans, and staging deploys on every PR',
      'Environment Isolation: Separate Staging and Production databases, cloud storage buckets, and payment gateway sandbox credentials',
      'Zero-Downtime Blue/Green Deployments: Traffic shifting with health checks to ensure zero downtime during statewide conference traffic spikes'
    ],
    tips: 'Use Infrastructure as Code (Terraform) so the entire infrastructure can be reproduced or migrated in under 30 minutes.'
  },

  // 6. Version Control & Git Protocols
  {
    id: 'git-1',
    category: 'git',
    title: 'Version Control (Git) & Code Collaboration Architecture',
    titleTa: 'பதிப்புக் கட்டுப்பாடு (Git) மற்றும் மென்பொருள் உருவாக்க நெறிமுறைகள்',
    description: 'Establish strict branch protection, Pull Request (PR) review standards, semantic versioning, and commit conventions across all developers.',
    descriptionTa: 'கிட்ஹப் கிளை மேலாண்மை, குறியீடு மதிப்பாய்வு மற்றும் கூட்டு உருவாக்க விதிமுறைகள்.',
    importance: 'High',
    deliverables: [
      'Branching Strategy: Trunk-Based Development or GitHub Flow (main as protected production branch, develop for staging, feature/* for tasks)',
      'Branch Protection Rules: Minimum 1 peer code review approval required, all CI checks must pass, linear history enforced',
      'Commit Standards: Conventional Commits convention (feat:, fix:, docs:, style:, refactor:, test:, chore:)',
      'Pre-commit Hooks: Husky + lint-staged running ESLint, Prettier, TypeScript compiler check, and secret scanners (TruffleHog) before every commit',
      'Release Tagging: Automated semantic versioning (SemVer v1.2.0) with auto-generated release notes and changelogs'
    ],
    tips: 'Strictly prohibit pushing secrets (.env, service account JSONs, private keys) using git-secrets and repository secret scanning alerts.'
  },

  // 7. Planning for Scalability
  {
    id: 'scale-1',
    category: 'scalability',
    title: 'High-Traffic Scalability & Performance Planning',
    titleTa: 'அதிக பயனர் வருகைக்கான அளவிடுதல் (Scalability) திட்டமிடல்',
    description: 'Ensure the architecture seamlessly handles traffic spikes during annual general meetings (AGM), matrimonial melas, and statewide election announcements.',
    descriptionTa: 'ஆண்டு மாநாடு மற்றும் திருமண மேளா காலங்களில் சர்வர் முடங்காமல் சீராக இயங்குவதை உறுதி செய்தல்.',
    importance: 'High',
    deliverables: [
      'Database Connection Pooling: Implement PgBouncer to manage thousands of concurrent connections efficiently',
      'In-Memory Caching: Redis cache for frequently accessed read-heavy queries (district member counts, event details, master taxonomy)',
      'Read Replicas: Configure asynchronous PostgreSQL read replicas dedicated to intensive matrimonial search filters and directory queries',
      'Static Asset Offloading: Host all event photos, audio circulars, and static assets on Cloud Storage behind Cloudflare CDN with edge caching',
      'Asynchronous Background Queues: BullMQ / Redis worker queues for heavy tasks (generating PDF 80G tax receipts, resizing photos, bulk SMS dispatch)'
    ],
    tips: 'Perform load testing (using k6 or Locust) simulating 5,000 concurrent users performing directory and matrimonial searches before go-live.'
  },

  // 8. Mobile-First UI/UX Design
  {
    id: 'uiux-1',
    category: 'uiux',
    title: 'Mobile-First UI/UX Design & Elder-Friendly Accessibility',
    titleTa: 'மொபைல் முன்னுரிமை வடிவமைப்பு மற்றும் முதியோருக்கான எளிமைப்படுத்தல்',
    description: 'Prioritize responsive, mobile-first design tailored to Tamil community elders, featuring large touch targets, accessible typography, and intuitive navigation.',
    descriptionTa: 'ஸ்மார்ட்போன்களில் எளிதாக செயல்படும் வடிவமைப்பு, பெரிய எழுத்துருக்கள் மற்றும் தெளிவான தமிழ் வழிகாட்டல்.',
    importance: 'Critical',
    deliverables: [
      'Touch Targets: All buttons, icons, and interactive elements sized at a minimum of 48x48px with generous spacing',
      'Elder Accessibility: Minimum base body text of 16px, adjustable text scaling toggle (+20%, +40%), and high color contrast (WCAG AAA)',
      'Bilingual Typography: Optimized font pairing: Inter/Plus Jakarta Sans for English, Noto Sans Tamil / Baloo Thambi 2 for Tamil',
      'Network Resilience: Low-bandwidth data saver mode, skeleton loaders, and offline caching of member ID cards and recent announcements',
      'Simplified Navigation: Bottom tab bar navigation on mobile (Home, Directory, Matrimony, Events, Profile) with bottom sheets for complex filters'
    ],
    tips: 'Avoid nested sub-menus or hamburger menus on mobile; place the most important 4 community actions directly in the bottom navigation.'
  },

  // 9. Development Team Communication Protocols
  {
    id: 'comms-1',
    category: 'comms',
    title: 'Team Communication Protocols, Sprints & Incident Management',
    titleTa: 'உருவாக்கக் குழு தொடர்பு நெறிமுறைகள் மற்றும் பணி ஒருங்கிணைப்பு',
    description: 'Define clear collaboration channels, sprint rhythms, API contract standards, and production incident escalation matrices for the engineering team.',
    descriptionTa: 'குழு உறுப்பினர்களுக்கான பணிப் பகிர்வு, வாராந்திர திட்டங்கள் மற்றும் அவசரகால சரிசெய்தல் நடைமுறைகள்.',
    importance: 'Medium',
    deliverables: [
      'Centralized Communication: Dedicated channels on Slack / Discord (#dev-backend, #dev-mobile, #dev-web, #alerts-production, #sangam-liaison)',
      'Sprint Cadence: 2-week Agile sprints with Monday sprint planning, 15-minute daily asynchronous standups, and Friday demo reviews with Sangam trustees',
      'API-First Contract: Frontend and backend teams agree on OpenAPI/Swagger JSON specifications before writing implementation code',
      'Issue Tracking: GitHub Projects or Jira with structured tickets containing Acceptance Criteria, Figma design links, and test steps',
      'Incident Response & On-Call: Documented severity matrix (P1: Matrimony/Auth down, P2: Receipt generation issue, P3: Minor UI glitch) with 30-min P1 SLA'
    ],
    tips: 'Maintain an Architecture Decision Record (ADR) repository in Git documenting why architectural choices were made for future developers.'
  },

  // 10. Legal & Statutory Compliance
  {
    id: 'leg-1',
    category: 'legal',
    title: 'Registered Society / Trust Deed & By-Laws Documentation',
    titleTa: 'பதிவுசெய்யப்பட்ட சங்கம் / அறக்கட்டளை பத்திரம் மற்றும் சட்டவிதிகள்',
    description: 'Ensure official registration under the Tamil Nadu Societies Registration Act, 1975 or Indian Trusts Act, 1882. The platform terms must legally identify the registered Sangam entity.',
    descriptionTa: 'சங்கங்கள் பதிவுச் சட்டம் அல்லது அறக்கட்டளை சட்டத்தின் கீழ் பெறப்பட்ட முறையான பதிவுச் சான்றிதழ் மற்றும் விதிமுறைகள்.',
    importance: 'Critical',
    deliverables: [
      'Registration Certificate Number & Registered Office Address displayed in app footer',
      'President & General Secretary digital signature authorization',
      'By-laws specifying membership eligibility criteria (Mudaliyar community lineage)',
      'Terms of Service, Privacy Policy & Disclaimers drafted by legal counsel'
    ],
    tips: 'Include the official registration number in the app footer and member receipts for trust and audit purposes.'
  },
  {
    id: 'leg-2',
    category: 'legal',
    title: 'Income Tax 12A & 80G Certification for Donations',
    titleTa: 'வருமான வரிச் சட்டம் 12A & 80G விலக்கு சான்றிதழ்',
    description: 'If collecting community welfare donations or educational scholarships, 80G certification allows donors to claim 50% tax deductions. Automated receipt generation with 80G details is essential.',
    descriptionTa: 'கல்வி உதவி மற்றும் சமூக நல நிதிக்கு 80G வரிவிலக்கு ரசீதுகளை தானாக வழங்கும் முறை.',
    importance: 'High',
    deliverables: [
      'Unique Registration Number (URN) under 80G verified on Income Tax portal',
      'PAN of the Sangam configured for payment gateway receipts',
      'Automated PDF receipt generator containing Form 10BE compliant details'
    ],
    tips: 'Payment gateway transactions should automatically dispatch 80G compliant PDF receipts to the donor’s WhatsApp and email.'
  },

  // 11. Community Governance & Verification
  {
    id: 'com-1',
    category: 'community',
    title: 'Lineage, Sub-Sect & Gotram/Kulam Master Taxonomy',
    titleTa: 'குலம், கோத்திரம், உட்பிரிவு மற்றும் குலதெய்வ தரவு வரிசை',
    description: 'Pre-compile standard taxonomy of Mudaliyar sub-sects (Thondaimandala Saiva, Agamudayar, Sengunthar/Kaikolar, Arcot, Vellalar, etc.) along with known Kulams, Gotrams, and Kula Deivam temple directories.',
    descriptionTa: 'முதலியார் உட்பிரிவுகள், கோத்திரங்கள், குலங்கள் மற்றும் குலதெய்வ கோயில்களின் அதிகாரப்பூர்வ பட்டியல்.',
    importance: 'Critical',
    deliverables: [
      'Standardized dropdown data for Sub-Sects and Gotrams (avoids typos and duplicate entries)',
      'Kula Deivam temple location and annual festival dates calendar',
      'Native Place (Sontha Oor) & ancestral district directory'
    ],
    tips: 'Allow users to select from standardized lists with an "Other (Specify)" fallback that notifies admins to review.'
  },
  {
    id: 'com-2',
    category: 'community',
    title: 'Two-Tier Member Verification Workflow',
    titleTa: 'இரு அடுக்கு உறுப்பினர் சரிபார்ப்பு முறை',
    description: 'Prevent fake profiles and impersonation by routing new registrations through Local Area / District Coordinators before issuing a Verified Member Badge.',
    descriptionTa: 'போலி கணக்குகளைத் தவிர்க்க மாவட்ட அமைப்பாளர்கள் மூலம் நேரடி/ஆவண சரிபார்ப்பு.',
    importance: 'Critical',
    deliverables: [
      'Government ID upload module (Aadhaar / Voter ID / Community Certificate) with client-side masking',
      'District Coordinator review dashboard with quick Approve / Reject / Request More Info actions',
      'Reference member vouching: Option for an existing verified member to sponsor/vouch for a new applicant'
    ],
    tips: 'Aadhaar numbers must be masked (showing only last 4 digits) and the document encrypted in private storage buckets.'
  },

  // 12. Matrimonial Safeguards & Privacy
  {
    id: 'mat-1',
    category: 'matrimonial',
    title: 'Horoscope (Jathagam) & Sensitive Detail Privacy Locks',
    titleTa: 'ஜாதகம் மற்றும் குடும்ப விவரங்களுக்கான பாதுகாப்பு பூட்டு',
    description: 'Matrimonial profiles contain deeply sensitive personal details. Users must have granular privacy controls over who can view full photos, contact numbers, and horoscope charts.',
    descriptionTa: 'ஜாதகம், புகைப்படம் மற்றும் தொடர்பு எண்களை யாரெல்லாம் பார்க்கலாம் என்பதை தீர்மானிக்கும் வசதி.',
    importance: 'Critical',
    deliverables: [
      'Three privacy tiers: "All Verified Members", "On Request & Acceptance Only", "Sangam Admin Mediated"',
      'Automated dynamic watermarking on profile photos with viewer’s ID and timestamp to deter unauthorized screenshots',
      'Anti-scraping rate limits on profile viewing'
    ],
    tips: 'Disable right-click saving and apply translucent overlay watermarks with the viewing member’s Sangam ID.'
  },
  {
    id: 'mat-2',
    category: 'matrimonial',
    title: 'Statutory Matrimonial & Dowry Prohibition Declarations',
    titleTa: 'வரதட்சணை எதிர்ப்பு மற்றும் சட்டப்பூர்வ உறுதிமொழி',
    description: 'Under Indian law (Dowry Prohibition Act, 1961), matrimonial platforms must enforce mandatory self-declarations against dowry demands and confirm genuine age eligibility (Female 18+, Male 21+).',
    descriptionTa: 'வரதட்சணை கேட்க மாட்டோம் மற்றும் குறைந்தபட்ச திருமண வயது குறித்த கட்டாய ஒப்புதல்.',
    importance: 'Critical',
    deliverables: [
      'Mandatory checkbox agreeing to anti-dowry compliance and truthful age declaration',
      'Marital status validation (Unmarried, Widowed, Divorced with decree uploaded)',
      'Report Profile mechanism for inappropriate communications'
    ],
    tips: 'Store the timestamp and IP address of the legal declaration in the audit log.'
  },

  // 13. Payments & Subscriptions
  {
    id: 'pay-1',
    category: 'payments',
    title: 'Payment Gateway Merchant KYC & Recurring Mandates',
    titleTa: 'கட்டண நுழைவாயில் வணிகர் KYC மற்றும் சந்தா வசதி',
    description: 'Payment gateway account setup (Razorpay, Cashfree, or PayU) linked directly to the Sangam’s official non-profit bank account. Requires recurring subscription capability for premium matrimonial listings.',
    descriptionTa: 'சங்கத்தின் வங்கிக் கணக்குடன் இணைக்கப்பட்ட ரேஸர்பே/கேஷ்ஃப்ரீ நுழைவாயில் மற்றும் சந்தா முறை.',
    importance: 'Critical',
    deliverables: [
      'Merchant KYC verified with Sangam Trust PAN, Cancelled Cheque, and Trustee Aadhaar',
      'Support for UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit cards',
      'Webhook listener server with HMAC-SHA256 signature verification'
    ],
    tips: 'Implement automated idempotency keys on payment endpoints to prevent duplicate charges.'
  },

  // 14. Multilingual & Localization
  {
    id: 'lang-1',
    category: 'multilingual',
    title: 'Tamil & English Bilingual i18n Architecture',
    titleTa: 'தமிழ் மற்றும் ஆங்கில இருமொழி உள்ளடக்க அமைப்பு',
    description: 'A large segment of elders and community members prefer pure Tamil UI, while diaspora and youth prefer English. The UI must toggle dynamically without page reload.',
    descriptionTa: 'முதியவர்கள் மற்றும் இளைஞர்கள் எளிதாகப் பயன்படுத்த தமிழ் மற்றும் ஆங்கில மொழிமாற்று வசதி.',
    importance: 'Critical',
    deliverables: [
      'Client-side i18n key-value dictionary covering 100% of navigation, forms, alerts, and help text',
      'Tamil month / Panchangam support for wedding dates, Chithirai festival, Pongal, etc.',
      'Tamil font rendering optimization (Noto Sans Tamil / Baloo Thambi 2 font weights)'
    ],
    tips: 'Store the user’s preferred locale in local storage and the database profile so push notifications are delivered in their chosen language.'
  }
];
