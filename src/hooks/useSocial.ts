import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import { cursorNextPage, pageNumberNextPage } from '@/api/pagination';
import type { CursorPaginatedResponse, PaginatedResponse } from '@/types/api';
import type { Post, Prayer, Comment, Reply } from '@/types/models';

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) {
        const res = await api.get<CursorPaginatedResponse<Post>>(pageParam);
        return res;
      }
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
      if (pageParam) {
        return api.get<CursorPaginatedResponse<Post>>(pageParam);
      }
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
      if (pageParam) {
        return api.get<CursorPaginatedResponse<Prayer>>(pageParam);
      }
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
      if (pageParam) {
        const res = await api.get<CursorPaginatedResponse<Prayer>>(pageParam);
        return res;
      }
      return api.get<CursorPaginatedResponse<Prayer>>(ENDPOINTS.social.prayers);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

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

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.post(ENDPOINTS.social.posts, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreatePrayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.post(ENDPOINTS.social.prayers, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(ENDPOINTS.social.postDetail(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePrayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prayerId: string) => api.delete(ENDPOINTS.social.prayerDetail(prayerId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
  });
}

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
      return api.post(endpoint, { text, content_type_model: contentType, object_id: objectId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.contentType, variables.objectId] });
    },
  });
}

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
      api.post(ENDPOINTS.social.replies(commentId), { text }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['replies', variables.commentId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

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
