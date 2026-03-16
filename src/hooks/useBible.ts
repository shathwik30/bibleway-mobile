import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import { pageNumberNextPage } from '@/api/pagination';
import type { PaginatedResponse } from '@/types/api';
import type { BookmarkType, HighlightType, HighlightColor, NoteType } from '@/types/enums';
import type { SegregatedSection, SegregatedChapter, SegregatedPage, SegregatedPageDetail, Bookmark, Highlight, Note } from '@/types/models';

interface CreateBookmarkInput {
  bookmark_type: BookmarkType;
  verse_reference: string;
  object_id?: string;
}

interface CreateHighlightInput {
  highlight_type: HighlightType;
  color: HighlightColor;
  verse_reference: string;
  object_id?: string;
  selection_start?: number;
  selection_end?: number;
}

interface CreateNoteInput {
  note_type: NoteType;
  text: string;
  verse_reference: string;
  object_id?: string;
}

// Segregated Bible
export function useSections() {
  return useQuery({
    queryKey: ['bible', 'sections'],
    queryFn: () => api.get<SegregatedSection[]>(ENDPOINTS.bible.sections),
    ...CACHE_DURATIONS.segregatedPages,
  });
}

export function useChapters(sectionId: string) {
  return useQuery({
    queryKey: ['bible', 'chapters', sectionId],
    queryFn: () => api.get<SegregatedChapter[]>(ENDPOINTS.bible.chapters(sectionId)),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!sectionId,
  });
}

export function usePages(chapterId: string) {
  return useQuery({
    queryKey: ['bible', 'pages', chapterId],
    queryFn: () => api.get<SegregatedPage[]>(ENDPOINTS.bible.pages(chapterId)),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!chapterId,
  });
}

export function usePageDetail(pageId: string, lang?: string) {
  return useQuery({
    queryKey: ['bible', 'page', pageId, lang],
    queryFn: () => api.get<SegregatedPageDetail>(ENDPOINTS.bible.pageDetail(pageId), lang ? { lang } : undefined),
    ...CACHE_DURATIONS.segregatedPages,
    enabled: !!pageId,
  });
}

// API Bible proxy
export function useApiBible(path: string) {
  return useQuery({
    queryKey: ['apiBible', path],
    queryFn: () => api.get(ENDPOINTS.bible.apiBibleProxy(path)),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!path,
  });
}

// Bible search
export function useBibleSearch(query: string) {
  return useQuery({
    queryKey: ['bible', 'search', query],
    queryFn: () => api.get(ENDPOINTS.bible.search, { q: query }),
    enabled: query.length >= 2,
  });
}

// Bookmarks
export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Bookmark>>(ENDPOINTS.bible.bookmarks, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookmarkInput) => api.post(ENDPOINTS.bible.bookmarks, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.bookmarkDetail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });
}

// Highlights
export function useHighlights() {
  return useInfiniteQuery({
    queryKey: ['highlights'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Highlight>>(ENDPOINTS.bible.highlights, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHighlightInput) => api.post(ENDPOINTS.bible.highlights, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights'] }),
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.highlightDetail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights'] }),
  });
}

// Notes
export function useNotes() {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Note>>(ENDPOINTS.bible.notes, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteInput) => api.post(ENDPOINTS.bible.notes, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      api.patch(ENDPOINTS.bible.noteDetail(id), { text }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.noteDetail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
}
