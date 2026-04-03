import "./global.css";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import AppProviders from "@/providers/AppProviders";
import RootNavigator from "@/navigation/RootNavigator";
import { initStorage } from "@/lib/storage";

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

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

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initStorage().then(() => setStorageReady(true));
  }, []);

  if (!storageReady || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fcf9f8",
        }}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 220, height: 80 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <AppContent />;
}
