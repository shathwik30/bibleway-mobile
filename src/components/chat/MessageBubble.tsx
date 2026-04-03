import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import StickerMessage from "@/components/feed/StickerMessage";
import { isSticker } from "@/constants/stickers";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { ChatMessage } from "@/types/models";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

function MessageBubble({
  message,
  isMine,
}: MessageBubbleProps): React.JSX.Element {
  const timestamp: string = format(new Date(message.created_at), "h:mm a");
  const isStickerMsg: boolean = isSticker(message.text);

  if (isStickerMsg) {
    return (
      <View
        className={`my-1 px-4 ${isMine ? "items-end" : "items-start"}`}
        accessible
        accessibilityLabel={`Sticker, sent at ${timestamp}${isMine && message.is_read ? ", read" : ""}`}
      >
        <StickerMessage text={message.text} size={140} />
        <View className="flex-row items-center mt-0.5">
          <Text className="text-xs text-textTertiary">{timestamp}</Text>
          {isMine && (
            <Ionicons
              name={message.is_read ? "checkmark-done" : "checkmark"}
              size={14}
              color={
                message.is_read ? colors.primary.DEFAULT : colors.textTertiary
              }
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      className={`my-1 px-4 ${isMine ? "items-end" : "items-start"}`}
      accessible
      accessibilityLabel={`${message.text}, sent at ${timestamp}${isMine && message.is_read ? ", read" : ""}`}
    >
      <View
        className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
          isMine ? "bg-primary rounded-br-sm" : "bg-surface rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base ${isMine ? "text-white" : "text-textPrimary"}`}
          selectable
        >
          {message.text}
        </Text>
      </View>
      <View className="flex-row items-center mt-0.5">
        <Text className="text-xs text-textTertiary">{timestamp}</Text>
        {isMine && (
          <Ionicons
            name={message.is_read ? "checkmark-done" : "checkmark"}
            size={14}
            color={
              message.is_read ? colors.primary.DEFAULT : colors.textTertiary
            }
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </View>
  );
}

export default React.memo(MessageBubble);
