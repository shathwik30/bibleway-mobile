import type { CursorPaginatedResponse, PaginatedResponse } from '@/types/api';

/**
 * getNextPageParam for cursor-based pagination (feeds).
 * Returns the full `next` URL or undefined to stop.
 */
export function cursorNextPage<T>(lastPage: CursorPaginatedResponse<T>): string | undefined {
  return lastPage.next ?? undefined;
}

/**
 * getNextPageParam for page-number pagination.
 * Parses ?page=N from the `next` URL, or returns undefined to stop.
 */
export function pageNumberNextPage<T>(lastPage: PaginatedResponse<T>): number | undefined {
  if (!lastPage.next) return undefined;
  try {
    const url = new URL(lastPage.next);
    const page = url.searchParams.get('page');
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}
