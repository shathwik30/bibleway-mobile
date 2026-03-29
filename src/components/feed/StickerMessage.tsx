import React from 'react';
import { Image } from 'expo-image';
import { parseStickerText, getStickerSource } from '@/constants/stickers';

interface StickerMessageProps {
  text: string;
  size?: number;
}

function StickerMessageComponent({ text, size = 120 }: StickerMessageProps) {
  const stickerId = parseStickerText(text);
  if (stickerId === null) return null;

  const source = getStickerSource(stickerId);
  if (!source) return null;

  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}

export default React.memo(StickerMessageComponent);
