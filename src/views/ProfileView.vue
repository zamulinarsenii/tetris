<template>
  <v-container class="mt-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title> Профиль пользователя </v-card-title>
          <v-card-text>
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Логин</v-list-item-title>
                  <v-list-item-subtitle>{{ user.login }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Дата регистрации</v-list-item-title>
                  <v-list-item-subtitle>{{
                    user.registeredAt
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- любая другая информация -->
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text to="/menu">На главную</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "@/js/useAuth.js";

const { users } = useAuth();

const currentUser = sessionStorage.getItem("tetrisUser");

// Ищем объект пользователя по логину
const user = computed(() => {
  return users.value.find((u) => u.login === currentUser) || {};
});
console.log(user.value);
</script>

<style scoped>
.v-list-item {
  margin-bottom: 1rem;
}
</style>
