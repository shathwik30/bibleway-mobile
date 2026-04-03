import React from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";

interface MarkdownRendererProps {
  content: string;
}

const markdownStyles = {
  body: {
    color: "#1c1b1b",
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
  },
  heading1: {
    fontSize: 24,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#1c1b1b",
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#1c1b1b",
    marginBottom: 6,
  },
  heading3: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#1c1b1b",
    marginBottom: 4,
  },
  paragraph: { marginBottom: 12 },
  listItem: { marginBottom: 4 },
  link: { color: "#59021a" },
  blockquote: {
    backgroundColor: "#f6f3f2",
    borderLeftWidth: 4,
    borderLeftColor: "#59021a",
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
