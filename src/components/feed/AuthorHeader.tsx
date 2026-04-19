import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../ui/Avatar";
import { ROUTES } from "@/navigation/routes";
import type { Author } from "@/types/models";

interface AuthorHeaderProps {
  /** The author object containing id, name, photo, and age. */
  author: Author;
  /** ISO timestamp for "time ago" display. */
  createdAt: string;
  /** Optional content rendered on the right side (e.g. BoostedBadge). */
  rightContent?: React.ReactNode;
}

/**
 * Shared author header row used in PostCard, PrayerCard, and other feed items.
 *
 * Renders: Avatar + full name + optional age + relative time + optional right slot.
 * Tapping the avatar or name navigates to the user's profile.
 */
function AuthorHeader({ author, createdAt, rightContent }: AuthorHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center mb-2">
      <Pressable
        onPress={() =>
          navigation.navigate(ROUTES.UserProfile, { userId: author.id })
        }
        className="flex-row items-center flex-1"
      >
        <Avatar
          source={author.profile_photo}
          name={author.full_name}
          size={40}
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold text-textPrimary">
              {author.full_name}
            </Text>
            {author.age ? (
              <Text className="text-xs text-textTertiary ml-1.5">
                · {author.age}y
              </Text>
            ) : null}
          </View>
          <Text className="text-xs text-textSecondary">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Text>
        </View>
      </Pressable>
      {rightContent}
    </View>
  );
}

export default React.memo(AuthorHeader);
