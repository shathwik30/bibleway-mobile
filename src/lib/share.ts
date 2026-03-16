import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { DEEP_LINK_SCHEME, UNIVERSAL_LINK_PREFIX } from '@/constants/app';

export function generateDeepLink(path: string): string {
  return `${UNIVERSAL_LINK_PREFIX}/${path}`;
}

export async function shareContent(title: string, url: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(url, { dialogTitle: title });
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}
