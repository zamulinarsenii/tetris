<template>
  <div class="container">
    <h2>Управление уровнями</h2>
    <div v-if="levels.length > 0" class="container-figures">
      <LevelsEditor v-for="level in levels" :key="level.id" :level="level" />
    </div>
    <div v-else>Стаканы не найдены</div>
    <v-btn @Click="showPopup = true">Создать уровень</v-btn>
  </div>
  <CreateLevelsPopup v-if="showPopup" @close="showPopup = false" />
</template>

<script setup>
import { ref } from "vue";
import { useGetLevels } from "@/api/levels.js";
import CreateLevelsPopup from "@/components/CreateLevelsPopup.vue";
import LevelsEditor from "@/components/LevelsEditor.vue";
const levels = ref([]);
const showPopup = ref(false);
async function loadGrids() {
  try {
    levels.value = await useGetLevels();
    console.log("Загруженные уровни:", levels.value);
  } catch (error) {
    console.error("Ошибка при загрузке фигур:", error);
  }
}
loadGrids();
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: white;
  border-radius: 5px;
  padding: 12px;
}
.container-figures {
  display: flex;
  padding: 0 20px;
  width: 100%;
  overflow-x: scroll;
  gap: 20px;
  width: 100%;
}
</style>
