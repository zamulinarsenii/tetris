<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar class="gradient left-to-right">
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>

          <v-form
            @submit.prevent="submitRegister"
            class="d-flex flex-column align-center"
            autocomplete="off"
          >
            <v-card-text class="w-100">
              <v-text-field
                v-model="login"
                label="Login"
                :rules="loginRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="emailRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                :rules="confirmPasswordRules"
                required
              ></v-text-field>
            </v-card-text>

            <v-btn type="submit" class="gradient top-to-bottom w-50"
              >Зарегистрироваться</v-btn
            >
            <router-link class="mt-5 mb-2 mr-3 align-self-end" to="/login"
              >Есть аккаунт?</router-link
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {
  document.querySelectorAll("input").forEach((input) => {
    input.autocomplete = "off";
    input.setAttribute("readonly", "readonly");
    setTimeout(() => input.removeAttribute("readonly"), 100);
  });
});

const router = useRouter();
const login = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

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

const submitRegister = () => {
  // Сохраняем данные перед переходом
  sessionStorage.setItem("tempLogin", login.value);
  sessionStorage.setItem("tempPassword", password.value);

  // Переходим на страницу входа
  router.push("/login");
};
</script>
