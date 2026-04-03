import React from "react";
import { render, screen } from "@testing-library/react-native";
import MessageBubble from "../MessageBubble";
import type { ChatMessage } from "@/types/models";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => <Text>{props.name}</Text>,
  };
});

jest.mock("@/theme/colors", () => ({
  colors: {
    primary: { DEFAULT: "#4A6FA5", light: "#7B9FD4", dark: "#2D4A7A" },
    textTertiary: "#9CA3AF",
  },
}));

jest.mock("@/components/feed/StickerMessage", () => {
  const { Text } = require("react-native");
  return function MockStickerMessage({ text }: { text: string }) {
    return <Text testID="sticker-message">{text}</Text>;
  };
});

jest.mock("@/constants/stickers", () => ({
  isSticker: (text: string) => /^\[sticker:\d+\]$/.test(text),
}));

const baseSender = {
  id: "user-1",
  full_name: "Test User",
  profile_photo: null,
  age: 25,
};

const makeMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "msg-1",
  sender: baseSender,
  text: "Hello world",
  is_read: false,
  created_at: "2026-04-03T10:00:00Z",
  ...overrides,
});

describe("MessageBubble", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("text messages", () => {
    it("renders message text", () => {
      render(<MessageBubble message={makeMessage()} isMine={false} />);
      expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("renders timestamp", () => {
      render(<MessageBubble message={makeMessage()} isMine={false} />);
      expect(screen.getByText(/AM|PM/i)).toBeTruthy();
    });
  });

  describe("sticker messages", () => {
    it("renders StickerMessage for sticker text", () => {
      render(
        <MessageBubble
          message={makeMessage({ text: "[sticker:5]" })}
          isMine={false}
        />,
      );
      expect(screen.getByTestId("sticker-message")).toBeTruthy();
    });
  });

  describe("mine vs other", () => {
    it("renders without crashing for own message", () => {
      render(<MessageBubble message={makeMessage()} isMine={true} />);
      expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("renders without crashing for other message", () => {
      render(<MessageBubble message={makeMessage()} isMine={false} />);
      expect(screen.getByText("Hello world")).toBeTruthy();
    });
  });
});
