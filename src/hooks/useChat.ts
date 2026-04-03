import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { useChatStore } from "@/stores/chatStore";
import { CACHE_DURATIONS } from "@/constants/api";
import { cursorNextPage, pageNumberNextPage } from "@/api/pagination";
import type { PaginatedResponse, CursorPaginatedResponse } from "@/types/api";
import type { Conversation, ChatMessage } from "@/types/models";

export function useConversations() {
  return useInfiniteQuery<
    PaginatedResponse<Conversation>,
    Error,
    InfiniteData<PaginatedResponse<Conversation>>,
    string[],
    number
  >({
    queryKey: ["conversations"],
    queryFn: ({ pageParam }) =>
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
  return useInfiniteQuery<
    CursorPaginatedResponse<ChatMessage>,
    Error,
    InfiniteData<CursorPaginatedResponse<ChatMessage>>,
    string[],
    string | undefined
  >({
    queryKey: ["chatMessages", conversationId],
    queryFn: ({ pageParam }) =>
      api.get<CursorPaginatedResponse<ChatMessage>>(
        ENDPOINTS.chat.messages(conversationId),
        pageParam ? { cursor: pageParam } : {},
      ),
    initialPageParam: undefined,
    getNextPageParam: cursorNextPage,
    refetchInterval: 3000,
    ...CACHE_DURATIONS.chatMessages,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, string>({
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

  return useMutation<ChatMessage, Error, string>({
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

  return useQuery<number, Error>({
    queryKey: ["chatUnreadCount"],
    queryFn: async (): Promise<number> => {
      const res = await api.get<{ unread_count: number }>(
        ENDPOINTS.chat.unreadCount,
      );
      const count: number = res.unread_count ?? 0;
      setUnreadCount(count);
      return count;
    },
    refetchInterval: 30000,
    ...CACHE_DURATIONS.chat,
  });
}

export function useMarkMessagesRead(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: () => api.post(ENDPOINTS.chat.markRead(conversationId), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["chatUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

interface TranslateResult {
  translated_text: string;
  source_language: string;
  target_language: string;
}

interface TranslateRequest {
  messageId: string;
  targetLanguage: string;
}

export function useTranslateMessage() {
  return useMutation<TranslateResult, Error, TranslateRequest>({
    mutationFn: ({ messageId, targetLanguage }: TranslateRequest) =>
      api.post<TranslateResult>(ENDPOINTS.chat.translateMessage, {
        message_id: messageId,
        target_language: targetLanguage,
      }),
  });
}
