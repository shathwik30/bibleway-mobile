import React, { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { translateLocale, getCachedLocale } from "@/lib/i18nTranslate";

import en from "../../locales/en.json";
import es from "../../locales/es.json";
import fr from "../../locales/fr.json";
import pt from "../../locales/pt.json";
import hi from "../../locales/hi.json";
import ar from "../../locales/ar.json";
import sw from "../../locales/sw.json";

const BUNDLED_LOCALES: Record<string, object> = { en, es, fr, pt, hi, ar, sw };

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    pt: { translation: pt },
    hi: { translation: hi },
    ar: { translation: ar },
    sw: { translation: sw },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export { i18n };

async function loadLanguage(langCode: string): Promise<void> {
  if (i18n.hasResourceBundle(langCode, "translation")) {
    i18n.changeLanguage(langCode);
    return;
  }

  const cached = await getCachedLocale(langCode);
  if (cached) {
    i18n.addResourceBundle(langCode, "translation", cached, true, true);
    i18n.changeLanguage(langCode);
    return;
  }

  i18n.changeLanguage("en");

  try {
    const translated = await translateLocale(en, langCode, "en");
    i18n.addResourceBundle(langCode, "translation", translated, true, true);
    i18n.changeLanguage(langCode);
  } catch {
    i18n.changeLanguage("en");
  }
}

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useAppStore((s) => s.language);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    loadLanguage(language).finally(() => setIsReady(true));

    const langDef = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    const isRTL = langDef?.rtl ?? false;
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [language]);

  if (!isReady) return null;

  return <>{children}</>;
}
