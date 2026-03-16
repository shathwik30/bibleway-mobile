import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownRendererProps {
  content: string;
}

const markdownStyles = {
  body: { color: '#1A1A2E', fontSize: 16, lineHeight: 26 },
  heading1: { fontSize: 24, fontWeight: 'bold' as const, color: '#1A1A2E', marginBottom: 8 },
  heading2: { fontSize: 20, fontWeight: 'bold' as const, color: '#1A1A2E', marginBottom: 6 },
  heading3: { fontSize: 18, fontWeight: '600' as const, color: '#1A1A2E', marginBottom: 4 },
  paragraph: { marginBottom: 12 },
  listItem: { marginBottom: 4 },
  link: { color: '#4A6FA5' },
  blockquote: {
    backgroundColor: '#F8F9FA',
    borderLeftWidth: 4,
    borderLeftColor: '#4A6FA5',
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
