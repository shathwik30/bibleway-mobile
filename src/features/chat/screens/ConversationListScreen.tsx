import React, { useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ConversationItem from "@/features/chat/components/ConversationItem";
import { useConversations, useChatUnreadCount } from "@/features/chat/hooks/useChat";
import { flattenPages } from "@/lib/pages";
import type { ChatStackParamList } from "@/types/navigation";
import type { Conversation } from "@/types/models";
import { ROUTES } from "@/navigation/routes";

type Nav = NativeStackNavigationProp<ChatStackParamList>;

export default function ConversationListScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const conversationsQuery = useConversations();
  useChatUnreadCount();

  const allConversations: Conversation[] = flattenPages(
    conversationsQuery.data,
  );

  const handlePress = useCallback(
    (conversation: Conversation): void => {
      navigation.navigate(ROUTES.ChatRoom, {
        conversationId: conversation.id,
        otherUser: conversation.other_user,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Conversation }): React.JSX.Element => (
      <ConversationItem conversation={item} onPress={() => handlePress(item)} />
    ),
    [handlePress],
  );

  const handleEndReached = useCallback((): void => {
    if (
      conversationsQuery.hasNextPage &&
      !conversationsQuery.isFetchingNextPage
    ) {
      conversationsQuery.fetchNextPage();
    }
  }, [conversationsQuery]);

  if (conversationsQuery.isError) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Messages" showBack={false} />
        <ErrorState
          message="Failed to load conversations"
          onRetry={() => conversationsQuery.refetch()}
        />
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title="Messages"
        showBack={false}
        rightAction={
          <Pressable
            onPress={() => navigation.navigate(ROUTES.NewChat)}
            className="p-2"
            hitSlop={8}
            accessibilityLabel="New message"
            accessibilityRole="button"
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={colors.primary.DEFAULT}
            />
          </Pressable>
        }
      />
      <FlatList<Conversation>
        data={allConversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          conversationsQuery.isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
          ) : (
            <EmptyState
              title="No messages yet"
              message="Start a conversation with someone"
            />
          )
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={
              conversationsQuery.isRefetching &&
              !conversationsQuery.isFetchingNextPage
            }
            onRefresh={() => conversationsQuery.refetch()}
            tintColor={colors.primary.DEFAULT}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={
          conversationsQuery.isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : null
        }
      />
    </SafeAreaScreen>
  );
}

const keyExtractor = (item: Conversation): string => item.id;
