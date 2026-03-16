import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  // Register with backend
  try {
    await api.post(ENDPOINTS.notifications.registerToken, {
      token,
      platform: Platform.OS as 'ios' | 'android',
    });
  } catch (error) {
    console.error('Failed to register push token:', error);
  }

  return token;
}

export async function deregisterPushNotifications(token: string): Promise<void> {
  try {
    await api.post(ENDPOINTS.notifications.deregisterToken, { token });
  } catch (error) {
    console.error('Failed to deregister push token:', error);
  }
}
