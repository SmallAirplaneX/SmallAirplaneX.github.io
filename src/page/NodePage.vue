<script setup lang="ts">
import { ref } from "vue";
import ProseMirrorEditor from "@/components/ProseMirrorEditor.vue";

const pageTitle = ref("");
</script>

<template>
  <div class="node-page">
    <input v-model="pageTitle" placeholder="输入页面标题" class="title-input" />
    <div class="editor-container">
      <ProseMirrorEditor />
    </div>
  </div>
</template>

<style scoped>
.node-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.title-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

.title-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.editor-container {
  width: 100%;
  flex: 1;
  padding: 16px;
}
</style>
