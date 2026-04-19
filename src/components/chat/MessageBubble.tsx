import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import StickerMessage from "@/components/feed/StickerMessage";
import { isSticker } from "@/constants/stickers";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { translateText } from "@/lib/translate";
import type { ChatMessage } from "@/types/models";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  translateLang?: string | null;
}

function MessageBubble({
  message,
  isMine,
  translateLang = null,
}: MessageBubbleProps): React.JSX.Element {
  const timestamp: string = format(new Date(message.created_at), "h:mm a");
  const isStickerMsg: boolean = isSticker(message.text);

  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatingFor, setTranslatingFor] = useState<string | null>(null);

  useEffect(() => {
    if (!translateLang || isStickerMsg) {
      setTranslatedText(null);
      setTranslatingFor(null);
      return;
    }

    if (translatingFor === translateLang && translatedText) return;

    let cancelled = false;
    setTranslatingFor(translateLang);

    translateText(message.text, translateLang, "auto").then((result) => {
      if (!cancelled) setTranslatedText(result);
    }).catch(() => {
      if (!cancelled) setTranslatedText(null);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateLang, message.text]);

  const showTranslation = !!translateLang && !!translatedText;

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
          isMine ? "bg-primary rounded-br-sm" : "bg-surfaceContainerLow rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base ${isMine ? "text-white" : "text-textPrimary"}`}
          selectable
        >
          {message.text}
        </Text>

        {showTranslation && (
          <View
            className={`mt-2 pt-2 ${isMine ? "border-t border-white/20" : ""}`}
          >
            <Text
              className={`text-base ${isMine ? "text-white/90" : "text-textPrimary"}`}
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
      </View>
    </View>
  );
}

export default React.memo(MessageBubble);
