export type EmojiType = 'praying_hands' | 'heart' | 'fire' | 'amen' | 'cross';
export type MediaType = 'image' | 'video';
export type Gender = 'male' | 'female' | 'prefer_not_to_say';
export type AccountVisibility = 'public' | 'private';
export type FollowStatus = 'accepted' | 'pending';
export type BookmarkType = 'api_bible' | 'segregated';
export type HighlightType = 'api_bible' | 'segregated';
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';
export type NoteType = 'api_bible' | 'segregated';
export type Platform = 'ios' | 'android';
export type ReportReason = 'inappropriate' | 'spam' | 'false_teaching' | 'other';
export type ReportContentType = 'post' | 'prayer' | 'comment' | 'user';
export type NotificationType =
  | 'follow'
  | 'reaction'
  | 'comment'
  | 'reply'
  | 'share'
  | 'boost_live'
  | 'boost_digest'
  | 'new_message'
  | 'missed_call'
  | 'prayer_comment'
  | 'system_broadcast';
