import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";

export default function ListItemSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.body}>
        <Skeleton width="60%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={10} borderRadius={4} style={styles.gap6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  body: { marginLeft: 12, flex: 1 },
  gap6: { marginTop: 6 },
});
