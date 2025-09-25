import { apiName } from "@/api/apiName.js";

export const useSaveLevelHistory = async (
  levelId,
  gameId,
  points,
  gameTimeSeconds
) => {
  const obj = {
    levelId: levelId,
    gameId: gameId,
    points: points,
    gameTimeSeconds: gameTimeSeconds,
  };
  console.log("Сохраняю в историю:", obj);
  await fetch(`${apiName}/historylevels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
};

export const useGetLevelHistory = async (userId) => {
  const response = await fetch(`${apiName}/historylevels/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return;
  }

  const data = await response.json();
  return data;
};
