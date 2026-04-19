export const colors = {
  primary: {
    DEFAULT: "#59021a",
    light: "#ffb2b9",
    dark: "#781c2e",
    container: "#781c2e",
    fixed: "#ffdadc",
    fixedDim: "#ffb2b9",
  },
  onPrimary: "#ffffff",
  secondary: {
    DEFAULT: "#4e5f7c",
    container: "#c9dbfd",
  },
  tertiary: {
    DEFAULT: "#372700",
    fixed: "#ffdf9e",
    fixedDim: "#eac16a",
    container: "#523c00",
  },
  surface: "#fcf9f8",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f6f3f2",
  surfaceContainer: "#f0edec",
  surfaceContainerHigh: "#ebe7e7",
  surfaceContainerHighest: "#e5e2e1",
  onSurface: "#1c1b1b",
  onSurfaceVariant: "#564243",
  textPrimary: "#1c1b1b",
  textSecondary: "#564243",
  textTertiary: "#897173",
  border: "#dcc0c1",
  outline: "#897173",
  outlineVariant: "#dcc0c1",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  success: "#22C55E",
  warning: "#F59E0B",
  highlight: {
    yellow: "#FEF3C7",
    green: "#D1FAE5",
    blue: "#DBEAFE",
    pink: "#FCE7F3",
  },
  /**
   * Feedback tints used across game screens and Toast.
   *
   * *Bg / *Text are a matched pair for the four states (success /
   * info / warning / error). *Solid is the bold brand-flavored
   * version used inside Toast icons. *Accent is the hint-button
   * amber used by the quiz and crossword hint controls.
   */
  feedback: {
    successBg: "#ECFDF5",
    successText: "#166534",
    successSolid: "#059669",
    infoBg: "#EFF6FF",
    warningBg: "#FEF3C7",
    warningText: "#92400E",
    errorBg: "#FEF2F2",
    errorText: "#991B1B",
    errorSolid: "#DC2626",
    hintAccent: "#D97706",
  },
  shadow: "#000000",
} as const;

export type Colors = typeof colors;
