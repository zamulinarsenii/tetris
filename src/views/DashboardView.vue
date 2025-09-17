<template>
  <v-app>
    <!-- Шапка -->
    <v-app-bar class="pt-2 pb-2 pr-8 pl-8">
      <!-- Логотип или название приложения -->
      <v-img
        class="logo"
        src="@/assets/logo.svg"
        alt="Мой логотип"
        max-height="40"
      />

      <!-- Навигация -->
      <v-btn
        text
        to="/new-game"
        class="text-h5"
      >
        НОВАЯ ИГРА
      </v-btn>
      <v-btn
        text
        to="/controls"
        class="text-h5"
      >
        УПРАВЛЕНИЕ
      </v-btn>
      <v-btn
        text
        to="/leaderboard"
        class="text-h5"
      >
        ТАБЛИЦА ЛИДЕРОВ
      </v-btn>

      <v-spacer />
      <router-link
        to="/profile"
        class="d-flex align-center user-info ga-4"
        style="text-decoration: none"
      >
        <v-avatar
          size="30"
          class="gradient"
        >
          {{ initials }}
        </v-avatar>
        <span class="user-name mr-4">{{ currentUser }}</span>
      </router-link>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <v-container>
        <!-- Пример контента -->
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card class="pa-4">
              <v-card-title>Моя статистика</v-card-title>
              <v-card-text>
                <!-- Контент карточки -->
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
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
import { useRouter } from "vue-router";

const router = useRouter();
const currentUser = sessionStorage.getItem("tetrisUser");
if (!currentUser) {
  router.push("/login");
}
</script>

<style scoped>
::v-deep .logo .v-img__img,
::v-deep .logo .v-img__picture {
  width: auto !important;
}
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
