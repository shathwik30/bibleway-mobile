import React, { useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { STICKERS, type Sticker } from "@/features/feed/constants/stickers";

interface StickerPickerProps {
  onSelect: (stickerId: number) => void;
}

const COLUMNS = 4;
const PADDING = 8;

function StickerPickerComponent({ onSelect }: StickerPickerProps) {
  const { width } = useWindowDimensions();
  const itemSize = (width - PADDING * 2 - (COLUMNS - 1) * PADDING) / COLUMNS;

  const tileStyle = useMemo(
    () => ({ width: itemSize, height: itemSize, padding: 6 }),
    [itemSize],
  );
  const imageStyle = useMemo(
    () => ({ width: itemSize - 20, height: itemSize - 20 }),
    [itemSize],
  );

  const renderItem = useCallback(
    ({ item }: { item: Sticker }) => (
      <Pressable
        onPress={() => onSelect(item.id)}
        accessibilityLabel={`Send sticker ${item.id}`}
        accessibilityRole="button"
        className="items-center justify-center"
        style={tileStyle}
      >
        <Image source={item.source} style={imageStyle} contentFit="contain" />
      </Pressable>
    ),
    [onSelect, tileStyle, imageStyle],
  );

  return (
    <View style={styles.container} className="bg-surfaceContainerLow">
      <FlatList
        data={STICKERS}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={COLUMNS}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 260 },
  content: { padding: PADDING },
});

export default React.memo(StickerPickerComponent);
