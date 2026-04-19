import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/types/navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MyProfileScreen from "@/features/profile/screens/MyProfileScreen";
import EditProfileScreen from "@/features/profile/screens/EditProfileScreen";
import SettingsScreen from "@/features/profile/screens/SettingsScreen";
import LanguageSettingsScreen from "@/features/profile/screens/LanguageSettingsScreen";
import BlockedUsersScreen from "@/features/profile/screens/BlockedUsersScreen";
import FollowersScreen from "@/features/profile/screens/FollowersScreen";
import FollowingScreen from "@/features/profile/screens/FollowingScreen";
import PostAnalyticsScreen from "@/features/profile/screens/PostAnalyticsScreen";
import BoostPostScreen from "@/features/profile/screens/BoostPostScreen";
import BoostAnalyticsScreen from "@/features/profile/screens/BoostAnalyticsScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="LanguageSettings"
          component={LanguageSettingsScreen}
        />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
        <Stack.Screen name="Followers" component={FollowersScreen} />
        <Stack.Screen name="Following" component={FollowingScreen} />
        <Stack.Screen name="PostAnalytics" component={PostAnalyticsScreen} />
        <Stack.Screen name="BoostPost" component={BoostPostScreen} />
        <Stack.Screen name="BoostAnalytics" component={BoostAnalyticsScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
