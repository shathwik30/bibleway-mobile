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
  StyleSheet,
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
import MessageBubble from "@/features/chat/components/MessageBubble";
import ChatInput from "@/features/chat/components/ChatInput";
import {
  useMessages,
  useSendMessage,
  useMarkMessagesRead,
} from "@/features/chat/hooks/useChat";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useChatStore } from "@/features/chat/store/chatStore";
import { showToast } from "@/components/ui/Toast";
import { flattenPages } from "@/lib/pages";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import type { ChatStackParamList } from "@/types/navigation";
import type { ChatMessage } from "@/types/models";
import { ROUTES } from "@/navigation/routes";
import { fonts } from "@/theme/fonts";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    navigation.navigate(ROUTES.HomeTab, {
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
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        className="mr-3 p-1"
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable
        onPress={navigateToProfile}
        accessibilityLabel={`View ${otherUser.full_name}'s profile`}
        accessibilityRole="button"
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
          style={fonts.semibold}
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
          accessibilityLabel={`Stop translating to ${selectedLangName}`}
          accessibilityRole="button"
          className="flex-row items-center justify-center py-1.5 bg-primary/5"
        >
          <Ionicons name="language" size={14} color={colors.primary.DEFAULT} />
          <Text
            className="text-xs text-primary ml-1"
            style={fonts.medium}
          >
            Translating to {selectedLangName}
          </Text>
          <Ionicons
            name="close-circle"
            size={14}
            color={colors.primary.DEFAULT}
            style={styles.closeIcon}
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
              contentContainerStyle={styles.listContent}
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
          style={styles.modalSheet}
        >
          <View className="px-4 py-3 bg-surfaceContainerLow rounded-t-2xl">
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-lg text-textPrimary"
                style={fonts.bold}
              >
                Translate to
              </Text>
              <Pressable
                onPress={() => setShowLangPicker(false)}
                accessibilityLabel="Close translation picker"
                accessibilityRole="button"
              >
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
                style={fonts.regular}
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
                accessibilityLabel={`Translate to ${item.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: translateLang === item.code }}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  translateLang === item.code ? "bg-primary/5" : ""
                }`}
              >
                <View className="flex-1">
                  <Text
                    className="text-base text-textPrimary"
                    style={fonts.regular}
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

const styles = StyleSheet.create({
  closeIcon: { marginLeft: 6 },
  listContent: { flexGrow: 1 },
  modalSheet: { maxHeight: "70%" },
});

const keyExtractor = (item: ChatMessage): string => item.id;
