// Standard response wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Page-number paginated response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: T[];
}

// Cursor-based paginated response (for feeds)
export interface CursorPaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth tokens
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Unread count response
export interface UnreadCountResponse {
  unread_count: number;
}
