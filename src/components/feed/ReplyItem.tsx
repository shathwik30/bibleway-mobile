import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import type { Reply } from '@/types/models';

interface ReplyItemProps {
  reply: Reply;
}

export default function ReplyItem({ reply }: ReplyItemProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-row pl-12 pr-4 py-2">
      <Pressable onPress={() => navigation.navigate('UserProfile', { userId: reply.user.id })}>
        <Avatar source={reply.user.profile_photo} name={reply.user.full_name} size={28} />
      </Pressable>
      <View className="flex-1 ml-2">
        <View className="bg-surface rounded-xl px-3 py-2">
          <Text className="text-xs font-semibold text-textPrimary">{reply.user.full_name}</Text>
          <Text className="text-xs text-textPrimary mt-0.5">{reply.text}</Text>
        </View>
        <Text className="text-[10px] text-textSecondary mt-1 ml-1">
          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
