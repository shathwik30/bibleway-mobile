import React, { useState, useCallback } from "react";
import {
  View,
  Dimensions,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import { DEFAULT_BLURHASH } from "@/constants/app";
import type { MediaItem } from "@/types/models";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
      style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.75 }}
      contentFit="contain"
      fullscreenOptions={{ enable: true }}
      allowsPictureInPicture={false}
    />
  );
});

function MediaCarousel({ media }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = useCallback(({ item }: { item: MediaItem }) => {
    if (item.media_type === "video") {
      return <VideoItem uri={item.file} />;
    }

    return (
      <Image
        source={{ uri: item.file }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.75 }}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: DEFAULT_BLURHASH }}
      />
    );
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
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
      />
      {media.length > 1 && (
        <View className="flex-row justify-center py-2">
          {media.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default React.memo(MediaCarousel);
