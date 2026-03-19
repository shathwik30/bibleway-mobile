import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreateBoost } from '@/hooks/useAnalytics';
import { showToast } from '@/components/ui/Toast';
import type { ProfileStackParamList } from '@/types/navigation';

const BOOST_TIERS = [
  { id: 'basic', name: 'Basic Boost', duration: '24 hours', reach: '500+', productId: 'boost_basic' },
  { id: 'standard', name: 'Standard Boost', duration: '3 days', reach: '2,000+', productId: 'boost_standard' },
  { id: 'premium', name: 'Premium Boost', duration: '7 days', reach: '5,000+', productId: 'boost_premium' },
];

export default function BoostPostScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ProfileStackParamList, 'BoostPost'>>();
  const { postId } = route.params;
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const boostMutation = useCreateBoost();

  const handleBoost = () => {
    if (!selectedTier) return;
    const tier = BOOST_TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    // TODO: Integrate real IAP flow to obtain receipt_data and transaction_id
    boostMutation.mutate(
      { post_id: postId, tier: tier.id, platform: 'ios', receipt_data: '', transaction_id: '', duration_days: tier.id === 'basic' ? 1 : tier.id === 'standard' ? 3 : 7 },
      {
        onSuccess: () => {
          showToast('success', 'Boosted', 'Your post is now being boosted!');
          navigation.goBack();
        },
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to boost post');
        },
      },
    );
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Boost Post" />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-base text-textSecondary mb-6">
          Select a boost tier to increase your post's reach
        </Text>

        {BOOST_TIERS.map((tier) => (
          <Pressable
            key={tier.id}
            onPress={() => setSelectedTier(tier.id)}
            className={`p-4 rounded-xl mb-3 border-2 ${
              selectedTier === tier.id ? 'border-primary bg-primary/5' : 'border-border bg-surface'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-textPrimary">{tier.name}</Text>
              {selectedTier === tier.id && (
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
            loading={boostMutation.isPending}
            disabled={!selectedTier}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
