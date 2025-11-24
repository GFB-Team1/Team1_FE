import { api } from "./client";

export const createRoom = async () => {
  return await api.post("create-room").json();
};

export const getRoom = async (roomSlug) => {
  return await api.get(`room/${roomSlug}`).json();
};