import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { useNotifications, useMarkRead } from '@/hooks/useNotifications';
import type { Notification } from '@/types/models';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const notificationsQuery = useNotifications();
  const markRead = useMarkRead();

  const allNotifications: Notification[] = notificationsQuery.data?.pages?.flatMap(
    (page: any) => page.results || []
  ) ?? [];

  const handlePress = (notification: Notification) => {
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }
    const data = notification.data || {};
    switch (notification.notification_type) {
      case 'follow':
        if (data.user_id) navigation.navigate('UserProfile', { userId: data.user_id });
        break;
      case 'reaction':
      case 'comment':
      case 'share':
        if (data.post_id) navigation.navigate('PostDetail', { postId: data.post_id });
        else if (data.prayer_id) navigation.navigate('PrayerDetail', { prayerId: data.prayer_id });
        break;
      case 'reply':
        if (data.post_id) navigation.navigate('Comments', { contentType: 'post', objectId: data.post_id });
        break;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable
      onPress={() => handlePress(item)}
      className={`flex-row items-center px-4 py-3 border-b border-border ${!item.is_read ? 'bg-primary/5' : ''}`}
    >
      <Avatar
        source={item.sender?.profile_photo ?? null}
        name={item.sender?.full_name ?? 'System'}
        size={40}
      />
      <View className="flex-1 ml-3">
        <Text className="text-sm text-textPrimary">
          <Text className="font-semibold">{item.sender?.full_name ?? 'System'}</Text>
          {' '}{item.title}
        </Text>
        <Text className="text-xs text-textSecondary mt-0.5">
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </Text>
      </View>
      {!item.is_read && <View className="w-2 h-2 rounded-full bg-primary" />}
    </Pressable>
  );

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={t('notifications.notifications')}
        rightAction={
          <Pressable onPress={() => markRead.mutate(undefined)}>
            <Text className="text-sm text-primary font-medium">{t('notifications.markAllRead')}</Text>
          </Pressable>
        }
      />
      <FlatList
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          notificationsQuery.isLoading ? (
            <View className="py-8"><ActivityIndicator color="#4A6FA5" /></View>
          ) : (
            <EmptyState icon="notifications-outline" title={t('notifications.noNotifications')} />
          )
        }
        onEndReached={() => {
          if (notificationsQuery.hasNextPage) notificationsQuery.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaScreen>
  );
}
