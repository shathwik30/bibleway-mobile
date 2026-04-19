import React from "react";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

interface VerseTextProps {
  text: string;
  highlighted?: boolean;
  highlightColor?: string;
}

export default function VerseText({
  text,
  highlighted = false,
  highlightColor = colors.highlight.yellow,
}: VerseTextProps) {
  return (
    <Text
      className="text-base text-textPrimary leading-7"
      style={highlighted ? { backgroundColor: highlightColor } : undefined}
    >
      {text}
    </Text>
  );
}
