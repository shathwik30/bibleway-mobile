import * as SecureStore from 'expo-secure-store';

export async function saveSecureValue(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureValue(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

export async function deleteSecureValue(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
