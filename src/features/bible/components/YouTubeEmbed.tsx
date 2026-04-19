import React, { useMemo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EMBED_HEIGHT = ((SCREEN_WIDTH - 32) * 9) / 16;

interface YouTubeEmbedProps {
  url: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]+)/,
  );
  return match?.[1] ?? null;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = getYouTubeId(url);

  const source = useMemo(() => ({ uri: videoId ? embedUrl(videoId) : "" }), [videoId]);

  if (!videoId) return null;

  return (
    <View
      className="mx-4 mb-4 rounded-xl overflow-hidden"
      style={styles.container}
    >
      <WebView
        source={source}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
}

function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
}

const styles = StyleSheet.create({
  container: { height: EMBED_HEIGHT },
  webview: { flex: 1 },
});
