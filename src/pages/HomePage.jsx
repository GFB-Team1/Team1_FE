import { useState } from "react";
import { createRoom } from "@/api/roomApi";
import { useNavigate } from "react-router-dom";
import bg from "@/assets/background.png"; 
import { File } from "lucide-react";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [createdSlug, setCreatedSlug] = useState(null);
  const [loading, setLoading] = useState(false);


  async function handleCreateRoom(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const data = await createRoom(title);
      setCreatedSlug(data.room_slug);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
  className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: `url(${bg})`,
  }}
>
  {/* 가장 바깥 박스(Glassmorphism) */}
  <div
    className="
      w-full max-w-xl p-10
      bg-white/40 backdrop-blur-none
      rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
      border border-white/20
      space-y-10
    "
  >
    {/* 차상단 박스 */}
    <div
      className="
        p-6 rounded-2xl shadow-md 
        flex flex-col gap-4
      "
      style={{
        background: "radial-gradient(circle at top left, #84E791, #70C582)"
      }}
    >
      <div className="flex text-white items-center gap-3 text-lg font-semibold">
        <File /> 문서 제목
      </div>

      <input
        type="text"
        placeholder="문서 제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="
          px-4 py-3 bg-white rounded-xl text-gray-700
          focus:ring-2 focus:ring-green-500 outline-none
          shadow-sm
        "
      />
      {title.length < 1 && (
        <div className="text-sm text-white/90">
          문서 제목은 최소 1글자 이상 입력해야 합니다.
        </div>
      )}
      {createdSlug && (
        <div className="mt-2 text-sm font-medium text-gray-500">
          생성된 문서 링크:{" "}
          <span className="break-all underline">
            {window.location.origin}/room/{createdSlug}
          </span>
        </div>
      )}
    </div>

    {/* 만들기 버튼 */}
    <div className="flex justify-end">
      <button
        type="submit"
        onClick={handleCreateRoom}
        disabled={loading || title.length < 1}
        className="
          w-40 py-3 rounded-full text-white font-semibold
          bg-[#43B85D]
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          hover:bg-[#3aa454] transition
          disabled:opacity-50
        "
      >
        {loading ? "만들기 중..." : "만들기"}
      </button>
    </div>
  </div>
</div>
  );
}