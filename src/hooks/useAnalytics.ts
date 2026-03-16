import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { PostAnalytics, PostBoost, BoostAnalyticsSummary } from '@/types/models';

export function usePostAnalytics(postId: string) {
  return useQuery({
    queryKey: ['analytics', 'post', postId],
    queryFn: () => api.get<PostAnalytics>(ENDPOINTS.analytics.postAnalytics(postId)),
  });
}

export function useUserAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: () => api.get(ENDPOINTS.analytics.userAnalytics),
  });
}

export function useCreateBoost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      post_id: string;
      tier: string;
      platform: string;
      receipt_data?: string;
      transaction_id: string;
      duration_days: number;
    }) => api.post(ENDPOINTS.analytics.boostCreate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
    },
  });
}

export function useBoosts() {
  return useQuery({
    queryKey: ['boosts'],
    queryFn: () => api.get(ENDPOINTS.analytics.boostList),
  });
}

export function useBoostAnalytics(boostId: string) {
  return useQuery({
    queryKey: ['analytics', 'boost', boostId],
    queryFn: () => api.get<BoostAnalyticsSummary>(ENDPOINTS.analytics.boostAnalytics(boostId)),
    enabled: !!boostId,
  });
}
