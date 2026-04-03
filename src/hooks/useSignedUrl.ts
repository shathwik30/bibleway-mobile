import { useMemo } from "react";
import { getSignedUrl } from "@/lib/s3Presign";

const TIGRIS_HOST = "storageapi.dev";

function needsSigning(url: string | null | undefined): boolean {
  return !!url && url.includes(TIGRIS_HOST);
}

export function useSignedUrl(url: string | null | undefined): string | null {
  return useMemo(() => {
    if (!url) return null;
    if (!needsSigning(url)) return url;
    return getSignedUrl(url);
  }, [url]);
}

export function useSignedUrls(
  items: { id: string; file: string }[],
): Map<string, string> {
  return useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) {
      map.set(
        item.id,
        needsSigning(item.file) ? getSignedUrl(item.file) : item.file,
      );
    }
    return map;
  }, [items]);
}
