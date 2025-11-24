import { api } from "./client";

export const createRoom = async (title) => {
  return await api.post("create-room", {
    json: { title },
  }).json();
};

export const getRoom = async (roomSlug) => {
  return await api.get(`room/${roomSlug}`).json();
};