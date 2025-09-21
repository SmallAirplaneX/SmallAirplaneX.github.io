<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// 文件上传相关逻辑
const fileInput = ref(null);
const selectedFile = ref(null);
const uploadStatus = ref("");
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadedParts = ref([]);
const currentUploadId = ref("");
const downloadFileName = ref("");
const downloadStatus = ref("");
const route = useRoute();
const fileList = ref([]);
const isLoadingFiles = ref(false);
const downloadLinks = ref([]); // 存储生成的下载链接
const copyStatus = ref(""); // 复制状态提示
const uploadedChunksCount = ref(0); // 已上传分片计数

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
  const CHUNK_SIZE = 10 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  if (totalChunks === 1) {
    await uploadSingleFile(file, fileName);
    return;
  }

  try {
    isUploading.value = true;
    uploadStatus.value = `开始多部分上传，共 ${totalChunks} 个分片...`;
    uploadProgress.value = 0;

    const createRes = await fetch(
      `https://r2.buzhidao.net/${fileName}?action=mpu-create`,
      { method: "POST" }
    );
    if (!createRes.ok) {
      throw new Error(`创建上传会话失败: ${createRes.status}`);
    }
    const { uploadId } = await createRes.json();
    currentUploadId.value = uploadId;

    const parts = [];
    const MAX_CONCURRENT_UPLOADS = 20; // 最大并发上传数

    // 创建所有需要上传的分片任务
    const uploadTasks = [];
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const existingPart = uploadedParts.value.find(
        (p) => p.partNumber === chunkIndex + 1
      );
      if (existingPart) {
        parts.push(existingPart);
        uploadedChunksCount.value++;
        continue;
      }

      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const partNumber = chunkIndex + 1;

      uploadTasks.push({ partNumber, chunk });
    }

    // 使用更高效的并发控制：同时发起多个请求，完成一个就立即开始新的
    const activeUploads = new Set();
    const pendingTasks = [...uploadTasks];

    const processUploads = () => {
      return new Promise((resolve, reject) => {
        let completed = 0;
        let hasError = false;

        const processNext = async () => {
          // 如果所有任务都完成或有错误，则返回
          if (hasError || completed === uploadTasks.length) {
            if (completed === uploadTasks.length) {
              resolve();
            }
            return;
          }

          // 如果还有待处理任务且并发数未满，开始新的上传
          while (
            pendingTasks.length > 0 &&
            activeUploads.size < MAX_CONCURRENT_UPLOADS &&
            !hasError
          ) {
            if (!isUploading.value) {
              reject(new Error("上传已取消"));
              return;
            }

            const task = pendingTasks.shift();
            const { partNumber, chunk } = task;

            activeUploads.add(partNumber);

            const uploadPart = async () => {
              try {
                uploadStatus.value = `上传分片 ${partNumber}/${totalChunks}...`;

                const partRes = await fetch(
                  `https://r2.buzhidao.net/${fileName}?action=mpu-uploadpart&uploadId=${uploadId}&partNumber=${partNumber}`,
                  {
                    method: "PUT",
                    body: chunk,
                    headers: { "Content-Type": "application/octet-stream" },
                  }
                );
                if (!partRes.ok) {
                  throw new Error(
                    `上传分片 ${partNumber} 失败: ${partRes.status}`
                  );
                }
                const uploadedPart = await partRes.json();
                parts.push(uploadedPart);
                uploadedParts.value.push(uploadedPart);

                // 更新进度
                uploadedChunksCount.value++;
                uploadProgress.value = Math.round(
                  (uploadedChunksCount.value / totalChunks) * 100
                );
                uploadStatus.value = `上传进度: ${uploadProgress.value}% (${uploadedChunksCount.value}/${totalChunks})`;

                return uploadedPart;
              } catch (error) {
                hasError = true;
                reject(
                  new Error(`分片 ${partNumber} 上传失败: ${error.message}`)
                );
                return null;
              } finally {
                activeUploads.delete(partNumber);
                completed++;

                // 立即开始处理下一个任务
                processNext();
              }
            };

            uploadPart();
          }
        };

        // 启动初始并发任务
        for (
          let i = 0;
          i < Math.min(MAX_CONCURRENT_UPLOADS, pendingTasks.length);
          i++
        ) {
          processNext();
        }
      });
    };

    // 执行并发上传
    await processUploads();

    const completeRes = await fetch(
      `https://r2.buzhidao.net/${fileName}?action=mpu-complete&uploadId=${uploadId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parts,
          contentType: file.type || "application/octet-stream", // 添加 contentType
        }),
      }
    );
    if (!completeRes.ok) {
      throw new Error(`完成上传失败: ${completeRes.status}`);
    }
    const result = await completeRes.json();
    uploadStatus.value = "多部分上传完成！";
    uploadProgress.value = 100;

    // 生成下载链接
    const downloadUrl = `https://r2.buzhidao.net/${fileName}?download=true`;
    downloadLinks.value.unshift({
      filename: file.name,
      url: downloadUrl,
      timestamp: new Date(),
      contentType: result.contentType,
    });

    selectedFile.value = null;
    fileInput.value.value = "";
    uploadedParts.value = [];
    currentUploadId.value = "";
  } catch (error) {
    uploadStatus.value = `上传错误: ${error.message}`;
    uploadProgress.value = 0;
  } finally {
    isUploading.value = false;
  }
};

