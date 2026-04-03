import { create } from "zustand";

interface ChatState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (by?: number) => void;
  clearUnreadCount: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  unreadCount: 0,

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  decrementUnreadCount: (by = 1) =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - by) })),

  clearUnreadCount: () => set({ unreadCount: 0 }),
}));
