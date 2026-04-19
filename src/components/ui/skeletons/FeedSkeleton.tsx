import React from "react";
import { View } from "react-native";
import PostCardSkeleton from "./PostCardSkeleton";

export default function FeedSkeleton() {
  return (
    <View>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </View>
  );
}