// 上传单个文件
const uploadSingleFile = async (file, fileName) => {
  const url = `https://r2.buzhidao.net/${fileName}`;

  isUploading.value = true;
  uploadStatus.value = "开始上传小文件...";
  uploadProgress.value = 0;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100);
        uploadStatus.value = `上传进度: ${uploadProgress.value}%`;
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        uploadStatus.value = "上传成功！";
        uploadProgress.value = 100;
        // 生成下载链接 (不变)
        selectedFile.value = null;
        fileInput.value.value = "";
        resolve();
      } else {
        uploadStatus.value = `上传失败: ${xhr.status} ${xhr.statusText}`;
        uploadProgress.value = 0;
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = () => {
      uploadStatus.value = `上传错误: 网络问题`;
      uploadProgress.value = 0;
      reject(new Error("Network error"));
    };

    xhr.send(file);
  }).finally(() => {
    isUploading.value = false;
  });
};

const triggerDownload = (url, fileName) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName; // 设置下载文件名
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 下载文件
const downloadFile = async () => {
  if (!downloadFileName.value) {
    downloadStatus.value = "请输入要下载的文件名";
    return;
  }

  try {
    downloadStatus.value = "准备下载...";
    const fileName = encodeURIComponent(downloadFileName.value);
    const downloadUrl = `https://r2.buzhidao.net/${fileName}?download=true`;

    triggerDownload(downloadUrl, downloadFileName.value); // 使用 triggerDownload
    downloadStatus.value = "下载已开始！";

    setTimeout(() => {
      downloadStatus.value = "";
    }, 3000);
  } catch (error) {
    downloadStatus.value = `下载错误: ${error.message}`;
  }
};

// 根据文件名下载文件
const downloadFileFromName = async (fileName) => {
  try {
    downloadStatus.value = "准备下载...";
    const encodedFileName = encodeURIComponent(fileName);
    const downloadUrl = `https://r2.buzhidao.net/${encodedFileName}?download=true`;

    triggerDownload(downloadUrl, fileName); // 使用 triggerDownload
    downloadStatus.value = "下载已开始！";

    setTimeout(() => {
      downloadStatus.value = "";
    }, 3000);
  } catch (error) {
    downloadStatus.value = `下载错误: ${error.message}`;
  }
};

// 取消上传
const cancelUpload = async () => {
  await abortMultipartUpload();
  isUploading.value = false;
  uploadStatus.value = "上传已取消";
  uploadProgress.value = 0;
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatContentType = (contentType) => {
  if (!contentType) return "--";
  const typeMap = {
    "image/png": "PNG Image",
    "image/jpeg": "JPEG Image",
    "application/pdf": "PDF Document",
    "text/plain": "Text File",
    "application/octet-stream": "Binary File",
    // 添加更多类型映射
  };
  return typeMap[contentType] || contentType.split("/").pop().toUpperCase();
};

// 格式化时间显示
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 获取文件列表
const fetchFileList = async (cursor = null) => {
  try {
    isLoadingFiles.value = true;
    let url = "https://r2.buzhidao.net/?action=list";
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }
    const response = await fetch(url);
    // ... (其余不变)
    const data = await response.json();
    fileList.value = [...fileList.value, ...(data.files || [])]; // 追加分页
    if (data.truncated && data.cursor) {
      // 可以递归或添加“加载更多”按钮调用 fetchFileList(data.cursor)
    }
  } catch (error) {
    console.error("获取文件列表错误:", error);
    downloadStatus.value = "网络错误，无法获取文件列表";
  } finally {
    isLoadingFiles.value = false;
  }
};

// 通过路由参数自动下载文件
const autoDownloadFromUrl = () => {
  const downloadFile = route.query.download?.toString();

  if (downloadFile) {
    downloadFileName.value = downloadFile;
    setTimeout(() => {
      downloadFileFromName(downloadFile);
    }, 100);
  }
};

