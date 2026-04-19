import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { MainTabParamList } from "@/types/navigation";
import HomeStackNavigator from "./HomeStackNavigator";
import ChatStackNavigator from "./ChatStackNavigator";
import BibleStackNavigator from "./BibleStackNavigator";
import ShopStackNavigator from "./ShopStackNavigator";
import GamesStackNavigator from "./GamesStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { useChatStore } from "@/features/chat/store/chatStore";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  const chatUnreadCount = useChatStore((s) => s.unreadCount);
  const insets = useSafeAreaInsets();

  const hapticListeners = () => ({
    tabPress: () => {
      Haptics.selectionAsync();
    },
  });

  const tabBarHeight = 56 + Math.max(insets.bottom, 4);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
          height: tabBarHeight,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_600SemiBold",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t("feed.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: t("chat.chat", { defaultValue: "Chat" }),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
          tabBarBadge: chatUnreadCount > 0 ? chatUnreadCount : undefined,
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="BibleTab"
        component={BibleStackNavigator}
        options={{
          tabBarLabel: t("bible.bible"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopStackNavigator}
        options={{
          tabBarLabel: t("shop.shop"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="GamesTab"
        component={GamesStackNavigator}
        options={{
          tabBarLabel: "Games",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="game-controller-outline"
              size={size}
              color={color}
            />
          ),
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: t("profile.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
    </Tab.Navigator>
  );
}
