import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import ReadAloudControls from '@/components/bible/ReadAloudControls';
import { useApiBible } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';

export default function BibleVerseScreen() {
  const route = useRoute<RouteProp<BibleStackParamList, 'BibleVerse'>>();
  const { bibleId, chapterId } = route.params;
  const { data: content, isLoading } = useApiBible(`bibles/${bibleId}/chapters/${chapterId}`) as { data: any; isLoading: boolean };

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={chapterId} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={chapterId} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-base text-textPrimary leading-7">
          {content?.content || 'No content available'}
        </Text>
        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <ReadAloudControls text={content?.content || ''} />
      </View>
    </SafeAreaScreen>
  );
}
