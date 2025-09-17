import { apiName } from "@/api/apiName.js";

export async function useGetFigures() {
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
}

export async function useDeleteFigures() {
  try {
    const response = await fetch(`${apiName}/figures`, {
      method: "DELETE",
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
}

export async function usePostFigures(pattern) {
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
}
