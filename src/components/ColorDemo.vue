<script setup>
import { ref, onMounted, inject } from "vue";
import { applyTheme, saveTheme, loadTheme } from "@/theme";

const themes = inject("themes");
const setTheme = inject("setTheme");

// 文件上传相关逻辑
const fileInput = ref(null);
const selectedFile = ref(null);
const uploadStatus = ref("");
const downloadFileName = ref("");
const downloadStatus = ref("");

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

// 分片上传文件
const uploadFile = async () => {
  if (!selectedFile.value) {
    uploadStatus.value = "请先选择文件";
    return;
  }

  const file = selectedFile.value;
  const fileName = encodeURIComponent(file.name);
  const CHUNK_SIZE = 100 * 1024 * 1024; // 300MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  if (totalChunks === 1) {
    // 文件小于300MB，直接上传
    uploadSingleFile(file, fileName);
    return;
  }

  // 分片上传
  try {
    uploadStatus.value = `开始分片上传，共 ${totalChunks} 个分片...`;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const chunkName = `${fileName}.part${chunkIndex + 1}`;

      uploadStatus.value = `上传分片 ${chunkIndex + 1}/${totalChunks}...`;

      await uploadChunk(chunk, chunkName);

      // 添加短暂延迟，避免请求过于频繁
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    uploadStatus.value = "所有分片上传完成！";
    selectedFile.value = null;
    fileInput.value.value = "";
  } catch (error) {
    uploadStatus.value = `分片上传错误: ${error.message}`;
  }
};

// 上传单个分片
const uploadChunk = (chunk, chunkName) => {
  return new Promise((resolve, reject) => {
    const url = `https://r2.buzhidao.net/${chunkName}`;
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`分片上传失败: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("网络错误，分片上传失败"));
    };

    xhr.send(chunk);
  });
};

// 上传单个文件（小于300MB）
const uploadSingleFile = (file, fileName) => {
  const url = `https://r2.buzhidao.net/${fileName}`;
  const xhr = new XMLHttpRequest();

  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", file.type);

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

  xhr.send(file);
};

// 下载文件（检测并合并分片）
const downloadFile = async () => {
  if (!downloadFileName.value) {
    downloadStatus.value = "请输入要下载的文件名";
    return;
  }

  try {
    downloadStatus.value = "检测分片文件...";
    const fileName = encodeURIComponent(downloadFileName.value);

    // 首先尝试下载完整文件
    try {
      const fullFileUrl = `https://r2.buzhidao.net/${fileName}`;
      const response = await fetch(fullFileUrl, { method: "GET" });

      if (response.ok) {
        // 完整文件存在，直接使用这个响应进行下载
        downloadStatus.value = "下载完整文件...";
        await downloadFromResponse(response, downloadFileName.value);
        return;
      }
    } catch (error) {
      // 完整文件不存在，继续检测分片
    }

    // 检测分片文件
    const chunks = [];
    let chunkIndex = 1;

    while (true) {
      const chunkName = `${fileName}.part${chunkIndex}`;
      const chunkUrl = `https://r2.buzhidao.net/${encodeURIComponent(
        chunkName
      )}`;

      try {
        const response = await fetch(chunkUrl, { method: "GET" });
        if (!response.ok) break;

        // 如果分片存在，保存分片索引并立即释放响应
        response
          .blob()
          .then((blob) => URL.revokeObjectURL(URL.createObjectURL(blob)));
        chunks.push(chunkIndex);
        chunkIndex++;
      } catch (error) {
        break;
      }
    }

    if (chunks.length === 0) {
      downloadStatus.value = "未找到文件或分片";
      return;
    }

    downloadStatus.value = `找到 ${chunks.length} 个分片，开始下载...`;

    // 下载所有分片
    const chunkBlobs = [];
    for (const chunkNum of chunks) {
      downloadStatus.value = `下载分片 ${chunkNum}/${chunks.length}...`;
      const chunkBlob = await downloadChunk(fileName, chunkNum);
      chunkBlobs.push(chunkBlob);
    }

    // 合并分片
    downloadStatus.value = "合并分片...";
    const fullBlob = new Blob(chunkBlobs);

    // 创建下载链接
    const url = URL.createObjectURL(fullBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName.value;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    downloadStatus.value = "下载完成！";
  } catch (error) {
    downloadStatus.value = `下载错误: ${error.message}`;
  }
};

// 下载单个分片
const downloadChunk = async (fileName, chunkNum) => {
  const chunkName = `${fileName}.part${chunkNum}`;
  const chunkUrl = `https://r2.buzhidao.net/${encodeURIComponent(chunkName)}`;

  const response = await fetch(chunkUrl);
  if (!response.ok) {
    throw new Error(`下载分片 ${chunkNum} 失败: ${response.status}`);
  }

  return await response.blob();
};

// 从响应对象下载文件
const downloadFromResponse = async (response, fileName) => {
  if (!response.ok) {
    throw new Error(`下载文件失败: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 下载单个完整文件
const downloadSingleFile = async (fileName) => {
  const fileUrl = `https://r2.buzhidao.net/${fileName}`;
  const response = await fetch(fileUrl);
  await downloadFromResponse(response, decodeURIComponent(fileName));
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
        大小: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
        <div v-if="Math.ceil(selectedFile.size / (300 * 1024 * 1024)) > 1">
          (将分成
          {{ Math.ceil(selectedFile.size / (300 * 1024 * 1024)) }} 个分片上传)
        </div>
      </div>
    </div>

    <!-- 文件下载区域 -->
    <div class="download-section">
      <h3>文件下载</h3>
      <div class="download-input">
        <input
          v-model="downloadFileName"
          type="text"
          placeholder="输入要下载的文件名"
          class="download-input-field" />
        <button @click="downloadFile" class="download-btn">下载文件</button>
      </div>
      <div class="download-status">{{ downloadStatus }}</div>
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

.download-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-background);
}

.download-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.download-input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--background);
  color: var(--foreground);
}

.download-btn {
  padding: 8px 16px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.download-status {
  margin: 10px 0;
  color: var(--muted-foreground);
  font-size: 14px;
}
</style>
