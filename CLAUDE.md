# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

React Native 0.83.4 + Expo 55 mobile app (iOS/Android) for Bibleway, a Christian social media + Bible learning platform. TypeScript 5.9, NativeWind (Tailwind CSS), TanStack React Query 5. Connects to the Django REST API backend.

## Common Commands

```bash
# Development
npx expo start           # Start Expo dev server
npx expo start --clear   # Clear cache and start

# Build
eas build --profile development --platform ios
eas build --profile development --platform android

# Quality
npx tsc --noEmit         # Type check
npm test                 # Run tests (Jest)

# Linting
npx eslint src/
```

## Architecture

### Directory Structure

```
src/
  api/
    client.ts          # Axios-based API client with token refresh, retry, dedup
    endpoints.ts       # Centralized API endpoint constants
    pagination.ts      # Infinite query pagination helpers
  components/
    bible/             # Bible-specific components (+ index.ts barrel)
    chat/              # Chat components (+ index.ts barrel)
    feed/              # Feed components: PostCard, PrayerCard, etc. (+ index.ts barrel)
    layout/            # Layout wrappers: SafeAreaScreen, ScreenHeader (+ index.ts barrel)
    profile/           # Profile components (+ index.ts barrel)
    shop/              # Shop components (+ index.ts barrel)
    ui/                # Reusable UI primitives: Button, Input, Modal, etc. (+ index.ts barrel)
  constants/
    api.ts             # Cache durations, API config
    app.ts             # App constants
    games/             # Game-specific: storageKeys, level data
    languages.ts       # Supported languages list
    reactions.ts       # Reaction emoji definitions
    stickers.ts        # Sticker GIF mappings
  data/
    countries.ts       # Country data (names, codes, flags, dial codes)
  hooks/               # Custom hooks: useAuth, useBible, useChat, useProfile, useSocial, useShop
  lib/
    gameProgress.ts    # Shared game progress persistence
    pages.ts           # Infinite query page flattening
    storage.ts         # MMKV storage wrapper
  navigation/          # React Navigation setup
    RootNavigator.tsx  # Auth check -> AuthNavigator or MainTabNavigator
    MainTabNavigator.tsx # 6 bottom tabs
    *StackNavigator.tsx  # Per-tab stack navigators
  providers/           # Context providers (Navigation, QueryClient)
  screens/             # Feature-grouped screens
    auth/              # Login, Register, OTP, ForgotPassword, ResetPassword
    bible/             # Bible browsing, search, bookmarks, notes, segregated pages
    chat/              # Conversations, chat room, new chat
    games/             # Quiz, crossword, find-difference, tic-tac-toe
    home/              # Feed, create post/prayer, comments, notifications
    profile/           # Profile, edit, settings, boost analytics, followers
    shop/              # Products, purchases, downloads
  stores/              # Zustand stores
    authStore.ts       # User, tokens, auth state
    appStore.ts        # App-level state
    chatStore.ts       # Unread counts, active conversation
    notificationStore.ts # Notification state
  theme/               # Colors, spacing, typography
  types/               # TypeScript interfaces
    api.ts             # ApiResponse<T>, PaginatedResponse<T>, AuthTokens
    enums.ts           # EmojiType, MediaType, Gender, NotificationType, etc.
    models.ts          # All data model interfaces (Post, Prayer, User, Bible, etc.)
    navigation.ts      # React Navigation param list types
```

### Key Patterns

**API Layer**: Axios client in `src/api/client.ts` with auto token refresh, request deduplication, and exponential backoff retry (3x). Endpoints centralized in `src/api/endpoints.ts`. All calls return typed responses.

**Types**: Comprehensive types in `src/types/` — `models.ts` has 50+ interfaces covering all data models. `enums.ts` has string literal union types. `navigation.ts` has full param list types with global declaration.

**State Management**:
- **Server state**: TanStack React Query (hooks in `src/hooks/`)
- **Client state**: Zustand stores (auth, app, chat, notification)
- **Form state**: React Hook Form
- **Persistent state**: MMKV storage (`src/lib/storage.ts`)

**Navigation**: React Navigation 7.x with typed param lists. 6 bottom tabs (Home, Chat, Bible, Shop, Games, Profile), each with its own stack navigator. Deep linking via `bibleway://` scheme.

**Styling**: NativeWind (Tailwind CSS for React Native). Theme colors in `src/theme/colors.ts`. Primary: `#59021a`. Always use theme tokens, not hardcoded hex colors.

**Component Imports**: Each component subdirectory has an `index.ts` barrel file. Import via `@/components/feed` instead of `@/components/feed/PostCard`.

**Response Envelope**: Backend returns `{"message": "...", "data": {...}}`. The API client unwraps this automatically.

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` -> `src/*`
- `@/components/*`, `@/screens/*`, `@/hooks/*`, `@/stores/*`, `@/types/*`, etc.

## Environment

Uses `.env` for API URL and service keys. Key vars: `API_URL`, `GOOGLE_WEB_CLIENT_ID`, `UPLOADTHING_TOKEN`.

## Key Integrations

- API Bible (verse content)
- Google Sign-In (`@react-native-google-signin`)
- Expo Push Notifications
- Apple/Google IAP (`react-native-iap`)
- MMKV (fast key-value storage)
- Haptics, TTS, Biometrics
