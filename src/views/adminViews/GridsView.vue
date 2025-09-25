<template>
  <div class="container">
    <h2>Управление стаканами</h2>
    <div v-if="grids.length > 0" class="container-figures">
      <GridsEditor v-for="grid in grids" :key="grid.id" :grid="grid" />
    </div>
    <div v-else>Стаканы не найдены</div>
    <v-btn @Click="showPopup = true">Создать стакан</v-btn>
    <CreateGridsPopup
      v-if="showPopup"
      :grids="grids"
      @close="showPopup = false"
    ></CreateGridsPopup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGetGrids } from "@/api/grids.js";
import CreateGridsPopup from "@/components/CreateGridsPopup.vue";
import GridsEditor from "@/components/GridsEditor.vue";
const grids = ref([]);
const showPopup = ref(false);
async function loadGrids() {
  try {
    grids.value = await useGetGrids();
    console.log("Загруженные стаканы:", grids.value);
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
