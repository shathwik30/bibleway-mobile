import React from 'react';
import { View, Text, FlatList } from 'react-native';
import UserCard from './UserCard';
import type { UserListItem } from '@/types/models';

interface RecommendedPeopleProps {
  users: UserListItem[];
}

export default function RecommendedPeople({ users }: RecommendedPeopleProps) {
  if (users.length === 0) return null;

  return (
    <View className="py-3 border-b border-border">
      <Text className="text-sm font-semibold text-textSecondary px-4 mb-2">People you may know</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserCard user={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}
