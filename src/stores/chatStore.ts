import { create } from "zustand";

interface ChatState {
  unreadCount: number;
  activeConversationId: string | null;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (by?: number) => void;
  clearUnreadCount: () => void;
  setActiveConversationId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  unreadCount: 0,
  activeConversationId: null,

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  decrementUnreadCount: (by = 1) =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - by) })),

  clearUnreadCount: () => set({ unreadCount: 0 }),

  setActiveConversationId: (id) => set({ activeConversationId: id }),
}));
