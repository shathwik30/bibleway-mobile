import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BibleStackParamList } from "@/types/navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import BibleTabsScreen from "@/features/bible/screens/BibleTabsScreen";
import BibleVersionSelectScreen from "@/features/bible/screens/BibleVersionSelectScreen";
import BibleBookListScreen from "@/features/bible/screens/BibleBookListScreen";
import BibleChapterListScreen from "@/features/bible/screens/BibleChapterListScreen";
import BibleVerseScreen from "@/features/bible/screens/BibleVerseScreen";
import SegregatedSectionsScreen from "@/features/bible/screens/SegregatedSectionsScreen";
import SegregatedChaptersScreen from "@/features/bible/screens/SegregatedChaptersScreen";
import SegregatedPagesScreen from "@/features/bible/screens/SegregatedPagesScreen";
import SegregatedPageDetailScreen from "@/features/bible/screens/SegregatedPageDetailScreen";
import BookmarksScreen from "@/features/bible/screens/BookmarksScreen";
import NotesScreen from "@/features/bible/screens/NotesScreen";
import BibleSearchScreen from "@/features/bible/screens/BibleSearchScreen";

const Stack = createNativeStackNavigator<BibleStackParamList>();

export default function BibleStackNavigator() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="BibleTabs" component={BibleTabsScreen} />
        <Stack.Screen
          name="BibleVersionSelect"
          component={BibleVersionSelectScreen}
        />
        <Stack.Screen name="BibleBookList" component={BibleBookListScreen} />
        <Stack.Screen
          name="BibleChapterList"
          component={BibleChapterListScreen}
        />
        <Stack.Screen name="BibleVerse" component={BibleVerseScreen} />
        <Stack.Screen
          name="SegregatedSections"
          component={SegregatedSectionsScreen}
        />
        <Stack.Screen
          name="SegregatedChapters"
          component={SegregatedChaptersScreen}
        />
        <Stack.Screen
          name="SegregatedPages"
          component={SegregatedPagesScreen}
        />
        <Stack.Screen
          name="SegregatedPageDetail"
          component={SegregatedPageDetailScreen}
        />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="BibleSearch" component={BibleSearchScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
