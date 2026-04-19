import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  showBack = true,
  rightAction,
}: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-surfaceContainerLowest">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="mr-3 p-1"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
        <Text
          className="text-xl text-textPrimary"
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: "Inter_700Bold" },
});
