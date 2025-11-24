// src/components/JoinModal.jsx
import { useState } from "react";

export default function JoinModal({ onSubmit }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nickname || !password) return;
    onSubmit(nickname, password);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          방 참여하기
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nickname */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              type="text"
              placeholder="예: 민서"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="방 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full py-2
              bg-blue-600 text-white 
              font-semibold
              rounded-lg
              hover:bg-blue-700 active:bg-blue-800
              transition
            "
          >
            참여하기
          </button>
        </form>
      </div>
    </div>
  );
}