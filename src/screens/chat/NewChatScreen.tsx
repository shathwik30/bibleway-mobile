import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import SearchBar from "@/components/ui/SearchBar";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { useSearchUsers } from "@/hooks/useProfile";
import { useCreateConversation } from "@/hooks/useChat";
import { showToast } from "@/components/ui/Toast";
import type { ChatStackParamList } from "@/types/navigation";
import type { Author } from "@/types/models";

type Nav = NativeStackNavigationProp<ChatStackParamList>;

export default function NewChatScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const searchQuery = useSearchUsers(query);
  const createConversation = useCreateConversation();

  const handleSelect = useCallback(
    (user: Author) => {
      createConversation.mutate(user.id, {
        onSuccess: (conversation) => {
          navigation.replace("ChatRoom", {
            conversationId: conversation.id,
            otherUser: {
              id: user.id,
              full_name: user.full_name,
              profile_photo: user.profile_photo,
              age: user.age,
            },
          });
        },
        onError: (error) => {
          showToast(
            "error",
            "Error",
            error.message || "Could not start conversation",
          );
        },
      });
    },
    [navigation],
  );

  const renderUser = useCallback(
    ({ item }: { item: Author }) => (
      <Pressable
        onPress={() => handleSelect(item)}
        disabled={createConversation.isPending}
        className="flex-row items-center px-4 py-3 bg-white border-b border-border"
        accessibilityRole="button"
        accessibilityLabel={`Start conversation with ${item.full_name}`}
      >
        <Avatar source={item.profile_photo} name={item.full_name} size={44} />
        <Text className="flex-1 ml-3 text-base font-medium text-textPrimary">
          {item.full_name}
        </Text>
      </Pressable>
    ),
    [handleSelect, createConversation.isPending],
  );

  const results = (searchQuery.data as Author[]) ?? [];

  return (
    <SafeAreaScreen>
      <ScreenHeader title="New Message" />
      <View className="px-4 py-2">
        <SearchBar onSearch={setQuery} placeholder="Search users..." />
      </View>
      {createConversation.isPending && (
        <View className="items-center py-2">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      )}
      {searchQuery.isLoading && query.length >= 2 && (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      )}
      <FlatList
        data={results}
        renderItem={renderUser}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          query.length === 0 ? (
            <EmptyState
              title="Search for users"
              message="Type at least 2 characters to find people"
            />
          ) : query.length < 2 ? (
            <EmptyState title="Keep typing..." message="At least 2 characters needed" />
          ) : !searchQuery.isLoading ? (
            <EmptyState
              title="No users found"
              message="Try a different search"
            />
          ) : null
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaScreen>
  );
}

const keyExtractor = (item: Author) => item.id;
