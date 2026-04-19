import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <View style={{ flex: 1, marginBottom: 16 }}>
      <Skeleton width="100%" height={180} borderRadius={12} />
      <Skeleton
        width="80%"
        height={14}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
      <Skeleton
        width={60}
        height={14}
        borderRadius={4}
        style={{ marginTop: 4 }}
      />
    </View>
  );
}
