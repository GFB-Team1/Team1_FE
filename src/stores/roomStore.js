import { create } from "zustand";

export const useRoomStore = create((set) => ({
  roomSlug: null,
  ydoc: null,
  websocket: null,

  setRoomSlug: (roomSlug) => set({ roomSlug }),
  setYDoc: (ydoc) => set({ ydoc }),
  setWebSocket: (ws) => set({ websocket: ws }),
}));