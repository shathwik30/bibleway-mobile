import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useAppStore } from '@/stores/appStore';

// ── Types ──────────────────────────────────────────────
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];
type GameMode = '1P' | '2P';

// ── Constants ──────────────────────────────────────────
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const VICTORY_VERSES = [
  '"I can do all things through Christ who strengthens me." — Philippians 4:13',
  '"The Lord is my strength and my shield." — Psalm 28:7',
  '"Be strong and courageous." — Joshua 1:9',
  '"With God all things are possible." — Matthew 19:26',
  '"The joy of the Lord is your strength." — Nehemiah 8:10',
];

const DRAW_VERSES = [
  '"Let us not grow weary of doing good." — Galatians 6:9',
  '"Iron sharpens iron, so one person sharpens another." — Proverbs 27:17',
  '"Two are better than one." — Ecclesiastes 4:9',
];

// ── AI (minimax) ───────────────────────────────────────
function getWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  return null;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const result = getWinner(board);
  if (result) return result.winner === 'O' ? 10 : -10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function getRandomVerse(verses: string[]) {
  return verses[Math.floor(Math.random() * verses.length)];
}

// ── Cell Button ────────────────────────────────────────
function CellButton({
  value,
  onPress,
  isWinning,
  disabled,
}: {
  value: Cell;
  onPress: () => void;
  isWinning: boolean;
  disabled: boolean;
}) {
  const bgClass = isWinning
    ? 'bg-primary/20 dark:bg-primary/30'
    : 'bg-surface dark:bg-darkCard';

  return (
    <View className="m-1.5">
      <Pressable
        onPress={() => { if (!value && !disabled) onPress(); }}
        disabled={disabled}
        className={`w-24 h-24 rounded-xl items-center justify-center border border-border dark:border-borderDark ${bgClass}`}
      >
        {value === 'X' && (
          <Ionicons name="add" size={48} color="#4A6FA5" />
        )}
        {value === 'O' && (
          <Ionicons name="star" size={36} color="#D4A373" />
        )}
      </Pressable>
    </View>
  );
}

