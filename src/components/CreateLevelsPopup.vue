<template>
  <div class="popup create-grid">
    <div class="create-grid__container">
      <h3>{{ editingLevel ? "Редактирование уровня" : "Создание уровня" }}</h3>
      <button @click="closePopup" class="create-grid__container-cross">
        ×
      </button>

      <div class="create-grid__container-attr">
        <div v-if="selectedGrid" class="selected-info">
          Выбран стакан {{ selectedGrid.width }}x{{ selectedGrid.height }}
        </div>
        <div v-else class="selected-info">Выберите стакан</div>

        <div class="grids-list">
          <div
            v-for="grid in grids"
            :key="grid.id"
            @click="selectedGrid = grid"
            :class="{ selected: selectedGrid?.id === grid.id }"
          >
            {{ grid.width }}x{{ grid.height }}
          </div>
        </div>

        <v-text-field
          v-model.number="speed"
          type="number"
          label="Скорость"
          :input-props="{ min: 1, max: 10, step: 1 }"
          clearable
        />

        <v-text-field
          v-model.number="pointsCoefficient"
          type="number"
          label="Коэффициент"
          :input-props="{ min: 1, max: 10, step: 1 }"
          clearable
          dense
        />

        <v-text-field
          v-model.number="pointsLimit"
          type="number"
          label="Лимит по очкам"
          :input-props="{ min: 1, max: 10000, step: 1 }"
          clearable
          dense
        />

        <v-checkbox
          v-model="shouldBeGrid"
          label="Показывать сетку"
          color="primary"
          hide-details
        />
        <v-checkbox
          v-model="shouldBePreview"
          label="Предпросмотр"
          color="primary"
          hide-details
        />

        <div class="figures-list">
          <FiguresAdd
            v-for="figure in figures"
            :key="figure.id"
            :figure="figure"
            :edit="editingLevel"
            :added="figuresId.includes(figure.id)"
            @add="() => addFigure(figure.id)"
            @remove="() => removeFigure(figure.id)"
          />
        </div>
      </div>

      <div style="margin-top: 12px">
        <button class="save-btn" @click="saveLevel">
          {{ editingLevel ? "Сохранить изменения" : "Создать уровень" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import FiguresAdd from "@/components/FigureAdd.vue";
import { ref, onMounted, watch } from "vue";
import { useGetGrids } from "@/api/grids";
import { usePostLevels, useUpdateLevel } from "@/api/levels";
import { useGetFigures } from "@/api/figures";

const props = defineProps({
  levels: Array,
  levelToEdit: Object, // если передан — редактируем
});

const emit = defineEmits(["close", "save"]);

const editingLevel = ref(false);

const speed = ref(1);
const pointsCoefficient = ref(1);
const pointsLimit = ref(1000);
const shouldBeGrid = ref(true);
const shouldBePreview = ref(true);
const selectedGrid = ref(null);

const grids = ref([]);
const figures = ref([]);
const figuresId = ref([]);

// загрузка данных
onMounted(async () => {
  try {
    const [gridData, figureData] = await Promise.all([
      useGetGrids(),
      useGetFigures(),
    ]);
    grids.value = gridData.map((g) => ({
      ...g,
      title: `${g.width}×${g.height}`,
    }));
    figures.value = figureData;

    // если редактируем — подгружаем данные уровня
    if (props.levelToEdit) {
      editingLevel.value = true;
      const lvl = props.levelToEdit;
      selectedGrid.value = lvl.grid;
      speed.value = lvl.speed;
      pointsCoefficient.value = lvl.pointsCoefficient;
      pointsLimit.value = lvl.pointsLimit;
      shouldBeGrid.value = lvl.shouldBeGrid;
      shouldBePreview.value = lvl.shouldBePreview;
      figuresId.value = [...(lvl.figuresId || [])];
    }
  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
  }
});

// управление фигурами
const addFigure = (id) => {
  if (!figuresId.value.includes(id)) figuresId.value.push(id);
};
const removeFigure = (id) => {
  figuresId.value = figuresId.value.filter((f) => f !== id);
};

// проверка на валидность и дубликаты
const isValid = () => {
  if (!selectedGrid.value) {
    alert("Выберите стакан");
    return false;
  }
  if (figuresId.value.length === 0) {
    alert("Выберите хотя бы 1 фигуру");
    return false;
  }

  const duplicate = props.levels.some((level) => {
    const levelFigures = level.figuresId || [];
    return (
      (!editingLevel.value || level.id !== props.levelToEdit.id) && // игнорируем редактируемый уровень
      level.grid.id === selectedGrid.value.id &&
      level.speed === speed.value &&
      level.pointsCoefficient === pointsCoefficient.value &&
      level.pointsLimit === pointsLimit.value &&
      level.shouldBeGrid === shouldBeGrid.value &&
      level.shouldBePreview === shouldBePreview.value &&
      JSON.stringify([...levelFigures].sort()) ===
        JSON.stringify([...figuresId.value].sort())
    );
  });
  if (duplicate) {
    alert("Такой уровень уже существует!");
    return false;
  }
  return true;
};

// сохранение (создание или редактирование)
const saveLevel = async () => {
  if (!isValid()) return;

  try {
    if (editingLevel.value) {
      await useUpdateLevel(
        props.levelToEdit.id,
        selectedGrid.value.id,
        speed.value,
        pointsCoefficient.value,
        pointsLimit.value,
        shouldBeGrid.value,
        shouldBePreview.value,
        figuresId.value
      );
    } else {
      await usePostLevels(
        selectedGrid.value.id,
        speed.value,
        pointsCoefficient.value,
        pointsLimit.value,
        shouldBeGrid.value,
        shouldBePreview.value,
        figuresId.value
      );
    }
    emit("save");
    emit("close");
  } catch (err) {
    console.error("Ошибка при сохранении:", err);
    alert("Не удалось сохранить уровень");
  }
};

const closePopup = () => emit("close");
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
  padding: 16px; /* чтобы на мелких экранах был отступ */
  box-sizing: border-box;
  z-index: 9999;
}

/* Коррекция основного контейнера */
.create-grid__container {
  width: 500px;
  max-width: 100%;
  height: 100%; /* ограничиваем высоту окна */
  max-height: 600px;
  position: relative;
  background-color: white;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 5px;
  overflow: hidden; /* внешнему контейнеру не нужна прокрутка, её даём внутреннему */
  box-sizing: border-box;
}

/* Блок с формой — теперь он будет скроллиться при переполнении */
.create-grid__container-attr {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 80%;
  padding-right: 8px; /* небольшой отступ для скролла */
}

/* сохраняем горизонтальные списки */
.figures-list,
.grids-list {
  display: flex;
  flex-wrap: nowrap; /* элементы в одну строку — не переносятся */
  align-items: flex-start; /* не растягиваемся по высоте */
  gap: 12px;
  padding: 12px 0;
}

/* каждый элемент в ленте не должен растягиваться по высоте */
.figures-list > * {
  flex: 0 0 auto; /* не растягиваться, минимальный размер по контенту */
}

.grids-list div {
  cursor: pointer;
  padding: 6px;
  margin: 3px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1);
}
/* крестик поверх */
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
