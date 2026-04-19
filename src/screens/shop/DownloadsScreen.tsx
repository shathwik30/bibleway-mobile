import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { usePurchases } from "@/hooks/useShop";
import { flattenPages } from "@/lib/pages";
import { parseError } from "@/utils/parseError";
import { colors } from "@/theme/colors";

export default function DownloadsScreen() {
  const { data, isLoading, isError, error, refetch } = usePurchases();
  const downloads = flattenPages(data);

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Downloads" />
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      ) : isError ? (
        <ErrorState message={parseError(error)} onRetry={refetch} />
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center p-4 bg-surfaceContainerLowest rounded-xl mb-3">
              <Ionicons
                name="document-outline"
                size={24}
                color={colors.primary.DEFAULT}
              />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-textPrimary">
                  {item.product.title}
                </Text>
                <Text className="text-sm text-textSecondary mt-1">
                  {item.product.category}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState icon="download-outline" title="No downloads yet" />
          }
        />
      )}
    </SafeAreaScreen>
  );
}
