/*
 * ============================================================================
 * CRITICAL SECURITY WARNING
 * ============================================================================
 * This file signs S3 requests *in the client* using long-lived Tigris
 * credentials. Any secret shipped in a mobile app is extractable by any user
 * — these credentials are effectively public the moment they ship.
 *
 * Action required (backend work, cannot be fixed client-side):
 *   1. Add a backend endpoint that accepts a storage key and returns a
 *      short-lived presigned URL (e.g. GET /media/signed-url/?key=...).
 *   2. Replace getSignedUrl below with a call to that endpoint.
 *   3. Rotate the Tigris credentials and scrub them from git history
 *      (they are exposed in every prior commit).
 *
 * The current implementation is retained only to avoid breaking existing
 * media rendering until the backend endpoint lands. Do not add new call
 * sites — route new work through the eventual backend signer.
 * ============================================================================
 */
import { sha256 } from "js-sha256";

const TIGRIS_ACCESS_KEY =
  process.env.EXPO_PUBLIC_TIGRIS_ACCESS_KEY ??
  "tid_RHjkfNsMLPcwgXlsMJpmY_wFvFw_wYzbkjmjfyOefLdNfuYKJc";
const TIGRIS_SECRET_KEY =
  process.env.EXPO_PUBLIC_TIGRIS_SECRET_KEY ??
  "tsec_xZy-YkdUtsGBKW+wDEIVMDjKT_dTNcIImArWwdcbCffuSXV6wwNARDO1_DlvmeJVH7dv_r";
const TIGRIS_BUCKET =
  process.env.EXPO_PUBLIC_TIGRIS_BUCKET ?? "bibleway-media-gad9adteco";
const TIGRIS_HOST = process.env.EXPO_PUBLIC_TIGRIS_HOST ?? "t3.storageapi.dev";
const REGION = "auto";
const EXPIRES = 86400;
const MAX_CACHE_ENTRIES = 500;

function hmacSha256(key: string | number[], message: string): number[] {
  return sha256.hmac.array(key, message);
}

function hmacSha256Hex(key: number[], message: string): string {
  return sha256.hmac(key, message);
}

function getSigningKey(dateStamp: string): number[] {
  const kDate = hmacSha256("AWS4" + TIGRIS_SECRET_KEY, dateStamp);
  const kRegion = hmacSha256(kDate, REGION);
  const kService = hmacSha256(kRegion, "s3");
  return hmacSha256(kService, "aws4_request");
}

export function presignUrl(storageUrl: string): string {
  const url = new URL(storageUrl);
  let objectKey = url.pathname.startsWith("/")
    ? url.pathname.slice(1)
    : url.pathname;

  if (objectKey.startsWith(TIGRIS_BUCKET + "/")) {
    objectKey = objectKey.slice(TIGRIS_BUCKET.length + 1);
  }

  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, "").slice(0, 8);
  const amzDate =
    dateStamp + "T" + now.toISOString().replace(/[-:]/g, "").slice(9, 15) + "Z";
  const scope = `${dateStamp}/${REGION}/s3/aws4_request`;

  const host = `${TIGRIS_BUCKET}.${TIGRIS_HOST}`;
  const canonicalUri =
    "/" + objectKey.split("/").map(encodeURIComponent).join("/");

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${TIGRIS_ACCESS_KEY}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(EXPIRES),
    "X-Amz-SignedHeaders": "host",
  });
  queryParams.sort();

  const canonicalRequest = [
    "GET",
    canonicalUri,
    queryParams.toString(),
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const canonicalRequestHash = sha256(canonicalRequest);

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    canonicalRequestHash,
  ].join("\n");

  const signingKey = getSigningKey(dateStamp);
  const signature = hmacSha256Hex(signingKey, stringToSign);

  queryParams.set("X-Amz-Signature", signature);

  return `https://${host}${canonicalUri}?${queryParams.toString()}`;
}

const presignCache = new Map<string, { url: string; expiry: number }>();

function evictOldest(): void {
  const now = Date.now();
  for (const [key, val] of presignCache) {
    if (val.expiry < now) presignCache.delete(key);
  }
  if (presignCache.size > MAX_CACHE_ENTRIES) {
    const overflow = presignCache.size - MAX_CACHE_ENTRIES;
    let removed = 0;
    for (const key of presignCache.keys()) {
      presignCache.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

export function getSignedUrl(storageUrl: string): string {
  if (!storageUrl || !storageUrl.includes(TIGRIS_HOST)) return storageUrl;

  const cached = presignCache.get(storageUrl);
  if (cached && cached.expiry > Date.now()) return cached.url;

  const signed = presignUrl(storageUrl);
  presignCache.set(storageUrl, {
    url: signed,
    expiry: Date.now() + (EXPIRES - 300) * 1000,
  });

  if (presignCache.size > MAX_CACHE_ENTRIES) evictOldest();

  return signed;
}
