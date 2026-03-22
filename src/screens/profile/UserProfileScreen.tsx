import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import ProfileHeader from '@/components/profile/ProfileHeader';
import FollowButton from '@/components/profile/FollowButton';
import InfiniteList from '@/components/layout/InfiniteList';
import PostCard from '@/components/feed/PostCard';
import PrayerCard from '@/components/feed/PrayerCard';
import { useUserProfile, useFollowUser, useUnfollowUser } from '@/hooks/useProfile';
import { useUserPosts, useUserPrayers } from '@/hooks/useSocial';
import type { HomeStackParamList } from '@/types/navigation';
import type { Post, Prayer } from '@/types/models';

type Tab = 'posts' | 'prayers';

export default function UserProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, 'UserProfile'>>();
  const { userId } = route.params;
  const { data: profile, isLoading } = useUserProfile(userId);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const postsQuery = useUserPosts(userId);
  const prayersQuery = useUserPrayers(userId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

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

  const followStatus = profile.follow_status === 'self' ? undefined : profile.follow_status;
  const isFollowLoading = followMutation.isPending || unfollowMutation.isPending;

  const headerComponent = (
    <View>
      <ProfileHeader user={profile} />
      {followStatus !== undefined && (
        <View className="px-4 mb-4">
          <FollowButton
            status={followStatus}
            onFollow={() => followMutation.mutate(userId)}
            onUnfollow={() => unfollowMutation.mutate(userId)}
            loading={isFollowLoading}
          />
        </View>
      )}
      <View className="flex-row border-b border-border">
        <Pressable
          onPress={() => setActiveTab('posts')}
          className={`flex-1 items-center py-3 ${activeTab === 'posts' ? 'border-b-2 border-primary' : ''}`}
        >
          <Text className={`text-sm font-semibold ${activeTab === 'posts' ? 'text-primary' : 'text-textSecondary'}`}>
            Posts
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('prayers')}
          className={`flex-1 items-center py-3 ${activeTab === 'prayers' ? 'border-b-2 border-primary' : ''}`}
        >
          <Text className={`text-sm font-semibold ${activeTab === 'prayers' ? 'text-primary' : 'text-textSecondary'}`}>
            Prayers
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaScreen>
      <ScreenHeader title={profile.full_name || 'Profile'} />
      {activeTab === 'posts' ? (
        <InfiniteList<Post>
          queryResult={postsQuery}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          headerComponent={headerComponent}
          emptyTitle="No posts yet"
        />
      ) : (
        <InfiniteList<Prayer>
          queryResult={prayersQuery}
          renderItem={({ item }) => <PrayerCard prayer={item} />}
          keyExtractor={(item) => item.id}
          headerComponent={headerComponent}
          emptyTitle="No prayers yet"
        />
      )}
    </SafeAreaScreen>
  );
}
