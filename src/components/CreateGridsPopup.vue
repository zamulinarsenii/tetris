<template>
  <div class="popup create-grid">
    <div class="create-grid__container">
      <h3>Создание стаканов</h3>
      <button @click="closePopup" class="create-grid__container-cross">
        ×
      </button>

      <!-- Управление размером -->
      <div class="grid-settings">
        <!-- Используем type="text" + inputmode numeric, maxlength работает -->
        <v-text-field
          type="text"
          inputmode="numeric"
          v-model="colsStr"
          label="Колонки"
          maxlength="2"
          @update:modelValue="onColsInput"
          @blur="onColsBlur"
          required
        />
        <v-text-field
          type="text"
          inputmode="numeric"
          v-model="rowsStr"
          label="Строки"
          maxlength="2"
          @update:modelValue="onRowsInput"
          @blur="onRowsBlur"
          required
        />
      </div>

      <!-- Кнопка сохранить -->
      <button class="save-btn" @click="saveGrid">Сохранить</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePostGrids } from "@/api/grids";
const props = defineProps({
  grids: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["close", "save"]);

// "рабочие" числовые значения, от них зависит сетка
const colsNum = ref(10);
const rowsNum = ref(10);

// строковые привязки для полей ввода (позволяют вводить символы по шагам)
const colsStr = ref(String(colsNum.value));
const rowsStr = ref(String(rowsNum.value));

// sanitize при вводе: оставить только цифры и не больше 2 символов
function onColsInput(val) {
  // val может быть строкой
  colsStr.value = String(val).replace(/\D/g, "").slice(0, 2);
}
function onRowsInput(val) {
  rowsStr.value = String(val).replace(/\D/g, "").slice(0, 2);
}

// при уходе из поля приводим к числу и применяем границы 10..50
function onColsBlur() {
  let n = parseInt(colsStr.value, 10);
  if (Number.isNaN(n)) n = 10;
  if (n < 10) n = 10;
  if (n > 50) n = 50;
  colsNum.value = n;
  colsStr.value = String(n);
}
function onRowsBlur() {
  let n = parseInt(rowsStr.value, 10);
  if (Number.isNaN(n)) n = 10;
  if (n < 10) n = 10;
  if (n > 50) n = 50;
  rowsNum.value = n;
  rowsStr.value = String(n);
}

// сохранение: используем colsNum / rowsNum (числа)
function saveGrid() {
  const exists = props.grids.some((g) => {
    return g.width === colsNum.value && g.height === rowsNum.value;
  });

  if (exists) {
    alert("Такой стакан уже существует!");
    return;
  }
  usePostGrids(colsNum.value, rowsNum.value);
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
  min-width: 300px;
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
  flex-direction: column;
  margin: 10px 0px;
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
