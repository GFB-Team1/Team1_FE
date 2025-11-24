import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  nickname: null,

  setAuth: ({ token, nickname }) =>
    set({ token, nickname }),

  clearAuth: () => set({ token: null, nickname: null }),
}));