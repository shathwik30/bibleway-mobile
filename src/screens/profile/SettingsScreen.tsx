import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import { useAuthStore } from "@/features/auth/store/authStore";
import { confirmAction } from "@/lib/confirm";
import { colors } from "@/theme/colors";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen?:
    | "EditProfile"
    | "LanguageSettings"
    | "BlockedUsers"
    | "Purchases"
    | "Downloads"
    | "Bookmarks"
    | "Notes";
  onPress?: () => void;
  destructive?: boolean;
  rightLabel?: string;
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    confirmAction(
      t("settings.logout"),
      t("settings.logoutConfirm"),
      () => logout(),
      t("settings.logout"),
    );
  };

  const handleDeleteAccount = () => {
    confirmAction(
      t("settings.deleteAccount"),
      t("settings.deleteAccountConfirm"),
      () => {},
      t("settings.deleteAccount"),
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: "person-outline",
      label: t("settings.editProfile"),
      screen: "EditProfile",
    },
    {
      icon: "language-outline",
      label: t("settings.language"),
      screen: "LanguageSettings",
    },
    {
      icon: "ban-outline",
      label: t("settings.blockedUsers"),
      screen: "BlockedUsers",
    },
    {
      icon: "bag-outline",
      label: t("settings.myPurchases"),
      screen: "Purchases",
    },
    {
      icon: "download-outline",
      label: t("settings.downloads"),
      screen: "Downloads",
    },
    {
      icon: "bookmark-outline",
      label: t("settings.bookmarks"),
      screen: "Bookmarks",
    },
    {
      icon: "document-text-outline",
      label: t("settings.notes"),
      screen: "Notes",
    },
    {
      icon: "log-out-outline",
      label: t("settings.logout"),
      onPress: handleLogout,
      destructive: true,
    },
    {
      icon: "trash-outline",
      label: t("settings.deleteAccount"),
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t("settings.title")} />
      <ScrollView className="flex-1 px-4 pt-2">
        {menuItems.map((item, _index) => (
          <AnimatedPressable
            key={item.icon}
            onPress={
              item.onPress ||
              (() => item.screen && navigation.navigate(item.screen))
            }
            className="flex-row items-center p-4 bg-surfaceContainerLowest rounded-xl mb-2"
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={item.destructive ? colors.error : colors.primary.DEFAULT}
            />
            <Text
              className={`flex-1 text-base ml-3 ${item.destructive ? "text-red-500" : "text-textPrimary"}`}
            >
              {item.label}
            </Text>
            {item.rightLabel && (
              <Text className="text-sm text-textSecondary mr-2">
                {item.rightLabel}
              </Text>
            )}
            {!item.destructive && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            )}
          </AnimatedPressable>
        ))}

        <View className="items-center py-6">
          <Text className="text-xs text-textSecondary">
            {t("settings.version")} {appVersion}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
