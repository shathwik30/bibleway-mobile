import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { useChatStore } from "@/stores/chatStore";
import { CACHE_DURATIONS } from "@/constants/api";
import { cursorNextPage, pageNumberNextPage } from "@/api/pagination";
import type { PaginatedResponse, CursorPaginatedResponse } from "@/types/api";
import type { Conversation, ChatMessage } from "@/types/models";

export function useConversations() {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Conversation>>(ENDPOINTS.chat.conversations, {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
    refetchInterval: 30000,
    ...CACHE_DURATIONS.chat,
  });
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ["chatMessages", conversationId],
    queryFn: ({ pageParam }) =>
      api.get<CursorPaginatedResponse<ChatMessage>>(
        ENDPOINTS.chat.messages(conversationId),
        pageParam ? { cursor: pageParam } : {},
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: cursorNextPage,
    refetchInterval: 3000,
    ...CACHE_DURATIONS.chatMessages,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      api.post<Conversation>(ENDPOINTS.chat.conversations, {
        user_id: userId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      api.post<ChatMessage>(ENDPOINTS.chat.messages(conversationId), { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useChatUnreadCount() {
  const setUnreadCount = useChatStore((s) => s.setUnreadCount);

  return useQuery({
    queryKey: ["chatUnreadCount"],
    queryFn: async () => {
      const res = await api.get<{ unread_count: number }>(
        ENDPOINTS.chat.unreadCount,
      );
      const count = res.unread_count ?? 0;
      setUnreadCount(count);
      return count;
    },
    refetchInterval: 30000,
    ...CACHE_DURATIONS.chat,
  });
}

export function useMarkMessagesRead(conversationId: string) {
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: () =>
      api.post(ENDPOINTS.chat.markRead(conversationId), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["chatUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return markRead;
}
