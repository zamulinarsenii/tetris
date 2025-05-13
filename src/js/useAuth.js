// src/js/useAuth.js
import { reactive, computed, watch } from "vue";
import bcrypt from "bcryptjs"; // npm install bcryptjs

const STORAGE_KEY = "tetris-users";

export function useAuth() {
  const state = reactive({
    users: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
    currentUser: null,
    error: "",
  });

  watch(
    () => state.users,
    (users) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },
    { deep: true }
  );

  // Регистрация — теперь принимает login, email и password
  async function register(login, email, password) {
    if (state.users.find((u) => u.login === login || u.email === email)) {
      state.error = "Пользователь с таким логином или email уже существует";
      return false;
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      login,
      email,
      hash,
      registeredAt: new Date().toISOString(),
    };
    state.users.push(newUser);
    state.error = "";
    // optionally сразу логиним:
    state.currentUser = login;
    return true;
  }

  // Вход — ищем по login или email
  async function loginUser(identifier, password) {
    const user = state.users.find(
      (u) => u.login === identifier || u.email === identifier
    );
    if (!user) {
      state.error = "Пользователь не найден";
      return false;
    }
    const ok = await bcrypt.compare(password, user.hash);
    if (!ok) {
      state.error = "Неверный пароль";
      return false;
    }
    state.currentUser = user.login;
    state.error = "";
    return true;
  }

  function logout() {
    state.currentUser = null;
  }

  return {
    users: computed(() => state.users),
    currentUser: computed(() => state.currentUser),
    error: computed(() => state.error),
    register,
    loginUser,
    logout,
  };
}
