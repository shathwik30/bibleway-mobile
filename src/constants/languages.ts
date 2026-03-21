export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // ── Global / Major ──
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', rtl: false },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },

  // ── Indian Languages ──
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', rtl: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', rtl: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', rtl: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', rtl: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', rtl: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', rtl: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', rtl: false },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', rtl: false },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', rtl: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', rtl: false },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', rtl: false },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', rtl: true },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', rtl: false },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', rtl: false },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', rtl: false },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', rtl: false },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei)', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ', rtl: false },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', rtl: false },

  // ── East & Southeast Asian ──
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', rtl: false },
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'ဗမာစာ', rtl: false },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', rtl: false },

  // ── Middle East & North Africa ──
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', rtl: false },

  // ── African ──
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', rtl: false },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', rtl: false },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', rtl: false },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', rtl: false },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', rtl: false },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', rtl: false },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', rtl: false },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', rtl: false },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', rtl: false },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', rtl: false },

  // ── Other ──
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', rtl: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', rtl: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', rtl: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', rtl: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', rtl: false },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', rtl: false },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', rtl: false },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', rtl: false },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', rtl: false },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', rtl: false },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', rtl: false },
  { code: 'la', name: 'Latin', nativeName: 'Latina', rtl: false },
];

export const DEFAULT_LANGUAGE = 'en';
