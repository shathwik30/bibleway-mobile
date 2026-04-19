import React, { useCallback, useEffect, useState } from "react";
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
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { parseError } from "@/utils/parseError";
import { logger } from "@/utils/logger";
import type { ShopStackParamList } from "@/types/navigation";

const PURCHASE_TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function isUserCancellation(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("cancel");
}

export default function ProductDetailScreen(): React.ReactElement {
  const route = useRoute<RouteProp<ShopStackParamList, "ProductDetail">>();
  const { productId } = route.params;
  const { data: product, isLoading } = useProductDetail(productId);
  const purchaseMutation = useCreatePurchase();
  const { refetch: fetchDownload } = useDownload(productId);
  const [purchasing, setPurchasing] = useState(false);
  const [iapReady, setIapReady] = useState(false);
  const signedCover = useSignedUrl(product?.cover_image);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initIAP();
        if (!cancelled) setIapReady(true);
      } catch (err) {
        logger.error("[ProductDetail] initIAP failed", err);
        if (!cancelled) setIapReady(false);
      }
    })();
    return () => {
      cancelled = true;
      teardownIAP().catch((err) =>
        logger.error("[ProductDetail] teardownIAP failed", err),
      );
    };
  }, []);

  const handlePurchase = useCallback(async (): Promise<void> => {
    if (!product || product.is_free) return;
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
      const { receiptData, transactionId } = await withTimeout(
        purchaseShopProduct(product.apple_product_id, product.google_product_id),
        PURCHASE_TIMEOUT_MS,
        "Purchase",
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
          onError: (err) => {
            logger.error("[ProductDetail] validate purchase failed", err);
            showToast("error", "Error", parseError(err, "Failed to validate purchase"));
          },
          onSettled: () => setPurchasing(false),
        },
      );
    } catch (err) {
      setPurchasing(false);
      const message = parseError(err, "Purchase failed");
      if (isUserCancellation(message)) return;
      logger.error("[ProductDetail] purchase failed", err);
      showToast("error", "Purchase Failed", message);
    }
  }, [product, iapReady, purchaseMutation]);

  const handleDownload = useCallback(async (): Promise<void> => {
    try {
      await fetchDownload();
      showToast("success", "Download Started", "Your download has started");
    } catch (err) {
      logger.error("[ProductDetail] download failed", err);
      showToast("error", "Download Failed", parseError(err, "Could not start download"));
    }
  }, [fetchDownload]);

  const isProcessing = purchasing || purchaseMutation.isPending;

  if (isLoading) return <LoadingScreen title="Product" />;

  if (!product) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Product" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Product not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={product.title} />
      <ScrollView className="flex-1">
        {signedCover && (
          <Image
            source={{ uri: signedCover }}
            placeholder={{ blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" }}
            className="w-full h-64"
            contentFit="cover"
            transition={300}
          />
        )}
        <View className="px-4 pt-4">
          <Text
            className="text-xl text-textPrimary"
            style={{ fontFamily: "PlayfairDisplay_700Bold" }}
          >
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

      <View className="absolute bottom-0 left-0 right-0 bg-surface px-4 py-4">
        <PurchaseButton
          isFree={product.is_free}
          isPurchased={!!product.download_url}
          onPurchase={handlePurchase}
          onDownload={handleDownload}
          loading={isProcessing}
          disabled={!product.is_free && !iapReady && !product.download_url}
        />
      </View>
    </SafeAreaScreen>
  );
}
