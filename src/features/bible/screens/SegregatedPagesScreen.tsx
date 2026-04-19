import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { usePages } from "@/features/bible/hooks/useBible";
import { colors } from "@/theme/colors";
import type { BibleStackParamList } from "@/types/navigation";
import { ROUTES } from "@/navigation/routes";

export default function SegregatedPagesScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<BibleStackParamList, "SegregatedPages">>();
  const { chapterId, chapterTitle } = route.params;
  const { data: pages, isLoading } = usePages(chapterId);

  if (isLoading) return <LoadingScreen title={chapterTitle} />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title={chapterTitle} />
      <FlatList
        data={pages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.SegregatedPageDetail, { pageId: item.id })
            }
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">
                {item.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No pages available" />
        }
      />
    </SafeAreaScreen>
  );
}
