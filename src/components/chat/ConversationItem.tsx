import React from "react";
import { View, Text, Pressable } from "react-native";
import { formatDistanceToNowStrict } from "date-fns";
import Avatar from "@/components/ui/Avatar";
import { isSticker } from "@/constants/stickers";
import type { Conversation } from "@/types/models";

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export default React.memo(function ConversationItem({
  conversation,
  onPress,
}: ConversationItemProps): React.JSX.Element {
  const {
    other_user,
    last_message_text,
    last_message_at,
    last_message_is_mine,
    unread_count,
  } = conversation;

  const previewText = (): string => {
    if (!last_message_text) return "";
    if (isSticker(last_message_text)) {
      return last_message_is_mine ? "You sent a sticker" : "Sent a sticker";
    }
    const prefix: string = last_message_is_mine ? "You: " : "";
    return (
      prefix +
      (last_message_text.length > 50
        ? last_message_text.slice(0, 50) + "..."
        : last_message_text)
    );
  };

  const timeAgo: string = last_message_at
    ? formatDistanceToNowStrict(new Date(last_message_at), {
        addSuffix: false,
      })
    : "";

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white border-b border-border"
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${other_user.full_name}`}
    >
      <Avatar
        source={other_user.profile_photo}
        name={other_user.full_name}
        size={50}
      />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-base flex-1 mr-2 ${unread_count > 0 ? "font-bold text-textPrimary" : "font-semibold text-textPrimary"}`}
            numberOfLines={1}
          >
            {other_user.full_name}
          </Text>
          {timeAgo ? (
            <Text className="text-xs text-textTertiary">{timeAgo}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center justify-between mt-0.5">
          <Text
            className={`text-sm flex-1 mr-2 ${unread_count > 0 ? "font-semibold text-textPrimary" : "text-textSecondary"}`}
            numberOfLines={1}
          >
            {previewText()}
          </Text>
          {unread_count > 0 && (
            <View className="bg-primary rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
              <Text className="text-white text-xs font-bold">
                {unread_count > 99 ? "99+" : unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});
