<!-- src/components/Header.vue -->
<template>
  <v-app-bar class="pt-2 pb-2 pr-8 pl-8">
    <v-img
      class="logo cursor-pointer"
      src="@/assets/logo.svg"
      alt="Мой логотип"
      max-height="40"
      contain
      @click="$router.push('/menu')"
    />

    <v-btn text to="/game" class="text-h5 font-weight-bold"> ИГРА </v-btn>
    <v-btn text to="/controls" class="text-h5 font-weight-bold">
      УПРАВЛЕНИЕ
    </v-btn>
    <v-btn text to="/history" class="text-h5 font-weight-bold"> ИСТОРИЯ </v-btn>
    <v-btn text to="/aboutus" class="text-h5 font-weight-bold">
      ОБ АВТОРАХ
    </v-btn>
    <v-btn text to="/aboutsystem" class="text-h5 font-weight-bold">
      О СИСТЕМЕ
    </v-btn>
    <v-btn v-if="isAdmin()" text to="/admin" class="text-h5 font-weight-bold">
      admin
    </v-btn>

    <v-spacer />

    <div class="d-flex align-center user-info" style="text-decoration: none">
      <span class="user-name mr-4">{{ currentUser }}</span>
      <img
        class="cursor-pointer"
        :src="require('@/assets/exit.svg')"
        :width="30"
        alt="Выход"
        @click="exit"
      />
    </div>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const currentUser = sessionStorage.getItem("tetrisUser");
const isAdmin = () => {
  return currentUser === "admin";
};
const exit = () => {
  router.push("/login");
};
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
