import { create } from 'zustand';
import { mmkvStorage } from '@/lib/storage';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

interface AppState {
  language: string;
  hasCompletedOnboarding: boolean;

  setLanguage: (lang: string) => void;
  setOnboarded: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: mmkvStorage.getString('language') ?? DEFAULT_LANGUAGE,
  hasCompletedOnboarding: mmkvStorage.getBoolean('onboarded') ?? false,

  setLanguage: (lang) => {
    mmkvStorage.setString('language', lang);
    set({ language: lang });
  },

  setOnboarded: () => {
    mmkvStorage.setBoolean('onboarded', true);
    set({ hasCompletedOnboarding: true });
  },
}));
