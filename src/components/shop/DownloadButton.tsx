import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface DownloadButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export default function DownloadButton({
  onPress,
  loading = false,
}: DownloadButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityLabel="Download"
      accessibilityRole="button"
      accessibilityState={{ disabled: loading }}
      className="flex-row items-center bg-primary rounded-lg px-4 py-2"
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onPrimary} />
      ) : (
        <>
          <Ionicons name="download-outline" size={18} color={colors.onPrimary} />
          <Text className="text-white font-semibold ml-2">Download</Text>
        </>
      )}
    </Pressable>
  );
}
