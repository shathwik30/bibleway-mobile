import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import AnimatedPressable from '../ui/AnimatedPressable';
import MediaCarousel from './MediaCarousel';
import ReactionBar from './ReactionBar';
import BoostedBadge from './BoostedBadge';
import type { Post } from '@/types/models';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = React.useState(false);

  const shouldTruncate = post.text_content.length > 200;
  const displayText = shouldTruncate && !expanded
    ? post.text_content.slice(0, 200) + '...'
    : post.text_content;

  return (
    <AnimatedPressable
      onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
      className="bg-white border-b border-border"
    >
      <View className="px-4 pt-3">
        {/* Author Row */}
        <View className="flex-row items-center mb-2">
          <Pressable
            onPress={() => navigation.navigate('UserProfile', { userId: post.author.id })}
            className="flex-row items-center flex-1"
          >
            <Avatar source={post.author.profile_photo} name={post.author.full_name} size={40} />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="text-sm font-semibold text-textPrimary">{post.author.full_name}</Text>
                {post.author.age ? <Text className="text-xs text-textTertiary ml-1.5">· {post.author.age}y</Text> : null}
              </View>
              <Text className="text-xs text-textSecondary">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </Text>
            </View>
          </Pressable>
          {post.is_boosted && <BoostedBadge />}
        </View>

        {/* Text Content */}
        {post.text_content ? (
          <View className="mb-2">
            <Text className="text-base text-textPrimary leading-6">{displayText}</Text>
            {shouldTruncate && !expanded && (
              <Pressable onPress={() => setExpanded(true)}>
                <Text className="text-primary text-sm font-medium mt-1">Read more</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>

      {/* Media */}
      {post.media.length > 0 && <MediaCarousel media={post.media} />}

      {/* Reactions & Actions */}
      <View className="px-4 py-2">
        <ReactionBar
          contentType="post"
          objectId={post.id}
          reactionCount={post.reaction_count}
          commentCount={post.comment_count}
          userReaction={post.user_reaction}
        />
      </View>
    </AnimatedPressable>
  );
}

export default React.memo(PostCard);
