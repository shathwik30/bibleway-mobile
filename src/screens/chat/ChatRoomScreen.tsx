import React, { useEffect, useCallback, useRef, useState, useMemo } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import Avatar from "@/components/ui/Avatar";
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
import { useChatStore } from "@/stores/chatStore";
import { showToast } from "@/components/ui/Toast";
import { flattenPages } from "@/lib/pages";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import type { ChatStackParamList } from "@/types/navigation";
import type { ChatMessage } from "@/types/models";

export default function ChatRoomScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<ChatStackParamList, "ChatRoom">>();
  const { conversationId, otherUser } = route.params;
  const navigation = useNavigation();
  const currentUserId: string | undefined = useAuthStore((s) => s.user?.id);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const [translateLang, setTranslateLang] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const messagesQuery = useMessages(conversationId);
  const sendMessageMutation = useSendMessage(conversationId);
  const markReadMutation = useMarkMessagesRead(conversationId);

  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );

  useEffect(() => {
    setActiveConversationId(conversationId);
    markReadMutation.mutate();
    return () => setActiveConversationId(null);
  }, [conversationId]);

  const allMessages: ChatMessage[] = flattenPages(messagesQuery.data);

  const handleSend = useCallback(
    (text: string): void => {
      sendMessageMutation.mutate(text, {
        onError: (error: Error) => {
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
    ({ item }: { item: ChatMessage }): React.JSX.Element => (
      <MessageBubble
        message={item}
        isMine={item.sender.id === currentUserId}
        translateLang={translateLang}
      />
    ),
    [currentUserId, translateLang],
  );

  const navigateToProfile = useCallback(() => {
    navigation.navigate("HomeTab", {
      screen: "UserProfile",
      params: { userId: otherUser.id },
    } as never);
  }, [navigation, otherUser.id]);

  const handleTranslatePress = () => {
    if (translateLang) {
      setTranslateLang(null);
    } else {
      setLangSearch("");
      setShowLangPicker(true);
    }
  };

  const handleSelectLanguage = (code: string) => {
    setTranslateLang(code);
    setShowLangPicker(false);
  };

  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return SUPPORTED_LANGUAGES;
    const q = langSearch.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q),
    );
  }, [langSearch]);

  const selectedLangName = translateLang
    ? SUPPORTED_LANGUAGES.find((l) => l.code === translateLang)?.name
    : null;

  const chatHeader = (
    <View className="flex-row items-center px-4 py-3 bg-surfaceContainerLowest">
      <Pressable onPress={() => navigation.goBack()} className="mr-3 p-1">
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable
        onPress={navigateToProfile}
        className="flex-row items-center flex-1"
      >
        <Avatar
          source={otherUser.profile_photo}
          name={otherUser.full_name}
          size={36}
        />
        <Text
          className="text-lg text-textPrimary ml-3"
          numberOfLines={1}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {otherUser.full_name}
        </Text>
      </Pressable>
      <Pressable
        onPress={handleTranslatePress}
        className={`p-2 rounded-full ${translateLang ? "bg-primary/10" : ""}`}
        accessibilityLabel={
          translateLang ? "Stop translating" : "Translate messages"
        }
        accessibilityRole="button"
      >
        <Ionicons
          name={translateLang ? "language" : "language-outline"}
          size={22}
          color={translateLang ? colors.primary.DEFAULT : colors.textTertiary}
        />
      </Pressable>
    </View>
  );

  const handleEndReached = useCallback((): void => {
    if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      messagesQuery.fetchNextPage();
    }
  }, [messagesQuery]);

  if (messagesQuery.isLoading) {
    return (
      <SafeAreaScreen>
        {chatHeader}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaScreen>
    );
  }

  if (messagesQuery.isError) {
    return (
      <SafeAreaScreen>
        {chatHeader}
        <ErrorState
          message="Failed to load messages"
          onRetry={() => messagesQuery.refetch()}
        />
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      {chatHeader}
      {translateLang && selectedLangName && (
        <Pressable
          onPress={() => setTranslateLang(null)}
          className="flex-row items-center justify-center py-1.5 bg-primary/5"
        >
          <Ionicons name="language" size={14} color={colors.primary.DEFAULT} />
          <Text
            className="text-xs text-primary ml-1"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Translating to {selectedLangName}
          </Text>
          <Ionicons
            name="close-circle"
            size={14}
            color={colors.primary.DEFAULT}
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      )}
      <KeyboardAvoidingWrapper offset={Platform.OS === "android" ? 0 : undefined}>
        <View className="flex-1">
          {allMessages.length === 0 ? (
            <EmptyState
              title="No messages yet"
              message="Send the first message"
            />
          ) : (
            <FlatList<ChatMessage>
              ref={flatListRef}
              data={allMessages}
              renderItem={renderMessage}
              keyExtractor={keyExtractor}
              inverted
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
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
          )}
        </View>
        <ChatInput
          onSubmit={handleSend}
          loading={sendMessageMutation.isPending}
        />
      </KeyboardAvoidingWrapper>

      <Modal
        visible={showLangPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLangPicker(false)}
      >
        <Pressable
          onPress={() => setShowLangPicker(false)}
          className="flex-1 bg-black/40"
        />
        <View
          className="bg-surfaceContainerLowest rounded-t-2xl"
          style={{ maxHeight: "70%" }}
        >
          <View className="px-4 py-3 bg-surfaceContainerLow rounded-t-2xl">
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-lg text-textPrimary"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Translate to
              </Text>
              <Pressable onPress={() => setShowLangPicker(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-surfaceContainerHigh rounded-xl px-3 py-2">
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.textTertiary}
              />
              <TextInput
                value={langSearch}
                onChangeText={setLangSearch}
                placeholder="Search languages..."
                placeholderTextColor={colors.textTertiary}
                className="flex-1 ml-2 text-base text-textPrimary"
                style={{ fontFamily: "Inter_400Regular" }}
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={filteredLanguages}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectLanguage(item.code)}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  translateLang === item.code ? "bg-primary/5" : ""
                }`}
              >
                <View className="flex-1">
                  <Text
                    className="text-base text-textPrimary"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-textTertiary">
                    {item.nativeName}
                  </Text>
                </View>
                {translateLang === item.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary.DEFAULT}
                  />
                )}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </SafeAreaScreen>
  );
}

const keyExtractor = (item: ChatMessage): string => item.id;
