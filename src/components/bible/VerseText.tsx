import React from 'react';
import { Text } from 'react-native';

interface VerseTextProps {
  text: string;
  highlighted?: boolean;
  highlightColor?: string;
}

export default function VerseText({ text, highlighted = false, highlightColor = '#FEF3C7' }: VerseTextProps) {
  return (
    <Text
      className="text-base text-textPrimary leading-7"
      style={highlighted ? { backgroundColor: highlightColor } : undefined}
    >
      {text}
    </Text>
  );
}
