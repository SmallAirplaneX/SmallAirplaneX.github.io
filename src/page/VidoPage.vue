<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import DPlayer from "dplayer";

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
    url: "https://r2.buzhidao.net/01.ts?download=true",
    title: "第01集",
    type: "video/mp2t",
  },
  {
    id: 2,
    url: "https://r2.buzhidao.net/02.ts?download=true",
    title: "第02集",
    type: "video/mp2t",
  },
  {
    id: 3,
    url: "https://r2.buzhidao.net/03.ts?download=true",
    title: "第03集",
    type: "video/mp2t",
  },
  {
    id: 4,
    url: "https://r2.buzhidao.net/04.ts?download=true",
    title: "第04集",
    type: "video/mp2t",
  },
  {
    id: 5,
    url: "https://r2.buzhidao.net/05.ts?download=true",
    title: "第05集",
    type: "video/mp2t",
  },
  {
    id: 6,
    url: "https://r2.buzhidao.net/06.ts?download=true",
    title: "第06集",
    type: "video/mp2t",
  },
  {
    id: 7,
    url: "https://r2.buzhidao.net/07.ts?download=true",
    title: "第07集",
    type: "video/mp2t",
  },
  {
    id: 8,
    url: "https://r2.buzhidao.net/08.ts?download=true",
    title: "第08集",
    type: "video/mp2t",
  },
  {
    id: 9,
    url: "https://r2.buzhidao.net/09.ts?download=true",
    title: "第09集",
    type: "video/mp2t",
  },
  {
    id: 10,
    url: "https://r2.buzhidao.net/10.ts?download=true",
    title: "第10集",
    type: "video/mp2t",
  },
  {
    id: 11,
    url: "https://r2.buzhidao.net/11.ts?download=true",
    title: "第11集",
    type: "video/mp2t",
  },
  {
    id: 12,
    url: "https://r2.buzhidao.net/12.ts?download=true",
    title: "第12集",
    type: "video/mp2t",
  },
  {
    id: 13,
    url: "https://r2.buzhidao.net/13.ts?download=true",
    title: "第13集",
    type: "video/mp2t",
  },
  {
    id: 14,
    url: "https://r2.buzhidao.net/14.ts?download=true",
    title: "第14集",
    type: "video/mp2t",
  },
  {
    id: 15,
    url: "https://r2.buzhidao.net/15.ts?download=true",
    title: "第15集",
    type: "video/mp2t",
  },
  {
    id: 16,
    url: "https://r2.buzhidao.net/16.ts?download=true",
    title: "第16集",
    type: "video/mp2t",
  },
  {
    id: 17,
    url: "https://r2.buzhidao.net/17.ts?download=true",
    title: "第17集",
    type: "video/mp2t",
  },
  {
    id: 18,
    url: "https://r2.buzhidao.net/18.ts?download=true",
    title: "第18集",
    type: "video/mp2t",
  },
  {
    id: 19,
    url: "https://r2.buzhidao.net/19.ts?download=true",
    title: "第19集",
    type: "video/mp2t",
  },
  {
    id: 20,
    url: "https://r2.buzhidao.net/20.ts?download=true",
    title: "第20集",
    type: "video/mp2t",
  },
  {
    id: 21,
    url: "https://r2.buzhidao.net/21.ts?download=true",
    title: "第21集",
    type: "video/mp2t",
  },
  {
    id: 22,
    url: "https://r2.buzhidao.net/22.ts?download=true",
    title: "第22集",
    type: "video/mp2t",
  },
  {
    id: 23,
    url: "https://r2.buzhidao.net/23.ts?download=true",
    title: "第23集",
    type: "video/mp2t",
  },
  {
    id: 24,
    url: "https://r2.buzhidao.net/24.ts?download=true",
    title: "第24集",
    type: "video/mp2t",
  },
];

const currentVideo = ref(
  episodes[0] || {
    id: 1,
    url: "https://r2.buzhidao.net/1.ts?download=true",
    title: "第01集",
    type: "video/mp2t",
  }
);
const showError = ref(false);
const dp = ref<DPlayer | null>(null);
const playerContainer = ref<HTMLDivElement>();

const playEpisode = (episode: Episode) => {
  console.log("切换视频:", episode.title, "URL:", episode.url);
  currentVideo.value = episode;
  showError.value = false;

  // 销毁旧的播放器实例
  if (dp.value) {
    dp.value.destroy();
    dp.value = null;
  }

  // 创建新的播放器实例
  nextTick(() => {
    initPlayer();
  });
};

const initPlayer = () => {
  if (!playerContainer.value) return;

  try {
    dp.value = new DPlayer({
      container: playerContainer.value,
      video: {
        url: currentVideo.value.url,
        type: "hls",
      },
      autoplay: false,
      theme: "#b7daff",
      loop: false,
      lang: "zh-cn",
      screenshot: false,
      hotkey: true,
      preload: "auto",
      volume: 0.7,
      mutex: true,
      contextmenu: [
        {
          text: "哔哩哔哩播放器",
          link: "https://github.com/DIYgod/DPlayer",
        },
      ],
    });

    dp.value.on("loadstart", () => {
      console.log("开始加载视频:", currentVideo.value.url);
    });

    dp.value.on("canplay", () => {
      console.log("视频可以播放:", currentVideo.value.title);
      showError.value = false;
    });

    dp.value.on("error", (e: any) => {
      console.error("视频加载错误:", e);
      showError.value = true;
    });

    dp.value.on("loadeddata", () => {
      console.log("视频加载完成:", currentVideo.value.title);
    });
  } catch (error) {
    console.error("播放器初始化失败:", error);
    showError.value = true;
  }
};

onMounted(() => {
  nextTick(() => {
    initPlayer();
  });
});

onUnmounted(() => {
  if (dp.value) {
    dp.value.destroy();
  }
});
</script>

<template>
  <div class="node-page">
    <h1 class="text-3xl font-bold text-center mb-6">《成何体统》在线观看</h1>
    <div class="editor-container">
      <div ref="playerContainer" class="dplayer-container mx-auto"></div>
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

.dplayer-container {
  width: 800px;
  height: 450px;
}
</style>
