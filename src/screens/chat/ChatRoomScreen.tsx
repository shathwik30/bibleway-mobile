import React, { useEffect, useCallback, useRef } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import KeyboardAvoidingWrapper from "@/components/layout/KeyboardAvoidingWrapper";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import {
  useMessages,
  useSendMessage,
  useMarkMessagesRead,
} from "@/hooks/useChat";
import { useAuthStore } from "@/stores/authStore";
import { showToast } from "@/components/ui/Toast";
import { flattenPages } from "@/lib/pages";
import type { ChatStackParamList } from "@/types/navigation";
import type { ChatMessage } from "@/types/models";

export default function ChatRoomScreen() {
  const route = useRoute<RouteProp<ChatStackParamList, "ChatRoom">>();
  const { conversationId, otherUser } = route.params;
  const currentUserId = useAuthStore((s) => s.user?.id);
  const flatListRef = useRef<FlatList>(null);

  const messagesQuery = useMessages(conversationId);
  const sendMessageMutation = useSendMessage(conversationId);
  const markReadMutation = useMarkMessagesRead(conversationId);

  useEffect(() => {
    markReadMutation.mutate();
  }, [conversationId]);

  const allMessages = flattenPages(messagesQuery.data);

  const handleSend = useCallback(
    (text: string) => {
      sendMessageMutation.mutate(text, {
        onError: (error) => {
          showToast(
            "error",
            "Error",
            error.message || "Failed to send message",
          );
        },
      });
    },
    [sendMessageMutation],
  );

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        message={item}
        isMine={item.sender.id === currentUserId}
      />
    ),
    [currentUserId],
  );

  const handleEndReached = useCallback(() => {
    if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      messagesQuery.fetchNextPage();
    }
  }, [messagesQuery]);

  if (messagesQuery.isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={otherUser.full_name} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaScreen>
    );
  }

  if (messagesQuery.isError) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={otherUser.full_name} />
        <ErrorState
          message="Failed to load messages"
          onRetry={() => messagesQuery.refetch()}
        />
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={otherUser.full_name} />
      <KeyboardAvoidingWrapper>
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={allMessages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            inverted
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <EmptyState
                title="No messages yet"
                message="Send the first message"
              />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ flexGrow: 1 }}
            ListFooterComponent={
              messagesQuery.isFetchingNextPage ? (
                <View className="py-4">
                  <ActivityIndicator
                    size="small"
                    color={colors.primary.DEFAULT}
                  />
                </View>
              ) : null
            }
          />
        </View>
        <ChatInput
          onSubmit={handleSend}
          loading={sendMessageMutation.isPending}
        />
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}

const keyExtractor = (item: ChatMessage) => item.id;
