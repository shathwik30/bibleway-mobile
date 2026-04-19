import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";

export default function PostCardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.headerText}>
          <Skeleton width={120} height={14} borderRadius={4} />
          <Skeleton width={80} height={10} borderRadius={4} style={styles.gap6} />
        </View>
      </View>
      <Skeleton width="100%" height={14} borderRadius={4} style={styles.gap8} />
      <Skeleton width="90%" height={14} borderRadius={4} style={styles.gap8} />
      <Skeleton width="70%" height={14} borderRadius={4} style={styles.gap16} />
      <Skeleton width="100%" height={200} borderRadius={12} style={styles.gap12} />
      <View style={styles.actions}>
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, marginBottom: 8 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerText: { marginLeft: 12 },
  actions: { flexDirection: "row", gap: 24 },
  gap6: { marginTop: 6 },
  gap8: { marginBottom: 8 },
  gap12: { marginBottom: 12 },
  gap16: { marginBottom: 16 },
});
