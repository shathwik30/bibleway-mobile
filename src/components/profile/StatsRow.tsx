import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "@/navigation/routes";

interface StatsRowProps {
  followers: number;
  following: number;
  posts: number;
  prayers: number;
  userId: string;
}

export default function StatsRow({
  followers,
  following,
  posts,
  prayers,
  userId,
}: StatsRowProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row mt-4 w-full justify-around">
      <View className="items-center">
        <Text className="text-lg text-textPrimary" style={styles.number}>
          {posts}
        </Text>
        <Text className="text-xs text-textSecondary">Posts</Text>
      </View>
      <View className="items-center">
        <Text className="text-lg text-textPrimary" style={styles.number}>
          {prayers}
        </Text>
        <Text className="text-xs text-textSecondary">Prayers</Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.Followers, { userId })}
        accessibilityLabel={`${followers} followers. Tap to view list.`}
        accessibilityRole="button"
        className="items-center"
      >
        <Text className="text-lg text-textPrimary" style={styles.number}>
          {followers}
        </Text>
        <Text className="text-xs text-textSecondary">Followers</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.Following, { userId })}
        accessibilityLabel={`Following ${following}. Tap to view list.`}
        accessibilityRole="button"
        className="items-center"
      >
        <Text className="text-lg text-textPrimary" style={styles.number}>
          {following}
        </Text>
        <Text className="text-xs text-textSecondary">Following</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  number: { fontFamily: "Inter_700Bold" },
});
