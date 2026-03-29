import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import { pageNumberNextPage } from '@/api/pagination';
import type { PaginatedResponse } from '@/types/api';
import type { BookmarkType, HighlightType, HighlightColor, NoteType } from '@/types/enums';
import type {
  SegregatedSection, SegregatedChapter, SegregatedPage, SegregatedPageDetail,
  Bookmark, Highlight, Note,
  BibleVersion, BibleDetail, BibleBook, BibleChapterSummary, BibleChapterContent,
  BibleVerseSummary, BibleVerseContent, BiblePassageContent,
  BibleSearchResult, BibleSectionSummary, BibleSectionContent,
  AudioBible, AudioBibleDetail, AudioBibleChapter,
} from '@/types/models';

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

export function useApiBible<T = unknown>(path: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: ['apiBible', path, params],
    queryFn: () => api.get<T>(ENDPOINTS.bible.apiBibleProxy(path), params),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!path,
  });
}

export function useBibleDetail(bibleId: string) {
  return useQuery({
    queryKey: ['apiBible', 'bible', bibleId],
    queryFn: () => api.get<BibleDetail>(ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}`)),
    ...CACHE_DURATIONS.bibleVersions,
    enabled: !!bibleId,
  });
}

export function useBibleVersions(params?: { language?: string; abbreviation?: string }) {
  const queryParams: Record<string, string> = {};
  if (params?.language) queryParams.language = params.language;
  if (params?.abbreviation) queryParams.abbreviation = params.abbreviation;

  return useQuery({
    queryKey: ['apiBible', 'bibles', queryParams],
    queryFn: () => api.get<BibleVersion[]>(
      ENDPOINTS.bible.apiBibleProxy('bibles/'),
      Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ),
    ...CACHE_DURATIONS.bibleVersions,
  });
}

export function useBibleBooks(bibleId: string) {
  return useQuery({
    queryKey: ['apiBible', 'books', bibleId],
    queryFn: () => api.get<BibleBook[]>(ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/books`)),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId,
  });
}

export function useBibleBookDetail(bibleId: string, bookId: string) {
  return useQuery({
    queryKey: ['apiBible', 'book', bibleId, bookId],
    queryFn: () => api.get<BibleBook>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/books/${bookId}`),
      { 'include-chapters': 'true' },
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!bookId,
  });
}

export function useBibleBookSections(bibleId: string, bookId: string) {
  return useQuery({
    queryKey: ['apiBible', 'bookSections', bibleId, bookId],
    queryFn: () => api.get<BibleSectionSummary[]>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/books/${bookId}/sections`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!bookId,
  });
}

export function useBibleChapterSections(bibleId: string, chapterId: string) {
  return useQuery({
    queryKey: ['apiBible', 'chapterSections', bibleId, chapterId],
    queryFn: () => api.get<BibleSectionSummary[]>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/chapters/${chapterId}/sections`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!chapterId,
  });
}

export function useBibleSection(bibleId: string, sectionId: string) {
  return useQuery({
    queryKey: ['apiBible', 'section', bibleId, sectionId],
    queryFn: () => api.get<BibleSectionContent>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/sections/${sectionId}`),
      { 'content-type': 'text', 'include-verse-numbers': 'true' },
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!sectionId,
  });
}

export function useBibleChapters(bibleId: string, bookId: string) {
  return useQuery({
    queryKey: ['apiBible', 'chapters', bibleId, bookId],
    queryFn: () => api.get<BibleChapterSummary[]>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/books/${bookId}/chapters`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!bookId,
  });
}

export function useBibleChapterContent(bibleId: string, chapterId: string) {
  return useQuery({
    queryKey: ['apiBible', 'chapterContent', bibleId, chapterId],
    queryFn: () => api.get<BibleChapterContent>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/chapters/${chapterId}`),
      {
        'content-type': 'text',
        'include-verse-numbers': 'true',
        'include-titles': 'true',
      },
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!chapterId,
  });
}

