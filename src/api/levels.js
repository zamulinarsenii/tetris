import { apiName } from "@/api/apiName.js";

export const useGetLevels = async () => {
  try {
    const response = await fetch(`${apiName}/levels`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch figures");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch figures error:", error);
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
    console.error("Fetch figures error:", error);
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
      grid: grid,
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
      throw new Error("Failed to fetch figures");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Fetch figures error:", error);
    throw error;
  }
};
