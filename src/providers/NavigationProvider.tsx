import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { linking } from '@/navigation/linking';
import { useAppStore } from '@/stores/appStore';

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A6FA5',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1A2E',
    border: '#E5E7EB',
  },
};

const AppDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#7B9FD4',
    background: '#121220',
    card: '#1A1A2E',
    text: '#F3F4F6',
    border: '#2D2D3F',
  },
};

export default function NavigationProvider({ children }: { children: React.ReactNode }) {
  const isDark = useAppStore((s) => s.isDark);

  return (
    <NavigationContainer linking={linking} theme={isDark ? AppDarkTheme : LightTheme}>
      {children}
    </NavigationContainer>
  );
}
