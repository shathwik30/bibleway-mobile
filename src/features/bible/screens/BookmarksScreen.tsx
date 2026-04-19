import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { useBookmarks, useDeleteBookmark } from "@/features/bible/hooks/useBible";
import { flattenPages } from "@/lib/pages";
import { confirmAction } from "@/lib/confirm";
import { colors } from "@/theme/colors";
import { ROUTES } from "@/navigation/routes";

export default function BookmarksScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useBookmarks();
  const bookmarks = flattenPages(data);
  const deleteMutation = useDeleteBookmark();

  if (isLoading) {
    return <LoadingScreen title="Bookmarks" />;
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bookmarks" />
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3">
            <Pressable
              onPress={() =>
                item.object_id
                  ? navigation.navigate(ROUTES.SegregatedPageDetail, {
                      pageId: item.object_id,
                    })
                  : undefined
              }
              className="flex-1 mr-3"
            >
              <Text className="text-base font-semibold text-textPrimary">
                {item.verse_reference}
              </Text>
              <Text className="text-sm text-textSecondary mt-1">
                {item.bookmark_type}
              </Text>
            </Pressable>
            <Pressable
              onPress={() =>
                confirmAction(
                  "Delete Bookmark",
                  "Are you sure?",
                  () => deleteMutation.mutate(item.id),
                  "Delete",
                )
              }
              className="p-2"
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="bookmark-outline" title="No bookmarks yet" />
        }
      />
    </SafeAreaScreen>
  );
}
