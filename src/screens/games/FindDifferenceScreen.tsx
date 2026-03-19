import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  ZoomIn,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { FTD_LEVELS } from '@/constants/findDifferenceLevels';
import { mmkvStorage } from '@/lib/storage';

// ─── Storage ─────────────────────────────────────────────────────
const STORAGE_UNLOCKED = 'ftd_unlocked_level';
const STORAGE_COMPLETED = 'ftd_completed_levels';

function loadUnlocked(): number {
  return mmkvStorage.getNumber(STORAGE_UNLOCKED) ?? 1;
}
function saveUnlocked(n: number) {
  mmkvStorage.setNumber(STORAGE_UNLOCKED, n);
}
function loadCompleted(): Set<number> {
  const raw = mmkvStorage.getString(STORAGE_COMPLETED);
  if (!raw) return new Set();
  try { return new Set(JSON.parse(raw) as number[]); } catch { return new Set(); }
}
function saveCompleted(s: Set<number>) {
  mmkvStorage.setString(STORAGE_COMPLETED, JSON.stringify([...s]));
}

// ─── Shuffle helper ──────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Image map ───────────────────────────────────────────────────
const IMG1_MAP: Record<number, any> = {
  1: require('../../../assets/find-the-difference/lvl1_img1.png'),
  2: require('../../../assets/find-the-difference/lvl2_img1.png'),
  3: require('../../../assets/find-the-difference/lvl3_img1.png'),
  4: require('../../../assets/find-the-difference/lvl4_img1.png'),
  5: require('../../../assets/find-the-difference/lvl5_img1.png'),
  6: require('../../../assets/find-the-difference/lvl6_img1.png'),
  7: require('../../../assets/find-the-difference/lvl7_img1.png'),
  8: require('../../../assets/find-the-difference/lvl8_img1.png'),
  9: require('../../../assets/find-the-difference/lvl9_img1.png'),
  10: require('../../../assets/find-the-difference/lvl10_img1.png'),
  11: require('../../../assets/find-the-difference/lvl11_img1.png'),
  12: require('../../../assets/find-the-difference/lvl12_img1.png'),
  13: require('../../../assets/find-the-difference/lvl13_img1.png'),
  14: require('../../../assets/find-the-difference/lvl14_img1.png'),
  15: require('../../../assets/find-the-difference/lvl15_img1.png'),
  16: require('../../../assets/find-the-difference/lvl16_img1.png'),
  17: require('../../../assets/find-the-difference/lvl17_img1.png'),
  18: require('../../../assets/find-the-difference/lvl18_img1.png'),
  19: require('../../../assets/find-the-difference/lvl19_img1.png'),
  20: require('../../../assets/find-the-difference/lvl20_img1.png'),
  21: require('../../../assets/find-the-difference/lvl21_img1.png'),
  22: require('../../../assets/find-the-difference/lvl22_img1.png'),
  23: require('../../../assets/find-the-difference/lvl23_img1.png'),
  24: require('../../../assets/find-the-difference/lvl24_img1.png'),
  25: require('../../../assets/find-the-difference/lvl25_img1.png'),
  26: require('../../../assets/find-the-difference/lvl26_img1.png'),
  27: require('../../../assets/find-the-difference/lvl27_img1.png'),
  28: require('../../../assets/find-the-difference/lvl28_img1.png'),
  29: require('../../../assets/find-the-difference/lvl29_img1.png'),
  30: require('../../../assets/find-the-difference/lvl30_img1.png'),
};

