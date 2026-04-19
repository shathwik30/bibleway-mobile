import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    email: string;
    purpose: "email_verification" | "password_reset";
  };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  GoogleCompleteProfile: {
    email: string;
    fullName: string;
    profilePhoto: string;
    idToken: string;
  };
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  CreatePost: undefined;
  CreatePrayer: undefined;
  PostDetail: { postId: string };
  PrayerDetail: { prayerId: string };
  Comments: { contentType: "post" | "prayer"; objectId: string };
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
  BibleSearch: { bibleId?: string } | undefined;
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
  BlockedUsers: undefined;
  Followers: { userId: string };
  Following: { userId: string };
  PostAnalytics: { postId: string };
  BoostPost: { postId: string };
  BoostAnalytics: { boostId: string };
};

export type ChatStackParamList = {
  ConversationList: undefined;
  ChatRoom: { conversationId: string; otherUser: { id: string; full_name: string; profile_photo: string | null; age: number } };
  NewChat: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ChatTab: NavigatorScreenParams<ChatStackParamList> | undefined;
  BibleTab: NavigatorScreenParams<BibleStackParamList> | undefined;
  ShopTab: NavigatorScreenParams<ShopStackParamList> | undefined;
  GamesTab: NavigatorScreenParams<GamesStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends
        HomeStackParamList,
        BibleStackParamList,
        ShopStackParamList,
        GamesStackParamList,
        ProfileStackParamList,
        ChatStackParamList,
        MainTabParamList {}
  }
}
