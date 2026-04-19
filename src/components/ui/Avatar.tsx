import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { useSignedUrl } from "@/hooks/useSignedUrl";

interface AvatarProps {
  source: string | null;
  name: string;
  size?: number;
}

function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ source, name, size = 40 }: AvatarProps) {
  const signedUrl = useSignedUrl(source);
  const boxStyle = useMemo(
    () => ({ width: size, height: size, borderRadius: size / 2 }),
    [size],
  );
  const textStyle = useMemo(() => ({ fontSize: size * 0.36 }), [size]);

  if (signedUrl) {
    return (
      <Image
        source={{ uri: signedUrl }}
        style={boxStyle}
        contentFit="cover"
        transition={200}
        accessibilityLabel={`${name}'s profile photo`}
      />
    );
  }

  return (
    <View
      style={boxStyle}
      className="bg-primaryLight items-center justify-center"
      accessibilityLabel={`${name}'s initials avatar`}
    >
      <Text style={textStyle} className="text-white font-bold">
        {getInitials(name)}
      </Text>
    </View>
  );
}

export default React.memo(Avatar);
