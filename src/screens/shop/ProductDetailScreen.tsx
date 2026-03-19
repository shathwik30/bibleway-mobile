import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import PurchaseButton from '@/components/shop/PurchaseButton';
import { useProductDetail, useDownload } from '@/hooks/useShop';
import { showToast } from '@/components/ui/Toast';
import type { ShopStackParamList } from '@/types/navigation';

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<ShopStackParamList, 'ProductDetail'>>();
  const { productId } = route.params;
  const { data: product, isLoading } = useProductDetail(productId);
  const { refetch: fetchDownload } = useDownload(productId);

  const handlePurchase = () => {
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to purchase "${product?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            showToast('success', 'Coming Soon', 'In-app purchase will be configured shortly');
          },
        },
      ],
    );
  };

  const handleDownload = async () => {
    try {
      const { data } = await fetchDownload();
      showToast('success', 'Download Started', 'Your download has started');
    } catch {
      showToast('error', 'Download Failed', 'Could not start download');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Product" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

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
        {product.cover_image && (
          <Image
            source={{ uri: product.cover_image }}
            placeholder={{ blurhash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH' }}
            className="w-full h-64"
            contentFit="cover"
            transition={300}
          />
        )}
        <View className="px-4 pt-4">
          <Text className="text-xl font-bold text-textPrimary">{product.title}</Text>
          <Text className="text-lg font-semibold text-primary mt-2">{product.is_free ? 'Free' : product.price_tier}</Text>
          <Text className="text-base text-textSecondary mt-4 leading-6">{product.description}</Text>
        </View>
        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-4">
        <PurchaseButton
          isFree={product.is_free ?? false}
          isPurchased={!!product.download_url}
          onPurchase={handlePurchase}
          onDownload={handleDownload}
        />
      </View>
    </SafeAreaScreen>
  );
}
