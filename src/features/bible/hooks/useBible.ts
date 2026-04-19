/*
 * Barrel re-export. The real hook implementations live in ./bible/*.
 * This file exists so existing callers keep working with their current
 * `@/hooks/useBible` imports — no call-site churn needed.
 */
export * from "./useSegregated";
export * from "./useApiBible";
export * from "./useBookmarks";
export * from "./useHighlights";
export * from "./useNotes";
