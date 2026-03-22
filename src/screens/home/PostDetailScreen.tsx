import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import PostCard from '@/components/feed/PostCard';
import { usePostDetail } from '@/hooks/useSocial';
import { useRecordView } from '@/hooks/useAnalytics';
import type { HomeStackParamList } from '@/types/navigation';

export default function PostDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, 'PostDetail'>>();
  const { postId } = route.params;
  const { data: post, isLoading, isError } = usePostDetail(postId);
  useRecordView('post', postId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Post not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Post" />
      <ScrollView className="flex-1">
        <PostCard post={post} />

        <Pressable
          onPress={() => navigation.navigate('Comments', { contentType: 'post', objectId: post.id })}
          className="flex-row items-center justify-between mx-4 mt-2 p-4 bg-surface rounded-xl"
        >
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            <Text className="text-base text-textSecondary ml-2">
              {post.comment_count ?? 0} Comments
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}
