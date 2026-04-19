import axios from "axios";

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

function pickMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.message, record.detail, record.error];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) return candidate;
    }
    for (const fieldValue of Object.values(record)) {
      if (typeof fieldValue === "string" && fieldValue.trim()) return fieldValue;
      if (Array.isArray(fieldValue) && typeof fieldValue[0] === "string") {
        return fieldValue[0];
      }
    }
  }
  return null;
}

export function parseError(
  err: unknown,
  fallback: string = GENERIC_ERROR_MESSAGE,
): string {
  if (err == null) return fallback;

  if (axios.isCancel?.(err)) return "Request cancelled";

  if (axios.isAxiosError(err)) {
    if (err.response) {
      const fromBody = pickMessage(err.response.data);
      if (fromBody) return fromBody;
      return `Request failed (${err.response.status})`;
    }
    if (err.code === "ECONNABORTED") return "Request timed out";
    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      return "Network unavailable. Check your connection.";
    }
    return err.message || fallback;
  }

  if (err instanceof Error) return err.message || fallback;

  const fromValue = pickMessage(err);
  return fromValue ?? fallback;
}
