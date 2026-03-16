import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface Tab {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View className="flex-row border-b border-border">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          className={`flex-1 items-center py-3 ${
            activeTab === tab.key ? 'border-b-2 border-primary' : ''
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === tab.key ? 'text-primary' : 'text-textSecondary'
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
