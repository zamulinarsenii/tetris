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
const router = useRouter();

const login = ref("");
const password = ref("");

onMounted(() => {
  document.querySelectorAll("input").forEach((input) => {
    input.autocomplete = "off";
    input.setAttribute("readonly", "readonly");
    setTimeout(() => input.removeAttribute("readonly"), 100);
  });
  const savedLogin = sessionStorage.getItem("tempLogin");
  const savedPassword = sessionStorage.getItem("tempPassword");

  if (savedLogin && savedPassword) {
    login.value = savedLogin;
    password.value = savedPassword;

    // Очищаем хранилище
    sessionStorage.removeItem("tempLogin");
    sessionStorage.removeItem("tempPassword");
  }
});

const loginRules = [(v) => !!v || "Login обязателен"];

const passwordRules = [
  (v) => !!v || "Пароль обязателен",
  (v) => v.length >= 6 || "Минимум 6 символов",
];

const submitLogin = () => {
  // Логика входа
  console.log("Login data:", {
    login: login.value,
    password: password.value,
  });
  router.push("/dashboard");
};
</script>
