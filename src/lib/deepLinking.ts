import { DEEP_LINK_SCHEME, UNIVERSAL_LINK_PREFIX } from '@/constants/app';

export function parseDeepLink(url: string): { screen: string; params: Record<string, string> } | null {
  const cleaned = url
    .replace(`${DEEP_LINK_SCHEME}://`, '')
    .replace(`${UNIVERSAL_LINK_PREFIX}/`, '');

  const parts = cleaned.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  const routes: Record<string, string> = {
    post: 'PostDetail',
    prayer: 'PrayerDetail',
    user: 'UserProfile',
    'bible/page': 'SegregatedPageDetail',
    'shop/product': 'ProductDetail',
  };

  if (parts[0] === 'bible' && parts[1] === 'page' && parts[2]) {
    return { screen: 'SegregatedPageDetail', params: { pageId: parts[2] } };
  }
  if (parts[0] === 'shop' && parts[1] === 'product' && parts[2]) {
    return { screen: 'ProductDetail', params: { productId: parts[2] } };
  }
  if (parts[0] === 'post' && parts[1]) {
    return { screen: 'PostDetail', params: { postId: parts[1] } };
  }
  if (parts[0] === 'prayer' && parts[1]) {
    return { screen: 'PrayerDetail', params: { prayerId: parts[1] } };
  }
  if (parts[0] === 'user' && parts[1]) {
    return { screen: 'UserProfile', params: { userId: parts[1] } };
  }

  return null;
}
