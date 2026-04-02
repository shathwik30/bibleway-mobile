import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { Image } from "expo-image";
import { useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import PurchaseButton from "@/components/shop/PurchaseButton";
import {
  useProductDetail,
  useCreatePurchase,
  useDownload,
} from "@/hooks/useShop";
import { initIAP, teardownIAP, purchaseShopProduct } from "@/lib/iap";
import { showToast } from "@/components/ui/Toast";
import type { ShopStackParamList } from "@/types/navigation";

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<ShopStackParamList, "ProductDetail">>();
  const { productId } = route.params;
  const { data: product, isLoading } = useProductDetail(productId);
  const purchaseMutation = useCreatePurchase();
  const { refetch: fetchDownload } = useDownload(productId);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    initIAP().catch(() => {});
    return () => {
      teardownIAP().catch(() => {});
    };
  }, []);

  const handlePurchase = async () => {
    if (!product || product.is_free) return;

    setPurchasing(true);
    try {
      const { receiptData, transactionId } = await purchaseShopProduct(
        product.apple_product_id,
        product.google_product_id,
      );

      purchaseMutation.mutate(
        {
          product_id: product.id,
          platform: Platform.OS as "ios" | "android",
          receipt_data: receiptData,
          transaction_id: transactionId,
        },
        {
          onSuccess: () => {
            showToast(
              "success",
              "Purchased",
              "You can now download this product",
            );
          },
          onError: (error) => {
            showToast(
              "error",
              "Error",
              error.message || "Failed to validate purchase",
            );
          },
          onSettled: () => setPurchasing(false),
        },
      );
    } catch (error) {
      setPurchasing(false);
      const message =
        error instanceof Error ? error.message : "An error occurred";
      if (message.includes("cancelled")) return;
      showToast("error", "Purchase Failed", message);
    }
  };

  const handleDownload = async () => {
    try {
      await fetchDownload();
      showToast("success", "Download Started", "Your download has started");
    } catch {
      showToast("error", "Download Failed", "Could not start download");
    }
  };

  const isProcessing = purchasing || purchaseMutation.isPending;

  if (isLoading) return <LoadingScreen title="Product" />;

  if (!product) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Product" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">
            Product not found
          </Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={product.title} />
      <ScrollView className="flex-1">
        {product.cover_image && (
          <Image
            source={{ uri: product.cover_image }}
            placeholder={{ blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" }}
            className="w-full h-64"
            contentFit="cover"
            transition={300}
          />
        )}
        <View className="px-4 pt-4">
          <Text className="text-xl font-bold text-textPrimary">
            {product.title}
          </Text>
          <Text className="text-lg font-semibold text-primary mt-2">
            {product.is_free ? "Free" : product.price_tier}
          </Text>
          <Text className="text-base text-textSecondary mt-4 leading-6">
            {product.description}
          </Text>
        </View>
        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-4">
        <PurchaseButton
          isFree={product.is_free}
          isPurchased={!!product.download_url}
          onPurchase={handlePurchase}
          onDownload={handleDownload}
          loading={isProcessing}
        />
      </View>
    </SafeAreaScreen>
  );
}
