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
  regular: "System",
  medium: "System",
  bold: "System",
} as const;

export const typography = {
  fontSize,
  fontFamily,
} as const;

export type FontSize = typeof fontSize;
export type FontFamily = typeof fontFamily;
