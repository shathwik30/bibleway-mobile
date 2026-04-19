import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { pageNumberNextPage } from "@/api/pagination";
import type { PaginatedResponse } from "@/types/api";
import type { NoteType } from "@/types/enums";
import type { Note } from "@/types/models";

export interface CreateNoteInput {
  note_type: NoteType;
  text: string;
  verse_reference: string;
  object_id?: string;
}

export function useNotes() {
  return useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Note>>(ENDPOINTS.bible.notes, {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteInput) =>
      api.post(ENDPOINTS.bible.notes, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      api.patch(ENDPOINTS.bible.noteDetail(id), { text }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.bible.noteDetail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
