import { useNotificationStore } from "../notificationStore";

describe("notificationStore", () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useNotificationStore.setState({ unreadCount: 0 });
  });

  describe("initial state", () => {
    it("starts with unreadCount of 0", () => {
      const { unreadCount } = useNotificationStore.getState();
      expect(unreadCount).toBe(0);
    });
  });

  describe("setUnreadCount", () => {
    it("sets the unread count to the given value", () => {
      useNotificationStore.getState().setUnreadCount(5);
      expect(useNotificationStore.getState().unreadCount).toBe(5);
    });

    it("can set to zero", () => {
      useNotificationStore.getState().setUnreadCount(10);
      useNotificationStore.getState().setUnreadCount(0);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it("handles large numbers", () => {
      useNotificationStore.getState().setUnreadCount(9999);
      expect(useNotificationStore.getState().unreadCount).toBe(9999);
    });
  });

  describe("decrementUnreadCount", () => {
    it("decrements the unread count by 1", () => {
      useNotificationStore.setState({ unreadCount: 5 });
      useNotificationStore.getState().decrementUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(4);
    });

    it("does not go below 0", () => {
      useNotificationStore.setState({ unreadCount: 0 });
      useNotificationStore.getState().decrementUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it("clamps to 0 when at 1", () => {
      useNotificationStore.setState({ unreadCount: 1 });
      useNotificationStore.getState().decrementUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it("decrements correctly when called multiple times", () => {
      useNotificationStore.setState({ unreadCount: 3 });
      useNotificationStore.getState().decrementUnreadCount();
      useNotificationStore.getState().decrementUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(1);
    });
  });

  describe("clearUnreadCount", () => {
    it("resets unread count to 0", () => {
      useNotificationStore.setState({ unreadCount: 42 });
      useNotificationStore.getState().clearUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it("is a no-op when already 0", () => {
      useNotificationStore.setState({ unreadCount: 0 });
      useNotificationStore.getState().clearUnreadCount();
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });
});
