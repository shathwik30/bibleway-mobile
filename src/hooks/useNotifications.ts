import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { useNotificationStore } from '@/stores/notificationStore';
import { CACHE_DURATIONS } from '@/constants/api';
import { pageNumberNextPage } from '@/api/pagination';
import type { PaginatedResponse } from '@/types/api';
import type { Notification } from '@/types/models';

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Notification>>(ENDPOINTS.notifications.list, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
    ...CACHE_DURATIONS.notifications,
  });
}

export function useUnreadCount() {
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const res = await api.get<{ unread_count: number }>(ENDPOINTS.notifications.unreadCount);
      const count = res.unread_count ?? 0;
      setUnreadCount(count);
      return count;
    },
    refetchInterval: 30000,
    ...CACHE_DURATIONS.unreadCount,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  const decrementUnreadCount = useNotificationStore((s) => s.decrementUnreadCount);
  const clearUnreadCount = useNotificationStore((s) => s.clearUnreadCount);

  return useMutation({
    mutationFn: (notificationId?: string) =>
      api.post(ENDPOINTS.notifications.markRead, notificationId ? { notification_id: notificationId } : {}),
    onSuccess: (_, notificationId) => {
      if (notificationId) {
        decrementUnreadCount();
      } else {
        clearUnreadCount();
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.notifications.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}
