import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { pageNumberNextPage } from "@/api/pagination";
import type { PaginatedResponse } from "@/types/api";
import type { BookmarkType } from "@/types/enums";
import type { Bookmark } from "@/types/models";

export interface CreateBookmarkInput {
  bookmark_type: BookmarkType;
  verse_reference: string;
  object_id?: string;
}

export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Bookmark>>(ENDPOINTS.bible.bookmarks, {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookmarkInput) =>
      api.post(ENDPOINTS.bible.bookmarks, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.bookmarkDetail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}
