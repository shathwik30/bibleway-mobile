import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import { useFollowers } from '@/hooks/useProfile';
import type { HomeStackParamList } from '@/types/navigation';
import type { FollowRelationship } from '@/types/models';

export default function FollowersScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, 'Followers'>>();
  const { userId } = route.params;
  const { data, isLoading } = useFollowers(userId);
  const followers = data?.pages?.flatMap((page: any) => page.results || []) ?? [];

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Followers" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Followers" />
      <FlatList
        data={followers}
        keyExtractor={(item: FollowRelationship) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }: { item: FollowRelationship }) => {
          const user = item.follower;
          return (
            <Pressable
              onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
              className="flex-row items-center p-4 bg-surface rounded-xl mb-2"
            >
              <Avatar source={user.profile_photo} name={user.full_name} size={40} />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-textPrimary">{user.full_name}</Text>
                {user.bio ? <Text className="text-sm text-textSecondary mt-0.5" numberOfLines={1}>{user.bio}</Text> : null}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No followers yet</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
