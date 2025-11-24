import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoinModal from "@/components/modal/JoinModal";

// API
import { getRoom } from "@/api/roomApi";
import { joinRoom } from "@/api/authApi";

// Zustand stores
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";


// Hooks
import { useWebSocket } from "../hooks/useWebSocket";
import { useEditorSync } from "../hooks/useEditorSync";

// Tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";


export default function RoomPage() {
  const { roomSlug } = useParams();

  const [needJoin, setNeedJoin] = useState(true); // 로그인(참여) 필요 여부
  const [roomInfo, setRoomInfo] = useState(null);

  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const setRoomSlug = useRoomStore((s) => s.setRoomSlug);

  // 1. 방 Slug 저장 (전역으로 두면 WS 연결 로직이 편함)
  useEffect(() => {
    setRoomSlug(roomSlug);
  }, [roomSlug, setRoomSlug]);

  // 2. 방 정보 GET
  useEffect(() => {
    async function fetchRoom() {
      try {
        const data = await getRoom(roomSlug);
        setRoomInfo(data);
        console.log("방 정보:", data);
      } catch (err) {
        console.error("존재하지 않는 방!");
      }
    }
    fetchRoom();
  }, [roomSlug]);

  // 3. Tiptap Editor 인스턴스 생성 (token 없어도 editor는 먼저 생성 가능)
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Loading...</p>",
  });

  // 4. join-room (닉네임/비번 받았다는 가정)
  async function handleJoin(nickname, password) {
    const result = await joinRoom(roomSlug, { nickname, password });

    setAuth({
      token: result.token,
      nickname: result.nickname,
    });

    console.log("참여 성공:", result);

    setNeedJoin(false); // 모달 닫기
  }

  // UI는 없지만 이걸로 테스트:
  // 1) 페이지 열리자마자 자동 참여시키기 (임시)
  useEffect(() => {
    if (needJoin) {
      handleJoin("UserA", "1234");
    }
  }, [needJoin]);

  // 5. WebSocket 연결 (token이 있어야 연결됨)
  useWebSocket(roomSlug);

  // 6. Yjs <-> WS <-> Tiptap 동기화 hook
  useEditorSync(editor);

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col">

    {/* 1. 방 제목 헤더 */}
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          {roomInfo ? roomInfo.title : "방 불러오는 중..."}
        </h1>
        <p className="text-sm text-gray-500">Room: {roomSlug}</p>
      </div>

      {/* URL 복사 버튼 */}
      <button
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
      >
        URL 복사
      </button>
    </header>

    {/* 2. 메인 에디터 영역 */}
    <main className="flex-1 max-w-4xl w-full mx-auto mt-6 px-4 pb-20">
      {/* roomInfo 아직 없으면 로딩 UI */}
      {!roomInfo && (
        <div className="text-gray-500 text-center mt-20">방 정보를 불러오는 중...</div>
      )}

      {/* editor 준비 안 됨 */}
      {!editor && (
        <div className="mt-20 text-center text-gray-500">에디터 초기화 중...</div>
      )}

      {/* editor */}
      {editor && (
        <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
          <EditorContent editor={editor} />
        </div>
      )}
    </main>

    {/* 3. Join Modal */}
    {needJoin && (
      <JoinModal onSubmit={handleJoin} />
    )}
  </div>
);
}