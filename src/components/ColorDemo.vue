<script setup>
import { ref, onMounted, inject } from "vue";
import { applyTheme, saveTheme, loadTheme } from "@/theme";

const themes = inject("themes");
const setTheme = inject("setTheme");

// 文件上传相关逻辑
const fileInput = ref(null);
const selectedFile = ref(null);
const uploadStatus = ref("");

// 打开文件选择对话框
const openFileDialog = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = `已选择文件: ${file.name}`;
  }
};

// 上传文件
const uploadFile = () => {
  if (!selectedFile.value) {
    uploadStatus.value = "请先选择文件";
    return;
  }

  try {
    uploadStatus.value = "上传中...";

    const fileName = encodeURIComponent(selectedFile.value.name);
    const url = `https://r2.buzhidao.net/${fileName}`;

    // 使用 XMLHttpRequest 来处理 PUT 请求，避免 CORS 预检问题
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", selectedFile.value.type);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        uploadStatus.value = "上传成功！";
        selectedFile.value = null;
        fileInput.value.value = "";
      } else {
        uploadStatus.value = `上传失败: ${xhr.status} ${xhr.statusText}`;
      }
    };

    xhr.onerror = function () {
      uploadStatus.value = "网络错误，上传失败";
    };

    xhr.send(selectedFile.value);
  } catch (error) {
    uploadStatus.value = `上传错误: ${error.message}`;
  }
};
</script>

<template>
  <div class="theme-demo">
    <h2>UI 颜色调色板</h2>
    <button v-for="theme in themes" :key="theme" @click="setTheme(theme)">
      {{ theme }}
    </button>

    <!-- 文件上传区域 -->
    <div class="upload-section">
      <h3>文件上传</h3>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileSelect" />
      <button @click="openFileDialog" class="upload-btn">选择文件</button>
      <button @click="uploadFile" class="upload-btn" :disabled="!selectedFile">
        上传文件
      </button>
      <div class="upload-status">{{ uploadStatus }}</div>
      <div v-if="selectedFile" class="file-info">
        文件名: {{ selectedFile.name }}<br />
        大小: {{ (selectedFile.size / 1024).toFixed(2) }} KB
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-demo {
  width: 100vh;
  height: 100vh;
  background-color: var(--background);
  padding: 20px;
}

.upload-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-background);
}

.upload-btn {
  margin: 10px 10px 10px 0;
  padding: 8px 16px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-status {
  margin: 10px 0;
  color: var(--muted-foreground);
  font-size: 14px;
}

.file-info {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--muted);
  border-radius: 4px;
  font-size: 14px;
  color: var(--muted-foreground);
}
</style>
