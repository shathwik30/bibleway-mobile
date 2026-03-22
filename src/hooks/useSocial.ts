import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import { cursorNextPage, pageNumberNextPage } from '@/api/pagination';
import type { CursorPaginatedResponse, PaginatedResponse } from '@/types/api';
import type { Post, Prayer, Comment, Reply } from '@/types/models';

// ---------------------------------------------------------------------------
// Helpers for optimistic updates on infinite query data
// ---------------------------------------------------------------------------

function prependToFirstPage<T>(old: any, item: T): any {
  if (!old?.pages?.length) return old;
  const firstPage = { ...old.pages[0], results: [item, ...(old.pages[0].results || [])] };
  return { ...old, pages: [firstPage, ...old.pages.slice(1)] };
}

function removeFromPages<T extends { id: string }>(old: any, id: string): any {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      results: (page.results || []).filter((item: T) => item.id !== id),
    })),
  };
}

function updateInPages<T extends { id: string }>(old: any, id: string, updater: (item: T) => T): any {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      results: (page.results || []).map((item: T) => (item.id === id ? updater(item) : item)),
    })),
  };
}

// ---------------------------------------------------------------------------
// Feed queries
// ---------------------------------------------------------------------------

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Post>>(pageParam);
      return api.get<CursorPaginatedResponse<Post>>(ENDPOINTS.social.posts);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Post>>(pageParam);
      return api.get<CursorPaginatedResponse<Post>>(ENDPOINTS.social.posts, { author: userId });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

export function useUserPrayers(userId: string) {
  return useInfiniteQuery({
    queryKey: ['prayers', 'user', userId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Prayer>>(pageParam);
      return api.get<CursorPaginatedResponse<Prayer>>(ENDPOINTS.social.prayers, { author: userId });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

export function usePrayers() {
  return useInfiniteQuery({
    queryKey: ['prayers'],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Prayer>>(pageParam);
      return api.get<CursorPaginatedResponse<Prayer>>(ENDPOINTS.social.prayers);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

// ---------------------------------------------------------------------------
// Detail queries
// ---------------------------------------------------------------------------

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => api.get<Post>(ENDPOINTS.social.postDetail(postId)),
  });
}

export function usePrayerDetail(prayerId: string) {
  return useQuery({
    queryKey: ['prayer', prayerId],
    queryFn: () => api.get<Prayer>(ENDPOINTS.social.prayerDetail(prayerId)),
  });
}

// ---------------------------------------------------------------------------
// Create mutations (optimistic prepend to feed)
// ---------------------------------------------------------------------------

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      text_content: string;
      media_keys?: string[];
      media_types?: string[];
    }) => api.post<Post>(ENDPOINTS.social.posts, data),
    onSuccess: (newPost) => {
      // Optimistically prepend the new post to the feed
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) =>
        old ? prependToFirstPage(old, newPost) : old,
      );
    },
  });
}

export function useCreatePrayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      media_keys?: string[];
      media_types?: string[];
    }) => api.post<Prayer>(ENDPOINTS.social.prayers, data),
    onSuccess: (newPrayer) => {
      queryClient.setQueriesData({ queryKey: ['prayers'] }, (old: any) =>
        old ? prependToFirstPage(old, newPrayer) : old,
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Delete mutations (optimistic remove from feed)
// ---------------------------------------------------------------------------

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(ENDPOINTS.social.postDetail(postId)),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previous = queryClient.getQueriesData({ queryKey: ['posts'] });
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) =>
        old ? removeFromPages(old, postId) : old,
      );
      return { previous };
    },
    onError: (_err, _postId, context) => {
      // Rollback on error
      context?.previous?.forEach(([key, data]: any) => queryClient.setQueryData(key, data));
    },
  });
}

export function useDeletePrayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prayerId: string) => api.delete(ENDPOINTS.social.prayerDetail(prayerId)),
    onMutate: async (prayerId) => {
      await queryClient.cancelQueries({ queryKey: ['prayers'] });
      const previous = queryClient.getQueriesData({ queryKey: ['prayers'] });
      queryClient.setQueriesData({ queryKey: ['prayers'] }, (old: any) =>
        old ? removeFromPages(old, prayerId) : old,
      );
      return { previous };
    },
    onError: (_err, _prayerId, context) => {
      context?.previous?.forEach(([key, data]: any) => queryClient.setQueryData(key, data));
    },
  });
}

