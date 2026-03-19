import './global.css';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppProviders from '@/providers/AppProviders';
import RootNavigator from '@/navigation/RootNavigator';
import { initSentry } from '@/lib/sentry';
import { initStorage } from '@/lib/storage';
// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Initialize Sentry
initSentry();

function AppContent() {
  return (
    <View className="flex-1">
      <AppProviders>
        <RootNavigator />
        <StatusBar style="dark" />
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
        <Image
          source={require('./assets/logo.png')}
          style={{ width: 220, height: 80 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <AppContent />;
}
