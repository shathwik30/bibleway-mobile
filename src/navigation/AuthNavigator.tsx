import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/types/navigation";
import LoginScreen from "@/features/auth/screens/LoginScreen";
import RegisterScreen from "@/features/auth/screens/RegisterScreen";
import OTPVerificationScreen from "@/features/auth/screens/OTPVerificationScreen";
import ForgotPasswordScreen from "@/features/auth/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "@/features/auth/screens/ResetPasswordScreen";
import GoogleCompleteProfileScreen from "@/features/auth/screens/GoogleCompleteProfileScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="GoogleCompleteProfile"
        component={GoogleCompleteProfileScreen}
      />
    </Stack.Navigator>
  );
}
