<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar class="gradient left-to-right">
            <v-toolbar-title>Вход</v-toolbar-title>
          </v-toolbar>

          <v-form
            @submit.prevent="submitLogin"
            class="d-flex flex-column align-center"
            autocomplete="off"
          >
            <v-card-text class="w-100">
              <v-text-field
                v-model="login"
                label="Login"
                type="email"
                :rules="loginRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <p v-if="error" class="error-text">{{ error }}</p>
            </v-card-text>
            <v-btn type="submit" class="gradient top-to-bottom w-25"
              >Войти</v-btn
            >
            <router-link class="mt-5 mb-2 mr-3 align-self-end" to="/register"
              >Нет аккаунта?</router-link
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/js/useAuth.js";

const router = useRouter();
const { loginUser, currentUser, error } = useAuth();

const login = ref("");
const password = ref("");

const loginRules = [
  (v) => !!v || "Login обязателен",
  (v) => v.length >= 2 || "Минимум 2 символа",
];

const passwordRules = [
  (v) => !!v || "Пароль обязателен",
  (v) => v.length >= 6 || "Минимум 6 символов",
];

onMounted(() => {
  // Если уже залогинен — сразу на дашборд
  if (currentUser.value) {
    router.push("/tetris");
    return;
  }

  // Подхватываем временные значения после регистрации
  const tempLogin = sessionStorage.getItem("tempLogin");
  const tempPassword = sessionStorage.getItem("tempPassword");
  if (tempLogin && tempPassword) {
    login.value = tempLogin;
    password.value = tempPassword;
    sessionStorage.removeItem("tempLogin");
    sessionStorage.removeItem("tempPassword");
  }
});

async function submitLogin() {
  const ok = await loginUser(login.value, password.value);
  if (ok) {
    // Очистим поля и уйдем на дашборд
    sessionStorage.setItem("tetrisUser", login.value);
    login.value = "";
    password.value = "";
    router.push("/menu");
  }
}
</script>
