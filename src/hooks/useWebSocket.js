import { useEffect } from "react";
import { connectWS } from "../ws/connectWS";
import { useRoomStore } from "../store/roomStore";

export function useWebSocket(roomSlug) {
  const setWebSocket = useRoomStore((s) => s.setWebSocket);

  useEffect(() => {
    const ws = connectWS(roomSlug);
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomSlug, setWebSocket]);
}