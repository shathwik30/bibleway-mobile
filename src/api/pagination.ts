import type { CursorPaginatedResponse, PaginatedResponse } from "@/types/api";

export function cursorNextPage<T>(
  lastPage: CursorPaginatedResponse<T>,
): string | undefined {
  return lastPage.next ?? undefined;
}

export function pageNumberNextPage<T>(
  lastPage: PaginatedResponse<T>,
): number | undefined {
  if (!lastPage.next) return undefined;
  try {
    const url = new URL(lastPage.next);
    const page = url.searchParams.get("page");
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}
