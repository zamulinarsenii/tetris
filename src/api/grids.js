import { apiName } from "@/api/apiName.js";

export const useGetGrids = async () => {
  try {
    const response = await fetch(`${apiName}/grids`, {
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

export const usePostGrids = async (width, height) => {
  try {
    const response = await fetch(`${apiName}/grids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ width: width, height: height }),
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
export const useDeleteGrids = async (id) => {
  try {
    const response = await fetch(`${apiName}/grids/${id}`, {
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
