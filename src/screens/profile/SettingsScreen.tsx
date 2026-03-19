import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { useAuthStore } from '@/stores/authStore';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen?: string;
  onPress?: () => void;
  destructive?: boolean;
  rightLabel?: string;
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.logout'), style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('settings.deleteAccount'), t('settings.deleteAccountConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.deleteAccount'), style: 'destructive', onPress: () => {
        // TODO: call delete account API
      }},
    ]);
  };

  const menuItems: MenuItem[] = [
    { icon: 'person-outline', label: t('settings.editProfile'), screen: 'EditProfile' },
    { icon: 'language-outline', label: t('settings.language'), screen: 'LanguageSettings' },
    { icon: 'lock-closed-outline', label: t('settings.privacy'), screen: 'PrivacySettings' },
    { icon: 'ban-outline', label: t('settings.blockedUsers'), screen: 'BlockedUsers' },
    { icon: 'people-outline', label: t('settings.followRequests'), screen: 'FollowRequests' },
    { icon: 'bag-outline', label: t('settings.myPurchases'), screen: 'Purchases' },
    { icon: 'download-outline', label: t('settings.downloads'), screen: 'Downloads' },
    { icon: 'bookmark-outline', label: t('settings.bookmarks'), screen: 'Bookmarks' },
    { icon: 'document-text-outline', label: t('settings.notes'), screen: 'Notes' },
    { icon: 'log-out-outline', label: t('settings.logout'), onPress: handleLogout, destructive: true },
    { icon: 'trash-outline', label: t('settings.deleteAccount'), onPress: handleDeleteAccount, destructive: true },
  ];

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView className="flex-1 px-4 pt-2">
        {menuItems.map((item, index) => (
          <AnimatedPressable
            key={index}
            onPress={item.onPress || (() => item.screen && navigation.navigate(item.screen))}
            className="flex-row items-center p-4 bg-surface rounded-xl mb-2"
          >
            <Ionicons name={item.icon} size={22} color={item.destructive ? '#EF4444' : '#4A6FA5'} />
            <Text className={`flex-1 text-base ml-3 ${item.destructive ? 'text-red-500' : 'text-textPrimary'}`}>
              {item.label}
            </Text>
            {item.rightLabel && (
              <Text className="text-sm text-textSecondary mr-2">{item.rightLabel}</Text>
            )}
            {!item.destructive && <Ionicons name="chevron-forward" size={20} color="#6B7280" />}
          </AnimatedPressable>
        ))}

        <View className="items-center py-6">
          <Text className="text-xs text-textSecondary">{t('settings.version')} {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
