import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { COUNTRIES } from "@/data/countries";

interface CountryPickerProps {
  label?: string;
  value: string;
  onChange: (countryName: string) => void;
  error?: string;
}

export default function CountryPicker({
  label,
  value,
  onChange,
  error,
}: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [search]);

  const selectedCountry = COUNTRIES.find((c) => c.name === value);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textPrimary mb-1.5">
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        className={`flex-row items-center justify-between rounded-xl px-3 py-3 ${
          error ? "bg-error-container" : "bg-surfaceContainerHigh"
        }`}
      >
        <Text
          className={`text-base ${value ? "text-textPrimary" : "text-gray-400"}`}
        >
          {selectedCountry
            ? `${selectedCountry.flag}  ${selectedCountry.name}`
            : "Select country..."}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 bg-black/40"
        />
        <View className="bg-surfaceContainerLowest rounded-t-2xl" style={{ maxHeight: "70%" }}>
          <View className="px-4 py-3 bg-surfaceContainerLow">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-textPrimary">
                Select Country
              </Text>
              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-surfaceContainerHigh rounded-xl px-3 py-2">
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.textSecondary}
              />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search countries..."
                placeholderTextColor={colors.textTertiary}
                className="flex-1 ml-2 text-base text-textPrimary"
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.name);
                  setSearch("");
                  setVisible(false);
                }}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  value === item.name ? "bg-primary/5" : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-xl mr-3">{item.flag}</Text>
                  <Text
                    className={`text-base ${
                      value === item.name
                        ? "text-primary font-semibold"
                        : "text-textPrimary"
                    }`}
                  >
                    {item.name}
                  </Text>
                </View>
                {value === item.name && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary.DEFAULT}
                  />
                )}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

export { COUNTRIES };
