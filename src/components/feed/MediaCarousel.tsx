import React, { useState, useCallback } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import { DEFAULT_BLURHASH } from "@/constants/app";
import { useSignedUrls } from "@/hooks/useSignedUrl";
import type { MediaItem } from "@/types/models";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

interface MediaCarouselProps {
  media: MediaItem[];
}

const VideoItem = React.memo(function VideoItem({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={styles.media}
      contentFit="contain"
      fullscreenOptions={{ enable: true }}
      allowsPictureInPicture={false}
    />
  );
});

function MediaCarousel({ media }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const signedUrls = useSignedUrls(media);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const url = signedUrls.get(item.id) || item.file;

      if (item.media_type === "video") {
        return <VideoItem uri={url} />;
      }

      return (
        <Image
          source={{ uri: url }}
          style={styles.media}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: DEFAULT_BLURHASH }}
          cachePolicy="memory-disk"
          recyclingKey={item.id}
        />
      );
    },
    [signedUrls],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
      setActiveIndex(index);
    },
    [],
  );

  return (
    <View>
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        extraData={signedUrls}
      />
      {media.length > 1 && (
        <View className="flex-row justify-center py-2">
          {media.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-primary" : "bg-surfaceContainerHighest"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  media: { width: CARD_WIDTH, height: CARD_WIDTH * 0.75 },
});

export default React.memo(MediaCarousel);
