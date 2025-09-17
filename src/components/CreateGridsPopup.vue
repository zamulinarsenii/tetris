<template>
  <div class="popup create-grid">
    <div class="create-grid__container">
      <h3>Создание стаканов</h3>
      <button @click="closePopup" class="create-grid__container-cross">
        ×
      </button>

      <!-- Управление размером -->
      <div class="grid-settings">
        <label>
          Колонки:
          <input type="number" v-model.number="cols" min="1" max="16" />
        </label>
        <label>
          Строки:
          <input type="number" v-model.number="rows" min="1" max="16" />
        </label>
      </div>

      <!-- Сетка -->
      <div
        class="grid-preview"
        :style="{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }"
      >
        <div
          v-for="(cell, index) in cells"
          :key="index"
          :class="['cell', { filled: cell }]"
          @click="toggleCell(index)"
        ></div>
      </div>

      <!-- Кнопка сохранить -->
      <button class="save-btn" @click="saveGrid">Сохранить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { usePostGrids } from "@/api/grids";

const emit = defineEmits(["close", "save"]);

// Начальные размеры
const cols = ref(10);
const rows = ref(10);

// Массив клеток
const cells = ref(Array(cols.value * rows.value).fill(0));

// При изменении размеров сетки пересоздаём массив
watch([cols, rows], () => {
  const newCells = Array(cols.value * rows.value).fill(0);
  // Старая сетка не сохраняется, если нужны старые значения — нужно копировать
  if (cols.value > 50) cols.value = 50;
  if (rows.value > 50) rows.value = 50;
  if (cols.value < 10) cols.value = 10;
  if (rows.value < 10) rows.value = 10;
  cells.value = newCells;
});

// Клик по клетке
function toggleCell(index) {
  cells.value[index] = cells.value[index] ? 0 : 1;
}

// Сохранение сетки
function saveGrid() {
  usePostGrids(cols.value, rows.value);
  emit("close");
  window.location.reload();
}

function closePopup() {
  emit("close");
}
</script>

<style scoped>
.popup {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  z-index: 9999;
}

.create-grid__container {
  height: fit-content;
  max-height: 90%;
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
}

.create-grid__container-cross {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
}

.grid-settings {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.grid-settings label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.grid-preview {
  align-self: center;
  display: grid;
  width: fit-content;
  height: auto;
  margin-bottom: 10px;
}

.cell {
  width: 40px;
  height: 40px;
  background: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
}

.cell.filled {
  background: #2d8cf0;
}

.save-btn {
  padding: 8px 16px;
  border: none;
  background-color: #2d8cf0;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
