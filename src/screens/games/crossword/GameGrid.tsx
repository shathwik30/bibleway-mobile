import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import type { LevelData } from "@/constants/crosswordLevels";
import type { CellInfo } from "./types";

const ACTIVE_BG = colors.feedback.infoBg;
const SOLVED_BG = colors.feedback.successBg;

interface GameGridProps {
  level: LevelData;
  gridMap: Map<string, CellInfo>;
  currKeys: Set<string>;
  solved: Set<number>;
  cellSize: number;
  cellGap: number;
}

export default function GameGrid({
  level,
  gridMap,
  currKeys,
  solved,
  cellSize,
  cellGap,
}: GameGridProps) {
  const cellBox = useMemo(
    () => ({ width: cellSize, height: cellSize }),
    [cellSize],
  );
  const letterSize = useMemo(
    () => ({ fontSize: cellSize * 0.4 }),
    [cellSize],
  );
  const rowStyle = useMemo(
    () => ({ flexDirection: "row" as const, gap: cellGap }),
    [cellGap],
  );

  const rows: React.ReactNode[] = [];
  for (let r = 0; r < level.gridSize; r++) {
    const cells: React.ReactNode[] = [];
    for (let c = 0; c < level.gridSize; c++) {
      const k = `${r}-${c}`;
      const cell = gridMap.get(k);
      const isCur = currKeys.has(k);
      const isDone = cell
        ? cell.wordIndices.some((idx) => solved.has(idx))
        : false;

      if (!cell) {
        cells.push(
          <View key={k} style={cellBox} className="bg-surfaceContainerHigh" />,
        );
        continue;
      }

      const borderColor = isDone
        ? colors.success
        : isCur
          ? colors.primary.DEFAULT
          : colors.surfaceContainerHighest;
      const backgroundColor = isDone
        ? SOLVED_BG
        : isCur
          ? ACTIVE_BG
          : colors.surfaceContainerLowest;

      cells.push(
        <View
          key={k}
          style={[styles.cell, cellBox, { borderColor, backgroundColor }]}
          className="items-center justify-center"
        >
          {isDone && (
            <Text
              style={[styles.letter, letterSize]}
              className="font-bold text-textPrimary"
            >
              {cell.letter}
            </Text>
          )}
        </View>,
      );
    }
    rows.push(
      <View key={r} style={rowStyle}>
        {cells}
      </View>,
    );
  }
  return <>{rows}</>;
}

const styles = StyleSheet.create({
  cell: { borderWidth: 1.5 },
  letter: {},
});
