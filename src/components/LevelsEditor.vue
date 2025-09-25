<template>
  <div
    class="level-editor"
    :class="{ 'selected-level': props.level.selected }"
    @click="handleClick"
  >
    <div class="level-btns">
      <img
        :src="require('@/assets/zoom.svg')"
        :width="20"
        alt="Посмотреть"
        @click="showPopup = true"
      />
      <img
        v-if="props.index !== 0"
        :src="require('@/assets/edit.svg')"
        :width="20"
        alt="Изменить"
        @click="$emit('edit', props.level)"
      />
      <img
        v-if="props.index !== 0"
        :src="require('@/assets/trash.svg')"
        :width="20"
        alt="Удалить"
        @click="deleteLevel"
      />
    </div>
    <div class="level-container">
      <span>Стакан</span>
      <span>{{ props.level.grid.width }}x{{ props.level.grid.height }}</span>
      <span>Скорость</span>
      <span>{{ props.level.speed }}</span>
      <span>Коэф</span>
      <span>{{ props.level.pointsCoefficient }}</span>
      <span>Лимит</span>
      <span>{{ props.level.pointsLimit }}</span>
      <span>Сетка</span>
      <span>{{ props.level.shouldBeGrid ? "Да" : "Нет" }}</span>
      <span>Предпросмотр</span>
      <span>{{ props.level.shouldBePreview ? "Да" : "Нет" }}</span>
    </div>
  </div>

  <ShowLevelFiguresPopup
    v-if="showPopup"
    :id="props.level.id"
    @close="showPopup = false"
  ></ShowLevelFiguresPopup>
</template>

<script setup>
import { ref } from "vue";
import { useDeleteLevels } from "@/api/levels.js";
import ShowLevelFiguresPopup from "./ShowLevelFiguresPopup.vue";

const props = defineProps({
  level: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  selection: {
    type: Boolean,
    default: false,
  },
});

const showPopup = ref(false);

const deleteLevel = async () => {
  const confirmed = window.confirm(
    "Вы уверены, что хотите удалить этот уровень?"
  );
  if (!confirmed) return;

  await useDeleteLevels(props.level.id);
  window.location.reload();
};
const emit = defineEmits(["click"]);

const handleClick = () => {
  if (props.selection) emit("click"); // эмитим событие вверх
};
</script>

<style>
.level-editor span {
  margin-right: 8px;
}
.level-editor img {
  cursor: pointer;
}

.level-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  border-radius: 8px;
  padding: 12px;
  margin: 3px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1);
}

.level-btns {
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 4px;
  padding-right: 8px;
  justify-content: end;
}

.selected-level {
  border: 1px solid green;
  border-radius: 8px;
}
</style>
