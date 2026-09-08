# Tamil Nadu Mudaliyar Sangam Digital Portal
### தமிழ்நாடு முதலியார் சங்கம் டிஜிட்டல் போர்டல்

A modern, comprehensive web platform engineered for the global Mudaliyar community. It integrates membership census records, governance archives, transparent statutory financial ledgers, matrimonial alliances, youth career development, family genealogical tracking, cryptographic digital smart ID passes, and community business classifieds with seamless bilingual support (Tamil & English).

---

## 🌟 Core Modules & Capabilities

### 1. 📖 Address Book & Census Registry (முகவரிப் புத்தகம் & உறுப்பினர் அடைவு)
- Comprehensive community census covering families across Tamil Nadu, pan-India, and global chapters.
- Search and filter by native town (*Kanchipuram, Vellore, Thanjavur, Madurai, Tirunelveli, etc.*), blood group donor registry, occupation, and business category.
- Privacy protection with contact masking for unverified guests and direct WhatsApp/Phone connect for verified members.

### 2. 🏛️ Association Officers & Governing Council (சங்க நிர்வாகிகள் & செயற்குழு)
- Official tenure-wise archive (2024–2026, 2022–2024, 2020–2022, etc.).
- Categorized by Apex Executive Council, State Secretaries, Zonal Office Bearers, Women's Wing, and Youth Wing.
- Administrative tools for Super Admins to appoint, update, and manage officer records.

### 3. 💍 Matrimonial Matchmaking Hub (திருமண தகவல் மையம் & வரன் தேடல்)
- Verified alliance registry curated for community families worldwide.
- Detailed astrological matching information (Nakshatra, Rasi, Dosham, Gothram).
- Two-tier privacy model: Free users view masked summaries; verified Gold Members can unlock direct parental contact information.
- Preference-based filtering by education, native town, height, and profession.

### 4. 🌳 Family Genealogical Tree (வம்சாவளி குடும்ப மரம்)
- Interactive generational tree visualizer with expandable and foldable branches (`+` / `-`).
- Portrait photo upload with automatic square cropping and local storage caching.
- Automated milestone notifications for upcoming birthdays and ancestral memorial tithis (நினைவு நாள் / திதி).
- Add new descendants and ancestor branches with kinship tags.

### 5. 🎓 Youth Career & Scholarship Cell (இளையோர் வேலைவாய்ப்பு & உயர்கல்வி)
- Merit-cum-means higher education scholarship applications and grant tracking.
- Civil services (UPSC/TNPSC) and engineering competitive exam mentor rosters.
- Verified career placements and internships hosted by community-founded enterprises.

### 6. 🪪 Digital Member Smart ID Card (டிஜிட்டல் உறுப்பினர் ஸ்மார்ட் அடையாள அட்டை)
- Official tamper-proof cryptographic membership smart card with dual-sided 3D flip inspection.
- Encrypted QR code credentials for instantaneous 1-second check-in at state conventions.
- Automated delegate token issuance for convention kits and dining hall food passes.

### 7. 💰 Financial Accounts & Event Ledger (நன்கொடை & நிகழ்வு வரவு-செலவு கணக்கு)
- Complete statutory financial transparency with itemized Credit and Debit vouchers.
- Convention, scholarship fund, and temple renovation project budgets.
- 80G tax exemption receipt tracking and instant Excel (`.xlsx`) ledger export.
- Monthly automated recurring contribution mandates (min ₹100/month).
- Strict Role-Based Access Control (RBAC): Ledger edits and exports restricted to Executive Admin and Super Admin.

### 8. 📢 Business Directory & Classifieds Feed (சமுதாய வணிக விளம்பரங்கள் & செய்தி ஓடை)
- Marketplace empowering community doctors, lawyers, master silk weavers, engineers, and merchants.
- Admin moderation workflow: Member-submitted advertisements undergo review before appearing live on the main portal.
- Direct WhatsApp integration for inquiries and patronage.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) |
| **Build & Bundling** | [Vite 6](https://vitejs.dev/) with [esbuild](https://esbuild.github.io/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with custom typography |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations & Transitions**| [Motion (Framer Motion)](https://motion.dev/) |
| **Data Export** | [SheetJS (xlsx)](https://docs.sheetjs.com/) for automated financial ledger exports |
| **Backend & APIs** | Node.js Express server with Vite middleware integration |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation
Clone the repository and install all dependencies:
```bash
git clone <repository-url>
cd react-example
npm install
```

### Running Locally (Development Mode)
Start the Vite development server (bound to port `3000` on `0.0.0.0`):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Type Checking & Linting
Validate the codebase for TypeScript errors and syntax issues:
```bash
npm run lint
```

### Production Build
Build the optimized static assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Public static assets & brand emblems
├── src/
│   ├── components/         # Modular feature components
│   │   ├── ModuleTopNav.tsx           # Global navigation header with breadcrumbs & back buttons
│   │   ├── AddressBookViewer.tsx      # Directory & blood donor registry
│   │   ├── AssociationMembersViewer.tsx # Officers and council roster
│   │   ├── MatrimonialHubViewer.tsx   # Alliance matchmaking hub
│   │   ├── FamilyTreeViewer.tsx       # Lineage tree & milestone alerts
│   │   ├── YouthCareerHubViewer.tsx   # Scholarships & job openings
│   │   ├── DigitalMemberIdViewer.tsx  # Cryptographic smart ID & QR pass
│   │   ├── DonationsEventsViewer.tsx  # Transparent financial ledger & 80G
│   │   ├── BusinessAdsFeed.tsx        # Commercial directory & ads
│   │   └── ...
│   ├── data/               # Seed datasets (members, tenures, events, ads, tree nodes)
│   ├── types.ts            # Global TypeScript definitions & interfaces
│   ├── App.tsx             # Main portal container, routing & language state
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind CSS imports and theme variables
├── .env.example            # Environment variable declarations
├── metadata.json           # Application identity & permissions metadata
├── package.json            # Project dependencies and operational scripts
└── vite.config.ts          # Vite build and Tailwind plugin configuration
```

---

## 🌐 Language & Localization
The entire platform is fully localized:
- **English (EN)**: Standard international terminology for global community chapters.
- **தமிழ் (TA)**: Authentic Tamil terminology (*செயற்குழு, வம்சாவளி, வரன் தகவல், அறக்கட்டளை*).
- Toggle anytime via the language switch in the top navigation bar.

---

## 🔒 Security & Privacy Practices
- **Contact Masking**: Sensitive parental contact numbers in the matrimonial module and personal cell numbers in the public directory are masked by default.
- **Role-Based Permissions**: Financial accounting exports, debit modifications, and commercial ad approvals require Super Admin or Executive Admin credentials.
- **Client-Side Safe**: Sensitive keys and database credentials remain secured on the server-side environment.

---

## 📄 License & Heritage
Developed for the cultural preservation, social welfare, and institutional empowerment of the Tamil Nadu Mudaliyar community worldwide. All rights reserved.
