import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import type { VerseOfDay } from '@/types/models';

export function useVerseOfDay() {
  return useQuery({
    queryKey: ['verseOfDay'],
    queryFn: () => api.get<VerseOfDay>(ENDPOINTS.verseOfDay.today),
    ...CACHE_DURATIONS.verseOfDay,
  });
}

export function useVerseByDate(dateStr: string) {
  return useQuery({
    queryKey: ['verseOfDay', dateStr],
    queryFn: () => api.get<VerseOfDay>(ENDPOINTS.verseOfDay.byDate(dateStr)),
    enabled: !!dateStr,
    ...CACHE_DURATIONS.verseOfDay,
  });
}
