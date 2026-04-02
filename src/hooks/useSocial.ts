import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { CACHE_DURATIONS } from "@/constants/api";
import { cursorNextPage, pageNumberNextPage } from "@/api/pagination";
import type { CursorPaginatedResponse, PaginatedResponse } from "@/types/api";
import type { Post, Prayer, Comment, Reply } from "@/types/models";
import type { EmojiType } from "@/types/enums";

function prependToFirstPage<TPage extends { results: unknown[] }>(
  old: InfiniteData<TPage>,
  item: TPage["results"][number],
): InfiniteData<TPage> {
  if (!old.pages.length) return old;
  return {
    ...old,
    pages: [
      { ...old.pages[0], results: [item, ...old.pages[0].results] } as TPage,
      ...old.pages.slice(1),
    ],
  };
}

function removeFromPages<TPage extends { results: Array<{ id: string }> }>(
  old: InfiniteData<TPage>,
  id: string,
): InfiniteData<TPage> {
  return {
    ...old,
    pages: old.pages.map(
      (page) =>
        ({
          ...page,
          results: page.results.filter((item) => item.id !== id),
        }) as TPage,
    ),
  };
}

function updateInPages<TPage extends { results: Array<{ id: string }> }>(
  old: InfiniteData<TPage>,
  id: string,
  updater: (item: TPage["results"][number]) => TPage["results"][number],
): InfiniteData<TPage> {
  return {
    ...old,
    pages: old.pages.map(
      (page) =>
        ({
          ...page,
          results: page.results.map((item) =>
            item.id === id ? updater(item) : item,
          ),
        }) as TPage,
    ),
  };
}

type CursorFeedData<T> = InfiniteData<CursorPaginatedResponse<T>>;
type PagedData<T> = InfiniteData<PaginatedResponse<T>>;

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
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
    queryKey: ["posts", "user", userId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Post>>(pageParam);
      return api.get<CursorPaginatedResponse<Post>>(ENDPOINTS.social.posts, {
        author: userId,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    enabled: !!userId,
    ...CACHE_DURATIONS.feed,
  });
}

export function useUserPrayers(userId: string) {
  return useInfiniteQuery({
    queryKey: ["prayers", "user", userId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Prayer>>(pageParam);
      return api.get<CursorPaginatedResponse<Prayer>>(
        ENDPOINTS.social.prayers,
        { author: userId },
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    enabled: !!userId,
    ...CACHE_DURATIONS.feed,
  });
}

export function usePrayers() {
  return useInfiniteQuery({
    queryKey: ["prayers"],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (pageParam) return api.get<CursorPaginatedResponse<Prayer>>(pageParam);
      return api.get<CursorPaginatedResponse<Prayer>>(ENDPOINTS.social.prayers);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    ...CACHE_DURATIONS.feed,
  });
}

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.get<Post>(ENDPOINTS.social.postDetail(postId)),
    ...CACHE_DURATIONS.feed,
  });
}

export function usePrayerDetail(prayerId: string) {
  return useQuery({
    queryKey: ["prayer", prayerId],
    queryFn: () => api.get<Prayer>(ENDPOINTS.social.prayerDetail(prayerId)),
    ...CACHE_DURATIONS.feed,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      text_content: string;
      media_keys?: string[];
      media_types?: string[];
    }) => api.post<Post>(ENDPOINTS.social.posts, data),
    onSuccess: (newPost) => {
      queryClient.setQueriesData<CursorFeedData<Post>>(
        { queryKey: ["posts"] },
        (old) => (old ? prependToFirstPage(old, newPost) : old),
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
      queryClient.setQueriesData<CursorFeedData<Prayer>>(
        { queryKey: ["prayers"] },
        (old) => (old ? prependToFirstPage(old, newPrayer) : old),
      );
    },
  });
}

