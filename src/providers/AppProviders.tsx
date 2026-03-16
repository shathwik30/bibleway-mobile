import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/Toast';
import QueryProvider from './QueryProvider';
import I18nProvider from './I18nProvider';
import NavigationProvider from './NavigationProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <I18nProvider>
          <SafeAreaProvider>
            <NavigationProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </NavigationProvider>
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </I18nProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
