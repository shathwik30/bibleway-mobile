import {
  AccountVisibility,
  BookmarkType,
  EmojiType,
  FollowStatus,
  Gender,
  HighlightColor,
  HighlightType,
  MediaType,
  NoteType,
  NotificationType,
  Platform,
} from './enums';

// Author (used in posts, prayers, comments, replies)
export interface Author {
  id: string;
  full_name: string;
  profile_photo: string | null;
}

// UserProfile (own profile - all fields)
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  preferred_language: string;
  country: string;
  phone_number: string;
  profile_photo: string | null;
  bio: string;
  account_visibility: AccountVisibility;
  hide_followers_list: boolean;
  is_email_verified: boolean;
  date_joined: string;
  age: number;
  follower_count: number;
  following_count: number;
  post_count: number;
  prayer_count: number;
}

// UserPublicProfile (other users - PII excluded)
export interface UserPublicProfile {
  id: string;
  full_name: string;
  gender: Gender;
  preferred_language: string;
  country: string;
  profile_photo: string | null;
  bio: string;
  account_visibility: AccountVisibility;
  hide_followers_list: boolean;
  date_joined: string;
  age: number;
  follower_count: number;
  following_count: number;
  post_count: number;
  prayer_count: number;
}

// UserListItem
export interface UserListItem {
  id: string;
  full_name: string;
  profile_photo: string | null;
  bio: string;
}

// MediaItem (for PostMedia / PrayerMedia)
export interface MediaItem {
  id: string;
  file: string;
  media_type: MediaType;
  order: number;
}

// Post (PostListSerializer fields)
export interface Post {
  id: string;
  author: Author;
  text_content: string;
  is_boosted: boolean;
  media: MediaItem[];
  reaction_count: number;
  comment_count: number;
  user_reaction: EmojiType | null;
  created_at: string;
  updated_at?: string;
}

// Prayer
export interface Prayer {
  id: string;
  author: Author;
  title: string;
  description: string;
  media: MediaItem[];
  reaction_count: number;
  comment_count: number;
  user_reaction: EmojiType | null;
  created_at: string;
  updated_at?: string;
}

// Comment
export interface Comment {
  id: string;
  user: Author;
  text: string;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

// Reply
export interface Reply {
  id: string;
  user: Author;
  text: string;
  created_at: string;
  updated_at: string;
}

// FollowRelationship
export interface FollowRelationship {
  id: string;
  follower: UserListItem;
  following: UserListItem;
  status: FollowStatus;
  created_at: string;
}

// BlockRelationship
export interface BlockRelationship {
  id: string;
  blocked: UserListItem;
  created_at: string;
}

// Notification
export interface Notification {
  id: string;
  sender: Author | null;
  notification_type: NotificationType;
  title: string;
  body?: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// SegregatedSection
export interface SegregatedSection {
  id: string;
  title: string;
  description: string;
  age_min: number;
  age_max: number;
  order: number;
  is_active: boolean;
  chapter_count: number;
  is_prioritized: boolean;
  created_at: string;
  updated_at: string;
}

// SegregatedChapter
export interface SegregatedChapter {
  id: string;
  section: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  page_count: number;
  created_at: string;
  updated_at: string;
}

// SegregatedPage (list)
export interface SegregatedPage {
  id: string;
  chapter: string;
  title: string;
  summary: string;
  youtube_url: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// SegregatedPageDetail
export interface SegregatedPageDetail extends SegregatedPage {
  content: string;
  section_title: string;
  chapter_title: string;
}

// Bookmark
export interface Bookmark {
  id: string;
  bookmark_type: BookmarkType;
  verse_reference: string;
  content_type: number | null;
  object_id: string | null;
  content_object: any;
  created_at: string;
}

// Highlight
export interface Highlight {
  id: string;
  highlight_type: HighlightType;
  color: HighlightColor;
  verse_reference: string;
  content_type: number | null;
  object_id: string | null;
  content_object: any;
  selection_start: number | null;
  selection_end: number | null;
  created_at: string;
}

// Note
export interface Note {
  id: string;
  note_type: NoteType;
  text: string;
  verse_reference: string;
  content_type: number | null;
  object_id: string | null;
  content_object: any;
  created_at: string;
  updated_at: string;
}

// Product (list)
export interface ProductListItem {
  id: string;
  title: string;
  cover_image: string;
  category: string;
  is_free: boolean;
  price_tier: string;
  apple_product_id: string;
  google_product_id: string;
  created_at: string;
}

// Product (detail)
export interface Product extends ProductListItem {
  description: string;
  price_display: string;
  download_count: number;
  download_url: string | null;
  is_purchased: boolean;
  updated_at: string;
}

// ProductInline (in purchases)
export interface ProductInline {
  id: string;
  title: string;
  cover_image: string;
  category: string;
  is_free: boolean;
}

// Purchase
export interface Purchase {
  id: string;
  product: ProductInline;
  platform: Platform;
  transaction_id: string;
  is_validated: boolean;
  created_at: string;
}

// VerseOfDay (UnifiedVerseResponse)
export interface VerseOfDay {
  id: string;
  bible_reference: string;
  verse_text: string;
  background_image: string | null;
  display_date: string;
  source: string;
}

// PostAnalytics
export interface PostAnalytics {
  views: number;
  reactions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
}

// PostBoost
export interface PostBoost {
  id: string;
  post: string;
  user: string;
  tier: string;
  platform: Platform;
  duration_days: number;
  is_active: boolean;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
}

// BoostAnalyticSnapshot
export interface BoostAnalyticSnapshot {
  id: string;
  boost: string;
  impressions: number;
  reach: number;
  engagement_rate: number;
  link_clicks: number;
  profile_visits: number;
  snapshot_date: string;
  created_at: string;
}

// BoostAnalyticsSummary (returned by boost analytics endpoint)
export interface BoostAnalyticsSummary {
  total_impressions: number;
  total_clicks: number;
  new_followers: number;
  total_engagements: number;
  snapshots: BoostAnalyticSnapshot[];
}
