import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { pageNumberNextPage } from "@/api/pagination";
import type { PaginatedResponse } from "@/types/api";
import type { HighlightType, HighlightColor } from "@/types/enums";
import type { Highlight } from "@/types/models";

export interface CreateHighlightInput {
  highlight_type: HighlightType;
  color: HighlightColor;
  verse_reference: string;
  object_id?: string;
  selection_start?: number;
  selection_end?: number;
}

export function useHighlights() {
  return useInfiniteQuery({
    queryKey: ["highlights"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Highlight>>(ENDPOINTS.bible.highlights, {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHighlightInput) =>
      api.post(ENDPOINTS.bible.highlights, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["highlights"] }),
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.highlightDetail(id)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["highlights"] }),
  });
}
