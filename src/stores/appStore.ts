import { create } from 'zustand';
import { Appearance } from 'react-native';
import { mmkvStorage } from '@/lib/storage';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  language: string;
  hasCompletedOnboarding: boolean;
  themeMode: ThemeMode;
  isDark: boolean;

  setLanguage: (lang: string) => void;
  setOnboarded: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
}

const savedTheme = (mmkvStorage.getString('theme_mode') as ThemeMode) ?? 'system';

export const useAppStore = create<AppState>((set) => ({
  language: mmkvStorage.getString('language') ?? DEFAULT_LANGUAGE,
  hasCompletedOnboarding: mmkvStorage.getBoolean('onboarded') ?? false,
  themeMode: savedTheme,
  isDark: resolveIsDark(savedTheme),

  setLanguage: (lang) => {
    mmkvStorage.setString('language', lang);
    set({ language: lang });
  },

  setOnboarded: () => {
    mmkvStorage.setBoolean('onboarded', true);
    set({ hasCompletedOnboarding: true });
  },

  setThemeMode: (mode) => {
    mmkvStorage.setString('theme_mode', mode);
    set({ themeMode: mode, isDark: resolveIsDark(mode) });
  },
}));

// Listen for system appearance changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { themeMode } = useAppStore.getState();
  if (themeMode === 'system') {
    useAppStore.setState({ isDark: colorScheme === 'dark' });
  }
});
