import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Button from "@/components/ui/Button";
import { useCreateBoost } from "@/features/feed/hooks/useAnalytics";
import { showToast } from "@/components/ui/Toast";
import {
  initIAP,
  purchaseBoost,
  teardownIAP,
  type BoostProductId,
} from "@/features/shop/services/iap";
import { parseError } from "@/utils/parseError";
import { logger } from "@/utils/logger";
import type { ProfileStackParamList } from "@/types/navigation";
import { fonts } from "@/theme/fonts";

const BOOST_TIERS: {
  productId: BoostProductId;
  name: string;
  duration: string;
  durationDays: number;
  reach: string;
}[] = [
  {
    productId: "boost_basic",
    name: "Basic Boost",
    duration: "24 hours",
    durationDays: 1,
    reach: "500+",
  },
  {
    productId: "boost_standard",
    name: "Standard Boost",
    duration: "3 days",
    durationDays: 3,
    reach: "2,000+",
  },
  {
    productId: "boost_premium",
    name: "Premium Boost",
    duration: "7 days",
    durationDays: 7,
    reach: "5,000+",
  },
];

export default function BoostPostScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ProfileStackParamList, "BoostPost">>();
  const { postId } = route.params;
  const [selectedTier, setSelectedTier] = useState<BoostProductId | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [iapReady, setIapReady] = useState(false);
  const boostMutation = useCreateBoost();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initIAP();
        if (!cancelled) setIapReady(true);
      } catch (err) {
        logger.error("[BoostPost] initIAP failed", err);
        if (!cancelled) setIapReady(false);
      }
    })();
    return () => {
      cancelled = true;
      teardownIAP().catch((err) =>
        logger.error("[BoostPost] teardownIAP failed", err),
      );
    };
  }, []);

  const handleBoost = async () => {
    if (!selectedTier) return;
    const tier = BOOST_TIERS.find((t) => t.productId === selectedTier);
    if (!tier) return;
    if (!iapReady) {
      showToast(
        "error",
        "Store unavailable",
        "In-app purchases aren't available right now. Try again later.",
      );
      return;
    }

    setPurchasing(true);
    try {
      const { receiptData, transactionId } = await purchaseBoost(
        tier.productId,
      );

      boostMutation.mutate(
        {
          post_id: postId,
          tier: tier.productId,
          platform: Platform.OS as "ios" | "android",
          receipt_data: receiptData,
          transaction_id: transactionId,
          duration_days: tier.durationDays,
        },
        {
          onSuccess: () => {
            showToast("success", "Boosted", "Your post is now being boosted!");
            navigation.goBack();
          },
          onError: (err) => {
            logger.error("[BoostPost] activate failed", err);
            showToast("error", "Error", parseError(err, "Failed to activate boost"));
          },
          onSettled: () => setPurchasing(false),
        },
      );
    } catch (err) {
      setPurchasing(false);
      const message = parseError(err, "Purchase failed");
      if (message.toLowerCase().includes("cancel")) return;
      logger.error("[BoostPost] purchase failed", err);
      showToast("error", "Purchase Failed", message);
    }
  };

  const isLoading = purchasing || boostMutation.isPending;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Boost Post" />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-base text-textSecondary mb-6">
          Select a boost tier to increase your post's reach
        </Text>

        {BOOST_TIERS.map((tier) => (
          <Pressable
            key={tier.productId}
            onPress={() => setSelectedTier(tier.productId)}
            className={`p-4 rounded-xl mb-3 ${
              selectedTier === tier.productId
                ? "bg-primary/10"
                : "bg-surfaceContainerLowest"
            }`}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg text-textPrimary" style={fonts.bold}>
                {tier.name}
              </Text>
              {selectedTier === tier.productId && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary.DEFAULT}
                />
              )}
            </View>
            <View className="flex-row mt-2 gap-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text className="text-sm text-textSecondary ml-1">
                  {tier.duration}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text className="text-sm text-textSecondary ml-1">
                  {tier.reach} reach
                </Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View className="mt-4 mb-8">
          <Button
            title="Boost Now"
            onPress={handleBoost}
            loading={isLoading}
            disabled={!selectedTier || isLoading}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
