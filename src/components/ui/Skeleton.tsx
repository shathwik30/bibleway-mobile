import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function Skeleton({ width, height, borderRadius = 4, style }: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Pre-built skeleton layouts
export function PostCardSkeleton() {
  return (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
      {/* Author row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: 12 }}>
          <Skeleton width={120} height={14} borderRadius={4} />
          <Skeleton width={80} height={10} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      </View>
      {/* Text lines */}
      <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />
      {/* Image placeholder */}
      <Skeleton width="100%" height={200} borderRadius={12} style={{ marginBottom: 12 }} />
      {/* Action row */}
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16 }}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton width={150} height={18} borderRadius={4} style={{ marginTop: 12 }} />
      <Skeleton width={200} height={12} borderRadius={4} style={{ marginTop: 8 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20, paddingHorizontal: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={30} height={18} borderRadius={4} />
          <Skeleton width={50} height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={30} height={18} borderRadius={4} />
          <Skeleton width={50} height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={30} height={18} borderRadius={4} />
          <Skeleton width={50} height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={30} height={18} borderRadius={4} />
          <Skeleton width={50} height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={{ flex: 1, marginBottom: 16 }}>
      <Skeleton width="100%" height={180} borderRadius={12} />
      <Skeleton width="80%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
      <Skeleton width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
  );
}

export function ListItemSkeleton() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Skeleton width="60%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={10} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function FeedSkeleton() {
  return (
    <View>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </View>
  );
}
