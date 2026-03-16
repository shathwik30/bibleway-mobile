import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import MyProfileScreen from '@/screens/profile/MyProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import LanguageSettingsScreen from '@/screens/profile/LanguageSettingsScreen';
import PrivacySettingsScreen from '@/screens/profile/PrivacySettingsScreen';
import BlockedUsersScreen from '@/screens/profile/BlockedUsersScreen';
import FollowRequestsScreen from '@/screens/profile/FollowRequestsScreen';
import PostAnalyticsScreen from '@/screens/profile/PostAnalyticsScreen';
import BoostPostScreen from '@/screens/profile/BoostPostScreen';
import BoostAnalyticsScreen from '@/screens/profile/BoostAnalyticsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <ErrorBoundary>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
      <Stack.Screen name="FollowRequests" component={FollowRequestsScreen} />
      <Stack.Screen name="PostAnalytics" component={PostAnalyticsScreen} />
      <Stack.Screen name="BoostPost" component={BoostPostScreen} />
      <Stack.Screen name="BoostAnalytics" component={BoostAnalyticsScreen} />
    </Stack.Navigator>
    </ErrorBoundary>
  );
}
