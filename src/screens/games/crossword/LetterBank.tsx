import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LetterTile } from "./types";

interface LetterBankProps {
  tiles: LetterTile[];
  tileSize: number;
  onTap: (id: string, letter: string) => void;
}

export default function LetterBank({ tiles, tileSize, onTap }: LetterBankProps) {
  return (
    <View style={styles.container}>
      {tiles.map((tile) => (
        <Pressable
          key={tile.id}
          disabled={tile.used}
          onPress={() => onTap(tile.id, tile.letter)}
          accessibilityLabel={`Letter ${tile.letter}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: tile.used }}
          style={{
            width: tileSize,
            height: tileSize,
            borderRadius: 12,
            opacity: tile.used ? 0.3 : 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          className={tile.used ? "bg-surfaceContainerHigh" : "bg-primary"}
        >
          <Text
            style={{ fontSize: tileSize * 0.4 }}
            className={`font-bold ${tile.used ? "text-gray-300" : "text-white"}`}
          >
            {tile.letter}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
});
