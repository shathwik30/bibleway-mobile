import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { showToast } from '@/components/ui/Toast';

export default function LanguageSettingsScreen() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleSelectLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    showToast('success', 'Language Changed', `Language set to ${SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name || langCode}`);
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Language" />
      <FlatList
        data={SUPPORTED_LANGUAGES}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectLanguage(item.code)}
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-2"
          >
            <View className="flex-row items-center">
              <Text className="text-base text-textPrimary">{item.name}</Text>
              {item.nativeName && (
                <Text className="text-sm text-textSecondary ml-2">({item.nativeName})</Text>
              )}
            </View>
            {currentLanguage === item.code && (
              <Ionicons name="checkmark-circle" size={24} color="#4A6FA5" />
            )}
          </Pressable>
        )}
      />
    </SafeAreaScreen>
  );
}
