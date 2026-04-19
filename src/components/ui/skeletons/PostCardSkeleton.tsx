import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function PostCardSkeleton() {
  return (
    <View style={{ padding: 16, marginBottom: 8 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: 12 }}>
          <Skeleton width={120} height={14} borderRadius={4} />
          <Skeleton
            width={80}
            height={10}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        </View>
      </View>
      <Skeleton
        width="100%"
        height={14}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />
      <Skeleton
        width="90%"
        height={14}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />
      <Skeleton
        width="70%"
        height={14}
        borderRadius={4}
        style={{ marginBottom: 16 }}
      />
      <Skeleton
        width="100%"
        height={200}
        borderRadius={12}
        style={{ marginBottom: 12 }}
      />
      <View style={{ flexDirection: "row", gap: 24 }}>
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
    </View>
  );
}
