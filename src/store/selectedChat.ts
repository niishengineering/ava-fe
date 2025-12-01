import { create } from "zustand";

interface ChatData {
  chat: any | null;
  lastMessage: any | null;
}

interface ChatStore {
  data: ChatData | null;

  getChat: () => any | null;
  getLastMessage: () => any | null;

  setChatData: (data: ChatData) => void;
  updateChat: (chat: any) => void;
  updateLastMessage: (lastMessage: any) => void;

  clearChat: () => void;
}

export const useSelectedChatStore = create<ChatStore>((set, get) => ({
  data: null,

  getChat: () => get().data?.chat || null,
  getLastMessage: () => get().data?.lastMessage || null,

  setChatData: (data) => set({ data }),

  updateChat: (chat) =>
    set((state) => ({
      data: {
        chat,
        lastMessage: state.data?.lastMessage ?? null, // 🟢 keep previous lastMessage
      },
    })),

  updateLastMessage: (lastMessage) =>
    set((state) => ({
      data: {
        chat: state.data?.chat ?? null, // 🟢 keep previous chat
        lastMessage,
      },
    })),

  clearChat: () => set({ data: null }),
}));
