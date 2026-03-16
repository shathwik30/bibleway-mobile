import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BibleStackParamList } from '@/types/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import BibleTabsScreen from '@/screens/bible/BibleTabsScreen';
import BibleVersionSelectScreen from '@/screens/bible/BibleVersionSelectScreen';
import BibleBookListScreen from '@/screens/bible/BibleBookListScreen';
import BibleChapterListScreen from '@/screens/bible/BibleChapterListScreen';
import BibleVerseScreen from '@/screens/bible/BibleVerseScreen';
import SegregatedSectionsScreen from '@/screens/bible/SegregatedSectionsScreen';
import SegregatedChaptersScreen from '@/screens/bible/SegregatedChaptersScreen';
import SegregatedPagesScreen from '@/screens/bible/SegregatedPagesScreen';
import SegregatedPageDetailScreen from '@/screens/bible/SegregatedPageDetailScreen';
import BookmarksScreen from '@/screens/bible/BookmarksScreen';
import NotesScreen from '@/screens/bible/NotesScreen';
import BibleSearchScreen from '@/screens/bible/BibleSearchScreen';

const Stack = createNativeStackNavigator<BibleStackParamList>();

export default function BibleStackNavigator() {
  return (
    <ErrorBoundary>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="BibleTabs" component={BibleTabsScreen} />
      <Stack.Screen name="BibleVersionSelect" component={BibleVersionSelectScreen} />
      <Stack.Screen name="BibleBookList" component={BibleBookListScreen} />
      <Stack.Screen name="BibleChapterList" component={BibleChapterListScreen} />
      <Stack.Screen name="BibleVerse" component={BibleVerseScreen} />
      <Stack.Screen name="SegregatedSections" component={SegregatedSectionsScreen} />
      <Stack.Screen name="SegregatedChapters" component={SegregatedChaptersScreen} />
      <Stack.Screen name="SegregatedPages" component={SegregatedPagesScreen} />
      <Stack.Screen name="SegregatedPageDetail" component={SegregatedPageDetailScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="BibleSearch" component={BibleSearchScreen} />
    </Stack.Navigator>
    </ErrorBoundary>
  );
}
