import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import EmptyState from "@/components/ui/EmptyState";
import { usePurchases } from "@/hooks/useShop";
import { flattenPages } from "@/lib/pages";
import { colors } from "@/theme/colors";

export default function DownloadsScreen() {
  const { data } = usePurchases();
  const downloads = flattenPages(data);

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Downloads" />
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 bg-surface rounded-xl mb-3">
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
    </SafeAreaScreen>
  );
}
