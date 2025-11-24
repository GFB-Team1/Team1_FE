import { useState } from "react";
import { createRoom } from "@/api/roomApi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [createdSlug, setCreatedSlug] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCreateRoom(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const data = await createRoom(title); // title 넘겨줌
      setCreatedSlug(data.room_slug);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          새 방 만들기
        </h1>

        <form className="space-y-4" onSubmit={handleCreateRoom}>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              방 제목
            </label>
            <input
              type="text"
              placeholder="예: 11월 팀플 회의"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 bg-blue-600 text-white 
              rounded-lg font-semibold 
              hover:bg-blue-700 transition
              disabled:opacity-50
            "
          >
            {loading ? "생성 중..." : "방 만들기"}
          </button>
        </form>

        {/* 생성된 방 slug 표시 */}
        {createdSlug && (
          <div className="mt-4 text-center space-y-2">
            <p className="text-gray-700">방이 생성되었습니다!</p>

            <p className="font-mono text-blue-600 text-lg">
              {createdSlug}
            </p>

            <button
              onClick={() => navigate(`/room/${createdSlug}`)}
              className="
                mt-2 px-4 py-2 bg-green-600 text-white 
                rounded-lg hover:bg-green-700 transition
              "
            >
              방으로 이동하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}