import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";

function StatItem() {
  return (
    <View style={styles.stat}>
      <Skeleton width={30} height={18} borderRadius={4} />
      <Skeleton width={50} height={10} borderRadius={4} style={styles.gap4} />
    </View>
  );
}

export default function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton width={150} height={18} borderRadius={4} style={styles.gap12} />
      <Skeleton width={200} height={12} borderRadius={4} style={styles.gap8} />
      <View style={styles.row}>
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 24, paddingBottom: 16 },
  stat: { alignItems: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 32,
  },
  gap4: { marginTop: 4 },
  gap8: { marginTop: 8 },
  gap12: { marginTop: 12 },
});
