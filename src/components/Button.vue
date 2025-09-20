<template>
  <button @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style scoped>
.btn {
  border: none;
  display: flex;
  border: none;
  cursor: pointer;
  overflow: hidden;
  font-weight: 600;
  color: var(--text);
  border-radius: 12px;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  background: var(--background);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
