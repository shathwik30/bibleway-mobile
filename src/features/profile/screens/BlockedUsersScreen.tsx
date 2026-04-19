import React from "react";
import { FlatList } from "react-native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import UserListItem from "@/components/feed/UserListItem";
import Button from "@/components/ui/Button";
import { useBlockedUsers, useUnblockUser } from "@/features/profile/hooks/useProfile";
import { showToast } from "@/components/ui/Toast";
import { confirmAction } from "@/lib/confirm";
import { flattenPages } from "@/lib/pages";

export default function BlockedUsersScreen() {
  const { data, isLoading } = useBlockedUsers();
  const blockedUsers = flattenPages(data);
  const unblockMutation = useUnblockUser();

  const handleUnblock = (userId: string) => {
    confirmAction(
      "Unblock User",
      "Are you sure you want to unblock this user?",
      () =>
        unblockMutation.mutate(userId, {
          onSuccess: () =>
            showToast("success", "Unblocked", "User has been unblocked"),
        }),
      "Unblock",
    );
  };

  if (isLoading) return <LoadingScreen title="Blocked Users" />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Blocked Users" />
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <UserListItem
            user={item.blocked}
            rightAction={
              <Button
                title="Unblock"
                variant="outline"
                size="sm"
                onPress={() => handleUnblock(item.blocked.id)}
              />
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState icon="ban-outline" title="No blocked users" />
        }
      />
    </SafeAreaScreen>
  );
}
