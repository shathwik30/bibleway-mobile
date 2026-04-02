/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-pager-view|react-native-toast-message|react-native-webview|react-native-iap|react-native-markdown-display|nativewind|@gorhom/bottom-sheet|@tanstack/react-query|date-fns|zustand|axios|lodash|expo-modules-core))",
    "node_modules/react-native-reanimated/plugin/",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@stores/(.*)$": "<rootDir>/src/stores/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@navigation/(.*)$": "<rootDir>/src/navigation/$1",
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{ts,tsx}",
  ],
};
