import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { mmkvStorage } from "@/lib/storage";

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
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  try {
    await api.post(ENDPOINTS.notifications.registerToken, {
      token,
      platform: Platform.OS as "ios" | "android",
    });
    mmkvStorage.setString("push_token", token);
  } catch (e) {
    console.warn("[push] Failed to register device token", e);
  }

  return token;
}

export async function deregisterPushNotifications(
  token: string,
): Promise<void> {
  try {
    await api.post(ENDPOINTS.notifications.deregisterToken, { token });
  } catch (e) {
    console.warn("[push] Failed to deregister device token", e);
  }
}
