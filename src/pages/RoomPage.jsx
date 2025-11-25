import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import bg from "@/assets/wave-bg.png";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { File, Share2 } from "lucide-react";
import { getRoom } from "@/api/roomApi";

export default function RoomPage() {
  const { roomSlug } = useParams();
  const token = useAuthStore((state) => state.token);

  const [roomTitle, setRoomTitle] = useState("Loading...");
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState(null);
  const [ytext, setYText] = useState(null);
  const [localValue, setLocalValue] = useState("");
  const [hasLoadedFromDB, setHasLoadedFromDB] = useState(false);
  const [initialSynced, setInitialSynced] = useState(false);

  /* --------------------------------------------
     1) 방 제목 불러오기
  --------------------------------------------- */
  useEffect(() => {
    async function loadRoom() {
      try {
        const data = await getRoom(roomSlug);
        setRoomTitle(data.title);
      } catch {
        setRoomTitle("제목 없음");
      }
    }
    loadRoom();
  }, [roomSlug]);

  /* --------------------------------------------
     2) DB에서 문서 불러오기
  --------------------------------------------- */
  async function loadContentFromDB() {
    try {
      const res = await fetch(`http://localhost:8000/room/${roomSlug}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const { content } = await res.json();

      if (!content) return; // DB 비어있음

      const binary = atob(content);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      Y.applyUpdate(ydoc, bytes);
    } catch (err) {
      console.error("❌ DB load error:", err);
    }
  }

  /* --------------------------------------------
     3) WebSocket + Yjs 연결
  --------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    // A 방식: 방 이름을 provider roomName 파라미터에 넣지 않음
    const wsProvider = new WebsocketProvider(
      `ws://localhost:1234/${roomSlug}?token=${token}`,
      "",
      ydoc
    );

    const text = ydoc.getText("content");
    setYText(text);

    // WebSocket 상태 출력
    wsProvider.on("status", (e) => {
      console.log("WS STATUS:", e.status);
    });

    // 첫 sync 완료 → DB 자동 불러오기
    wsProvider.on("sync", async (synced) => {
      if (synced) {
        console.log("🔥 SYNCED with server");

        // 1회만 수행
        if (!hasLoadedFromDB) {
          setHasLoadedFromDB(true);
          await loadContentFromDB();
        }
        setInitialSynced(true);
      }
    });

    // 실시간 editor 변화 적용
    text.observe(() => {
      setLocalValue(text.toString());
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      ydoc.destroy();
    };
  }, [roomSlug, token, ydoc]);

  /* --------------------------------------------
     4) Editor 입력 핸들링
  --------------------------------------------- */
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);

    if (!ytext) return;

    ydoc.transact(() => {
      ytext.delete(0, ytext.length);
      ytext.insert(0, value);
    });
  };

  // /* --------------------------------------------
  //    5) 로딩 화면
  // --------------------------------------------- */
  // if (!initialSynced) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#F3FFE8]">
  //       <div className="text-lg text-gray-700">문서 불러오는 중...</div>
  //     </div>
  //   );
  // }

  /* --------------------------------------------
     6) 실제 UI
  --------------------------------------------- */
  return (
    
    <div
          className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          
      <div className="absolute top-5 left-10 z-5 w-[15%] rounded-xl shadow-lg border border-gray-300 bg-white overflow-hidden">
        {/* Green header bar */}
        <div className="w-full h-5 bg-[#73C276]"></div>

        {/* Title area */}
        <div className="px-4 py-2 text-center border-b border-gray-300">
          <div className="text-xl font-bold">{roomTitle}</div>
        </div>

        {/* Lined section */}
        <div className="px-6 py-3 space-y-2">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-[85%] h-[75%] bg-white rounded-3xl shadow-xl border border-gray-200 relative">
          <div className="w-full h-12 bg-[#92e5a1] rounded-t-3xl border-b border-green-200"></div>
          <Share2
  size={28}
  className="absolute top-3 right-4 text-black cursor-pointer z-20 hover:text-black/50"
  onClick={() => navigator.clipboard.writeText(window.location.href)}
/>
          <textarea
            value={localValue}
            onChange={handleChange}h
            className="w-full h-[calc(100%-3rem)] text-lg p-6 mt-3 bg-transparent resize-none outline-none"
          />
        </div>
      </div>
    </div>
  );
}