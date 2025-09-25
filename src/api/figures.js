import { apiName } from "@/api/apiName.js";

export const useGetFigures = async () => {
  try {
    const response = await fetch(`${apiName}/figures`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

export const useDeleteFigures = async (id) => {
  try {
    const response = await fetch(`${apiName}/figures/${id}`, {
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

export async function useUpdateFigures(id, pattern) {
  await useDeleteFigures(id);
  await usePostFigures(pattern);
}

export const usePostFigures = async (pattern) => {
  try {
    const response = await fetch(`${apiName}/figures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pattern: pattern,
      }),
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
