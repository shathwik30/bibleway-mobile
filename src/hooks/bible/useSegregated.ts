import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { CACHE_DURATIONS } from "@/constants/api";
import type {
  SegregatedSection,
  SegregatedChapter,
  SegregatedPage,
  SegregatedPageDetail,
} from "@/types/models";

export function useSections() {
  return useQuery({
    queryKey: ["bible", "sections"],
    queryFn: () => api.get<SegregatedSection[]>(ENDPOINTS.bible.sections),
    ...CACHE_DURATIONS.segregatedPages,
  });
}

export function useChapters(sectionId: string) {
  return useQuery({
    queryKey: ["bible", "chapters", sectionId],
    queryFn: () =>
      api.get<SegregatedChapter[]>(ENDPOINTS.bible.chapters(sectionId)),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!sectionId,
  });
}

export function usePages(chapterId: string) {
  return useQuery({
    queryKey: ["bible", "pages", chapterId],
    queryFn: () => api.get<SegregatedPage[]>(ENDPOINTS.bible.pages(chapterId)),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!chapterId,
  });
}

export function usePageDetail(pageId: string, lang?: string) {
  return useQuery({
    queryKey: ["bible", "page", pageId, lang],
    queryFn: () =>
      api.get<SegregatedPageDetail>(
        ENDPOINTS.bible.pageDetail(pageId),
        lang ? { lang } : undefined,
      ),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!pageId,
  });
}

export function useCreatePageComment() {
  return useMutation({
    mutationFn: ({ pageId, content }: { pageId: string; content: string }) =>
      api.post(ENDPOINTS.bible.pageComments(pageId), { content }),
  });
}
