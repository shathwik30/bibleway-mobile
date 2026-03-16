import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import TabBar from '@/components/ui/TabBar';
import InfiniteList from '@/components/layout/InfiniteList';
import PostCard from '@/components/feed/PostCard';
import PrayerCard from '@/components/feed/PrayerCard';
import VerseOfDayBanner from '@/components/bible/VerseOfDayBanner';
import Badge from '@/components/ui/Badge';
import { usePosts, usePrayers } from '@/hooks/useSocial';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/stores/notificationStore';
import { lightHaptic } from '@/lib/haptics';
import type { Post, Prayer } from '@/types/models';

export default function HomeFeedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('posts');
  const postsQuery = usePosts();
  const prayersQuery = usePrayers();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  useUnreadCount();

  const tabs = [
    { key: 'posts', label: t('feed.posts') },
    { key: 'prayers', label: t('feed.prayers') },
  ];

  return (
    <SafeAreaScreen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View>
          <Text className="text-2xl font-bold text-primary">BibleWay</Text>
        </View>
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.navigate('Notifications')} className="relative p-2" accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color="#1A1A2E" />
            {unreadCount > 0 && (
              <View className="absolute top-1 right-1">
                <Badge count={unreadCount} />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'posts' ? (
        <InfiniteList<Post>
          queryResult={postsQuery}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          headerComponent={<VerseOfDayBanner />}
          emptyTitle={t('feed.noPostsYet')}
        />
      ) : (
        <InfiniteList<Prayer>
          queryResult={prayersQuery}
          renderItem={({ item }) => <PrayerCard prayer={item} />}
          keyExtractor={(item) => item.id}
          emptyTitle={t('feed.noPrayersYet')}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => {
          lightHaptic();
          navigation.navigate(activeTab === 'posts' ? 'CreatePost' : 'CreatePrayer');
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        accessibilityLabel="Create new"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaScreen>
  );
}
