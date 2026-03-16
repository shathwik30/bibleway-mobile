import React, { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import { useAppStore } from '@/stores/appStore';

import en from '../../locales/en.json';
import es from '../../locales/es.json';
import fr from '../../locales/fr.json';
import pt from '../../locales/pt.json';
import hi from '../../locales/hi.json';
import ar from '../../locales/ar.json';
import sw from '../../locales/sw.json';

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
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export { i18n };

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [language]);

  return <>{children}</>;
}
