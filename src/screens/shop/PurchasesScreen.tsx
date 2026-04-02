import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { usePurchases } from "@/hooks/useShop";
import { flattenPages } from "@/lib/pages";
import { colors } from "@/theme/colors";

export default function PurchasesScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = usePurchases();
  const purchases = flattenPages(data);

  if (isLoading) {
    return <LoadingScreen title="My Purchases" />;
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="My Purchases" />
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("ProductDetail", {
                productId: item.product.id,
              })
            }
            className="flex-row items-center p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1">
              <Text className="text-base font-semibold text-textPrimary">
                {item.product.title}
              </Text>
              <Text className="text-sm text-textSecondary mt-1">
                Purchased {new Date(item.created_at).toLocaleDateString()}
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
          <EmptyState icon="bag-outline" title="No purchases yet" />
        }
      />
    </SafeAreaScreen>
  );
}
