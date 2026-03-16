import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import HomeFeedScreen from '@/screens/home/HomeFeedScreen';
import CreatePostScreen from '@/screens/home/CreatePostScreen';
import CreatePrayerScreen from '@/screens/home/CreatePrayerScreen';
import PostDetailScreen from '@/screens/home/PostDetailScreen';
import PrayerDetailScreen from '@/screens/home/PrayerDetailScreen';
import CommentsScreen from '@/screens/home/CommentsScreen';
import NotificationsScreen from '@/screens/home/NotificationsScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import FollowersScreen from '@/screens/profile/FollowersScreen';
import FollowingScreen from '@/screens/profile/FollowingScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <ErrorBoundary>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeFeed" component={HomeFeedScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="CreatePrayer" component={CreatePrayerScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PrayerDetail" component={PrayerDetailScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="Following" component={FollowingScreen} />
    </Stack.Navigator>
    </ErrorBoundary>
  );
}
