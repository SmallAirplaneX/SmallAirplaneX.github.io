<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

// 视频数据接口
interface Episode {
  id: number;
  url: string;
  title: string;
  type: string;
}

// 视频列表
const episodes: Episode[] = [
  {
    id: 1,
    url: "https://r4.buzhidao.net/01.mp4",
    title: "第01集",
    type: "video/mp4",
  },
  {
    id: 2,
    url: "https://r4.buzhidao.net/02.mp4",
    title: "第02集",
    type: "video/mp4",
  },
  {
    id: 3,
    url: "https://r4.buzhidao.net/03.mp4",
    title: "第03集",
    type: "video/mp4",
  },
  {
    id: 4,
    url: "https://r4.buzhidao.net/04.mp4",
    title: "第04集",
    type: "video/mp4",
  },
  {
    id: 5,
    url: "https://r4.buzhidao.net/05.mp4",
    title: "第05集",
    type: "video/mp4",
  },
  {
    id: 6,
    url: "https://r4.buzhidao.net/06.mp4",
    title: "第06集",
    type: "video/mp4",
  },
  {
    id: 7,
    url: "https://r4.buzhidao.net/07.mp4",
    title: "第07集",
    type: "video/mp4",
  },
  {
    id: 8,
    url: "https://r4.buzhidao.net/08.mp4",
    title: "第08集",
    type: "video/mp4",
  },
  {
    id: 9,
    url: "https://r4.buzhidao.net/09.mp4",
    title: "第09集",
    type: "video/mp4",
  },
  {
    id: 10,
    url: "https://r4.buzhidao.net/10.mp4",
    title: "第10集",
    type: "video/mp4",
  },
  {
    id: 11,
    url: "https://r4.buzhidao.net/11.mp4",
    title: "第11集",
    type: "video/mp4",
  },
  {
    id: 12,
    url: "https://r4.buzhidao.net/12.mp4",
    title: "第12集",
    type: "video/mp4",
  },
  {
    id: 13,
    url: "https://r4.buzhidao.net/13.mp4",
    title: "第13集",
    type: "video/mp4",
  },
  {
    id: 14,
    url: "https://r4.buzhidao.net/14.mp4",
    title: "第14集",
    type: "video/mp4",
  },
  {
    id: 15,
    url: "https://r4.buzhidao.net/15.mp4",
    title: "第15集",
    type: "video/mp4",
  },
  {
    id: 16,
    url: "https://r4.buzhidao.net/16.mp4",
    title: "第16集",
    type: "video/mp4",
  },
  {
    id: 17,
    url: "https://r4.buzhidao.net/17.mp4",
    title: "第17集",
    type: "video/mp4",
  },
  {
    id: 18,
    url: "https://r4.buzhidao.net/18.mp4",
    title: "第18集",
    type: "video/mp4",
  },
  {
    id: 19,
    url: "https://r4.buzhidao.net/19.mp4",
    title: "第19集",
    type: "video/mp4",
  },
  {
    id: 20,
    url: "https://r4.buzhidao.net/20.mp4",
    title: "第20集",
    type: "video/mp4",
  },
  {
    id: 21,
    url: "https://r4.buzhidao.net/21.mp4",
    title: "第21集",
    type: "video/mp4",
  },
  {
    id: 22,
    url: "https://r4.buzhidao.net/22.mp4",
    title: "第22集",
    type: "video/mp4",
  },
  {
    id: 23,
    url: "https://r4.buzhidao.net/23.mp4",
    title: "第23集",
    type: "video/mp4",
  },
  {
    id: 24,
    url: "https://r4.buzhidao.net/24.mp4",
    title: "第24集",
    type: "video/mp4",
  },
];

const currentVideo = ref(
  episodes[0] || {
    id: 1,
    url: "https://r4.buzhidao.net/1.mp4",
    title: "第01集",
    type: "video/mp4",
  }
);
const showError = ref(false);
const videoRef = ref<HTMLVideoElement>();

const playEpisode = (episode: Episode) => {
  console.log("切换视频:", episode.title, "URL:", episode.url);
  currentVideo.value = episode;
  showError.value = false;

  // 使用原生视频播放器，无需额外初始化
  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.load();
    }
  });
};

const handleVideoError = () => {
  console.error("视频加载错误:", currentVideo.value.url);
  showError.value = true;
};

const handleVideoCanPlay = () => {
  console.log("视频可以播放:", currentVideo.value.title);
  showError.value = false;
};

const handleVideoLoadedData = () => {
  console.log("视频加载完成:", currentVideo.value.title);
};

onMounted(() => {
  // 原生视频播放器无需额外初始化
});
</script>

<template>
  <div class="node-page">
    <h1 class="text-3xl font-bold text-center mb-6">《成何体统》在线观看</h1>
    <div class="editor-container">
      <div class="video-container mx-auto">
        <video
          ref="videoRef"
          :src="currentVideo.url"
          controls
          preload="auto"
          class="w-full h-full"
          @error="handleVideoError"
          @canplay="handleVideoCanPlay"
          @loadeddata="handleVideoLoadedData">
          您的浏览器不支持 HTML5 视频播放。
        </video>
      </div>
      <div v-if="showError" class="text-red-500 mt-2 text-center">
        无法加载视频，请选择其他集数或检查网络。
      </div>
    </div>
    <div class="editor-container">
      <h2 class="text-xl font-semibold mb-4">选择集数</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        <button
          v-for="episode in episodes"
          :key="episode.id"
          @click="playEpisode(episode)"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          {{ episode.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
}

.editor-container {
  width: 100%;
  max-width: 1000px;
  padding: 16px;
}

.video-container {
  width: 800px;
  height: 450px;
  background-color: #000;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
