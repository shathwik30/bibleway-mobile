import React from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";
import { colors } from "@/theme/colors";

interface MarkdownRendererProps {
  content: string;
}

const markdownStyles = {
  body: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
  },
  heading1: {
    fontSize: 24,
    fontFamily: "PlayfairDisplay_700Bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontFamily: "PlayfairDisplay_700Bold",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  paragraph: { marginBottom: 12 },
  listItem: { marginBottom: 4 },
  link: { color: colors.primary.DEFAULT },
  blockquote: {
    backgroundColor: colors.surfaceContainerLow,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.DEFAULT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  image: { borderRadius: 8 },
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <View className="px-4">
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}
