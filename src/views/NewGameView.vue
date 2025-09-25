<template>
  <!-- Основной контент -->
  <v-main class="pt-12">
    <v-container>
      <v-card class="d-flex flex-column align-center">
        <v-card-title class="text-h4"> Новая игра </v-card-title>
        <v-card-text class="d-flex ga-4">
          <v-btn to="/tetris" class="gradient"> Новая игра </v-btn>
        </v-card-text>
        <LevelSeletion />
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue";
import LevelSeletion from "@/components/LevelSeletion.vue";

const selectLevel = ref(false);
</script>
