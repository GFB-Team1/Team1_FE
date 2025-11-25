import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bg from "@/assets/background.png";
import { useAuthStore } from "@/stores/authStore";
import { joinRoom } from "@/api/authApi";
import { getRoom } from "@/api/roomApi";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);

  const navigate = useNavigate();
  const { roomSlug } = useParams(); // URL에서 room slug 가져오기
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const data = await getRoom(roomSlug);
        setRoomInfo(data);
      } catch (e) {
        setRoomInfo(null);
      } finally {
        setRoomLoading(false);
      }
    }
    fetchRoom();
  }, [roomSlug]);

  async function handleLogin() {
    if (!nickname.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const data = await joinRoom(roomSlug, { nickname, password });


      // 토큰 저장
      setAuth({ token: data.token, nickname: data.nickname });

      // 문서 편집 페이지로 이동
      navigate(`/editor/${roomSlug}`);
    } catch (err) {
      setErrorMsg("닉네임 또는 비밀번호가 올바르지 않습니다.");
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
      <div className="w-[40%] max-w-xl flex flex-col items-center justify-center">
        {roomLoading ? (
          <div className="flex items-center justify-center">
            <Spinner className="size-12" />
          </div>
        ) : (
          <div
            className="
              w-full max-w-xl
              py-10 px-12
              bg-white/40 backdrop-blur-none
              rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
              border border-white/20
              flex flex-col items-center
            "
          >
            <div className="flex flex-col gap-6 w-full items-stretch">
              <div className="flex items-center gap-4 justify-center">
                <div
                  className="px-5 py-2 rounded-full font-bold"
                  style={{
                    backgroundColor: "#79C189",
                    color: "#105B20",
                  }}
                >
                  {roomInfo?.title || "공유 문서"}
                </div>
                <div className="text-black font-semibold text-lg">
                  참여하기
                </div>
              </div>
              <input
                type="text"
                placeholder="아이디 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="
                  w-full px-4 py-3 bg-white rounded-xl text-gray-700
                  focus:ring-2 focus:ring-green-500 outline-none
                  shadow-sm
                "
              />

              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-4 py-3 bg-white rounded-xl text-gray-700
                  focus:ring-2 focus:ring-green-500 outline-none
                  shadow-sm
                "
              />
              {password.length < 4 && (
                <div className="text-sm text-black">
                  비밀번호는 최소 4글자 이상 입력
                </div>
              )}
              {/* 에러 메시지 */}
              {errorMsg && (
                <div className="text-red-700 text-sm font-medium">{errorMsg}</div>
              )}
            </div>
            {/* 버튼 */}
              <button
                onClick={handleLogin}
                disabled={loading || nickname.length < 1 || password.length < 4}
                className="
                  w-full py-3 px-12 mt-6 rounded-full text-white font-semibold
                  bg-[#43B85D]
                  shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                  hover:bg-[#3aa454] transition
                  disabled:opacity-50
                "
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
           
          </div>
        )}
      </div>
    </div>
  );
}