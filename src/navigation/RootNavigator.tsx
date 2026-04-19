import React, { useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { RootStackParamList } from "@/types/navigation";
import { useAuthStore } from "@/stores/authStore";
import { registerForPushNotifications } from "@/lib/pushNotifications";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, bootstrap } = useAuthStore();
  const pushRegistered = useRef(false);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View style={styles.splash}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[fonts.serifItalic, styles.verse]}>
          "As iron sharpens iron, so one person sharpens another."
        </Text>
        <Text style={[fonts.medium, styles.reference]}>— Proverbs 27:17</Text>
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

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 40,
  },
  logo: { width: 220, height: 80, marginBottom: 32 },
  verse: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
  reference: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
