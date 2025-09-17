<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-disabled': disabled,
        'btn-pressed': isPressed,
      },
    ]"
    :disabled="disabled"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
    @touchstart="isPressed = true"
    @touchend="isPressed = false"
    @touchcancel="isPressed = false"
    @click="$emit('click', $event)">
    <span class="btn-content">
      <slot></slot>
    </span>
    <span class="btn-shadow"></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isPressed = ref(false);

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "accent" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
  }
);

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: transparent;
  padding: 0;
  overflow: hidden;
}

.btn-content {
  position: relative;
  z-index: 2;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.btn-shadow {
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  bottom: -4px;
  border-radius: 12px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.btn-primary .btn-content {
  background: linear-gradient(145deg, #06020d, #1a1625);
  color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.btn-primary .btn-content::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 215, 0, 0.1),
    rgba(255, 215, 0, 0.05),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.btn-primary:hover .btn-content::before {
  opacity: 1;
  animation: shimmer 1.5s infinite;
}

.btn-primary .btn-shadow {
  background: linear-gradient(145deg, #020102, #06020d);
  opacity: 0.9;
  filter: blur(4px);
}

.btn-secondary .btn-content {
  background: linear-gradient(145deg, #1a1625, #0f0c18);
  color: #c0a86d;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(192, 168, 109, 0.1);
  border: 1px solid rgba(192, 168, 109, 0.2);
  backdrop-filter: blur(8px);
}

.btn-secondary .btn-shadow {
  background: linear-gradient(145deg, #0f0c18, #06020d);
  opacity: 0.8;
}

.btn-accent .btn-content {
  background: linear-gradient(145deg, #2a2438, #1e1a2e);
  color: #d4af37;
  box-shadow: 0 4px 14px rgba(42, 36, 56, 0.4),
    inset 0 1px 1px rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.25);
  backdrop-filter: blur(8px);
}

.btn-accent .btn-shadow {
  background: linear-gradient(145deg, #1e1a2e, #161225);
  opacity: 0.8;
}

.btn-ghost .btn-content {
  background: rgba(6, 2, 13, 0.3);
  color: var(--color-primary);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-ghost .btn-shadow {
  background: rgba(2, 1, 2, 0.4);
}

/* 细沙颗粒感效果 */
.btn-primary .btn-content::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(255, 215, 0, 0.03) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 60% 70%,
      rgba(255, 215, 0, 0.02) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 40% 20%,
      rgba(255, 215, 0, 0.01) 1px,
      transparent 1px
    );
  background-size: 30px 30px;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

.btn-sm .btn-content {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-md .btn-content {
  padding: 12px 24px;
  font-size: 1rem;
}

.btn-lg .btn-content {
  padding: 16px 32px;
  font-size: 1.125rem;
}

.btn-pressed .btn-content {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-pressed .btn-shadow {
  transform: translateY(-2px);
  opacity: 0.6;
}

.btn:hover:not(.btn-disabled) .btn-content {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.btn:focus {
  outline: none;
}

.btn:focus-visible .btn-content {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-disabled .btn-content {
  transform: none !important;
  box-shadow: none !important;
}
</style>
