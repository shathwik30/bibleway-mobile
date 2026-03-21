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
  BibleVersion, BibleBook, BibleChapterSummary, BibleChapterContent,
  BibleVerseSummary, BibleVerseContent, BiblePassageContent,
  BibleSearchResult, AudioBible, AudioBibleChapter,
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

// ---------------------------------------------------------------------------
// API Bible proxy (generic + dedicated typed hooks)
// ---------------------------------------------------------------------------

export function useApiBible<T = any>(path: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: ['apiBible', path, params],
    queryFn: () => api.get<T>(ENDPOINTS.bible.apiBibleProxy(path), params),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!path,
  });
}

/** List available Bible versions. Defaults to English to keep response fast. */
export function useBibleVersions(params?: { language?: string; abbreviation?: string }) {
  const queryParams = { language: 'eng', ...params };
  return useQuery({
    queryKey: ['apiBible', 'bibles', queryParams],
    queryFn: () => api.get<BibleVersion[]>(ENDPOINTS.bible.apiBibleProxy('bibles/'), queryParams),
    ...CACHE_DURATIONS.bibleVersions,
  });
}

/** List books for a given Bible version. */
export function useBibleBooks(bibleId: string) {
  return useQuery({
    queryKey: ['apiBible', 'books', bibleId],
    queryFn: () => api.get<BibleBook[]>(ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/books`)),
    ...CACHE_DURATIONS.bibleContent,
    enabled: !!bibleId,
  });
}

/** List chapters for a book within a Bible version. */
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

/** Get full chapter content (text) for reading. */
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

/** List verses in a chapter. */
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

/** Get a single verse with content. */
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

/** Get a passage (range of verses). */
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

/** Search within a Bible version. */
export function useApiBibleSearch(bibleId: string, query: string) {
  return useQuery({
    queryKey: ['apiBible', 'search', bibleId, query],
    queryFn: () => api.get<BibleSearchResult>(
      ENDPOINTS.bible.apiBibleProxy(`bibles/${bibleId}/search`),
      { query, limit: '25' },
    ),
    enabled: !!bibleId && query.length >= 2,
  });
}

/** List available audio Bibles. */
export function useAudioBibles(params?: { language?: string; bibleId?: string }) {
  return useQuery({
    queryKey: ['apiBible', 'audioBibles', params],
    queryFn: () => api.get<AudioBible[]>(ENDPOINTS.bible.apiBibleProxy('audio-bibles/'), params),
    ...CACHE_DURATIONS.bibleVersions,
  });
}

/** Get audio chapter with resourceUrl and timecodes. */
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
