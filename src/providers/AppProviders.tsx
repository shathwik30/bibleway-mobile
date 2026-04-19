import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/Toast";
import QueryProvider from "./QueryProvider";
import I18nProvider from "./I18nProvider";
import NavigationProvider from "./NavigationProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ErrorBoundary>
        <QueryProvider>
          <I18nProvider>
            <SafeAreaProvider>
              <NavigationProvider>{children}</NavigationProvider>
              <Toast config={toastConfig} />
            </SafeAreaProvider>
          </I18nProvider>
        </QueryProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
