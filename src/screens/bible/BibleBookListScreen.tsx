import React from "react";
import { Text, FlatList, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { useBibleBooks } from "@/hooks/useBible";
import { colors } from "@/theme/colors";
import type { BibleStackParamList } from "@/types/navigation";

export default function BibleBookListScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<BibleStackParamList, "BibleBookList">>();
  const { bibleId } = route.params;
  const { data: books, isLoading } = useBibleBooks(bibleId);

  if (isLoading) return <LoadingScreen title="Books" />;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Books" />
      <FlatList
        data={books ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("BibleChapterList", {
                bibleId,
                bookId: item.id,
              })
            }
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-2"
          >
            <Text className="text-base text-textPrimary">{item.name}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="book-outline" title="No books found" />
        }
      />
    </SafeAreaScreen>
  );
}
