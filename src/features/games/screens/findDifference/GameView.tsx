import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { FTDLevel } from "@/features/games/data/findDifferenceLevels";
import { IMG1_MAP, IMG2_MAP, IMG_ASPECT } from "./imageMap";
import { getOptionStyle } from "./optionStyle";
import ZoomModal from "./ZoomModal";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

interface GameViewProps {
  level: FTDLevel;
  levelId: number;
  onSolved: () => void;
  onRetry: () => void;
}

export default function GameView({
  level,
  levelId,
  onSolved,
  onRetry,
}: GameViewProps) {
  const { width: SW } = useWindowDimensions();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [zoomImg, setZoomImg] = useState<number | null>(null);

  const correctSet = useMemo(() => new Set(level.correct), [level]);
  const options = useMemo(
    () => shuffle([...level.correct, ...level.wrong]),
    [level],
  );

  const imgWidth = SW - 32;
  const imgHeight = imgWidth * IMG_ASPECT;

  const toggleOption = useCallback(
    (option: string): void => {
      if (submitted) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        return next;
      });
    },
    [submitted],
  );

  const handleSubmit = useCallback((): void => {
    if (submitted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitted(true);

    const allCorrect = level.correct.every((c) => selected.has(c));
    const noWrong = level.wrong.every((w) => !selected.has(w));

    if (allCorrect && noWrong) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(onSolved, 1200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [submitted, selected, level, onSolved]);

  const correctCount = useMemo(() => {
    let count = 0;
    selected.forEach((s) => {
      if (correctSet.has(s)) count++;
    });
    return count;
  }, [selected, correctSet]);

  const allCorrect = submitted
    ? level.correct.every((c) => selected.has(c)) &&
      level.wrong.every((w) => !selected.has(w))
    : false;

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

      <ZoomModal
        visible={zoomImg !== null}
        imageNumber={zoomImg}
        source={zoomImg === 1 ? IMG1_MAP[levelId] : IMG2_MAP[levelId]}
        onClose={() => setZoomImg(null)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2].map((num) => (
          <View key={num} className="px-4 mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-textSecondary">
                Image {num}
              </Text>
              <Pressable
                onPress={() => setZoomImg(num)}
                accessibilityLabel={`Zoom image ${num}`}
                accessibilityRole="button"
                className="flex-row items-center"
                style={styles.zoomTrigger}
              >
                <Ionicons
                  name="expand-outline"
                  size={14}
                  color={colors.primary.DEFAULT}
                />
                <Text className="text-xs font-semibold text-primary">Zoom</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => setZoomImg(num)}
              accessibilityLabel={`Open image ${num} in zoom view`}
              accessibilityRole="imagebutton"
            >
              <Image
                source={num === 1 ? IMG1_MAP[levelId] : IMG2_MAP[levelId]}
                style={[styles.image, { width: imgWidth, height: imgHeight }]}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        ))}

        <View className="px-4 mb-3">
          <Text className="text-sm text-textSecondary text-center">
            Select the {level.correct.length} items that are different between
            the images
          </Text>
        </View>

        <View className="px-4" style={styles.optionsList}>
          {options.map((option, i) => {
            const style = getOptionStyle({
              option,
              selected,
              correctSet,
              submitted,
            });
            return (
              <Animated.View
                key={`${levelId}-${option}`}
                entering={FadeInDown.delay(i * 60).springify()}
              >
                <Pressable
                  onPress={() => toggleOption(option)}
                  disabled={submitted}
                  accessibilityLabel={option}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: selected.has(option),
                    disabled: submitted,
                  }}
                  className="flex-row items-center p-4 rounded-2xl"
                  style={[
                    styles.option,
                    {
                      borderColor: style.borderColor,
                      backgroundColor: style.backgroundColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={style.iconName}
                    size={24}
                    color={style.iconColor}
                  />
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

        <View className="px-4 mt-5">
          {!submitted ? (
            <Pressable
              onPress={handleSubmit}
              disabled={selected.size === 0}
              accessibilityLabel="Check answers"
              accessibilityRole="button"
              accessibilityState={{ disabled: selected.size === 0 }}
              style={selected.size === 0 ? styles.submitDisabled : undefined}
              className="h-14 rounded-2xl bg-primary items-center justify-center"
            >
              <Text className="text-base font-bold text-white">
                Check Answers
              </Text>
            </Pressable>
          ) : (
            !allCorrect && (
              <View style={styles.retryWrap}>
                <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
                  <Text className="text-sm text-red-800 text-center font-semibold">
                    Not quite right! Check the highlighted answers above.
                  </Text>
                </View>
                <Pressable
                  onPress={onRetry}
                  accessibilityLabel="Try this level again"
                  accessibilityRole="button"
                  className="h-14 rounded-2xl bg-primary items-center justify-center"
                >
                  <Text className="text-base font-bold text-white">
                    Try Again
                  </Text>
                </Pressable>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  zoomTrigger: { gap: 3 },
  optionsList: { gap: 8 },
  retryWrap: { gap: 10 },
  image: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerHighest,
  },
  option: { borderWidth: 2, gap: 12 },
  submitDisabled: { opacity: 0.4 },
});
