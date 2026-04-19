import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

function StatItem() {
  return (
    <View style={{ alignItems: "center" }}>
      <Skeleton width={30} height={18} borderRadius={4} />
      <Skeleton
        width={50}
        height={10}
        borderRadius={4}
        style={{ marginTop: 4 }}
      />
    </View>
  );
}

export default function ProfileSkeleton() {
  return (
    <View style={{ alignItems: "center", paddingTop: 24, paddingBottom: 16 }}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton
        width={150}
        height={18}
        borderRadius={4}
        style={{ marginTop: 12 }}
      />
      <Skeleton
        width={200}
        height={12}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 20,
          paddingHorizontal: 32,
        }}
      >
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
      </View>
    </View>
  );
}
