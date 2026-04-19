import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamesStackParamList } from "@/types/navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import GamesListScreen from "@/features/games/screens/GamesListScreen";
import TicTacToeScreen from "@/features/games/screens/TicTacToeScreen";
import BibleCrosswordScreen from "@/features/games/screens/BibleCrosswordScreen";
import BibleQuizScreen from "@/features/games/screens/BibleQuizScreen";
import FindDifferenceScreen from "@/features/games/screens/FindDifferenceScreen";

const Stack = createNativeStackNavigator<GamesStackParamList>();

export default function GamesStackNavigator() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
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
