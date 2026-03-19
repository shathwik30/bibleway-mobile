import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import AnimatedPressable from '../ui/AnimatedPressable';
import MediaCarousel from './MediaCarousel';
import ReactionBar from './ReactionBar';
import type { Prayer } from '@/types/models';

interface PrayerCardProps {
  prayer: Prayer;
}

function PrayerCard({ prayer }: PrayerCardProps) {
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = React.useState(false);

  const shouldTruncate = prayer.description.length > 200;
  const displayText = shouldTruncate && !expanded
    ? prayer.description.slice(0, 200) + '...'
    : prayer.description;

  return (
    <AnimatedPressable
      onPress={() => navigation.navigate('PrayerDetail', { prayerId: prayer.id })}
      className="bg-white border-b border-border"
    >
      <View className="px-4 pt-3">
        {/* Author Row */}
        <View className="flex-row items-center mb-2">
          <Pressable
            onPress={() => navigation.navigate('UserProfile', { userId: prayer.author.id })}
            className="flex-row items-center flex-1"
          >
            <Avatar source={prayer.author.profile_photo} name={prayer.author.full_name} size={40} />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-textPrimary">{prayer.author.full_name}</Text>
              <Text className="text-xs text-textSecondary">
                {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Title */}
        <Text className="text-base font-bold text-textPrimary mb-1">{prayer.title}</Text>

        {/* Description */}
        {prayer.description ? (
          <View className="mb-2">
            <Text className="text-sm text-textPrimary leading-5">{displayText}</Text>
            {shouldTruncate && !expanded && (
              <Pressable onPress={() => setExpanded(true)}>
                <Text className="text-primary text-sm font-medium mt-1">Read more</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>

      {/* Media */}
      {prayer.media.length > 0 && <MediaCarousel media={prayer.media} />}

      {/* Reactions & Actions */}
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
