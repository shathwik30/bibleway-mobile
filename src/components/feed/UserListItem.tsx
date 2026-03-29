import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../ui/Avatar';
import type { UserListItem as UserListItemType } from '@/types/models';

interface UserListItemProps {
  user: UserListItemType;
  rightAction?: React.ReactNode;
}

function UserListItemComponent({ user, rightAction }: UserListItemProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
      className="flex-row items-center p-4 bg-surface rounded-xl mb-2"
    >
      <Avatar source={user.profile_photo} name={user.full_name} size={40} />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-base font-semibold text-textPrimary">{user.full_name}</Text>
          {user.age ? <Text className="text-sm text-textTertiary ml-1.5">· {user.age}y</Text> : null}
        </View>
        {user.bio ? <Text className="text-sm text-textSecondary mt-0.5" numberOfLines={1}>{user.bio}</Text> : null}
      </View>
      {rightAction}
    </Pressable>
  );
}

export default React.memo(UserListItemComponent);
