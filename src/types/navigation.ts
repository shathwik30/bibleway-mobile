// Navigation param lists for all stacks
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: { email: string; purpose: 'email_verification' | 'password_reset' };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  CreatePost: undefined;
  CreatePrayer: undefined;
  PostDetail: { postId: string };
  PrayerDetail: { prayerId: string };
  Comments: { contentType: 'post' | 'prayer'; objectId: string };
  Notifications: undefined;
  UserProfile: { userId: string };
  Followers: { userId: string };
  Following: { userId: string };
};

export type BibleStackParamList = {
  BibleTabs: undefined;
  BibleVersionSelect: undefined;
  BibleBookList: { bibleId: string };
  BibleChapterList: { bibleId: string; bookId: string };
  BibleVerse: { bibleId: string; chapterId: string };
  SegregatedSections: undefined;
  SegregatedChapters: { sectionId: string; sectionTitle: string };
  SegregatedPages: { chapterId: string; chapterTitle: string };
  SegregatedPageDetail: { pageId: string };
  Bookmarks: undefined;
  Notes: undefined;
  BibleSearch: undefined;
};

export type ShopStackParamList = {
  Shop: undefined;
  ProductDetail: { productId: string };
  Purchases: undefined;
  Downloads: undefined;
};

export type GamesStackParamList = {
  GamesList: undefined;
  TicTacToe: undefined;
  BibleCrossword: undefined;
  BibleQuiz: undefined;
  FindDifference: undefined;
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  LanguageSettings: undefined;
  PrivacySettings: undefined;
  BlockedUsers: undefined;
  FollowRequests: undefined;
  Followers: { userId: string };
  Following: { userId: string };
  PostAnalytics: { postId: string };
  BoostPost: { postId: string };
  BoostAnalytics: { boostId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  BibleTab: undefined;
  ShopTab: undefined;
  GamesTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
