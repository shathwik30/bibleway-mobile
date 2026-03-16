import { Platform } from 'react-native';

// IAP initialization - will be configured when expo-in-app-purchases is set up
export async function initIAP(): Promise<void> {
  // IAP setup handled at app level
}

export function getPlatformProductId(
  appleId: string,
  googleId: string
): string {
  return Platform.OS === 'ios' ? appleId : googleId;
}