// ── Mode Toggle ────────────────────────────────────────
function ModeToggle({
  mode,
  onToggle,
  isDark,
}: {
  mode: GameMode;
  onToggle: (m: GameMode) => void;
  isDark: boolean;
}) {
  return (
    <View className="flex-row bg-surface dark:bg-darkCard rounded-xl border border-border dark:border-borderDark overflow-hidden mb-5">
      <Pressable
        onPress={() => onToggle('1P')}
        className={`flex-1 flex-row items-center justify-center py-2.5 px-4 ${
          mode === '1P' ? 'bg-primary' : ''
        }`}
      >
        <Ionicons
          name="person-outline"
          size={16}
          color={mode === '1P' ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text
          className={`ml-1.5 text-sm font-semibold ${
            mode === '1P' ? 'text-white' : 'text-textSecondary dark:text-gray-400'
          }`}
        >
          vs Computer
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onToggle('2P')}
        className={`flex-1 flex-row items-center justify-center py-2.5 px-4 ${
          mode === '2P' ? 'bg-primary' : ''
        }`}
      >
        <Ionicons
          name="people-outline"
          size={16}
          color={mode === '2P' ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text
          className={`ml-1.5 text-sm font-semibold ${
            mode === '2P' ? 'text-white' : 'text-textSecondary dark:text-gray-400'
          }`}
        >
          2 Players
        </Text>
      </Pressable>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────
export default function TicTacToeScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const [mode, setMode] = useState<GameMode>('1P');
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [verse, setVerse] = useState('');
  const computerThinking = useRef(false);

  const result = getWinner(board);
  const isDraw = !result && board.every((c) => c !== null);
  const gameOver = !!result || isDraw;

  // Computer move (1P mode)
  useEffect(() => {
    if (mode !== '1P' || currentPlayer !== 'O' || gameOver) return;
    computerThinking.current = true;

    const timer = setTimeout(() => {
      const boardCopy = [...board];
      const move = getBestMove(boardCopy);
      if (move === -1) {
        computerThinking.current = false;
        return;
      }

      const newBoard = [...board];
      newBoard[move] = 'O';
      setBoard(newBoard);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const winResult = getWinner(newBoard);
      if (winResult) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setScores((prev) => ({ ...prev, O: prev.O + 1 }));
        setVerse(getRandomVerse(DRAW_VERSES));
      } else if (newBoard.every((c) => c !== null)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setVerse(getRandomVerse(DRAW_VERSES));
      } else {
        setCurrentPlayer('X');
      }
      computerThinking.current = false;
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPlayer, mode, gameOver, board]);

  const handleCellPress = useCallback(
    (index: number) => {
      if (board[index] || gameOver) return;
      if (mode === '1P' && currentPlayer === 'O') return;
      if (computerThinking.current) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const winResult = getWinner(newBoard);
      if (winResult) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setScores((prev) => ({
          ...prev,
          [winResult.winner]: prev[winResult.winner] + 1,
        }));
        setVerse(getRandomVerse(VICTORY_VERSES));
      } else if (newBoard.every((c) => c !== null)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setVerse(getRandomVerse(DRAW_VERSES));
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    },
    [board, currentPlayer, gameOver, mode]
  );

  const resetGame = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setVerse('');
    computerThinking.current = false;
  }, []);

  const handleModeChange = useCallback((newMode: GameMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(newMode);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setScores({ X: 0, O: 0 });
    setVerse('');
    computerThinking.current = false;
  }, []);

  const resetScores = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setScores({ X: 0, O: 0 });
    setVerse('');
    computerThinking.current = false;
  }, []);

  const youLabel = mode === '1P' ? 'You' : 'Player 1';
  const opponentLabel = mode === '1P' ? 'Computer' : 'Player 2';

  const statusText = result
    ? mode === '1P'
      ? result.winner === 'X'
        ? 'You win! Praise the Lord!'
        : 'Computer wins. Keep the faith!'
      : `Player ${result.winner === 'X' ? '1' : '2'} wins!`
    : isDraw
    ? "It's a draw! Well played!"
    : mode === '1P'
    ? currentPlayer === 'X'
      ? 'Your turn'
      : 'Computer is thinking...'
    : `Player ${currentPlayer === 'X' ? '1' : '2'}'s turn`;

  const isInputDisabled =
    gameOver || (mode === '1P' && currentPlayer === 'O');

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title="Tic Tac Toe"
        rightAction={
          <Pressable onPress={resetScores} className="p-1">
            <Ionicons
              name="refresh-outline"
              size={22}
              color={isDark ? '#E5E7EB' : '#1A1A2E'}
            />
          </Pressable>
        }
      />

      <View className="flex-1 items-center justify-center px-4">
        {/* Mode Toggle */}
        <ModeToggle mode={mode} onToggle={handleModeChange} isDark={isDark} />

        {/* Scoreboard */}
        <View className="flex-row items-center mb-6 bg-white dark:bg-darkCard rounded-xl border border-border dark:border-borderDark overflow-hidden">
          <View className="items-center px-6 py-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="add" size={18} color="#4A6FA5" />
              <Text className="text-xs font-semibold text-primary ml-0.5">
                {youLabel}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-textPrimary dark:text-gray-100">
              {scores.X}
            </Text>
          </View>
          <View className="w-px h-12 bg-border dark:bg-borderDark" />
          <View className="items-center px-5 py-3">
            <Text className="text-sm font-semibold text-textSecondary dark:text-gray-400">
              VS
            </Text>
          </View>
          <View className="w-px h-12 bg-border dark:bg-borderDark" />
          <View className="items-center px-6 py-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="star" size={14} color="#D4A373" />
              <Text className="text-xs font-semibold text-secondary ml-1">
                {opponentLabel}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-textPrimary dark:text-gray-100">
              {scores.O}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View className="mb-4">
          <Text
            className={`text-base font-semibold text-center ${
              result
                ? result.winner === 'X'
                  ? 'text-primary'
                  : 'text-secondary'
                : isDraw
                ? 'text-warning'
                : 'text-textPrimary dark:text-gray-100'
            }`}
          >
            {statusText}
          </Text>
        </View>

        {/* Board */}
        <View className="items-center">
          {[0, 1, 2].map((row) => (
            <View key={row} className="flex-row">
              {[0, 1, 2].map((col) => {
                const index = row * 3 + col;
                return (
                  <CellButton
                    key={index}
                    value={board[index]}
                    onPress={() => handleCellPress(index)}
                    isWinning={result?.line.includes(index) ?? false}
                    disabled={isInputDisabled}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Play Again */}
        {gameOver && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Pressable
              onPress={resetGame}
              className="mt-6 bg-primary rounded-xl px-8 py-3.5"
            >
              <Text className="text-white font-bold text-base">
                Play Again
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Scripture Verse */}
        {gameOver && verse !== '' && (
          <Animated.View entering={FadeIn.delay(200).duration(400)} className="mt-5 mx-4">
            <Text className="text-xs text-center text-textSecondary dark:text-gray-400 italic leading-5">
              {verse}
            </Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaScreen>
  );
}
