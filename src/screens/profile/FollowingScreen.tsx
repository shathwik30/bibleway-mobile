import React from "react";
import { FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import UserListItem from "@/components/feed/UserListItem";
import { useFollowing } from "@/hooks/useProfile";
import { flattenPages } from "@/lib/pages";
import type { HomeStackParamList } from "@/types/navigation";
import type { FollowRelationship } from "@/types/models";

export default function FollowingScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, "Following">>();
  const { userId } = route.params;
  const { data, isLoading } = useFollowing(userId);
  const following = flattenPages(data);

  if (isLoading) return <LoadingScreen title="Following" />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Following" />
      <FlatList
        data={following}
        keyExtractor={(item: FollowRelationship) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <UserListItem user={item.following} />}
        ListEmptyComponent={
          <EmptyState icon="people-outline" title="Not following anyone yet" />
        }
      />
    </SafeAreaScreen>
  );
}
