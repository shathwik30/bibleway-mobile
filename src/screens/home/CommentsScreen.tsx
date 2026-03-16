import React from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import InfiniteList from '@/components/layout/InfiniteList';
import KeyboardAvoidingWrapper from '@/components/layout/KeyboardAvoidingWrapper';
import CommentItem from '@/components/feed/CommentItem';
import CommentInput from '@/components/feed/CommentInput';
import { useComments, useCreateComment } from '@/hooks/useSocial';
import { showToast } from '@/components/ui/Toast';
import type { HomeStackParamList } from '@/types/navigation';
import type { Comment } from '@/types/models';

export default function CommentsScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'Comments'>>();
  const { contentType, objectId } = route.params;
  const commentsQuery = useComments(contentType, objectId);
  const createMutation = useCreateComment();

  const handleSubmit = (text: string) => {
    createMutation.mutate(
      { contentType, objectId, text },
      {
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to post comment');
        },
      },
    );
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Comments" />
      <KeyboardAvoidingWrapper>
        <View className="flex-1">
          <InfiniteList<Comment>
            queryResult={commentsQuery}
            renderItem={({ item }) => <CommentItem comment={item} />}
            keyExtractor={(item) => item.id}
            emptyTitle="No comments yet"
            emptyMessage="Be the first to comment"
          />
        </View>
        <CommentInput onSubmit={handleSubmit} loading={createMutation.isPending} />
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}
