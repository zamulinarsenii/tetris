import { apiName } from "@/api/apiName.js";
import { useSaveFigures } from "@/api/level-use-figures.js";

export const useGetLevels = async () => {
  try {
    const response = await fetch(`${apiName}/levels`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch levles error:", error);
    throw error;
  }
};

export const useDeleteLevels = async (id) => {
  try {
    const response = await fetch(`${apiName}/levels/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch figures");
    }
  } catch (error) {
    console.error("Fetch levles error:", error);
    throw error;
  }
};

export const usePostLevels = async (
  grid,
  speed,
  pointsCoefficient,
  pointsLimit,
  shouldBeGrid,
  shouldBePreview,
  figuresId
) => {
  try {
    const obj = JSON.stringify({
      gridId: grid,
      speed: speed,
      pointsCoefficient: pointsCoefficient,
      pointsLimit: pointsLimit,
      shouldBeGrid: shouldBeGrid,
      shouldBePreview: shouldBePreview,
    });
    console.log("Сохраняемый уровень:", obj);
    const response = await fetch(`${apiName}/levels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: obj,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch levles");
    }
    const data = await response.json();
    console.log("Сохраненный уровень", data);

    // Сохраняю фигуры уровня
    useSaveFigures(data.id, figuresId);
  } catch (error) {
    console.error("Fetch levles error:", error);
    throw error;
  }
};

export const useUpdateLevel = async (
  id,
  grid,
  speed,
  pointsCoefficient,
  pointsLimit,
  shouldBeGrid,
  shouldBePreview,
  figuresId
) => {
  await useDeleteLevels(id);

  usePostLevels(
    grid,
    speed,
    pointsCoefficient,
    pointsLimit,
    shouldBeGrid,
    shouldBePreview,
    figuresId
  );
};

export const useGetLevelById = async (id) => {
  try {
    const response = await fetch(`${apiName}/levels/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch levles error:", error);
    throw error;
  }
};
