<template>
  <v-app>
    <!-- Шапка -->
    <v-app-bar color="primary" dense dark>
      <!-- Логотип или название приложения -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Мое Приложение</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Иконка пользователя и меню -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="36">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ userName }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="goToProfile">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Выход</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <v-container>
        <h1 class="text-h4 mb-6">Добро пожаловать, {{ userName }}!</h1>

        <!-- Пример контента -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <v-card-title>Моя статистика</v-card-title>
              <v-card-text>
                <!-- Контент карточки -->
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <v-card-title>Последние действия</v-card-title>
              <v-card-text>
                <!-- Контент карточки -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const drawer = ref(false);

// Получаем данные пользователя (замените на реальные данные)
const userName = ref("Иван Иванов");

const goToProfile = () => {
  router.push("/profile");
};

const logout = () => {
  // Здесь должна быть логика выхода
  console.log("Logout");
  router.push("/login");
};
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.v-avatar:hover {
  transform: scale(1.1);
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}
</style>
