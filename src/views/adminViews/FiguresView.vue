<template>
  <div class="container">
    <h2>Управление фигурами</h2>
    <div v-if="figures.length > 0" class="container-figures">
      <FigureEditor
        v-for="figure in figures"
        :key="figure.id"
        :figure="figure"
      />
    </div>
    <div v-else>Фигуры не найдены</div>
    <v-btn @Click="showPopup = true">Создать фигуру</v-btn>
    <CreateFiguresPopup
      v-if="showPopup"
      @close="showPopup = false"
    ></CreateFiguresPopup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGetFigures } from "@/api/figures.js";
import FigureEditor from "@/components/FiguresEditor.vue";
import CreateFiguresPopup from "@/components/CreateFiguresPopup.vue";

const showPopup = ref(false);
const figures = ref([]);
// В методе или хуке
async function loadFigures() {
  try {
    figures.value = await useGetFigures();
    console.log("Figures loaded:", figures.value);
  } catch (error) {
    console.error("Error loading figures:", error);
  }
}
loadFigures();
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
  width: 100%;
  justify-content: center;
  gap: 20px;
  width: 100%;
}
</style>