const IMG2_MAP: Record<number, any> = {
  1: require('../../../assets/find-the-difference/lvl1_img2.png'),
  2: require('../../../assets/find-the-difference/lvl2_img2.png'),
  3: require('../../../assets/find-the-difference/lvl3_img2.png'),
  4: require('../../../assets/find-the-difference/lvl4_img2.png'),
  5: require('../../../assets/find-the-difference/lvl5_img2.png'),
  6: require('../../../assets/find-the-difference/lvl6_img2.png'),
  7: require('../../../assets/find-the-difference/lvl7_img2.png'),
  8: require('../../../assets/find-the-difference/lvl8_img2.png'),
  9: require('../../../assets/find-the-difference/lvl9_img2.png'),
  10: require('../../../assets/find-the-difference/lvl10_img2.png'),
  11: require('../../../assets/find-the-difference/lvl11_img2.png'),
  12: require('../../../assets/find-the-difference/lvl12_img2.png'),
  13: require('../../../assets/find-the-difference/lvl13_img2.png'),
  14: require('../../../assets/find-the-difference/lvl14_img2.png'),
  15: require('../../../assets/find-the-difference/lvl15_img2.png'),
  16: require('../../../assets/find-the-difference/lvl16_img2.png'),
  17: require('../../../assets/find-the-difference/lvl17_img2.png'),
  18: require('../../../assets/find-the-difference/lvl18_img2.png'),
  19: require('../../../assets/find-the-difference/lvl19_img2.png'),
  20: require('../../../assets/find-the-difference/lvl20_img2.png'),
  21: require('../../../assets/find-the-difference/lvl21_img2.png'),
  22: require('../../../assets/find-the-difference/lvl22_img2.png'),
  23: require('../../../assets/find-the-difference/lvl23_img2.png'),
  24: require('../../../assets/find-the-difference/lvl24_img2.png'),
  25: require('../../../assets/find-the-difference/lvl25_img2.png'),
  26: require('../../../assets/find-the-difference/lvl26_img2.png'),
  27: require('../../../assets/find-the-difference/lvl27_img2.png'),
  28: require('../../../assets/find-the-difference/lvl28_img2.png'),
  29: require('../../../assets/find-the-difference/lvl29_img2.png'),
  30: require('../../../assets/find-the-difference/lvl30_img2.png'),
};

const IMG_ASPECT = 1024 / 1536; // 2:3 height:width

