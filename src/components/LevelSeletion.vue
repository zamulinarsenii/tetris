<template>
  <div class="container">
    <div v-if="levels.length > 0" class="container-figures">
      <LevelsEditor
        v-for="level in levels"
        :key="level.id"
        :level="level"
        :selection="true"
        @click="() => selectLevel(level)"
      />
    </div>
    <div v-else>Уровни не найдены</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGetLevels } from "@/api/levels.js";
import LevelsEditor from "@/components/LevelsEditor.vue";

const levels = ref([]);

async function loadLevels() {
  try {
    const data = await useGetLevels();
    levels.value = data.map((level) => ({ ...level, selected: false }));
    levels.value[0].selected = true;
    sessionStorage.setItem("tetris-level", levels.value[0].id);
    console.log("Загруженные уровни:", levels.value);
  } catch (error) {
    console.error("Ошибка при загрузке уровней:", error);
  }
}
loadLevels();
const selectLevel = (clickedLevel) => {
  levels.value = levels.value.map((level) => ({
    ...level,
    selected: level.id === clickedLevel.id,
  }));
  sessionStorage.setItem("tetris-level", clickedLevel.id);
};
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
