import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface StatsRowProps {
  followers: number;
  following: number;
  posts: number;
  prayers: number;
  userId: string;
}

export default function StatsRow({ followers, following, posts, prayers, userId }: StatsRowProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row mt-4 w-full justify-around">
      <View className="items-center">
        <Text className="text-lg font-bold text-textPrimary">{posts}</Text>
        <Text className="text-xs text-textSecondary">Posts</Text>
      </View>
      <View className="items-center">
        <Text className="text-lg font-bold text-textPrimary">{prayers}</Text>
        <Text className="text-xs text-textSecondary">Prayers</Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate('Followers', { userId })}
        className="items-center"
      >
        <Text className="text-lg font-bold text-textPrimary">{followers}</Text>
        <Text className="text-xs text-textSecondary">Followers</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Following', { userId })}
        className="items-center"
      >
        <Text className="text-lg font-bold text-textPrimary">{following}</Text>
        <Text className="text-xs text-textSecondary">Following</Text>
      </Pressable>
    </View>
  );
}
