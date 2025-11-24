import ky from "ky";

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});