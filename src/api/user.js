import { apiName } from "@/api/apiName.js";

export async function useRegisterApi(login, password, email) {
  try {
    const response = await fetch(`${apiName}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
        email: email,
      }),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function useLoginApi(login, password) {
  try {
    const response = await fetch(`${apiName}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
