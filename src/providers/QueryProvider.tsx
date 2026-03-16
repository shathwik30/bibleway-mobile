import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { showToast } from '@/components/ui/Toast';

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Network error (no response)
    if (!error.response) {
      return 'Network error. Check your connection.';
    }

    const status = error.response.status;
    const data = error.response.data as Record<string, unknown> | undefined;

    // Try to extract server-provided message
    if (data) {
      if (typeof data.message === 'string') return data.message;
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.error === 'string') return data.error;
    }

    // Fallback by status code
    if (status === 400) return 'Invalid request. Please check your input.';
    if (status === 403) return 'You don\'t have permission to do this.';
    if (status === 404) return 'Not found.';
    if (status === 429) return 'Too many requests. Please wait a moment.';
    if (status >= 500) return 'Server error. Please try again later.';
  }

  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show toast for queries that already have data (background refetch failures)
      // Initial load errors are shown inline via the component's error state
      if (query.state.data !== undefined) {
        showToast('error', 'Update failed', getErrorMessage(error));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Show toast for all mutation errors unless the mutation has its own onError
      if (!mutation.options.onError) {
        showToast('error', 'Action failed', getErrorMessage(error));
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export { queryClient };

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
