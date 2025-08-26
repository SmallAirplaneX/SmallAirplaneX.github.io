<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
</script>

<template>
  <h1>文本输入</h1>
  <input type="text" v-model="text" />
</template>

<style scoped></style>
