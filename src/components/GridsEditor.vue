<template>
  <div class="grid-editor">
    <span>Стакан {{ props.grid.width }}x{{ props.grid.height }}</span>
    <img
      :src="require('@/assets/trash.svg')"
      alt="Удалить"
      @click="deleteGrid"
    />
  </div>
</template>
<script setup>
import { useDeleteGrids } from "@/api/grids.js";
const props = defineProps({
  grid: {
    type: Object,
    required: true,
  },
});
const deleteGrid = async () => {
  console.log("Удаление фигуры:", props.grid.id);
  await useDeleteGrids(props.grid.id);
  window.location.reload();
};
</script>

<style>
.grid-editor span {
  margin-right: 8px;
}
.grid-editor img {
  cursor: pointer;
}
</style>
