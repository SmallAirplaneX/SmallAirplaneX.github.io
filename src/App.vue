<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
</script>

<template>
  <h1>文本输入</h1>
  <input type="text" v-model="text" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
