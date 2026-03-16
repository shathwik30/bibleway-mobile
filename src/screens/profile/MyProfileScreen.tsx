import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InfiniteList from '@/components/layout/InfiniteList';
import PostCard from '@/components/feed/PostCard';
import { useMyProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/useSocial';
import type { Post } from '@/types/models';

export default function MyProfileScreen() {
  const navigation = useNavigation<any>();
  const { data: profile, isLoading } = useMyProfile();
  const postsQuery = usePosts();

  if (isLoading || !profile) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="My Profile" />
        <ProfileSkeleton />
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title="My Profile"
        rightAction={
          <AnimatedPressable onPress={() => navigation.navigate('Settings')} accessibilityLabel="Settings">
            <Ionicons name="settings-outline" size={22} color="#4A6FA5" />
          </AnimatedPressable>
        }
      />
      <InfiniteList<Post>
        queryResult={postsQuery}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        headerComponent={
          <ProfileHeader
            user={profile}
            isOwnProfile
            onEditPress={() => navigation.navigate('EditProfile')}
          />
        }
        emptyTitle="No posts yet"
      />
    </SafeAreaScreen>
  );
}
