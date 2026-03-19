import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface AvatarProps {
  source: string | null;
  name: string;
  size?: number;
}

function getInitials(name: string | undefined | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ source, name, size = 40 }: AvatarProps) {
  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="bg-primaryLight items-center justify-center"
    >
      <Text
        style={{ fontSize: size * 0.36 }}
        className="text-white font-bold"
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
