<template>
  <v-container>
    <v-card>
      <v-card-title>Моя история</v-card-title>
    </v-card>
  </v-container>
  <v-container v-if="history.length !== 0" class="d-flex flex-column ga-2">
    <v-card v-for="game in history" :key="game.game.id">
      <v-card-text class="d-flex ga-2 justify-center"
        >Начало:
        {{ new Date(game.game.creationDateTime).toLocaleString() }} Конец:
        {{ new Date(game.finishTime).toLocaleString() }} Очки:
        {{ game.points }}</v-card-text
      >
    </v-card>
  </v-container>
</template>

<script setup>
import { useGetLevelHistory } from "@/api/levelHistory";
import { onMounted, ref } from "vue";
const history = ref([]);

const loadHistory = async () => {
  const userId = sessionStorage.getItem("tetrisUserId");
  history.value = await useGetLevelHistory(userId);
  console.log("История пользователя", history.value);
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped></style>
