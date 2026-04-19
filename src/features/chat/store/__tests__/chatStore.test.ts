import { useChatStore } from "../chatStore";

describe("chatStore", () => {
  beforeEach(() => {
    useChatStore.setState({ unreadCount: 0 });
  });

  describe("initial state", () => {
    it("starts with unreadCount of 0", () => {
      const { unreadCount } = useChatStore.getState();
      expect(unreadCount).toBe(0);
    });
  });

  describe("setUnreadCount", () => {
    it("sets the unread count to the given value", () => {
      useChatStore.getState().setUnreadCount(5);
      expect(useChatStore.getState().unreadCount).toBe(5);
    });

    it("sets to zero", () => {
      useChatStore.setState({ unreadCount: 10 });
      useChatStore.getState().setUnreadCount(0);
      expect(useChatStore.getState().unreadCount).toBe(0);
    });
  });

  describe("incrementUnreadCount", () => {
    it("increments by 1", () => {
      useChatStore.setState({ unreadCount: 3 });
      useChatStore.getState().incrementUnreadCount();
      expect(useChatStore.getState().unreadCount).toBe(4);
    });

    it("increments from zero", () => {
      useChatStore.getState().incrementUnreadCount();
      expect(useChatStore.getState().unreadCount).toBe(1);
    });
  });

  describe("decrementUnreadCount", () => {
    it("decrements by 1 by default", () => {
      useChatStore.setState({ unreadCount: 5 });
      useChatStore.getState().decrementUnreadCount();
      expect(useChatStore.getState().unreadCount).toBe(4);
    });

    it("decrements by a custom amount", () => {
      useChatStore.setState({ unreadCount: 10 });
      useChatStore.getState().decrementUnreadCount(3);
      expect(useChatStore.getState().unreadCount).toBe(7);
    });

    it("does not go below 0", () => {
      useChatStore.setState({ unreadCount: 0 });
      useChatStore.getState().decrementUnreadCount();
      expect(useChatStore.getState().unreadCount).toBe(0);
    });

    it("clamps to 0 when decrement exceeds count", () => {
      useChatStore.setState({ unreadCount: 2 });
      useChatStore.getState().decrementUnreadCount(5);
      expect(useChatStore.getState().unreadCount).toBe(0);
    });
  });

  describe("clearUnreadCount", () => {
    it("resets count to 0", () => {
      useChatStore.setState({ unreadCount: 42 });
      useChatStore.getState().clearUnreadCount();
      expect(useChatStore.getState().unreadCount).toBe(0);
    });
  });
});
