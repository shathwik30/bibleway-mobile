import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../ui/Avatar";
import StickerMessage from "./StickerMessage";
import { isSticker } from "@/constants/stickers";
import type { Comment } from "@/types/models";

interface CommentItemProps {
  comment: Comment;
  onReply?: () => void;
  onViewReplies?: () => void;
}

export default function CommentItem({
  comment,
  onReply,
  onViewReplies,
}: CommentItemProps) {
  const navigation = useNavigation();
  const isStickerComment = isSticker(comment.text);

  return (
    <View className="flex-row px-4 py-3">
      <Pressable
        onPress={() =>
          navigation.navigate("UserProfile", { userId: comment.user.id })
        }
      >
        <Avatar
          source={comment.user.profile_photo}
          name={comment.user.full_name}
          size={32}
        />
      </Pressable>
      <View className="flex-1 ml-3">
        <View className="bg-surface rounded-xl px-3 py-2">
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold text-textPrimary">
              {comment.user.full_name}
            </Text>
            {comment.user.age ? (
              <Text className="text-xs text-textTertiary ml-1.5">
                · {comment.user.age}y
              </Text>
            ) : null}
          </View>
          {isStickerComment ? (
            <StickerMessage text={comment.text} size={100} />
          ) : (
            <Text className="text-sm text-textPrimary mt-0.5">
              {comment.text}
            </Text>
          )}
        </View>
        <View className="flex-row items-center mt-1 ml-1">
          <Text className="text-xs text-textSecondary">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </Text>
          {onReply && (
            <Pressable onPress={onReply} className="ml-4">
              <Text className="text-xs font-semibold text-textSecondary">
                Reply
              </Text>
            </Pressable>
          )}
        </View>
        {comment.reply_count > 0 && onViewReplies && (
          <Pressable onPress={onViewReplies} className="mt-1 ml-1">
            <Text className="text-xs font-semibold text-primary">
              View {comment.reply_count}{" "}
              {comment.reply_count === 1 ? "reply" : "replies"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
