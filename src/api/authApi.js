import { api } from "./client";

export const joinRoom = async (roomSlug, { nickname, password }) => {
  return await api.post(`room/${roomSlug}/join`, {
    json: { nickname, password }
  }).json();
};