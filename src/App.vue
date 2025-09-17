<template>
  <v-app class="app-background">
    <TetrisHeader v-if="showHeader" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TetrisHeader from "@/components/TetrisHeader.vue";

const route = useRoute();
const router = useRouter();

// Список имён маршрутов, на которых шапку НЕ показываем
const noHeader = ["login", "register"];
const showHeader = computed(() => !noHeader.includes(route.name));

if (showHeader.value && !sessionStorage.getItem("tetrisUser")) {
  router.push("/login");
}
</script>

<style>
.app-background {
  background-color: #d9d9d9 !important;
}
.gradient {
  color: white !important;
  background: linear-gradient(90deg, #f52285, #fabdd9) !important;
}
.gradient.left-to-right {
  background: linear-gradient(90deg, #f52285, #fabdd9) !important;
}
.gradient.top-to-bottom {
  background: linear-gradient(180deg, #f52285, #fabdd9) !important;
}
</style>
