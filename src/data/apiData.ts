import { ApiEndpoint } from '../types';

export const API_ENDPOINTS: ApiEndpoint[] = [
  // =========================================================================
  // 1. AUTHENTICATION & USER MANAGEMENT
  // =========================================================================
  {
    id: 'api-auth-register',
    method: 'POST',
    path: '/api/v1/auth/register-otp',
    module: 'Authentication',
    summary: 'Request OTP for Phone Number Registration or Login',
    summaryTa: 'தொலைபேசி எண் மூலம் OTP பதிவு / உள்நுழைவு கோருதல்',
    accessRole: 'Public (Guest)',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'ta, en-US;q=0.9',
      'X-App-Platform': 'android | ios | web'
    },
    requestBody: `{
  "phoneNumber": "+919876543210",
  "locale": "ta",
  "deviceInfo": {
    "platform": "Android",
    "appVersion": "1.0.4",
    "fcmToken": "eXamPleFcmTokEn9812..."
  }
}`,
    responseSample: `{
  "success": true,
  "message": "OTP dispatched successfully via approved DLT gateway",
  "data": {
    "sessionId": "otp_sess_9a8b7c6d5e",
    "expiresInSeconds": 180,
    "resendCooldownSeconds": 60
  }
}`,
    statusCodes: [
      { code: 200, description: 'OTP successfully dispatched to user phone' },
      { code: 400, description: 'Invalid Indian E.164 phone number format (+91XXXXXXXXXX)' },
      { code: 429, description: 'Rate limit exceeded (maximum 3 OTP requests per hour per IP/Device)' }
    ]
  },
  {
    id: 'api-auth-verify',
    method: 'POST',
    path: '/api/v1/auth/verify-otp',
    module: 'Authentication',
    summary: 'Verify OTP & Issue JWT Bearer Auth Tokens',
    summaryTa: 'OTP சரிபார்த்து உள்நுழைவு டோக்கன் பெறுதல்',
    accessRole: 'Public (Guest)',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    requestBody: `{
  "sessionId": "otp_sess_9a8b7c6d5e",
  "otp": "482910",
  "fullName": "M. Sivasankaran Mudaliyar"
}`,
    responseSample: `{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ref_882194fbc9a044...",
    "expiresIn": 86400,
    "user": {
      "id": "7b82f801-4468-4560-b998-ef22a98e8334",
      "fullName": "M. Sivasankaran Mudaliyar",
      "phone": "+919876543210",
      "role": "member",
      "verificationStatus": "pending_review",
      "preferredLanguage": "ta"
    }
  }
}`,
    statusCodes: [
      { code: 200, description: 'User authenticated successfully; tokens returned' },
      { code: 401, description: 'Invalid or expired OTP code' },
      { code: 422, description: 'Unprocessable input entity' }
    ]
  },
  {
    id: 'api-users-me',
    method: 'GET',
    path: '/api/v1/users/me',
    module: 'User Management',
    summary: 'Retrieve Authenticated Member Profile & Lineage Information',
    summaryTa: 'உள்நுழைந்த உறுப்பினரின் சுயவிவரம் மற்றும் குல தகவல்களைப் பெறுதல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    responseSample: `{
  "success": true,
  "data": {
    "id": "7b82f801-4468-4560-b998-ef22a98e8334",
    "fullName": "M. Sivasankaran Mudaliyar",
    "fullNameTa": "மு. சிவசுப்பிரமணிய முதலியார்",
    "phoneNumber": "+919876543210",
    "email": "sivasankaran.m@gmail.com",
    "role": "member",
    "verificationStatus": "verified",
    "preferredLanguage": "ta",
    "profile": {
      "membershipCode": "MUD-CHN-2026-0412",
      "subSect": "Thondaimandala Saiva",
      "gotramKulam": "Siva Gotram",
      "kulaDeivamTemple": "Sri Agatheeswarar Temple, Mangadu",
      "nativePlaceOor": "Kanchipuram",
      "nativeDistrict": "Kanchipuram",
      "currentCity": "Chennai",
      "occupation": "Senior Software Architect",
      "bloodGroup": "O+ve",
      "isBloodDonorAvailable": true,
      "verifiedAt": "2026-08-15T10:00:00Z"
    }
  }
}`,
    statusCodes: [
      { code: 200, description: 'Profile retrieved' },
      { code: 401, description: 'Unauthorized: Missing or invalid Bearer token' }
    ]
  },
  {
    id: 'api-users-profile-update',
    method: 'PUT',
    path: '/api/v1/users/profile',
    module: 'User Management',
    summary: 'Update Member Personal Details, Contact Info & Preferences',
    summaryTa: 'உறுப்பினர் தொடர்பு விவரங்கள் மற்றும் விருப்பங்களை புதுப்பித்தல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    requestBody: `{
  "email": "sivasankaran.new@gmail.com",
  "preferredLanguage": "ta",
  "currentCity": "Coimbatore",
  "occupation": "VP of Technology",
  "bloodGroup": "O+ve",
  "isBloodDonorAvailable": true
}`,
    responseSample: `{
  "success": true,
  "message": "Member profile updated successfully",
  "data": {
    "updatedAt": "2026-09-07T14:20:00Z"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Profile updated' },
      { code: 400, description: 'Invalid email or blood group format' },
      { code: 401, description: 'Unauthorized' }
    ]
  },
  {
    id: 'api-verif-upload',
    method: 'POST',
    path: '/api/v1/verification/upload-id',
    module: 'User Management',
    summary: 'Submit Masked Govt ID Proof for Sangam Verification Badge',
    summaryTa: 'உறுப்பினர் சரிபார்ப்புக்காக அரசு அடையாள ஆவணம் பதிவேற்றம்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'multipart/form-data',
      'X-App-Platform': 'android | ios | web'
    },
    requestBody: `{
  "documentType": "aadhaar_card",
  "maskedDocumentNumber": "XXXX-XXXX-8921",
  "subSect": "Thondaimandala Saiva",
  "gotramKulam": "Siva Gotram",
  "kulaDeivam": "Sri Agatheeswarar Temple, Mangadu",
  "nativePlace": "Kanchipuram",
  "nativeDistrict": "Kanchipuram",
  "file": "<Binary PDF/JPEG: max 5MB>"
}`,
    responseSample: `{
  "success": true,
  "message": "Document submitted to District Coordinator review queue",
  "data": {
    "submissionId": "vdoc_331908",
    "status": "pending_review",
    "districtAssigned": "Kanchipuram",
    "estimatedTurnaroundDays": 2
  }
}`,
    statusCodes: [
      { code: 201, description: 'Verification document submitted' },
      { code: 400, description: 'Invalid document type or unmasked Aadhaar number' },
      { code: 413, description: 'File size exceeds 5MB limit' }
    ]
  },

  // =========================================================================
  // 1B. MEMBER ADDRESS BOOK & PRIVACY WORKFLOW
  // =========================================================================
  {
    id: 'api-address-book-search',
    method: 'GET',
    path: '/api/v1/address-book',
    module: 'Member Address Book',
    summary: 'Search Member Address Book with DPDP Dynamic Masking & Privacy Controls',
    summaryTa: 'அங்கத்தினர் முகவரி புத்தகத்தில் தேடுதல் (பாதுகாப்பு மறைப்புகளுடன்)',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'q', type: 'string', required: false, description: 'Name, native place (Sontha Oor), or membership ID search query' },
      { name: 'district', type: 'string', required: false, description: 'Filter by district in Tamil Nadu' },
      { name: 'subSect', type: 'string', required: false, description: 'Filter by Mudaliyar sub-sect' },
      { name: 'privacyFilter', type: 'string', required: false, description: 'all | unlocked | masked | public' },
      { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Results per page (default: 20)' }
    ],
    responseSample: `{
  "success": true,
  "data": {
    "total": 128,
    "page": 1,
    "members": [
      {
        "id": "mem-101",
        "fullName": "R. Natarajan Mudaliyar",
        "fullNameTa": "இரா. நடராஜன் முதலியார்",
        "membershipCode": "MUD-KCH-2024-0129",
        "subSect": "Thondaimandala Saiva",
        "nativePlaceOor": "Kanchipuram",
        "nativeDistrict": "Kanchipuram",
        "bloodGroup": "O+ve",
        "privacyLevel": "public_to_members",
        "isUnlockedForViewer": true,
        "phone": "+91 98401 22345",
        "address": {
          "doorNumber": "48/B",
          "streetName": "Gandhi Road",
          "areaLocality": "Periya Kanchipuram",
          "city": "Kanchipuram",
          "district": "Kanchipuram",
          "pincode": "631501"
        }
      },
      {
        "id": "mem-102",
        "fullName": "Dr. K. Meenakshi Sundaram Mudaliyar",
        "fullNameTa": "டாக்டர் கே. மீனாட்சி சுந்தரம் முதலியார்",
        "membershipCode": "MUD-CHN-2025-0452",
        "subSect": "Thondaimandala Saiva",
        "nativePlaceOor": "Poonamallee",
        "nativeDistrict": "Tiruvallur",
        "bloodGroup": "A+ve",
        "privacyLevel": "request_only",
        "isUnlockedForViewer": false,
        "phone": "+91 94*** **124",
        "address": {
          "doorNumber": "[Protected / மறைக்கப்பட்டது]",
          "streetName": "[Protected / மறைக்கப்பட்டது]",
          "areaLocality": "Anna Nagar West",
          "city": "Chennai",
          "district": "Chennai",
          "pincode": "600040"
        },
        "requestStatus": "none"
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Address book directory retrieved with role & consent masking' },
      { code: 401, description: 'Unauthorized' },
      { code: 403, description: 'Forbidden: Account unverified' }
    ]
  },
  {
    id: 'api-address-book-privacy-toggle',
    method: 'PUT',
    path: '/api/v1/address-book/privacy',
    module: 'Member Address Book',
    summary: 'Update Logged-in Member Address Book Privacy Setting (Public vs Approval Required)',
    summaryTa: 'தனது முகவரி மற்றும் தொலைபேசி பார்வை அனுமதியை மாற்றுதல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "addressPrivacy": "request_only",
  "phonePrivacy": "request_only",
  "allowDirectCallsFromSangamAdmins": true
}`,
    responseSample: `{
  "success": true,
  "message": "Address privacy updated successfully. Door number, street, and phone will be masked to other members until you approve their access request.",
  "data": {
    "userId": "7b82f801-4468-4560-b998-ef22a98e8334",
    "addressPrivacy": "request_only",
    "phonePrivacy": "request_only",
    "updatedAt": "2026-09-07T14:00:00Z"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Privacy preferences saved' },
      { code: 400, description: 'Invalid privacy setting value' }
    ]
  },
  {
    id: 'api-address-book-request-access',
    method: 'POST',
    path: '/api/v1/address-book/requests',
    module: 'Member Address Book',
    summary: 'Submit Request to Unmask another Member Address & Mobile Details',
    summaryTa: 'உறுப்பினரின் முழு முகவரியை பார்க்க அனுமதி கோருதல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "targetUserId": "mem-102",
  "reason": "Dispatching invitation for ancestral Kula Deivam temple kumbhabishekam and village gathering"
}`,
    responseSample: `{
  "success": true,
  "message": "Access request dispatched. SMS and Push Notification sent to target member.",
  "data": {
    "requestId": "req_881902",
    "status": "pending",
    "createdAt": "2026-09-07T14:05:00Z"
  }
}`,
    statusCodes: [
      { code: 201, description: 'Request created and notification sent' },
      { code: 400, description: 'Target user does not exist or duplicate pending request exists' }
    ]
  },
  {
    id: 'api-address-book-incoming-requests',
    method: 'GET',
    path: '/api/v1/address-book/incoming-requests',
    module: 'Member Address Book',
    summary: 'Retrieve List of Other Members Requesting to View Your Address Details',
    summaryTa: 'உங்கள் முகவரியைப் பார்க்க வந்துள்ள கோரிக்கைகளின் பட்டியல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>'
    },
    responseSample: `{
  "success": true,
  "data": {
    "pendingCount": 2,
    "requests": [
      {
        "id": "req-201",
        "requester": {
          "id": "usr-901",
          "fullName": "K. Balasubramanian Mudaliyar",
          "phone": "+91 98402 77819",
          "nativePlace": "Walajapet, Ranipet Dist"
        },
        "reason": "Family wedding invitation dispatch & native village lineage coordination",
        "status": "pending",
        "createdAt": "2026-09-06T11:20:00Z"
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Incoming requests retrieved' }
    ]
  },
  {
    id: 'api-address-book-respond-request',
    method: 'PATCH',
    path: '/api/v1/address-book/requests/:requestId',
    module: 'Member Address Book',
    summary: 'Approve or Reject an Address Access Request from Another Member',
    summaryTa: 'முகவரி அணுகல் கோரிக்கைக்கு ஒப்புதல் அளித்தல் அல்லது நிராகரித்தல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "action": "approve",
  "grantDurationDays": 90
}`,
    responseSample: `{
  "success": true,
  "message": "Access granted. The requesting member can now view your unmasked address and phone number.",
  "data": {
    "requestId": "req-201",
    "status": "approved",
    "approvedAt": "2026-09-07T14:10:00Z",
    "expiresAt": "2026-12-06T14:10:00Z"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Request approved or rejected' },
      { code: 404, description: 'Request not found or not owned by user' }
    ]
  },

  // =========================================================================
  // 2. MATRIMONIAL & MATCHMAKING
  // =========================================================================
  {
    id: 'api-matrimony-search',
    method: 'GET',
    path: '/api/v1/matrimony/profiles',
    module: 'Matrimonial Database',
    summary: 'Search Verified Matrimonial Profiles with Dynamic Watermarking',
    summaryTa: 'திருமண வரன்கள் தேடல் (பாதுகாப்பு கட்டுப்பாடுகளுடன்)',
    accessRole: 'Verified Member / Premium Subscriber',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'gender', type: 'string', required: true, description: 'bride (female) or groom (male)' },
      { name: 'minAge', type: 'number', required: false, description: 'Minimum age filter (e.g., 24)' },
      { name: 'maxAge', type: 'number', required: false, description: 'Maximum age filter (e.g., 29)' },
      { name: 'subSect', type: 'string', required: false, description: 'Filter by sub-sect' },
      { name: 'rasi', type: 'string', required: false, description: 'Astrological Rasi' },
      { name: 'nakshatram', type: 'string', required: false, description: 'Nakshatram match' },
      { name: 'education', type: 'string', required: false, description: 'Degree keyword (e.g., B.E., MBBS)' }
    ],
    responseSample: `{
  "success": true,
  "data": {
    "total": 348,
    "page": 1,
    "profiles": [
      {
        "id": "mat_551029",
        "profileFor": "daughter",
        "gender": "female",
        "age": 26,
        "heightCm": 165,
        "education": "M.Tech (Computer Science), IIT Madras",
        "occupation": "Lead Software Engineer, Amazon",
        "workLocation": "Bengaluru",
        "annualIncomeLakhs": 28.5,
        "rasi": "Rishabam",
        "nakshatram": "Rohini",
        "dosham": "No Dosham",
        "nativePlace": "Tiruvannamalai",
        "subSect": "Thondaimandala Saiva",
        "watermarkedThumbnailUrl": "https://cdn.sangam.org/media/w_thumb_99a.jpg?sig=...",
        "privacyTier": "request_only",
        "canViewContact": false
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Matrimonial profiles returned' },
      { code: 403, description: 'Forbidden: Requires verified community member badge' }
    ]
  },
  {
    id: 'api-matrimony-matches',
    method: 'GET',
    path: '/api/v1/matrimony/matches',
    module: 'Matrimonial Database',
    summary: 'Automated Matchmaking Algorithm based on Saved Partner Preferences',
    summaryTa: 'விருப்பங்களின் அடிப்படையில் தானியங்கி பொருத்தமான வரன்கள்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'minCompatibilityScore', type: 'number', required: false, description: 'Filter score (0-100, default: 70)' }
    ],
    responseSample: `{
  "success": true,
  "data": {
    "candidateProfileId": "mat_551029",
    "totalMatches": 18,
    "matches": [
      {
        "profileId": "mat_881920",
        "nameMasked": "R. K******* M.",
        "gender": "male",
        "age": 28,
        "heightCm": 178,
        "education": "MS (Robotics), Germany",
        "occupation": "Automation Architect, Bosch",
        "annualIncomeLakhs": 42.0,
        "rasi": "Kadagam",
        "nakshatram": "Punarpoosam",
        "compatibilityScore": 92,
        "matchingFactors": {
          "poruthamAstrology": "8/10 Poruthams Matched",
          "subSectMatch": true,
          "ageGapYears": 2,
          "educationTierMatch": true
        },
        "watermarkedPhoto": "https://cdn.sangam.org/media/w_thumb_881.jpg?sig=..."
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Ranked matches returned' },
      { code: 404, description: 'No active matrimonial profile registered for user' }
    ]
  },
  {
    id: 'api-matrimony-preferences-update',
    method: 'PUT',
    path: '/api/v1/matrimony/preferences',
    module: 'Matrimonial Database',
    summary: 'Save or Update Preferred Partner Criteria for Matching Engine',
    summaryTa: 'வரன் தேடல் அளவுகோல்கள் மற்றும் விருப்பங்களை சேமித்தல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "minAge": 24,
  "maxAge": 29,
  "preferredSubSects": ["Thondaimandala Saiva", "Sengunthar"],
  "minHeightCm": 160,
  "maxHeightCm": 180,
  "educationDegrees": ["B.E.", "M.Tech", "MBBS", "MS"],
  "minIncomeLakhs": 15.0,
  "preferredRasis": ["Rishabam", "Kadagam", "Kanni"],
  "doshamAcceptable": "none_only",
  "preferredDistricts": ["Chennai", "Kanchipuram", "Coimbatore"]
}`,
    responseSample: `{
  "success": true,
  "message": "Partner preferences updated; matching engine recalculated",
  "data": {
    "totalEligibleMatches": 42
  }
}`,
    statusCodes: [
      { code: 200, description: 'Preferences saved' },
      { code: 400, description: 'Invalid age or height boundaries' }
    ]
  },
  {
    id: 'api-matrimony-interest',
    method: 'POST',
    path: '/api/v1/matrimony/express-interest',
    module: 'Matrimonial Database',
    summary: 'Send Formal Expression of Interest (EOI) to Candidate Family',
    summaryTa: 'வரன் குடும்பத்திற்கு விருப்பக் கோரிக்கை அனுப்புதல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "targetProfileId": "mat_551029",
  "introductoryMessage": "Vanakkam. We reviewed your profile and are keen on discussing an alliance. Please review our candidate details.",
  "requestHoroscopeUnlock": true,
  "requestContactUnlock": true
}`,
    responseSample: `{
  "success": true,
  "message": "Expression of Interest dispatched to candidate family",
  "data": {
    "interestId": "intr_77192",
    "status": "pending",
    "notifiedChannels": ["fcm_push", "sms_dlt"]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Interest dispatched' },
      { code: 409, description: 'Interest already sent or currently pending' }
    ]
  },
  {
    id: 'api-matrimony-interest-respond',
    method: 'PATCH',
    path: '/api/v1/matrimony/interests/:id',
    module: 'Matrimonial Database',
    summary: 'Respond to Matrimonial Proposal (Accept / Decline / Unlock Contact)',
    summaryTa: 'வரன் விருப்பக் கோரிக்கையை ஏற்றுக்கொள் அல்லது நிராகரி',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "action": "accept",
  "unlockPhone": true,
  "unlockHoroscope": true,
  "replyNote": "Vanakkam. We would like to initiate phone discussion."
}`,
    responseSample: `{
  "success": true,
  "message": "Proposal accepted. Contact numbers and horoscope chart unlocked for both families.",
  "data": {
    "interestId": "intr_77192",
    "status": "accepted",
    "candidatePhoneUnlocked": "+919876543210"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Response recorded and notification sent' },
      { code: 404, description: 'Interest ID not found' }
    ]
  },

  // =========================================================================
  // 3. EVENTS & HISTORICAL ARCHIVES
  // =========================================================================
  {
    id: 'api-events-list',
    method: 'GET',
    path: '/api/v1/events',
    module: 'Events & Archives',
    summary: 'Retrieve Community Events Calendar (Upcoming & Historical)',
    summaryTa: 'சமூக நிகழ்வுகள் மற்றும் முந்தைய வரலாற்று ஆவணங்கள்',
    accessRole: 'Public / Verified Member',
    headers: {
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'filter', type: 'string', required: false, description: 'upcoming | past_archives | all' },
      { name: 'district', type: 'string', required: false, description: 'Filter by district (e.g., Chennai)' },
      { name: 'year', type: 'number', required: false, description: 'Historical archive year (e.g., 2024)' }
    ],
    responseSample: `{
  "success": true,
  "data": [
    {
      "id": "evt_2026_agm",
      "title": "52nd Annual Mudaliyar Mahasangam State Conference",
      "titleTa": "52-வது மாநில முதலியார் மகாசங்க மாநாடு மற்றும் இளைஞர் கருத்தரங்கம்",
      "eventDate": "2026-10-15T09:30:00Z",
      "endDate": "2026-10-15T18:00:00Z",
      "venue": "Sri Raja Rajeswari Hall, Dr. Radhakrishnan Salai, Chennai",
      "district": "Chennai",
      "registrationFee": 0,
      "isArchived": false,
      "registeredAttendees": 850,
      "bannerUrl": "https://cdn.sangam.org/events/2026_state_conf.jpg"
    }
  ]
}`,
    statusCodes: [
      { code: 200, description: 'Events retrieved' }
    ]
  },
  {
    id: 'api-events-create',
    method: 'POST',
    path: '/api/v1/events',
    module: 'Events & Archives',
    summary: 'Create New Community Gathering, Conference or Youth Conclave',
    summaryTa: 'புதிய சமூக நிகழ்வு அல்லது மாநாட்டை உருவாக்குதல்',
    accessRole: 'District Coordinator / Admin',
    headers: {
      'Authorization': 'Bearer <ADMIN_ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "title": "Mudaliyar Youth Entrepreneurship Conclave 2026",
  "titleTa": "முதலியார் இளைஞர் தொழில்முனைவோர் மாநாடு 2026",
  "description": "Statewide conference bringing together Mudaliyar business leaders, startups, and mentors.",
  "eventDate": "2026-11-22T10:00:00Z",
  "endDate": "2026-11-22T17:00:00Z",
  "venueName": "Karpagam Hall, Vellore",
  "venueAddress": "Gandhi Road, Vellore - 632004",
  "district": "Vellore",
  "registrationFee": 250.00,
  "attendeeLimit": 500,
  "bannerUrl": "https://cdn.sangam.org/events/youth_2026.jpg"
}`,
    responseSample: `{
  "success": true,
  "message": "Event published and calendar updated",
  "data": {
    "eventId": "evt_2026_youth_vellore"
  }
}`,
    statusCodes: [
      { code: 201, description: 'Event created' },
      { code: 403, description: 'Forbidden: Admin or Coordinator role required' }
    ]
  },
  {
    id: 'api-events-archives-media',
    method: 'GET',
    path: '/api/v1/events/:id/media-archives',
    module: 'Events & Archives',
    summary: 'Retrieve High-Res Photo Galleries & Video Recaps of Past Events',
    summaryTa: 'கடந்த கால நிகழ்வுகளின் புகைப்பட மற்றும் வீடியோ ஆவணங்கள்',
    accessRole: 'Public / Verified Member',
    headers: {
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    responseSample: `{
  "success": true,
  "data": {
    "eventId": "evt_2024_youth",
    "eventTitle": "Mudaliyar Youth Entrepreneurship Conclave 2024",
    "year": 2024,
    "totalPhotos": 64,
    "media": [
      {
        "id": "med_101",
        "mediaType": "photo",
        "url": "https://cdn.sangam.org/archives/2024/youth_conclave_01.jpg",
        "thumbnailUrl": "https://cdn.sangam.org/archives/2024/thumbs/youth_conclave_01.jpg",
        "caption": "Inauguration lamp lighting by Sangam Trustees",
        "uploadedAt": "2024-11-20T14:30:00Z"
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Archive media returned' }
    ]
  },

  // =========================================================================
  // 4. COMMUNITY FEED & DISCUSSION FORUM
  // =========================================================================
  {
    id: 'api-feed-list',
    method: 'GET',
    path: '/api/v1/feed',
    module: 'Community Feed & Forum',
    summary: 'Real-Time News Feed, Official Circulars & Demise Condolences',
    summaryTa: 'சமூக அறிவிப்புகள், சுற்றறிக்கைகள் மற்றும் இரங்கல் செய்திகள்',
    accessRole: 'Public / Verified Member',
    headers: {
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'category', type: 'string', required: false, description: 'general | condolence | achievement | scholarship | circular' },
      { name: 'priority', type: 'string', required: false, description: 'urgent | normal' },
      { name: 'district', type: 'string', required: false, description: 'Filter by district' }
    ],
    responseSample: `{
  "success": true,
  "data": [
    {
      "id": "post_881",
      "category": "condolence",
      "priority": "urgent",
      "title": "Deep Condolences: Senior Trustee Thiru. S. Arumuga Mudaliyar",
      "titleTa": "ஆழ்ந்த இரங்கல்: சங்கத்தின் மூத்த அறங்காவலர் திரு. ச. ஆறுமுக முதலியார் இயற்கை எய்தினார்",
      "content": "With profound grief, we announce the demise of our revered patron on 05-Sep-2026. Final rites at Kanchipuram...",
      "publishedAt": "2026-09-05T08:00:00Z",
      "shareUrl": "https://sangam.org/news/post_881"
    }
  ]
}`,
    statusCodes: [
      { code: 200, description: 'Feed items retrieved' }
    ]
  },
  {
    id: 'api-feed-create',
    method: 'POST',
    path: '/api/v1/feed',
    module: 'Community Feed & Forum',
    summary: 'Publish News Announcement, Obituary Notice or Scholarship Notice',
    summaryTa: 'புதிய செய்தி அல்லது இரங்கல் அறிவிப்பை வெளியிடுதல்',
    accessRole: 'Admin / Moderator',
    headers: {
      'Authorization': 'Bearer <ADMIN_ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "category": "scholarship",
  "priority": "normal",
  "title": "Mudaliyar Educational Merit Scholarship 2026-27 Announced",
  "titleTa": "முதலியார் கல்வி அறக்கட்டளை உதவித்தொகை 2026-27 விண்ணப்பங்கள் வரவேற்பு",
  "content": "Applications are invited from community students pursuing Engineering, Medical, and CA courses...",
  "targetDistrict": "All",
  "imageUrls": ["https://cdn.sangam.org/circulars/scholarship_2026.jpg"]
}`,
    responseSample: `{
  "success": true,
  "message": "Announcement published and push notification dispatched",
  "data": {
    "postId": "post_992"
  }
}`,
    statusCodes: [
      { code: 201, description: 'News post created' },
      { code: 403, description: 'Forbidden' }
    ]
  },
  {
    id: 'api-feed-delete',
    method: 'DELETE',
    path: '/api/v1/feed/:id',
    module: 'Community Feed & Forum',
    summary: 'Retract or Remove Announcement Post from Community Feed',
    summaryTa: 'செய்தி அறிவிப்பை நீக்குதல் அல்லது திரும்பப் பெறுதல்',
    accessRole: 'Admin / Moderator',
    headers: {
      'Authorization': 'Bearer <ADMIN_ACCESS_TOKEN>'
    },
    responseSample: `{
  "success": true,
  "message": "News feed post deleted"
}`,
    statusCodes: [
      { code: 200, description: 'Post deleted successfully' },
      { code: 404, description: 'Post ID not found' }
    ]
  },
  {
    id: 'api-forum-threads-list',
    method: 'GET',
    path: '/api/v1/forum/threads',
    module: 'Community Feed & Forum',
    summary: 'Retrieve Discussion Forum Threads by Category & Pagination',
    summaryTa: 'கலந்துரையாடல் தலைப்புகளைப் பெறுதல்',
    accessRole: 'Public / Verified Member',
    headers: {
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'categoryId', type: 'string', required: false, description: 'heritage | career | matrimonial | welfare' },
      { name: 'page', type: 'number', required: false, description: 'Page index (default: 1)' }
    ],
    responseSample: `{
  "success": true,
  "data": {
    "total": 128,
    "threads": [
      {
        "id": "thr_9921",
        "title": "Preservation of Ancient Chola Period Inscriptions regarding Mudaliyar Lineages",
        "category": "heritage",
        "authorName": "Prof. K. Sundaram Mudaliyar",
        "isPinned": true,
        "isLocked": false,
        "viewsCount": 1420,
        "repliesCount": 38,
        "createdAt": "2026-08-20T11:00:00Z"
      }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Threads returned' }
    ]
  },
  {
    id: 'api-forum-threads-create',
    method: 'POST',
    path: '/api/v1/forum/threads',
    module: 'Community Feed & Forum',
    summary: 'Create Moderated Discussion Thread in Community Forum',
    summaryTa: 'விவாதக் களத்தில் புதிய தலைப்பு தொடங்குதல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "categoryId": "career",
  "title": "Mentorship Network for Civil Services (UPSC / TNPSC) Aspirants",
  "content": "Initiating a mentorship circle connecting senior Mudaliyar IAS/IPS officers with aspiring civil service candidates..."
}`,
    responseSample: `{
  "success": true,
  "message": "Discussion thread created",
  "data": {
    "threadId": "thr_9934",
    "status": "published"
  }
}`,
    statusCodes: [
      { code: 201, description: 'Thread created' },
      { code: 400, description: 'Content fails automated profanity filter' }
    ]
  },
  {
    id: 'api-forum-replies-create',
    method: 'POST',
    path: '/api/v1/forum/threads/:id/replies',
    module: 'Community Feed & Forum',
    summary: 'Post Reply or Nested Comment in Forum Discussion Thread',
    summaryTa: 'விவாதக் களத்தில் பதில் அல்லது கருத்து பதிவிடுதல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "content": "I am serving as an IRS officer in Chennai and would be glad to volunteer 2 hours every weekend for interview prep.",
  "parentReplyId": null
}`,
    responseSample: `{
  "success": true,
  "message": "Reply posted successfully",
  "data": {
    "replyId": "rep_55102",
    "createdAt": "2026-09-07T14:40:00Z"
  }
}`,
    statusCodes: [
      { code: 201, description: 'Reply posted' },
      { code: 403, description: 'Thread is locked by moderator' }
    ]
  },

  // =========================================================================
  // 5. UNIVERSAL SEARCH
  // =========================================================================
  {
    id: 'api-search-universal',
    method: 'GET',
    path: '/api/v1/search/universal',
    module: 'Universal Search',
    summary: 'Comprehensive Multi-Domain Search Across Members, Matrimony, Events & Forum',
    summaryTa: 'உறுப்பினர்கள், வரன்கள், நிகழ்வுகள் மற்றும் விவாதங்களை ஒரே இடத்தில் தேடுதல்',
    accessRole: 'Verified Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Accept-Language': 'ta, en-US;q=0.9'
    },
    queryParams: [
      { name: 'q', type: 'string', required: true, description: 'Search keyword in Tamil or English' },
      { name: 'domain', type: 'string', required: false, description: 'all | members | matrimony | events | news | forum' },
      { name: 'limit', type: 'number', required: false, description: 'Results limit per category (default: 5)' }
    ],
    responseSample: `{
  "success": true,
  "data": {
    "query": "Kanchipuram",
    "membersCount": 14,
    "eventsCount": 2,
    "matrimonyCount": 8,
    "results": {
      "members": [
        { "id": "usr_101", "name": "R. Natarajan Mudaliyar", "nativePlace": "Kanchipuram", "subSect": "Thondaimandala Saiva" }
      ],
      "events": [
        { "id": "evt_2026_temple", "title": "Ekambareswarar Temple Annual Abhishekam Gathering", "date": "2026-11-10" }
      ],
      "matrimonialProfiles": [
        { "id": "mat_441", "age": 27, "profession": "Doctor", "nativePlace": "Kanchipuram" }
      ]
    }
  }
}`,
    statusCodes: [
      { code: 200, description: 'Unified search results returned' },
      { code: 400, description: 'Search query must be at least 2 characters' }
    ]
  },

  // =========================================================================
  // 6. ADMIN FUNCTIONS & CONTENT MODERATION
  // =========================================================================
  {
    id: 'api-admin-stats',
    method: 'GET',
    path: '/api/v1/admin/dashboard-metrics',
    module: 'Admin & Moderation',
    summary: 'Executive KPI Metrics, Pending Verifications & Regional Breakdown',
    summaryTa: 'நிர்வாக புள்ளிவிவரங்கள் மற்றும் நிலுவை சரிபார்ப்புகள்',
    accessRole: 'Admin / Super Admin',
    headers: {
      'Authorization': 'Bearer <ADMIN_JWT_TOKEN>'
    },
    responseSample: `{
  "success": true,
  "data": {
    "totalRegisteredUsers": 8450,
    "verifiedMembers": 6920,
    "pendingVerificationQueue": 142,
    "activeMatrimonialProfiles": 1890,
    "monthlyDonationsCollectedInr": 345000,
    "districtBreakdown": [
      { "district": "Chennai", "count": 2840 },
      { "district": "Kanchipuram", "count": 1950 },
      { "district": "Vellore", "count": 1420 },
      { "district": "Tiruvannamalai", "count": 980 }
    ]
  }
}`,
    statusCodes: [
      { code: 200, description: 'Metrics retrieved' },
      { code: 403, description: 'Forbidden: Admin privileges required' }
    ]
  },
  {
    id: 'api-admin-user-status',
    method: 'PATCH',
    path: '/api/v1/admin/users/:id/status',
    module: 'Admin & Moderation',
    summary: 'Manage Member Verification Status (Approve / Reject / Suspend)',
    summaryTa: 'உறுப்பினர் கணக்கு சரிபார்ப்பை ஒப்புதல் அளி அல்லது இடைநீக்கம் செய்',
    accessRole: 'District Coordinator / Admin',
    headers: {
      'Authorization': 'Bearer <ADMIN_JWT_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "status": "verified",
  "assignedMembershipCode": "MUD-KCH-2026-0891",
  "notes": "Verified against physical community certificate presented to Kanchipuram district secretary.",
  "notifyUser": true
}`,
    responseSample: `{
  "success": true,
  "message": "User verified and digital membership card generated",
  "data": {
    "userId": "usr_99120",
    "verificationStatus": "verified",
    "membershipCode": "MUD-KCH-2026-0891"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Status updated' },
      { code: 403, description: 'Coordinator not authorized for this member district' }
    ]
  },
  {
    id: 'api-admin-content-moderation',
    method: 'PATCH',
    path: '/api/v1/admin/moderation/content',
    module: 'Admin & Moderation',
    summary: 'Moderate Reported Content (Lock Forum Thread / Remove Profile)',
    summaryTa: 'புகார் அளிக்கப்பட்ட உள்ளடக்கத்தை நீக்குதல் அல்லது முடக்குதல்',
    accessRole: 'Moderator / Admin',
    headers: {
      'Authorization': 'Bearer <ADMIN_JWT_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "reportId": "rep_9912",
  "action": "lock_thread",
  "moderationReason": "Thread deviated into unverified political arguments contrary to Sangam by-laws.",
  "targetType": "forum_thread",
  "targetId": "thr_9921"
}`,
    responseSample: `{
  "success": true,
  "message": "Moderation action executed and logged into audit trail",
  "data": {
    "reportStatus": "resolved",
    "actionTaken": "thread_locked"
  }
}`,
    statusCodes: [
      { code: 200, description: 'Moderation action applied' },
      { code: 404, description: 'Report or target content not found' }
    ]
  },
  {
    id: 'api-admin-broadcast',
    method: 'POST',
    path: '/api/v1/admin/broadcast-alert',
    module: 'Admin & Moderation',
    summary: 'Dispatch Push Notification & SMS Broadcast to Community Members',
    summaryTa: 'சமூக உறுப்பினர்களுக்கு புஷ் மற்றும் SMS அறிவிப்பு அனுப்புதல்',
    accessRole: 'Admin / Super Admin',
    headers: {
      'Authorization': 'Bearer <ADMIN_JWT_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "targetAudience": {
    "district": "All",
    "role": "verified_members",
    "subSect": "All"
  },
  "title": "Emergency AGM Notice: Sunday 10 AM",
  "titleTa": "அவசர பொதுக்குழு கூட்டம்: ஞாயிறு காலை 10 மணி",
  "message": "All registered members are requested to attend the state general council meeting...",
  "channels": ["push_notification", "sms_dlt"],
  "priority": "urgent"
}`,
    responseSample: `{
  "success": true,
  "message": "Broadcast enqueued to dispatch pipeline",
  "data": {
    "broadcastJobId": "job_991823",
    "estimatedRecipients": 6920
  }
}`,
    statusCodes: [
      { code: 202, description: 'Broadcast queued for dispatch' },
      { code: 403, description: 'Forbidden: Requires Executive Admin authorization' }
    ]
  },

  // =========================================================================
  // 7. PAYMENTS & SUBSCRIPTIONS
  // =========================================================================
  {
    id: 'api-payments-create-order',
    method: 'POST',
    path: '/api/v1/payments/create-order',
    module: 'Payments & Subscriptions',
    summary: 'Initialize Payment Gateway Order (Membership, Matrimony, or 80G Donation)',
    summaryTa: 'சந்தா / நன்கொடைக்கான கட்டண ஆர்டர் உருவாக்குதல்',
    accessRole: 'Registered Member',
    headers: {
      'Authorization': 'Bearer <ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "planType": "matrimonial_premium_recurring",
  "amountInInr": 1500,
  "currency": "INR",
  "enableAutoRenew": true,
  "donorPanFor80G": "ABCDE1234F"
}`,
    responseSample: `{
  "success": true,
  "data": {
    "gatewayOrderId": "order_Rzp_99182312",
    "amount": 150000,
    "currency": "INR",
    "sangamMerchantKey": "rzp_live_MudaliyarSangamKey",
    "prefill": {
      "name": "M. Sivasankaran Mudaliyar",
      "contact": "+919876543210"
    }
  }
}`,
    statusCodes: [
      { code: 200, description: 'Gateway order initialized' },
      { code: 400, description: 'Invalid plan or amount parameter' }
    ]
  },
  {
    id: 'api-payments-webhook',
    method: 'POST',
    path: '/api/v1/payments/webhook',
    module: 'Payments & Subscriptions',
    summary: 'Payment Gateway Webhook Listener (HMAC-SHA256 Signature Verified)',
    summaryTa: 'கட்டண உறுதிப்படுத்தல் வெப்ஹூக்',
    accessRole: 'Payment Gateway Server (HMAC Signature)',
    headers: {
      'X-Razorpay-Signature': '4a8b7c3d2e1f99...',
      'Content-Type': 'application/json'
    },
    requestBody: `{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_9982173",
        "order_id": "order_Rzp_99182312",
        "amount": 150000,
        "status": "captured"
      }
    }
  }
}`,
    responseSample: `{
  "status": "acknowledged",
  "receiptGenerated": "80G-REC-2026-9921",
  "pdfReceiptUrl": "https://cdn.sangam.org/receipts/80G_REC_2026_9921.pdf"
}`,
    statusCodes: [
      { code: 200, description: 'Payment recorded and 80G receipt issued' },
      { code: 400, description: 'Invalid HMAC signature' }
    ]
  }
];
