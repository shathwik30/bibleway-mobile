import React from "react";
import { Text, FlatList, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { useBibleChapters } from "@/hooks/useBible";
import type { BibleStackParamList } from "@/types/navigation";
import { ROUTES } from "@/navigation/routes";

export default function BibleChapterListScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<BibleStackParamList, "BibleChapterList">>();
  const { bibleId, bookId } = route.params;
  const { data: chapters, isLoading } = useBibleChapters(bibleId, bookId);

  if (isLoading) return <LoadingScreen title="Chapters" />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Chapters" />
      <FlatList
        data={chapters ?? []}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.BibleVerse, { bibleId, chapterId: item.id })
            }
            className="flex-1 items-center justify-center p-4 bg-surface rounded-xl mb-3"
          >
            <Text className="text-lg font-semibold text-textPrimary">
              {item.number}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="layers-outline" title="No chapters found" />
        }
      />
    </SafeAreaScreen>
  );
}
