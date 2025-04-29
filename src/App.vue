<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.gradient {
  color: white !important;
  border: 2px solid white;
}
.gradient.left-to-right {
  background: linear-gradient(90deg, #f52285, #fabdd9) !important;
}
.gradient.top-to-bottom {
  background: linear-gradient(180deg, #f52285, #fabdd9) !important;
}
</style>
