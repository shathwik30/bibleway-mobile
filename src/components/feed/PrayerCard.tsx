import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../ui/Avatar";
import AnimatedPressable from "../ui/AnimatedPressable";
import MediaCarousel from "./MediaCarousel";
import ReactionBar from "./ReactionBar";
import { FEED_TEXT_TRUNCATE_LENGTH } from "@/constants/app";
import { ROUTES } from "@/navigation/routes";
import type { Prayer } from "@/types/models";

interface PrayerCardProps {
  prayer: Prayer;
}

function PrayerCard({ prayer }: PrayerCardProps) {
  const navigation = useNavigation();
  const [expanded, setExpanded] = React.useState(false);

  const description = prayer.description ?? "";
  const shouldTruncate = description.length > FEED_TEXT_TRUNCATE_LENGTH;
  const displayText =
    shouldTruncate && !expanded
      ? description.slice(0, FEED_TEXT_TRUNCATE_LENGTH) + "..."
      : description;

  return (
    <AnimatedPressable
      onPress={() =>
        navigation.navigate(ROUTES.PrayerDetail, { prayerId: prayer.id })
      }
      accessibilityLabel={`Open prayer request: ${prayer.title}`}
      accessibilityRole="button"
      className="bg-surfaceContainerLow mb-2 rounded-xl mx-4"
    >
      <View className="px-4 pt-3">
        <View className="flex-row items-center mb-2">
          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.UserProfile, { userId: prayer.author.id })
            }
            accessibilityLabel={`View ${prayer.author.full_name}'s profile`}
            accessibilityRole="button"
            className="flex-row items-center flex-1"
          >
            <Avatar
              source={prayer.author.profile_photo}
              name={prayer.author.full_name}
              size={40}
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="text-sm font-semibold text-textPrimary">
                  {prayer.author.full_name}
                </Text>
                {prayer.author.age ? (
                  <Text className="text-xs text-textTertiary ml-1.5">
                    · {prayer.author.age}y
                  </Text>
                ) : null}
              </View>
              <Text className="text-xs text-textSecondary">
                {formatDistanceToNow(new Date(prayer.created_at), {
                  addSuffix: true,
                })}
              </Text>
            </View>
          </Pressable>
        </View>

        <Text className="text-base font-bold text-textPrimary mb-1">
          {prayer.title}
        </Text>

        {prayer.description ? (
          <View className="mb-2">
            <Text className="text-sm text-textPrimary leading-5">
              {displayText}
            </Text>
            {shouldTruncate && !expanded && (
              <Pressable
                onPress={() => setExpanded(true)}
                accessibilityLabel="Show full prayer description"
                accessibilityRole="button"
              >
                <Text className="text-primary text-sm font-medium mt-1">
                  Read more
                </Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>

      {prayer.media.length > 0 && <MediaCarousel media={prayer.media} />}

      <View className="px-4 py-2">
        <ReactionBar
          contentType="prayer"
          objectId={prayer.id}
          reactionCount={prayer.reaction_count}
          commentCount={prayer.comment_count}
          userReaction={prayer.user_reaction}
        />
      </View>
    </AnimatedPressable>
  );
}

export default React.memo(PrayerCard);