// ---------------------------------------------------------------------------
// Reactions (optimistic toggle)
// ---------------------------------------------------------------------------

export function useToggleReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentType, objectId, emojiType }: {
      contentType: 'post' | 'prayer';
      objectId: string;
      emojiType: string;
    }) => {
      const endpoint = contentType === 'post'
        ? ENDPOINTS.social.postReact(objectId)
        : ENDPOINTS.social.prayerReact(objectId);
      return api.post(endpoint, { emoji_type: emojiType });
    },
    onMutate: async ({ contentType, objectId, emojiType }) => {
      const queryKey = [contentType === 'post' ? 'posts' : 'prayers'];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData({ queryKey });

      queryClient.setQueriesData({ queryKey }, (old: any) =>
        old
          ? updateInPages(old, objectId, (item: any) => {
              const isRemoving = item.user_reaction === emojiType;
              return {
                ...item,
                user_reaction: isRemoving ? null : emojiType,
                reaction_count: item.reaction_count + (isRemoving ? -1 : item.user_reaction ? 0 : 1),
              };
            })
          : old,
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]: any) => queryClient.setQueryData(key, data));
    },
  });
}

// ---------------------------------------------------------------------------
// Comments (optimistic add)
// ---------------------------------------------------------------------------

export function useComments(contentType: 'post' | 'prayer', objectId: string) {
  const endpoint = contentType === 'post'
    ? ENDPOINTS.social.postComments(objectId)
    : ENDPOINTS.social.prayerComments(objectId);

  return useInfiniteQuery({
    queryKey: ['comments', contentType, objectId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Comment>>(endpoint, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentType, objectId, text }: { contentType: 'post' | 'prayer'; objectId: string; text: string }) => {
      const endpoint = contentType === 'post'
        ? ENDPOINTS.social.postComments(objectId)
        : ENDPOINTS.social.prayerComments(objectId);
      return api.post<Comment>(endpoint, { text, content_type_model: contentType, object_id: objectId });
    },
    onSuccess: (newComment, variables) => {
      // Prepend new comment optimistically
      queryClient.setQueriesData(
        { queryKey: ['comments', variables.contentType, variables.objectId] },
        (old: any) => (old ? prependToFirstPage(old, newComment) : old),
      );
      // Update comment count in the feed
      const feedKey = [variables.contentType === 'post' ? 'posts' : 'prayers'];
      queryClient.setQueriesData({ queryKey: feedKey }, (old: any) =>
        old
          ? updateInPages(old, variables.objectId, (item: any) => ({
              ...item,
              comment_count: (item.comment_count || 0) + 1,
            }))
          : old,
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Replies (optimistic add)
// ---------------------------------------------------------------------------

export function useReplies(commentId: string) {
  return useInfiniteQuery({
    queryKey: ['replies', commentId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Reply>>(ENDPOINTS.social.replies(commentId), { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      api.post<Reply>(ENDPOINTS.social.replies(commentId), { text }),
    onSuccess: (newReply, variables) => {
      // Prepend new reply
      queryClient.setQueriesData(
        { queryKey: ['replies', variables.commentId] },
        (old: any) => (old ? prependToFirstPage(old, newReply) : old),
      );
      // Update reply_count on the comment in all comment lists
      queryClient.setQueriesData({ queryKey: ['comments'] }, (old: any) =>
        old
          ? updateInPages(old, variables.commentId, (c: any) => ({
              ...c,
              reply_count: (c.reply_count || 0) + 1,
            }))
          : old,
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Share & Report
// ---------------------------------------------------------------------------

export function useShareContent() {
  return useMutation({
    mutationFn: ({ contentType, objectId }: { contentType: 'post' | 'prayer'; objectId: string }) => {
      const endpoint = contentType === 'post'
        ? ENDPOINTS.social.postShare(objectId)
        : ENDPOINTS.social.prayerShare(objectId);
      return api.get(endpoint);
    },
  });
}

export function useReport() {
  return useMutation({
    mutationFn: (input: {
      reason: string;
      description?: string;
      content_type_model: string;
      object_id: string;
    }) => api.post(ENDPOINTS.social.reportCreate, input),
  });
}
