import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { QuizLevel } from "@/constants/quizLevels";

interface StoryViewProps {
  level: QuizLevel;
  onStart: () => void;
}

export default function StoryView({ level, onStart }: StoryViewProps) {
  return (
    <SafeAreaScreen>
      <ScreenHeader title={level.theme} />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary/5 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="book-outline" size={18} color={colors.primary.DEFAULT} />
            <Text className="text-sm font-bold text-primary ml-2">Story</Text>
          </View>
          <Text className="text-base text-textPrimary leading-7">
            {level.story}
          </Text>
        </View>

        <Pressable
          onPress={onStart}
          accessibilityLabel="Start quiz"
          accessibilityRole="button"
          className="bg-primary rounded-2xl py-4 items-center"
        >
          <Text className="text-white font-bold text-base">Start Quiz</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}
