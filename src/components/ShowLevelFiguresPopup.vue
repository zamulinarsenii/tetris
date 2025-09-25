<template>
  <div class="popup">
    <div class="show-figures__container">
      <h3>Фигуры уровня</h3>
      <button @click="closePopup" class="popup-cross">×</button>
      <div class="show-figures__container-figures">
        <FiguresShow
          v-for="figure in figures"
          :figure="figure"
          :key="figure.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGetFiguresById } from "@/api/level-use-figures";
import { ref, onMounted } from "vue";
import FiguresShow from "./FiguresShow.vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const figures = ref([]);

const loadFigures = async () => {
  figures.value = await useGetFiguresById(props.id);
  console.log("Показ фигур уровня:", figures.value);
};

onMounted(() => {
  loadFigures();
});

const emit = defineEmits(["close"]);

const closePopup = () => {
  emit("close");
};
</script>

<style>
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
.show-figures__container {
  width: 500px;
  max-width: 100%;
  height: 100%; /* ограничиваем высоту окна */
  max-height: fit-content;
  position: relative;
  background-color: white;
  flex-direction: column;
  display: flex;
  gap: 20px;
  padding: 20px;
  border-radius: 5px;
  overflow: hidden; /* внешнему контейнеру не нужна прокрутка, её даём внутреннему */
  box-sizing: border-box;
}
.popup-cross {
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

.show-figures__container-figures {
  display: flex;
  gap: 12px;
  overflow-x: scroll;
}
</style>
