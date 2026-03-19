import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { linking } from '@/navigation/linking';

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

export default function NavigationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NavigationContainer linking={linking} theme={LightTheme}>
      {children}
    </NavigationContainer>
  );
}
