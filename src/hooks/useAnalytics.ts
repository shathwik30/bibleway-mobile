import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { logger } from "@/utils/logger";
import type { PaginatedResponse } from "@/types/api";
import type {
  PostAnalytics,
  BoostAnalyticSnapshot,
} from "@/types/models";

export function useRecordView(
  contentType: "post" | "prayer",
  objectId: string,
) {
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    api
      .post(ENDPOINTS.analytics.recordView, {
        content_type_model: contentType,
        object_id: objectId,
        view_type: "view",
      })
      .catch((err) => logger.debug("[analytics] recordView failed", err));
  }, [contentType, objectId]);
}

export function useRecordShare() {
  return useMutation({
    mutationFn: ({
      contentType,
      objectId,
    }: {
      contentType: "post" | "prayer";
      objectId: string;
    }) =>
      api.post(ENDPOINTS.analytics.recordView, {
        content_type_model: contentType,
        object_id: objectId,
        view_type: "share",
      }),
  });
}

export function usePostAnalytics(postId: string) {
  return useQuery({
    queryKey: ["analytics", "post", postId],
    queryFn: () =>
      api.get<PostAnalytics>(ENDPOINTS.analytics.postAnalytics(postId)),
    enabled: !!postId,
  });
}

export function useUserAnalytics() {
  return useQuery({
    queryKey: ["analytics", "me"],
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
      receipt_data: string;
      transaction_id: string;
      duration_days: number;
    }) => api.post(ENDPOINTS.analytics.boostCreate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useBoosts(activeOnly = false) {
  return useQuery({
    queryKey: ["boosts", { activeOnly }],
    queryFn: () =>
      api.get(
        ENDPOINTS.analytics.boostList,
        activeOnly ? { active_only: "true" } : undefined,
      ),
  });
}

export function useBoostAnalytics(boostId: string) {
  return useQuery({
    queryKey: ["analytics", "boost", boostId],
    queryFn: () =>
      api.get<PaginatedResponse<BoostAnalyticSnapshot>>(
        ENDPOINTS.analytics.boostAnalytics(boostId),
      ),
    enabled: !!boostId,
  });
}