// 复制下载链接到剪贴板
const copyDownloadLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    copyStatus.value = "链接已复制到剪贴板！";
    setTimeout(() => {
      copyStatus.value = "";
    }, 2000);
  } catch (error) {
    copyStatus.value = "复制失败，请手动复制链接";
    setTimeout(() => {
      copyStatus.value = "";
    }, 2000);
  }
};

// 中止多部分上传
const abortMultipartUpload = async () => {
  if (!selectedFile.value || !currentUploadId.value) {
    uploadStatus.value = "没有正在进行的上传或缺少 uploadId";
    return;
  }

  try {
    isUploading.value = false; // 停止上传状态
    uploadStatus.value = "正在中止上传...";
    uploadProgress.value = 0;

    const fileName = encodeURIComponent(selectedFile.value.name);
    const response = await fetch(
      `https://r2.buzhidao.net/${fileName}?action=mpu-abort&uploadId=${currentUploadId.value}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`中止上传失败: ${response.status}`);
    }

    const data = await response.json();
    uploadStatus.value = data.message || "上传已中止！";
    selectedFile.value = null;
    fileInput.value.value = "";
    uploadedParts.value = [];
    currentUploadId.value = "";
    uploadedChunksCount.value = 0;
  } catch (error) {
    uploadStatus.value = `中止上传错误: ${error.message}`;
  }
};

// 组件挂载时检查 URL 参数并获取文件列表
onMounted(() => {
  autoDownloadFromUrl();
  fetchFileList();
});
</script>

<template>
  <div class="file-manager">
    <h2>文件上传下载管理器</h2>

    <!-- 文件上传区域 -->
    <div class="upload-section">
      <h3>文件上传</h3>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileSelect" />
      <button @click="openFileDialog" class="btn btn-primary">选择文件</button>
      <button
        @click="uploadFile"
        class="btn btn-primary"
        :disabled="!selectedFile || isUploading">
        上传文件
      </button>
      <button v-if="isUploading" @click="cancelUpload" class="btn btn-danger">
        取消上传
      </button>

      <div class="upload-status">{{ uploadStatus }}</div>

      <!-- 进度条 -->
      <div v-if="isUploading" class="progress-container">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <div class="progress-text">{{ uploadProgress }}%</div>
      </div>

      <div v-if="selectedFile" class="file-info">
        文件名: {{ selectedFile.name }}<br />
        大小: {{ formatFileSize(selectedFile.size) }}

        <!-- 下载链接列表 -->
        <div v-if="downloadLinks.length > 0" class="download-links-section">
          <h4>最近上传的文件链接</h4>
          <div class="copy-status">{{ copyStatus }}</div>
          <ul class="download-links-list">
            <li
              v-for="(link, index) in downloadLinks"
              :key="index"
              class="download-link-item">
              <div class="link-info">
                <span class="link-filename">{{ link.filename }}</span>
                <span class="link-url">{{ link.url }}</span>
                <span class="link-time">{{ formatTime(link.timestamp) }}</span>
              </div>
              <button
                @click="copyDownloadLink(link.url)"
                class="btn btn-small btn-secondary">
                复制链接
              </button>
            </li>
          </ul>
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
          class="input-field" />
        <button @click="downloadFile" class="btn btn-primary">下载文件</button>
      </div>
      <div class="download-status">{{ downloadStatus }}</div>

      <!-- 文件列表 -->
      <div class="file-list-section">
        <h4>可下载文件列表</h4>
        <div v-if="isLoadingFiles" class="loading-text">
          正在加载文件列表...
        </div>
        <div v-else-if="fileList.length === 0" class="empty-text">暂无文件</div>
        <ul v-else class="file-list">
          <li v-for="file in fileList" :key="file.key" class="file-item">
            <span class="file-name">{{ decodeURIComponent(file.key) }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <span class="file-type">{{
              formatContentType(file.contentType)
            }}</span>
            <!-- 添加类型显示 -->
            <button
              @click="downloadFileFromName(decodeURIComponent(file.key))"
              class="btn btn-small">
              下载
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3,
h4 {
  color: #333;
  margin-bottom: 15px;
}

.upload-section,
.download-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-status,
.download-status {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.progress-container {
  margin: 15px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.file-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
}

.download-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.file-list-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.loading-text,
.empty-text {
  color: #6c757d;
  font-style: italic;
  margin: 10px 0;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  flex: 1;
  color: #333;
  font-weight: 500;
  word-break: break-all;
}

.file-size {
  color: #6c757d;
  font-size: 12px;
  margin: 0 10px;
  white-space: nowrap;
}
.file-type {
  color: #6c757d;
  font-size: 12px;
  margin: 0 10px;
  white-space: nowrap;
  max-width: 150px; /* 防止长类型溢出 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap; /* 防止内容溢出 */
}
</style>
