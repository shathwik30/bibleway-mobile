type LogArgs = readonly unknown[];

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export const logger = {
  debug: (...args: LogArgs): void => {
    if (isDev) console.log("[debug]", ...args);
  },
  info: (...args: LogArgs): void => {
    if (isDev) console.info("[info]", ...args);
  },
  warn: (...args: LogArgs): void => {
    console.warn("[warn]", ...args);
  },
  error: (...args: LogArgs): void => {
    console.error("[error]", ...args);
  },
} as const;
