import { apiName } from "@/api/apiName.js";

export const useGetFiguresById = async (id) => {
  try {
    const response = await fetch(
      `${apiName}/level-use-figures/by-level/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch levles error:", error);
    throw error;
  }
};

export const useSaveFigures = async (levelId, figuresId) => {
  try {
    const promises = figuresId.map((figureId) => {
      return fetch(`${apiName}/level-use-figures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figureId,
          levelId,
        }),
      });
    });

    const responses = await Promise.all(promises);

    // Проверка, что все ок
    responses.forEach((res) => {
      if (!res.ok) {
        throw new Error("Ошибка при сохранении фигур");
      }
    });

    return responses;
  } catch (error) {
    console.error("Fetch levels error:", error);
    throw error;
  }
};
