import React, { useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { format } from "date-fns";
import StickerMessage from "@/components/feed/StickerMessage";
import { isSticker } from "@/constants/stickers";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useTranslateMessage } from "@/hooks/useChat";
import { useAppStore } from "@/stores/appStore";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
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

  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const translateMutation = useTranslateMessage();
  const userLanguage = useAppStore((s) => s.language);

  const languageName =
    SUPPORTED_LANGUAGES.find((l) => l.code === userLanguage)?.nativeName ??
    userLanguage;

  const handleTranslate = useCallback(() => {
    if (translatedText) {
      setShowTranslation((prev) => !prev);
      return;
    }

    translateMutation.mutate(
      { messageId: message.id, targetLanguage: userLanguage },
      {
        onSuccess: (data) => {
          setTranslatedText(data.translated_text);
          setShowTranslation(true);
        },
      },
    );
  }, [translatedText, translateMutation, message.id, userLanguage]);

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

        {showTranslation && translatedText && (
          <View
            className={`mt-2 pt-2 ${isMine ? "border-t border-white/20" : "border-t border-border"}`}
          >
            <Text
              className={`text-xs mb-1 ${isMine ? "text-white/60" : "text-textTertiary"}`}
            >
              {languageName}
            </Text>
            <Text
              className={`text-base ${isMine ? "text-white" : "text-textPrimary"}`}
              selectable
            >
              {translatedText}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mt-0.5 gap-2">
        <Text className="text-xs text-textTertiary">{timestamp}</Text>
        {isMine && (
          <Ionicons
            name={message.is_read ? "checkmark-done" : "checkmark"}
            size={14}
            color={
              message.is_read ? colors.primary.DEFAULT : colors.textTertiary
            }
          />
        )}
        <Pressable
          onPress={handleTranslate}
          hitSlop={8}
          disabled={translateMutation.isPending}
          accessibilityLabel={
            showTranslation ? "Hide translation" : "Translate message"
          }
          accessibilityRole="button"
        >
          {translateMutation.isPending ? (
            <ActivityIndicator size={12} color={colors.primary.DEFAULT} />
          ) : (
            <Ionicons
              name={showTranslation ? "language" : "language-outline"}
              size={14}
              color={
                showTranslation
                  ? colors.primary.DEFAULT
                  : colors.textTertiary
              }
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(MessageBubble);
