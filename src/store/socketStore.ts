import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  connectSocket: (baseUrl: string, userId: string, websiteId: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: (baseUrl, userId, websiteId) => {
    if (get().socket) {
      console.log("Socket already connected");
      return;
    }

    console.log("Connecting socket...");
    const newSocket = io(baseUrl, { transports: ["websocket"] });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      newSocket.emit("add-new-user", { userId, websiteId });
    });

    newSocket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("Disconnecting socket...");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
