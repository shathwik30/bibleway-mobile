// Mock dependencies before importing the store
jest.mock("@/lib/storage", () => {
  const store: Record<string, string> = {};
  return {
    mmkvStorage: {
      getString: jest.fn((key: string) => store[key]),
      setString: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      getBoolean: jest.fn((key: string) => {
        const v = store[key];
        if (v === undefined) return undefined;
        return v === "true";
      }),
      setBoolean: jest.fn((key: string, value: boolean) => {
        store[key] = String(value);
      }),
      delete: jest.fn((key: string) => {
        delete store[key];
      }),
      clearAll: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    },
  };
});

jest.mock("@/constants/languages", () => ({
  DEFAULT_LANGUAGE: "en",
}));

import { useAppStore } from "../appStore";
import { mmkvStorage } from "@/lib/storage";

describe("appStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      language: "en",
      hasCompletedOnboarding: false,
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("has default language of en", () => {
      expect(useAppStore.getState().language).toBe("en");
    });

    it("has hasCompletedOnboarding as false by default", () => {
      expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    });
  });

  describe("setLanguage", () => {
    it("updates the language in the store", () => {
      useAppStore.getState().setLanguage("es");
      expect(useAppStore.getState().language).toBe("es");
    });

    it("persists the language to mmkvStorage", () => {
      useAppStore.getState().setLanguage("fr");
      expect(mmkvStorage.setString).toHaveBeenCalledWith("language", "fr");
    });

    it("can change language multiple times", () => {
      useAppStore.getState().setLanguage("de");
      useAppStore.getState().setLanguage("ja");
      expect(useAppStore.getState().language).toBe("ja");
      expect(mmkvStorage.setString).toHaveBeenCalledTimes(2);
    });
  });

  describe("setOnboarded", () => {
    it("sets hasCompletedOnboarding to true", () => {
      useAppStore.getState().setOnboarded();
      expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
    });

    it("persists onboarded flag to mmkvStorage", () => {
      useAppStore.getState().setOnboarded();
      expect(mmkvStorage.setBoolean).toHaveBeenCalledWith("onboarded", true);
    });

    it("remains true after being set", () => {
      useAppStore.getState().setOnboarded();
      useAppStore.getState().setOnboarded();
      expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
    });
  });
});
