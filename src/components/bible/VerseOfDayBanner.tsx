import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useVerseOfDay } from "@/hooks/useVerseOfDay";
import { colors } from "@/theme/colors";

const GRADIENT_COLORS: readonly [string, string] = [
  "rgba(89,2,26,0.88)",
  "rgba(120,28,46,0.92)",
];

export default function VerseOfDayBanner() {
  const { data: verse, isLoading } = useVerseOfDay();

  if (isLoading || !verse) return null;

  return (
    <View className="mx-4 mt-3 mb-2 rounded-2xl overflow-hidden">
      {verse.background_image ? (
        <Image
          source={{ uri: verse.background_image }}
          style={styles.background}
          contentFit="cover"
        />
      ) : null}
      <LinearGradient colors={GRADIENT_COLORS} className="p-5">
        <View className="flex-row items-center mb-2">
          <Ionicons
            name="sunny-outline"
            size={16}
            color={colors.tertiary.fixed}
          />
          <Text className="text-tertiary-fixed text-xs font-semibold ml-1">
            VERSE OF THE DAY
          </Text>
        </View>
        <Text className="text-white text-base leading-6 mb-3" numberOfLines={4}>
          "{verse.verse_text}"
        </Text>
        <Text className="text-white/80 text-sm font-medium">
          — {verse.bible_reference}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { position: "absolute", width: "100%", height: "100%" },
});
