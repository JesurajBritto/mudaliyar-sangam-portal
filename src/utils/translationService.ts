// Translation utility for Sangam Portal CMS
// Provides instant bidirectional conversion between Tamil (ta) and English (en)

const translationCache = new Map<string, string>();

// Curated vocabulary dictionary for common Tamil/English phrases in community portals
const DICTIONARY_TA_TO_EN: Record<string, string> = {
  'சங்கம்': 'Association / Sangam',
  'தமிழ்நாடு முதலியார் சங்கம்': 'Tamil Nadu Mudaliyar Sangam',
  'பொதுக்குழு': 'General Council',
  'செயற்குழு': 'Executive Committee',
  'கூட்டம்': 'Meeting',
  'மாநாடு': 'Conference',
  'அறிவிப்பு': 'Announcement',
  'சுற்றறிக்கை': 'Circular',
  'முக்கிய அறிவிப்பு': 'Important Announcement',
  'திருமணம்': 'Matrimony',
  'கல்வி': 'Education',
  'உதவித்தொகை': 'Scholarship',
  'வேலைவாய்ப்பு': 'Employment & Career',
  'நலத்திட்டம்': 'Welfare Scheme',
  'நன்கொடை': 'Donation',
  'கணக்குகள்': 'Accounts',
  'உறுப்பினர்': 'Member',
  'குடும்பம்': 'Family',
  'தலைவர்': 'President',
  'பொதுச்செயலாளர்': 'General Secretary',
  'பொருளாளர்': 'Treasurer',
  'துணைத் தலைவர்': 'Vice President',
  'இணைச் செயலாளர்': 'Joint Secretary',
  'தலைமையகம்': 'Headquarters',
  'தொடர்பு': 'Contact',
  'சென்னை': 'Chennai',
  'காஞ்சிபுரம்': 'Kanchipuram',
  'மதுரை': 'Madurai',
  'கோயம்புத்தூர்': 'Coimbatore',
  'ஈரோடு': 'Erode',
  'சேலம்': 'Salem',
  'வேலூர்': 'Vellore',
  'திருச்சிராப்பள்ளி': 'Tiruchirappalli',
  'தஞ்சாவூர்': 'Thanjavur',
  'திண்டுக்கல்': 'Dindigul',
  'திருநெல்வேலி': 'Tirunelveli',
  'திருப்பூர்': 'Tiruppur',
  'நாகப்பட்டினம்': 'Nagapattinam',
  'புதுச்சேரி': 'Puducherry',
  'தூத்துக்குடி': 'Thoothukudi',
  'மாவட்டக் கிளை': 'District Branch',
  'அலுவலகம்': 'Office',
  'அரங்கம்': 'Hall / Auditorium',
  'திருமண மண்டபம்': 'Marriage Hall',
  'மழைக்கால நிவாரணம்': 'Monsoon Relief',
  'இளைஞர் மாநாடு': 'Youth Conference'
};

const DICTIONARY_EN_TO_TA: Record<string, string> = {
  'association': 'சங்கம்',
  'sangam': 'சங்கம்',
  'tamil nadu mudaliyar sangam': 'தமிழ்நாடு முதலியார் சங்கம்',
  'general council': 'பொதுக்குழு',
  'executive committee': 'செயற்குழு',
  'meeting': 'கூட்டம்',
  'conference': 'மாநாடு',
  'announcement': 'அறிவிப்பு',
  'circular': 'சுற்றறிக்கை',
  'important': 'முக்கியமானது',
  'matrimony': 'திருமணம்',
  'marriage': 'திருமணம்',
  'education': 'கல்வி',
  'scholarship': 'உதவித்தொகை',
  'employment': 'வேலைவாய்ப்பு',
  'career': 'தொழில் & வேலைவாய்ப்பு',
  'welfare': 'நலத்திட்டம்',
  'donation': 'நன்கொடை',
  'accounts': 'கணக்குகள்',
  'member': 'உறுப்பினர்',
  'family': 'குடும்பம்',
  'president': 'தலைவர்',
  'general secretary': 'பொதுச்செயலாளர்',
  'treasurer': 'பொருளாளர்',
  'vice president': 'துணைத் தலைவர்',
  'joint secretary': 'இணைச் செயலாளர்',
  'headquarters': 'தலைமையகம்',
  'contact': 'தொடர்பு',
  'chennai': 'சென்னை',
  'kanchipuram': 'காஞ்சிபுரம்',
  'madurai': 'மதுரை',
  'coimbatore': 'கோயம்புத்தூர்',
  'erode': 'ஈரோடு',
  'salem': 'சேலம்',
  'vellore': 'வேலூர்',
  'tiruchirappalli': 'திருச்சிராப்பள்ளி',
  'thanjavur': 'தஞ்சாவூர்',
  'dindigul': 'திண்டுக்கல்',
  'tirunelveli': 'திருநெல்வேலி',
  'tiruppur': 'திருப்பூர்',
  'district branch': 'மாவட்டக் கிளை',
  'office': 'அலுவலகம்',
  'marriage hall': 'திருமண மண்டபம்'
};

/**
 * Translates a given text between Tamil and English.
 * Uses local fast dictionary first, then MyMemory translation API with timeout.
 */
export async function translateText(
  text: string,
  from: 'ta' | 'en',
  to: 'ta' | 'en'
): Promise<string> {
  if (!text || !text.trim()) return '';
  const trimmed = text.trim();
  if (from === to) return trimmed;

  const cacheKey = `${from}_${to}_${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Check static dictionary for exact match
  const lower = trimmed.toLowerCase();
  if (from === 'ta' && DICTIONARY_TA_TO_EN[trimmed]) {
    const res = DICTIONARY_TA_TO_EN[trimmed];
    translationCache.set(cacheKey, res);
    return res;
  }
  if (from === 'en' && DICTIONARY_EN_TO_TA[lower]) {
    const res = DICTIONARY_EN_TO_TA[lower];
    translationCache.set(cacheKey, res);
    return res;
  }

  // Attempt API translation with 3.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const langPair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${encodeURIComponent(langPair)}`;

    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      if (data && data.responseData && data.responseData.translatedText) {
        let translated = String(data.responseData.translatedText).trim();
        // Discard failed response messages from MyMemory
        if (
          !translated.toUpperCase().includes('MYMEMORY WARNING') &&
          !translated.toUpperCase().includes('INVALID') &&
          translated.length > 0
        ) {
          // Decode any HTML entities
          translated = translated
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch {
    // Network/timeout error: proceed to fallback
  }

  // Fallback: word-by-word substitution if available
  if (from === 'ta') {
    let result = trimmed;
    for (const [taWord, enWord] of Object.entries(DICTIONARY_TA_TO_EN)) {
      if (result.includes(taWord)) {
        result = result.split(taWord).join(enWord);
      }
    }
    if (result !== trimmed) {
      translationCache.set(cacheKey, result);
      return result;
    }
  } else {
    let result = trimmed;
    for (const [enWord, taWord] of Object.entries(DICTIONARY_EN_TO_TA)) {
      const regex = new RegExp(`\\b${enWord}\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, taWord);
      }
    }
    if (result !== trimmed) {
      translationCache.set(cacheKey, result);
      return result;
    }
  }

  // If no translation found, return original text as safe fallback
  return trimmed;
}

/**
 * Checks if a string contains predominantly Tamil characters
 */
export function isTamilText(text: string): boolean {
  if (!text) return false;
  // Tamil Unicode block: \u0B80-\u0BFF
  const tamilRegex = /[\u0B80-\u0BFF]/;
  return tamilRegex.test(text);
}
