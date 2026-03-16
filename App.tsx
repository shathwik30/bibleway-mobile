import './global.css';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppProviders from '@/providers/AppProviders';
import RootNavigator from '@/navigation/RootNavigator';
import { initSentry } from '@/lib/sentry';
import { initStorage } from '@/lib/storage';
import { useAppStore } from '@/stores/appStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Initialize Sentry
initSentry();

function AppContent() {
  const isDark = useAppStore((s) => s.isDark);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <AppProviders>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </AppProviders>
    </View>
  );
}

export default function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    initStorage().then(() => setStorageReady(true));
  }, []);

  if (!storageReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: '#4A6FA5' }}>BibleWay</Text>
      </View>
    );
  }

  return <AppContent />;
}
