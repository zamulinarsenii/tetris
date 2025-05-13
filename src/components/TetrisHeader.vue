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

    <v-btn text to="/game" class="text-h5 font-weight-bold">ИГРА</v-btn>
    <v-btn text to="/controls" class="text-h5 font-weight-bold"
      >УПРАВЛЕНИЕ</v-btn
    >
    <v-btn text to="/leaderboard" class="text-h5 font-weight-bold"
      >ТАБЛИЦА ЛИДЕРОВ</v-btn
    >

    <v-spacer />

    <router-link
      to="/profile"
      class="d-flex align-center user-info ga-4"
      style="text-decoration: none"
    >
      <v-avatar size="30" class="gradient">
        {{ initials }}
      </v-avatar>
      <span class="user-name mr-4">{{ currentUser }}</span>
    </router-link>
  </v-app-bar>
</template>

<script setup>
const currentUser = sessionStorage.getItem("tetrisUser");
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
