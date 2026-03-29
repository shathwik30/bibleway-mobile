import type { InfiniteData } from '@tanstack/react-query';

export function flattenPages<T>(data: InfiniteData<{ results: T[] }> | undefined): T[] {
  return data?.pages?.flatMap((page) => page.results) ?? [];
}
