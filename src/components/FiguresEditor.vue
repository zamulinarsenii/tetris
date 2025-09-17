<script setup>
import { computed } from "vue";

const props = defineProps({
  figure: {
    type: Object,
    required: true,
  },
});

// Размер сетки
const COLS = 5;
const ROWS = 5;

// Массива для клеток (числа 0/1)
const cells = computed(() => {
  const raw = String(props.figure?.pattern ?? "");
  // Обрезаем до 25 символов или дополняем нулями
  const normalized = (raw + "0".repeat(COLS * ROWS)).slice(0, COLS * ROWS);
  return normalized.split("").map((ch) => (ch === "1" ? 1 : 0));
});

function deleteFigure() {
  console.log("Удаление фигуры:", props.figure.id);
}
</script>

<template>
  <div class="figure-editor">
    <div>
      <img
        :src="require('@/assets/trash.svg')"
        alt="Удалить"
        @click="deleteFigure"
      />
    </div>
    <div class="preview-container">
      <!-- Превью сетки -->
      <div
        class="grid-preview"
        :style="{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          width: '150px',
          height: '150px',
        }"
      >
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :class="['cell', { filled: cell === 1 }]"
          :title="`#${idx} — ${cell === 1 ? '1' : '0'}`"
          role="img"
          :aria-label="cell === 1 ? 'filled' : 'empty'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.figure-editor {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 5px;
}
.figure-editor img {
  cursor: pointer;
}

.preview-container {
  display: flex;

  gap: 16px;
  align-items: center;
}

/* Сетка 5x5: каждая клетка квадратная */
.grid-preview {
  display: grid;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* Клетки */
.cell {
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  height: 100%;
  /* Чтобы клетки были квадратными в пределах сетки, используем aspect-ratio */
  aspect-ratio: 1 / 1;
  background: transparent;
}

/* Заполненная клетка */
.cell.filled {
  background: #2d8cf0; /* можно поменять цвет */
}

/* Немного адаптации под маленькие экраны */
@media (max-width: 420px) {
  .grid-preview {
    width: 120px;
    height: 120px;
  }
}
</style>
