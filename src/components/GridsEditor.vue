<template>
  <div class="grid-editor">
    <div v-if="isDefault" class="grid-editor-btns">
      <img
        :src="require('@/assets/trash.svg')"
        :width="20"
        alt="Удалить"
        @click="deleteGrid"
      />
    </div>

    <span>{{ props.grid.width }}x{{ props.grid.height }}</span>
  </div>
</template>
<script setup>
import { useDeleteGrids } from "@/api/grids.js";
import { computed } from "vue";
const props = defineProps({
  grid: {
    type: Object,
    required: true,
  },
});
const defaultGrid = {
  width: 12,
  height: 20,
};
const isDefault = computed(() => {
  return !(
    props.grid.width === defaultGrid.width &&
    props.grid.height === defaultGrid.height
  );
});

const deleteGrid = async () => {
  const confirmed = window.confirm(
    "Вы уверены, что хотите удалить этот стакан?"
  );
  if (!confirmed) return; // если отмена — выходим
  console.log("Удаление фигуры:", props.grid.id);
  await useDeleteGrids(props.grid.id);
  window.location.reload();
};
</script>

<style>
.grid-editor {
  display: flex;
  flex-direction: column;
  justify-content: end;
}
.grid-editor-btns {
  display: flex;
  justify-content: end;
  padding-right: 4px;
}
.grid-editor span {
  margin-right: 8px;
  border-radius: 8px;
  padding: 12px;
  margin: 3px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1);
}
.grid-editor img {
  cursor: pointer;
}
</style>
