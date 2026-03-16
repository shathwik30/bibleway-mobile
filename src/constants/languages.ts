export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00F1ol', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Fran\u00E7ais', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00EAs', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093F\u0928\u094D\u0926\u0940', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', rtl: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', rtl: false },
];

export const DEFAULT_LANGUAGE = 'en';
