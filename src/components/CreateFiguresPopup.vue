<template>
  <div class="popup create-figure">
    <div class="create-figure__container">
      <h3>Создание фигуры</h3>
      <button @click="closePopup" class="create-figure__container-cross">
        ×
      </button>

      <!-- Сетка -->
      <div
        class="grid-preview"
        :style="{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }"
      >
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :class="['cell', { filled: cell === 1 }]"
          @click="toggleCell(idx)"
        ></div>
      </div>

      <!-- Кнопка сохранить -->
      <button class="save-btn" @click="saveFigure">Сохранить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { usePostFigures, useUpdateFigures } from "@/api/figures";
import { Figure } from "@/js/classFigures";

const props = defineProps({
  figures: {
    type: Array,
    required: true,
  },
  figure: {
    type: Object,
    default: null,
  },
});

const COLS = 5;
const ROWS = 5;

const emit = defineEmits(["close", "save"]);

const cells = ref(Array(COLS * ROWS).fill(0));

// если редактируем фигуру — заполняем клетки
watch(
  () => props.figure,
  (fig) => {
    if (fig?.pattern) {
      const raw = fig.pattern.padEnd(COLS * ROWS, "0");
      cells.value = raw.split("").map((ch) => (ch === "1" ? 1 : 0));
    }
  },
  { immediate: true }
);

function toggleCell(idx) {
  cells.value[idx] = cells.value[idx] === 0 ? 1 : 0;
}

async function saveFigure() {
  const pattern = cells.value.join("");
  const newFigure = new Figure(pattern);
  const exists = props.figures.some((f) => {
    // если редактируемая фигура и id совпадает → пропускаем
    if (props.figure && f.id === props.figure.id) return false;

    const fig = new Figure(f.pattern);
    return fig.equals(newFigure);
  });

  if (exists) {
    alert("Такая фигура уже существует!");
    return;
  }

  if (!props.figure) {
    // Создание новой
    await usePostFigures(pattern);
  } else {
    // Редактирование
    await useUpdateFigures(props.figure.id, pattern);
  }

  emit("save", { pattern });
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

.create-figure__container {
  height: fit-content;
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
}

.create-figure__container-cross {
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

.grid-preview {
  display: grid;
  margin: 20px 0;
  flex-grow: 1;
}

.cell {
  width: 50px;
  height: 50px;
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
