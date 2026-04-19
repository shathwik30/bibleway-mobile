/*
 * Barrel re-export. The real hook implementations live in ./bible/*.
 * This file exists so existing callers keep working with their current
 * `@/hooks/useBible` imports — no call-site churn needed.
 */
export * from "./bible/useSegregated";
export * from "./bible/useApiBible";
export * from "./bible/useBookmarks";
export * from "./bible/useHighlights";
export * from "./bible/useNotes";
