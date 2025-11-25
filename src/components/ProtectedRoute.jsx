import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const { roomSlug } = useParams();

  // 토큰 없으면 로그인 페이지로 강제 이동
  if (!token) {
    return <Navigate to={`/room/${roomSlug}`} replace />;
  }

  return children;
}