import React from "react";
import { View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { REACTIONS, REACTION_EMOJI_MAP } from "@/constants/reactions";
import { selectionHaptic } from "@/lib/haptics";
import { generateDeepLink, shareContent } from "@/lib/share";
import { useToggleReaction } from "@/hooks/useSocial";
import { useRecordShare } from "@/hooks/useAnalytics";
import type { EmojiType } from "@/types/enums";
import { ROUTES } from "@/navigation/routes";

interface ReactionBarProps {
  contentType: "post" | "prayer";
  objectId: string;
  reactionCount: number;
  commentCount: number;
  userReaction: EmojiType | null;
}

function ReactionBar({
  contentType,
  objectId,
  reactionCount,
  commentCount,
  userReaction,
}: ReactionBarProps) {
  const navigation = useNavigation();
  const toggleReaction = useToggleReaction();
  const recordShare = useRecordShare();
  const [showPicker, setShowPicker] = React.useState(false);
  const pickerOpacity = useSharedValue(0);

  React.useEffect(() => {
    pickerOpacity.value = withTiming(showPicker ? 1 : 0, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPicker]);

  const pickerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pickerOpacity.value,
  }));

  const handleReaction = (emojiType: EmojiType) => {
    selectionHaptic();
    toggleReaction.mutate({ contentType, objectId, emojiType });
    setShowPicker(false);
  };

  const handleShare = async () => {
    const deepLink = generateDeepLink(`${contentType}/${objectId}`);
    await shareContent(`Check this out on BibleWay`, deepLink);
    recordShare.mutate({ contentType, objectId });
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            onPress={() =>
              userReaction
                ? handleReaction(userReaction)
                : setShowPicker(!showPicker)
            }
            onLongPress={() => setShowPicker(!showPicker)}
            accessibilityLabel={
              userReaction
                ? `Remove your ${userReaction} reaction. ${reactionCount} total.`
                : `React to this ${contentType}. ${reactionCount} reactions.`
            }
            accessibilityRole="button"
            className="flex-row items-center mr-4"
          >
            <Text className="text-lg mr-1">
              {userReaction ? REACTION_EMOJI_MAP[userReaction] : "\u{1F64F}"}
            </Text>
            <Text
              className={`text-sm ${userReaction ? "text-primary font-semibold" : "text-textSecondary"}`}
            >
              {reactionCount > 0 ? reactionCount : ""}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.Comments, { contentType, objectId })
            }
            accessibilityLabel={`Open comments. ${commentCount} total.`}
            accessibilityRole="button"
            className="flex-row items-center"
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text className="text-sm text-textSecondary ml-1">
              {commentCount > 0 ? commentCount : ""}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleShare}
          accessibilityLabel={`Share this ${contentType}`}
          accessibilityRole="button"
          className="flex-row items-center"
        >
          <Ionicons
            name="share-outline"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {showPicker && (
        <Animated.View
          style={pickerAnimatedStyle}
          className="flex-row bg-surface rounded-full px-2 py-1.5 mt-2 self-start"
        >
          {REACTIONS.map((r) => (
            <Pressable
              key={r.type}
              onPress={() => handleReaction(r.type)}
              accessibilityLabel={`React with ${r.type}`}
              accessibilityRole="button"
              accessibilityState={{ selected: userReaction === r.type }}
              className={`px-2 py-1 rounded-full mx-0.5 ${
                userReaction === r.type ? "bg-primaryLight/20" : ""
              }`}
            >
              <Text className="text-xl">{r.emoji}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

export default React.memo(ReactionBar);
