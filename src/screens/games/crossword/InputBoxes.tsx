import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  ZoomIn,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";
import type { Feedback } from "./types";

const CORRECT_BG = colors.feedback.successBg;
const WRONG_BG = colors.feedback.errorBg;
const ACTIVE_BG = colors.feedback.infoBg;

interface InputBoxesProps {
  length: number;
  input: string[];
  feedback: Feedback;
  boxWidth: number;
  shakeX: SharedValue<number>;
  popScale: SharedValue<number>;
}

export default function InputBoxes({
  length,
  input,
  feedback,
  boxWidth,
  shakeX,
  popScale,
}: InputBoxesProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: popScale.value }],
  }));

  const boxSize = useMemo(
    () => ({ width: boxWidth, height: boxWidth + 4 }),
    [boxWidth],
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {Array.from({ length }).map((_, i) => {
        const isFilled = !!input[i];
        const borderColor =
          feedback === "correct"
            ? colors.success
            : feedback === "wrong"
              ? colors.error
              : isFilled
                ? colors.primary.DEFAULT
                : colors.surfaceContainerHighest;
        const backgroundColor =
          feedback === "correct"
            ? CORRECT_BG
            : feedback === "wrong"
              ? WRONG_BG
              : isFilled
                ? ACTIVE_BG
                : colors.surfaceContainerLowest;
        return (
          <View
            key={i}
            style={[styles.box, boxSize, { borderColor, backgroundColor }]}
          >
            {input[i] ? (
              <Animated.Text
                entering={ZoomIn.duration(150)}
                className="text-lg font-bold text-textPrimary"
              >
                {input[i]}
              </Animated.Text>
            ) : (
              <View style={styles.dash} className="bg-gray-200" />
            )}
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  box: {
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dash: { width: 12, height: 2, borderRadius: 1 },
});
