import React from 'react';
import { View, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { STICKERS, type Sticker } from '@/constants/stickers';

interface StickerPickerProps {
  onSelect: (stickerId: number) => void;
}

const COLUMNS = 4;
const PADDING = 8;

function StickerPickerComponent({ onSelect }: StickerPickerProps) {
  const { width } = useWindowDimensions();
  const itemSize = (width - PADDING * 2 - (COLUMNS - 1) * PADDING) / COLUMNS;

  const renderItem = ({ item }: { item: Sticker }) => (
    <Pressable
      onPress={() => onSelect(item.id)}
      className="items-center justify-center"
      style={{ width: itemSize, height: itemSize, padding: 6 }}
    >
      <Image
        source={item.source}
        style={{ width: itemSize - 20, height: itemSize - 20 }}
        contentFit="contain"
      />
    </Pressable>
  );

  return (
    <View style={{ height: 260 }} className="bg-surface border-t border-border">
      <FlatList
        data={STICKERS}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={COLUMNS}
        contentContainerStyle={{ padding: PADDING }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default React.memo(StickerPickerComponent);
