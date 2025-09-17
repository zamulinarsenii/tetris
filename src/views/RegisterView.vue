<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar class="gradient left-to-right">
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>

          <v-form
            class="d-flex flex-column align-center"
            autocomplete="off"
            @submit.prevent="submitRegister"
          >
            <v-card-text class="w-100">
              <v-text-field
                v-model="login"
                label="Login"
                :rules="loginRules"
                required
              />

              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="emailRules"
                required
              />

              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="passwordRules"
                required
              />

              <v-text-field
                v-model="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                :rules="confirmPasswordRules"
                required
              />
              <p v-if="error" class="error-text">{{ error }}</p>
            </v-card-text>

            <v-btn type="submit" class="gradient top-to-bottom w-50">
              Зарегистрироваться
            </v-btn>
            <router-link class="mt-5 mb-2 mr-3 align-self-end" to="/login">
              Есть аккаунт?
            </router-link>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRegisterApi } from "@/api/user.js";
import { useRouter } from "vue-router";

const router = useRouter();

const login = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const loginRules = [
  (v) => !!v || "Login обязательно",
  (v) => v.length >= 2 || "Минимум 2 символа",
];

const emailRules = [
  (v) => !!v || "Email обязателен",
  (v) => /.+@.+\..+/.test(v) || "Некорректный email",
];

const passwordRules = [
  (v) => !!v || "Пароль обязателен",
  (v) => v.length >= 6 || "Минимум 6 символов",
];

const confirmPasswordRules = computed(() => [
  ...passwordRules,
  (v) => v === password.value || "Пароли не совпадают",
]);

const submitRegister = async () => {
  // Валидация форм
  if (
    !login.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = "Все поля обязательны для заполнения";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Пароли не совпадают";
    return;
  }
  try {
    const res = await useRegisterApi(login.value, password.value, email.value);
    console.log("ответ регистрации:", res);
    if (res.ok) {
      sessionStorage.setItem("tetrisUser", login.value);
      sessionStorage.setItem("tetrisUserId", res.id);
      router.push("/menu");
    } else error.value = "Этот логин уже используется";
  } catch (err) {
    error.value = err.message || "Ошибка регистрации";
  }
};
</script>
