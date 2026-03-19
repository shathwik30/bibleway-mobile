import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GamesStackParamList } from '@/types/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import GamesListScreen from '@/screens/games/GamesListScreen';
import TicTacToeScreen from '@/screens/games/TicTacToeScreen';
import BibleCrosswordScreen from '@/screens/games/BibleCrosswordScreen';
import BibleQuizScreen from '@/screens/games/BibleQuizScreen';
import FindDifferenceScreen from '@/screens/games/FindDifferenceScreen';

const Stack = createNativeStackNavigator<GamesStackParamList>();

export default function GamesStackNavigator() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="GamesList" component={GamesListScreen} />
        <Stack.Screen name="TicTacToe" component={TicTacToeScreen} />
        <Stack.Screen name="BibleCrossword" component={BibleCrosswordScreen} />
        <Stack.Screen name="BibleQuiz" component={BibleQuizScreen} />
        <Stack.Screen name="FindDifference" component={FindDifferenceScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
