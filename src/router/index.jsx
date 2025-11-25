// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoomPage from "@/pages/RoomPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/room/:roomSlug",
    element: <LoginPage />,
  },
  {
    path: "/editor/:roomSlug",
    element: (
      <ProtectedRoute>
        <RoomPage />
      </ProtectedRoute>
    ),
  },
]);