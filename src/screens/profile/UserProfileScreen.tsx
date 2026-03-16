import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import ProfileHeader from '@/components/profile/ProfileHeader';
import FollowButton from '@/components/profile/FollowButton';
import InfiniteList from '@/components/layout/InfiniteList';
import PostCard from '@/components/feed/PostCard';
import { useUserProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/useSocial';
import type { HomeStackParamList } from '@/types/navigation';
import type { Post } from '@/types/models';

export default function UserProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, 'UserProfile'>>();
  const { userId } = route.params;
  const { data: profile, isLoading } = useUserProfile(userId);
  const postsQuery = usePosts();

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Profile" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (!profile) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Profile" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">User not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={profile.full_name || 'Profile'} />
      <InfiniteList<Post>
        queryResult={postsQuery}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        headerComponent={
          <View>
            <ProfileHeader
              user={profile}
            />
            <View className="px-4 mb-4">
              <FollowButton
                status="none"
                onFollow={() => {}}
                onUnfollow={() => {}}
              />
            </View>
          </View>
        }
        emptyTitle="No posts yet"
      />
    </SafeAreaScreen>
  );
}