function useDeleteFeedItem<T extends { id: string }>(
  queryKey: string,
  detailEndpoint: (id: string) => string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(detailEndpoint(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });
      const previous = queryClient.getQueriesData<CursorFeedData<T>>({
        queryKey: [queryKey],
      });
      queryClient.setQueriesData<CursorFeedData<T>>(
        { queryKey: [queryKey] },
        (old) => (old ? removeFromPages(old, id) : old),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(
        ([key, data]: [QueryKey, CursorFeedData<T> | undefined]) =>
          queryClient.setQueryData(key, data),
      );
    },
  });
}

export function useDeletePost() {
  return useDeleteFeedItem<Post>("posts", ENDPOINTS.social.postDetail);
}

export function useDeletePrayer() {
  return useDeleteFeedItem<Prayer>("prayers", ENDPOINTS.social.prayerDetail);
}

export function useToggleReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contentType,
      objectId,
      emojiType,
    }: {
      contentType: "post" | "prayer";
      objectId: string;
      emojiType: EmojiType;
    }) => {
      const endpoint =
        contentType === "post"
          ? ENDPOINTS.social.postReact(objectId)
          : ENDPOINTS.social.prayerReact(objectId);
      return api.post(endpoint, { emoji_type: emojiType });
    },
    onMutate: async ({ contentType, objectId, emojiType }) => {
      const queryKey = [contentType === "post" ? "posts" : "prayers"];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData<
        CursorFeedData<Post | Prayer>
      >({ queryKey });

      type FeedItem = Post | Prayer;
      queryClient.setQueriesData<CursorFeedData<FeedItem>>(
        { queryKey },
        (old) =>
          old
            ? updateInPages(old, objectId, (item) => ({
                ...item,
                user_reaction:
                  item.user_reaction === emojiType ? null : emojiType,
                reaction_count:
                  item.reaction_count +
                  (item.user_reaction === emojiType
                    ? -1
                    : item.user_reaction
                      ? 0
                      : 1),
              }))
            : old,
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },
  });
}

export function useComments(contentType: "post" | "prayer", objectId: string) {
  const endpoint =
    contentType === "post"
      ? ENDPOINTS.social.postComments(objectId)
      : ENDPOINTS.social.prayerComments(objectId);

  return useInfiniteQuery({
    queryKey: ["comments", contentType, objectId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Comment>>(endpoint, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contentType,
      objectId,
      text,
    }: {
      contentType: "post" | "prayer";
      objectId: string;
      text: string;
    }) => {
      const endpoint =
        contentType === "post"
          ? ENDPOINTS.social.postComments(objectId)
          : ENDPOINTS.social.prayerComments(objectId);
      return api.post<Comment>(endpoint, {
        text,
        content_type_model: contentType,
        object_id: objectId,
      });
    },
    onSuccess: (newComment, variables) => {
      queryClient.setQueriesData<PagedData<Comment>>(
        { queryKey: ["comments", variables.contentType, variables.objectId] },
        (old) => (old ? prependToFirstPage(old, newComment) : old),
      );
      type FeedItem = Post | Prayer;
      const feedKey = [variables.contentType === "post" ? "posts" : "prayers"];
      queryClient.setQueriesData<CursorFeedData<FeedItem>>(
        { queryKey: feedKey },
        (old) =>
          old
            ? updateInPages(old, variables.objectId, (item) => ({
                ...item,
                comment_count: (item.comment_count || 0) + 1,
              }))
            : old,
      );
    },
  });
}

export function useReplies(commentId: string) {
  return useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Reply>>(ENDPOINTS.social.replies(commentId), {
        page: pageParam,
      }),
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
      queryClient.setQueriesData<PagedData<Reply>>(
        { queryKey: ["replies", variables.commentId] },
        (old) => (old ? prependToFirstPage(old, newReply) : old),
      );
      queryClient.setQueriesData<PagedData<Comment>>(
        { queryKey: ["comments"] },
        (old) =>
          old
            ? updateInPages(old, variables.commentId, (c) => ({
                ...c,
                reply_count: (c.reply_count || 0) + 1,
              }))
            : old,
      );
    },
  });
}

export function useShareContent() {
  return useMutation({
    mutationFn: ({
      contentType,
      objectId,
    }: {
      contentType: "post" | "prayer";
      objectId: string;
    }) => {
      const endpoint =
        contentType === "post"
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
