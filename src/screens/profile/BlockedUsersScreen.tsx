import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useBlockedUsers, useUnblockUser } from '@/hooks/useProfile';
import { showToast } from '@/components/ui/Toast';

export default function BlockedUsersScreen() {
  const { data, isLoading } = useBlockedUsers();
  const blockedUsers = data?.pages?.flatMap((page: any) => page.results || []) ?? [];
  const unblockMutation = useUnblockUser();

  const handleUnblock = (userId: string) => {
    Alert.alert(
      'Unblock User',
      'Are you sure you want to unblock this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => unblockMutation.mutate(userId, {
            onSuccess: () => showToast('success', 'Unblocked', 'User has been unblocked'),
          }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Blocked Users" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Blocked Users" />
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 bg-surface rounded-xl mb-3">
            <Avatar source={item.profile_picture} name={item.full_name} size={40} />
            <Text className="flex-1 text-base text-textPrimary ml-3">{item.full_name}</Text>
            <Button title="Unblock" variant="outline" size="sm" onPress={() => handleUnblock(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No blocked users</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
