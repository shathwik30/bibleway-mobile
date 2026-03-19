import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnimatedPressable from '@/components/ui/AnimatedPressable';

interface GameItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  players: string;
}

const GAMES: GameItem[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'The classic game of crosses and circles. Play solo against the computer or with a friend!',
    icon: 'grid-outline',
    screen: 'TicTacToe',
    players: '1-2 Players',
  },
  {
    id: 'bible-crossword',
    title: 'Bible Crossword',
    description: 'Solve clues about biblical places and fill the crossword grid. Hints available!',
    icon: 'extension-puzzle-outline',
    screen: 'BibleCrossword',
    players: '1 Player',
  },
  {
    id: 'bible-quiz',
    title: 'Bible Quiz',
    description: 'Read Bible stories and answer comprehension questions. 30 levels from Creation to the Great Commission!',
    icon: 'help-circle-outline',
    screen: 'BibleQuiz',
    players: '1 Player',
  },
  {
    id: 'find-difference',
    title: 'Find the Difference',
    description: 'Spot the hidden differences between two Bible-themed pictures. 30 levels!',
    icon: 'eye-outline',
    screen: 'FindDifference',
    players: '1 Player',
  },
];

function GameCard({ game }: { game: GameItem }) {
  const navigation = useNavigation<any>();

  return (
    <AnimatedPressable
      onPress={() => navigation.navigate(game.screen)}
      className="mx-4 mb-3 p-4 rounded-xl border border-border bg-white flex-row items-center"
    >
      <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center mr-4">
        <Ionicons name={game.icon} size={28} color="#4A6FA5" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-textPrimary">
          {game.title}
        </Text>
        <Text className="text-sm text-textSecondary mt-0.5" numberOfLines={2}>
          {game.description}
        </Text>
        <View className="flex-row items-center mt-1.5">
          <Ionicons name="people-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-textSecondary ml-1">
            {game.players}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </AnimatedPressable>
  );
}

export default function GamesListScreen() {
  return (
    <SafeAreaScreen>
      <ScreenHeader title="Games" showBack={false} />
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, flexGrow: 1 }}
        renderItem={({ item }) => <GameCard game={item} />}
        ListHeaderComponent={
          <View className="px-4 pb-3">
            <Text className="text-sm text-textSecondary">
              Rejoice and have fun with these games
            </Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
