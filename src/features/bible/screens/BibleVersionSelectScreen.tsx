import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/ui/SearchBar";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useBibleVersions } from "@/features/bible/hooks/useBible";
import { colors } from "@/theme/colors";
import type { BibleVersion } from "@/types/models";
import { ROUTES } from "@/navigation/routes";

export default function BibleVersionSelectScreen() {
  const navigation = useNavigation();
  const {
    data: versions,
    isLoading,
    error,
    refetch,
  } = useBibleVersions({ language: "" });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!versions) return [];
    if (!search.trim()) return versions as BibleVersion[];
    const q = search.toLowerCase();
    return (versions as BibleVersion[]).filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.nameLocal.toLowerCase().includes(q) ||
        v.language?.name?.toLowerCase().includes(q) ||
        v.abbreviation.toLowerCase().includes(q),
    );
  }, [versions, search]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  return (
    <View className="flex-1">
      <View className="px-4 pt-2 pb-1">
        <SearchBar
          onSearch={setSearch}
          placeholder="Search versions, languages..."
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8, flexGrow: 1 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.BibleBookList, { bibleId: item.id })
            }
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">
                {item.name}
              </Text>
              {item.nameLocal && item.nameLocal !== item.name ? (
                <Text className="text-sm text-textSecondary mt-0.5">
                  {item.nameLocal}
                </Text>
              ) : null}
              <Text className="text-xs text-textTertiary mt-0.5">
                {item.language?.name} — {item.abbreviationLocal}
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
          search.trim() ? (
            <EmptyState
              icon="search-outline"
              title="No versions match your search"
            />
          ) : (
            <EmptyState
              icon="book-outline"
              title="No Bible versions available"
            />
          )
        }
      />
    </View>
  );
}
