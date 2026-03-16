import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useFollowRequests, useRespondFollowRequest } from '@/hooks/useProfile';
import { showToast } from '@/components/ui/Toast';

export default function FollowRequestsScreen() {
  const { data, isLoading } = useFollowRequests();
  const requests = data?.pages?.flatMap((page: any) => page.results || []) ?? [];
  const respondMutation = useRespondFollowRequest();

  const handleAccept = (requestId: string) => {
    respondMutation.mutate({ userId: requestId, action: 'accept' }, {
      onSuccess: () => showToast('success', 'Accepted', 'Follow request accepted'),
    });
  };

  const handleReject = (requestId: string) => {
    respondMutation.mutate({ userId: requestId, action: 'reject' }, {
      onSuccess: () => showToast('success', 'Rejected', 'Follow request rejected'),
    });
  };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Follow Requests" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Follow Requests" />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 bg-surface rounded-xl mb-3">
            <Avatar source={item.requester?.profile_picture} name={item.requester?.full_name ?? ''} size={40} />
            <View className="flex-1 mx-3">
              <Text className="text-base font-semibold text-textPrimary">{item.requester?.full_name}</Text>
            </View>
            <View className="flex-row gap-2">
              <Button title="Accept" size="sm" onPress={() => handleAccept(item.id)} />
              <Button title="Reject" size="sm" variant="outline" onPress={() => handleReject(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No pending requests</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
