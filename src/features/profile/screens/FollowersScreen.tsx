import React from "react";
import { FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import UserListItem from "@/components/feed/UserListItem";
import { useFollowers } from "@/features/profile/hooks/useProfile";
import { flattenPages } from "@/lib/pages";
import type { HomeStackParamList } from "@/types/navigation";
import type { FollowRelationship } from "@/types/models";

export default function FollowersScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, "Followers">>();
  const { userId } = route.params;
  const { data, isLoading } = useFollowers(userId);
  const followers = flattenPages(data);

  if (isLoading) return <LoadingScreen title="Followers" />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Followers" />
      <FlatList
        data={followers}
        keyExtractor={(item: FollowRelationship) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <UserListItem user={item.follower} />}
        ListEmptyComponent={
          <EmptyState icon="people-outline" title="No followers yet" />
        }
      />
    </SafeAreaScreen>
  );
}
