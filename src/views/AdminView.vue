<template>
  <div class="admin-page">
    <h1>Панель администратора</h1>
    <div class="admin-page__navigation">
      <v-btn @click="changeView('figures')">Управление фигурами</v-btn>
      <v-btn @click="changeView('grids')">Управление стаканами</v-btn>
      <v-btn @click="changeView('levels')">Управление уровнями</v-btn>
    </div>
    <FiguresView v-if="currentView === 'figures'" />
    <GridsView v-if="currentView === 'grids'" />
    <LevelsView v-if="currentView === 'levels'" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FiguresView from "@/views/adminViews/FiguresView.vue";
import GridsView from "@/views/adminViews/GridsView.vue";
import LevelsView from "@/views/adminViews/LevelsView.vue";
const currentView = ref(sessionStorage.getItem("adminPage") || "figures");

// Функция смены вида
const changeView = (viewName) => {
  currentView.value = viewName;
  sessionStorage.setItem("adminPage", viewName);
};
</script>

<style scoped>
.admin-page {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 32px;
}
.admin-page__navigation {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
