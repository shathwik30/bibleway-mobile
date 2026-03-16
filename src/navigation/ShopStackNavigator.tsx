import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '@/types/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ShopScreen from '@/screens/shop/ShopScreen';
import ProductDetailScreen from '@/screens/shop/ProductDetailScreen';
import PurchasesScreen from '@/screens/shop/PurchasesScreen';
import DownloadsScreen from '@/screens/shop/DownloadsScreen';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopStackNavigator() {
  return (
    <ErrorBoundary>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Purchases" component={PurchasesScreen} />
      <Stack.Screen name="Downloads" component={DownloadsScreen} />
    </Stack.Navigator>
    </ErrorBoundary>
  );
}
