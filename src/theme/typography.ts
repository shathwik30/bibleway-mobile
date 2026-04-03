export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  headline: "PlayfairDisplay_700Bold",
  headlineRegular: "PlayfairDisplay_400Regular",
  headlineItalic: "PlayfairDisplay_400Regular_Italic",
  system: "System",
} as const;

export const typography = {
  fontSize,
  fontFamily,
} as const;

export type FontSize = typeof fontSize;
export type FontFamily = typeof fontFamily;
