<template>
  <div class="level-editor">
    <img
      :src="require('@/assets/trash.svg')"
      alt="Удалить"
      @click="deleteLevel"
    />
    <div>
      <span>Уровень</span>
      <ul>
        <li>
          Стакан {{ props.level.grid.width }}x{{ props.level.grid.height }}
        </li>
        <li>Скорость {{ props.level.speed }}</li>
        <li>Коэф {{ props.level.pointsCoefficient }}</li>
        <li>Лимит {{ props.level.pointsLimit }}</li>
        <li>Сетка {{ props.level.shouldBeGrid }}</li>
        <li>Предпросмотр {{ props.level.shouldBePreview }}</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useDeleteLevels } from "@/api/levels.js";
const props = defineProps({
  level: {
    type: Object,
    required: true,
  },
});
const deleteLevel = async () => {
  console.log("Удаление фигуры:", props.level.id);
  await useDeleteLevels(props.level.id);
  window.location.reload();
};
</script>

<style>
.level-editor span {
  margin-right: 8px;
}
.level-editor img {
  cursor: pointer;
}
</style>
