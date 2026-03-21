import * as Speech from 'expo-speech';

let currentSpeed = 1.0;
let onDoneCallback: (() => void) | null = null;

export function speak(
  text: string,
  language: string = 'en',
  onDone?: () => void,
): void {
  Speech.stop();
  onDoneCallback = onDone ?? null;

  // expo-speech uses BCP-47 language tags on Android.
  // Map our short codes to tags the TTS engine recognises.
  const langTag = mapLanguageTag(language);

  Speech.speak(text, {
    language: langTag,
    rate: currentSpeed,
    onDone: () => {
      onDoneCallback?.();
      onDoneCallback = null;
    },
    onError: () => {
      onDoneCallback?.();
      onDoneCallback = null;
    },
  });
}

export function stopSpeaking(): void {
  Speech.stop();
  onDoneCallback = null;
}

export function setSpeed(speed: number): void {
  currentSpeed = speed;
}

export function getSpeed(): number {
  return currentSpeed;
}

export async function isSpeaking(): Promise<boolean> {
  return await Speech.isSpeakingAsync();
}

/**
 * Map our language codes to BCP-47 tags that Android / iOS TTS engines
 * are most likely to have voices for.
 */
function mapLanguageTag(code: string): string {
  const map: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    pt: 'pt-BR',
    de: 'de-DE',
    it: 'it-IT',
    nl: 'nl-NL',
    ru: 'ru-RU',
    uk: 'uk-UA',
    pl: 'pl-PL',
    ro: 'ro-RO',
    el: 'el-GR',
    tr: 'tr-TR',
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    ur: 'ur-PK',
    ne: 'ne-NP',
    si: 'si-LK',
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    ja: 'ja-JP',
    ko: 'ko-KR',
    vi: 'vi-VN',
    th: 'th-TH',
    id: 'id-ID',
    ms: 'ms-MY',
    fil: 'fil-PH',
    my: 'my-MM',
    km: 'km-KH',
    ar: 'ar-SA',
    fa: 'fa-IR',
    he: 'he-IL',
    sw: 'sw-KE',
    am: 'am-ET',
    yo: 'yo-NG',
    ig: 'ig-NG',
    ha: 'ha-NG',
    zu: 'zu-ZA',
    af: 'af-ZA',
    sv: 'sv-SE',
    no: 'nb-NO',
    da: 'da-DK',
    fi: 'fi-FI',
    hu: 'hu-HU',
    cs: 'cs-CZ',
    bg: 'bg-BG',
    hr: 'hr-HR',
    sr: 'sr-RS',
    sk: 'sk-SK',
    ka: 'ka-GE',
    hy: 'hy-AM',
  };
  return map[code] || code;
}
