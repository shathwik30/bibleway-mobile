import * as Sentry from '@sentry/react-native';

export function initSentry(): void {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    tracesSampleRate: 0.2,
    enabled: !__DEV__,
  });
}

export function captureError(error: Error, context?: Record<string, any>): void {
  if (context) {
    Sentry.setContext('extra', context);
  }
  Sentry.captureException(error);
}
