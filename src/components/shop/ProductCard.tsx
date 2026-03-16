import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import AnimatedPressable from '../ui/AnimatedPressable';
import type { ProductListItem } from '@/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface ProductCardProps {
  product: ProductListItem;
}

function ProductCard({ product }: ProductCardProps) {
  const navigation = useNavigation<any>();

  return (
    <AnimatedPressable
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
      style={{ width: CARD_WIDTH }}
      className="mb-4"
    >
      <Image
        source={{ uri: product.cover_image }}
        style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2, borderRadius: 12 }}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      <Text className="text-sm font-semibold text-textPrimary mt-2" numberOfLines={2}>
        {product.title}
      </Text>
      <Text className={`text-sm font-bold mt-0.5 ${product.is_free ? 'text-success' : 'text-primary'}`}>
        {product.is_free ? 'Free' : product.price_tier}
      </Text>
    </AnimatedPressable>
  );
}

export default React.memo(ProductCard);
