<template>
  <div
    :class="[
      'card',
      {
        'card-hover': hover,
        'card-pressed': isPressed,
      },
    ]"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
    @touchstart="isPressed = true"
    @touchend="isPressed = false"
    @touchcancel="isPressed = false">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
    <div class="card-shadow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isPressed = ref(false);

withDefaults(
  defineProps<{
    hover?: boolean;
  }>(),
  {
    hover: true,
  }
);
</script>

<style scoped>
.card {
  position: relative;
  background: linear-gradient(145deg, #14141f, #3d3c3c);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.137);
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.card-shadow {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  bottom: -8px;
  background: linear-gradient(145deg, #00000000, #020617);
  border-radius: 16px;
  opacity: 0.6;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.card-hover:hover .card-shadow {
  transform: translateY(3px);
  opacity: 0.8;
}

.card-pressed {
  transform: translateY(2px) !important;
}

.card-pressed .card-shadow {
  transform: translateY(-2px) !important;
  opacity: 0.4 !important;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.card-header:first-child {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.card-body {
  padding: 24px;
}

.card-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.card-footer:last-child {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
</style>
