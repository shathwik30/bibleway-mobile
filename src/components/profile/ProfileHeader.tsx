import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Avatar from '../ui/Avatar';
import StatsRow from './StatsRow';
import type { UserProfile, UserPublicProfile } from '@/types/models';

interface ProfileHeaderProps {
  user: UserProfile | UserPublicProfile;
  isOwnProfile?: boolean;
  onEditPress?: () => void;
  children?: React.ReactNode;
}

export default function ProfileHeader({ user, isOwnProfile = false, onEditPress, children }: ProfileHeaderProps) {
  return (
    <View className="items-center pt-6 pb-4 px-4">
      <Avatar source={user.profile_photo} name={user.full_name} size={80} />
      <Text className="text-xl font-bold text-textPrimary mt-3">{user.full_name}</Text>
      {user.bio ? (
        <Text className="text-sm text-textSecondary mt-1 text-center px-6">{user.bio}</Text>
      ) : null}
      <StatsRow
        followers={user.follower_count}
        following={user.following_count}
        posts={user.post_count}
        prayers={user.prayer_count}
        userId={(user as any).id}
        hideFollowers={user.hide_followers_list}
      />
      {children}
    </View>
  );
}
