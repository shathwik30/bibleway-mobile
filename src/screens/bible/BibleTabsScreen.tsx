import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import { colors } from '@/theme/colors';
import BibleVersionSelectScreen from './BibleVersionSelectScreen';
import SegregatedSectionsScreen from './SegregatedSectionsScreen';

const TopTab = createMaterialTopTabNavigator();

export default function BibleTabsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaScreen>
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: colors.primary.DEFAULT },
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <TopTab.Screen
          name="BibleTab"
          component={BibleVersionSelectScreen}
          options={{ tabBarLabel: t('bible.bible') }}
        />
        <TopTab.Screen
          name="StudyTab"
          component={SegregatedSectionsScreen}
          options={{ tabBarLabel: t('bible.study') }}
        />
      </TopTab.Navigator>
    </SafeAreaScreen>
  );
}
