import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreateBoost } from '@/hooks/useAnalytics';
import { showToast } from '@/components/ui/Toast';
import { initIAP, purchaseBoost, teardownIAP, type BoostProductId } from '@/lib/iap';
import type { ProfileStackParamList } from '@/types/navigation';

const BOOST_TIERS: {
  productId: BoostProductId;
  name: string;
  duration: string;
  durationDays: number;
  reach: string;
}[] = [
  { productId: 'boost_basic', name: 'Basic Boost', duration: '24 hours', durationDays: 1, reach: '500+' },
  { productId: 'boost_standard', name: 'Standard Boost', duration: '3 days', durationDays: 3, reach: '2,000+' },
  { productId: 'boost_premium', name: 'Premium Boost', duration: '7 days', durationDays: 7, reach: '5,000+' },
];

export default function BoostPostScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ProfileStackParamList, 'BoostPost'>>();
  const { postId } = route.params;
  const [selectedTier, setSelectedTier] = useState<BoostProductId | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const boostMutation = useCreateBoost();

  useEffect(() => {
    initIAP().catch(() => {});
    return () => { teardownIAP().catch(() => {}); };
  }, []);

  const handleBoost = async () => {
    if (!selectedTier) return;
    const tier = BOOST_TIERS.find((t) => t.productId === selectedTier);
    if (!tier) return;

    setPurchasing(true);
    try {
      // Step 1: Complete the IAP purchase to get receipt data
      const { receiptData, transactionId } = await purchaseBoost(tier.productId);

      // Step 2: Send receipt to backend for validation + boost activation
      boostMutation.mutate(
        {
          post_id: postId,
          tier: tier.productId,
          platform: Platform.OS as 'ios' | 'android',
          receipt_data: receiptData,
          transaction_id: transactionId,
          duration_days: tier.durationDays,
        },
        {
          onSuccess: () => {
            showToast('success', 'Boosted', 'Your post is now being boosted!');
            navigation.goBack();
          },
          onError: (error: any) => {
            showToast('error', 'Error', error?.response?.data?.message || 'Failed to activate boost');
          },
          onSettled: () => setPurchasing(false),
        },
      );
    } catch (error: any) {
      setPurchasing(false);
      if (error?.message?.includes('cancelled')) {
        return; // User cancelled — don't show error
      }
      showToast('error', 'Purchase Failed', error?.message || 'Could not complete purchase');
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
            className={`p-4 rounded-xl mb-3 border-2 ${
              selectedTier === tier.productId ? 'border-primary bg-primary/5' : 'border-border bg-surface'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-textPrimary">{tier.name}</Text>
              {selectedTier === tier.productId && (
                <Ionicons name="checkmark-circle" size={24} color="#4A6FA5" />
              )}
            </View>
            <View className="flex-row mt-2 gap-4">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-textSecondary ml-1">{tier.duration}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-textSecondary ml-1">{tier.reach} reach</Text>
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
