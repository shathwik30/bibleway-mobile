import { colors } from "@/theme/colors";
import type { Ionicons } from "@expo/vector-icons";

const COMPLETED_BG = "#ECFDF5";
const ACTIVE_BG = "#EFF6FF";
const MISSED_BG = "#FEF3C7";
const WRONG_BG = "#FEF2F2";
const CORRECT_TEXT = "#166534";
const MISSED_TEXT = "#92400E";
const WRONG_TEXT = "#991B1B";

type IonName = keyof typeof Ionicons.glyphMap;

export interface OptionStyle {
  borderColor: string;
  backgroundColor: string;
  iconColor: string;
  iconName: IonName;
  textColor: string;
}

export function getOptionStyle(args: {
  option: string;
  selected: Set<string>;
  correctSet: Set<string>;
  submitted: boolean;
}): OptionStyle {
  const { option, selected, correctSet, submitted } = args;
  const isSelected = selected.has(option);
  const isCorrect = correctSet.has(option);

  if (!submitted) {
    return {
      borderColor: isSelected ? colors.primary.DEFAULT : colors.surfaceContainerHighest,
      backgroundColor: isSelected ? ACTIVE_BG : colors.surfaceContainerLowest,
      iconColor: isSelected ? colors.primary.DEFAULT : colors.surfaceContainerHighest,
      iconName: isSelected ? "checkbox" : "square-outline",
      textColor: isSelected ? colors.primary.DEFAULT : colors.textPrimary,
    };
  }

  if (isCorrect && isSelected) {
    return {
      borderColor: colors.success,
      backgroundColor: COMPLETED_BG,
      iconColor: colors.success,
      iconName: "checkmark-circle",
      textColor: CORRECT_TEXT,
    };
  }
  if (isCorrect && !isSelected) {
    return {
      borderColor: colors.warning,
      backgroundColor: MISSED_BG,
      iconColor: colors.warning,
      iconName: "alert-circle",
      textColor: MISSED_TEXT,
    };
  }
  if (!isCorrect && isSelected) {
    return {
      borderColor: colors.error,
      backgroundColor: WRONG_BG,
      iconColor: colors.error,
      iconName: "close-circle",
      textColor: WRONG_TEXT,
    };
  }
  return {
    borderColor: colors.surfaceContainerHighest,
    backgroundColor: colors.surfaceContainerLowest,
    iconColor: colors.surfaceContainerHighest,
    iconName: "square-outline",
    textColor: colors.textSecondary,
  };
}
