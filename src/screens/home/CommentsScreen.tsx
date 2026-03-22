import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import KeyboardAvoidingWrapper from '@/components/layout/KeyboardAvoidingWrapper';
import CommentItem from '@/components/feed/CommentItem';
import ReplyItem from '@/components/feed/ReplyItem';
import CommentInput from '@/components/feed/CommentInput';
import EmptyState from '@/components/ui/EmptyState';
import { useComments, useCreateComment, useReplies, useCreateReply } from '@/hooks/useSocial';
import { showToast } from '@/components/ui/Toast';
import type { HomeStackParamList } from '@/types/navigation';
import type { Comment, Reply } from '@/types/models';

export default function CommentsScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'Comments'>>();
  const { contentType, objectId } = route.params;
  const commentsQuery = useComments(contentType, objectId);
  const createCommentMutation = useCreateComment();
  const createReplyMutation = useCreateReply();

  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  const allComments: Comment[] = commentsQuery.data?.pages?.flatMap(
    (page: any) => page.results || []
  ) ?? [];

  const handleSubmitComment = (text: string) => {
    createCommentMutation.mutate(
      { contentType, objectId, text },
      {
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to post comment');
        },
      },
    );
  };

  const handleSubmitReply = (text: string) => {
    if (!replyingToCommentId) return;
    createReplyMutation.mutate(
      { commentId: replyingToCommentId, text },
      {
        onSuccess: () => {
          setExpandedCommentId(replyingToCommentId);
          setReplyingToCommentId(null);
        },
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to post reply');
        },
      },
    );
  };

  const isSubmitting = createCommentMutation.isPending || createReplyMutation.isPending;
  const inputPlaceholder = replyingToCommentId ? 'Write a reply...' : 'Write a comment...';

  const handleInputSubmit = (text: string) => {
    if (replyingToCommentId) {
      handleSubmitReply(text);
    } else {
      handleSubmitComment(text);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View>
      <CommentItem
        comment={item}
        onReply={() => setReplyingToCommentId(item.id)}
        onViewReplies={() =>
          setExpandedCommentId(expandedCommentId === item.id ? null : item.id)
        }
      />
      {expandedCommentId === item.id && (
        <RepliesSection commentId={item.id} />
      )}
    </View>
  );

  if (commentsQuery.isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Comments" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Comments" />
      <KeyboardAvoidingWrapper>
        <View className="flex-1">
          <FlatList
            data={allComments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<EmptyState title="No comments yet" message="Be the first to comment" />}
            onEndReached={() => {
              if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
                commentsQuery.fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={commentsQuery.isRefetching && !commentsQuery.isFetchingNextPage}
                onRefresh={() => commentsQuery.refetch()}
                tintColor="#4A6FA5"
              />
            }
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardDismissMode="on-drag"
          />
        </View>
        {replyingToCommentId && (
          <View className="flex-row items-center px-4 py-2 bg-surface border-t border-border">
            <Text className="flex-1 text-sm text-textSecondary">Replying to comment</Text>
            <Pressable onPress={() => setReplyingToCommentId(null)} className="p-1">
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </Pressable>
          </View>
        )}
        <CommentInput
          onSubmit={handleInputSubmit}
          placeholder={inputPlaceholder}
          loading={isSubmitting}
        />
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}

function RepliesSection({ commentId }: { commentId: string }) {
  const repliesQuery = useReplies(commentId);
  const allReplies: Reply[] = repliesQuery.data?.pages?.flatMap(
    (page: any) => page.results || []
  ) ?? [];

  if (repliesQuery.isLoading) {
    return (
      <View className="pl-12 py-2">
        <ActivityIndicator size="small" color="#4A6FA5" />
      </View>
    );
  }

  return (
    <View>
      {allReplies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </View>
  );
}