// ─── Level Select ────────────────────────────────────────────────
function LevelSelect({
  unlockedLevel,
  completedLevels,
  onSelectLevel,
}: {
  unlockedLevel: number;
  completedLevels: Set<number>;
  onSelectLevel: (id: number) => void;
}) {
  return (
    <SafeAreaScreen>
      <ScreenHeader title="Find the Difference" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-textSecondary text-center mb-4">
          Compare two pictures and pick the differences from the options
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {FTD_LEVELS.map((level, i) => {
            const locked = level.id > unlockedLevel;
            const completed = completedLevels.has(level.id);

            return (
              <Animated.View
                key={level.id}
                entering={FadeInDown.delay(i * 30).springify()}
                style={{ width: '31%' }}
              >
                <Pressable
                  onPress={() => !locked && onSelectLevel(level.id)}
                  disabled={locked}
                  style={{
                    opacity: locked ? 0.4 : 1,
                    aspectRatio: 1,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: completed ? '#22C55E' : locked ? '#E5E7EB' : '#4A6FA5',
                    backgroundColor: completed ? '#ECFDF5' : '#F8F9FA',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {completed ? (
                    <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
                  ) : locked ? (
                    <Ionicons name="lock-closed" size={24} color="#9CA3AF" />
                  ) : (
                    <Text className="text-xl font-bold text-primary">{level.id}</Text>
                  )}
                  <Text
                    className="text-xs font-semibold mt-1"
                    style={{ color: completed ? '#22C55E' : locked ? '#9CA3AF' : '#4A6FA5' }}
                  >
                    {level.title}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function FindDifferenceScreen() {
  const navigation = useNavigation();
  const { width: SW } = useWindowDimensions();

  const [screen, setScreen] = useState<'levels' | 'game' | 'result'>('levels');
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlocked());
  const [completedLevels, setCompletedLevels] = useState(() => loadCompleted());

  // Game state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [zoomImg, setZoomImg] = useState<number | null>(null); // 1 or 2 or null

  const level = FTD_LEVELS[levelId - 1];
  const correctSet = useMemo(() => new Set(level.correct), [levelId]);

  // Shuffled options — memoized per level
  const options = useMemo(
    () => shuffle([...level.correct, ...level.wrong]),
    [levelId],
  );

  const imgWidth = SW - 32;
  const imgHeight = imgWidth * IMG_ASPECT;

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setSelected(new Set());
    setSubmitted(false);
    setScreen('game');
  }, []);

  const toggleOption = useCallback(
    (option: string) => {
      if (submitted) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(option)) {
          next.delete(option);
        } else {
          next.add(option);
        }
        return next;
      });
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitted(true);

    // Check if all correct selected and no wrong selected
    const allCorrect = level.correct.every((c) => selected.has(c));
    const noWrong = level.wrong.every((w) => !selected.has(w));

    if (allCorrect && noWrong) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCompletedLevels((p) => {
        const next = new Set([...p, levelId]);
        saveCompleted(next);
        return next;
      });
      if (levelId >= unlockedLevel) {
        const next = Math.min(levelId + 1, FTD_LEVELS.length);
        setUnlockedLevel(next);
        saveUnlocked(next);
      }
      setTimeout(() => setScreen('result'), 1200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [submitted, selected, level, levelId, unlockedLevel]);

  const correctCount = useMemo(() => {
    let count = 0;
    selected.forEach((s) => { if (correctSet.has(s)) count++; });
    return count;
  }, [selected, correctSet]);

  // ── Level Select ──────────────────────────────────────────
  if (screen === 'levels') {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        onSelectLevel={startLevel}
      />
    );
  }

  // ── Result ────────────────────────────────────────────────
  if (screen === 'result') {
    const isLastLevel = levelId >= FTD_LEVELS.length;
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Find the Difference" showBack={false} />
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View entering={ZoomIn.springify()} className="items-center">
            <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
              <Ionicons name="eye" size={40} color="#22C55E" />
            </View>
            <Text className="text-xl font-bold text-textPrimary mb-1">Well Done!</Text>
            <Text className="text-sm text-textSecondary mb-6">
              You found all {level.correct.length} differences
            </Text>

            {!isLastLevel && (
              <Pressable
                onPress={() => startLevel(levelId + 1)}
                className="bg-primary rounded-2xl py-4 mb-3 flex-row items-center justify-center"
                style={{ width: SW - 80, gap: 8 }}
              >
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                <Text className="text-white font-bold text-base">Next Level</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => startLevel(levelId)}
              className="rounded-2xl py-4 mb-3 border border-border flex-row items-center justify-center"
              style={{ width: SW - 80, gap: 8 }}
            >
              <Ionicons name="refresh-outline" size={18} color="#6B7280" />
              <Text className="text-textSecondary font-semibold">Play Again</Text>
            </Pressable>

            <Pressable onPress={() => setScreen('levels')} className="py-3">
              <Text className="text-primary font-semibold">All Levels</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaScreen>
    );
  }

  // ── Option styling ────────────────────────────────────────
  const getOptionStyle = (option: string) => {
    const isSelected = selected.has(option);
    const isCorrect = correctSet.has(option);

    if (!submitted) {
      return {
        borderColor: isSelected ? '#4A6FA5' : '#E5E7EB',
        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
        iconColor: isSelected ? '#4A6FA5' : '#D1D5DB',
        iconName: isSelected ? 'checkbox' as const : 'square-outline' as const,
        textColor: isSelected ? '#4A6FA5' : '#1A1A2E',
      };
    }

    // After submit
    if (isCorrect && isSelected) {
      return { borderColor: '#22C55E', backgroundColor: '#ECFDF5', iconColor: '#22C55E', iconName: 'checkmark-circle' as const, textColor: '#166534' };
    }
    if (isCorrect && !isSelected) {
      // Missed correct answer
      return { borderColor: '#F59E0B', backgroundColor: '#FEF3C7', iconColor: '#F59E0B', iconName: 'alert-circle' as const, textColor: '#92400E' };
    }
    if (!isCorrect && isSelected) {
      // Wrong selection
      return { borderColor: '#EF4444', backgroundColor: '#FEF2F2', iconColor: '#EF4444', iconName: 'close-circle' as const, textColor: '#991B1B' };
    }
    // Not correct, not selected — neutral
    return { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', iconColor: '#D1D5DB', iconName: 'square-outline' as const, textColor: '#6B7280' };
  };

  // ── Game Screen ───────────────────────────────────────────
  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={`Level ${levelId}`}
        rightAction={
          <Text className="text-sm font-bold text-primary">
            {correctCount}/{level.correct.length}
          </Text>
        }
      />

      {/* Zoom Modal */}
      <Modal visible={zoomImg !== null} transparent animationType="fade" onRequestClose={() => setZoomImg(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)' }}>
          <View style={{ position: 'absolute', top: 50, right: 16, zIndex: 10 }}>
            <Pressable
              onPress={() => setZoomImg(null)}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={{ position: 'absolute', top: 56, left: 0, right: 0, zIndex: 10 }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: 13, fontWeight: '600' }}>
              Pinch to zoom · Image {zoomImg}
            </Text>
          </View>
          <ReactNativeZoomableView
            maxZoom={4}
            minZoom={1}
            initialZoom={1}
            bindToBorders
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={zoomImg === 1 ? IMG1_MAP[levelId] : IMG2_MAP[levelId]}
              style={{ width: SW, height: SW * IMG_ASPECT }}
              resizeMode="contain"
            />
          </ReactNativeZoomableView>
        </View>
      </Modal>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image 1 — stacked full width */}
        <View className="px-4 mb-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold text-textSecondary">Image 1</Text>
            <Pressable
              onPress={() => setZoomImg(1)}
              className="flex-row items-center"
              style={{ gap: 3 }}
            >
              <Ionicons name="expand-outline" size={14} color="#4A6FA5" />
              <Text className="text-xs font-semibold text-primary">Zoom</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setZoomImg(1)}>
            <Image
              source={IMG1_MAP[levelId]}
              style={{
                width: imgWidth,
                height: imgHeight,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
              }}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        {/* Image 2 — stacked full width */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold text-textSecondary">Image 2</Text>
            <Pressable
              onPress={() => setZoomImg(2)}
              className="flex-row items-center"
              style={{ gap: 3 }}
            >
              <Ionicons name="expand-outline" size={14} color="#4A6FA5" />
              <Text className="text-xs font-semibold text-primary">Zoom</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setZoomImg(2)}>
            <Image
              source={IMG2_MAP[levelId]}
              style={{
                width: imgWidth,
                height: imgHeight,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
              }}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        {/* Instructions */}
        <View className="px-4 mb-3">
          <Text className="text-sm text-textSecondary text-center">
            Select the {level.correct.length} items that are different between the images
          </Text>
        </View>

        {/* Options */}
        <View className="px-4" style={{ gap: 8 }}>
          {options.map((option, i) => {
            const style = getOptionStyle(option);
            return (
              <Animated.View
                key={`${levelId}-${option}`}
                entering={FadeInDown.delay(i * 60).springify()}
              >
                <Pressable
                  onPress={() => toggleOption(option)}
                  disabled={submitted}
                  className="flex-row items-center p-4 rounded-2xl"
                  style={{
                    borderWidth: 2,
                    borderColor: style.borderColor,
                    backgroundColor: style.backgroundColor,
                    gap: 12,
                  }}
                >
                  <Ionicons name={style.iconName} size={24} color={style.iconColor} />
                  <Text
                    className="text-base font-semibold flex-1"
                    style={{ color: style.textColor }}
                  >
                    {option}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Submit / Retry */}
        <View className="px-4 mt-5">
          {!submitted ? (
            <Pressable
              onPress={handleSubmit}
              disabled={selected.size === 0}
              style={{ opacity: selected.size === 0 ? 0.4 : 1 }}
              className="h-14 rounded-2xl bg-primary items-center justify-center"
            >
              <Text className="text-base font-bold text-white">Check Answers</Text>
            </Pressable>
          ) : (
            <View style={{ gap: 10 }}>
              {/* Show if wrong */}
              {!(level.correct.every((c) => selected.has(c)) && level.wrong.every((w) => !selected.has(w))) && (
                <>
                  <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
                    <Text className="text-sm text-red-800 text-center font-semibold">
                      Not quite right! Check the highlighted answers above.
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => startLevel(levelId)}
                    className="h-14 rounded-2xl bg-primary items-center justify-center"
                  >
                    <Text className="text-base font-bold text-white">Try Again</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
