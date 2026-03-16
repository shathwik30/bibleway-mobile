import React from 'react';
import { View, Text, Switch, ActivityIndicator } from 'react-native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { usePrivacySettings, useUpdatePrivacy } from '@/hooks/useProfile';
import { showToast } from '@/components/ui/Toast';

export default function PrivacySettingsScreen() {
  const { data: settings, isLoading } = usePrivacySettings();
  const updateMutation = useUpdatePrivacy();

  const handleToggle = (key: string, value: boolean) => {
    updateMutation.mutate(
      { [key]: value },
      {
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to update settings');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Privacy Settings" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  const toggleItems = [
    { key: 'is_private', label: 'Private Account', description: 'Only approved followers can see your posts' },
    { key: 'show_email', label: 'Show Email', description: 'Allow others to see your email address' },
    { key: 'show_phone', label: 'Show Phone', description: 'Allow others to see your phone number' },
    { key: 'allow_messages', label: 'Allow Messages', description: 'Allow non-followers to send you messages' },
  ];

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Privacy Settings" />
      <View className="flex-1 px-4 pt-4">
        {toggleItems.map((item) => (
          <View key={item.key} className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-textPrimary">{item.label}</Text>
              <Text className="text-sm text-textSecondary mt-1">{item.description}</Text>
            </View>
            <Switch
              value={(settings as Record<string, boolean>)?.[item.key] ?? false}
              onValueChange={(value) => handleToggle(item.key, value)}
              trackColor={{ false: '#D1D5DB', true: '#4A6FA5' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>
    </SafeAreaScreen>
  );
}
