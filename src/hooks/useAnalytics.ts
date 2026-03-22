import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { PostAnalytics, PostBoost, BoostAnalyticSnapshot } from '@/types/models';

// ---------------------------------------------------------------------------
// View / share recording
// ---------------------------------------------------------------------------

export function useRecordView(contentType: 'post' | 'prayer', objectId: string) {
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    api.post(ENDPOINTS.analytics.recordView, {
      content_type_model: contentType,
      object_id: objectId,
      view_type: 'view',
    }).catch(() => {
      // Fire-and-forget: don't block the UI if view recording fails
    });
  }, [contentType, objectId]);
}

export function useRecordShare() {
  return useMutation({
    mutationFn: ({ contentType, objectId }: { contentType: 'post' | 'prayer'; objectId: string }) =>
      api.post(ENDPOINTS.analytics.recordView, {
        content_type_model: contentType,
        object_id: objectId,
        view_type: 'share',
      }),
  });
}

// ---------------------------------------------------------------------------
// Post analytics
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Boosts
// ---------------------------------------------------------------------------

export function useCreateBoost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      post_id: string;
      tier: string;
      platform: string;
      receipt_data: string;
      transaction_id: string;
      duration_days: number;
    }) => api.post(ENDPOINTS.analytics.boostCreate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useBoosts(activeOnly = false) {
  return useQuery({
    queryKey: ['boosts', { activeOnly }],
    queryFn: () => api.get(ENDPOINTS.analytics.boostList, activeOnly ? { active_only: 'true' } : undefined),
  });
}

export function useBoostAnalytics(boostId: string) {
  return useQuery({
    queryKey: ['analytics', 'boost', boostId],
    queryFn: () => api.get<PaginatedResponse<BoostAnalyticSnapshot>>(ENDPOINTS.analytics.boostAnalytics(boostId)),
    enabled: !!boostId,
  });
}
