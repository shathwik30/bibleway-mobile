import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function ListItemSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginBottom: 8,
      }}
    >
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Skeleton width="60%" height={14} borderRadius={4} />
        <Skeleton
          width="40%"
          height={10}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
      </View>
    </View>
  );
}
