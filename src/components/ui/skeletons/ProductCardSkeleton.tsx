import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={180} borderRadius={12} />
      <Skeleton width="80%" height={14} borderRadius={4} style={styles.gap8} />
      <Skeleton width={60} height={14} borderRadius={4} style={styles.gap4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 16 },
  gap4: { marginTop: 4 },
  gap8: { marginTop: 8 },
});
