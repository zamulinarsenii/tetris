<template>
  <div class="popup create-grid">
    <div class="create-grid__container">
      <h3>Создание уровней</h3>
      <button @click="closePopup" class="create-grid__container-cross">
        ×
      </button>

      <!-- v-select: возвращаем объект (return-object) и прикрепляем меню к body -->
      <div v-if="selectedGrid" class="selected-info">
        Выбран стакан {{ selectedGrid.width }}x{{ selectedGrid.height }}
      </div>
      <div class="grids-list">
        <div v-for="grid in grids" :key="grid" @click="selectedGrid = grid">
          Стакан {{ grid.width }}x{{ grid.height }}
        </div>
      </div>
      <v-text-field
        v-model.number="speed"
        type="number"
        label="Скорость"
        :rules="speedRules"
        :input-props="{ min: 1, max: 10, step: 1 }"
        clearable
      />
      <v-text-field
        v-model.number="pointsCoefficient"
        type="number"
        label="Коеэфициент"
        :rules="speedRules"
        :input-props="{ min: 1, max: 10, step: 1 }"
        clearable
        dense
      />
      <v-text-field
        v-model.number="pointsLimit"
        type="number"
        label="Лимит по очкам"
        :rules="speedRules"
        :input-props="{ min: 1, max: 10000, step: 1 }"
        clearable
        dense
      />
      <v-checkbox
        v-model="shouldBeGrid"
        label="Показывать сетку"
        density="comfortable"
        color="primary"
        aria-label="Показывать сетку"
      />
      <v-checkbox
        v-model="shouldBePreview"
        label="Предпросмотр"
        density="comfortable"
        color="primary"
        aria-label="Предпросмотр"
      />
      <!-- Показываем подробности выбранного стакана (вынесено наружу) -->
      <div class="figures-list">
        <FiguresAdd
          v-for="figure in figures"
          :key="figure.id"
          :figure="figure"
          @add="() => addFigure(figure.id)"
          @remove="() => removeFigure(figure.id)"
        ></FiguresAdd>
      </div>
      <!-- Кнопка сохранить -->
      <div style="margin-top: 12px">
        <button class="save-btn" @click="saveLevel">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import FiguresAdd from "@/components/FigureAdd.vue";
import { ref, onMounted } from "vue";
import { useGetGrids } from "@/api/grids";
import { usePostLevels } from "@/api/levels";
import { useGetFigures } from "@/api/figures";
const emit = defineEmits(["close", "save"]);
const speed = ref(1);
const pointsCoefficient = ref(1);
const pointsLimit = ref(1);
const shouldBeGrid = ref(true);
const shouldBePreview = ref(true);
const grids = ref([]);
const figures = ref([]);
const figuresId = ref([]);
const selectedGrid = ref(null);

async function loadGrids() {
  try {
    const data = await useGetGrids();
    // Добавляем поле title для удобного отображения в селекте
    grids.value = data.map((g) => ({ ...g, title: `${g.width}×${g.height}` }));
  } catch (error) {
    console.error("Ошибка при загрузке стаканов:", error);
  }
}
async function loadFigures() {
  try {
    figures.value = await useGetFigures();
  } catch (error) {
    console.error("Ошибка при загрузке фигур:", error);
  }
}
onMounted(() => {
  loadGrids();
  loadFigures();
});

const addFigure = (id) => {
  if (!figuresId.value.includes(id)) {
    figuresId.value.push(id);
  }
  console.log("Добавили:", figuresId.value);
};
const saveLevel = () => {
  usePostLevels(
    selectedGrid.value.id,
    speed.value,
    pointsCoefficient.value,
    pointsLimit.value,
    shouldBeGrid.value,
    shouldBePreview.value,
    figuresId.value
  );
  emit("close");
};
const removeFigure = (id) => {
  figuresId.value = figuresId.value.filter((f) => f !== id);
  console.log("Удалили:", figuresId.value);
};
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
  left: 0; /* понижаю — Vuetify меню обычно выше (если attach: true, не важно) */
}

.create-grid__container {
  height: auto;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
}
.figures-list {
  display: flex;
  width: 100%;
  gap: 12px;
  overflow-x: scroll;
  margin-top: 12px;
}
.grids-list {
  display: flex;
  width: 100%;
  gap: 12px;
  overflow-x: scroll;
  margin-top: 12px;
}
.grids-list div {
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
  width: fit-content;
  white-space: nowrap;
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

.selected-info {
  margin-top: 8px;
  font-weight: 500;
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
