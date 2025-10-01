import { apiName } from "@/api/apiName.js";

export const useRegisterApi = async (login, password, email) => {
  const response = await fetch(`${apiName}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password, email }),
  });
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  return data;
};

export const useLoginApi = async (login, password) => {
  try {
    const response = await fetch(`${apiName}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, data: data.message };
    }

    return { ok: true, data: data };
  } catch (err) {
    console.log(err);
  }
};
