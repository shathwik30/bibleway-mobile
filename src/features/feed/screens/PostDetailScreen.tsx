import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import PostCard from "@/features/feed/components/PostCard";
import { usePostDetail } from "@/features/feed/hooks/useSocial";
import { useRecordView } from "@/features/feed/hooks/useAnalytics";
import type { HomeStackParamList } from "@/types/navigation";
import { ROUTES } from "@/navigation/routes";
import { fonts } from "@/theme/fonts";

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, "PostDetail">>();
  const { postId } = route.params;
  const { data: post, isLoading, isError } = usePostDetail(postId);
  useRecordView("post", postId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaScreen>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post" />
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-base text-textSecondary"
            style={fonts.regular}
          >
            Post not found
          </Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Post" />
      <ScrollView className="flex-1">
        <PostCard post={post} />

        <Pressable
          onPress={() =>
            navigation.navigate(ROUTES.Comments, {
              contentType: "post",
              objectId: post.id,
            })
          }
          className="flex-row items-center justify-between mx-4 mt-2 p-4 bg-surfaceContainerLow rounded-xl"
        >
          <View className="flex-row items-center">
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              className="text-base text-textSecondary ml-2"
              style={fonts.medium}
            >
              {post.comment_count ?? 0} Comments
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}
