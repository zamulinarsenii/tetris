<template>
  <v-container class="w-50 mt-6">
    <v-card class="w-100">
      <v-card-title class="d-flex w-100 justifu-center">
        Управление
      </v-card-title>
      <v-card-text>
        <div class="w-100 menu">
          <span>Стрелочка вправо</span>
          <span>перемещение вправо</span>
          <span>Стрелочка влево</span>
          <span>перемещение влево</span>
          <span>Стрелочка вверх</span>
          <span>поворот фигры</span>
          <span>Стрелочка вниз</span>
          <span>быстрое падение</span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "@/js/useAuth.js";

const { users } = useAuth();

const currentUser = sessionStorage.getItem("tetrisUser");

// Ищем объект пользователя по логину
const user = computed(() => {
  return users.value.find((u) => u.login === currentUser) || {};
});
console.log(user.value);
</script>

<style scoped>
.menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.v-list-item {
  margin-bottom: 1rem;
}
</style>
