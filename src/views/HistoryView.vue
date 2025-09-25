<template>
  <v-container>
    <v-card>
      <v-card-title>Моя история</v-card-title>
    </v-card>
  </v-container>
</template>

<script setup>
import { useGetLevelHistory } from "@/api/levelHistory";

const loadHistory = async () => {
  const userId = sessionStorage.getItem("tetrisUserId");
  const history = await useGetLevelHistory(userId);
  console.log("История пользователя", history);
};
loadHistory();
</script>

<style scoped></style>
