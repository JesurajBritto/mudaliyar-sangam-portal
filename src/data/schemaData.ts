import { SchemaTable } from '../types';

export const DATABASE_TABLES: SchemaTable[] = [
  // 1. Identity & Auth: users
  {
    id: 'users',
    tableName: 'users',
    module: 'Identity & Auth',
    description: 'Master authentication and user credentials table. Stores phone numbers for OTP authentication, hashed passwords, base role tiers, verification state, and notification tokens.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Unique internal user identifier generated via gen_random_uuid()' },
      { name: 'phone_number', type: 'VARCHAR(15)', nullable: false, isPII: true, description: 'E.164 phone number used for primary Indian DLT OTP login' },
      { name: 'email', type: 'VARCHAR(255)', nullable: true, isPII: true, description: 'Optional email address for 80G tax receipts and official circulars' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Argon2id or bcrypt cryptographic password hash' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Full legal name in English as per official government records' },
      { name: 'full_name_ta', type: 'VARCHAR(150)', nullable: true, description: 'Tamil transliteration of member name (e.g., மு. சிவசுப்பிரமணிய முதலியார்)' },
      { name: 'role', type: 'VARCHAR(30)', nullable: false, description: 'Base role: guest | member | moderator | admin | super_admin' },
      { name: 'verification_status', type: 'VARCHAR(30)', nullable: false, description: 'unverified | pending_review | verified | rejected | suspended' },
      { name: 'preferred_language', type: 'VARCHAR(5)', nullable: false, description: 'Default locale: ta (Tamil தமிழ்) or en (English)' },
      { name: 'fcm_push_token', type: 'TEXT', nullable: true, description: 'Firebase Cloud Messaging device token for Android, iOS, and Web Push' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Account registration timestamp (defaults to NOW())' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Last profile modification timestamp' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_users_phone ON users(phone_number);',
      'CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;',
      'CREATE INDEX idx_users_role_status ON users(role, verification_status);'
    ],
    ddl: `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    full_name_ta VARCHAR(150),
    role VARCHAR(30) NOT NULL DEFAULT 'member' CHECK (role IN ('guest', 'member', 'moderator', 'admin', 'super_admin')),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending_review', 'verified', 'rejected', 'suspended')),
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'ta' CHECK (preferred_language IN ('ta', 'en')),
    fcm_push_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 2. Directory & Verification: member_profiles
  {
    id: 'member_profiles',
    tableName: 'member_profiles',
    module: 'Directory & Verification',
    description: 'Detailed community profile containing Mudaliyar sub-sect, Gotram/Kulam, Kula Deivam temple, native place (Sontha Oor), blood group, and emergency donor registry status.',
    fields: [
      { name: 'user_id', type: 'UUID (PK, FK)', nullable: false, isPrimary: true, isForeign: true, foreignRef: 'users.id', description: 'One-to-one foreign key linking directly to auth users table' },
      { name: 'membership_code', type: 'VARCHAR(50)', nullable: true, description: 'Official Sangam Member ID card code (e.g., MUD-CHN-2026-0412)' },
      { name: 'sub_sect', type: 'VARCHAR(100)', nullable: false, description: 'Sub-sect: Thondaimandala Saiva, Sengunthar, Agamudayar, Arcot, Vellalar, etc.' },
      { name: 'gotram_kulam', type: 'VARCHAR(100)', nullable: true, description: 'Kulam / Gotram lineage (e.g., Siva Gotram, Agasthya Gotram)' },
      { name: 'kula_deivam_temple', type: 'VARCHAR(255)', nullable: true, description: 'Ancestral Kula Deivam temple name and village location' },
      { name: 'native_place_oor', type: 'VARCHAR(150)', nullable: false, description: 'Sontha Oor (ancestral village, town, or taluk in Tamil Nadu)' },
      { name: 'native_district', type: 'VARCHAR(100)', nullable: false, description: 'Kanchipuram, Vellore, Tiruvannamalai, Chennai, Coimbatore, etc.' },
      { name: 'current_city', type: 'VARCHAR(100)', nullable: false, description: 'Current residence city / country (supports NRI diaspora)' },
      { name: 'occupation', type: 'VARCHAR(150)', nullable: true, description: 'Profession, business enterprise, or retired designation' },
      { name: 'blood_group', type: 'VARCHAR(10)', nullable: true, description: 'A+, B+, O+, AB+, etc. for emergency community blood donor registry' },
      { name: 'is_blood_donor_available', type: 'BOOLEAN', nullable: false, description: 'Member willingness to receive emergency blood donation calls' },
      { name: 'verified_by_admin_id', type: 'UUID (FK)', nullable: true, isForeign: true, foreignRef: 'users.id', description: 'Admin or District Coordinator who vetted this member' },
      { name: 'verified_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Timestamp when verification badge was granted' }
    ],
    indexes: [
      'CREATE INDEX idx_members_native ON member_profiles(native_district, native_place_oor);',
      'CREATE INDEX idx_members_sub_sect ON member_profiles(sub_sect);',
      'CREATE INDEX idx_members_blood_donor ON member_profiles(blood_group) WHERE is_blood_donor_available = true;'
    ],
    ddl: `CREATE TABLE member_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    membership_code VARCHAR(50) UNIQUE,
    sub_sect VARCHAR(100) NOT NULL,
    gotram_kulam VARCHAR(100),
    kula_deivam_temple VARCHAR(255),
    native_place_oor VARCHAR(150) NOT NULL,
    native_district VARCHAR(100) NOT NULL,
    current_city VARCHAR(100) NOT NULL,
    occupation VARCHAR(150),
    blood_group VARCHAR(10),
    is_blood_donor_available BOOLEAN NOT NULL DEFAULT false,
    verified_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ
);`
  },

  // 3. Directory & Verification: verification_documents
  {
    id: 'verification_documents',
    tableName: 'verification_documents',
    module: 'Directory & Verification',
    description: 'Encrypted storage references for government identity proofs (Aadhaar, Voter ID, Community Certificate). Documents stored with masked numbers and audited coordinator access.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Document record identifier' },
      { name: 'user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Member submitting identity document' },
      { name: 'document_type', type: 'VARCHAR(50)', nullable: false, description: 'aadhaar_card | voter_id | community_certificate | passport' },
      { name: 'masked_document_number', type: 'VARCHAR(20)', nullable: false, isPII: true, description: 'Masked ID displaying only last 4 digits (e.g., XXXX-XXXX-1234)' },
      { name: 'storage_file_key', type: 'TEXT', nullable: false, description: 'Encrypted S3/Cloud Storage object key; accessible via pre-signed URL only' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'pending | approved | rejected' },
      { name: 'rejection_reason', type: 'TEXT', nullable: true, description: 'Feedback for user if document is rejected or illegible' },
      { name: 'reviewed_by', type: 'UUID (FK)', nullable: true, isForeign: true, foreignRef: 'users.id', description: 'Reviewing admin or District Coordinator' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Submission timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_verif_docs_status ON verification_documents(status);',
      'CREATE INDEX idx_verif_docs_user ON verification_documents(user_id);'
    ],
    ddl: `CREATE TABLE verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    masked_document_number VARCHAR(20) NOT NULL,
    storage_file_key TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 3b. Directory & Verification: member_addresses (Address Book)
  {
    id: 'member_addresses',
    tableName: 'member_addresses',
    module: 'Directory & Verification',
    description: 'Stores member address book details captured during registration. Supports member-level privacy toggles: open to all verified members or masked by default requiring approval.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Address book unique record identifier' },
      { name: 'user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Registered Sangam member foreign key' },
      { name: 'door_number', type: 'VARCHAR(50)', nullable: false, isPII: true, description: 'Flat or Door number (masked in public view unless access granted)' },
      { name: 'street_name', type: 'VARCHAR(150)', nullable: false, isPII: true, description: 'Street or road name (masked unless access granted)' },
      { name: 'area_locality', type: 'VARCHAR(150)', nullable: false, description: 'Locality or sector (e.g., Anna Nagar West, Gandhi Nagar)' },
      { name: 'city', type: 'VARCHAR(100)', nullable: false, description: 'City / Municipality (e.g., Chennai, Kanchipuram, Vellore)' },
      { name: 'district', type: 'VARCHAR(100)', nullable: false, description: 'District in Tamil Nadu / Puducherry' },
      { name: 'state', type: 'VARCHAR(50)', nullable: false, description: 'State (default: Tamil Nadu)' },
      { name: 'pincode', type: 'VARCHAR(10)', nullable: false, description: 'Postal PIN code (e.g., 600040)' },
      { name: 'primary_phone', type: 'VARCHAR(20)', nullable: false, isPII: true, description: 'Primary mobile number for SMS OTP & communication (partially masked in directory)' },
      { name: 'secondary_phone', type: 'VARCHAR(20)', nullable: true, isPII: true, description: 'Optional landline or alternate contact number' },
      { name: 'address_privacy', type: 'VARCHAR(30)', nullable: false, description: 'public_to_members | request_only | hidden_from_directory' },
      { name: 'phone_privacy', type: 'VARCHAR(30)', nullable: false, description: 'public_to_members | request_only | hidden_from_directory' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Record creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Last address update timestamp' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_member_addresses_user ON member_addresses(user_id);',
      'CREATE INDEX idx_member_addresses_district_city ON member_addresses(district, city);',
      'CREATE INDEX idx_member_addresses_privacy ON member_addresses(address_privacy);'
    ],
    ddl: `CREATE TABLE member_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    door_number VARCHAR(50) NOT NULL,
    street_name VARCHAR(150) NOT NULL,
    area_locality VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10) NOT NULL,
    primary_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    address_privacy VARCHAR(30) NOT NULL DEFAULT 'request_only' CHECK (address_privacy IN ('public_to_members', 'request_only', 'hidden_from_directory')),
    phone_privacy VARCHAR(30) NOT NULL DEFAULT 'request_only' CHECK (phone_privacy IN ('public_to_members', 'request_only', 'hidden_from_directory')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 3c. Directory & Verification: address_access_requests
  {
    id: 'address_access_requests',
    tableName: 'address_access_requests',
    module: 'Directory & Verification',
    description: 'Tracks bilateral consent requests where Member A requests to unlock Member B unmasked address and mobile number, enabling member-approved data unmasking.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Access request unique record ID' },
      { name: 'requester_user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Member requesting access to contact details' },
      { name: 'target_user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Member whose address/phone is requested' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'pending | approved | rejected | revoked' },
      { name: 'request_reason', type: 'VARCHAR(255)', nullable: false, description: 'Stated purpose (e.g. wedding invitation, ancestral lineage, business connect)' },
      { name: 'approved_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Timestamp when target member approved access' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Optional expiry date for temporary contact unmasking' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Submission timestamp' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_address_req_unique_pair ON address_access_requests(requester_user_id, target_user_id) WHERE status = \'pending\';',
      'CREATE INDEX idx_address_req_target_status ON address_access_requests(target_user_id, status);',
      'CREATE INDEX idx_address_req_requester ON address_access_requests(requester_user_id);'
    ],
    ddl: `CREATE TABLE address_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
    request_reason VARCHAR(255) NOT NULL,
    approved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 4. Matrimony: matrimonial_profiles
  {
    id: 'matrimonial_profiles',
    tableName: 'matrimonial_profiles',
    module: 'Matrimony',
    description: 'Matrimonial listing table including astrology (Rasi, Nakshatram, Dosham), education, profession, family background, and strict three-tier privacy locks.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Matrimonial profile unique identifier' },
      { name: 'user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Managing user (self, parent, or brother/sister guardian)' },
      { name: 'profile_for', type: 'VARCHAR(30)', nullable: false, description: 'self | son | daughter | brother | sister' },
      { name: 'gender', type: 'VARCHAR(10)', nullable: false, description: 'male | female' },
      { name: 'date_of_birth', type: 'DATE', nullable: false, isPII: true, description: 'DOB for legal age verification & astrological horoscope calculation' },
      { name: 'height_cm', type: 'INTEGER', nullable: true, description: 'Candidate height in centimeters (e.g., 172)' },
      { name: 'marital_status', type: 'VARCHAR(30)', nullable: false, description: 'unmarried | widowed | divorced' },
      { name: 'education_level', type: 'VARCHAR(100)', nullable: false, description: 'Degree: B.E., MBBS, M.Tech, CA, MBA, etc.' },
      { name: 'occupation_title', type: 'VARCHAR(150)', nullable: false, description: 'Job title and employer enterprise' },
      { name: 'annual_income_lakhs', type: 'NUMERIC(6,2)', nullable: true, description: 'Annual compensation range in INR Lakhs' },
      { name: 'work_location', type: 'VARCHAR(100)', nullable: false, description: 'City/Country of current posting' },
      { name: 'rasi', type: 'VARCHAR(50)', nullable: false, description: 'Mesham, Rishabam, Midhunam, Kadagam, Simmam, Kanni, Thulam, etc.' },
      { name: 'nakshatram', type: 'VARCHAR(50)', nullable: false, description: 'Ashwini, Bharani, Karthigai, Rohini, Mirugasiridam, etc.' },
      { name: 'dosham_details', type: 'VARCHAR(100)', nullable: true, description: 'Sevvai (Manglik) Dosham, Rahu-Ketu Dosham, None' },
      { name: 'horoscope_chart_url', type: 'TEXT', nullable: true, description: 'Encrypted storage path to 12-box traditional Jathagam chart image' },
      { name: 'photo_urls', type: 'TEXT[]', nullable: true, description: 'Array of verified photo URLs watermarked dynamically on retrieval' },
      { name: 'partner_expectations', type: 'TEXT', nullable: true, description: 'Family cultural preferences and expectations' },
      { name: 'privacy_tier', type: 'VARCHAR(30)', nullable: false, description: 'all_verified | request_only | admin_mediated' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Profile visibility (false once alliance is finalized)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Listing timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_matrimony_search ON matrimonial_profiles(gender, marital_status, rasi, nakshatram);',
      'CREATE INDEX idx_matrimony_user ON matrimonial_profiles(user_id);'
    ],
    ddl: `CREATE TABLE matrimonial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_for VARCHAR(30) NOT NULL CHECK (profile_for IN ('self', 'son', 'daughter', 'brother', 'sister')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    date_of_birth DATE NOT NULL,
    height_cm INTEGER,
    marital_status VARCHAR(30) NOT NULL DEFAULT 'unmarried' CHECK (marital_status IN ('unmarried', 'widowed', 'divorced')),
    education_level VARCHAR(100) NOT NULL,
    occupation_title VARCHAR(150) NOT NULL,
    annual_income_lakhs NUMERIC(6,2),
    work_location VARCHAR(100) NOT NULL,
    rasi VARCHAR(50) NOT NULL,
    nakshatram VARCHAR(50) NOT NULL,
    dosham_details VARCHAR(100),
    horoscope_chart_url TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    partner_expectations TEXT,
    privacy_tier VARCHAR(30) NOT NULL DEFAULT 'all_verified' CHECK (privacy_tier IN ('all_verified', 'request_only', 'admin_mediated')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 5. Matrimony: matrimonial_partner_preferences (Matching Engine)
  {
    id: 'matrimonial_partner_preferences',
    tableName: 'matrimonial_partner_preferences',
    module: 'Matrimony',
    description: 'Partner matching preferences table powering the automated compatibility and matrimonial recommendation algorithm.',
    fields: [
      { name: 'matrimonial_profile_id', type: 'UUID (PK, FK)', nullable: false, isPrimary: true, isForeign: true, foreignRef: 'matrimonial_profiles.id', description: 'One-to-one foreign key to candidate profile' },
      { name: 'min_age', type: 'INTEGER', nullable: false, description: 'Minimum preferred partner age' },
      { name: 'max_age', type: 'INTEGER', nullable: false, description: 'Maximum preferred partner age' },
      { name: 'preferred_sub_sects', type: 'TEXT[]', nullable: true, description: 'Array of acceptable Mudaliyar sub-sects, or empty for all' },
      { name: 'min_height_cm', type: 'INTEGER', nullable: true, description: 'Minimum height in cm' },
      { name: 'max_height_cm', type: 'INTEGER', nullable: true, description: 'Maximum height in cm' },
      { name: 'education_degrees', type: 'TEXT[]', nullable: true, description: 'Preferred qualifications (e.g., [B.E., MBBS, M.Tech, CA])' },
      { name: 'min_income_lakhs', type: 'NUMERIC(6,2)', nullable: true, description: 'Minimum annual income filter' },
      { name: 'preferred_rasis', type: 'TEXT[]', nullable: true, description: 'Preferred Rasi astrological matches' },
      { name: 'preferred_nakshatrams', type: 'TEXT[]', nullable: true, description: 'Compatible Porutham Nakshatram list' },
      { name: 'dosham_acceptable', type: 'VARCHAR(50)', nullable: false, description: 'none_only | chevvai_acceptable | any' },
      { name: 'preferred_districts', type: 'TEXT[]', nullable: true, description: 'Preferred native districts / cities' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Last preference modification timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_partner_pref_age ON matrimonial_partner_preferences(min_age, max_age);'
    ],
    ddl: `CREATE TABLE matrimonial_partner_preferences (
    matrimonial_profile_id UUID PRIMARY KEY REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
    min_age INTEGER NOT NULL DEFAULT 21,
    max_age INTEGER NOT NULL DEFAULT 35,
    preferred_sub_sects TEXT[] DEFAULT '{}',
    min_height_cm INTEGER,
    max_height_cm INTEGER,
    education_degrees TEXT[] DEFAULT '{}',
    min_income_lakhs NUMERIC(6,2),
    preferred_rasis TEXT[] DEFAULT '{}',
    preferred_nakshatrams TEXT[] DEFAULT '{}',
    dosham_acceptable VARCHAR(50) NOT NULL DEFAULT 'any',
    preferred_districts TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 6. Matrimony: matrimonial_interests
  {
    id: 'matrimonial_interests',
    tableName: 'matrimonial_interests',
    module: 'Matrimony',
    description: 'Expression of Interest (EOI) records between prospective bride and groom families with mutual unlock states.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Interest interaction ID' },
      { name: 'sender_profile_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'matrimonial_profiles.id', description: 'Profile initiating the proposal' },
      { name: 'receiver_profile_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'matrimonial_profiles.id', description: 'Target prospective profile' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'pending | accepted | declined | cancelled' },
      { name: 'message', type: 'VARCHAR(500)', nullable: true, description: 'Respectful introductory note' },
      { name: 'phone_shared', type: 'BOOLEAN', nullable: false, description: 'Set to true once receiver explicitly accepts the proposal' },
      { name: 'horoscope_unlocked', type: 'BOOLEAN', nullable: false, description: 'Granted access to view complete 12-box Jathagam chart' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Request timestamp' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_interests_unique ON matrimonial_interests(sender_profile_id, receiver_profile_id);',
      'CREATE INDEX idx_interests_receiver ON matrimonial_interests(receiver_profile_id, status);'
    ],
    ddl: `CREATE TABLE matrimonial_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_profile_id UUID NOT NULL REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
    receiver_profile_id UUID NOT NULL REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    message VARCHAR(500),
    phone_shared BOOLEAN NOT NULL DEFAULT false,
    horoscope_unlocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 7. Events & Archives: events
  {
    id: 'events',
    tableName: 'events',
    module: 'Events & Archives',
    description: 'Community event calendar for annual conferences, Thiruvalluvar Day, youth conclaves, matrimonial melas, and district branch meetings.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Unique event identifier' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Event title in English' },
      { name: 'title_ta', type: 'VARCHAR(255)', nullable: false, description: 'Event title in Tamil (தமிழ் தலைப்பு)' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Detailed agenda, keynote speakers, and itinerary in English' },
      { name: 'description_ta', type: 'TEXT', nullable: true, description: 'Detailed agenda and itinerary in Tamil' },
      { name: 'event_date', type: 'TIMESTAMPTZ', nullable: false, description: 'Start datetime' },
      { name: 'end_date', type: 'TIMESTAMPTZ', nullable: true, description: 'Conclusion datetime' },
      { name: 'venue_name', type: 'VARCHAR(200)', nullable: false, description: 'Mandapam, Temple, or Auditorium name' },
      { name: 'venue_address', type: 'TEXT', nullable: false, description: 'Complete physical street address' },
      { name: 'district', type: 'VARCHAR(100)', nullable: false, description: 'Hosting Tamil Nadu district' },
      { name: 'banner_url', type: 'TEXT', nullable: true, description: 'Promotional cover banner CDN link' },
      { name: 'registration_fee', type: 'NUMERIC(10,2)', nullable: false, description: '0.00 for free community gatherings, or ticket fee in INR' },
      { name: 'attendee_limit', type: 'INTEGER', nullable: true, description: 'Max seating capacity for RSVP' },
      { name: 'is_archived', type: 'BOOLEAN', nullable: false, description: 'Archived once event is completed' },
      { name: 'past_event_summary', type: 'TEXT', nullable: true, description: 'Official resolutions passed and minutes of the meeting' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Created timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_events_date ON events(event_date);',
      'CREATE INDEX idx_events_district ON events(district);'
    ],
    ddl: `CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    description_ta TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    venue_name VARCHAR(200) NOT NULL,
    venue_address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    banner_url TEXT,
    registration_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    attendee_limit INTEGER,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    past_event_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 8. Events & Archives: event_media_archives
  {
    id: 'event_media_archives',
    tableName: 'event_media_archives',
    module: 'Events & Archives',
    description: 'Archived high-resolution photo galleries and video highlight recordings from past community events, categorized chronologically by year.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Media archive record ID' },
      { name: 'event_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'events.id', description: 'Associated event record' },
      { name: 'media_type', type: 'VARCHAR(20)', nullable: false, description: 'photo | video_embed' },
      { name: 'media_url', type: 'TEXT', nullable: false, description: 'High-res image CDN URL or YouTube stream link' },
      { name: 'thumbnail_url', type: 'TEXT', nullable: true, description: 'Optimized web thumbnail for fast mobile grid display' },
      { name: 'caption', type: 'VARCHAR(255)', nullable: true, description: 'Photo caption or dignitaries featured' },
      { name: 'year', type: 'INTEGER', nullable: false, description: 'Event year (e.g., 2024)' },
      { name: 'uploaded_by', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Admin or media coordinator who uploaded the record' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Upload timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_media_event ON event_media_archives(event_id);',
      'CREATE INDEX idx_media_year ON event_media_archives(year);'
    ],
    ddl: `CREATE TABLE event_media_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video_embed')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption VARCHAR(255),
    year INTEGER NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 9. Community Feed & Forum: news_feed_posts
  {
    id: 'news_feed_posts',
    tableName: 'news_feed_posts',
    module: 'Community Feed & Forum',
    description: 'Real-time community news feed for official circulars, condolences (obituaries), community honors, educational scholarships, and local updates.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'News post identifier' },
      { name: 'author_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Admin or authorized secretary authoring the announcement' },
      { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'general | condolence | achievement | scholarship | circular' },
      { name: 'priority', type: 'VARCHAR(20)', nullable: false, description: 'normal | urgent | breaking' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'English headline' },
      { name: 'title_ta', type: 'VARCHAR(255)', nullable: false, description: 'Tamil headline' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Story body in English' },
      { name: 'content_ta', type: 'TEXT', nullable: true, description: 'Story body in Tamil' },
      { name: 'image_urls', type: 'TEXT[]', nullable: true, description: 'Attached images / circular scans' },
      { name: 'target_district', type: 'VARCHAR(100)', nullable: true, description: 'NULL for statewide, or specific district filter (e.g., Vellore)' },
      { name: 'share_count', type: 'INTEGER', nullable: false, description: 'Social shares counter' },
      { name: 'published_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Publish timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_news_published ON news_feed_posts(published_at DESC);',
      'CREATE INDEX idx_news_category ON news_feed_posts(category, priority);'
    ],
    ddl: `CREATE TABLE news_feed_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    category VARCHAR(50) NOT NULL CHECK (category IN ('general', 'condolence', 'achievement', 'scholarship', 'circular')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'breaking')),
    title VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_ta TEXT,
    image_urls TEXT[] DEFAULT '{}',
    target_district VARCHAR(100),
    share_count INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 10. Community Feed & Forum: forum_threads
  {
    id: 'forum_threads',
    tableName: 'forum_threads',
    module: 'Community Feed & Forum',
    description: 'Structured community discussion forum threads organized by categories (Heritage & History, Youth & Careers, Matrimonial Guidance, Local Sangam Matters).',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Thread identifier' },
      { name: 'category_id', type: 'VARCHAR(50)', nullable: false, description: 'heritage | career | matrimonial | welfare' },
      { name: 'author_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Member posting discussion' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Thread subject line' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Opening discussion post text' },
      { name: 'is_pinned', type: 'BOOLEAN', nullable: false, description: 'Pinned by moderators to top of category' },
      { name: 'is_locked', type: 'BOOLEAN', nullable: false, description: 'Locked to prevent further replies' },
      { name: 'views_count', type: 'INTEGER', nullable: false, description: 'Total view impressions counter' },
      { name: 'replies_count', type: 'INTEGER', nullable: false, description: 'Cached count of approved replies' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Thread creation timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_forum_category ON forum_threads(category_id, created_at DESC);'
    ],
    ddl: `CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    views_count INTEGER NOT NULL DEFAULT 0,
    replies_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 11. Community Feed & Forum: forum_replies
  {
    id: 'forum_replies',
    tableName: 'forum_replies',
    module: 'Community Feed & Forum',
    description: 'Discussion replies and nested comments within forum threads with moderation and upvoting.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Reply identifier' },
      { name: 'thread_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'forum_threads.id', description: 'Parent thread' },
      { name: 'parent_reply_id', type: 'UUID (FK)', nullable: true, isForeign: true, foreignRef: 'forum_replies.id', description: 'Optional parent reply for threaded conversations' },
      { name: 'author_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Replying member' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Reply body text' },
      { name: 'is_approved', type: 'BOOLEAN', nullable: false, description: 'Moderator approval flag' },
      { name: 'upvotes_count', type: 'INTEGER', nullable: false, description: 'Helpful upvotes count' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_replies_thread ON forum_replies(thread_id, created_at ASC);'
    ],
    ddl: `CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 12. Admin & RBAC: admin_roles
  {
    id: 'admin_roles',
    tableName: 'admin_roles',
    module: 'Admin & RBAC',
    description: 'Granular admin role definitions, hierarchy rankings, and JSON permission capability matrices.',
    fields: [
      { name: 'id', type: 'VARCHAR(50) (PK)', nullable: false, isPrimary: true, description: 'Role key: super_admin | trustee | district_coordinator | matrimony_moderator' },
      { name: 'role_name', type: 'VARCHAR(100)', nullable: false, description: 'Role title in English' },
      { name: 'role_name_ta', type: 'VARCHAR(100)', nullable: false, description: 'Role title in Tamil' },
      { name: 'hierarchy_level', type: 'INTEGER', nullable: false, description: 'Hierarchy level: 1 (Super Admin) to 5 (Area Moderator)' },
      { name: 'permissions_json', type: 'JSONB', nullable: false, description: 'JSON permissions map: { can_verify_members: true, can_view_pii: false, ... }' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Role responsibilities description' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_admin_roles_key ON admin_roles(id);'
    ],
    ddl: `CREATE TABLE admin_roles (
    id VARCHAR(50) PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    role_name_ta VARCHAR(100) NOT NULL,
    hierarchy_level INTEGER NOT NULL CHECK (hierarchy_level BETWEEN 1 AND 5),
    permissions_json JSONB NOT NULL DEFAULT '{}',
    description TEXT
);`
  },

  // 13. Admin & RBAC: admin_role_assignments
  {
    id: 'admin_role_assignments',
    tableName: 'admin_role_assignments',
    module: 'Admin & RBAC',
    description: 'Active role assignments linking member accounts to admin roles with jurisdictional district or statewide operational scope.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Assignment identifier' },
      { name: 'user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Designated admin user' },
      { name: 'role_id', type: 'VARCHAR(50) (FK)', nullable: false, isForeign: true, foreignRef: 'admin_roles.id', description: 'Assigned role key' },
      { name: 'scope_type', type: 'VARCHAR(30)', nullable: false, description: 'statewide | district | taluk' },
      { name: 'scope_district', type: 'VARCHAR(100)', nullable: true, description: 'e.g. Kanchipuram, or NULL for statewide' },
      { name: 'assigned_by_user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Trustee authorizing the role' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Active assignment status' },
      { name: 'assigned_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Assignment grant date' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_user_role_scope ON admin_role_assignments(user_id, role_id, scope_district) WHERE is_active = true;'
    ],
    ddl: `CREATE TABLE admin_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(50) NOT NULL REFERENCES admin_roles(id),
    scope_type VARCHAR(30) NOT NULL DEFAULT 'district' CHECK (scope_type IN ('statewide', 'district', 'taluk')),
    scope_district VARCHAR(100),
    assigned_by_user_id UUID NOT NULL REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 14. Admin & RBAC: content_moderation_reports
  {
    id: 'content_moderation_reports',
    tableName: 'content_moderation_reports',
    module: 'Admin & RBAC',
    description: 'User-submitted grievance reports for abusive comments, fraudulent matrimonial profiles, or guideline violations.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Report identifier' },
      { name: 'reporter_user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Member reporting the violation' },
      { name: 'target_type', type: 'VARCHAR(50)', nullable: false, description: 'matrimonial_profile | forum_thread | forum_reply | user' },
      { name: 'target_id', type: 'UUID', nullable: false, description: 'ID of offending content' },
      { name: 'reason', type: 'VARCHAR(100)', nullable: false, description: 'fake_profile | dowry_demand | profanity | harassment | duplicate' },
      { name: 'details', type: 'TEXT', nullable: true, description: 'Detailed user explanation' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'pending | resolved | dismissed' },
      { name: 'action_taken', type: 'VARCHAR(100)', nullable: true, description: 'content_deleted | user_warned | user_suspended | no_action' },
      { name: 'resolved_by_admin_id', type: 'UUID (FK)', nullable: true, isForeign: true, foreignRef: 'users.id', description: 'Moderator who handled the report' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Report creation timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_mod_reports_status ON content_moderation_reports(status);'
    ],
    ddl: `CREATE TABLE content_moderation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID NOT NULL REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('matrimonial_profile', 'forum_thread', 'forum_reply', 'user')),
    target_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    action_taken VARCHAR(100),
    resolved_by_admin_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  },

  // 15. Payments & Subscriptions: subscriptions_and_donations
  {
    id: 'subscriptions_and_donations',
    tableName: 'subscriptions_and_donations',
    module: 'Payments & Subscriptions',
    description: 'Tracks recurring memberships, matrimonial premium packages, and welfare donations with automated 80G tax receipt references.',
    fields: [
      { name: 'id', type: 'UUID (PK)', nullable: false, isPrimary: true, description: 'Subscription ID' },
      { name: 'user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Subscribing member' },
      { name: 'tier_type', type: 'VARCHAR(50)', nullable: false, description: 'annual_membership | life_patron | matrimonial_premium_monthly | matrimonial_unlimited' },
      { name: 'amount', type: 'NUMERIC(10,2)', nullable: false, description: 'Amount paid in INR' },
      { name: 'is_recurring', type: 'BOOLEAN', nullable: false, description: 'True if UPI / Card recurring mandate is active' },
      { name: 'gateway_mandate_id', type: 'VARCHAR(100)', nullable: true, description: 'Razorpay / Cashfree mandate reference' },
      { name: 'valid_from', type: 'TIMESTAMPTZ', nullable: false, description: 'Activation date' },
      { name: 'valid_until', type: 'TIMESTAMPTZ', nullable: false, description: 'Expiration date' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'active | cancelled | past_due | completed' },
      { name: 'receipt_80g_number', type: 'VARCHAR(100)', nullable: true, description: 'Form 10BE / 80G tax receipt number' }
    ],
    indexes: [
      'CREATE INDEX idx_sub_user_status ON subscriptions_and_donations(user_id, status);',
      'CREATE INDEX idx_sub_validity ON subscriptions_and_donations(valid_until);'
    ],
    ddl: `CREATE TABLE subscriptions_and_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_type VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    gateway_mandate_id VARCHAR(100),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'completed')),
    receipt_80g_number VARCHAR(100) UNIQUE
);`
  },

  // 16. System & Audit: audit_logs
  {
    id: 'audit_logs',
    tableName: 'audit_logs',
    module: 'System & Audit',
    description: 'Tamper-evident audit trail of all administrative actions (member verification approvals, document inspections, broadcast alerts, and profile bans).',
    fields: [
      { name: 'id', type: 'BIGSERIAL (PK)', nullable: false, isPrimary: true, description: 'Monotonically increasing log ID' },
      { name: 'actor_user_id', type: 'UUID (FK)', nullable: false, isForeign: true, foreignRef: 'users.id', description: 'Admin or moderator performing action' },
      { name: 'action', type: 'VARCHAR(100)', nullable: false, description: 'approve_member | reject_doc | view_horoscope | send_broadcast' },
      { name: 'target_entity', type: 'VARCHAR(50)', nullable: false, description: 'users | matrimonial_profiles | events | verification_documents' },
      { name: 'target_id', type: 'UUID', nullable: false, description: 'ID of affected record' },
      { name: 'ip_address', type: 'INET', nullable: true, description: 'IP of administrator' },
      { name: 'metadata_json', type: 'JSONB', nullable: true, description: 'Previous vs new state diff' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Immutable log timestamp' }
    ],
    indexes: [
      'CREATE INDEX idx_audit_actor ON audit_logs(actor_user_id, created_at DESC);',
      'CREATE INDEX idx_audit_target ON audit_logs(target_entity, target_id);'
    ],
    ddl: `CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    ip_address INET,
    metadata_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  }
];
