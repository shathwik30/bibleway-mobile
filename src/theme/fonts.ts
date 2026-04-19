import { StyleSheet } from "react-native";

/**
 * Shared font style presets.
 *
 * Use these instead of inline `style={{ fontFamily: "..." }}` — every
 * such inline object allocates a fresh reference on each render, which
 * defeats React.memo. Pulling from this single StyleSheet means every
 * caller shares one stable style reference per variant.
 *
 * Examples:
 *   <Text style={fonts.regular} />
 *   <Text style={[fonts.bold, { color: "#fff" }]} />
 */
export const fonts = StyleSheet.create({
  regular: { fontFamily: "Inter_400Regular" },
  medium: { fontFamily: "Inter_500Medium" },
  semibold: { fontFamily: "Inter_600SemiBold" },
  bold: { fontFamily: "Inter_700Bold" },
  serifRegular: { fontFamily: "PlayfairDisplay_400Regular" },
  serifItalic: { fontFamily: "PlayfairDisplay_400Regular_Italic" },
  serifBold: { fontFamily: "PlayfairDisplay_700Bold" },
});
