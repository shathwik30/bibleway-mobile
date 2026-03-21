import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import ReadAloudControls from '@/components/bible/ReadAloudControls';
import { useBibleChapterContent } from '@/hooks/useBible';
import { translateText } from '@/lib/translate';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import type { BibleStackParamList } from '@/types/navigation';

export default function BibleVerseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BibleStackParamList, 'BibleVerse'>>();
  const { bibleId, chapterId } = route.params;
  const { data: chapter, isLoading } = useBibleChapterContent(bibleId, chapterId);

  const [selectedLang, setSelectedLang] = useState('en');
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const content = typeof chapter?.content === 'string' ? chapter.content : '';
  const displayContent = translatedContent ?? content;
  const title = chapter?.reference || chapterId;

  // Translate when language changes
  useEffect(() => {
    if (selectedLang === 'en' || !content) {
      setTranslatedContent(null);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    translateText(content, selectedLang, 'en')
      .then((result) => {
        if (!cancelled) setTranslatedContent(result);
      })
      .catch(() => {
        if (!cancelled) setTranslatedContent(null);
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => { cancelled = true; };
  }, [content, selectedLang]);

  // Reset translation when chapter changes
  useEffect(() => {
    setSelectedLang('en');
    setTranslatedContent(null);
  }, [chapterId]);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={chapterId} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={title}
        rightAction={
          <Pressable
            onPress={() => setShowLangPicker(!showLangPicker)}
            className="flex-row items-center px-3 py-1.5 bg-surface rounded-full"
          >
            <Ionicons name="language" size={16} color="#4A6FA5" />
            <Text className="text-xs text-primary ml-1 font-medium">
              {currentLang?.code.toUpperCase() || 'EN'}
            </Text>
          </Pressable>
        }
      />

      {/* Language picker modal */}
      <LanguagePickerModal
        visible={showLangPicker}
        selectedCode={selectedLang}
        searchQuery={langSearch}
        onSearchChange={setLangSearch}
        onSelect={(code) => {
          setSelectedLang(code);
          setShowLangPicker(false);
          setLangSearch('');
        }}
        onClose={() => {
          setShowLangPicker(false);
          setLangSearch('');
        }}
      />

      {isTranslating && (
        <View className="flex-row items-center justify-center py-2 bg-primary/5">
          <ActivityIndicator size="small" color="#4A6FA5" />
          <Text className="text-xs text-primary ml-2">
            Translating to {currentLang?.name}...
          </Text>
        </View>
      )}

      <ScrollView className="flex-1 px-4 pt-4">
        {chapter?.copyright ? (
          <Text className="text-xs text-textTertiary mb-3">{chapter.copyright}</Text>
        ) : null}

        <Text
          className="text-base text-textPrimary leading-7"
          style={currentLang?.rtl ? { writingDirection: 'rtl', textAlign: 'right' } : undefined}
        >
          {displayContent || 'No content available'}
        </Text>

        {/* Chapter navigation */}
        <View className="flex-row justify-between items-center mt-6 mb-4">
          {chapter?.previous ? (
            <Pressable
              onPress={() => navigation.setParams({ chapterId: chapter.previous!.id })}
              className="flex-row items-center px-4 py-2 bg-surface rounded-xl"
            >
              <Ionicons name="chevron-back" size={18} color="#4A6FA5" />
              <Text className="text-sm text-primary ml-1">Previous</Text>
            </Pressable>
          ) : <View />}
          {chapter?.next ? (
            <Pressable
              onPress={() => navigation.setParams({ chapterId: chapter.next!.id })}
              className="flex-row items-center px-4 py-2 bg-surface rounded-xl"
            >
              <Text className="text-sm text-primary mr-1">Next</Text>
              <Ionicons name="chevron-forward" size={18} color="#4A6FA5" />
            </Pressable>
          ) : <View />}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Read Aloud bar — white background */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3">
        <ReadAloudControls text={displayContent} language={selectedLang} />
      </View>
    </SafeAreaScreen>
  );
}

// ── Searchable language picker modal ──

function LanguagePickerModal({
  visible,
  selectedCode,
  searchQuery,
  onSearchChange,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedCode: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORTED_LANGUAGES;
    const q = searchQuery.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[75%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-lg font-bold text-textPrimary">Select Language</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="mx-5 mb-3 bg-gray-100 rounded-xl flex-row items-center px-3">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-2.5 px-2 text-sm text-textPrimary"
              placeholder="Search languages..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus
            />
          </View>

          {/* Language list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item.code)}
                className={`flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100 ${
                  selectedCode === item.code ? 'bg-primary/5' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-sm text-textPrimary font-medium">{item.name}</Text>
                  <Text className="text-xs text-textSecondary">{item.nativeName}</Text>
                </View>
                {selectedCode === item.code && (
                  <Ionicons name="checkmark-circle" size={20} color="#4A6FA5" />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center pt-10">
                <Text className="text-sm text-textSecondary">No languages found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
