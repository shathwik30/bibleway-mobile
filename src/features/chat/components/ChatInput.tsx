import React, { useState, useCallback } from "react";
import { View, TextInput, Pressable, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { lightHaptic } from "@/lib/haptics";
import StickerPicker from "@/features/feed/components/StickerPicker";

interface ChatInputProps {
  onSubmit: (text: string) => void;
  loading?: boolean;
}

export default React.memo(function ChatInput({
  onSubmit,
  loading = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [showStickers, setShowStickers] = useState(false);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    lightHaptic();
    onSubmit(trimmed);
    setText("");
    setShowStickers(false);
  }, [text, loading, onSubmit]);

  const handleStickerSelect = useCallback(
    (stickerId: number) => {
      if (loading) return;
      lightHaptic();
      onSubmit(`[sticker:${stickerId}]`);
      setText("");
      setShowStickers(false);
    },
    [loading, onSubmit],
  );

  const handleChangeText = useCallback((v: string) => {
    setText(v);
    setShowStickers(false);
  }, []);

  const toggleStickers = useCallback(() => {
    setShowStickers((prev) => {
      if (!prev) Keyboard.dismiss();
      return !prev;
    });
  }, []);

  const canSend = text.trim().length > 0;

  return (
    <View>
      <View className="flex-row items-end px-4 py-2 bg-surfaceContainerLowest">
        <Pressable
          onPress={toggleStickers}
          className="p-2 mr-1"
          hitSlop={8}
          accessibilityLabel="Toggle sticker picker"
          accessibilityRole="button"
        >
          <Ionicons
            name={showStickers ? "close-circle-outline" : "happy-outline"}
            size={24}
            color={showStickers ? colors.primary.DEFAULT : colors.textSecondary}
          />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={1000}
          className="flex-1 text-base text-textPrimary bg-surface rounded-2xl px-4 py-2 max-h-24"
          onFocus={() => setShowStickers(false)}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!canSend || loading}
          className={`ml-2 p-2 ${canSend ? "" : "opacity-40"}`}
          hitSlop={8}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          <Ionicons name="send" size={24} color={colors.primary.DEFAULT} />
        </Pressable>
      </View>
      {showStickers && <StickerPicker onSelect={handleStickerSelect} />}
    </View>
  );
});
