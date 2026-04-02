import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Skeleton from "@/components/ui/Skeleton";
import MarkdownRenderer from "@/components/bible/MarkdownRenderer";
import YouTubeEmbed from "@/components/bible/YouTubeEmbed";
import ReadAloudControls from "@/components/bible/ReadAloudControls";
import KeyboardAvoidingWrapper from "@/components/layout/KeyboardAvoidingWrapper";
import { usePageDetail, useCreatePageComment } from "@/hooks/useBible";
import { showToast } from "@/components/ui/Toast";
import type { BibleStackParamList } from "@/types/navigation";

export default function SegregatedPageDetailScreen() {
  const route =
    useRoute<RouteProp<BibleStackParamList, "SegregatedPageDetail">>();
  const { pageId } = route.params;
  const { data: page, isLoading } = usePageDetail(pageId);
  const commentMutation = useCreatePageComment();
  const [comment, setComment] = useState("");

  const handleSubmitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed || commentMutation.isPending) return;
    commentMutation.mutate(
      { pageId, content: trimmed },
      {
        onSuccess: () => {
          setComment("");
          showToast("success", "Sent", "Your feedback has been submitted");
        },
        onError: (error) => {
          showToast(
            "error",
            "Error",
            error.message || "Failed to submit feedback",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Page" />
        <View className="flex-1 px-4 pt-4">
          <Skeleton
            width="60%"
            height={22}
            borderRadius={4}
            style={{ marginBottom: 16 }}
          />
          <Skeleton
            width="100%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: 10 }}
          />
          <Skeleton
            width="100%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: 10 }}
          />
          <Skeleton
            width="95%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: 10 }}
          />
          <Skeleton
            width="100%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: 10 }}
          />
          <Skeleton
            width="80%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: 10 }}
          />
        </View>
      </SafeAreaScreen>
    );
  }

  if (!page) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Page" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Page not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={page.title || "Page"} />
      <KeyboardAvoidingWrapper>
        <View className="flex-1">
          <ScrollView className="flex-1 px-4 pt-4">
            <Text
              selectable={true}
              className="text-xl font-bold text-textPrimary mb-4"
            >
              {page.title}
            </Text>

            {page.youtube_url && (
              <View className="mb-4">
                <YouTubeEmbed url={page.youtube_url} />
              </View>
            )}

            <MarkdownRenderer content={page.content || ""} />

            <View className="h-32" />
          </ScrollView>

          <View className="absolute bottom-14 left-0 right-0 bg-background border-t border-border px-4 py-2">
            <ReadAloudControls text={page.content || ""} />
          </View>

          <View className="flex-row items-end px-4 py-2 border-t border-border bg-white">
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Share your thoughts (visible to admin only)..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={1000}
              className="flex-1 text-base text-textPrimary bg-surface rounded-2xl px-4 py-2 max-h-20"
            />
            <Pressable
              onPress={handleSubmitComment}
              disabled={!comment.trim() || commentMutation.isPending}
              className={`ml-2 p-2 ${comment.trim() ? "" : "opacity-40"}`}
            >
              <Ionicons name="send" size={22} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}
