import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { FEED_TEXT_TRUNCATE_LENGTH } from "@/constants/app";

interface TruncatedTextProps {
  /** The full text content to display. */
  text: string;
  /** Maximum character count before truncation. Defaults to FEED_TEXT_TRUNCATE_LENGTH. */
  maxLength?: number;
  /** Additional NativeWind classes for the text element. */
  textClassName?: string;
}

/**
 * Shared "Read more" text truncation component used in PostCard and PrayerCard.
 *
 * Truncates text beyond `maxLength` with an ellipsis and shows a "Read more"
 * pressable that expands to show the full content inline.
 */
function TruncatedText({
  text,
  maxLength = FEED_TEXT_TRUNCATE_LENGTH,
  textClassName = "text-base text-textPrimary leading-6",
}: TruncatedTextProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText =
    shouldTruncate && !expanded
      ? text.slice(0, maxLength) + "..."
      : text;

  return (
    <View className="mb-2">
      <Text className={textClassName}>{displayText}</Text>
      {shouldTruncate && !expanded && (
        <Pressable onPress={() => setExpanded(true)}>
          <Text className="text-primary text-sm font-medium mt-1">
            Read more
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default React.memo(TruncatedText);
