<template>
  <div class="admin-page">
    <h1>Панель администратора</h1>
    <div class="admin-page__navigation">
      <v-btn>Управление фигурами</v-btn>
      <v-btn>Управление стаканами</v-btn>
      <v-btn>Управление уровнями</v-btn>
    </div>
    <FiguresView />
  </div>
</template>

<script setup>
import FiguresView from "@/views/adminViews/FiguresView.vue";
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
