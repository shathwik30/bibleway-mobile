import React, { useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { RootStackParamList } from "@/types/navigation";
import { useAuthStore } from "@/stores/authStore";
import { registerForPushNotifications } from "@/lib/pushNotifications";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, bootstrap } = useAuthStore();
  const pushRegistered = useRef(false);

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAuthenticated && !pushRegistered.current) {
      pushRegistered.current = true;
      registerForPushNotifications();
    }
    if (!isAuthenticated) {
      pushRegistered.current = false;
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fcf9f8",
          paddingHorizontal: 40,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 220, height: 80, marginBottom: 32 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: "PlayfairDisplay_400Regular_Italic",
            fontSize: 18,
            fontStyle: "italic",
            color: "#1c1b1b",
            textAlign: "center",
            lineHeight: 28,
          }}
        >
          "As iron sharpens iron, so one person sharpens another."
        </Text>
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 14,
            color: "#564243",
            marginTop: 8,
          }}
        >
          — Proverbs 27:17
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
