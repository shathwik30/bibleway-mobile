import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { useAppStore } from "@/stores/appStore";
import { showToast } from "@/components/ui/Toast";

const BUNDLED_CODES = new Set(["en", "es", "fr", "pt", "hi", "ar", "sw"]);

export default function LanguageSettingsScreen() {
  const currentLanguage = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [search, setSearch] = useState("");
  const [loadingLang, setLoadingLang] = useState<string | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return SUPPORTED_LANGUAGES;
    const q = search.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSelectLanguage = (langCode: string) => {
    const langName =
      SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.name || langCode;

    if (!BUNDLED_CODES.has(langCode)) {
      setLoadingLang(langCode);
      setLanguage(langCode);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => setLoadingLang(null), 3000);
    } else {
      setLanguage(langCode);
    }

    showToast("success", "Language Changed", `Language set to ${langName}`);
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Language" />

      <View className="mx-4 mt-2 mb-3 bg-surfaceContainerHigh rounded-xl flex-row items-center px-3">
        <Ionicons name="search" size={18} color="#897173" />
        <TextInput
          className="flex-1 py-2.5 px-2 text-sm text-textPrimary"
          placeholder="Search languages..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#897173" />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectLanguage(item.code)}
            className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${
              currentLanguage === item.code ? "bg-primary/5" : "bg-surfaceContainerLowest"
            }`}
          >
            <View className="flex-1 mr-3">
              <Text className="text-base text-textPrimary font-medium">
                {item.name}
              </Text>
              <Text className="text-xs text-textSecondary">
                {item.nativeName}
              </Text>
            </View>
            {loadingLang === item.code ? (
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            ) : currentLanguage === item.code ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary.DEFAULT}
              />
            ) : null}
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-10">
            <Text className="text-sm text-textSecondary">
              No languages found
            </Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
