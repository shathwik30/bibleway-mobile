import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { MainTabParamList } from '@/types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import BibleStackNavigator from './BibleStackNavigator';
import ShopStackNavigator from './ShopStackNavigator';
import GamesStackNavigator from './GamesStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAppStore } from '@/stores/appStore';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isDark = useAppStore((s) => s.isDark);

  const hapticListeners = () => ({
    tabPress: () => {
      Haptics.selectionAsync();
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A6FA5',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A2E' : '#FFFFFF',
          borderTopColor: isDark ? '#2D2D3F' : '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t('feed.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="BibleTab"
        component={BibleStackNavigator}
        options={{
          tabBarLabel: t('bible.bible'),
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
          tabBarLabel: t('shop.shop'),
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
          tabBarLabel: 'Games',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: t('profile.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
        listeners={hapticListeners}
      />
    </Tab.Navigator>
  );
}
