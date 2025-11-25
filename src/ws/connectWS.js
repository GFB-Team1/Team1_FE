import { useAuthStore } from "@/stores/authStore";

export function connectWS(roomSlug) {
  const token = useAuthStore.getState().token;

  const ws = new WebSocket(
    `${import.meta.env.VITE_WS_URL}/ws/${roomSlug}?token=${token}`
  );

  return ws;
}