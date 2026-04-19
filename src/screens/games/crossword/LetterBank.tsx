import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LetterTile } from "./types";

interface LetterBankProps {
  tiles: LetterTile[];
  tileSize: number;
  onTap: (id: string, letter: string) => void;
}

export default function LetterBank({ tiles, tileSize, onTap }: LetterBankProps) {
  const tileBox = useMemo(
    () => ({ width: tileSize, height: tileSize }),
    [tileSize],
  );
  const letterSize = useMemo(
    () => ({ fontSize: tileSize * 0.4 }),
    [tileSize],
  );

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
          style={[
            styles.tile,
            tileBox,
            tile.used ? styles.tileUsed : styles.tileActive,
          ]}
          className={tile.used ? "bg-surfaceContainerHigh" : "bg-primary"}
        >
          <Text
            style={letterSize}
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
  tile: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tileActive: { opacity: 1 },
  tileUsed: { opacity: 0.3 },
});
