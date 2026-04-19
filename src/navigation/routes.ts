export const ROOT_ROUTES = {
  Auth: "Auth",
  Main: "Main",
} as const;

export const TAB_ROUTES = {
  HomeTab: "HomeTab",
  ChatTab: "ChatTab",
  BibleTab: "BibleTab",
  ShopTab: "ShopTab",
  GamesTab: "GamesTab",
  ProfileTab: "ProfileTab",
} as const;

export const AUTH_ROUTES = {
  Login: "Login",
  Register: "Register",
  OTPVerification: "OTPVerification",
  ForgotPassword: "ForgotPassword",
  ResetPassword: "ResetPassword",
  GoogleCompleteProfile: "GoogleCompleteProfile",
} as const;

export const HOME_ROUTES = {
  HomeFeed: "HomeFeed",
  CreatePost: "CreatePost",
  CreatePrayer: "CreatePrayer",
  PostDetail: "PostDetail",
  PrayerDetail: "PrayerDetail",
  Comments: "Comments",
  Notifications: "Notifications",
  UserProfile: "UserProfile",
  Followers: "Followers",
  Following: "Following",
} as const;

export const BIBLE_ROUTES = {
  BibleTabs: "BibleTabs",
  BibleVersionSelect: "BibleVersionSelect",
  BibleBookList: "BibleBookList",
  BibleChapterList: "BibleChapterList",
  BibleVerse: "BibleVerse",
  SegregatedSections: "SegregatedSections",
  SegregatedChapters: "SegregatedChapters",
  SegregatedPages: "SegregatedPages",
  SegregatedPageDetail: "SegregatedPageDetail",
  Bookmarks: "Bookmarks",
  Notes: "Notes",
  BibleSearch: "BibleSearch",
} as const;

export const SHOP_ROUTES = {
  Shop: "Shop",
  ProductDetail: "ProductDetail",
  Purchases: "Purchases",
  Downloads: "Downloads",
} as const;

export const GAMES_ROUTES = {
  GamesList: "GamesList",
  TicTacToe: "TicTacToe",
  BibleCrossword: "BibleCrossword",
  BibleQuiz: "BibleQuiz",
  FindDifference: "FindDifference",
} as const;

export const PROFILE_ROUTES = {
  MyProfile: "MyProfile",
  EditProfile: "EditProfile",
  Settings: "Settings",
  LanguageSettings: "LanguageSettings",
  BlockedUsers: "BlockedUsers",
  Followers: "Followers",
  Following: "Following",
  PostAnalytics: "PostAnalytics",
  BoostPost: "BoostPost",
  BoostAnalytics: "BoostAnalytics",
} as const;

export const CHAT_ROUTES = {
  ConversationList: "ConversationList",
  ChatRoom: "ChatRoom",
  NewChat: "NewChat",
} as const;

export const ROUTES = {
  ...ROOT_ROUTES,
  ...TAB_ROUTES,
  ...AUTH_ROUTES,
  ...HOME_ROUTES,
  ...BIBLE_ROUTES,
  ...SHOP_ROUTES,
  ...GAMES_ROUTES,
  ...PROFILE_ROUTES,
  ...CHAT_ROUTES,
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
