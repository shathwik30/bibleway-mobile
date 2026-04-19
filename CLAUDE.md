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

Feature-folder layout. Each product feature owns its screens, components,
hooks, store slice, services, and data. Shared primitives (`components/ui/`,
`components/layout/`, `theme/`, `utils/`, generic `constants/` and `types/`)
live at the top level.

```
src/
  api/
    client.ts          # Axios client: token refresh, dedup, 3x retry
    endpoints.ts       # Typed endpoint constants
    pagination.ts      # Infinite-query page helpers
  components/          # Shared primitives only (NOT feature-specific)
    layout/            # SafeAreaScreen, ScreenHeader, KeyboardAvoidingWrapper, InfiniteList
    ui/                # Button, Input, Modal, BottomSheet, Avatar, Toast, etc.
      skeletons/       # Per-variant skeleton components
  constants/           # Global constants only
    api.ts             # API base URL, cache durations
    app.ts             # Top-level constants
    languages.ts       # Supported language list
    brand.ts           # Third-party brand colors (Google)
  data/
    countries.ts
  features/            # ONE FOLDER PER PRODUCT FEATURE
    auth/              # Sign-in, register, OTP, reset — screens/hooks/store
    bible/             # Bible reader, bookmarks, notes, segregated — screens/components/hooks/services
    chat/              # Conversations, chat room — screens/components/hooks/store
    feed/              # Home feed, posts, prayers, comments, notifications —
                       #   screens/components/hooks/store/constants
    games/             # Crossword, quiz, find-difference, tic-tac-toe —
                       #   screens/constants/data/utils
    profile/           # Profile view/edit, settings, followers, boost —
                       #   screens/components/hooks
    shop/              # Products, purchases, downloads — screens/components/hooks/services
  hooks/               # Generic hooks only (useSignedUrl)
  lib/                 # Shared low-level helpers
    storage.ts         # MMKV storage wrapper
    secureStorage.ts   # expo-secure-store wrapper
    pushNotifications.ts
    firebase.ts
    biometrics.ts
    translate.ts
    i18nTranslate.ts
    imageCompressor.ts
    share.ts
    deepLinking.ts
    haptics.ts
    confirm.ts
    pages.ts
    s3Presign.ts       # [CRITICAL: move to backend — see file header]
  navigation/
    RootNavigator.tsx
    MainTabNavigator.tsx
    *StackNavigator.tsx
    routes.ts          # Route name constants (use instead of raw strings)
    linking.ts
  providers/           # AppProviders, NavigationProvider, QueryProvider, I18nProvider
  store/               # Only app-wide state — feature stores live inside features/*/store/
    appStore.ts
  theme/
    colors.ts          # Theme tokens (+ feedback.*, shadow)
    fonts.ts           # Shared font StyleSheet
    spacing.ts
    typography.ts
  types/
    api.ts             # Generic ApiResponse<T>, PaginatedResponse<T>, AuthTokens
    enums.ts
    models.ts          # Data model interfaces
    navigation.ts      # RootStackParamList + per-stack ParamList
  utils/
    parseError.ts      # normalize unknown → user-safe string
    logger.ts          # env-gated console wrapper
```

### Key Patterns

**API Layer**: Axios client in `src/api/client.ts` with auto token refresh, request deduplication, and exponential backoff retry (3x). Endpoints centralized in `src/api/endpoints.ts`. All calls return typed responses.

**Types**: Comprehensive types in `src/types/` — `models.ts` has 50+ interfaces covering all data models. `enums.ts` has string literal union types. `navigation.ts` has full param list types with global declaration.

**State Management**:
- **Server state**: TanStack React Query. Query hooks live in each feature's `hooks/` folder.
- **Client state**: Zustand. Feature-specific stores under `src/features/<name>/store/`; app-wide state in `src/store/`.
- **Form state**: React Hook Form.
- **Persistent state**: MMKV via `src/lib/storage.ts`; secure tokens via `src/lib/secureStorage.ts`.

**Navigation**: React Navigation 7.x with typed param lists. 6 bottom tabs (Home, Chat, Bible, Shop, Games, Profile), each with its own stack navigator. Deep linking via `bibleway://` scheme.

**Styling**: NativeWind (Tailwind CSS for React Native). Theme colors in `src/theme/colors.ts`. Primary: `#59021a`. Always use theme tokens, not hardcoded hex colors.

**Component Imports**: Feature components live under `src/features/<name>/components/` and are imported via absolute paths (e.g. `@/features/feed/components/PostCard`). Shared primitives are imported from `@/components/ui/*` and `@/components/layout/*`. Barrel `index.ts` files exist where multiple components want to be exported together.

**Response Envelope**: Backend returns `{"message": "...", "data": {...}}`. The API client unwraps this automatically.

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `src/*`
- All imports use absolute `@/` paths. Relative paths are reserved for sibling files inside the same folder (e.g. `./types` inside a feature's `screens/crossword/`).

## Environment

Uses `.env` for API URL and service keys. Key vars: `API_URL`, `GOOGLE_WEB_CLIENT_ID`, `UPLOADTHING_TOKEN`.

## Key Integrations

- API Bible (verse content)
- Google Sign-In (`@react-native-google-signin`)
- Expo Push Notifications
- Apple/Google IAP (`react-native-iap`)
- MMKV (fast key-value storage)
- Haptics, TTS, Biometrics
