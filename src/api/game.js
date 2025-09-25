import { apiName } from "@/api/apiName.js";

export const useSaveGame = async (userId) => {
  const response = await fetch(`${apiName}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId }),
  });

  if (!response.ok) {
    return;
  }

  const data = await response.json();
  return data;
};