export function useBibleVerses(bibleId: string, chapterId: string) {
  return useQuery({
    queryKey: ['apiBible', 'verses', bibleId, chapterId],
    queryFn: () => api.get<BibleVerseSummary[]>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/chapters/${chapterId}/verses`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!chapterId,
  });
}

export function useBibleVerse(bibleId: string, verseId: string) {
  return useQuery({
    queryKey: ['apiBible', 'verse', bibleId, verseId],
    queryFn: () => api.get<BibleVerseContent>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/verses/${verseId}`),
      { 'content-type': 'text', 'include-verse-numbers': 'true' },
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!verseId,
  });
}

export function useBiblePassage(bibleId: string, passageId: string) {
  return useQuery({
    queryKey: ['apiBible', 'passage', bibleId, passageId],
    queryFn: () => api.get<BiblePassageContent>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/passages/${passageId}`),
      { 'content-type': 'text', 'include-verse-numbers': 'true' },
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId && !!passageId,
  });
}

export function useApiBibleSearch(
  bibleId: string,
  query: string,
  options?: { limit?: number; offset?: number; sort?: 'relevance' | 'canonical' | 'reverse-canonical'; range?: string },
) {
  const params: Record<string, string> = { query, limit: String(options?.limit ?? 25) };
  if (options?.offset) params.offset = String(options.offset);
  if (options?.sort) params.sort = options.sort;
  if (options?.range) params.range = options.range;

  return useQuery({
    queryKey: ['apiBible', 'search', bibleId, query, params],
    queryFn: () => api.get<BibleSearchResult>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/search`),
      params,
    ),
    enabled: !!bibleId && query.length >= 2,
  });
}

export function useAudioBibles(params?: { language?: string; bibleId?: string }) {
  return useQuery({
    queryKey: ['apiBible', 'audioBibles', params],
    queryFn: () => api.get<AudioBible[]>(ENDPOINTS.bible.apiBibleProxy('audio-bibles/'), params),
    ...CACHE_DURATIONS.bibleVersions,
  });
}

export function useAudioBibleDetail(audioBibleId: string) {
  return useQuery({
    queryKey: ['apiBible', 'audioBible', audioBibleId],
    queryFn: () => api.get<AudioBibleDetail>(ENDPOINTS.bible.apiBibleProxy(`audio-bibles/${audioBibleId}`)),
    ...CACHE_DURATIONS.bibleVersions,
    enabled: !!audioBibleId,
  });
}

export function useAudioBibleBooks(audioBibleId: string) {
  return useQuery({
    queryKey: ['apiBible', 'audioBooks', audioBibleId],
    queryFn: () => api.get<BibleBook[]>(ENDPOINTS.bible.apiBibleProxy(`audio-bibles/${audioBibleId}/books`)),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!audioBibleId,
  });
}

export function useAudioBibleBookChapters(audioBibleId: string, bookId: string) {
  return useQuery({
    queryKey: ['apiBible', 'audioBookChapters', audioBibleId, bookId],
    queryFn: () => api.get<BibleChapterSummary[]>(
      ENDPOINTS.bible.apiBibleProxy(`audio-bibles/${audioBibleId}/books/${bookId}/chapters`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!audioBibleId && !!bookId,
  });
}

export function useAudioBibleChapter(audioBibleId: string, chapterId: string) {
  return useQuery({
    queryKey: ['apiBible', 'audioChapter', audioBibleId, chapterId],
    queryFn: () => api.get<AudioBibleChapter>(
      ENDPOINTS.bible.apiBibleProxy(`audio-bibles/${audioBibleId}/chapters/${chapterId}`),
    ),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!audioBibleId && !!chapterId,
  });
}

export function useBibleSearch(query: string) {
  return useQuery({
    queryKey: ['bible', 'search', query],
    queryFn: () => api.get(ENDPOINTS.bible.search, { q: query }),
    enabled: query.length >= 2,
  });
}

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

export function useCreatePageComment() {
  return useMutation({
    mutationFn: ({ pageId, content }: { pageId: string; content: string }) =>
      api.post(ENDPOINTS.bible.pageComments(pageId), { content }),
  });
}
