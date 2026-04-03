import React from "react";
import { View, Pressable, Text } from "react-native";

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
    <View className="flex-row bg-surfaceContainerLow">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          className={`flex-1 items-center py-3 ${
            activeTab === tab.key ? "border-b-2 border-primary" : ""
          }`}
        >
          <Text
            className={`text-sm ${
              activeTab === tab.key ? "text-primary" : "text-textSecondary"
            }`}
            style={{
              fontFamily:
                activeTab === tab.key
                  ? "Inter_600SemiBold"
                  : "Inter_500Medium",
            }}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
