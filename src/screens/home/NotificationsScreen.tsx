import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { colors } from "@/theme/colors";
import { useTranslation } from "react-i18next";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useNotifications, useMarkRead } from "@/hooks/useNotifications";
import { flattenPages } from "@/lib/pages";
import type { Notification } from "@/types/models";
import { ROUTES } from "@/navigation/routes";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const notificationsQuery = useNotifications();
  const markRead = useMarkRead();

  const allNotifications = flattenPages(notificationsQuery.data);

  const handlePress = (notification: Notification) => {
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }
    const data = notification.data;
    switch (notification.notification_type) {
      case "follow":
        if (data.user_id)
          navigation.navigate(ROUTES.UserProfile, { userId: String(data.user_id) });
        break;
      case "reaction":
      case "comment":
      case "prayer_comment":
      case "share":
      case "boost_live":
      case "boost_digest":
        if (data.post_id)
          navigation.navigate(ROUTES.PostDetail, { postId: String(data.post_id) });
        else if (data.prayer_id)
          navigation.navigate(ROUTES.PrayerDetail, {
            prayerId: String(data.prayer_id),
          });
        break;
      case "reply":
        if (data.post_id)
          navigation.navigate(ROUTES.Comments, {
            contentType: "post",
            objectId: String(data.post_id),
          });
        else if (data.prayer_id)
          navigation.navigate(ROUTES.Comments, {
            contentType: "prayer",
            objectId: String(data.prayer_id),
          });
        break;
      case "new_message":
      case "missed_call":
        if (data.conversation_id && data.sender) {
          const sender = data.sender as {
            id: string;
            full_name: string;
            profile_photo?: string | null;
            age?: number;
          };
          navigation.navigate(ROUTES.ChatTab, {
            screen: "ChatRoom",
            params: {
              conversationId: String(data.conversation_id),
              otherUser: {
                id: sender.id,
                full_name: sender.full_name,
                profile_photo: sender.profile_photo ?? null,
                age: sender.age ?? 0,
              },
            },
          });
        }
        break;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable
      onPress={() => handlePress(item)}
      className={`flex-row items-center px-4 py-3 mb-px ${!item.is_read ? "bg-surfaceContainerLow" : "bg-surfaceContainerLowest"}`}
    >
      <Avatar
        source={item.sender?.profile_photo ?? null}
        name={item.sender?.full_name ?? "System"}
        size={40}
      />
      <View className="flex-1 ml-3">
        <Text
          className="text-sm text-textPrimary"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          <Text
            className="font-semibold"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {item.sender?.full_name ?? "System"}
          </Text>{" "}
          {item.title}
        </Text>
        <Text
          className="text-xs text-textSecondary mt-0.5"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </Text>
      </View>
      {!item.is_read && <View className="w-2 h-2 rounded-full bg-primary" />}
    </Pressable>
  );

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={t("notifications.notifications")}
        rightAction={
          <Pressable onPress={() => markRead.mutate(undefined)}>
            <Text
              className="text-sm text-primary font-medium"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {t("notifications.markAllRead")}
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          notificationsQuery.isLoading ? (
            <View className="py-8">
              <ActivityIndicator color={colors.primary.DEFAULT} />
            </View>
          ) : notificationsQuery.isError ? (
            <ErrorState
              message={notificationsQuery.error?.message}
              onRetry={() => notificationsQuery.refetch()}
            />
          ) : (
            <EmptyState
              icon="notifications-outline"
              title={t("notifications.noNotifications")}
            />
          )
        }
        onEndReached={() => {
          if (notificationsQuery.hasNextPage)
            notificationsQuery.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaScreen>
  );
}
