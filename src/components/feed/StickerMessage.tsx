import React, { useMemo } from "react";
import { Image } from "expo-image";
import { parseStickerText, getStickerSource } from "@/constants/stickers";

interface StickerMessageProps {
  text: string;
  size?: number;
}

function StickerMessageComponent({ text, size = 120 }: StickerMessageProps) {
  const stickerId = parseStickerText(text);
  const source = stickerId !== null ? getStickerSource(stickerId) : null;
  const style = useMemo(() => ({ width: size, height: size }), [size]);

  if (!source) return null;

  return <Image source={source} style={style} contentFit="contain" />;
}

export default React.memo(StickerMessageComponent);
