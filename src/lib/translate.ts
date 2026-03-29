const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

const cache = new Map<string, string>();

function cacheKey(text: string, from: string, to: string): string {
  return `${from}:${to}:${text.slice(0, 100)}`;
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en',
): Promise<string> {
  if (!text.trim() || targetLang === sourceLang) return text;

  const key = cacheKey(text, sourceLang, targetLang);
  const cached = cache.get(key);
  if (cached) return cached;

  const chunks = splitText(text, 4000);
  const translated: string[] = [];

  for (const chunk of chunks) {
    const result = await translateChunk(chunk, targetLang, sourceLang);
    translated.push(result);
  }

  const fullResult = translated.join('');
  cache.set(key, fullResult);

  if (cache.size > 200) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  return fullResult;
}

async function translateChunk(
  text: string,
  targetLang: string,
  sourceLang: string,
): Promise<string> {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: sourceLang,
    tl: targetLang,
    dt: 't',
    q: text,
  });

  const response = await fetch(`${TRANSLATE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && Array.isArray(data[0])) {
    return (data[0] as Array<[string, ...unknown[]] | null>)
      .filter((segment): segment is [string, ...unknown[]] => !!segment?.[0])
      .map((segment) => segment[0])
      .join('');
  }

  return text;
}

function splitText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    let breakAt = remaining.lastIndexOf('. ', maxLength);
    if (breakAt === -1 || breakAt < maxLength * 0.5) {
      breakAt = remaining.lastIndexOf('\n', maxLength);
    }
    if (breakAt === -1 || breakAt < maxLength * 0.5) {
      breakAt = remaining.lastIndexOf(' ', maxLength);
    }
    if (breakAt === -1) {
      breakAt = maxLength;
    }

    chunks.push(remaining.slice(0, breakAt + 1));
    remaining = remaining.slice(breakAt + 1);
  }

  return chunks;
}
