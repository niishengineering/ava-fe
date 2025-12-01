// // store/multiChatStore.ts
// import { create } from "zustand";

// interface ChatTab {
//   id: string;
//   chatData: any; // Replace with your Chat type
//   customerId: string;
//   customerName: string;
// }

// interface MultiChatStore {
//   openChats: ChatTab[];
//   activeChatId: string | null;

//   // Actions
//   openChat: (chat: any) => void;
//   closeChat: (chatId: string) => void;
//   setActiveChat: (chatId: string) => void;
//   closeAllChats: () => void;
// }

// const useMultiChatStore = create<MultiChatStore>((set, get) => ({
//   openChats: [],
//   activeChatId: null,

//   openChat: (chatData) => {
//     const { openChats } = get();
//     const chatId = chatData.chat.id;

//     // Check if chat is already open
//     const existingChat = openChats.find((c) => c.id === chatId);

//     if (existingChat) {
//       // Just set it as active
//       set({ activeChatId: chatId });
//     } else {
//       // Add new chat tab
//       const newChat: ChatTab = {
//         id: chatId,
//         chatData,
//         customerId: chatData.chat.customer.id,
//         customerName:
//           chatData.chat.customer.name || `v${chatData.chat.customer.id}`,
//       };

//       set({
//         openChats: [...openChats, newChat],
//         activeChatId: chatId,
//       });
//     }
//   },

//   closeChat: (chatId) => {
//     const { openChats, activeChatId } = get();
//     const updatedChats = openChats.filter((c) => c.id !== chatId);

//     // If closing the active chat, switch to another
//     let newActiveChatId = activeChatId;
//     if (activeChatId === chatId) {
//       if (updatedChats.length > 0) {
//         // Switch to the last chat in the list
//         newActiveChatId = updatedChats[updatedChats.length - 1].id;
//       } else {
//         newActiveChatId = null;
//       }
//     }

//     set({
//       openChats: updatedChats,
//       activeChatId: newActiveChatId,
//     });
//   },

//   setActiveChat: (chatId) => {
//     set({ activeChatId: chatId });
//   },

//   closeAllChats: () => {
//     set({ openChats: [], activeChatId: null });
//   },
// }));

// export default useMultiChatStore;
// store/multiChatStore.ts
import { create } from "zustand";

interface ChatTab {
  id: string;
  chatData: any; // Replace with your Chat type
  customerId: string;
  customerName: string;
}

interface MultiChatStore {
  openChats: ChatTab[];
  activeChatId: string | null;

  isOverlayOpen: boolean; // ⭐ NEW

  // Actions
  openChat: (chat: any) => void;
  closeChat: (chatId: string) => void;
  setActiveChat: (chatId: string) => void;
  closeAllChats: () => void;

  openOverlay: () => void; // ⭐ NEW
  closeOverlay: () => void; // ⭐ NEW
}

const useMultiChatStore = create<MultiChatStore>((set, get) => ({
  openChats: [],
  activeChatId: null,

  // ⭐ Add this
  isOverlayOpen: false,

  openChat: (chatData) => {
    const { openChats } = get();
    const chatId = chatData.chat.id;

    // Check if chat is already open
    const existingChat = openChats.find((c) => c.id === chatId);

    if (existingChat) {
      set({
        activeChatId: chatId,
        isOverlayOpen: true, // ⭐ OPEN OVERLAY WHEN CHAT IS CLICKED
      });
    } else {
      const newChat: ChatTab = {
        id: chatId,
        chatData,
        customerId: chatData.chat.customer.id,
        customerName:
          chatData.chat.customer.name || `v${chatData.chat.customer.id}`,
      };

      set({
        openChats: [...openChats, newChat],
        activeChatId: chatId,
        isOverlayOpen: true, // ⭐ OPEN OVERLAY
      });
    }
  },

  closeChat: (chatId) => {
    const { openChats, activeChatId } = get();
    const updatedChats = openChats.filter((c) => c.id !== chatId);

    let newActiveChatId = activeChatId;

    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        newActiveChatId = updatedChats[updatedChats.length - 1].id;
      } else {
        newActiveChatId = null;
      }
    }

    set({
      openChats: updatedChats,
      activeChatId: newActiveChatId,
      isOverlayOpen: updatedChats.length > 0, // ⭐ CLOSE OVERLAY IF NO CHAT LEFT
    });
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId, isOverlayOpen: true });
  },

  closeAllChats: () => {
    set({ openChats: [], activeChatId: null, isOverlayOpen: false });
  },

  // ⭐ NEW ACTIONS
  openOverlay: () => set({ isOverlayOpen: true }),
  closeOverlay: () => set({ isOverlayOpen: false }),
}));

export default useMultiChatStore;
