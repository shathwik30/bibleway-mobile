import React from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface YouTubeEmbedProps {
  url: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
  const height = (SCREEN_WIDTH - 32) * 9 / 16;

  return (
    <View className="mx-4 mb-4 rounded-xl overflow-hidden" style={{ height }}>
      <WebView
        source={{ uri: embedUrl }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
}
