import { useAppStore } from '@/stores/appStore';

export function useTheme() {
  const isDark = useAppStore((s) => s.isDark);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);

  return { isDark, themeMode, setThemeMode };
}
