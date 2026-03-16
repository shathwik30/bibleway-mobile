import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVerseOfDay } from '@/hooks/useVerseOfDay';

export default function VerseOfDayBanner() {
  const { data: verse, isLoading } = useVerseOfDay();

  if (isLoading || !verse) return null;

  return (
    <View className="mx-4 mt-3 mb-2 rounded-2xl overflow-hidden">
      {verse.background_image ? (
        <Image
          source={{ uri: verse.background_image }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : null}
      <LinearGradient
        colors={['rgba(45,74,122,0.85)', 'rgba(74,111,165,0.9)']}
        className="p-5"
      >
        <View className="flex-row items-center mb-2">
          <Ionicons name="sunny-outline" size={16} color="#D4A373" />
          <Text className="text-secondary text-xs font-semibold ml-1">VERSE OF THE DAY</Text>
        </View>
        <Text className="text-white text-base leading-6 mb-3" numberOfLines={4}>
          "{verse.verse_text}"
        </Text>
        <Text className="text-white/80 text-sm font-medium">— {verse.bible_reference}</Text>
      </LinearGradient>
    </View>
  );
}
