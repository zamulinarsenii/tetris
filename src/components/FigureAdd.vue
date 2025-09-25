<script setup>
import { ref, computed, onMounted } from "vue";
const props = defineProps({
  figure: {
    type: Object,
    required: true,
  },
  edit: { type: Boolean, default: false },
  added: { type: Boolean, default: true },
});

// Размер сетки
const COLS = 5;
const ROWS = 5;

const defaultPatterns = [
  "1111000000000000000000000",
  "1110010000000000000000000",
  "0100011100000000000000000",
  "1100011000000000000000000",
  "1110000100000000000000000",
  "0110011000000000000000000",
  "1100001100000000000000000",
];

// Массива для клеток (числа 0/1)
const cells = computed(() => {
  const raw = String(props.figure?.pattern ?? "");
  // Обрезаем до 25 символов или дополняем нулями
  const normalized = (raw + "0".repeat(COLS * ROWS)).slice(0, COLS * ROWS);
  return normalized.split("").map((ch) => (ch === "1" ? 1 : 0));
});
const add = ref(props.added);
onMounted(() => {
  if (
    defaultPatterns.some((pattern) => pattern === props.figure.pattern) &&
    !props.edit
  ) {
    emit("add", props.figure.id);
    add.value = true;
  }
});

const emit = defineEmits(["add", "remove"]);
const addFigure = () => {
  if (!add.value) {
    emit("add", props.figure.id);
  } else {
    emit("remove", props.figure.id);
  }
};
</script>

<template>
  <div class="figure-editor">
    <label @click="addFigure"
      >Добавить
      <input
        type="checkbox"
        v-model="add"
        label="Добавить"
        color="primary"
        aria-label="Добавить"
    /></label>
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
