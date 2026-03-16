import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../ui/Avatar';
import type { UserListItem } from '@/types/models';

interface UserCardProps {
  user: UserListItem;
}

export default function UserCard({ user }: UserCardProps) {
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
      className="items-center mr-4 w-20"
    >
      <Avatar source={user.profile_photo} name={user.full_name} size={56} />
      <Text className="text-xs font-medium text-textPrimary mt-1 text-center" numberOfLines={1}>
        {user.full_name}
      </Text>
    </Pressable>
  );
}
