import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Skeleton from '@/components/ui/Skeleton';
import MarkdownRenderer from '@/components/bible/MarkdownRenderer';
import YouTubeEmbed from '@/components/bible/YouTubeEmbed';
import ReadAloudControls from '@/components/bible/ReadAloudControls';
import { usePageDetail } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';

export default function SegregatedPageDetailScreen() {
  const route = useRoute<RouteProp<BibleStackParamList, 'SegregatedPageDetail'>>();
  const { pageId } = route.params;
  const { data, isLoading } = usePageDetail(pageId);
  const page = data as any;

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Page" />
        <View className="flex-1 px-4 pt-4">
          <Skeleton width="60%" height={22} borderRadius={4} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="95%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="80%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="90%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
        </View>
      </SafeAreaScreen>
    );
  }

  if (!page) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Page" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Page not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={page?.title || 'Page'} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text selectable={true} className="text-xl font-bold text-textPrimary mb-4">{page.title}</Text>

        {page.youtube_url && (
          <View className="mb-4">
            <YouTubeEmbed url={page.youtube_url} />
          </View>
        )}

        <MarkdownRenderer content={page.content || ''} />

        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <ReadAloudControls text={page.content || ''} />
      </View>
    </SafeAreaScreen>
  );
}
