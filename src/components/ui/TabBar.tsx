import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

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
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={`flex-1 items-center py-3 ${
              isActive ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`text-sm ${isActive ? "text-primary" : "text-textSecondary"}`}
              style={isActive ? styles.labelActive : styles.labelInactive}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  labelActive: { fontFamily: "Inter_600SemiBold" },
  labelInactive: { fontFamily: "Inter_500Medium" },
});
